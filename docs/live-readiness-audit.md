# Live Readiness Audit

Date: 2026-05-01
Owner: Worker 5
Scope: Google Auth and launch readiness from code/config perspective. Reviewed `main.wasp`, auth files, env examples, schema, payment, GHL, Twilio, and relevant consumer/provider UI. No env secrets were changed.

## Executive Status

Status: **not ready for public launch without fixes**.

The core marketplace funnel is present and mostly deployable for a controlled beta, but production launch is blocked by auth/env hygiene, webhook security, payment demo copy/config, and a likely GHL logging mismatch. Google Auth is configured in Wasp code, but it still needs production OAuth console verification and server-only env cleanup.

## Deployable Features

- Marketing pages: `/`, service landing pages, provider landing page, area pages, terms, and privacy are routed in `main.wasp`.
- Service request funnel: guests and authenticated users can submit service requests from `/request-service`; requests are persisted with contact, service, schedule, urgency, and source metadata.
- Guest-to-user reward claiming: onboarding attempts to match pending guest requests by email or phone and attach reward transactions after signup.
- Email/password auth: Wasp email auth is enabled with verification and password reset pages.
- Google Auth code path: Wasp Google provider is enabled with `profile` and `email` scopes, and Google users map email, username, and admin status from verified Google email.
- Onboarding: authenticated users are redirected to `/onboarding`; consumers and providers can complete profile setup.
- Consumer dashboard/read paths: dashboard, my requests, rewards, referral, and account routes are protected where appropriate.
- Provider portal basics: provider dashboard, leads, appointments, profile, billing routes exist and provider operations enforce provider profile ownership.
- Admin dashboards: admin routes exist for analytics, users, requests, providers, rewards, settings, calendar, UI elements, and messages.
- Stripe payment plumbing: Stripe is the selected payment processor; checkout, customer portal, and signed webhooks are implemented.
- GHL outbound webhook: service requests are sent to GHL in fire-and-forget mode when `GHL_WEBHOOK_URL` is configured.
- GHL inbound webhook: `/webhooks/ghl` can update request status and log inbound events when GHL sends `requestId` and matching event data.

## Blocked Or High-Risk Features

- **Google OAuth launch verification is incomplete until production callback URLs are configured in Google Cloud.** Wasp docs require callback URLs such as `http://localhost:3001/auth/google/callback` locally and `https://<server-host>/auth/google/callback` for deployed API servers.
- **Client env example currently exposes Google OAuth values in client scope.** `.env.client.example` includes `GOOGLE_CLIENT_ID` and `Google_Client_Secret`; client env vars must start with `REACT_APP_`, and Google client secret must never be in client env or committed examples.
- **Payment page is still Open SaaS/demo copy.** `/pricing` advertises generic Hobby/Pro/Credits plans, mentions Stripe/LemonSqueezy/Polar, and shows a Stripe test card. This should not be public-facing for Worki launch.
- **Payment env examples include non-selected processors.** Stripe is selected in code, but `.env.server.example` still lists LemonSqueezy and Polar vars. This is acceptable for a template, but confusing for production launch unless clearly documented as unused.
- **GHL outbound logging likely uses the wrong Prisma delegate shape.** `sendLeadToGHL` receives `context.entities as any` but calls `(prisma as any).webhookLog.create`; Wasp entity delegates elsewhere are PascalCase (`context.entities.WebhookLog`). If this is not a real Prisma client, outbound webhook logging may fail silently after sending.
- **GHL inbound webhook accepts unsigned requests if `GHL_WEBHOOK_SECRET` is missing.** The secret is optional in code, which is risky for production.
- **Twilio webhook is not production-secure.** `/webhooks/twilio` only checks that `x-twilio-signature` exists; it does not validate the signature against a Twilio auth token, and no Twilio env vars are documented.
- **Twilio SMS handling is stubbed.** Incoming SMS is logged and returns a canned TwiML response; it does not associate the sender to a user/request or update request state.
- **Email sending depends on SendGrid being configured.** Email verification, password reset, auth emails, and payment cancellation email require `SENDGRID_API_KEY` and verified sender/domain alignment for `hello@worki.ca`.
- **Admin authorization needs review.** Admin pages are `authRequired`, but route-level admin role enforcement was not visible in `main.wasp`; confirm page/operation guards prevent non-admin access.
- **Provider redirect logic is incomplete.** Onboarding always navigates to `/dashboard` after provider signup; provider users may need `/provider/dashboard` instead.

