# The Helper — Front-End Enhancement Task Plan (gStack)

A stacked, **assignable** plan for the design-consistency + front-end overhaul.
Each task is scoped to be handed to one agent. The partitioning rule: **tasks
in the same wave must not edit the same files**, so they can run in parallel
safely. Waves are ordered by dependency.

Branch: `claude/design-frontend-consistency-45kjng`
Legend: ✅ done · 🟡 in progress · ⬜ todo · 🔵 needs human decision

---

## Status snapshot

Foundation is built and pushed (6 commits). What remains is mostly a wide but
mechanical migration plus cross-cutting polish, verification, and deploy.

| Layer | State |
|-------|-------|
| Shared `<Logo>`, color tokens, status-badge helper | ✅ |
| GHL signup-phone sync | ✅ |
| `ds/` primitives (Button/TextInput/FormLabel/Card/Badge/Heading) + scales | ✅ |
| Auth pages migrated (exemplars) | ✅ |
| Everything else (≈80 files) | ⬜ |
| Build/verify + deploy | ⬜ |

---

## Wave 0 — Foundation & unblockers  *(do first; mostly serial)*

### T0.1 — Root token-bug fix ⬜ 🔵
- **Why:** `--border:#E2E8F0` etc. are hex but wrapped as `hsl(var(--border))`,
  so `bg-primary`/`border-border`/`bg-card` resolve to invalid CSS. This is the
  reason the whole app hand-rolls hex. Fixing it makes the shared utilities work
  and lets the migration use clean class names.
- **Scope:** `src/client/Main.css` only. Change `@theme` color tokens from
  `hsl(var(--x))` to `var(--x)` (or convert the `:root` values to HSL channels).
- **Risk:** affects the admin TailAdmin template + dark mode. **Decision needed:**
  do this now (cleaner migration) or defer (migration keeps using direct-hex
  tokens). Recommend: do it now, verify admin dashboard + dark mode visually.
- **Acceptance:** `bg-primary`, `border-border`, `bg-card` render correct colors
  in light + dark; admin dashboard unchanged; `wasp build` clean.
- **Depends on:** none. **Blocks:** nothing hard (migration can use direct-hex
  tokens regardless), but landing it first reduces churn.
- **Agent:** 1 (careful, single-file, needs visual check).

### T0.2 — CTA + voice style guide ⬜ 🔵
- **Why:** CTAs drift ("Get Help" / "Get matched now" / "Get your first quote").
- **Scope:** add `docs/CONTENT_STYLE.md`: one canonical primary CTA, error-copy
  voice rules, button-label casing. **Decision needed:** pick the canonical CTA.
- **Acceptance:** doc merged; used as the reference by all Wave-2 voice tasks.
- **Agent:** 1 (+ human decision).

---

## Wave 1 — Component migration sweep  *(parallel; partitioned by directory)*

