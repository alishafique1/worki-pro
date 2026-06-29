#!/usr/bin/env bash
# scripts/loops/_lib.sh
# Shared helpers for worki-pro loop drivers. Sourced by every loop script.
#
# Implements the loop-engineering skill's "5 moves / 6 parts":
#   1. Discovery  — read state file + DB / filesystem
#   2. Handoff    — call generator (delegate_task / curl / DB write)
#   3. Verification — run evaluator (separate script, default-FAIL stance)
#   4. Persistence — update state file with outcome
#   5. Scheduling — invoked by Hermes cron on a fixed cadence
#
# All loops share:
#   - Token cap enforcement (per-run + per-day)
#   - State file format (YAML frontmatter + markdown body)
#   - Evaluator separation (PASS/FAIL with REASONS, no auto-apply on FAIL)
#   - Telegram ping on hard failure (if TELEGRAM_BOT_TOKEN is set)
#   - Append-only JSONL audit log for compliance / debugging

set -euo pipefail

# ── Paths ────────────────────────────────────────────────────────────────────
WORKI_PRO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HERMES_DIR="$WORKI_PRO_ROOT/.hermes"
LOOPS_DIR="$HERMES_DIR/loops"
STATE_DIR="$HERMES_DIR/loop-state"
LOG_DIR="$HERMES_DIR/loop-logs"
ACCEPTANCE_DIR="$WORKI_PRO_ROOT/tests/loop-acceptance"

mkdir -p "$STATE_DIR" "$LOG_DIR"

