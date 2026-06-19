#!/usr/bin/env bash
# scripts/loops/heartbeat.sh
# Loop 2 — Provider inbox heartbeat. Every 5 min, check for HOT leads
# and low provider credit balances, send Telegram alerts.
#
# Five moves:
#   1. Discovery — query DB for HOT leads + low-credit providers
#   2. Handoff — script generates Telegram messages
#   3. Verification — tests/loop-acceptance/heartbeat-evaluator.sh confirms delivery
#   4. Persistence — append to .hermes/loop-state/heartbeat.jsonl
#   5. Scheduling — Hermes cron */5 * * * *

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "$SCRIPT_DIR/_lib.sh"

LOOP_NAME="heartbeat"
STATE_FILE="$STATE_DIR/heartbeat.jsonl"

if [ ! -f "$STATE_FILE" ]; then
  : > "$STATE_FILE"
fi

if ! check_daily_budget "$LOOP_NAME"; then
  exit 0
fi

if [ -z "${DATABASE_URL:-}" ]; then
  loop_log "$LOOP_NAME" "ERROR" "DATABASE_URL not set; cannot run"
  telegram_alert "heartbeat loop BLOCKED — DATABASE_URL not set"
  exit 2
fi

# ── Move 1: Discovery ────────────────────────────────────────────────────────
loop_log "$LOOP_NAME" "INFO" "discovery: scanning for HOT leads and low-credit providers"

# Query HOT leads (urgency=EMERGENCY, status=NEW, unassigned, last 15 min)
HOT_LEADS="$(psql "$DATABASE_URL" -t -A -F'|' -c "
SELECT id, category, city
FROM \"ServiceRequest\"
WHERE urgency = 'EMERGENCY'
  AND status = 'NEW'
  AND \"assignedProviderId\" IS NULL
  AND \"createdAt\" > now() - interval '15 minutes'
LIMIT 10;
" 2>/dev/null || echo "")"

# Query providers below threshold
LOW_CREDIT_PROVIDERS="$(psql "$DATABASE_URL" -t -A -F'|' -c "
SELECT u.email, lca.\"pointsBalance\"
FROM \"LeadCreditAccount\" lca
JOIN \"Provider\" p ON p.id = lca.\"providerId\"
JOIN \"User\" u ON u.id = p.\"userId\"
WHERE lca.\"pointsBalance\" < 5 AND p.\"verificationStatus\" = 'VERIFIED';
" 2>/dev/null || echo "")"

# ── Skip fast-path ───────────────────────────────────────────────────────────
if [ -z "$HOT_LEADS" ] && [ -z "$LOW_CREDIT_PROVIDERS" ]; then
  loop_log "$LOOP_NAME" "INFO" "no findings; loop tick idle"
  exit 0
fi

# ── Move 2: Handoff — build + send Telegram messages ────────────────────────
ALERTS_SENT=0

if [ -n "$HOT_LEADS" ]; then
  while IFS='|' read -r id category city; do
    DEDUP_KEY="hot_lead:$id"
    # Check dedup window (10 min)
    if grep -q "\"$DEDUP_KEY\"" "$STATE_FILE" 2>/dev/null && \
       [ "$(find "$STATE_FILE" -newermt "10 minutes ago" -exec grep -l "$DEDUP_KEY" {} \;)" ]; then
      loop_log "$LOOP_NAME" "INFO" "skip dedup: $DEDUP_KEY"
      continue
    fi

    MSG="🔥 *HOT lead* in $city — category: $category
Claim: https://thehelper.ca/provider/leads?id=$id"

    if [ -n "${TELEGRAM_BOT_TOKEN:-}" ]; then
      curl -sf -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d chat_id="${TELEGRAM_CHAT_ID}" \
        -d parse_mode=Markdown \
        -d text="$MSG" >/dev/null
      ALERTS_SENT=$((ALERTS_SENT + 1))
    fi

    # Record the alert
    TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "{\"ts\":\"$TS\",\"type\":\"hot_lead\",\"key\":\"$DEDUP_KEY\",\"id\":\"$id\"}" >> "$STATE_FILE"
    record_token_spend "$LOOP_NAME" 50
  done <<< "$HOT_LEADS"
fi

if [ -n "$LOW_CREDIT_PROVIDERS" ]; then
  while IFS='|' read -r email balance; do
    DEDUP_KEY="low_credit:$email"
    if grep -q "\"$DEDUP_KEY\"" "$STATE_FILE" 2>/dev/null && \
       [ "$(find "$STATE_FILE" -newermt "60 minutes ago" -exec grep -l "$DEDUP_KEY" {} \;)" ]; then
      continue
    fi
    MSG="⚠️ *Low credit balance*: $email has $balance credits left
Buy more: https://thehelper.ca/provider/billing"
    if [ -n "${TELEGRAM_BOT_TOKEN:-}" ]; then
      curl -sf -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d chat_id="${TELEGRAM_CHAT_ID}" \
        -d parse_mode=Markdown \
        -d text="$MSG" >/dev/null
      ALERTS_SENT=$((ALERTS_SENT + 1))
    fi
    TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "{\"ts\":\"$TS\",\"type\":\"low_credit\",\"key\":\"$DEDUP_KEY\",\"email\":\"$email\"}" >> "$STATE_FILE"
    record_token_spend "$LOOP_NAME" 30
  done <<< "$LOW_CREDIT_PROVIDERS"
fi

loop_log "$LOOP_NAME" "INFO" "sent $ALERTS_SENT alerts"
exit 0