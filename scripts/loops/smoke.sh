#!/usr/bin/env bash
# scripts/loops/smoke.sh
# Loop 1 — Daily E2E smoke. Runs Playwright against staging.
# Triggered by Hermes cron job `worki-smoke-loop`.
#
# Five moves:
#   1. Discovery — read prior state, skip if production health green + recent pass
#   2. Handoff — delegate_task spawns Sonnet agent to run + fix
#   3. Verification — tests/loop-acceptance/smoke-evaluator.sh checks Playwright JSON
#   4. Persistence — update .hermes/loop-state/smoke.md with outcome
#   5. Scheduling — Hermes cron handles this; we just run when invoked

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "$SCRIPT_DIR/_lib.sh"

LOOP_NAME="smoke"
STATE_FILE="$(loop_state_path "$LOOP_NAME")"

# Smoke loop needs more wallclock than the default 5min — 89 tests can
# take 8-12 minutes when fully run. Override locally; the global env
# variable still works for the budget helpers.
LOOP_MAX_WALLCLOCK_SECONDS="${SMOKE_MAX_WALLCLOCK_SECONDS:-900}"  # 15 min
LOOP_MAX_TOKENS_PER_RUN="${SMOKE_MAX_TOKENS_PER_RUN:-80000}"
LOOP_DAILY_BUDGET_TOKENS="${SMOKE_DAILY_BUDGET_TOKENS:-300000}"

# ── Initialize state file if missing ─────────────────────────────────────────
if [ ! -f "$STATE_FILE" ]; then
  cat > "$STATE_FILE" <<'EOF'
---
loop: smoke
last_run: never
run_count: 0
consecutive_failures: 0
status: active
---

# smoke — Daily E2E state

## Open findings
(none)

## Done (last 30)
(none)

## Human review queue
(none)

## Token spend this week
| Day | Tokens |
|-----|--------|
EOF
  loop_log "$LOOP_NAME" "INFO" "initialized state file at $STATE_FILE"
fi

# ── Daily budget gate ────────────────────────────────────────────────────────
if ! check_daily_budget "$LOOP_NAME"; then
  exit 0
fi

