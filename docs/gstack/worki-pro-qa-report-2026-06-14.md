# QA Report — worki-pro (thehelper.ca) — 2026-06-14

**Branch:** `ship/gstack-launch-2026-06-14` · **Boundary:** Plan + verify + PR

## Verification Results

| Check | Result |
|-------|--------|
| `wasp build` (full, regenerates SDK) | ✅ "successfully compiled" + "successfully built", 0 errors |
| `npx tsc --noEmit` (fresh SDK) | ✅ exit 0 |
| Duplicate/declaration sanity | ✅ `resubmitProviderApplication` declared once; all ops resolve |
| Design-token compliance | ✅ no forbidden colors/vars introduced (agent-constrained + reviewed) |
| Merge integrity | ✅ `origin/main` merged clean (generated-only), WIP source preserved |
| E2E (Playwright 70) | ⏳ pre-deploy gate — prior baseline 66/70 (4 known locator collisions) |

## What Changed (source)

7 files this session + WIP provider files already in branch history:

- `src/auth/otpApi.ts` — atomic OTP attempt cap (429), origin allowlist on both endpoints (403), server-side password-length validation.
- `src/auth/onboardingOperations.ts` — `createMany(skipDuplicates)` for provider categories + consumer interests (removed N+1); `Serializable` → `ReadCommitted`.
- `src/auth/onboarding/OnboardingPage.tsx` — real interests step (`CategoryCardGrid`), consumer success state (3 cards), `!done` redirect guard, standard nav on step 3, no more hardcoded `interestCategoryIds: []` on the completion path.
- `src/consumer/ListingsPage.tsx` — debounced search + loading skeleton.
- `src/consumer/DashboardPage.tsx` / `MyRequestsPage.tsx` — layout-matched skeletons.
- `src/client/components/NotFoundPage.tsx` — role-aware home target + Browse services / Contact support.
- `main.wasp` — verified `resubmitProviderApplication` action (WIP) compiles; no net change from this session.

## Residual Risks / Follow-ups (not blocking)

1. `requestOtp` rate-limit uses `count()` — same TOCTOU class as the (now-fixed) attempts race; would need a DB constraint/advisory lock. Low impact (3/5min window).
2. OTP-only fallback stores a random UUID as `hashedPassword` (pre-existing); not a hashed value — harmless (random, unknown) but worth a dedicated `OtpStash`/proper hash later.
3. `DiscoveryPage` search is still un-debounced (same pattern as fixed ListingsPage).
4. Password-reset flow does not re-check `isEmailVerified`.
5. Deferred non-goals: PWA, dark mode, axe a11y audit, pino expansion, `getMe` over-fetch trimming.

## Sign-off

Build green, types clean, scope contained, tokens compliant. **Ready for E2E gate → owner deploy.**
