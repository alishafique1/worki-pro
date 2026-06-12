# /autoplan Review — worki-pro Onboarding + Frontend/Backend Improvements (2026-06-11)

**Plan file:** PLAN.md
**Branch:** main
**Reviewer scope:** Ali asked for (1) bug fix for 4 emails + login redirect, (2) brainstorm + gstack auto-plan for onboarding + frontend/backend improvements. The bug fixes are already in (see bf2c13d). This doc covers the brainstorming + planning.

## Bug Fix Recap (already committed)

1. `src/auth/SignupPage.tsx:38` — was calling non-existent `/auth/signup`. Now calls `/api/auth/request-otp` only (one email).
2. `src/auth/otpApi.ts:128-138` — `verifyOtp` now accepts an optional `password`, hashes it via `wasp/auth/password` `hashPassword`, and stores as the auth identity. Users can later sign in via the password form.
3. `src/auth/SignupPage.tsx:114`, `src/auth/LoginPage.tsx:97`, `src/consumer/components/wizard/StepVerifyEmail.tsx:91` — replaced `setSessionId(data.sessionId)` with `await initSession(data.sessionId)`. `initSession` invalidates the React Query cache so `useAuth()` refetches the user before `/onboarding`'s `authRequired: true` check fires. This was the cause of the redirect-to-`/login` after OTP verify.
4. Friendly error messages — all `JSON.parse("<!DOCTYPE...")` strings now show "Something went wrong reaching our server."

## Brainstorm — current state of the product

### Onboarding (3-step for consumers, 4-step for providers)

**Current consumer flow** (OnboardingPage.tsx):
- Step 1: Role pick (consumer vs provider)
- Step 2: Profile (first name, last name, phone, postal code, SMS consent, optional referral)
- Step 3: Big "Find a local pro →" button → `/get-quotes` (or skip for now)

**Pain points I see on read-through:**

1. **Consumer step 2 has no "interests" step** — Schema has `ConsumerInterest` table, `completeOnboarding` accepts `interestCategoryIds`, and the listings page filters by interest. But the UI collects nothing. This is a real gap — a consumer who selects "HVAC" interests gets a tailored dashboard. Currently zero personalization.
2. **No "where do you live" beyond postal code** — Service-area is determined by `getServiceCategories` + provider regions. The user picks a postal code, but no validation against an actual service area. A user in Sudbury sees the GTA landing.
3. **Provider step 3 has no service-area validation** — `serviceAreas` is a free-text CSV. The schema has a `ServiceArea` table. No UI to pick from canonical areas (Milton, Oakville, Burlington…).
4. **Provider step 4 lets you pick categories** — but `serviceCategoryIds` is a flat list. The schema has parent/child category tree. UI shows parent + children as flat buttons, which is fine, but a category picker is duplicated in `/provider/ServicesPage` later. Two places to do the same thing.
5. **"Skip for now" in step 3 (consumer) goes to `/dashboard` without `interestCategoryIds`** — no personalization happens. Even if the user picked interests, the inline button at line 246 hardcodes `interestCategoryIds: []`. That bug needs a fix.
6. **`useAuth()` redirect on step 1+ already-completed users** — if a returning user lands on `/onboarding` with `user.firstName` set, the `useEffect` redirects to dashboard. But race conditions on slow networks could land them in the form.
7. **No success state after onboarding** — the user fills the wizard, hits "Complete Setup" or "Find a local pro", and gets dropped on dashboard. No "Welcome to The Helper — here's what to do next" empty state with educational cards.

### Frontend

