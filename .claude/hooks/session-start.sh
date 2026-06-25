#!/bin/bash
# SessionStart hook for The Helper (Wasp + React + Prisma).
# Installs dependencies so linting (prettier) and e2e tests (Playwright) work
# in Claude Code on the web. Idempotent and non-interactive.
set -euo pipefail

# Only run in the remote (web) environment.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# 1. Node dependencies — prettier, typescript, @playwright/test, app deps.
#    The npm registry is allowlisted, but Prisma's postinstall downloads engine
#    binaries from a blocked host (binaries.prisma.sh) and would fail the whole
#    install. --ignore-scripts skips that: prettier + Playwright don't need the
#    engines, and Wasp manages Prisma's client inside .wasp/out. `npm install`
#    (not `ci`) so the cached container state is reused.
echo "[hook] Installing node dependencies…"
npm install --ignore-scripts

# 2. Wasp CLI — required for `wasp build` / `wasp start` / `wasp test`.
#    get.wasp.sh must be allowed by the environment's network policy. If it is
#    blocked we DON'T fail the session: prettier + Playwright already work.
if ! command -v wasp >/dev/null 2>&1 && [ ! -x "$HOME/.local/bin/wasp" ]; then
  echo "[hook] Installing Wasp CLI (best-effort)…"
  if curl -fsSL https://get.wasp.sh/installer.sh -o /tmp/wasp-installer.sh 2>/dev/null; then
    sh /tmp/wasp-installer.sh || echo "[hook] Wasp install failed — continuing without it."
  else
    echo "[hook] get.wasp.sh is blocked by the network policy. Allowlist get.wasp.sh"
    echo "[hook] (and github.com) to enable 'wasp build/start/test'. Skipping."
  fi
fi

# Persist Wasp on PATH for the session if it got installed.
if [ -x "$HOME/.local/bin/wasp" ]; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$CLAUDE_ENV_FILE"
fi

# 3. Generate the Wasp SDK so src/ typechecks (only if the CLI is available).
export PATH="$HOME/.local/bin:$PATH"
if command -v wasp >/dev/null 2>&1; then
  echo "[hook] Generating Wasp code (wasp build)…"
  wasp build || echo "[hook] 'wasp build' did not complete — run it manually if needed."
fi

echo "[hook] Done."
