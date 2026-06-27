#!/usr/bin/env bash
# scripts/run-agent-loop.sh
# Ad-hoc plan execution loop. Reads a markdown plan file, finds the next
# task with unchecked steps, delegates execution to a Sonnet sub-agent,
# and loops until the plan is fully complete.
#
# This replaces the old claude -p based loop. Now uses Hermes delegation.
# For recurring production loops, use scripts/loops/<name>.sh instead.
#
# Usage:
#   ./scripts/run-agent-loop.sh [plan-file]
#
# Requires: hermes CLI authenticated, git, node, bash 4+

set -euo pipefail

PLAN="${1:-docs/superpowers/plans/2026-05-19-bark-style-redesign.md}"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
HERMES_DIR="$REPO_DIR/.hermes"
STATE_FILE="$HERMES_DIR/loop-state/run-agent-loop.md"
LOG_DIR="$HERMES_DIR/loop-logs"
mkdir -p "$LOG_DIR"

cd "$REPO_DIR"

if [ ! -f "$PLAN" ]; then
  echo "❌ Plan file not found: $PLAN"
  echo "Usage: $0 [plan-file]"
  exit 1
fi

if [ ! -f "$STATE_FILE" ]; then
  cat > "$STATE_FILE" <<EOF
---
loop: run-agent-loop
plan: $PLAN
started: $(date -u +%Y-%m-%dT%H:%M:%SZ)
tasks_completed: 0
status: active
---

# run-agent-loop state

## Task log
(none)
EOF
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Agent loop — plan: $PLAN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Pull latest
git pull origin main --ff-only || true

TASK_COUNT=0

while true; do
  # Count unchecked steps
  PENDING=$(grep -c '^- \[ \]' "$PLAN" 2>/dev/null || echo "0")

  if [ "$PENDING" -eq 0 ]; then
    echo ""
    echo "✅ All tasks complete!"
    break
  fi

  # Find next task
  TASK=$(grep -m1 '^## Task' "$PLAN" | head -1)
  TASK_NUM=$(echo "$TASK" | grep -oP 'Task \K[0-9]+' || echo "0")
  TASK_NUM="${TASK_NUM:-0}"

  echo ""
  echo "📋 $PENDING steps remaining — next: $TASK"
  echo "$(date '+%Y-%m-%d %H:%M:%S') Starting task #$TASK_NUM..."
  echo ""

  LOG="$LOG_DIR/agent-$(date +%Y%m%d-%H%M%S)-task$TASK_NUM.log"

  # Delegate to Hermes. This is a one-shot sub-agent that:
  # - Reads the plan
  # - Finds the FIRST task with unchecked steps
  # - Executes EVERY step of that task in order
  # - Marks steps done in the plan file
  # - Stops (does not start the next task — the loop will)
  #
  # We invoke Hermes via the `delegate_task` MCP server when available,
  # otherwise fall back to spawning a fresh agent process.
  #
  # IMPORTANT: this is a generator step only. No evaluator in this loop —
  # the user is the evaluator. That's the explicit design choice for ad-hoc
  # plan execution. The recurring production loops (scripts/loops/*.sh) are
  # the ones with independent evaluators.

  PROMPT=$(cat <<EOF
You are executing an implementation plan for a Wasp 0.21 full-stack app.
Plan file: $PLAN

TASK: Find the FIRST task in the plan that has any unchecked steps (- [ ]).
Execute EVERY step of that task in order. Do not start the next task.

RULES:
- Read the plan first to find the next task.
- Execute each step exactly as described.
- After completing a step, mark it in the plan: change '- [ ]' to '- [x]'.
- Commit your work with a clear message referencing the task number.
- If a step is ambiguous, choose the most conservative interpretation.
- Report a one-paragraph summary of what you did.
EOF
)

  # Try Hermes delegate_task first; fall back to running hermes claude-style
  if command -v hermes &>/dev/null; then
    echo "$PROMPT" | hermes delegate --model sonnet --worktree "agent-loop/task-$TASK_NUM-$$" 2>&1 | tee "$LOG"
  else
    echo "⚠️  hermes CLI not found in PATH. Install hermes or use scripts/loops/*.sh for production loops."
    echo "Falling back: printing the prompt so you can run it manually."
    echo ""
    echo "PROMPT:"
    echo "$PROMPT"
    exit 1
  fi

  TASK_COUNT=$((TASK_COUNT + 1))

  # Commit plan progress
  if git diff --quiet "$PLAN" 2>/dev/null; then
    echo ""
    echo "⚠️  Plan unchanged after task. Agent may have failed. Check $LOG."
    read -r -p "Continue? [y/N] " CONTINUE
    if [ "${CONTINUE:-N}" != "y" ]; then
      echo "Loop stopped."
      exit 1
    fi
  else
    git add "$PLAN"
    git commit -m "wip: agent-loop task #$TASK_NUM completed

Plan: $PLAN" || true
  fi

  echo ""
  echo "Completed task #$TASK_NUM ($TASK_COUNT total). Continuing..."
done

# Final state update
sed -i "s/tasks_completed: .*/tasks_completed: $TASK_COUNT/" "$STATE_FILE"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Loop finished — $TASK_COUNT tasks completed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"