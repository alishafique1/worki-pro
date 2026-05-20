# Bark-Style Redesign — Request-First, Auth-Last Consumer Flow

**Date:** 2026-05-19
**Status:** Approved
**GitHub Epic:** #68
**Approach chosen:** A — Pure Guest Wizard

---

## Problem

The Helper's current consumer flow is backwards relative to how users think:

- **Current:** Sign up → empty dashboard → pick interests → nothing happens
- **User mental model:** "I need my AC fixed" → describe job → get quotes → maybe create account

The result: high drop-off after onboarding, empty dashboards, no momentum. Users create accounts before seeing any value.

## Design Goal

Adopt Bark.com's core model: **service-first, account-second**. A visitor should be able to describe their job, answer follow-up questions, and receive quotes — with account creation happening as a natural byproduct at the end of the request, not a gate before it.

---

## New Consumer Flow (Approach A)

```
Homepage
  └─► Pick category (visual card grid)
        └─► [Optional] Service detail page (/services/:slug)
              └─► "Get Free Quotes" CTA
                    └─► Guest wizard (no auth)
                          Step 1: Category confirmed (pre-filled if from detail page)
                          Step 2: Sub-service selection (dynamic from DB)
                          Step 3: Qualifier questions (dynamic per sub-service)
                          Step 4: Postal code / location
                          Step 5: Name + Email + Phone
                          Step 6: OTP verification
                                └─► New user: account created + request saved → dashboard
                                └─► Returning user: request saved to existing account → dashboard
```

---

## Component Breakdown

### 1. Homepage Redesign

**Hero section**
- Headline: "Get free quotes from trusted local pros"
- Sub-headline: "Milton · Oakville · Burlington"
- Primary CTA: search input ("What do you need help with?") + "Get Free Quotes" button — no login required
- Secondary: visual category card grid below hero

**Category grid**
- Visual cards with Unsplash/DB images, icons, service name
- Active categories link to `/services/:slug`
- Coming-soon categories shown greyed out
- 2–3 column grid, mobile-first

**Nav services dropdown**
- Fix: show all active DB categories with icons
- Links go to service detail pages (not login)

---

### 2. Service Detail Pages (`/services/:categorySlug`)

Each page serves dual purpose: SEO landing page + wizard entry point.

**Sections per page:**
1. **Hero** — service name, value prop, "Get Free Quotes" CTA (pre-loads wizard with category)
2. **How it works** — 3 steps: describe job → get matched → choose provider
3. **Pricing range** — rough local estimates (e.g. "Most HVAC repairs in Milton cost $150–$400")
4. **FAQs** — 4–6 common questions per service category
5. **Local trust signals** — "47 verified HVAC pros serving Milton, Oakville & Burlington"
6. **Footer CTA** — repeat quote button

**Data source:** DB via `getServiceCategories` query — fully dynamic, no hardcoded content except pricing ranges (stored as category metadata or content.tsx).

---

### 3. Guest Request Wizard

Runs entirely without authentication. State held in React (or sessionStorage for page refresh resilience).

**Step 1 — Category** (pre-filled if entering from a category page)
- Show category name + icon, confirm or let user change

**Step 2 — Sub-service**
- Load children of selected parent from DB
- Card grid, single select
- "Not sure" option advances with parent category only

**Step 3 — Qualifier questions**
- Dynamic per sub-service — stored as a `questions` JSON field on `ServiceCategory`
- Question types: single-select, multi-select, text, date, boolean
- Example for HVAC AC Repair: "What's the issue?" / "How old is the unit?" / "Urgent (within 24h)?"
- Skip button available — no required questions block progress

**Step 4 — Location**
- Postal code input with validation (Canadian format)
- Auto-detect with "Use my location" option

**Step 5 — Contact info**
- First name, email, phone
- SMS consent checkbox
- Referral code (optional, collapsed by default)

**Step 6 — OTP verify**
- 6-digit code sent to email (existing OTP infrastructure)
- On success:
  - **New user:** create User + create ServiceRequest + create RewardAccount + redirect to `/dashboard`
  - **Existing user:** attach session + create ServiceRequest on existing account + redirect to `/dashboard`
- On failure: show error, allow resend

---

### 4. Simplified Onboarding (`/onboarding`)

After the guest wizard handles all data collection, `/onboarding` is only needed for:
- Users who sign up via direct login without a pending request
- Provider sign-up (unchanged — 4-step flow stays)

For consumers arriving via the guest wizard, onboarding is skipped entirely — their profile is complete by the end of the wizard.

**Consumer onboarding (fallback only):**
- Step 1: Role (Homeowner vs Pro)
- Step 2: Profile (name, phone, postal code, SMS consent)
- Step 3: Pick a service to request (redirects into wizard Step 2+)

---

## Data Model Changes

### `ServiceCategory` — add qualifier questions

```prisma
model ServiceCategory {
  // existing fields...
  questions Json?  // array of { id, type, label, options?, required }
}
```

Question schema:
```ts
type Question = {
  id: string
  type: 'single' | 'multi' | 'text' | 'boolean' | 'date'
  label: string
  options?: string[]   // for single/multi
  required?: boolean
}
```

### `ServiceRequest` — add qualifier answers

```prisma
model ServiceRequest {
  // existing fields...
  qualifierAnswers Json?   // { questionId: answer }
  guestEmail       String? // captured before account creation
  guestPhone       String? // captured before account creation
}
```

The `guestEmail` / `guestPhone` fields allow saving a partial request before OTP verification, enabling GHL lead capture on abandonment.

---

## Auth Flow Change

Current OTP verify endpoint (`/api/auth/verify-otp`) returns `{ sessionId, isNewUser }` and the client navigates based on `isNewUser`. 

New behaviour needed:
- Accept optional `pendingRequest` payload alongside OTP verification
- On success, atomically: verify OTP → create/fetch user → save request → return session
- New endpoint or extended existing: `POST /api/auth/verify-otp-and-save-request`

---

## Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Categories fail to load | Skeleton → error state with retry |
| Qualifier questions missing for a sub-service | Skip Step 3, go straight to location |
| OTP expired | Show resend option, no penalty |
| OTP max attempts | 15-minute lockout with countdown |
| Existing account email | "Welcome back" — merge request into existing account |
| Postal code outside service area | Warn but don't block — note "we're expanding to your area soon" |

---

## SEO Considerations

- `/services/:categorySlug` pages must render server-side or have static meta tags
- Wasp's current setup uses client-side React — use `react-helmet` or Wasp's built-in head management for per-page meta
- Category slugs should be human-readable: `/services/hvac`, `/services/plumbing`

---

## Out of Scope

- Provider onboarding (unchanged)
- Admin dashboard
- Rewards system changes (signup bonus still awarded on account creation)
- Payment flow

---

## GitHub Issues

| Issue | Scope |
|-------|-------|
| #68 (Epic) | Overall tracking |
| #60 | Homepage hero + category grid + nav dropdown |
| #64 | Guest request wizard (auth-last, dynamic questions) |
| #65 | Service detail pages (/services/:slug) |
