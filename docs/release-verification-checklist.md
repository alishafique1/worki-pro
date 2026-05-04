# Release Verification Checklist

Date: 2026-05-03
Owner: Release verification
Status: **No-Go** (E2E gate is currently failing)

Purpose: actionable staging + production release checks. This checklist is the execution gate for launch.

## 0) Code Verification Gate (Required Before Staging Signoff)

- [ ] `main.wasp` auth methods confirm **email-only** provider for current release scope.
- [ ] Login and signup pages render only email/password auth entry (no social auth CTA).
- [ ] `.env.client.example` contains only public `REACT_APP_*` variables.
- [ ] Security-sensitive auth/webhook changes have a linked diff review in release PR.
- [ ] Task master status is updated after each verification run.

## 1) Staging Verification

### Auth (Email-Only)

- [ ] Email/password signup succeeds for consumer flow.
- [ ] Email verification flow succeeds.
- [ ] Email/password login succeeds for existing users.
- [ ] Password reset request and reset completion both succeed.
- [ ] Admin email from `ADMIN_EMAILS` maps to `isAdmin = true`; non-admin cannot access admin ops/routes.

### Stripe

- [ ] Staging Stripe keys are configured (`STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`).
- [ ] Plan price IDs used by app are valid for staging account.
- [ ] Checkout flow completes from pricing/subscription entry point.
- [ ] Stripe webhook events are received and processed (`invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`).
- [ ] Billing portal roundtrip works and returns to app correctly.

### Webhooks (GHL)

- [ ] `GHL_WEBHOOK_URL` is configured in staging.
- [ ] `GHL_WEBHOOK_SECRET` is configured in staging.
- [ ] Outbound request send succeeds from request submission flow.
- [ ] Outbound `WebhookLog` write is persisted.
- [ ] Inbound webhook with valid secret updates request state.
- [ ] Inbound webhook without secret or with invalid secret is rejected.

### Webhooks (Twilio)

- [ ] `TWILIO_AUTH_TOKEN` is configured in staging.
- [ ] Inbound webhook with valid `X-Twilio-Signature` is accepted.
- [ ] Inbound webhook with invalid/missing signature is rejected.
- [ ] Twilio webhook URL matches the exact public URL used for signature verification.

### Email

- [ ] `SENDGRID_API_KEY` is configured in staging.
- [ ] Sender identity (`hello@worki.ca`) is verified.
- [ ] Verification email is delivered and link works.
- [ ] Password reset email is delivered and flow works.

### E2E Gate (Staging Runtime Contract)

- [ ] Playwright base URL is explicitly set to staging-compatible runtime.
- [ ] Auth specs pass against current UI text/selectors.
- [ ] Consumer critical flow specs pass.
- [ ] Provider critical flow specs pass.
- [ ] Release smoke subset is green in one full run (no retries relied upon).

## 2) Production Verification

### Config + Secrets

- [ ] Production env is populated with live secrets only on server side.
- [ ] Client env contains only `REACT_APP_*` public variables.
- [ ] Production domain/callback/redirect URLs match deployed frontend + API hosts.

### Auth (Email-Only)

- [ ] Production email/password signup and verification smoke test passes.
- [ ] Production email/password login smoke test passes.
- [ ] Production password reset smoke test passes.

### Stripe

- [ ] Live `STRIPE_API_KEY` and live `STRIPE_WEBHOOK_SECRET` are configured.
- [ ] Live plan price IDs are configured and mapped correctly.
- [ ] Live webhook endpoint is active and signature-verified.
- [ ] One controlled live payment + cancellation cycle is validated.

### Webhooks + Email

- [ ] GHL outbound/inbound checks pass in production with signed-secret behavior.
- [ ] Twilio signature validation passes in production.
- [ ] SendGrid deliverability smoke checks pass in production.

### Final Launch Gate

- [ ] Full release E2E suite passes on production-like build/runtime.
- [ ] Open release blockers (`#20`, `#27`-`#32`) are resolved or explicitly waived.
- [ ] Task master and readiness docs are updated with final go/no-go decision.
- [ ] Release branch contains only intentional launch changes.

## 3) Current Blocking Items (2026-05-03)

- [ ] E2E suite stabilization is complete and green.
- [ ] Signed webhook integration verification evidence is attached to blocker issues.
- [ ] Production email-auth/Stripe/email checks are complete.
