# TheHelper / worki-pro — Task Master

Last updated: 2026-05-18
Owner: Core delivery
Purpose: Single source of truth for implementation status, release readiness, and GitHub issue sync.

Release checklist: `docs/release-verification-checklist.md`
Deployment guide: `docs/deployment-hostinger-cloudflare.md`

---

## 1) Current Goal

Ship TheHelper to production by **May 26, 2026** with:
- Stable E2E test suite (80%+ passing)
- Production deployment on Hostinger VPS + Cloudflare (thehelper.ca)
- Verified auth, email, Twilio OTP, and GHL webhook flows
- First 10 providers onboarded and categories seeded

---

## 2) Release Readiness Snapshot

Overall go-live progress: **~85%**

- Product feature completeness: **~95%** (all routes exist, all flows implemented)
- Security/config hardening: **~95%** (webhook auth, env hygiene, onboarding redirect — all verified in code)
- E2E quality gate: **~35%** (suite not run against current build — needs a run against seeded DB)
- Deployment/ops readiness: **~40%** (VPS, DB, Mailgun, Twilio not yet provisioned)

Launch decision: **No-Go — blocked by infra provisioning and E2E run**

---

## 3) Done — Verified In Source (2026-05-18)

- Google auth disabled in `main.wasp` (email-only for launch)
- No Google secrets in `.env.client.example`
- GHL inbound webhook enforces `GHL_WEBHOOK_SECRET` in production
- GHL outbound webhook log uses correct `WebhookLog` Prisma delegate
- Twilio webhook validates `X-Twilio-Signature` with timing-safe compare
- Provider onboarding redirect → `/provider/dashboard`
- Cookie consent links to `/privacy` and `/terms`
- Admin messages/settings pages: safe placeholders, no TODO stubs
- Pricing page: TheHelper-safe copy (no template/demo language)
- All tested routes exist in `main.wasp` and have page implementations
- MessageButton: removed hardcoded infinite ping animation
- GitHub issue tracker cleaned: 20 duplicates closed, 6 wrong-repo issues closed, 2 test issues closed
- All 5 code-done release blockers (#27, #28, #29, #31, #32) closed as verified

---

## 4) Remaining Blockers — Ordered by Critical Path

### P0 — Must be done before May 26

| # | Blocker | Owner | Notes |
|---|---------|-------|-------|
| #55 | Stabilize E2E suite (80%+ passing) | Dev | Run `wasp test` against seeded DB, fix any failures |
| #56 | Production deployment — Hostinger VPS + Cloudflare | Ali + Dev | VPS + Nginx + PM2 |
| #57 | Complete release verification checklist | Ali + Dev | Gate for go-live |
| — | Provision Hostinger VPS (KVM 2 min) | Ali | 2 vCPU, 8GB RAM, Ubuntu 22.04 |
| — | Provision production PostgreSQL | Ali | Hostinger DB add-on or Supabase |
| — | Verify Mailgun domain for thehelper.ca | Ali | SPF/DKIM records in Cloudflare |
| — | Purchase Twilio CA phone number | Ali | For OTP flow |
| — | Generate JWT_SECRET | Dev | `openssl rand -hex 32` |

### P1 — Important for quality launch

| # | Item | Owner |
|---|------|-------|
| #58 | Seed production DB + onboard first 10 providers | Ali |
| #60 | Landing page copy + GTA area/category SEO pages | Dev |
| — | Set `ADMIN_EMAILS=socialdots.ca@gmail.com` in prod env | Ali |
| — | Configure Stripe live keys (or disable pricing page for beta) | Ali |

### Post-launch

| # | Item |
|---|------|
| #59 | Social accounts + Week 2 content schedule |
| #22 | Wasp Marketplace MVP Scope Freeze |
| #23 | Worki-ai Content Machine Day0–Day7 |
| #24 | Worki-ai Launch Offer/Positioning |
| #25 | Worki-ai Paid Ads Test Launch |

---

## 5) Immediate Next Actions (May 18–26)

### Dev (can start now without external dependencies)
1. Run `wasp start db` + `wasp start` + `wasp db seed` → `wasp test` → document pass/fail
2. Fix any E2E failures found
3. Run `wasp build` to confirm clean production build
4. Generate `JWT_SECRET`: `openssl rand -hex 32`

### Ali (external accounts needed)
1. Provision Hostinger VPS (KVM 2 plan)
2. Provision PostgreSQL (Hostinger DB add-on recommended)
3. Verify Mailgun domain `thehelper.ca` — add SPF/DKIM records in Cloudflare
4. Buy Twilio CA number
5. Point `thehelper.ca` DNS to VPS IP in Cloudflare

---

## 6) GitHub Issue Map

| # | Title | Status |
|---|-------|--------|
| #55 | Stabilize E2E test suite | 🔴 Not started |
| #56 | Production deployment — Hostinger + Cloudflare | 🔴 Waiting on Ali: VPS + DB |
| #57 | Release verification checklist | 🔴 Not started |
| #58 | Seed DB + first 10 providers | 🟡 Waiting on Ali |
| #59 | Social accounts + Week 2 content | 🟡 Post-launch |
| #60 | Landing page copy + GTA SEO | 🔴 Not started |
| #61 | Fix remaining open issues | 🟢 Closed via this audit |
| #27 | OAuth env hygiene | ✅ Closed — code verified |
| #28 | GHL webhook hardening | ✅ Closed — code verified |
| #29 | Twilio signature validation | ✅ Closed — code verified |
| #31 | Provider onboarding redirect | ✅ Closed — code verified |
| #32 | Legal links + admin stubs | ✅ Closed — code verified |