## Required Environment Variables

### Core Deployment

- `DATABASE_URL`: required for deployed Postgres.
- Wasp deployment/runtime URLs: configure the production frontend and server URLs according to the Wasp hosting target so OAuth callbacks, Stripe redirects, and generated links use production domains.
- `ADMIN_EMAILS`: comma-separated list of verified admin emails. Ensure Google/email auth admin addresses match exact email casing used in signup.

### Auth

- `GOOGLE_CLIENT_ID`: server-side only; required for Google Auth.
- `GOOGLE_CLIENT_SECRET`: server-side only; required for Google Auth.
- `SENDGRID_API_KEY`: required because `emailSender.provider` is SendGrid and email auth uses verification/password reset emails.

### Payments

Stripe is active in `src/payment/paymentProcessor.ts`.

- `STRIPE_API_KEY`: use live `sk_live_...` for production.
- `STRIPE_WEBHOOK_SECRET`: live webhook signing secret for `/payments-webhook`.
- `PAYMENTS_HOBBY_SUBSCRIPTION_PLAN_ID`: Stripe price ID if Hobby remains enabled.
- `PAYMENTS_PRO_SUBSCRIPTION_PLAN_ID`: Stripe price ID if Pro remains enabled.
- `PAYMENTS_CREDITS_10_PLAN_ID`: Stripe price ID if credits remain enabled.

Unused unless payment processor is changed:

- `LEMONSQUEEZY_API_KEY`
- `LEMONSQUEEZY_STORE_ID`
- `LEMONSQUEEZY_WEBHOOK_SECRET`
- `POLAR_ORGANIZATION_ACCESS_TOKEN`
- `POLAR_WEBHOOK_SECRET`
- `POLAR_SANDBOX_MODE`

### GHL

- `GHL_WEBHOOK_URL`: required for outbound lead delivery to GoHighLevel.
- `GHL_WEBHOOK_SECRET`: should be required in production for both outbound header and inbound webhook verification.

### Twilio

No Twilio env vars are currently documented in `.env.server.example`, but production validation should require at least:

- `TWILIO_AUTH_TOKEN`: needed to validate `x-twilio-signature`.
- `TWILIO_ACCOUNT_SID`: likely needed for outbound messaging if added.
- `TWILIO_MESSAGING_SERVICE_SID` or `TWILIO_PHONE_NUMBER`: likely needed for outbound SMS if added.

### Optional/Ancillary

- `REACT_APP_GOOGLE_ANALYTICS_ID`: client-side GA ID.
- `PLAUSIBLE_API_KEY`, `PLAUSIBLE_SITE_ID`, `PLAUSIBLE_BASE_URL`: optional analytics.
- `GOOGLE_ANALYTICS_CLIENT_EMAIL`, `GOOGLE_ANALYTICS_PRIVATE_KEY`, `GOOGLE_ANALYTICS_PROPERTY_ID`: optional GA reporting service account.
- `OPENAI_API_KEY`: only needed for demo AI app.
- `AWS_S3_IAM_ACCESS_KEY`, `AWS_S3_IAM_SECRET_KEY`, `AWS_S3_FILES_BUCKET`, `AWS_S3_REGION`: only needed if file upload is public/used.

## Google Auth Verification Steps

