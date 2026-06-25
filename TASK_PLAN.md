# The Helper — Front-End Overhaul: Full Project Plan

A stacked, **assignable** plan with explicit **deliverables** per task. Designed
so independent agents can run in parallel without touching the same files.

- **Branch:** `claude/design-frontend-consistency-45kjng` (merged to `main`)
- **Legend:** ✅ done · 🟡 in progress · ⬜ todo · 🔵 needs human decision
- **Partitioning rule:** tasks in the same wave never edit the same files.

---

## 1. Objective & success criteria

Make The Helper feel like one intentional product: consistent logo, navigation,
color, typography, and components across every page; a coherent human voice;
accessible; and the signup phone wired to GHL.

**Definition of Done (project):**
- Zero hand-rolled primary buttons / inputs / cards / badges in `src/` — all via
  `ds/` primitives.
- Logo + nav identical across marketing, consumer, provider, admin, auth.
- Only design-token colors used; one radius scale; one status-badge system.
- Fraunces on headings; weight hierarchy (no wall of `font-black`).
- WCAG AA: no contrast failures; icon-only buttons labelled; keyboard focus.
- Signup phone reaches GHL; verified via `WebhookLog`.
- `wasp build` clean; visual QA passed; deployed.

---

## 2. Milestones

| Milestone | Contents | Exit criteria |
|-----------|----------|---------------|
| **M0 — Foundation** ✅ | Logo, tokens, status helper, `ds/` primitives, GHL fix, auth exemplars, session hook | All pushed to `main` |
| **M1 — Unblockers** ⬜ | Root token-bug fix, content style guide, env/network allowlist | `bg-primary`/`border-border` work; `wasp build` runnable in web sessions |
| **M2 — Migration sweep** ⬜ | All pages on `ds/` primitives (by directory) | No hand-rolled UI; tokens only |
| **M3 — Polish** ⬜ | A11y + voice/microcopy | AA pass; one canonical CTA; warm errors |
| **M4 — Ship** ⬜ | Build, visual QA, deploy | Live on prod, GHL verified |

---

## 3. Completed (M0) — for reference

| ID | Deliverable | Status |
|----|-------------|--------|
| D0.1 | `src/client/components/Logo/Logo.tsx` + all ~13 sites migrated | ✅ |
| D0.2 | Token ramp + dead-CSS removal in `Main.css`; `lib/statusStyles.ts` | ✅ |
| D0.3 | `completeOnboarding` → `syncContactToGHL` (`server/services/ghl.ts`) | ✅ |
| D0.4 | `ds/` primitives: Button, TextInput, FormLabel, Card, Badge, Heading | ✅ |
| D0.5 | Radius scale + `shadow-brand` + global `:focus-visible` ring | ✅ |
| D0.6 | `LoginPage` + `SignupPage` migrated (exemplars) | ✅ |
| D0.7 | `.claude/hooks/session-start.sh` + settings registration | ✅ |
| D0.8 | `DESIGN_IMPROVEMENT_PLAN.md` (audit + roadmap) | ✅ |

---

## 4. Wave 0 — Unblockers (M1)  *(mostly serial; do first)*

### T0.1 — Root token-bug fix 🔵 ⬜
- **Objective:** make hsl-wrapped tokens resolve so `bg-primary`/`border-border`/
  `bg-card` work and the app + admin template share one token layer.
- **Scope:** `src/client/Main.css` only.
- **Deliverables:**
  - `@theme` color tokens emit valid colors (convert `hsl(var(--x))`→`var(--x)`,
    or convert `:root` hex to HSL channels).
  - Short note appended to `DESIGN_IMPROVEMENT_PLAN.md` documenting the change.
- **Acceptance:** light + dark render correctly; admin dashboard visually
  unchanged; `wasp build` clean.
- **Decision needed:** do now vs defer. **Depends on:** none. **Agent:** F (solo).

### T0.2 — Content & CTA style guide 🔵 ⬜
- **Objective:** end CTA drift and terse errors.
- **Deliverables:**
  - `docs/CONTENT_STYLE.md`: canonical primary CTA, button-label casing,
    error-message voice + recovery-hint pattern, empty-state tone.
