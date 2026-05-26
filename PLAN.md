# PLAN: TheHelper Go-Live Launch
Date: 2026-05-26 | Branch: main | Status: IN FLIGHT

## Summary

Product is 95% code-complete. 100% of remaining work is operational: infrastructure provisioning, E2E stabilization, provider onboarding. Strategy: **narrow wedge — HVAC × Milton only**, expand weekly.

## What's Done

| Feature | Status |
|---------|--------|
| Service request wizard (4-step) | ✅ |
| Lead feed for providers (masked) | ✅ |
| Lead claiming ($5, idempotent) | ✅ |
| Appointment booking (Cal.com) | ✅ |
| Review system (PENDING/PUBLISHED/REJECTED) | ✅ |
| Reward accounts + transactions | ✅ |
| Referral system | ✅ |
| OTP flow (Twilio, rate-limited) | ✅ |
| Email templates (branded) | ✅ |
| Provider verification pipeline | ✅ |
| GHL webhook (inbound/outbound, signed) | ✅ |
| Twilio signature validation (timing-safe) | ✅ |
| SEO: 6 category pages + 5+ area pages | ✅ |
| Admin dashboards + moderation | ✅ |
| Auth: email-only (Google auth disabled) | ✅ |

## What's Left — Ordered by Critical Path

### 🔴 P0 — Must complete for launch

| # | Task | Owner | Depends On |
|---|------|-------|-----------|
| D1 | Run `wasp build` → confirm clean build | Dev | None |
| D2 | Run E2E tests → measure actual pass rate | Dev | D1 |
| D3 | Fix text/selector drift in 3 spec files | Dev | D2 |
| D4 | Target 80%+ E2E pass rate | Dev | D3 |
| D5 | Generate JWT_SECRET: `openssl rand -hex 32` | Dev | None |
| A1 | Provision Hostinger VPS (KVM 2, 2 vCPU, 8GB RAM, Ubuntu 22.04) | Ali | None |
| A2 | Provision PostgreSQL (Hostinger DB add-on or Supabase) | Ali | A1 |
| A3 | Point thehelper.ca DNS → VPS IP in Cloudflare | Ali | A1 |
| A4 | Verify Mailgun domain (SPF/DKIM in Cloudflare) | Ali | None |
| A5 | Purchase Twilio CA phone number | Ali | None |
| P1 | SSH VPS → install Node.js 20 + Nginx + PM2 | Dev+Ali | A1 |
| P2 | Configure Nginx reverse proxy :443 → :3001 | Dev | P1 |
| P3 | Set DATABASE_URL + deploy Wasp build | Dev | A2, P1 |
| P4 | Set all env vars in production | Dev | P3 |
| P5 | Smoke test critical path: lead → claim → book → review | Dev | P4 |

### 🟡 P1 — Important for quality

| # | Task | Owner |
|---|------|-------|
| P6 | Seed prod DB + onboard first 5-10 HVAC providers | Ali |
| P7 | Landing page copy review + GTA SEO pages | Dev |
| P8 | Configure Stripe live keys | Ali |
| P9 | Set ADMIN_EMAILS in prod env | Ali |

### ⚪ Post-launch

| # | Task |
|---|------|
| S1 | Social accounts + Week 2 content schedule (#59) |
| S2 | Expand to Handyman category (week 2-3) |
| S3 | Expand to Oakville/Burlington (week 4) |
| S4 | Paid ads: Google Ads "Milton HVAC repair" (week 2-3) |
| S5 | CI/CD pipeline (GitHub Actions) |

## Key Decisions

1. **Narrow wedge: HVAC × Milton only** — maximize provider density before expanding
2. **Manual provider onboarding** — build relationship capital, automate later
3. **$5/lead, no subscriptions** — simplest pricing model for launch
4. **No CI/CD for launch week** — manual deploy saves 2-3 days setup
5. **Docker Wasp build on VPS** — recommended production path
6. **Do NOT skip provider verification** — verification IS the competitive moat

## Project Context

- **Repo**: github.com/alishafique1/worki-pro
- **Stack**: Wasp 0.21, React 19, Tailwind CSS 4, Node.js/Express, Prisma v5, PostgreSQL
- **Integrations**: Twilio, Mailgun, Stripe, Cal.com, GHL, AWS S3, Google Analytics
- **E2E**: 33 Playwright tests across 3 spec files
- **Design tokens**: Primary #2563EB, Navy #0F172A, Page bg #F8FAFC, Surface #FFFFFF

### Review Files

- Design doc: `docs/gstack/design-doc-2026-05-26.md`
- Autoplan review: `docs/gstack/autoplan-review-2026-05-26.md`
- Test plan artifact: `docs/gstack/test-plan-2026-05-26.md`

## Risk Register

| Risk | Mitigation |
|------|-----------|
| Infra @ 0% — blocks all deployment | Ali provisions VPS + DB immediately |
| E2E drift — test pass rate unknown | Run tests next, fix selectors |
| Build unverified — may fail on main | `wasp build` before any other work |
| No prod env template — vars missed at deploy | Create from `.env.server.example` |
| Provider supply @ 0 — marketplace silent | Manual outreach to 5-10 HVAC pros week 1 |
