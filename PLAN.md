# PLAN: TheHelper — Launch Readiness

## 2026-07-14 live audit addendum

Verified from `/Users/alishafique/Code/life-os` while updating project-root plans.

| Priority | Finding | Evidence | Action |
|---|---|---|---|
| P0 | Provider pricing is materially inconsistent. | `src/provider/LandingPage.tsx:81` says `$45 per booked job, or $199/mo`; `src/provider/ApplyPage.tsx:212` says `$5 per qualified lead... No subscriptions`; this PLAN locks `$5/lead`; July launch note says lead-credit packs with HOT=3 credits and STANDARD=1. | Choose one provider monetization model and update `/providers`, `/providers/apply`, Terms, onboarding emails, Stripe/claimLead implementation, and launch plans to match. |
| P0 | Rewards marketing conflicts with Terms / implementation / launch plan. | Landing promises `6,000 pts ... ≈ $60`; rewards page says `1,000 pts ≈ $10`, cash out at `10,000`; operations constants award 500/500/5000/500; Terms caveat no monetary value; July note says 5% cashback after 7 days. | Make one rewards policy canonical across UI, Terms, constants, redemption logic, and support copy. |
| P0 | Server-rendered SEO is one generic page for every route, including missing routes. | Curl found `/`, `/how-it-works`, `/providers`, `/providers/apply`, `/services/hvac`, `/terms`, `/privacy`, and `/nonexistent-xyz` all return HTTP 200, same shell, same title/meta. | Add prerender/static output for launch pages and a true 404; verify with curl. |
| P0 | Public site is effectively a JS-only shell to direct HTTP/crawlers. | Fresh fetches of `https://thehelper.ca`, `/help`, `/terms`, and `/rewards` returned only schema/title plus `You need to enable JavaScript to run this app.` | Add prerender/SSR/static fallback for homepage, legal, and SEO pages; browser-verify routes after deploy. |
| P0 | Prod infra/app health still needs a real smoke test. | Domain responds, but this pass did not verify API, DB, OTP, email, provider lead feed, or checkout/payment flows. | Run live browser smoke: homeowner request to OTP boundary, pro signup, lead feed, Mailgun/Twilio/GHL, DB seed state. |
| P0 | Marketplace supply may still be empty. | Vault index previously recorded 30 DB tables but 0 users/providers/service requests. | Confirm production seed state; seed real categories, admin user, and 5+ verified providers before public traffic. |
| P1 | Strong trust claims may overreach legal disclaimers. | Landing copy claims `Book a verified pro within 24 hours`, `licensed, insured`, `ready today`, `Every pro verified`, while Terms disclaim service outcomes/provider quality. | Replace absolute claims with verifiable standards and align Terms with marketing. |
| P1 | SMS consent checkbox is captured but not persisted into ServiceRequest. | Wizard state/StepDetails include `smsConsent`, but submit call omits `smsConsentGiven` and `smsConsentFormVersion`; server supports those fields and defaults false. | Pass consent fields into `submitServiceRequest`; verify DB record after guest and logged-in submissions. |
| P1 | Rewards claims need terms/economics reconciliation. | Code search found live claims like `6,000 pts on your first job (≈ $60)` and `Earn rewards on every completed job`. | Align rewards UI, ledger rules, and terms before launch; remove/soften unsupported cashback-like claims. |
| P1 | Positioning is broader than the stated HVAC × Milton wedge. | Live schema advertises handyman, plumbing, smart home, events, catering, shisha lounge, AI services, website design. | Choose launch wedge and align schema/nav/homepage/category content; hide unsupported categories until supply exists. |
| P2 | Sitemap/robots may be absent or served as app shell. | Route checks indicated `robots.txt`/`sitemap.xml` are not returning useful standalone crawler assets; invalid app routes return 200 shell. | Add `/robots.txt` and `/sitemap.xml` with canonical launch URLs only; verify both return text/xml, not the app shell. |
| P2 | Unverified scale metrics need substantiation or removal. | Code includes `500+ GTA Homeowners` and `50+ verified GTA pros and growing`, while launch note says seed/onboard first providers is pending. | Replace with `now onboarding` / `early access` until production counts support the claims. |

Mirror summary also written to `life-os/2-Areas/work/thehelper/PLAN.md`.

---

Date: 2026-06-27 | Branch: `launch/coherence-2026-06-27` | Status: PRE-FLIGHT

## Summary

12 commits of agent consolidation merged into `launch/coherence-2026-06-27`, 12 commits ahead of `main`. App runs locally at `localhost:3000`. DB is local Postgres (30 tables, empty). Prod infra state unknown — PLAN.md from 2026-05-26 needs reconciliation.

---

## What's Done (as of 64b1d81)

| Feature | Status | Notes |
|---------|--------|-------|
| 4-step service request wizard | ✅ | Category → Qualifiers → Details (location+contact) → Verify |
| Lead feed for providers (masked) | ✅ | Bark-style, filter by category + urgency |
| Lead claiming ($5, idempotent) | ✅ | Wrapped in `$transaction` |
| Appointment booking (Cal.com + .ics) | ✅ | |
| Review system (PENDING/PUBLISHED/REJECTED) | ✅ | |
| Reward accounts + transactions | ✅ | |
| Referral system | ✅ | |
| OTP flow (Twilio, rate-limited) | ✅ | |
| Email templates (branded, Mailgun) | ✅ | |
| Cookie consent bar | ✅ | |
| Provider application page | ✅ | Pricing block + next-steps explainer |
| Provider verification badges | ✅ | TSSA/ESA/WSIB on landing page |
| Trust section (no testimonials) | ✅ | |
| DB-first category questions | ✅ | `ServiceCategory.questions` Json, not hardcoded |
| Login/signup layout + back link | ✅ | |
| `/pros/` rename | ✅ | |
| H1 audit | ✅ | |

