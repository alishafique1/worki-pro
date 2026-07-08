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

# If the JSON report doesn't exist, Playwright didn't run
if [ ! -f "$REPORT_JSON" ]; then
  echo "Playwright report missing at $REPORT_JSON — run 'npx playwright test' first"
  exit 1
fi

# Expected test count from playwright.config.ts (33 known tests; checked from
# tests/e2e/*.spec.ts). If this drifts, update the EXPECTED_TESTS env var.
EXPECTED_TESTS="${EXPECTED_TESTS:-33}"

# Parse the Playwright JSON
PARSED="$(python3 -c "
import json, sys
with open('$REPORT_JSON') as f:
    data = json.load(f)

# Playwright JSON shape:
# { 'stats': { 'expected': N, 'skipped': N, ... }, 'suites': [...] }
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
    reasons.append(f'{flaky} flaky test(s) — investigate')

print(f'VERDICT: {verdict}')
print(f'  expected={expected} skipped={skipped} unexpected={unexpected} flaky={flaky}')
if reasons:
    print('REASONS:')
    for r in reasons:
        print(f'  - {r}')
sys.exit(0 if verdict == 'PASS' else 1)
")"

echo "$PARSED"
EXIT=$?
if [ "$EXIT" -eq 0 ]; then
  exit 0
else
  exit 1
fi