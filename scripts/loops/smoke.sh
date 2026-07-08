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

# ── Move 2: Handoff — delegate to a Sonnet sub-agent ────────────────────────
loop_log "$LOOP_NAME" "INFO" "handoff: spawning Sonnet generator"

FINDING_SUMMARY="Run E2E suite + propose fix for any failure. State file: $STATE_FILE"

# Use enforce_caps to wallclock-bound the spawn. The actual delegation
# happens via the cronjob's prompt — this script just records the result.
# When the agent finishes, it writes back to $STATE_FILE; we read it on
# the next tick. To keep this script self-contained, we also record a
# pending-action entry.
state_append_section "$STATE_FILE" "Findings in progress" \
  "- [ ] smoke-$(date -u +%Y%m%d-%H%M%S) — generator spawned, awaiting result | evaluator: pending"

# Approximate the spawn cost for token budgeting
record_token_spend "$LOOP_NAME" 1500

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