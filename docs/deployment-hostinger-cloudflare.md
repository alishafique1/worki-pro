# Deployment Guide — Hostinger VPS + Cloudflare

_Date: 2026-05-14_

## Overview

Wasp produces a **Node.js server** + a **static React SPA**. You need:
- A **Hostinger VPS** (minimum KVM 2 — 2 vCPU, 8GB RAM, 100GB NVMe) running Ubuntu 22.04
- A **Cloudflare-proxied domain** (thehelper.ca) for DNS, SSL, and CDN
- A **managed PostgreSQL** — either Hostinger's DB add-on, Supabase, or Railway

---

## 1. Prerequisites

### 1.1 Build the app locally first

```bash
wasp build
# Output lands in .wasp/out/
```

The build produces:
- `.wasp/out/web-app/` — static React SPA (deploy to CDN or serve from Nginx)
- `.wasp/out/server/` — Node.js Express server (run with PM2)
- `.wasp/out/db/` — Prisma client (run migrations against production DB)

### 1.2 Env vars needed in production

Create `/etc/thehelper/.env` on the VPS with ALL of these:

```env
# Core
DATABASE_URL=postgresql://user:pass@host:5432/thehelper
WASP_WEB_CLIENT_URL=https://thehelper.ca
JWT_SECRET=<random 64-char hex>
PORT=3001

# Email (Mailgun)
MAILGUN_API_KEY=...
MAILGUN_DOMAIN=thehelper.ca

# Twilio (SMS/OTP)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# AWS S3 (file uploads)
AWS_S3_IAM_ACCESS_KEY=...
AWS_S3_IAM_SECRET_KEY=...
AWS_S3_FILES_BUCKET=...
AWS_S3_REGION=ca-central-1

# Admin
ADMIN_EMAILS=socialdots.ca@gmail.com

# Optional integrations
GHL_WEBHOOK_SECRET=...
CAL_COM_WEBHOOK_SECRET=...
```

---

## 2. Hostinger VPS Setup

### 2.1 Initial server setup

```bash
# SSH into VPS
ssh root@<your-vps-ip>

# Update system
apt update && apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy + serve static files)
apt install -y nginx

# Install PostgreSQL client (for migrations)
apt install -y postgresql-client
```

### 2.2 Deploy the build

```bash
# On your local machine — zip and upload build
cd /Users/alishafique/Code/worki-pro
wasp build
cd .wasp/out
tar czf thehelper-build.tar.gz server/ web-app/ db/
scp thehelper-build.tar.gz root@<vps-ip>:/opt/thehelper/

# On VPS
cd /opt/thehelper
tar xzf thehelper-build.tar.gz
cd server && npm install --production
```

### 2.3 Run database migrations

```bash
cd /opt/thehelper/db
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# Seed production data (categories only — not mock users)
# Edit the seed call in main.wasp to only run seedVendorCategories for production
DATABASE_URL="postgresql://..." npx prisma db seed
```

### 2.4 Start the server with PM2

```bash
cd /opt/thehelper/server
pm2 start npm --name "thehelper-api" -- start
pm2 startup  # auto-start on reboot
pm2 save
```

### 2.5 Nginx config

