# =============================================================================
# TheHelper — Production Environment Configuration Template
# =============================================================================
# Copy this file to .env.server and fill in all values before deploying.
# NEVER commit secrets to version control.
# =============================================================================

# --- Database (Neon PostgreSQL) ---
# Get connection string from Neon dashboard → Connection Details → Pooled connection
DATABASE_URL=postgresql://neondb_owner:password@ep-xxxx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

# --- Authentication ---
# Generate with: openssl rand -hex 64
# Rotate quarterly. Keep previous secret for 2x token lifetime during rotation.
JWT_SECRET=<generate: openssl rand -hex 64>

# --- Server ---
PORT=3001
NODE_ENV=production
WASP_WEB_CLIENT_URL=https://thehelper.ca
WASP_SERVER_URL=https://api.thehelper.ca
SKIP_EMAIL_VERIFICATION_IN_DEV=false

# --- Email (Mailgun) ---
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=em.socialdots.ca
ADMIN_EMAILS=socialdots.ca@gmail.com

# --- SMS/OTP (GoHighLevel) ---
GHL_OTP_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/YOUR_WORKFLOW_ID/webhook-trigger/YOUR_KEY

# --- GHL Integration ---
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/YOUR_WORKFLOW_ID/webhook-trigger/YOUR_KEY

# --- Payments (Stripe) ---
# Use live keys (sk_live_...) in production
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# --- Payments (Lemon Squeezy) ---
LEMONSQUEEZY_API_KEY=eyJ...
LEMONSQUEEZY_STORE_ID=your-store-id
LEMONSQUEEZY_WEBHOOK_SECRET=your-webhook-secret

# --- Payments (Polar) ---
POLAR_ORGANIZATION_ACCESS_TOKEN=polar_oat_...
POLAR_WEBHOOK_SECRET=polar_whs_...
POLAR_SANDBOX_MODE=false

# --- Subscription Plan IDs (set to live plan IDs) ---
PAYMENTS_HOBBY_SUBSCRIPTION_PLAN_ID=live-plan-id
PAYMENTS_PRO_SUBSCRIPTION_PLAN_ID=live-plan-id
PAYMENTS_CREDITS_10_PLAN_ID=live-plan-id

# --- Cloudflare API (DNS management) ---
CF_EDIT_ZEONE_API_KEY=your-cloudflare-api-token

# Only set these if using their respective services:
# SENDGRID_API_KEY=...
# OPENAI_API_KEY=...
# PLAUSIBLE_API_KEY=...
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# AWS_S3_IAM_ACCESS_KEY=...
# AWS_S3_IAM_SECRET_KEY=...
