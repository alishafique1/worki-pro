#!/usr/bin/env bash
# run-agent-loop.sh
# Runs on the VPS. Executes one plan task per iteration using Claude Code,
# then loops until the plan is fully complete.
#
# Usage:
#   ./scripts/run-agent-loop.sh [plan-file]
#
# Requires: claude (Claude Code CLI) authenticated, git, node

set -e

PLAN="${1:-docs/superpowers/plans/2026-05-19-bark-style-redesign.md}"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$REPO_DIR/.agent-logs"
mkdir -p "$LOG_DIR"

cd "$REPO_DIR"

# Map plan task numbers to Paperclip issue identifiers
# Format: TASK_N=WOR-XX (the primary issue that task implements)
TASK_ISSUES=(
  [1]="WOR-67"   # Schema changes → bark redesign epic
  [2]="WOR-68"   # Wasp routes → dynamic service request flow
  [3]="WOR-68"   # saveGuestRequest action
  [4]="WOR-68"   # verifyOtp extension
  [5]="WOR-59"   # Homepage wiring → landing page
  [6]="WOR-59"   # Nav dropdown
  [7]="WOR-56"   # Category landing pages
  [8]="WOR-68"   # Wizard shell
  [9]="WOR-68"   # Wizard steps 1-3
  [10]="WOR-68"  # Wizard steps 4-6
  [11]="WOR-67"  # Simplified onboarding
  [12]="WOR-67"  # Smoke tests
)

pc_update() {
  local identifier="$1" status="$2" comment="$3"
  node scripts/paperclip-sync.js update-issue "$identifier" "$status" "$comment" 2>/dev/null || true
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Agent loop starting — plan: $PLAN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Pull latest before starting
git pull origin main --ff-only || true

while true; do
  PENDING=$(grep -c '^- \[ \]' "$PLAN" 2>/dev/null || echo "0")

  if [ "$PENDING" -eq "0" ]; then
    echo ""
    echo "✅ All tasks complete!"
    break
  fi

  TASK=$(grep -m1 '^## Task' "$PLAN" | head -1)
  TASK_NUM=$(echo "$TASK" | grep -oP 'Task \K[0-9]+')
  ISSUE_ID="${TASK_ISSUES[$TASK_NUM]:-WOR-67}"
  echo ""
  echo "📋 $PENDING steps remaining — next: $TASK ($ISSUE_ID)"
  echo "$(date '+%Y-%m-%d %H:%M:%S') Starting task..."
  echo ""

  pc_update "$ISSUE_ID" "in_progress" "🤖 Agent starting: $TASK"

  LOG="$LOG_DIR/task-$(date +%Y%m%d-%H%M%S).log"

  claude --allowedTools "Bash,Read,Edit,Write" -p "$(cat <<PROMPT
You are executing an implementation plan for a Wasp 0.21 full-stack app.
Plan file: $PLAN
Spec file: docs/superpowers/specs/2026-05-19-bark-style-redesign-design.md

TASK: Find the FIRST task in the plan that has any unchecked steps (- [ ]).
Execute EVERY step of that task in order. Do not start the next task.

RULES:
- Read the plan first to find the next task.
- Execute each step exactly as described.
- After each step completes, edit the plan file to change that step's checkbox from [ ] to [x].
- Commit code changes after each step: git add -A && git commit -m "feat: <description>"
- You CAN run: wasp db migrate-dev, wasp build, tsc, npm commands — the full environment is available.
- Use targeted file edits (search-replace) rather than rewriting whole files.
- When all steps in the task are done and committed, stop.
PROMPT
  )" 2>&1 | tee "$LOG"

  EXIT_CODE=${PIPESTATUS[0]}

  if [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo "⚠️  Claude exited with code $EXIT_CODE — check $LOG"
    pc_update "$ISSUE_ID" "" "⚠️ Agent hit an error on $TASK (exit $EXIT_CODE) — retrying..."
    echo "Retrying once after 10s..."
    sleep 10
    claude --allowedTools "Bash,Read,Edit,Write" -p "Continue executing the current task in $PLAN. Find the next unchecked step and complete it. Commit when done." 2>&1 | tee -a "$LOG" || {
      pc_update "$ISSUE_ID" "" "❌ Retry also failed — needs manual intervention. Check $LOG"
      echo "❌ Retry also failed — stopping loop. Run manually to debug."
      exit 1
    }
  fi

  git push origin main || echo "⚠️  Push failed — will retry next iteration"

  # Check if this task's steps are all done and update Paperclip
  STILL_PENDING=$(grep -c '^- \[ \]' "$PLAN" 2>/dev/null || echo "0")
  if [ "$STILL_PENDING" -lt "$PENDING" ]; then
    pc_update "$ISSUE_ID" "" "✅ $TASK complete — $(( PENDING - STILL_PENDING )) steps done. Continuing to next task."
  fi

  echo ""
  echo "✓ Task done — pulling and continuing..."
  git pull origin main --ff-only || true
  sleep 2
done

echo ""
echo "🎉 Plan complete: $PLAN"
pc_update "WOR-67" "done" "🎉 All 12 tasks in the bark-style redesign plan are complete! Implementation finished."
git push origin main || true