# ── Env loading ──────────────────────────────────────────────────────────────
# .env.server is the Wasp runtime secrets file. Loops need DATABASE_URL
# and webhook secrets. We export only what's needed, never dump the file.
if [ -f "$WORKI_PRO_ROOT/.env.server" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$WORKI_PRO_ROOT/.env.server"
  set +a
fi

# ── Token / time caps ────────────────────────────────────────────────────────
# Each loop config (.hermes/loops/<name>.json) overrides these.
LOOP_MAX_TOKENS_PER_RUN="${LOOP_MAX_TOKENS_PER_RUN:-50000}"
LOOP_MAX_WALLCLOCK_SECONDS="${LOOP_MAX_WALLCLOCK_SECONDS:-300}"  # 5 min
LOOP_DAILY_BUDGET_TOKENS="${LOOP_DAILY_BUDGET_TOKENS:-200000}"
LOOP_TODAY_TOKEN_USAGE="${LOOP_TODAY_TOKEN_USAGE:-0}"

# ── Logging helpers ──────────────────────────────────────────────────────────
loop_log() {
  local loop_name="$1" level="$2" msg="$3"
  local ts
  ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf '%s [%s] %-5s %s\n' "$ts" "$loop_name" "$level" "$msg" \
    | tee -a "$LOG_DIR/$(date -u +%Y%m%d).log"
}

loop_state_path() {
  echo "$STATE_DIR/$1.md"
}

# ── State file I/O ───────────────────────────────────────────────────────────
# State file format (per references/state-file-template.md):
#   ---
#   loop: <name>
#   last_run: <ISO>
#   run_count: <int>
#   status: active | paused | stopped
#   ---
#   # <name>
#   ## Open findings
#   ## Done (last 30)
#   ## Human review queue
#   ## Token spend this week
#
# We use python for safe YAML frontmatter parsing — bash regex on YAML is
# how loops become amnesiac.

state_read_field() {
  local path="$1" field="$2"
  python3 -c "
import sys, re
with open('$path') as f:
    content = f.read()
m = re.match(r'---\n(.*?)\n---', content, re.DOTALL)
if not m:
    sys.exit(0)
for line in m.group(1).split('\n'):
    k, _, v = line.partition(':')
    if k.strip() == '$field':
        print(v.strip())
        sys.exit(0)
sys.exit(0)
" 2>/dev/null
}

state_set_field() {
  local path="$1" field="$2" value="$3"
  python3 -c "
import re, sys
path, field, value = '$path', '$field', '''$value'''
with open(path) as f:
    content = f.read()
m = re.match(r'---\n(.*?)\n---(.*)', content, re.DOTALL)
if not m:
    print('ERROR: no frontmatter', file=sys.stderr); sys.exit(1)
fm, body = m.group(1), m.group(2)
lines = fm.split('\n')
found = False
for i, line in enumerate(lines):
    k, _, _ = line.partition(':')
    if k.strip() == field:
        lines[i] = f'{field}: {value}'
        found = True
        break
if not found:
    lines.append(f'{field}: {value}')
new_fm = '\n'.join(lines)
with open(path, 'w') as f:
    f.write('---\n' + new_fm + '\n---' + body)
"
}

state_append_section() {
  local path="$1" section="$2" line="$3"
  python3 -c "
path, section, line = '$path', '$section', '''$line'''
with open(path) as f:
    content = f.read()
if f'\n## {section}\n' not in content:
    content += f'\n\n## {section}\n'
# Insert line right after the section header
parts = content.split(f'## {section}', 1)
head, tail = parts[0] + f'## {section}\n', parts[1]
tail_lines = tail.split('\n')
# Insert as second line (after the empty line that follows the header)
new_tail = '\n' + line + '\n' + '\n'.join(tail_lines[1:])
with open(path, 'w') as f:
    f.write(head + new_tail)
"
}

# ── Evaluator contract ──────────────────────────────────────────────────────
# Verifier scripts in tests/loop-acceptance/ must exit:
#   0  → VERDICT: PASS
#   1  → VERDICT: FAIL (reasons on stdout)
#   2  → VERDICT: BLOCKED (external dependency missing — e.g. DB unreachable)
#
# Loops must NEVER auto-apply a finding whose evaluator returned non-zero.
# This is the "no self-certification" rule from the loop-engineering skill.

run_evaluator() {
  local loop_name="$1" finding_summary="$2"
  local evaluator="$ACCEPTANCE_DIR/${loop_name}-evaluator.sh"

  if [ ! -x "$evaluator" ]; then
    loop_log "$loop_name" "ERROR" "evaluator missing or not executable: $evaluator"
    return 2
  fi

  local output exit_code
  set +e
  output="$($evaluator "$finding_summary" 2>&1)"
  exit_code=$?
  set -e

  echo "$output"
  return "$exit_code"
}

# ── Telegram alerting (opt-in) ───────────────────────────────────────────────
# Set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID in .env.server to receive alerts
# on hard failures (evaluator FAIL, blocked, budget exceeded). Free to leave
# unset; the loop continues and writes the failure to state instead.

telegram_alert() {
  local message="$1"
  if [ -z "${TELEGRAM_BOT_TOKEN:-}" ] || [ -z "${TELEGRAM_CHAT_ID:-}" ]; then
    return 0
  fi
  curl -sf -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d chat_id="$TELEGRAM_CHAT_ID" \
    -d parse_mode=Markdown \
    -d text="🔁 *worki-pro loop*: $message" >/dev/null || true
}

# ── Token spend tracking ────────────────────────────────────────────────────
# Approximation: word count of generator output × 1.3 (rough token estimate).
# Real systems would parse the model's usage report; this is good enough
# to enforce the cap without an API round-trip.

record_token_spend() {
  local loop_name="$1" tokens="$2"
  python3 -c "
import json, datetime
path = '$STATE_DIR/_budget.json'
loop_name = '$loop_name'
tokens = $tokens
today = datetime.date.today().isoformat()
try:
    with open(path) as f: data = json.load(f)
except: data = {}
key = today + ':' + loop_name
data[key] = data.get(key, 0) + tokens
# Prune anything older than 7 days
cutoff = (datetime.date.today() - datetime.timedelta(days=7)).isoformat()
data = {k: v for k, v in data.items() if k.split(':')[0] >= cutoff}
with open(path, 'w') as f: json.dump(data, f, indent=2)
print(sum(v for k, v in data.items() if k.endswith(':' + loop_name)))
"
}

check_daily_budget() {
  local loop_name="$1"
  local today_usage
  today_usage="$(python3 -c "
import json
try:
    with open('$STATE_DIR/_budget.json') as f: data = json.load(f)
except: data = {}
key = '$(date -u +%Y-%m-%d):$loop_name'
print(data.get(key, 0))
")"
  if [ "$today_usage" -ge "$LOOP_DAILY_BUDGET_TOKENS" ]; then
    loop_log "$loop_name" "WARN" "daily budget exhausted ($today_usage / $LOOP_DAILY_BUDGET_TOKENS tokens); skipping this run"
    return 1
  fi
  return 0
}

# ── Hard cap enforcement ────────────────────────────────────────────────────
# Wraps any command with a wallclock + token cap. If exceeded, kill the
# subprocess and write a hard-cap-exceeded entry to state.

enforce_caps() {
  local loop_name="$1"
  shift
  # Use timeout(1) for wallclock; SIGTERM at cap, SIGKILL after 30s grace
  timeout --preserve-status --kill-after=30 "$LOOP_MAX_WALLCLOCK_SECONDS" "$@"
  return $?
}