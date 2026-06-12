# The Helper — Launch-Readiness Audit & Brand Review

_Date: 2026-06-09 · Reviewer: Claude · Scope: end-to-end codebase + brand/logo_

## Verdict

PLAN.md's claim that the product is **~95% code-complete is accurate.** All core marketplace flows exist as real, non-stub code. The remaining work is mostly **operational** (infra, env, provider onboarding) plus a short list of code issues below. The biggest open _product_ question is revenue collection (the $5 lead fee is recorded but not charged).

This session also **refreshed the brand/logo** and **fixed several quick-win code issues** (see "Changes made this session").

---

## 1. What's verified complete

| Area | Status | Evidence |
|------|--------|----------|
| Request wizard (4-step) | ✅ Real | `src/consumer/` + guest wizard |
| Lead feed with masking | ✅ Real | `getPublicLeadFeed` strips name/phone/email |
| Claim lead (idempotent, VERIFIED-only, $5 fee) | ✅ Logic real | `src/provider/operations.ts:665` |
| Appointment booking (Cal.com webhook) | ✅ Real | `src/server/webhooks/` |
| Reviews + ratingInternal recompute + moderation | ✅ Real | consumer + admin |
| Rewards + referrals | ✅ Real | reward account/txns |
| OTP (Twilio, rate-limited, hashed) | ✅ Real | timing-safe signature validation |
| Branded transactional emails | ✅ Real | `src/auth/email-and-pass/emails.ts` |
| Admin dashboards + moderation | ✅ Real | `src/admin/` |
| SEO (6 category + area pages, JSON-LD) | ✅ Real | `main.wasp` head + landing pages |
| E2E suite | ✅ Present | 6 specs, ~107 `test()` calls in `tests/e2e/` |

---

## 2. Blockers / decisions before launch

| # | Issue | Detail | Recommendation |
|---|-------|--------|----------------|
| B1 | **$5 lead fee is logged, not charged** | `claimLead` creates a `ProviderFee(QUALIFIED_LEAD, $5)` ledger row (`operations.ts:701`) but never calls Stripe to collect it. `STRIPE_API_KEY`/`STRIPE_WEBHOOK_SECRET` exist in env, and `src/payment/` is the leftover OpenSaaS **subscription** flow, not a per-lead charge. | Decide: auto-charge via Stripe at claim time, or invoice providers manually for v1. If manual, fine for launch — just be explicit. If auto, build a `chargeProviderFee` action. |
| B2 | **Build & E2E unverified** | `wasp build` and `wasp test` pass rates are unknown (PLAN.md D1/D2 not yet run). I could not run them here (no DB/Docker in this session). | Run `wasp build` then `wasp test`; fix selector drift; target 80%+. |
| B3 | **Infra at 0%** | VPS, Postgres, DNS, Mailgun domain, Twilio number all unprovisioned (PLAN.md A1–A5). | Highest-leverage path to launch; nothing deploys until done. |
| B4 | **`.env.server.example` is thin** | Has STRIPE/TWILIO but `DATABASE_URL` is commented out and `JWT_SECRET`, `WASP_WEB_CLIENT_URL`, `CALCOM_WEBHOOK_SECRET` aren't templated. | Add all prod-required vars as placeholders so nothing is missed at deploy. |

---

## 3. Should-fix (quality)

| # | Issue | Location |
|---|-------|----------|
| S1 | **Orphaned template code** — `Clients.tsx` + 4 fake client logos (Prisma/Astro/OpenAI/Salesforce) are imported nowhere. Harmless (not bundled) but should be deleted. _Deletion was blocked by this session's sandbox; do `rm src/landing-page/components/Clients.tsx && rm -rf src/landing-page/logos`._ | `src/landing-page/` |
| S2 | **Leftover OpenSaaS demo app** routed at `/demo-app` (not user-discoverable). Plus the subscription `PricingPage`/`CheckoutResultPage`. | `main.wasp:493+`, `src/demo-ai-app/`, `src/payment/` |
| S3 | **App identifier still `app OpenSaaS`** in `main.wasp:1`. Cosmetic but worth renaming. | `main.wasp:1` |
| S4 | Unused forbidden CSS utilities still defined (`glass-dark`, `mesh-gradient`, `btn-shine`, `card-glow-pink`). Not referenced by any component; safe to remove. | `src/client/Main.css` |

---

## 4. Brand review (logo + copy)

### Logo — ✅ refreshed this session
Redesigned as crisp vector: predominantly blue tile, white house, single amber growth arrow + tagline. Wired into NavBar, admin sidebar, auth pages, footer, favicon, and email header. See `docs/brand-guidelines.md`.

### Copy findings

| Issue | Location | Severity | Suggestion |
|-------|----------|----------|------------|
| Unsubstantiated superlative **"#1 home services concierge"** | `main.wasp` description / twitter | High | Drop "#1" or qualify ("a leading…"). Superlatives invite ad-standards challenges. |
| **"guaranteed work"** | twitter description | High | Remove or back with an explicit, documented guarantee policy. |
| **"GTA's Top Rated Pros"** | og:title | Medium | Soften to "Trusted local pros" unless you can cite ratings. |
| **Positioning split: "concierge / managed for you" vs "marketplace / get matched"** | meta + footer vs landing/CLAUDE.md | Medium | Pick one. The product is a two-sided marketplace; "concierge" overpromises a fully-managed service. |
| **Name inconsistency:** "TheHelper" (meta/title) vs "The Helper" (UI) vs "thehelper.ca" (logo) | `main.wasp`, components | Medium | Canonical: **The Helper** in prose, `thehelper.ca` as the wordmark. |
| **Tagline "Tackling your to-do list" unused in copy** | site-wide | Low | Use it as the hero sub-line — it's a strong, ownable line. |

**Before / after**
- _Before:_ "TheHelper is Milton, Oakville & Burlington's #1 home services concierge."
- _After:_ "The Helper matches Milton, Oakville & Burlington homeowners with vetted local pros — and pays you back on every job."

---

## 5. Changes made this session

**Brand / logo (wired in everywhere):**
- New assets: `public/logo.svg`, `logo-dark.svg`, `logo-icon.svg`, `favicon.ico` (multi-size), `apple-touch-icon.png`, `icon-512.png`, and `src/client/static/logo.webp` (icon) + `logo-icon.svg`.
- Updated: `NavBar` & admin `Sidebar` (via `logo.webp`), `AuthPageLayout`, `LoginPage`, `SignupPage`, `OnboardingPage` (replaced "H" placeholder badges with the icon), `Footer` (added icon), `main.wasp` head (svg favicon, apple-touch-icon, theme-color), and email templates (branded header).

**Token-compliance fixes:**
- `src/client/Main.css`: replaced the leftover template **pink (`#F2B5D7`)** `--primary`/`--accent`/`--ring` in both `:root` and `.dark` with the brand blue/navy palette; recolored the `card-glow-pink` shadow. No `#F2B5D7` or `#0C110F` remain in `src/`.
- Added `docs/brand-guidelines.md`.

---

## 6. Prioritized path to launch

1. **B3** Provision infra (VPS, Postgres, DNS, Mailgun, Twilio).
2. **B2** `wasp build` → `wasp test`; fix drift; 80%+ pass.
3. **B4** Complete `.env.server.example` + set prod env.
4. **B1** Decide lead-fee collection (manual invoice vs Stripe auto-charge).
5. **S1–S4** Delete template cruft, rename app, finalize copy fixes (§4).
6. Seed prod DB + onboard first 5–10 HVAC providers (Milton wedge).
