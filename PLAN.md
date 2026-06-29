# PLAN: TheHelper — Launch Readiness
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