- **Acceptance:** doc merged; referenced by T2.7. **Decision needed:** the CTA
  label. **Agent:** 1 (+ human).

### T0.3 — Environment network allowlist 🔵 ⬜ (human)
- **Objective:** let web sessions run `wasp build/start/test`.
- **Deliverables:** environment network policy updated to allow `get.wasp.sh`
  and `github.com`.
- **Acceptance:** session hook installs Wasp CLI; `wasp build` succeeds.
- **Owner:** product owner (config change, not code).

---

## 5. Wave 1 — Component migration sweep (M2)  *(parallel, by directory)*

**Shared deliverable for every T1.x:** a PR/commit converting that directory's
hand-rolled UI to `ds/` primitives + a short `MIGRATION_NOTES` entry listing
files touched and any components that needed a new variant.

**Shared acceptance (every T1.x):**
- No `bg-[#2563EB] … rounded-…` buttons → `<Button>`.
- Inputs/labels → `<TextInput>`/`<FormLabel>`; cards → `<Card>`; pills → `<Badge>`.
- Section titles → `<Heading>` (Fraunces where appropriate).
- Tokens only; radius scale; no behavior change; `prettier --check` clean.

| Task | Directory | Files | Key deliverables | Agent |
|------|-----------|------|------------------|-------|
| **T1.1** ⬜ | `src/consumer/**` (Dashboard, Rewards, Booking, Discovery, ProviderDetail, ProPublic, Contact, RequestDetail, messages, **wizard steps**) | ~20 | wizard `StepContact/Location/Qualifiers/VerifyEmail` + dashboards on primitives | A |
| **T1.2** ⬜ | `src/provider/**` (Dashboard, Leads, Appointments, Services, Profile, Apply, Billing, messages, layout) | ~18 | Apply/Profile forms + lead cards on primitives | B |
| **T1.3** ⬜ | `src/admin/**` (Requests, Providers, Reviews, Categories, Rewards, Users, dashboards, layout) | ~25 | finish badges; tables/modals on primitives; drop inline Fraunces styles for `<Heading>` | C |
| **T1.4** ⬜ | `src/landing-page/**` (LandingPage, marketplace, category/area pages, Footer, components) | ~15 | hero/feature/section CTAs on `<Button>`; tokenize gradients | D |
| **T1.5** ⬜ | `src/auth/onboarding/**`, `src/shared/**`, `src/user/**`, `src/payment/**` | ~12 | onboarding steps + Terms/Privacy/Help on primitives | E |

> Exemplars to copy: `src/auth/LoginPage.tsx`, `src/auth/SignupPage.tsx`.
> **Depends on:** T0.1 recommended (cleaner classes), not required.

---

## 6. Wave 2 — Polish (M3)  *(parallel; same dir owner as Wave 1 to avoid conflicts)*

### T2.1–T2.5 — Accessibility pass (one per directory) ⬜
- **Deliverables (per dir):**
  - `text-white/50–60` and other low-contrast text replaced with AA-passing values.
  - `aria-label`/`sr-only` on all icon-only buttons (hamburger, user dropdown,
    close, copy, icon actions); clickable elements are real `<button>`.
  - Meaningful `alt` text; decorative images explicitly `alt=""`.
- **Acceptance:** axe/Lighthouse a11y on that dir's key pages → no serious issues.

### T2.6 — Global a11y items ⬜
- **Deliverables:** `UserDropdown` gets `aria-haspopup="menu"` + focus ring;
  shared `ui/sheet`+`ui/dialog` close buttons verified for focus visibility.

### T2.7 — Voice & microcopy ⬜
- **Deliverables:** canonical CTA applied app-wide; error messages rewritten to
  the warm house voice with recovery hints; empty-state copy aligned.
- **Depends on:** T0.2.

---

## 7. Wave 3 — Functional & data (M3)  *(parallel with W1/W2)*

### T3.1 — GHL signup-phone end-to-end verify ✅→🟡
- **Deliverables:** test evidence (a `WebhookLog` row `event=contact.created`
  with the phone) + confirmation `GHL_WEBHOOK_URL` is set in prod.
- **Acceptance:** new signup creates a GHL contact incl. phone. No schema
  migration needed (`WebhookLog.serviceRequestId` already nullable).