---

## Code Quality Findings (from /autoplan review of charm.. branch)

These items were flagged for `launch/coherence-2026-06-27`. Status on THIS branch unverified.

| # | Finding | Severity | Recommended Action | Status on coherence |
|---|---------|----------|-------------------|---------------------|
| F1 | `claimLead` — wrapped in `$transaction` | Critical | Include in integration | ✅ merged (charm.. → coherence) |
| F2 | Polar dead code deleted | Low | Delete `src/payment/polar/` | ✅ deleted |
| F3 | Shared validation (`src/auth/onboarding/validation.ts`) | Medium | Shared client/server regex | ✅ merged |
| F4 | Onboarding in `$transaction` (Serializable) | Medium | `completeOnboarding` atomic | ✅ merged |
| F5 | `aria-pressed` on StepRole cards | Low | Add `aria-pressed={isSelected}` | Unverified |
| F6 | `role="alert"` on `<p>` instead of `<div>` | Low | Fix error container element | Unverified |
| F7 | `.wasp/out` drift from `src/` | High | src/ must be source of truth | ⚠️ 347 modified `.wasp/out` files |
| F8 | Concurrent lead-claim race | Medium | Needs unique constraint or `SELECT FOR UPDATE` | Deferred |

---

## Pre-Flight Checklist — Required before merge to `main`

### 🔴 Must verify before merge

| # | Task | Owner | Status |
|---|------|-------|--------|
| PF1 | Run `wasp build` — confirm clean build | Dev | ⬜ |
| PF2 | Verify F5 + F6 (aria-pressed, role="alert") are in src/ | Dev | ⬜ |
| PF3 | Diff `.wasp/out/` vs `src/` — identify real drift vs generated diff | Dev | ⬜ |
| PF4 | Run `wasp db migrate-dev --name coherent` to bake schema into out/ | Dev | ⬜ |
| PF5 | Review 4-step wizard end-to-end in browser | Dev | ⬜ |

### 🟡 Should verify

| # | Task | Owner | Status |
|---|------|-------|--------|
| PF6 | Verify onboarding transactional safety on THIS branch | Dev | ⬜ |
| PF7 | Check `src/payment/polar/` is absent | Dev | ⬜ |
| PF8 | Check `src/auth/onboarding/validation.ts` exists | Dev | ⬜ |

---

## Infrastructure Status — UNKNOWN

PLAN.md (dated 2026-05-26) lists these but status on current date is unclear:

| # | Task | PLAN says | Current state | Status |
|---|------|-----------|---------------|--------|
| A1 | Hostinger VPS provision | Not done | Unknown | ⬜ |
| A2 | PostgreSQL (Neon) | Neon connected | Local Postgres running | ⚠️ reconcile |
| A3 | DNS → VPS IP | Not done | Unknown | ⬜ |
| A4 | Mailgun SPF/DKIM verify | Not done | Configured in env | ⬜ |
| A5 | Twilio CA number | Not done | Unknown | ⬜ |
| P1 | VPS: Node 20 + Nginx + PM2 | Not done | Unknown | ⬜ |
| P2 | Nginx reverse proxy | Not done | Unknown | ⬜ |
| P3 | Deploy Wasp build | Not done | Unknown | ⬜ |
| P4 | All env vars set | Not done | Local only | ⬜ |
| P5 | Smoke test | Not done | Unknown | ⬜ |
| D5 | Generate JWT_SECRET | Not done | Set in env | ✅ |

**Action required:** Confirm actual prod infrastructure state before next deploy.

---

## Post-Merge to Main (before launch)

| # | Task | Owner |
|---|------|-------|
| L1 | Seed prod DB with real providers + categories | Ali |
| L2 | Onboard first 5-10 HVAC providers | Ali |
| L3 | Stripe live keys configured | Ali |
| L4 | ADMIN_EMAILS set in prod | Ali |
| L5 | Configure Stripe live keys | Ali |
| L6 | E2E smoke test against prod | Dev |
| L7 | GHL webhook wired (lead routing + OTP SMS) | Dev |

---

## Post-Launch

| # | Task |
|---|------|
| S1 | Social accounts + Week 2 content schedule |
| S2 | Expand to Handyman category (week 2-3) |
| S3 | Expand to Oakville/Burlington (week 4) |
| S4 | Google Ads "Milton HVAC repair" (week 2-3) |
| S5 | CI/CD pipeline (GitHub Actions) |

---

## Key Decisions

1. **Narrow wedge: HVAC × Milton only** — maximize provider density before expanding
2. **Manual provider onboarding** — build relationship capital, automate later
3. **$5/lead, no subscriptions** — simplest pricing model for launch
4. **No CI/CD for launch week** — manual deploy saves 2-3 days setup
5. **Docker Wasp build on VPS** — recommended production path
6. **Do NOT skip provider verification** — verification IS the competitive moat
7. **`.wasp/out/` is generated** — never edit directly; next `wasp build` will overwrite

---

## Repo State

- **Active branch:** `launch/coherence-2026-06-27` (12 commits ahead of `main`)
- **Worktrees:** 2 active (`.claude/worktrees/charming-agnesi-ea572e`, `.claude/worktrees/gifted-burnell-623b86`), 3 prunable worktrees removed
- **Stashes:** 0 (all dropped as stale `.wasp/out/` artifacts)
- **Stack:** Wasp 0.21, React 19, Tailwind CSS 4, Node.js/Express, Prisma v5, PostgreSQL
- **Integrations:** Twilio, Mailgun, Stripe, Cal.com, GHL (webhook URLs empty), AWS S3, PostHog