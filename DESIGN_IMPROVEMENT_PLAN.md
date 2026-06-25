# Front-End Design Consistency Overhaul — Plan

Branch: `claude/design-frontend-consistency-45kjng`

Goal: one consistent logo, one consistent navigation/layout language, one
color system, fix the auth "weird numbers", and connect the signup phone
number to GoHighLevel (GHL).

This plan is organized as a **stack of independent, reviewable phases** —
each phase compiles and stands on its own, and later phases build on earlier
ones (shared primitives first, then sweeping replacements, then the targeted
bug fixes).

---

## Audit summary (what's actually wrong)

**Logo (≈13 files):** No shared component — the logo markup is copy-pasted.
Two different assets are used (`logo-icon.svg` vs `logo.webp`), two text
treatments (multi-color `thehelper.ca` wordmark vs plain "The Helper"), and
five different sizes/radii (`h-9`, `w-10 h-10`, `w-8 h-8`, `w-7 h-7`, `h-8`).

**Color:** The truly-forbidden values (`#F2B5D7`, `#0C110F`) are **not** used.
But:
- Dead CSS utilities still defined in `Main.css`: `glass-dark`,
  `mesh-gradient`, `mesh-gradient-dark`, `btn-shine`, `card-glow-pink`.
- Forbidden aliases still defined in `Main.css:283–289`: `--surface-raised`,
  `--text-secondary`, `--text-tertiary`.
- Three conflicting status-badge color systems (admin Requests uses hex,
  admin Messages uses Tailwind `*-50/700`, Reviews mixes both).
- Heavy ad-hoc use of the standard blue/semantic ramp (`#1D4ED8`, `#BFDBFE`,
  `#EFF6FF`, `#DBEAFE`, `#60A5FA`, plus green/red/amber variants) written
  inconsistently as `bg-[#...]` vs `bg-blue-50`.

**Login "weird numbers":** `LoginPage.tsx` / `AuthPageLayout.tsx` are clean
and on-token. Needs live investigation (screenshots) + a review of the OTP
6-box input, per user direction.

**Phone → GHL gap:** `completeOnboarding` (`src/auth/onboardingOperations.ts`)
saves `phone` to the DB but never calls `sendLeadToGHL`. Phone only reaches
GHL when a service request / lead is later submitted. Confirmed gap.

---

## Decisions (confirmed with user)

- **Logo:** single shared `<Logo>` component using the multi-color
  `thehelper.ca` wordmark, with `variant="light|dark"` for nav vs dark
  sidebars/auth panels, and size props.
- **Color:** *extend tokens + centralize* — formalize the blue/semantic ramp
  as named tokens, define ONE status-badge helper, replace ad-hoc usages.
  Keep the current visual look; reduce churn.
- **Weird numbers:** investigate live + review the OTP input.

---

## Phase 1 — Shared Logo component
- Create `src/client/components/Logo/Logo.tsx` rendering the canonical
  multi-color wordmark (`the` muted · `helper` foreground · `.ca` primary),
  props: `variant` (light/dark), `size` (sm/md/lg), `withWordmark`, `asLink`.
- Use one asset (`logo-icon.svg`) consistently.
- Replace the inline logo in all ~13 sites: NavBar (desktop+mobile),
  ProviderLayout, ConsumerLayout, admin Sidebar, AuthPageLayout, LoginPage,
  SignupPage, EmailVerificationPage, PasswordResetPage,
  RequestPasswordResetPage, OnboardingPage, GuestRequestWizardPage, Footer.

## Phase 2 — Color token foundation (`Main.css`)
- Add named tokens for the in-use ramp under `@theme`/`:root`:
  `--color-primary-hover` (#1D4ED8), `--color-info-bg` (#EFF6FF),
  `--color-info-border` (#BFDBFE), success/warning/destructive bg+border+fg.
- Remove dead utilities (`glass-dark`, `mesh-gradient*`, `btn-shine`,
  `card-glow-pink`) and the forbidden aliases (`--surface-raised`,
  `--text-secondary`, `--text-tertiary`).
- Add a `statusBadge(status)` helper in a shared `src/client/lib` module so
  every status pill (admin/provider/consumer) renders from one map.

## Phase 3 — Color sweep across pages
- Replace the 3 status-badge systems with the Phase-2 helper (admin
  Requests/Messages/Reviews/Categories, provider + consumer dashboards).
- Normalize ad-hoc `bg-[#...]` / `bg-blue-50` pairs to the named tokens.
- No visual change intended — verify by screenshot diff on key pages.

## Phase 4 — Auth "weird numbers" + polish
- Run the app, screenshot every auth page (login, signup, OTP step,
  onboarding steps, verification/reset) to locate the reported numbers.
- Review/redesign the OTP 6-box input per findings.
- Ensure auth pages use the shared Logo (from Phase 1) consistently.

## Phase 5 — Phone → GHL connection
- In `completeOnboarding`, after the transaction commits, sync the new user
  to GHL via the existing `sendLeadToGHL` service (or a contact-only variant
  that doesn't require a `serviceRequestId` FK), passing `firstName`/`phone`/
  `email`/`postalCode`, `source: 'ONBOARDING'`, role-aware tags.
- Fire-and-forget; log to `WebhookLog`. Confirm `GHL_WEBHOOK_URL` env usage.

## Phase 6 — Verify & ship
- `wasp build` (typecheck) + targeted screenshots.
- Commit per phase; push to the feature branch.

---

## Status

- ✅ **Phase 1** — shared `<Logo>` component; all ~13 sites converted.
- ✅ **Phase 2** — tokens formalized, dead CSS + forbidden aliases removed,
  `statusBadge()` helper added.
- ✅ **Phase 3 (core)** — the 3 conflicting admin status-badge systems unified
  on the shared helper. Remaining ad-hoc `bg-[#...]` on icon containers /
  buttons left intentionally (not status pills); can be swept later.
- ⛔ **Phase 4** — BLOCKED in this sandbox: no `node_modules`/`wasp`, so the
  app can't run and auth pages can't be screenshotted. Code review of
  `LoginPage`, `AuthPageLayout`, and `OnboardingPage` shows clean, intentional
  UI (the OTP 6-box input and onboarding step numbers are standard). Need a
  screenshot or a pointer to the exact "weird numbers" to fix precisely.
- ✅ **Phase 5** — `syncContactToGHL` added and called from
  `completeOnboarding`; signup phone now reaches GHL.
- ⚠️ **Verification** — could not `wasp build`/typecheck in this sandbox
  (deps not installed). Changes are mechanical import/usage swaps; import
  paths checked by hand. Run `wasp start` locally to confirm.

## Risks / notes
- `sendLeadToGHL` currently keys `WebhookLog` on `serviceRequestId`; the
  onboarding sync needs a path that tolerates no service request (synthetic
  id or nullable log field) — handled in Phase 5.
- Color sweep is wide; relying on named tokens + screenshots to avoid
  regressions. Strict 8-token collapse was explicitly NOT chosen.
</content>
</invoke>
