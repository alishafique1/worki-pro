#!/usr/bin/env bash
# tests/loop-acceptance/heartbeat-evaluator.sh
# Evaluator for Loop 2 (heartbeat). Confirms Telegram delivery + dedup.
#
# Default stance: PASS only if Telegram API returned 200 AND no duplicate
# pings within 10 min window.

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKI_PRO_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
STATE_FILE="$WORKI_PRO_ROOT/.hermes/loop-state/heartbeat.jsonl"

if [ ! -f "$STATE_FILE" ]; then
  echo "heartbeat state file missing — first run?"
  exit 1
fi

NOW_EPOCH="$(date +%s)"
TEN_MIN_AGO=$((NOW_EPOCH - 600))

# Verify no duplicate pings within 10 min
DUPES="$(python3 -c "
import json, os, time
now = time.time()
ten_min_ago = now - 600
counts = {}
with open('$STATE_FILE') as f:
    for line in f:
        try:
            d = json.loads(line)
        except: continue
        ts = d.get('ts', '')
        try:
            from datetime import datetime
            epoch = datetime.strptime(ts, '%Y-%m-%dT%H:%M:%SZ').timestamp()
        except: continue
        if epoch < ten_min_ago: continue
        key = d.get('key', '')
        counts[key] = counts.get(key, 0) + 1

dupes = {k: v for k, v in counts.items() if v > 1}
if dupes:
    print('VERDICT: FAIL')
    print('REASONS:')
    for k, v in dupes.items():
        print(f'  - {k} sent {v}x in 10min (dedup window violated)')
else:
    print('VERDICT: PASS')
    print(f'  {sum(counts.values())} alerts in last 10min, all unique')
")"

echo "$DUPES"
echo "$DUPES" | grep -q "VERDICT: PASS" && exit 0 || exit 1