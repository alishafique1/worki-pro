#!/usr/bin/env bash
# tests/loop-acceptance/smoke-evaluator.sh
# Evaluator for Loop 1 (smoke). Verifies Playwright run succeeded.
#
# Default stance: FAIL until proven PASS.
#
# Exit codes:
#   0 → VERDICT: PASS
#   1 → VERDICT: FAIL (reasons on stdout)
#   2 → VERDICT: BLOCKED (external dependency missing)

set -euo pipefail
WORKI_PRO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
REPORT_JSON="$WORKI_PRO_ROOT/playwright-report/results.json"

# If the JSON report doesn't exist OR is empty, Playwright didn't produce
# usable output (timeout, crash, no test files). Default-FAIL with a
# clear reason — do NOT let Python crash with a JSONDecodeError trace.
if [ ! -f "$REPORT_JSON" ] || [ ! -s "$REPORT_JSON" ]; then
  if [ ! -f "$REPORT_JSON" ]; then
    echo "VERDICT: FAIL"
    echo "REASONS:"
    echo "  - Playwright report missing at $REPORT_JSON (loop never ran tests)"
  else
    echo "VERDICT: FAIL"
    echo "REASONS:"
    echo "  - Playwright report at $REPORT_JSON is empty (timeout or crash)"
  fi
  exit 1
fi

# Expected test count. The smoke loop runs a configurable subset
# (default: public-pages + provider-flow specs). Discover from the actual
# glob so the loop fails-fast on test removal within the smoke subset.
# Set EXPECTED_TESTS to override (e.g. to 89 for a full-suite run).
if [ -n "${EXPECTED_TESTS:-}" ]; then
  : # use override
elif [ -n "${SMOKE_TEST_GLOB:-}" ]; then
  EXPECTED_TESTS="$(find $SMOKE_TEST_GLOB -name '*.spec.ts' -exec grep -c '^\s*test(' {} \; 2>/dev/null | awk '{s+=$1} END {print s+0}')"
else
  EXPECTED_TESTS=0
fi
echo "Smoke subset expects $EXPECTED_TESTS tests" >&2

# Parse the Playwright JSON. The smoke loop writes this file before
# invoking us; we just inspect it.
# Run python with `|| true` so set -e doesn't kill us when python exits 1
# (which it does on FAIL). We need to see the verdict to decide our exit.
PARSED="$(python3 -c "
import json, sys
with open('$REPORT_JSON') as f: data = json.load(f)
stats = data.get('stats', {})
expected = stats.get('expected', 0)
unexpected = stats.get('unexpected', 0)
flaky = stats.get('flaky', 0)
skipped = stats.get('skipped', 0)
reasons = []
verdict = 'PASS'
if unexpected > 0:
    verdict = 'FAIL'
    reasons.append(f'{unexpected} unexpected test failure(s)')
if expected < $EXPECTED_TESTS:
    verdict = 'FAIL'
    reasons.append(f'expected >={$EXPECTED_TESTS} tests, got {expected} (drift)')
if flaky > 0:
    verdict = 'FAIL'
    reasons.append(f'{flaky} flaky test(s) - investigate')
print(f'VERDICT: {verdict}')
print(f'  expected={expected} skipped={skipped} unexpected={unexpected} flaky={flaky}')
if reasons:
    print('REASONS:')
    for r in reasons: print(f'  - {r}')
sys.exit(0 if verdict == 'PASS' else 1)
" 2>&1)" || true

echo "$PARSED"
if echo "$PARSED" | grep -q '^VERDICT: PASS'; then
  exit 0
else
  exit 1
fi