### T3.2 — Login "weird numbers" 🔵 ⬜
- **Deliverables:** screenshot/repro of the exact element; fix or written
  confirmation it's intentional (OTP boxes / step counters read as by-design).
- **Blocked on:** product owner screenshot.

---

## 8. Wave 4 — Verify & deploy (M4)  *(serial gate)*

### T4.1 — Build & typecheck ⬜
- **Deliverables:** green `wasp build` (or `wasp start`) log; any TS errors fixed.
- **Depends on:** Wave 1–3 merged; T0.3 (Wasp CLI available).

### T4.2 — Visual QA ⬜
- **Deliverables:** a screenshot set (landing, login, signup, onboarding,
  consumer/provider/admin dashboards) light + dark, attached to the PR, showing
  logo/nav/color/radius consistency and no regressions.

### T4.3 — Deploy ⬜
- **Deliverables:** production deploy via generated `.wasp/out/Dockerfile`
  (Railway/Fly/Render); prod env vars set (`DATABASE_URL`, `WASP_WEB_CLIENT_URL`,
  `JWT_SECRET`, `MAILGUN_*`, `ADMIN_EMAILS`, `GHL_WEBHOOK_URL`); smoke test.
- **Depends on:** T4.1, T4.2.

---

## 9. Deliverables register (master list)

| # | Deliverable | Wave | Status |
|---|-------------|------|--------|
| Logo component + rollout | D0.1 | M0 | ✅ |
| Color tokens + status helper | D0.2 | M0 | ✅ |
| GHL phone sync | D0.3 | M0 | ✅ |
| `ds/` primitives + scales | D0.4–5 | M0 | ✅ |
| Auth exemplars | D0.6 | M0 | ✅ |
| Session hook | D0.7 | M0 | ✅ |
| Root token fix | T0.1 | M1 | ⬜ |
| `docs/CONTENT_STYLE.md` | T0.2 | M1 | ⬜ |
| Network allowlist | T0.3 | M1 | ⬜ |
| 5× directory migrations | T1.1–5 | M2 | ⬜ |
| 5× a11y passes + global | T2.1–6 | M3 | ⬜ |
| Voice/microcopy pass | T2.7 | M3 | ⬜ |
| GHL verify evidence | T3.1 | M3 | 🟡 |
| Login numbers fix | T3.2 | M3 | ⬜ |
| Build/QA/deploy | T4.1–3 | M4 | ⬜ |

---

## 10. Dependency graph

```
M1: T0.1 token fix · T0.2 style guide · T0.3 allowlist (human)
        │ (recommended)
        ▼
M2: T1.1 T1.2 T1.3 T1.4 T1.5   ── parallel, by directory ──┐
        │                                                   │
        ▼                                                   │
M3: T2.1–2.6 a11y + T2.7 voice  (same dir owners)           │
    T3.1 GHL verify · T3.2 weird-numbers  ── parallel ──────┤
                                                            ▼
M4: T4.1 build → T4.2 visual QA → T4.3 deploy  (gate)
```

## 11. First parallel batch (ready to assign)

| Agent | Task | Owns (no conflicts) |
|-------|------|---------------------|
| A | T1.1 | `src/consumer/**` |
| B | T1.2 | `src/provider/**` |
| C | T1.3 | `src/admin/**` |
| D | T1.4 | `src/landing-page/**` |
| E | T1.5 | `src/auth/onboarding`, `src/shared`, `src/user`, `src/payment` |
| F | T0.1 | `src/client/Main.css` (solo, land first) |

## 12. Risk register

| Risk | Mitigation |
|------|------------|
| No `wasp build` in sandbox → unverified TS | Land T0.3; per-file `tsc` on wasp-free files meanwhile |
| Token fix alters admin template | Visual diff admin + dark mode before merge (T0.1) |
| Wide sweep regressions | Per-directory PRs + visual QA per dir; primitives keep behavior |
| GHL webhook misconfig | T3.1 verifies a real `WebhookLog` row |

## 13. Open decisions (need product owner)

1. **T0.1** — do the root token fix now or defer?
2. **T0.2** — the one canonical primary CTA label.
3. **T0.3** — allowlist `get.wasp.sh` + `github.com` in the env network policy?
4. **T3.2** — the login "weird numbers": which element?
