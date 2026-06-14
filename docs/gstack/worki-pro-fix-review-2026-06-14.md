# Fix Review — worki-pro Launch Increment — 2026-06-14

Per-fix detail with file references. All verified by clean `wasp build` + `tsc --noEmit`.

## Auth / OTP security — `src/auth/otpApi.ts`

- **F2 — Atomic attempt cap.** Replaced the unconditional post-find increment with an atomic guard: `prisma.otpCode.updateMany({ where: { id, attempts: { lt: 5 } }, data: { attempts: { increment: 1 } } })`; `count === 0` → `HttpError(429)`. Closes the TOCTOU window where concurrent bad codes both passed `attempts < 5`.
- **F3 — Origin check.** New `isAllowedOrigin(req)` helper; first line of both `requestOtp` and `verifyOtp` returns `403` on a mismatched browser `Origin`. Allowlist = `WASP_WEB_CLIENT_URL`, `https://thehelper.ca`, `https://www.thehelper.ca`, localhost/127.0.0.1 dev; missing Origin (native/server) allowed. Mitigates CSRF + email-bombing.
- **F3b — Server password length.** `verifyOtp` rejects a provided password `< 8` chars with `400` before any DB work.

## Onboarding ops — `src/auth/onboardingOperations.ts`

- **F4 — Batched inserts.** Provider categories: fetch provider once, then a single `ProviderCategory.createMany({ skipDuplicates: true })` (removed the per-iteration `findUnique` N+1). Consumer interests: single `ConsumerInterest.createMany({ skipDuplicates: true })`.
- **F5 — Isolation.** Signup-bonus `$transaction` `Serializable` → `ReadCommitted`; the existing `findFirst` dedup guard still prevents duplicate bonuses, avoiding retry thrash.

## Onboarding UX — `src/auth/onboarding/OnboardingPage.tsx`

- **F1 — Interests actually collected.** Consumer step 3 now renders `CategoryCardGrid` wired to `form.interestCategoryIds` + `toggleInterest`; the completion path passes real interest IDs (the old inline button that hardcoded `[]` is gone). "Skip for now" preserved (explicit empty skip).
- **Success state.** On consumer completion, a success view renders 3 next-step cards: Get quotes (`/get-quotes`), Browse services (`/services`), See how rewards work (`/how-rewards-work`).
- **Redirect race.** The already-onboarded redirect effect now guards on `!done` so it can't bounce a user off the success screen after the auth refetch.

## Consumer polish

- **F8 — `src/consumer/ListingsPage.tsx`:** `useDebounce(searchQuery, 300)` drives the query arg + client filter; raw value keeps the field snappy.
- **F9 — skeletons:** `ListingsPage`, `DashboardPage`, `MyRequestsPage` render layout-matched `animate-pulse` placeholders while `isLoading` (token-compliant `bg-[#E2E8F0]` on white).
- **404 — `src/client/components/NotFoundPage.tsx`:** primary "Go Back Home" now role-aware (provider→`/provider/dashboard`, other logged-in→`/dashboard`, anon→landing) instead of the demo app; added Browse services (`/services`) + Contact support (`/contact`).

## Launch blocker — `main.wasp`

- `resubmitProviderApplication` (impl in `src/provider/operations.ts`, used via `useAction` in `ProfilePage.tsx`) was declared by the WIP commit but the SDK had never been regenerated, so types didn't export it → project wouldn't compile. Confirmed the single declaration is correct and the regenerated build resolves it. (A transient duplicate added during diagnosis was reverted.)
