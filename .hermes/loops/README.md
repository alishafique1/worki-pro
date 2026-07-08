# worki-pro loop system

Three production loops run via Hermes cron jobs. Each follows the loop-engineering skill's 5-move pattern (Discovery → Handoff → Verification → Persistence → Scheduling).

## Loops

| Loop | Schedule | Script | What it does |
|---|---|---|---|
| **smoke** | Daily 07:00 ET | `scripts/loops/smoke.sh` | Runs Playwright E2E suite, opens fix PRs on failure |
| **heartbeat** | Every 5 min | `scripts/loops/heartbeat.sh` | Watches for HOT leads + low provider credit, pings Telegram |
| **ledger** | Daily 02:00 ET | `scripts/loops/ledger.sh` | Reconciles cashback ledger, promotes PENDING→APPROVED after 7 days |

## File layout

```
.hermes/
├── loops/
│   ├── smoke.json           # Loop 1 config + caps
│   ├── heartbeat.json       # Loop 2 config + caps
│   ├── ledger.json          # Loop 3 config + caps
│   └── README.md            # this file
└── loop-state/              # durable memory (read at every tick)
    ├── smoke.md
    ├── heartbeat.jsonl
    ├── ledger.md
    └── ledger-YYYY-MM-DD.md # daily reports

scripts/loops/
├── _lib.sh                  # shared helpers (caps, state I/O, evaluator contract)
├── smoke.sh
├── heartbeat.sh
└── ledger.sh

tests/loop-acceptance/
├── smoke-evaluator.sh       # default-FAIL: Playwright JSON must be green
├── heartbeat-evaluator.sh   # default-FAIL: dedup + delivery check
└── ledger-evaluator.sh      # default-FAIL: balance invariant check
```

## Design contract

Each loop:

1. **Reads its own state file at the start of every tick.** No amnesiac loops.
2. **Has an independent evaluator** (separate script under `tests/loop-acceptance/`). The evaluator defaults to FAIL.
3. **Never auto-applies a finding whose evaluator returned non-zero.** Findings go to the human review queue in state, not the main branch.
4. **Has hard caps** (per-run tokens, wallclock, daily budget). Loops hit a cap → STOP, write state, do not retry.
5. **Alerts via Telegram only on hard failures** (7-day-streak failure, blocked state, drift > $10). Routine operation is silent.

## Adding a new loop

1. Copy `scripts/loops/smoke.sh` as a template.
2. Write `<name>.json` under `.hermes/loops/`.
3. Write `<name>-evaluator.sh` under `tests/loop-acceptance/` (must default to FAIL).
4. Register with Hermes cron via the `cronjob` tool — see `1-Projects/worki-pro-launch-2026-07.md` for the three already registered.

## Operational notes

- **State files are the source of truth.** Don't move findings to "Done" by hand unless you understand why the evaluator got it wrong.
- **Sunday habit:** open 3 random loop state files and explain each to yourself. If you can't, that's comprehension rot starting (Addy Osmani).
- **Budget files:** `.hermes/loop-state/_budget.json` tracks per-day token spend. Pruned to 7 days automatically.
- **Logs:** `.hermes/loop-logs/YYYYMMDD.log` — one file per day, all loops append.
- **Telegram opt-in:** set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env.server` to enable alerts. Without them, alerts are written to state only.

## Known follow-ups (from the launch plan note)

- Wiring smoke loop to delegate to a Sonnet sub-agent for actual Playwright run + fix-PR workflow (currently the generator step is recorded; the agent invocation happens via cronjob's `prompt` field).
- Streak detection: when smoke fails 3+ days in a row, the script auto-files a Paperclip issue.
- Ledger evaluator should also verify Tremendous order reconciliation (deferred until Tremendous integration is live).