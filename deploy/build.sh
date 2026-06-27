#!/bin/bash
# Run before every deploy to regenerate .wasp/out/ and rebuild the React SPA.
# Usage: REACT_APP_API_URL=https://thehelper.ca ./deploy/build.sh
#
# REACT_APP_API_URL is baked into the JS bundle at build time.
# Default: https://thehelper.ca

set -e

API_URL="${REACT_APP_API_URL:-https://thehelper.ca}"
# PostHog public project key (phc_…) is safe to bake into the client bundle.
# Shared "Social-Dots" PostHog project. Override via env if it ever changes.
POSTHOG_KEY="${REACT_APP_POSTHOG_KEY:-phc_AxYiacGAymmuaa2cRPMZASTbXRMsiKtdzKv9BiaELZrj}"

echo "Building Wasp server artifacts..."
wasp build

echo "Building React SPA (API_URL=$API_URL, POSTHOG_KEY=${POSTHOG_KEY:0:8}…)..."
REACT_APP_API_URL="$API_URL" REACT_APP_POSTHOG_KEY="$POSTHOG_KEY" npx vite build --outDir deploy/dist

# === Bundle guard: catch the "wrong REACT_APP_API_URL" class of bug. ===
# If someone rebuilds the bundle with the wrong env var, the deployed
# site breaks silently (browser CORS / 502 from missing proxy) and the
# symptom is the dreaded "Unexpected token '<'" JSON parse error.
# Refuse the build instead of pushing a broken bundle.
BUNDLE=$(ls deploy/dist/assets/index-*.js 2>/dev/null | head -1)
if [ -z "$BUNDLE" ]; then
  echo "ERROR: no JS bundle found in deploy/dist/assets/" >&2
  exit 1
fi
if ! grep -q "REACT_APP_API_URL:\"$API_URL\"" "$BUNDLE"; then
  ACTUAL=$(grep -oE 'REACT_APP_API_URL:"[^"]+"' "$BUNDLE" | head -1 || echo "(not found)")
  echo "ERROR: bundle has wrong REACT_APP_API_URL." >&2
  echo "  expected: $API_URL" >&2
  echo "  actual:   $ACTUAL" >&2
  echo "  re-run with: REACT_APP_API_URL=$API_URL ./deploy/build.sh" >&2
  exit 1
fi
echo "Bundle guard: OK (REACT_APP_API_URL=$API_URL)"

# === Bundle guard: ensure the PostHog key was baked in. ===
# Without this, thehelper.ca silently sends zero analytics to PostHog.
if ! grep -q "$POSTHOG_KEY" "$BUNDLE"; then
  echo "ERROR: bundle is missing the PostHog key ($POSTHOG_KEY)." >&2
  echo "  re-run with: REACT_APP_POSTHOG_KEY=$POSTHOG_KEY ./deploy/build.sh" >&2
  exit 1
fi
echo "Bundle guard: OK (REACT_APP_POSTHOG_KEY baked in)"

echo ""
echo "Done. Stage, commit, and push:"
echo "  git add .wasp/out/ deploy/dist/"
echo "  git commit -m 'build: update deployment artifacts'"
echo "  git push"
echo ""
echo "Coolify/VPS will auto-deploy."