```nginx
# /etc/nginx/sites-available/thehelper

# API server (Node.js)
server {
    listen 80;
    server_name api.thehelper.ca;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}

# React SPA (static files)
server {
    listen 80;
    server_name thehelper.ca www.thehelper.ca;

    root /opt/thehelper/web-app;
    index index.html;

    # SPA fallback — all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|webp|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
ln -s /etc/nginx/sites-available/thehelper /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 3. Cloudflare Setup

### 3.1 DNS records

In Cloudflare dashboard for `thehelper.ca`:

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | `@` | `<vps-ip>` | ✅ Proxied |
| A | `www` | `<vps-ip>` | ✅ Proxied |
| A | `api` | `<vps-ip>` | ✅ Proxied |
| MX | `@` | Mailgun records | ❌ DNS only |
| TXT | `@` | Mailgun SPF/DKIM | ❌ DNS only |

### 3.2 SSL

- Set SSL/TLS mode to **Full (strict)** in Cloudflare
- Enable "Always Use HTTPS"
- On the VPS, install a cert via Let's Encrypt:
  ```bash
  apt install -y certbot python3-certbot-nginx
  certbot --nginx -d thehelper.ca -d www.thehelper.ca -d api.thehelper.ca
  ```

### 3.3 Cloudflare Page Rules / Cache Rules

- Cache static assets: `thehelper.ca/*.js`, `*.css`, `*.webp` → Cache Level: Cache Everything, Edge TTL: 1 month
- Bypass cache for API: `api.thehelper.ca/*` → Cache Level: Bypass
- Bypass cache for auth routes: `thehelper.ca/login*`, `/signup*`, `/dashboard*` → Cache Level: Bypass

### 3.4 Cloudflare WAF (optional but recommended)

- Enable "Bot Fight Mode"
- Add a rate limit rule: `api.thehelper.ca/api/auth/*` → max 10 req/min per IP

---

## 4. Environment Variable: WASP_WEB_CLIENT_URL

This is critical — Wasp uses it for CORS and auth redirects:

```env
WASP_WEB_CLIENT_URL=https://thehelper.ca
```

The server must also know the client URL for email links (verification, password reset):

Check `main.wasp` `emailSender` config and ensure the `CLIENT_URL` used in email templates matches `https://thehelper.ca`.

---

## 5. Mailgun Domain Verification

1. Add Mailgun DNS records to Cloudflare (as DNS-only, NOT proxied)
2. Verify domain in Mailgun dashboard
3. Test with: `mailgun-js` or curl to send a test email before launch

---

## 6. Go-Live Checklist

### Before flipping DNS
- [ ] `wasp build` succeeds locally with no errors
- [ ] `DATABASE_URL` points to production PostgreSQL
- [ ] `wasp db migrate-dev` (or `prisma migrate deploy`) runs cleanly
- [ ] `seedVendorCategories` has been run (service categories exist)
- [ ] PM2 process is running and `curl localhost:3001/health` returns 200
- [ ] Nginx serves the React SPA and proxies API correctly
- [ ] SSL cert installed and Cloudflare SSL mode is Full (strict)

### After flipping DNS
- [ ] `https://thehelper.ca` loads the landing page
- [ ] `https://thehelper.ca/login` renders login form
- [ ] Sign up with a real email — verify email arrives via Mailgun
- [ ] Submit a test service request end-to-end
- [ ] Log in as provider, check lead feed shows the request
- [ ] Twilio OTP: trigger OTP flow, verify SMS arrives
- [ ] Admin at `https://thehelper.ca/admin` accessible with admin account

### Post-launch
- [ ] Set up PM2 log rotation: `pm2 install pm2-logrotate`
- [ ] Set up daily PostgreSQL backups (Hostinger snapshot or `pg_dump` cron)
- [ ] Monitor error rate via Cloudflare Analytics
- [ ] Set up uptime monitor (UptimeRobot free tier or Cloudflare Health Checks)

---

## 7. Quick Redeployment (future updates)

```bash
# Local
wasp build
cd .wasp/out && tar czf deploy.tar.gz server/ web-app/
scp deploy.tar.gz root@<vps-ip>:/opt/thehelper/

# VPS
cd /opt/thehelper && tar xzf deploy.tar.gz
cd server && npm install --production
DATABASE_URL="..." npx prisma migrate deploy  # if schema changed
pm2 restart thehelper-api
```

---

## 8. Remaining Blockers Before Launch

| # | Blocker | Owner | Status |
|---|---------|-------|--------|
| 1 | E2E test suite passing | Dev | 🔴 In progress |
| 2 | Mailgun domain verified for thehelper.ca | Ali | 🔴 Todo |
| 3 | Twilio phone number purchased (CA number) | Ali | 🔴 Todo |
| 4 | Production DB provisioned (Hostinger or Supabase) | Ali | 🔴 Todo |
| 5 | Stripe live keys configured (or disabled for beta) | Ali | 🟡 Optional for beta |
| 6 | `ADMIN_EMAILS` set to real admin email | Dev | 🟡 Easy |
| 7 | `JWT_SECRET` generated and set | Dev | 🔴 Required |
| 8 | Cal.com webhook URL updated to production domain | Ali | 🟡 If scheduling used |
| 9 | GHL webhook secret set in production | Ali | 🟡 If CRM used |
| 10 | VPS provisioned on Hostinger | Ali | 🔴 Todo |