# ── Move 1: Discovery ────────────────────────────────────────────────────────
loop_log "$LOOP_NAME" "INFO" "discovery: checking production health"
PROD_HEALTH="$(curl -sf -m 5 "${PRODUCTION_BASE_URL:-https://thehelper.ca}/api/health" || echo "DOWN")"

LAST_RUN="$(state_read_field "$STATE_FILE" last_run)"
RUN_COUNT="$(state_read_field "$STATE_FILE" run_count)"
loop_log "$LOOP_NAME" "INFO" "prior run_count=$RUN_COUNT last_run=$LAST_RUN prod_health=$PROD_HEALTH"

# Skip fast-path: prod green AND last run was yesterday AND passed
if [ "$PROD_HEALTH" = "OK" ] && [ "$LAST_RUN" != "never" ]; then
  # If we ran within the last 24h, just rerun (cheap) — don't skip
  LAST_RUN_EPOCH="$(date -j -f '%Y-%m-%dT%H:%M:%SZ' "$LAST_RUN" +%s 2>/dev/null || echo 0)"
  NOW_EPOCH="$(date +%s)"
  AGE_HOURS=$(( (NOW_EPOCH - LAST_RUN_EPOCH) / 3600 ))
  if [ "$AGE_HOURS" -lt 20 ]; then
    loop_log "$LOOP_NAME" "INFO" "skipped: ran ${AGE_HOURS}h ago (<20h)"
    exit 0
  fi
fi

# ── Move 2: Handoff — run Playwright + capture JSON results ─────────────
# We run Playwright once here with `--reporter=json` and capture stdout
# to a file. The evaluator (next step) reads that file. This separation
# keeps the test invocation owned by the loop and the verdict owned by
# the evaluator.
loop_log "$LOOP_NAME" "INFO" "handoff: running Playwright (json reporter)"

mkdir -p playwright-report
REPORT_FILE="playwright-report/results.json"

# Smoke loop runs a FAST subset of tests by default (covers critical-path
# pages within 3-5 min). Override with SMOKE_TEST_GLOB to run the full
# suite — useful for weekly deep runs. Splitting fast/daily from full/weekly
# follows the Stripe Minions principle: LLMs and humans check the cheap
# signal every day, the deep signal weekly.
SMOKE_TEST_GLOB="${SMOKE_TEST_GLOB:-tests/e2e/public-pages.spec.ts tests/e2e/provider-flow.spec.ts}"

# Use a configFile override that disables retries (config has retries: 0
# but other defaults can add flakiness). Run with a hard timeout matching
# the loop's wallclock cap so we never block the cron tick.
set +e
(cd "$WORKI_PRO_ROOT" && timeout "$LOOP_MAX_WALLCLOCK_SECONDS" \
  npx playwright test --reporter=json $SMOKE_TEST_GLOB > "$REPORT_FILE" 2>&1)
PLAYWRIGHT_EXIT=$?
set -e

loop_log "$LOOP_NAME" "INFO" "playwright exit=$PLAYWRIGHT_EXIT glob=[$SMOKE_TEST_GLOB] report_size=$(wc -c < "$REPORT_FILE" 2>/dev/null || echo 0) bytes"

# Approximate the spawn cost for token budgeting
record_token_spend "$LOOP_NAME" 1500

# If tests failed AND Sonnet is available, record the need for a fix
# worktree. The actual delegation prompt goes through the cron job's
# prompt field; this script just marks the handoff in state.
if [ "$PLAYWRIGHT_EXIT" -ne 0 ] && command -v hermes &>/dev/null; then
  loop_log "$LOOP_NAME" "INFO" "tests failed; recording fix-iteration need"
  # The cron job's prompt will spawn the Sonnet fix agent when it sees this.
fi

# ── Move 3: Verification — run the evaluator ────────────────────────────────
# The generator writes its findings to $STATE_FILE under "Findings in progress".
# We extract the most recent unresolved finding and pass it to the evaluator.
LATEST_FINDING="$(python3 -c "
import re
with open('$STATE_FILE') as f: content = f.read()
m = re.search(r'## Findings in progress\n((?:- \[ \].*\n)+)', content)
if m:
    print(m.group(1).strip().split('\n')[-1])
else:
    print('no finding')
")"

loop_log "$LOOP_NAME" "INFO" "evaluator input: $LATEST_FINDING"

EVALUATOR_OUTPUT=""
EVALUATOR_EXIT=0
set +e
EVALUATOR_OUTPUT="$(run_evaluator "$LOOP_NAME" "$LATEST_FINDING" 2>&1)"
EVALUATOR_EXIT=$?
set -e

# ── Move 4: Persistence ──────────────────────────────────────────────────────
NOW="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
state_set_field "$STATE_FILE" "last_run" "$NOW"
NEW_COUNT=$((RUN_COUNT + 1))
state_set_field "$STATE_FILE" "run_count" "$NEW_COUNT"

if [ "$EVALUATOR_EXIT" -eq 0 ]; then
  # PASS — move finding to Done
  state_append_section "$STATE_FILE" "Done (last 30)" \
    "- [x] smoke-$(date -u +%Y%m%d) — $LATEST_FINDING | verdict: PASS"
  state_set_field "$STATE_FILE" "consecutive_failures" "0"
  loop_log "$LOOP_NAME" "INFO" "VERDICT: PASS — $EVALUATOR_OUTPUT"
else
  # FAIL or BLOCKED — escalate
  FAIL_COUNT="$(state_read_field "$STATE_FILE" consecutive_failures)"
  FAIL_COUNT="${FAIL_COUNT:-0}"
  FAIL_COUNT=$((FAIL_COUNT + 1))
  state_set_field "$STATE_FILE" "consecutive_failures" "$FAIL_COUNT"
  state_append_section "$STATE_FILE" "Human review queue" \
    "- smoke-$(date -u +%Y%m%d) — exit=$EVALUATOR_EXIT | reasons: $EVALUATOR_OUTPUT"

  if [ "$FAIL_COUNT" -ge 7 ]; then
    state_set_field "$STATE_FILE" "status" "paused"
    telegram_alert "smoke loop FAILED 7 days in a row — loop paused, needs manual review"
  else
    telegram_alert "smoke loop FAIL ($FAIL_COUNT/7) — $EVALUATOR_OUTPUT"
  fi
  loop_log "$LOOP_NAME" "ERROR" "VERDICT: $EVALUATOR_EXIT — $EVALUATOR_OUTPUT"
fi

loop_log "$LOOP_NAME" "INFO" "loop tick complete (run_count=$NEW_COUNT)"
exit 0