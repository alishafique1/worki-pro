#!/bin/bash
# Run before git push to regenerate .wasp/out/ for Coolify deployment.
# Usage: ./deploy/build.sh

set -e

echo "Building Wasp project..."
wasp build

echo "Done. Stage and push:"
echo "  git add .wasp/out/"
echo "  git commit -m 'build: update deployment artifacts'"
echo "  git push"
