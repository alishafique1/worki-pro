# Coolify Deployment — The Helper

## Architecture

```
thehelper.ca      → Coolify App: thehelper-web  (Nginx, React SPA)
api.thehelper.ca  → Coolify App: thehelper-api  (Node.js, Wasp server)
                                                  ↕
                                             Neon DB (cloud Postgres)
```

Cloudflare sits in front (DNS proxy ON = CDN + DDoS), forwarding to VPS IP.

---

## 1 — Create App: thehelper-api (backend)

In Coolify dashboard → New Resource → Docker → From a Git repo

| Setting | Value |
|---|---|
| Repository | `github.com/alishafique1/worki-pro` |
| Branch | `main` |
| Build pack | `Dockerfile` |
| Dockerfile location | `.wasp/out/Dockerfile` |
| Build context | `/` (project root) |
| Port | `3001` |
| Domain | `api.thehelper.ca` |

### Environment Variables (set in Coolify, never commit these)

```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://neondb_owner:...@ep-bitter-salad...neon.tech/neondb?sslmode=require
WASP_WEB_CLIENT_URL=https://thehelper.ca
JWT_SECRET=<generate: openssl rand -hex 64>
MAILGUN_API_KEY=...
MAILGUN_DOMAIN=em.socialdots.ca
ADMIN_EMAILS=socialdots.ca@gmail.com
GHL_WEBHOOK_URL=<GHL outbound lead webhook URL>
GHL_OTP_WEBHOOK_URL=<GHL OTP SMS webhook URL>
```

---

## 2 — Create App: thehelper-web (frontend)

In Coolify dashboard → New Resource → Docker → From a Git repo

| Setting | Value |
|---|---|
| Repository | `github.com/alishafique1/worki-pro` |
| Branch | `main` |
| Build pack | `Dockerfile` |
| Dockerfile location | `deploy/Dockerfile.web` |
| Build context | `/` (project root) |
| Port | `80` |
| Domain | `thehelper.ca` |

### Build Arguments (set in Coolify Build Args)

```
REACT_APP_API_URL=https://api.thehelper.ca
```

---

## 3 — Cloudflare DNS

Point both domains to VPS IP with **orange cloud ON** (proxied):

| Type | Name | Value |
|---|---|---|
| A | `thehelper.ca` | `<VPS IP>` |
| A | `api.thehelper.ca` | `<VPS IP>` |

Coolify handles SSL via Let's Encrypt. Set SSL/TLS mode in Cloudflare to **Full (strict)**.

---

## 4 — Deploy Workflow

Before pushing to main:

```bash
./deploy/build.sh           # runs wasp build
git add .wasp/out/
git commit -m "build: update deployment artifacts"
git push
```

Coolify auto-detects the push and rebuilds both apps.

---

## 5 — Run DB Migrations on First Deploy

After the API container is running:

```bash
# In Coolify → thehelper-api → Terminal (or SSH into VPS)
cd /app && npx prisma migrate deploy --schema=.wasp/out/db/schema.prisma
```
