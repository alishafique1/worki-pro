# Local issue queue

This folder is the agent-ready queue for worki-pro.

How to use it:
1. Read `queue.md`.
2. Pick one `status: ready` issue.
3. Mark it `in_progress` in the issue file before you start.
4. Work only from the issue file and linked source files.
5. When done, update the file with `status: done`, notes, and evidence.

Agent rules:
- One issue per agent unless the issue file explicitly says otherwise.
- Do not edit the same source files from two issues at once.
- Prefer small, isolated file sets.
- If the issue needs product decision, mark it `blocked` and explain why.

MoA note:
- MoA is a model-routing preset system, not the issue queue itself.
- The queue works with any agent setup, including MoA-backed runs.
- Current Hermes MoA preset in this workspace is `niner`.

Reference files:
- `queue.md` — current backlog and status
- `issue-*.md` — individual issue briefs
