#!/usr/bin/env bash
# tests/loop-acceptance/ledger-evaluator.sh
# Evaluator for Loop 3 (ledger). Verifies the cashback balance invariant.
#
# Invariant: SUM(RewardAccount.pointsBalance) ==
#            SUM(RewardTransaction.points WHERE status='APPROVED') -
#            SUM(Redemption.pointsUsed WHERE status IN ('APPROVED','SENT'))
#
# Drift threshold: $10.00 (assumes 1 point = $0.01). Anything larger
# pauses the loop and alerts.

set -euo pipefail
WORKI_PRO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck disable=SC1091
source "$WORKI_PRO_ROOT/.env.server" 2>/dev/null || true

if [ -z "${DATABASE_URL:-}" ]; then
  echo "VERDICT: BLOCKED - DATABASE_URL not set"
  exit 2
fi

DRIFT="$(psql "$DATABASE_URL" -t -A -c "
WITH
  account_sum AS (SELECT COALESCE(SUM(\"pointsBalance\"), 0) AS s FROM \"RewardAccount\"),
  approved_sum AS (SELECT COALESCE(SUM(points), 0) AS s FROM \"RewardTransaction\" WHERE status = 'APPROVED'),
  redeemed_sum AS (SELECT COALESCE(SUM(\"pointsUsed\"), 0) AS s FROM \"Redemption\" WHERE status IN ('APPROVED','SENT'))
SELECT ABS((SELECT s FROM account_sum) - ((SELECT s FROM approved_sum) - (SELECT s FROM redeemed_sum)));
" 2>/dev/null || echo "999999")"

DRIFT="${DRIFT:-0}"
DRIFT_INT="${DRIFT%.*}"

# Compute USD value safely (no nested $() in echo)
USD_VALUE="$(echo "scale=2; $DRIFT * 0.01" 2>/dev/null | bc 2>/dev/null || echo "0.00")"

if [ "$DRIFT_INT" -eq 0 ]; then
  echo "VERDICT: PASS"
  echo "  drift=$DRIFT points (zero, within rounding tolerance)"
  exit 0
elif [ "$DRIFT_INT" -le 10 ]; then
  echo "VERDICT: FAIL"
  echo "REASONS:"
  echo "  - drift of $DRIFT points (~\$$USD_VALUE) exceeds zero but within \$10 threshold"
  echo "  - investigate before next reconciliation"
  exit 1
else
  echo "VERDICT: FAIL"
  echo "REASONS:"
  echo "  - drift of $DRIFT points (~\$$USD_VALUE) EXCEEDS \$10 threshold - LOOP SHOULD BE PAUSED"
  exit 1
fi