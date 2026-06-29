# The Helper — Logged-in UX & Flow Improvement Plan

_Status: PHASE 0 + 1 + CONTEXT-AWARE BOOKING — **LIVE ON PROD** — 2026-06-29_

**Decisions (2026-06-29):** (1) account creation from booking is **explicit opt-in**, never
silent. (2) Priority = **refine the existing flow now** — we're at ~0 users, so liquidity /
provider-notifications / funnel instrumentation (CEO's challenge) is parked in NOT-in-scope
until traffic exists. Polish the core flow first.

## Implementation status (2026-06-29)

Built by file-partitioned parallel agents, verified in a local browser against a seeded DB,
then **deployed to prod** (thehelper.ca) and re-verified live.

| Item | Status | Evidence (prod) |
|------|--------|-----------------|
| **0.0 Live OTP bug** (`StepOtp` checked `data.verified`, never returned) | ✅ shipped | real guest booking on prod completes OTP → lead created |
| **0.1 Onboarding loop** (`onboardingCompletedAt` flag + backfill migration + loading gate + fresh-auth reload) | ✅ shipped | OTP login on prod lands on `/account`, not looped; backfill 0 loop-risk |
| **0.2 Auth-aware wizard** (prefill, skip OTP, single submit, dashboard success banner) | ✅ shipped | logged-in wizard skips OTP, prefilled; 1 lead per booking |
| **0.3 De-dup** (single write path; `verifyOtp` seeds profile only, `$transaction`, no provider demotion; `skipOnboarding`; deleted dead `StepContact`) | ✅ shipped | guest booking creates exactly 1 ServiceRequest |
| **Phase 1 — editable consumer profile** (`AccountPage` rewrite, `updateUserProfile`, token parity) | ✅ shipped | phone edit persists |
| **Context-aware booking** (landing pages carry category + specific problem into the wizard) | ✅ shipped | `/plumbing` "Clogged drain" → wizard opens at Qualifiers, category + chip pre-selected |

**Extra fixes found during verification (not in original plan):**
- Seed scripts (`dbSeeds`, `seedRealProviders`) set `onboardingCompletedAt` — any future
  user-creation path must set this flag or those users get looped.
- `verifyOtp` persists `onboardingCompletedAt` when booking seeds a full profile.
- Submit button relabelled "Submit request →" for logged-in users.
- Fixed broken `?service=` category links on the 4 landing pages (wizard reads `?category=&slug=`).

## Open tasks (next)

- [ ] **Playwright E2E tests** — the 6 cases listed below are still unwritten (flows were
      verified manually, not automated).
- [ ] **Tailscale CI deploy** — `deploy.yml` is manual-trigger only and has the Tailscale +
      `migrate deploy` steps; still needs the `TS_OAUTH_CLIENT_ID`/`TS_OAUTH_SECRET` repo
      secrets + a `tag:ci` OAuth client + ACL before `gh workflow run deploy.yml` works
      end-to-end. Until then deploy is: trigger build → `ssh vps` rebuild.
- [ ] **Phase 1 remainder** — profile photo upload + password/email change (TODOs in `AccountPage`).
- [ ] **Phase 2 (trimmed)** — provider fee-tracking visibility only (inbox/payouts deferred).
- [ ] **Phase 3 polish** — request cancel/archive, rewards tier clarity, leads location filter,
      public-profile verified badge + "Book now".
- [ ] **Cosmetic** — wizard's failed-submit error persists across steps until next submit.
- [ ] **Clean up prod test data** — `e2e-booking-test@socialdots.ca` user + its test lead.

**Deploy notes (live):**
- Migrations do NOT auto-run on `docker compose` deploy — run
  `ssh vps 'docker exec -w /app/.wasp/out/db thehelper-api npx prisma migrate deploy'`
  (now also baked into `deploy.yml`'s VPS script).
- `WASP_WEB_CLIENT_URL` in **local** `.env.server` must be `http://localhost:3000` or Wasp
  CORS blocks every operation locally (prod VPS has its own env = `https://thehelper.ca`).

Grounded in a code-level audit of four areas: auth/onboarding redirects, the request
wizard, signup↔booking data duplication, and the authenticated dashboards/profile.

---

## Guiding principles

1. **One source of truth for user data.** Name, phone, postal code, email are collected
   once. Every later step (onboarding, new request, profile) reads from the `User` record.
2. **A logged-in user never re-authenticates and never re-types known info.** If a Wasp
   session exists, skip OTP and prefill everything we already have.
3. **Booking is the fast path to an account — with explicit consent.** "Book → verify
   email → account + profile created from the booking," but creation is surfaced in the UI
   ("this creates your free Helper account to track your request") with a "set a password"
   nudge. Never a silent surprise (CASL/consent). _[decided 2026-06-29]_
4. **Respect the design system.** Use only the approved tokens (Primary `#2563EB`, Navy
   `#0F172A`, Slate `#475569`, etc.). No new colours or CSS variables.

---

## Phase 0 — Critical flow bugs (P0, ship first)

### 0.1 Onboarding redirect loop ("logged-in user kicked back to onboarding")
**Root cause:** No explicit completion flag — `OnboardingPage` uses `user.firstName` as a
proxy (`src/auth/onboarding/OnboardingPage.tsx:81`), `onAuthSucceededRedirectTo` is a
blanket `/onboarding` (`main.wasp:85`), and after `completeOnboarding` the `useAuth` cache
can be stale so role guards (`src/shared/useRoleGuard.ts:22`) read the old `role` and
bounce the user.

**Fix:**
- Add `onboardingCompletedAt DateTime?` to `User` in `schema.prisma`; set it in
  `completeOnboarding` (`src/auth/onboardingOperations.ts:56`).
- `OnboardingPage` guard: redirect away iff `onboardingCompletedAt` is set (not `firstName`).
- After `completeOnboarding`, force a `useAuth` refetch (invalidate the query / re-`initSession`)
  before navigating, so role guards see fresh `role`.
- Make `onAuthSucceededRedirectTo` route via a small resolver: completed → dashboard for role;
  not completed → `/onboarding`.

### 0.2 Authenticated "New Request" flow (no re-auth, prefilled)
**Root cause:** `/account/request-service` redirects to the guest wizard `/get-quotes`
(`src/consumer/RequestServicePage.tsx`), which never calls `useAuth`, so nothing is prefilled
and the user is pushed through OTP again (creating a new session in `verifyOtp`).

**Fix:**
- Make `GuestRequestWizardPage` auth-aware: if logged in, prefill `firstName/email/phone/postalCode`
  from `useAuth()` and **skip the OTP step entirely**.
- For logged-in submits, call `submitServiceRequest` directly (session already proves identity);
  do not route through `verifyOtp`.
- After submit, also sync any newly-entered fields back to the `User` record.
- Read the `newRequest` query param on the dashboard to show a success toast / highlight the new card
  (currently passed but ignored — `GuestRequestWizardPage.tsx:77`).

### 0.3 De-duplicate signup ↔ booking data
**Root cause:** `verifyOtp` already accepts a `pendingRequest` that seeds the profile
(`src/auth/otpApi.ts:199`), but neither the wizard (`StepOtp.tsx:92`) nor signup
(`SignupPage.tsx:88`) passes it. Booking data lands only on `ServiceRequest`, so the user
re-types name/phone/postal at onboarding.

**Fix:**
- Wire the wizard's `StepOtp` to pass `pendingRequest` (firstName, phone, postalCode, smsConsent,
  category, description, qualifiers) to `verifyOtp` → profile auto-seeded on account creation.
- Prefill the onboarding form from the `User` record so any pre-seeded data shows and isn't re-asked.
- When booking pre-seeds a full profile, return `skipOnboarding: true` and send the user straight to
  the dashboard instead of `/onboarding`.
- Collapse the duplicate in-wizard steps: `StepDetails` and `StepContact` both collect
  firstName/email/phone — keep one.

---

## Phase 1 — Profile & consumer dashboard (P1)

- **Editable consumer profile.** `src/user/AccountPage.tsx` is read-only (email + username only).
  Build an edit form: first/last name, phone, postal code, profile photo, notification + SMS
  preferences, password change.
- **Profile completeness nudge** on the dashboard (checklist that unlocks rewards).
- **New-request acknowledgement** (toast + highlight) using the `newRequest` param.
- Surface provider rating on request cards before booking.

## Phase 2 — Provider portal & messaging (P1/P2)

- **Provider billing/earnings.** `src/provider/BillingPage.tsx` is bare. Add earnings summary,
  payout/fees history, downloadable receipts, subscription/payment-method management.
- **Earnings KPIs** on the provider dashboard (monthly earnings, acceptance rate, trends).
- **Unified messages inbox** for both consumer and provider (today messages are buried per-request);
  add `/account/messages` and `/provider/messages` with unread badges in the nav.

## Phase 3 — Polish (P2)

- Request lifecycle: cancel (new/pending) + archive (completed) in `MyRequestsPage`.
- Rewards: explain tier benefits + redemption threshold.
- Leads: location/service-area filter (`src/provider/LeadsPage.tsx`).
- Public profile: prominent verified badge + "Book now".

---

## Sequencing & dependencies

1. **0.1 first** (unblocks everyone from reaching their dashboard).
2. **0.3 then 0.2** (the `pendingRequest`/prefill plumbing in 0.3 is reused by 0.2).
3. Phase 1 profile editing depends on no schema work beyond 0.1's flag.
4. Phases 2–3 are independent and parallelizable.

## Risks / notes

- `schema.prisma` change (0.1) needs a migration (`wasp db migrate-dev`); on the VPS the
  Dockerised app runs migrations on deploy — verify.
- `useAuth` cache invalidation must be reliable, or 0.1 will appear "fixed" but still race.
- Skipping OTP for logged-in users must still verify the session server-side in
  `submitServiceRequest` (don't trust the client).

## Open questions for product

- Should booking auto-create a full account (skip onboarding) for **everyone**, or keep a
  light "set a password" step for returning login?
- Do we want lastName required, or first name only (current booking asks first name only)?
- Provider earnings: is payout handled in-platform, or just fee tracking for now?

---

# GSTACK REVIEW REPORT (/autoplan)

_Pipeline: CEO → Design → Eng. Dual-voice degraded to **subagent-only** (Codex not
installed). DX phase skipped (consumer marketplace, no developer-facing scope)._

## Consensus scorecards

**CEO (strategy)** — premises WEAK · right-problem WEAK · scope SOUND · alternatives MISSING · market-risk MISSING · 6-month WEAK.
**Design (UX)** — hierarchy 5 · states 3 · specificity 4 · auto-account 3 · design-system 6 · loop-fix 7 → ~4.7/10 ("correct diagnosis, under-designed remedy").
**Eng** — architecture RISK · tests GAP · migration GAP · security SOUND · error-paths RISK · deploy RISK.

## CRITICAL findings folded into the plan (mechanical, auto-decided)

- **LIVE BUG (new 0.0):** `StepOtp.tsx:95` checks `data?.verified`, but `verifyOtp` returns
  `{success,sessionId,isNewUser,requestId}` (`otpApi.ts:267`) — no `verified` key. Every guest
  wizard code entry throws "Incorrect code." Guest booking is broken in prod today. Fix:
  check `!res.ok || !data?.success`, and consume `sessionId`/`isNewUser`.
- **C1 — migration backfill (gates Phase 0):** adding `onboardingCompletedAt DateTime?` leaves
  every existing row NULL → all current consumers AND seeded/real VERIFIED providers read as
  "not onboarded" and loop. Hand-edit the migration with a backfill:
  `UPDATE "User" SET "onboardingCompletedAt" = COALESCE("updatedAt","createdAt") WHERE "firstName" IS NOT NULL OR "role" = 'PROVIDER';`
  Must run via `prisma migrate deploy` in the Docker entrypoint (ad-hoc seeds don't run on deploy).
- **C2 — single write path:** wiring `pendingRequest` into `verifyOtp` while the wizard also calls
  `submitServiceRequest` would create TWO ServiceRequests + double rewards. Decision (P3/P5):
  keep `submitServiceRequest` as the sole request-writer; `verifyOtp` only seeds the profile.
- **H2 — `onAuthSucceededRedirectTo` cannot be a function** in Wasp (static string). Do the
  completed→dashboard decision in `OnboardingPage`'s guard (it already has `getDashboardPath`).
- **H3 — cache fix:** `re-initSession` won't help (session unchanged by `completeOnboarding`).
  Invalidate the auth react-query and `await` the refetch before `navigate`; add an E2E assertion
  the provider lands on `/provider/dashboard`.
- **M1 — transaction + role:** `verifyOtp`'s pendingRequest block is non-transactional and forces
  `role='CONSUMER'` (demotes a provider who books). Wrap in `$transaction`; set role only when null.
- **M2 — trust server, not client:** for logged-in submits, override name/email/phone/postal from
  `context.user` server-side; don't trust the prefill round-trip.
- **Dead code:** `StepContact.tsx` is not imported — **delete** it (not "merge").
- **Design states (fold into 0.2):** replace the deleted wizard success screen with a dashboard
  success banner on `?newRequest=`; gate the auth-aware wizard on `authLoading`; prefilled fields
  stay editable + labelled "From your account"; profile sync is additive-only (never silent overwrite);
  inline error block for no-OTP submit failure.
- **Design reuse:** build the editable profile by reusing onboarding's `StepProfile` + validation,
  wrapped in the dashboard's `bg-white border-[#E2E8F0] rounded-[24px]` card — NOT shadcn `Card`
  (avoids the `AccountPage` design-primitive fork).
- **Tests (new section):** Playwright E2E for: existing-user not looped (post-backfill); new provider
  lands on provider dashboard; exactly one ServiceRequest + one reward per booking; logged-in submit
  attributes lead to session user even with a different typed email; OTP double-submit idempotent;
  provider not demoted via new-request flow.

## Decision Audit Trail

| # | Phase | Decision | Class | Principle |
|---|-------|----------|-------|-----------|
| 1 | Eng | Fix StepOtp `verified`→`success` (live bug), add as 0.0 | Mechanical | P1 |
| 2 | Eng | Add backfill SQL to onboarding migration; gate Phase 0 on it | Mechanical | P1 |
| 3 | Eng | Single write path: submitServiceRequest writes, verifyOtp seeds only | Mechanical | P3/P5 |
| 4 | Eng | Redirect decision in OnboardingPage guard, not onAuthSucceededRedirectTo | Mechanical | P5 |
| 5 | Eng | Auth-query invalidate + await refetch (not re-initSession) | Mechanical | P5 |
| 6 | Eng | Wrap pendingRequest seed in $transaction; set role only when null | Mechanical | P1 |
| 7 | Eng | Server-side override of contact fields for logged-in submit | Mechanical | P1 |
| 8 | Design | Dashboard success banner replaces deleted wizard success screen | Mechanical | P1 |
| 9 | Design | authLoading gate + editable prefill + additive-only sync + inline error | Mechanical | P1 |
| 10 | Design | Reuse StepProfile for editable profile (no shadcn fork) | Mechanical | P4 |
| 11 | Design | Delete dead StepContact.tsx | Mechanical | P4 |
| 12 | Eng | Add 6-test Playwright section | Mechanical | P1 |
| 13 | Design | Profile-sync is additive-only vs confirm-overwrite | TASTE | P5 |
| 14 | CEO/Design | Profile-completeness nudge: cut from this plan, spec separately | TASTE | P3 |
| 15 | CEO | Cut Phase 2 (inbox/payouts/billing) to fee-tracking-only for now | TASTE | P3 |
| 16 | CEO/Design | Auto-create account SILENTLY from booking | USER CHALLENGE | — |
| 17 | CEO | Prioritize liquidity/notifications/instrumentation BEFORE this UX work | USER CHALLENGE | — |

## NOT in scope (deferred)
Provider lead-notification loop, funnel instrumentation, payouts, unified inbox — flagged by CEO
as higher-leverage; see User Challenges. Recorded here, not silently dropped.
