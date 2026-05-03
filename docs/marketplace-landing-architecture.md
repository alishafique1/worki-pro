# Worki Marketplace Landing Architecture

This landing page is built as reusable React components under `src/landing-page/marketplace` so the current Wasp app can later connect the UI to real marketplace workflows without redesigning the page.

## Product Positioning

Worki helps homeowners find, compare, and book trusted local service providers without chasing referrals, missed calls, vague quotes, or unreliable follow-ups.

Primary customer CTA: Join the waitlist.

Primary provider CTA: Apply as a provider.

## Frontend Structure

Recommended component ownership:

- `src/landing-page/LandingPage.tsx`: page composition and section ordering.
- `src/landing-page/marketplace/components.tsx`: reusable presentational components.
- `src/landing-page/marketplace/content.tsx`: data-driven copy, categories, FAQs, steps, benefits, and trust points.

Reusable components currently included:

- `Container`
- `SectionHeader`
- `Button`
- `Hero`
- `MarketplaceMockup`
- `FeatureCard`
- `CategoryCard`
- `StepCard`
- `TrustBadge`
- `TestimonialCard`
- `ProviderBenefitCard`
- `FAQAccordion`
- `CTASection`
- `WaitlistForm`
- `StatsCard`
- `Footer`

## Backend-Ready Data Model

The current app already has a Prisma/PostgreSQL foundation. The landing page should eventually connect to these marketplace tables or equivalents.

### `users`

- `id`
- `email`
- `phone`
- `firstName`
- `lastName`
- `role`: `CONSUMER`, `PROVIDER`, `ADMIN`
- `postalCode`
- `status`
- `createdAt`
- `updatedAt`

### `providers`

- `id`
- `userId`
- `businessName`
- `contactName`
- `email`
- `phone`
- `website`
- `licenceNumber`
- `insuranceStatus`
- `serviceAreas`
- `verificationStatus`: `PENDING`, `VERIFIED`, `REJECTED`, `SUSPENDED`
- `active`
- `createdAt`
- `updatedAt`

### `service_categories`

- `id`
- `name`
- `slug`
- `description`
- `active`
- `parentCategoryId`
- `createdAt`

### `provider_categories`

- `providerId`
- `serviceCategoryId`

### `service_requests`

- `id`
- `consumerId`
- `name`
- `email`
- `phone`
- `postalCode`
- `city`
- `serviceCategoryId`
- `description`
- `urgency`
- `preferredTime`
- `status`
- `aiSummary`
- `assignedProviderId`
- `createdAt`
- `updatedAt`

### `quotes`

Recommended addition if not already represented by existing request/provider fee logic:

- `id`
- `serviceRequestId`
- `providerId`
- `priceMin`
- `priceMax`
- `message`
- `estimatedArrival`
- `status`: `PENDING`, `ACCEPTED`, `DECLINED`, `EXPIRED`
- `createdAt`
- `updatedAt`

### `bookings`

Can map to `Appointment` in the current schema or be split later:

- `id`
- `serviceRequestId`
- `quoteId`
- `providerId`
- `consumerId`
- `scheduledAt`
- `status`
- `completedAt`
- `createdAt`
- `updatedAt`

### `reviews`

Recommended addition:

- `id`
- `bookingId`
- `consumerId`
- `providerId`
- `rating`
- `comment`
- `createdAt`

### `waitlist_entries`

Recommended addition for the landing form:

- `id`
- `name`
- `email`
- `postalCode`
- `serviceInterest`
- `roleInterest`: `CUSTOMER`, `PROVIDER`, `BOTH`, `UNKNOWN`
- `launchArea`
- `source`
- `createdAt`

### `provider_applications`

Recommended if applications need to remain separate from approved providers:

- `id`
- `businessName`
- `contactName`
- `email`
- `phone`
- `website`
- `serviceCategories`
- `serviceAreas`
- `licenceNumber`
- `insuranceStatus`
- `status`: `NEW`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`
- `createdAt`
- `updatedAt`

### `ai_routing_logs`

Recommended for auditable AI-assisted routing:

- `id`
- `serviceRequestId`
- `inputSummary`
- `detectedCategoryId`
- `detectedUrgency`
- `matchedProviderIds`
- `confidence`
- `model`
- `reviewedByAdmin`
- `createdAt`

## Validation Rules

Use Zod or Wasp server validation before persistence.

### Waitlist

- `name`: optional, max 120 characters.
- `email`: required, valid email, lowercase before storage.
- `postalCode`: optional initially, normalize spacing and casing.
- `serviceInterest`: optional, max 120 characters.
- Prevent duplicate active waitlist rows per email/postal-code pair where practical.

### Provider Application

- `businessName`: required, max 160 characters.
- `contactName`: required, max 120 characters.
- `email`: required, valid email.
- `phone`: required, normalize to E.164 where possible.
- `serviceCategories`: require at least one category.
- `serviceAreas`: require at least one service area.
- `website`: optional URL.
- `licenceNumber`: optional depending on category.
- `insuranceStatus`: boolean or enum.

### Service Request

- `name`: required unless authenticated user exists.
- `phone` or `email`: require at least one contact method.
- `postalCode`: required for marketplace routing.
- `serviceCategoryId`: optional at submission, can be inferred later.
- `description`: required, 20-2,000 characters.
- `urgency`: enum.
- `smsConsentGiven`: required when SMS updates are enabled.

## Server Actions / Operations Plan

Current Wasp-style operations can map to these actions:

- `submitWaitlistEntry`: validates and stores early-access demand.
- `submitProviderApplication`: validates provider interest and creates a reviewable application.
- `createServiceRequest`: stores customer request and queues matching/routing.
- `generateServiceRequestSummary`: produces a provider-safe summary of the job request.
- `routeServiceRequest`: recommends category and provider matches, then logs the decision.
- `submitQuote`: lets approved providers respond to a qualified request.
- `acceptQuote`: creates or confirms a booking/appointment.
- `submitReview`: only allowed for completed bookings.

## AI Routing Workflow

AI should assist operations, not make final trust decisions silently.

1. Customer submits a request.
2. Server validates and stores the raw request.
3. AI summarizes the request, detects category, detects urgency, and extracts key constraints.
4. Deterministic filters match service area, active status, category, and verification state.
5. Candidate providers are ranked by fit and availability signals.
6. The route decision is logged.
7. Admin review can override routing before provider notification in early launch markets.

## Implementation Notes

- Keep landing content data-driven so categories and FAQ can later come from the database.
- Keep the waitlist form fields aligned with the recommended `waitlist_entries` table.
- Keep provider CTA routed to `/providers/apply` until provider application persistence is fully connected.
- Do not fabricate reviews or marketplace metrics. Use clearly labeled launch-stage proof until real data exists.

## Request Onboarding UX Constraint

- Keep request onboarding on a single intake page with 2-3 core questions maximum.
- Limit the full request flow to 2 pages total: intake form and success/confirmation.
- Avoid multi-step wizards unless a future experiment proves materially better completion rates.
