#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

if [ -f "$PROJECT_DIR/.env.server" ]; then
  set -a
  source "$PROJECT_DIR/.env.server"
  set +a
fi

cd "$PROJECT_DIR/.wasp/out/server"

echo "=== Running database migrations ==="
npx prisma migrate deploy --schema=../db/schema.prisma

echo "=== Starting server ==="
NODE_ENV=production node --enable-source-maps -r dotenv/config bundle/server.js
