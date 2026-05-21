#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SCHEMA="$PROJECT_DIR/.wasp/out/db/schema.prisma"
TIMESTAMP=$(date +%Y%m%d%H%M%S)
BACKUP_DIR="$PROJECT_DIR/backups"

if [ ! -f "$PROJECT_DIR/.env.server" ]; then
  echo "Error: .env.server not found at $PROJECT_DIR/.env.server"
  echo "Copy .env.server.example to .env.server, fill in secrets, and retry."
  exit 1
fi

DATABASE_URL=$(grep -E '^DATABASE_URL=' "$PROJECT_DIR/.env.server" | head -1 | cut -d= -f2-)
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL not found in .env.server"
  exit 1
fi

mkdir -p "$BACKUP_DIR"

echo "=== Migration: Pre-migration backup ==="
BACKUP_FILE="$BACKUP_DIR/backup-$TIMESTAMP.dump"
if command -v pg_dump &>/dev/null; then
  pg_dump "$DATABASE_URL" --no-owner --no-acl -F c -f "$BACKUP_FILE" && \
    echo "Backup saved: $BACKUP_FILE" || \
    echo "Warning: Backup failed — check DB connection and pg_dump installation"
else
  echo "Warning: pg_dump not found. Skipping backup."
fi

echo "=== Applying pending migrations ==="
cd "$PROJECT_DIR/.wasp/out/db"
npx prisma migrate deploy --schema="$SCHEMA"

echo "=== Migration complete ==="
echo "To roll back: restore from backup at $BACKUP_FILE"