8. **Landing page doesn't reflect logged-in state** — `/listings`, `/discover`, `/get-quotes` all work pre-auth, but there's no "Hi Ali, you've used 2 of 3 free quotes" personalization. The NavBar gets a logged-in dropdown but the body content is the same.
9. **`useRoleGuard('CONSUMER')` runs on every page but `getMe` fires 6+ times per navigation** — `useQuery(getMe)` inside `useAuth` and again in `useRoleGuard`. React Query dedupes by key, but the `getMe` is re-fired on tab focus. Cheap, but worth noting.
10. **No skeleton loaders** — every page shows blank space while `useQuery` is pending. `DashboardPage`, `MyRequestsPage`, `ListingsPage` all blank until data lands.
11. **404/NotFoundPage is dead simple** — no recovery actions (browse services, return to home, contact support).
12. **No dark mode** — `useColorMode` hook exists in the SDK but no UI surfaces it. The css file likely doesn't define dark variants. Brand question.
13. **No keyboard nav tested** — the 6-digit OTP inputs, modals, dropdowns aren't documented to be keyboard-navigable.
14. **No `loading.tsx` / Suspense boundaries** — react-router v7 + lazy routes could give instant perceived perf wins.
15. **Lead form wizard (`GuestRequestWizardPage`) is 5 steps with sub-step branching in `StepVerifyEmail`** — that single file is 208 lines with both `enter-email` and `verify-code` modes. Could be split. Not blocking.
16. **Search input in `ListingsPage` is a controlled `<input>` with no debounce** — every keystroke refilters. The `useDebounce` hook exists but isn't used.
17. **`/discover` page is dead/simple** — only 5-7 lines, basically a placeholder. Should be a real discovery experience.
18. **The login page has "Sign in with password" toggle but no "Sign up with password"** — the signup page is OTP-only. Inconsistency.
19. **No service-worker / PWA** — would massively help "Add to Home Screen" UX for contractors in the field.
20. **No React error boundary** — `ErrorBoundary` exists in old admin code but it's not wrapping the app. A single bad component kills the whole SPA.

### Backend

21. **`verifyOtp` rate limit is `attempts: { lt: 5 }` in WHERE clause, then increments in a separate query** — race condition: two concurrent bad-code requests can both pass the `lt: 5` check before either increments. Should be atomic (`UPDATE ... SET attempts = attempts + 1 WHERE ... RETURNING attempts`).
22. **No CSRF protection on the OTP routes** — `/api/auth/request-otp` and `/api/auth/verify-otp` are public POST endpoints. A malicious site could trigger OTPs to arbitrary emails (SMS-bombing via the GHL webhook) or enumerate valid emails via the response timing.
23. **`requestOtp` and `verifyOtp` aren't declared with `authRequired: false` explicitly** — they're in `api {}` blocks so they're public by default, but it's worth a comment.
24. **No `lastLoginAt` on User** — schema has it? Let me check. Useful for "where are you logging in from" admin view.
25. **No server-side password complexity validation** — `requestOtp` accepts any `password` length. The client validates 8 chars but a malicious user POSTs to verifyOtp directly with 1 char.
26. **Email auth login (`login({email, password})`) does not check `isEmailVerified`** — a user who started signup, never verified, sets a password, and tries to login might be able to. Actually, our `verifyOtp` sets `isEmailVerified: true` so this is fine for the OTP flow. But the password-reset flow grants login without re-verifying.
27. **`completeOnboarding` is N+1 on `ProviderCategory` inserts** — `deleteMany` then N `create`s. Should be `createMany`.
28. **`prisma.$transaction` for SIGNUP_BONUS is at isolation level `Serializable`** — `Serializable` retries on conflict. Under concurrent requests, this can thrash. `ReadCommitted` is fine for a single-user insert and avoids retries.
29. **`getMyRequests` includes `communicationLogs` and `appointments` and `assignedProvider` and `serviceCategory`** — N+1 risk if Prisma can't batch. For 1 user with 5 requests, that's 4 queries × 5 = 20. Probably fine.
30. **`getPublicLeadFeed` (referenced in AGENTS.md) wasn't found in operations.ts** — the lead feed might be a separate query. Let me check.
31. **No email on new signups sent to admins** — when a new provider applies, the GHL webhook fires. But for consumer signups, nothing tells the team. Low priority.
32. **No `signOut` cleanup** — `logout()` from `wasp/client/auth` should call `clearSessionId`. Verify it does.
33. **`/auth/me` returns full User object on every page** — over-fetching. Make it return only what useAuth needs (id, email, role, firstName, isAdmin).
34. **No request ID / structured logging on operations** — debugging a failed `claimLead` requires log diving. Add `pino` or similar.
35. **No DB indexes on common query patterns** — `getMyRequests` filters by `consumerId`. Is there an index? Probably yes (`@@index([consumerId])`) but worth verifying.
36. **`/api/health` doesn't exist** — Dockerfile HEALTHCHECK pings it. Either expose it or remove the HEALTHCHECK.
37. **The api container is on a "stale IP" risk** — current `10.0.1.6` is on the `coolify` network. If Coolify recreates the container, IP changes. **The new `deploy/nginx.conf` uses Docker DNS** (`thehelper-api:3001`) so the web container self-heals. But the API container itself doesn't pin its IP, and external services (Cal.com webhook, Stripe webhook, etc.) might rely on the old IP. Check.
38. **`/admin/ProvidersPage`, `/admin/RequestsPage`, `/admin/ReviewsPage`, `/admin/RewardsPage` all have `authRequired: true` but no `useAdminGuard`** — any logged-in user could hit `/admin/...` and see admin UI. The Prisma query would respect `isAdmin` but the UI should redirect non-admins.
39. **No CSP nonce / unsafe-eval** — `script-src 'self'` is in nginx but Vite production builds use a single bundle so no eval needed. Probably fine.
40. **`wasp/client/auth` `login()` is used but the page also exposes "Sign in with password"** — inconsistent. Either go all-in on OTP (better UX, matches industry) or all-in on password.

