# Worki Task Master

Date: 2026-05-03
Owner: Core delivery
Purpose: Single source of truth for implementation status, release readiness, and GitHub issue sync.

Release execution checklist: `app/docs/release-verification-checklist.md`

## 1) Current Goal

Ship Worki to production with:

- secure auth and webhook handling
- production-safe public UX/content
- reliable end-to-end regression coverage
- deployment and launch operations readiness

## 2) Release Readiness Snapshot

Overall go-live progress: **~76%**

- Product feature completeness: **~90%** (core marketplace flows exist)
- Security/config hardening: **~82%** (major patches done, auth scope reduced to email-only, staging verification pending)
- E2E quality gate: **~35%** (suite currently failing broadly)
- Deployment/ops readiness: **~60%** (infra/release checklist still open)

Launch decision today: **No-Go** (blocked mainly by E2E reliability and final staging verification).

Verification gate: launch cannot proceed until the checklist in `app/docs/release-verification-checklist.md` is complete, with E2E green.

## 3) Up-To-Date Spec (Execution Scope)

### A. Security + Environment

- Auth mode for this launch phase is **email-only** (social auth disabled by policy).
- Client env examples must not contain server secrets.
- GHL inbound webhook must enforce secret validation in production.
- Twilio webhook must validate `X-Twilio-Signature` using `TWILIO_AUTH_TOKEN`.
- Webhook logging must persist correctly through Wasp entity delegates.

### B. Production UX + Policy

- Public pricing page must contain Worki production-safe copy (no template/demo language).
- Onboarding must route providers to provider dashboard.
- Cookie consent must link to real legal routes (`/privacy`, `/terms`).
- Admin unfinished pages should be launch-safe placeholders, not TODO stubs.

### C. E2E Gate

- Playwright suite must run on the correct runtime base URL.
- Auth, consumer, and provider flow tests must match current UI contracts.
- Core smoke path must pass before release:
  - auth pages
  - request flow
  - my requests / referral
  - provider dashboard

### D. Release Ops

- Verify OAuth callbacks, Stripe live config, webhook signing, and email sender.
- Clean release branch from incidental artifacts before final PR/merge.

## 4) Done (Implemented In Working Tree)

- OAuth env hygiene fix: removed client-side OAuth values from `.env.client.example`.
- Auth scope fix: Google auth disabled in `main.wasp`; email/password is now the only active auth provider.
- GHL hardening:
  - production secret requirement in inbound webhook
  - outbound webhook log delegate fixed
- Twilio signature validation implemented with timing-safe compare.
- Pricing page de-templated to Worki-safe copy.
- Provider onboarding redirect fixed to `/provider/dashboard`.
- Cookie consent legal links updated to `/privacy` and `/terms`.
- Admin messages/settings pages converted to safe non-TODO placeholders.
- GitHub blocker issues created and assigned (`#27`-`#32`), with progress comments.

## 5) Left To Do (Blocking Go-Live)

### Critical

- Stabilize Playwright E2E suite to match current UI text/labels/selectors and auth behavior.
- Establish a deterministic E2E runtime contract (base URL/ports/env) and document it.
- Achieve passing run for core release suite in CI-equivalent conditions.

### High

- Verify webhook security end-to-end in staging with signed and unsigned payload tests.
- Verify email auth flows end-to-end (signup, verification, login, password reset) as primary auth path.
- Validate Stripe live-mode plan IDs, webhook signing secret, and checkout roundtrip.
- Validate production email sender and auth mail flows.

### Medium

- Final release branch hygiene: remove `test-results` artifacts and isolate intentional changes.

## 6) GitHub Issue Sync Map

### Active release blockers

- #27 OAuth env hygiene: **Code complete, verify + merge pending**
- #28 GHL webhook hardening/logging: **Code complete, verify + merge pending**
- #29 Twilio signature validation: **Code complete, verify + merge pending**
- #30 Pricing copy cleanup: **Code complete, content QA pending**
- #31 Provider onboarding redirect: **Code complete, QA pending**
- #32 Legal links + admin stubs: **Code complete, QA pending**
- #20 E2E rewrite/stabilization: **In progress, currently failing**

### Related release issue

- #19 Deployment/domain release setup: **Not started in this pass**

## 7) How Far From Goal

Distance to go-live is now mostly **verification and reliability**, not feature build.

Remaining critical path:

1. Fix E2E suite contract drift and pass full release suite.
2. Validate security/config changes in staging.
3. Complete production config checks (email auth/Stripe/email delivery).
4. Cut clean release branch and run final go-live checklist.

Estimated effort to launch-ready state (if focused on critical path): **1-3 working days**.

## 8) Immediate Next Actions

1. Refactor E2E selectors/helpers against current UI components and labels.
2. Run targeted email-auth specs (signup/login/password reset/email verification) until green.
3. Run full E2E release subset and publish pass/fail matrix.
4. Complete code verification checklist and attach evidence to release issues.
5. Close or move blocker issues based on verified outcomes.

## 9) Verification Checklist Reference

Canonical go-live verification checklist:

- `app/docs/release-verification-checklist.md`

Current gate status:

- **No-Go** (E2E remains blocking)