Each task migrates its directory's hand-rolled buttons/cards/inputs/badges/
headings to `src/client/components/ds` primitives, and tokenizes ad-hoc
radii/shadows. **Self-contained per directory → safe to run in parallel.**
Shared acceptance criteria for every T1.x:
- No hand-rolled primary buttons (`bg-[#2563EB] ... rounded-...`) remain — all `<Button>`.
- Inputs/labels use `<TextInput>`/`<FormLabel>`; cards use `<Card>`; status pills use `<Badge>`.
- Headings use `<Heading>` (Fraunces where it's a section title).
- No new colors outside the token set; radii use the scale.
- File still type-checks; no behavior change.

| Task | Directory / scope | Approx files | Agent |
|------|-------------------|-------------|-------|
| **T1.1** ⬜ | `src/consumer/**` (Dashboard, Rewards, Booking, Discovery, ProviderDetail, ProPublic, Contact, RequestDetail, messages, **wizard steps**) | ~20 | A |
| **T1.2** ⬜ | `src/provider/**` (Dashboard, Leads, Appointments, Services, Profile, Apply, Billing, messages, layout) | ~18 | B |
| **T1.3** ⬜ | `src/admin/**` (Requests, Providers, Reviews, Categories, Rewards, Users, dashboards, layout) — badges already partly done | ~25 | C |
| **T1.4** ⬜ | `src/landing-page/**` (LandingPage, marketplace, category/area pages, Footer, components) | ~15 | D |
| **T1.5** ⬜ | `src/auth/onboarding/**` (OnboardingPage steps, components) + `src/shared/**`, `src/user/**`, `src/payment/**` | ~12 | E |

> Note: auth login/signup (T-done) are exemplars — copy their patterns.
> Depends on: Wave 0 recommended but not required (primitives already exist).

---

## Wave 2 — Cross-cutting polish  *(parallel; partitioned by directory)*

Run after Wave 1 lands per directory (same files). To stay conflict-free, assign
the **same directory owner** from Wave 1 to do that directory's Wave-2 pass, OR
sequence Wave 2 after Wave 1 merges.

### T2.x — Accessibility pass (per directory) ⬜
- Replace `text-white/50–60` low-contrast text with accessible values.
- Add `aria-label`/`sr-only` to icon-only buttons (hamburger, user dropdown,
  close, copy, icon actions). Ensure clickable elements are real `<button>`.
- Mark decorative images `alt=""` intentionally; meaningful images get real alt.
- **Acceptance:** key flows pass an axe/Lighthouse a11y check (no serious
  contrast/aria violations).

### T2.6 — Global a11y items ⬜
- UserDropdown trigger: `aria-haspopup="menu"` + focus ring (`src/user/UserDropdown.tsx`).
- Audit `src/client/components/ui/*` (sheet/dialog close buttons) for focus styles.

### T2.7 — Voice/microcopy pass ⬜
- Apply `docs/CONTENT_STYLE.md`: standardize primary CTA across all pages;
  rewrite terse error messages to the warm house voice; add recovery hints
  (e.g. "Forgot password?" near auth errors).
- **Depends on:** T0.2.

---

## Wave 3 — Functional & data  *(parallel with Wave 1/2)*

### T3.1 — GHL signup-phone: verify end-to-end ✅→🟡
- Code done (`syncContactToGHL` in `completeOnboarding`). Remaining: confirm
  `GHL_WEBHOOK_URL` is set in env, and that a real onboarding writes a
  `WebhookLog(event=contact.created)`. No schema migration needed
  (`WebhookLog.serviceRequestId` already nullable).
- **Acceptance:** new signup creates a GHL contact with phone; WebhookLog row present.

### T3.2 — "Weird numbers" on login 🔵 ⬜
- **Blocked:** needs a screenshot or the exact page/number from the product owner.
  LoginPage/AuthPageLayout/Onboarding read clean in code (OTP 6-box + step
  counters are intentional).
- **Acceptance:** the specific element identified and fixed, or confirmed not-a-bug.

---

## Wave 4 — Verify & deploy  *(serial; gate)*

### T4.1 — Build & typecheck ⬜
- `wasp start db` then `wasp build` (or `wasp start`) locally/CI. Fix any TS
  errors surfaced (sandbox could not compile). Confirm Fraunces renders on auth.

### T4.2 — Visual QA ⬜
- Screenshot key pages (landing, login, signup, onboarding, consumer +
  provider + admin dashboards) light + dark; check logo/nav/color/radius
  consistency and no regressions.

### T4.3 — Deploy ⬜
- `wasp build` → use generated `.wasp/out/Dockerfile` → Railway/Fly/Render.
- Ensure prod env vars set (`DATABASE_URL`, `WASP_WEB_CLIENT_URL`, `JWT_SECRET`,
  `MAILGUN_*`, `ADMIN_EMAILS`, `GHL_WEBHOOK_URL`).
- **Depends on:** T4.1, T4.2.

---

## Dependency graph (high level)

```
Wave 0 (T0.1 token fix, T0.2 style guide)
   │  (recommended, not hard-blocking)
   ▼
Wave 1  T1.1 T1.2 T1.3 T1.4 T1.5   ── parallel, by directory ──┐
   │                                                            │
   ▼                                                            │
Wave 2  T2.x a11y + T2.7 voice  (same dir owners, after W1)     │
                                                                │
Wave 3  T3.1 GHL verify, T3.2 weird-numbers  ── parallel ───────┤
                                                                ▼
Wave 4  T4.1 build → T4.2 visual QA → T4.3 deploy  (gate)
```

## Suggested agent assignment (first parallel batch)

| Agent | Task | Conflicts with |
|-------|------|----------------|
| A | T1.1 consumer | none (own dir) |
| B | T1.2 provider | none |
| C | T1.3 admin | none |
| D | T1.4 landing | none |
| E | T1.5 onboarding/shared/user/payment | none |
| F | T0.1 root token fix | Main.css (run solo, land first) |

Human decisions needed before/at start: **T0.1** (do token fix now?),
**T0.2/T2.7** (canonical CTA label), **T3.2** (the login "weird numbers").
