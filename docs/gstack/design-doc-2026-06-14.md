# gstack Design Doc — worki-pro (thehelper.ca) Launch Increment — 2026-06-14

**Branch:** `ship/gstack-launch-2026-06-14` (off `main` incl. WIP `6dd9327`, merged `origin/main` `d7bf43b` — clean)
**Boundary:** Plan + verify + PR. Final VPS deploy is owner-triggered (Ali).
**Goal:** Close the genuinely-open launch backlog, prove a clean build, and hand off a deployable PR + runbook.

## Context

The Helper is a two-sided GTA home-services marketplace (Wasp 0.21 · React 19 · Tailwind v4 · Prisma 5 · Postgres). The site is **already live**; this increment ships hardening + UX fixes, not a first deploy. Strategy remains the narrow wedge (HVAC × Milton, expand weekly).

## Current State (audited against source, not docs)

Much of the historical backlog was already shipped and was **verified present** in current source:

| Item | Status in source |
|------|------------------|
| `/api/health` route (`api healthCheck`) | ✅ declared in `main.wasp`, handler in `src/server/healthCheck.ts` |
| `useRoleGuard('ADMIN')` on all `/admin/*` pages | ✅ present (`src/shared/useRoleGuard.ts`, applied) |
| Root `ErrorBoundary` wrapping `<Outlet/>` | ✅ both branches in `src/client/App.tsx` |
| Real `/discover` experience | ✅ `src/consumer/DiscoveryPage.tsx` (cards, filters, skeleton) |
| Structured logging scaffold | ✅ `src/server/logger.ts` |

So the design problem narrowed to a tight, high-leverage set (below) rather than the full historical list.

## Problems This Increment Solves

1. **Personalization silently broken (consumer onboarding).** Step 3 was *labeled* "Interests" but rendered a "Ready to get quotes?" CTA and submitted `interestCategoryIds: []`. The `ConsumerInterest` schema, the `completeOnboarding` arg, and the listings personalization all existed — but the UI collected nothing.
2. **OTP abuse surface.** `verifyOtp` counted attempts non-atomically (TOCTOU bypass of the 5-try cap); neither OTP endpoint checked request origin (CSRF / email-bombing); password length was only validated client-side.
3. **Onboarding backend hygiene.** N+1 inserts on `ProviderCategory` (a `findUnique` *inside* the loop) and `ConsumerInterest`; `Serializable` isolation on the signup-bonus transaction causing needless retry thrash.
4. **Dead-end 404.** Single "Go Back Home" button that routed logged-in users to the *demo app*; no browse/contact recovery.
5. **No perceived-performance affordances.** Search refiltered on every keystroke; data pages rendered blank while loading.
6. **Latent launch blocker.** WIP added `resubmitProviderApplication` (impl + client usage) but the build had never been regenerated, so the SDK didn't export it — the project would not compile as-is.

## Design Decisions (tokens & UX)

- All UI uses the canonical token set only (`#2563EB` primary, `#0F172A` navy, `#475569` slate, `#F8FAFC` bg, `#FFFFFF` surface, `#E2E8F0` border, `#22C55E` success, `#F59E0B`/`#FEF3C7` amber). No forbidden colors/vars introduced.
- Interests step **reuses** `CategoryCardGrid` (the component providers already use) rather than a bespoke picker — least new surface, consistent UX.
- Interests are **optional**; a "Skip for now" affordance is preserved. A lightweight **success state** (3 "what's next" cards) replaces the abrupt redirect for consumers.
- OTP origin check **allows** missing-Origin (native/server) and localhost dev, **rejects** mismatched browser origins — blocks CSRF without breaking same-origin SPA calls.

## Non-Goals (deferred, logged in autoplan-review)

PWA/service worker, dark mode, full a11y (axe) audit, expanding pino logging, `DiscoveryPage` search debounce, `requestOtp` count-race advisory lock, password-reset `isEmailVerified` recheck, `getMe` over-fetch trimming, dedicated `OtpStash` table for password handling.