---

## /autoplan — Auto-Decided Plan (CEO + Design + Eng + DX)

### CEO consensus

| Dimension | Assessment |
|---|---|
| Right problem to solve? | YES — onboarding completion is the highest-leverage UX gap. Every user that drops off at step 3 of 3 is a lost lead. |
| Premises valid? | "Interests not collected" confirmed by reading OnboardingPage and `completeOnboarding` signature. |
| 6-month regret? | Skip /interest collection for 2 more months → consumer dashboards stay generic → no A/B data for which categories convert → can't prioritize provider supply. |
| Scope calibration? | Onboarding polish + backend hygiene = right scope. Avoid a redesign. |
| Alternatives? | Could rebuild onboarding in a new wizard. Rejected: 70% of the wizard is fine; fix the 3 real gaps. |

**CEO decision:** Ship the P1 onboarding fixes. Defer admin guardrails and PWA to next sprint.

### Design review

| Dimension | Score | Notes |
|---|---|---|
| Information hierarchy | 7/10 | Step 1 (role) → Step 2 (profile) → Step 3 (interests / done) is a clean arc. |
| Missing states | 5/10 | No success/empty state after onboarding, no loading skeletons, no error recovery on wizard. |
| User journey | 6/10 | Consumer "Skip for now" silently breaks interests collection (line 246 hardcodes `[]`). |
| Specificity | 7/10 | Design tokens consistent. |
| Accessibility | 4/10 | OTP input paste handler exists; no other a11y tested. |

**Design decision:** Add an "interests" step for consumers (moved before the "Find a pro" CTA), add a success state with 3 next-step cards.

### Eng review — failures / gaps

| ID | Severity | Failure | Fix |
|---|---|---|---|
| F1 | HIGH | Consumer step 3 "Find a pro" hardcodes `interestCategoryIds: []` (OnboardingPage.tsx:244). Personalization silently broken. | Read `interestCategoryIds` from form state. |
| F2 | HIGH | `verifyOtp` race condition on `attempts: { lt: 5 }` (otpApi.ts:107-119). Concurrent bad-code requests bypass the limit. | Use atomic `prisma.otpCode.update` with `where: { id, attempts: { lt: 5 } }` and check returned row. |
| F3 | HIGH | No CSRF on `/api/auth/request-otp`. SMS/email-bombing risk. | Add origin check (`req.headers.origin === WASP_WEB_CLIENT_URL`) or CSRF token. |
| F4 | MED | `completeOnboarding` N+1 on ProviderCategory insert (onboardingOperations.ts:62-74). | Use `createMany` with `skipDuplicates: true`. |
| F5 | MED | `completeOnboarding` Serializable isolation unnecessary (line 135). | Drop to default isolation. |
| F6 | MED | No `useAdminGuard` for `/admin/*` pages. | Add shared `useRoleGuard('ADMIN')` like the consumer/provider ones. |
| F7 | MED | `/api/health` 404 breaks HEALTHCHECK. | Add a 5-line health route or remove the HEALTHCHECK directive. |
| F8 | LOW | Listings search input not debounced (ListingsPage.tsx). | Use the `useDebounce` hook (already in SDK). |
| F9 | LOW | No skeletons. | Add `<Skeleton>` per major query. |
| F10 | LOW | `/discover` page is a placeholder. | Replace with curated "Popular services" + "Top pros near you" feeds. |
| F11 | LOW | No React error boundary at root. | Wrap `<App />` in an `<ErrorBoundary>` that reloads on crash. |
| F12 | LOW | `login({email, password})` doesn't re-check `isEmailVerified`. | Add check in `getEmailUserFields` or in `login()`. |

