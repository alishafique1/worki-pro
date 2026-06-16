# /autoplan Review — worki-pro Launch Increment — 2026-06-14

**Plan file:** PLAN.md · **Branch:** `ship/gstack-launch-2026-06-14`
**Execution model:** orchestrator + 3 Sonnet sub-agents on disjoint file sets; orchestrator owns `main.wasp`, git, build, and review.

## CEO Consensus

| Dimension | Assessment | Consensus |
|---|---|---|
| Right problem? | Yes — broken interest collection + OTP abuse surface are the highest-leverage gaps blocking a confident launch. | CONFIRMED |
| Premises valid? | Verified in source: interests step renders a CTA not a picker; `verifyOtp` increments non-atomically; no origin check; resubmit op undeclared (build fails). | CONFIRMED |
| Scope calibration? | Tight: 7 source files + 1 main.wasp verify. Most historical backlog already shipped — did not re-do it. | CONFIRMED |
| 6-month regret? | None — these are launch-blocker + hygiene fixes, not architectural bets. | CONFIRMED |
| Competitive risk? | Each broken-onboarding session is a lost lead vs Bark/Thumbtack/Jobber. Fix now. | CONFIRMED |

## Design Review

Scorecard: Information hierarchy 8/10 · Missing states 7/10 (added interests + success + skeletons) · User journey 8/10 (interests now collected; 404 recovers) · Specificity 8/10 (tokens consistent). Decision: reuse `CategoryCardGrid`, optional interests, consumer success state with 3 next-step cards.

## Eng Review — failures addressed

| ID | Sev | Failure | Fix | File |
|----|-----|---------|-----|------|
| F2 | HIGH | `verifyOtp` attempts TOCTOU | Atomic guarded `updateMany(where attempts<5, increment)` → 429 if capped | `src/auth/otpApi.ts` |
| F3 | HIGH | No origin check on OTP endpoints | `isAllowedOrigin()` allowlist (env + thehelper.ca + localhost; allow no-Origin) → 403 | `src/auth/otpApi.ts` |
| F3b | MED | Password length client-only | Server reject `< 8` chars in `verifyOtp` | `src/auth/otpApi.ts` |
| F1 | HIGH | Consumer interests hardcoded `[]` | Step 3 = real `CategoryCardGrid`; submit passes `form.interestCategoryIds` | `OnboardingPage.tsx` |
| — | MED | Success screen bounced by redirect effect | `!done` guard on the already-onboarded redirect | `OnboardingPage.tsx` |
| F4 | MED | N+1 inserts (provider cat + consumer interest) | `createMany({ skipDuplicates })`, provider fetched once | `onboardingOperations.ts` |
| F5 | MED | Serializable signup-bonus tx | → `ReadCommitted` (dedup guard already prevents dupes) | `onboardingOperations.ts` |
| F8 | LOW | Listings search no debounce | `useDebounce(300ms)` drives query/filter | `ListingsPage.tsx` |
| F9 | LOW | Blank loading states | Layout-matched `animate-pulse` skeletons | `ListingsPage/DashboardPage/MyRequestsPage` |
| #11 | LOW | Dead-end 404 (demo-app target) | Role-aware home + Browse services / Contact support | `NotFoundPage.tsx` |
| BLK | HIGH | `resubmitProviderApplication` undeclared → build fails | Verified WIP already declares it; confirmed via clean `wasp build` | `main.wasp` |

## Decision Audit Trail

| # | Phase | Decision | Rationale |
|---|-------|----------|-----------|
| 1 | Git | Branch off main + merge origin/main | Owner choice; WIP preserved, remote integrated; merge was clean (origin = generated-only) |
| 2 | Plan | Audit source before assigning work | Avoided re-implementing ~half the backlog already shipped |
| 3 | Eng | Atomic `updateMany` not advisory lock for F2 | One-query fix; advisory lock is overkill |
| 4 | Eng | Origin allowlist allows no-Origin requests | Blocks browser CSRF without breaking native/server calls |
| 5 | Design | Reuse `CategoryCardGrid` for interests | Least new surface, consistent UX |
| 6 | Eng | `ReadCommitted` over `Serializable` | Dedup guard already prevents duplicate bonus; avoids retry thrash |
| 7 | Verify | Real `wasp build` + `tsc` on owner machine | Definitive; also regenerates SDK + deploy artifacts |

## Recommendation

Approve. All open P1/P2 items implemented and the build is green. P3/non-goals deferred to a follow-up sprint (listed in design-doc).
