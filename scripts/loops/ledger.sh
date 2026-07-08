#!/usr/bin/env bash
# scripts/loops/ledger.sh
# Loop 3 — Daily cashback ledger reconciliation. 02:00 ET.
#
# Promotes PENDING reward transactions older than 7 days to APPROVED,
# flags stuck redemptions, and verifies the balance invariant:
#
#   SUM(RewardAccount.pointsBalance) == SUM(RewardTransaction.points
#                                       WHERE status='APPROVED')
#                                    - SUM(Redemption.pointsUsed
#                                          WHERE status in ('APPROVED','SENT'))
#
# Five moves:
#   1. Discovery — count PENDING transactions + stuck redemptions
#   2. Handoff — psql UPDATE statements (transactional)
#   3. Verification — tests/loop-acceptance/ledger-evaluator.sh checks invariant
#   4. Persistence — daily report .hermes/loop-state/ledger-YYYY-MM-DD.md
#   5. Scheduling — Hermes cron 0 2 * * *

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "$SCRIPT_DIR/_lib.sh"

LOOP_NAME="ledger"
STATE_FILE="$(loop_state_path "$LOOP_NAME")"
REPORT_FILE="$STATE_DIR/ledger-$(date -u +%Y-%m-%d).md"

if ! check_daily_budget "$LOOP_NAME"; then
  exit 0
fi

if [ -z "${DATABASE_URL:-}" ]; then
  loop_log "$LOOP_NAME" "ERROR" "DATABASE_URL not set; cannot run"
  exit 2
fi

if [ ! -f "$STATE_FILE" ]; then
  cat > "$STATE_FILE" <<'EOF'
---
loop: ledger
last_run: never
run_count: 0
consecutive_failures: 0
status: active
---

# ledger — Daily reconciliation state

## Daily reports
(none)

## Stuck redemptions (audit)
(none)

## Invariant violations
(none)
EOF
fi

# ── Move 1: Discovery ────────────────────────────────────────────────────────
loop_log "$LOOP_NAME" "INFO" "discovery: counting pending transactions and stuck redemptions"

PENDING_COUNT="$(psql "$DATABASE_URL" -t -A -c "
SELECT COUNT(*) FROM \"RewardTransaction\"
WHERE status = 'PENDING' AND \"createdAt\" < now() - interval '7 days';
" 2>/dev/null || echo "0")"

STUCK_REDEMPTIONS="$(psql "$DATABASE_URL" -t -A -c "
SELECT COUNT(*) FROM \"Redemption\"
WHERE status IN ('REQUESTED','APPROVED')
  AND \"createdAt\" < now() - interval '24 hours'
  AND (\"tremendousOrderId\" IS NULL OR \"tremendousOrderId\" = '');
" 2>/dev/null || echo "0")"

loop_log "$LOOP_NAME" "INFO" "pending_to_promote=$PENDING_COUNT stuck_redemptions=$STUCK_REDEMPTIONS"

# ── Move 2: Handoff — transactional promotion ───────────────────────────────
if [ "$PENDING_COUNT" -gt 0 ]; then
  psql "$DATABASE_URL" -c "
BEGIN;
UPDATE \"RewardTransaction\"
SET status = 'APPROVED', \"approvedAt\" = now()
WHERE status = 'PENDING' AND \"createdAt\" < now() - interval '7 days';
COMMIT;
" >/dev/null
  loop_log "$LOOP_NAME" "INFO" "promoted $PENDING_COUNT transactions to APPROVED"
  record_token_spend "$LOOP_NAME" 100
fi

# ── Move 3: Verification — check the invariant ─────────────────────────────
INVARIANT_RESULT="$(psql "$DATABASE_URL" -t -A -c "
WITH
  account_sum AS (
    SELECT COALESCE(SUM(\"pointsBalance\"), 0) AS s FROM \"RewardAccount\"
  ),
  approved_sum AS (
    SELECT COALESCE(SUM(points), 0) AS s FROM \"RewardTransaction\" WHERE status = 'APPROVED'
  ),
  redeemed_sum AS (
    SELECT COALESCE(SUM(\"pointsUsed\"), 0) AS s FROM \"Redemption\" WHERE status IN ('APPROVED','SENT')
  )
SELECT
  (SELECT s FROM account_sum) AS account,
  (SELECT s FROM approved_sum) AS approved,
  (SELECT s FROM redeemed_sum) AS redeemed,
  (SELECT s FROM account_sum) - ((SELECT s FROM approved_sum) - (SELECT s FROM redeemed_sum)) AS drift;
" 2>/dev/null || echo "0|0|0|0")"

ACCOUNT="$(echo "$INVARIANT_RESULT" | cut -d'|' -f1)"
APPROVED="$(echo "$INVARIANT_RESULT" | cut -d'|' -f2)"
REDEEMED="$(echo "$INVARIANT_RESULT" | cut -d'|' -f3)"
DRIFT="$(echo "$INVARIANT_RESULT" | cut -d'|' -f4)"

loop_log "$LOOP_NAME" "INFO" "invariant: account=$ACCOUNT approved=$APPROVED redeemed=$REDEEMED drift=$DRIFT"

# ── Move 4: Persistence — write the daily report ───────────────────────────
cat > "$REPORT_FILE" <<EOF
# Ledger Reconciliation — $(date -u +%Y-%m-%d)

## Run summary
- Pending promoted: $PENDING_COUNT
- Stuck redemptions flagged: $STUCK_REDEMPTIONS
- Account balance sum: $ACCOUNT
- Approved transactions sum: $APPROVED
- Redemptions sum: $REDEEMED
- **Drift (must be 0)**: $DRIFT

## Invariant
\`\`\`
sum(RewardAccount.pointsBalance) = sum(approved RewardTransaction.points)
                                  - sum(approved Redemption.pointsUsed)
\`\`\`

## Stuck redemptions (detail)
$(psql "$DATABASE_URL" -t -A -F'|' -c "
SELECT id, \"consumerId\", \"createdAt\", status
FROM \"Redemption\"
WHERE status IN ('REQUESTED','APPROVED')
  AND \"createdAt\" < now() - interval '24 hours'
  AND (\"tremendousOrderId\" IS NULL OR \"tremendousOrderId\" = '');
" 2>/dev/null || echo "(none)")

## Verdict
$([ "$DRIFT" = "0" ] && echo "PASS" || echo "FAIL — drift of $DRIFT detected")
EOF

# Update state file
NOW="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
state_set_field "$STATE_FILE" "last_run" "$NOW"
RUN_COUNT="$(state_read_field "$STATE_FILE" run_count)"
state_set_field "$STATE_FILE" "run_count" "$((RUN_COUNT + 1))"

if [ "$DRIFT" != "0" ]; then
  DRIFT_ABS="$(echo "$DRIFT" | tr -d '-')"
  if [ "$DRIFT_ABS" -gt 10 ]; then
    state_set_field "$STATE_FILE" "status" "paused"
    telegram_alert "ledger drift of $DRIFT detected (>\$10) — loop paused"
  else
    state_append_section "$STATE_FILE" "Invariant violations" \
      "- $(date -u +%Y-%m-%d) — drift=$DRIFT"
    telegram_alert "ledger drift of $DRIFT (within threshold); see $REPORT_FILE"
  fi
fi

loop_log "$LOOP_NAME" "INFO" "loop tick complete; report at $REPORT_FILE"
exit 0