### DX review — N/A (no new developer-facing surface; this is internal cleanup + UX polish).

---

## Implementation Tasks (auto-decided, prioritized)

### P1 (do this week)

- [ ] **F1 (CC: 5 min)** Fix `OnboardingPage.tsx:244` to pass `form.interestCategoryIds` instead of `[]`.
- [ ] **F2 (CC: 15 min)** Atomic `attempts` increment in `verifyOtp` (otpApi.ts:107-130). Use `prisma.otpCode.update({ where: { id, attempts: { lt: 5 } }, data: { attempts: { increment: 1 } } })` and check rowsAffected.
- [ ] **F3 (CC: 30 min)** Origin check on `/api/auth/request-otp` and `/api/auth/verify-otp`. Reject if `req.headers.origin` doesn't match `WASP_WEB_CLIENT_URL`. Tighten rate limit to 5/min.
- [ ] **F4 (CC: 5 min)** `completeOnboarding` ProviderCategory: replace loop with `createMany`.
- [ ] **F5 (CC: 1 min)** Drop Serializable isolation in `completeOnboarding`.
- [ ] **F6 (CC: 30 min)** `useAdminGuard` + apply to all `/admin/*` pages.

### P2 (next sprint)

- [ ] **F7 (CC: 5 min)** Add `/api/health` route that returns 200 + DB ping.
- [ ] **F8 (CC: 5 min)** `useDebounce` on ListingsPage search.
- [ ] **Onboarding "interests" step** for consumers (between current step 2 and step 3). 30 min CC. Schema already supports it.
- [ ] **Success state after onboarding** with 3 "what's next" cards (browse services, set up your home profile, see how rewards work). 45 min CC.
- [ ] **Skeleton loaders** for DashboardPage, MyRequestsPage, ListingsPage. 1h CC.

### P3 (backlog)

- [ ] **F9** Skeletons
- [ ] **F10** `/discover` page redesign
- [ ] **F11** React error boundary
- [ ] **F12** `login()` isEmailVerified check
- [ ] **PWA / service worker**
- [ ] **Dark mode**
- [ ] **A11y audit (axe-core)**
- [ ] **Structured logging with pino**

### NOT in scope (deferred)

- PWA, dark mode, redesign of `/discover`. Keep this PR small.
- Migrating the password field to a separate schema column. Currently we hash on the fly in `verifyOtp` from the client-sent password; for production hardening, add an `OtpStash` table or use the User's existing `hashedPassword` after first login. Add a TODO.
- Auto-detecting service area from postal code. Needs a `ServiceArea` table read.
- Email verification link as a fallback for OTP. Currently the link is dead because the user never sets a password outside of OTP. Could keep as backup for password-based signup.

---

## Cross-Phase Themes

**Theme: Bypass rate limiting** — appears in F2 (race condition) and F3 (no origin check). Both allow bad actors to enumerate / bomb. Fix together.

**Theme: Personalization silently broken** — F1 + missing interests step. Both prevent the consumer dashboard from being useful. Fix together.

---

## Decision Audit Trail

| # | Phase | Decision | Principle | Rationale |
|---|---|---|---|---|
| 1 | CEO | Ship onboarding P1 fixes this week | P1 complete | Highest-leverage UX gap. |
| 2 | Eng | F2 atomic increment, not row lock | P5 explicit | One-line fix vs advisory lock. |
| 3 | Eng | F3 origin check, not CSRF token | P5 explicit | One-line check; CSRF token requires client changes too. |
| 4 | Eng | F4 createMany, not batched loop | P5 explicit | Prisma supports it directly. |
| 5 | Eng | F6 admin guard, not server-side check | P5 explicit | Prisma already filters; UI redirect is the user-visible fix. |
| 6 | Design | Add interests step, not a separate "discovery" page | P5 explicit | Reuse existing schema + step UI. |
| 7 | Design | Success state, not celebratory modal | P1 complete | Lets the user move forward, not block. |
| 8 | DX | Skip | N/A | No new public API. |

**No User Challenges. No taste decisions surfaced at the gate.**

---

## Recommendation

**Approve P1 tasks (6 items, ~2h CC), ship as one PR. P2 in next sprint. P3 backlog.**

If approved I'll execute the P1 tasks now, then commit and deploy. P2 needs a separate session to scope correctly.
