#!/bin/bash
# Run before every deploy to regenerate .wasp/out/ and rebuild the React SPA.
# Usage: REACT_APP_API_URL=https://api.thehelper.ca ./deploy/build.sh
#
# REACT_APP_API_URL is baked into the JS bundle at build time.
# Default: https://api.thehelper.ca

set -e

API_URL="${REACT_APP_API_URL:-https://api.thehelper.ca}"

echo "Building Wasp server artifacts..."
wasp build

echo "Building React SPA (API_URL=$API_URL)..."
REACT_APP_API_URL="$API_URL" npx vite build --outDir deploy/dist

echo ""
echo "Done. Stage, commit, and push:"
echo "  git add .wasp/out/ deploy/dist/"
echo "  git commit -m 'build: update deployment artifacts'"
echo "  git push"
echo ""
echo "Coolify/VPS will auto-deploy."