1. In Google Cloud Auth Platform, create or verify a Web application OAuth client for Worki.
2. Add local callback URI for development: `http://localhost:3001/auth/google/callback`.
3. Add production server callback URI: `https://<production-api-host>/auth/google/callback`.
4. Confirm the OAuth consent screen branding uses Worki production domain and support email.
5. Add `userinfo.profile` and `userinfo.email` scopes, matching the app code `scopes: ["profile", "email"]`.
6. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` only in server env for local/staging/prod.
7. Remove Google client secret from any client env example or public client config before launch.
8. Start the app in staging and verify the Wasp auth UI shows Google sign-in on `/login` and `/signup`.
9. Sign up with a normal Google account and verify the user is created with `email`, `username`, default `role = CONSUMER`, and redirects to `/onboarding`.
10. Complete consumer onboarding and confirm redirect to `/dashboard`, reward account creation, and signup bonus transaction.
11. Sign up with a provider Google account and confirm provider onboarding creates a `Provider` row; verify whether the post-onboarding redirect should be `/provider/dashboard`.
12. Sign in with an email listed in `ADMIN_EMAILS` and a verified Google email; confirm `isAdmin = true` and admin routes/operations are inaccessible to non-admin users.
13. Test account-linking behavior if the same email signs up with email/password and then Google; verify no duplicate/unique email failure in the intended flow.

Reference: Wasp Google Auth docs require `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.server`, and Google OAuth redirect URIs using `/auth/google/callback` on the API host.

## SendGrid Caveats

- `emailSender.provider` is SendGrid and default sender is `Worki <hello@worki.ca>`.
- The SendGrid API key must be live and authorized for sending from `hello@worki.ca`.
- Domain authentication/SPF/DKIM should be verified before enabling email verification and password reset in production.
- Test email verification, password reset, and payment cancellation email paths after deploy.
- If SendGrid is missing or sender is not verified, email/password signup verification and password recovery can fail even if Google Auth works.

## Payment Caveats

- Stripe is the only active processor in code; LemonSqueezy and Polar are present but inactive.
- Production Stripe requires live API key, live price IDs, live webhook endpoint, and live webhook secret.
- Stripe webhook endpoint must point to `https://<api-host>/payments-webhook` and send only handled events: `invoice.paid`, `customer.subscription.updated`, and `customer.subscription.deleted`.
- Pricing copy and plans are generic demo content and should be hidden, rewritten, or configured before public launch.
- Checkout redirects depend on Wasp `config.frontendUrl`; verify deployed frontend URL is correct.
- Automatic tax is enabled in Stripe checkout; confirm Stripe Tax/account settings are production-ready.

## GHL Caveats

- `GHL_WEBHOOK_URL` missing does not block service request submission; it only skips outbound delivery and logs a warning.
- `GHL_WEBHOOK_SECRET` should be mandatory in production. Current inbound handler allows requests without verification if the env var is absent.
- Outbound body sends `worki_request_id` in `customFields`; the GHL workflow must store/pass that value back as `requestId` for inbound updates.
- Confirm GHL event names match the code map: `conversation.started`, `conversation.qualifying`, `conversation.qualified`, `lead.assigned`, `appointment.booked`, `job.completed`, `lead.lost`.
- Confirm outbound webhook logging works; current delegate naming may not match Wasp entity access.
- Inbound GHL updates use string casts for request status. Invalid status values could fail at runtime if GHL sends an unexpected `status` override.

## Twilio Caveats

- Twilio endpoint exists at `/webhooks/twilio`, but implementation is a stub.
- Signature verification is incomplete; production must validate Twilio's signature using `TWILIO_AUTH_TOKEN` and the exact public webhook URL/body.
- The handler does not parse or persist request/user association beyond logging and a canned TwiML response.
- No Twilio env vars are listed in env examples, so deployment will not be self-documenting for SMS readiness.
- Do not market SMS reply workflows as live until signature validation, request matching, consent handling, and state updates are implemented.

## Pre-Launch Checklist

- [ ] Remove client-side Google OAuth secret/value from `.env.client.example`; keep Google OAuth credentials server-only.
- [ ] Configure Google OAuth production callback URI: `https://<production-api-host>/auth/google/callback`.
- [ ] Verify Google login and signup on staging with normal, provider, and admin users.
- [ ] Confirm email/password verification and reset emails send through SendGrid from verified `hello@worki.ca`.
- [ ] Decide whether `/pricing` is public for launch; if yes, replace demo plans/copy and configure live Stripe price IDs.
- [ ] Configure Stripe live webhook and validate a full checkout/webhook/account portal flow.
- [ ] Make `GHL_WEBHOOK_SECRET` required in production and test inbound/outbound GHL round trip.
- [ ] Verify `WebhookLog` writes for outbound GHL calls.
- [ ] Add real Twilio signature validation and required Twilio env docs before enabling SMS webhooks.
- [ ] Audit admin pages and operations for `isAdmin` authorization, not only `authRequired`.
- [ ] Verify provider onboarding redirects and provider dashboard first-run flow.
- [ ] Run a production-equivalent Wasp build after env cleanup and before deploy.
