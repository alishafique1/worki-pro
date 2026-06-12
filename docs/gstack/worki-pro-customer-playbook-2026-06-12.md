# Customer Acquisition Playbook — The Helper v2
**Date:** 2026-06-12
**Status:** Draft — CEO Review
**Type:** Product Strategy + Architecture

---

## Context: Where We Are

### Current Flow (today)
```
/get-quotes (guest) → wizard (4 steps) → OTP verify → dashboard
                        ↓
                   GHL webhook fires → sales team manually routes
```
- `/discover` and `/listings` show vendors publicly
- No appointment booking in the consumer flow
- Rewards are a point system disconnected from the actual booking experience
- Consumer gets to dashboard but has no visibility into what happens next
- Provider gets leads but no calendar integration

### What's Working
- OTP email verification is solid (atomic rate limits, race-condition fixed)
- Rewards tier explanation on landing page builds awareness
- Guest wizard works without forcing account creation upfront
- Cal.com webhook exists for provider calendar (provider onboarding via cal.com username)
- GHL webhook fires on new leads (manual handoff)

### What's Broken
- Showing vendors publicly (`/discover`, `/listings`) kills the Bark-style lead-capture mojo
- No consumer-facing appointment confirmation or calendar invite
- Rewards are abstract (points) not tied to a concrete "you booked X → you're getting points back" moment
- The portal promise ("use your email to login and track your points") isn't in the wizard copy
- SMS consent exists in the form but the value proposition isn't explained

---

## The Shift: Bark-Inspired, Trust-First

**Reference models:**
- **Bark.com** — no vendor browsing; submit request → match to 3-5 pros → you get calls. Lead gen, high volume, low trust.
- **Thumbtack** — browse vendors, get quotes, hire one. Discovery-heavy, harder for new marketplace.
- **Upwork** — open marketplace with escrow and reviews. Works for digital; home services need location + trust.
- **Fiverr** — fixed-price gigs, seller profiles. Doesn't map to variable home service pricing.

**Our model: Trust-First Lead Capture + Service Tracking**

We do NOT show vendors until the lead is captured and matched. Then we provide:
1. **Appointment booking** — the trust-building moment (Cal.com already in the stack)
2. **Rewards with proof** — "Your pro booked the appointment → you're earning 500 points"
3. **Single pro accountability** — no competing quotes, one confirmed pro, one trackable job

The reward is "your appointment is booked and verified, here's your 500 points."

---

## Customer Acquisition Funnel (v2)

### Phase 1: Lead Capture (today → launch)

**Goal:** Capture email + full request + preference before showing anything about vendors.

**New /get-quotes flow:**

```
Step 1: Category selection (no change)
Step 2: Qualifier questions (no change)
Step 3: Contact + preference  ← UPGRADE
  - First name, postal code, phone (same)
  - NEW: SMS consent explanation
    "We'll send you SMS updates about your booking — 
     like when a pro confirms your appointment."
  - NEW: Email portal explanation
    "Your email will be your login to track your 
     request, see your point-based rewards, and 
     manage appointments."
  - Referral code (same)
Step 4: Email verification  ← UPGRADE
  - "Check your email" (same OTP flow)
  - NEW: Post-verification confirmation screen
    "You're in! We've sent your request to 
     verified pros in your area. You'll get 
     a call or text within 15 minutes."
  - NEW: No vendor browsing — show "Your request is live" state
  - NEW: Email immediately sends:
    - Confirmation to consumer (request received, what happens next)
    - Lead alert to provider(s) in their service area (GHL webhook)
```

**What we stop doing:**
- `/discover` page — remove from nav, 302 redirect to `/get-quotes`
- `/listings` page — remove from nav, 302 redirect to `/get-quotes`
- Showing provider cards before email capture

**What we add:**
- Post-submission "Your request is live" confirmation screen (no routing to dashboard immediately — they need to see the confirmation first)
- Email copy: explain the portal ("this email is your account — log in to track your rewards and appointments")
- SMS opt-in copy explains the value ("get notified when a pro confirms your appointment")

### Phase 2: Appointment Booking (next sprint)

**Goal:** When a provider accepts/-books a job, the appointment appears in the provider's Cal.com calendar AND the consumer gets a calendar invite.

**Current state:** Cal.com webhook exists (`calcomWebhook` operation) but only fires for existing matched leads. Consumer doesn't get a calendar invite.

**New flow:**
```
Provider claims lead (or admin assigns request to provider)
    ↓
Provider marks job as "ACCEPTED_BY_PROVIDER" or "BOOKED"
    ↓
System creates Cal.com booking for the provider
    ↓
Consumer receives email calendar invite (.ics) + SMS notification
    ↓
Reward transaction fires: BOOKED_APPOINTMENT → +500 points
```

**Key changes needed:**
1. `markJobCompleted` or `acceptServiceRequest` (provider side) → trigger Cal.com event creation
2. Consumer `ServiceRequest` record gets `scheduledAt` and `providerConfirmedAt` fields
3. Email template: ICS calendar invite sent to consumer's email
4. SMS via Twilio: "Your Helper appointment is booked for [date/time]. Pro: [name]. Reply HELP for support."

**Cal.com integration (current):**
- Provider applies with `calcomUsername` field ✓
- `calcomWebhook` exists and fires on booking events ✓
- Missing: consumer-side calendar invite on `BOOKED` status

**Reward trigger point:** When status becomes `BOOKED` (provider confirms time), fire `BOOKED_APPOINTMENT` reward immediately — not waiting for job completion. This is the emotional "you earned it" moment.

### Phase 3: Rewards Clarity (later)

**Current rewards:** Points with a tier system. Abstract.

**v2 rewards UX:**
- After booking: "You'll earn 500 points when the job is completed and verified by The Helper."
- After completion: "Job verified! 5,000 points is pending. It will appear in your wallet within 24 hours."
- At 10,000 points threshold: "You've hit 10,000 points ($100 cash value)! Redeem as gift cards (Amazon, Home Depot, Canadian Tire)."

**No change to backend — only the copy and the moment rewards fire.**

---

## Provider Onboarding (Fiverr-inspired, but trust-first)

**Current:** Provider applies via `/providers/apply` → admin reviews → manually approved → gets login.

**Problem:** No self-service. Admin bottleneck. No visible pipeline for the provider.

**v2 provider flow:**
```
1. Provider submits application (same as today)
   - Business name, contact name, phone, email, service areas, categories, cal.com username
   - → Creates ProviderApplication record (not yet a Provider)
   
2. Auto-email: "Your application is under review. We'll be in touch within 24-48 hours."
   
3. Admin approves (or auto-approve if all fields valid and service area is canonical)
   - ProviderAccount created
   - Provider gets welcome email with login link (magic link or temp password)
   
4. Provider onboarding wizard (new):
   - Step 1: Set up Cal.com (already have username? → link it; don't have? → create free account)
   - Step 2: Add service categories + service areas (confirm canonical areas)
   - Step 3: Set availability (Cal.com calendar integration — pull from Cal.com)
   - Step 4: Set notification preferences (SMS for new leads, email for job updates)
   - Complete → Provider dashboard active
   
5. Provider dashboard:
   - "X new leads in your area" (not full PII until claimed)
   - "Claim lead (500 points)" button → reveals customer contact
   - Calendar view (synced from Cal.com)
   - Earnings: completed jobs + pending points
```

**Key insight from Fiverr:** Providers need to feel like they're building a business, not just getting leads. The dashboard should show:
- Jobs completed this month
- Average rating
- Earnings (the 5% point-based earnings they earn on each job — yes, providers also earn via the rewards system)
- Response rate (if they don't respond within 15 min, they lose the lead)

**Key insight from Upwork:** Escrow and milestone tracking. For home services, the equivalent is: we hold the lead until they confirm the appointment. If they don't respond in 2 hours, the lead goes back to the pool.

---

## Architecture Changes

### Consumer Flow (frontend changes)

| File | Change |
|------|--------|
| `StepInfoAndVerify.tsx` | Add SMS opt-in copy (explains value), add email-portal explanation text |
| `StepVerifyEmail.tsx` | Add post-verification "Your request is live" confirmation screen (new sub-step after OTP) |
| `GuestRequestWizardPage.tsx` | Add Step 5: confirmation (or extend Step 4 success state) |
| NavBar | Remove "For Pros" → redirect to `/providers/apply`. Remove "Discover" link. |

### Email Templates

| Template | Change |
|---------|--------|
| `request-confirmed` | Add portal explainer: "This email is your The Helper account. Log in to track rewards, appointments, and your job status." |
| `appointment-booked` | New template. ICS calendar invite attached. Plain text + HTML. |

### Provider Operations

| Operation | Change |
|-----------|--------|
| `acceptServiceRequest` | On status change to BOOKED: fire Cal.com event, send consumer ICS, trigger BOOKED_APPOINTMENT reward |
| `submitProviderApplication` | Add auto-approve logic for valid submissions (all fields + canonical service areas) |
| New: `getProviderApplicationStatus` | Let providers check their application status without login |

### Appointment Integration

| Component | Change |
|-----------|--------|
| Cal.com webhook | Already exists — extend to consumer invite |
| `ServiceRequest` schema | Add `scheduledAt`, `providerConfirmedAt` fields |
| Twilio SMS | New template: `APPOINTMENT_CONFIRMED` — fires on BOOKED status |

---

## What's Already Done That We Can Build On

- Cal.com webhook (`calcomWebhook`) ✓
- SMS via Twilio (`handleTwilioSms`) ✓
- GHL webhook for lead routing (`handleGhlWebhook`) ✓
- OTP email verification ✓
- Reward account + transactions (Prisma schema has `RewardTransaction`, `Redemption`) ✓
- Provider application form (no self-service yet, but form exists) ✓
- Canonical service areas (added today in `onboardingOperations.ts`) ✓

---

## Launch Sequence

**Week 1 (this week):**
- [ ] Remove `/discover` and `/listings` from nav (301 → `/get-quotes`)
- [ ] Update StepInfoAndVerify: SMS copy + email portal explanation
- [ ] Update StepVerifyEmail: post-confirmation "request is live" screen
- [ ] Update email template: portal explainer

**Week 2 (next sprint):**
- [ ] Cal.com → consumer calendar invite on BOOKED status
- [ ] BOOKED_APPOINTMENT reward fires on status change (not job completion)
- [ ] SMS template: `APPOINTMENT_CONFIRMED`
- [ ] Provider auto-approve logic (valid submissions get instant approval)

**Week 3:**
- [ ] Provider onboarding wizard (Cal.com setup, availability, notification prefs)
- [ ] Provider dashboard: lead count, calendar view, earnings
- [ ] Lead expiry: unclaimed leads after 2h go back to pool

**Post-launch:**
- [ ] Rewards UX: "you earned X points" moment at each milestone
- [ ] Escrow-style milestone tracking: request → booked → completed → reviewed
- [ ] Provider response rate metric (affects lead distribution)
- [ ] Review flow tied to appointment completion (only verified jobs get reviews)

---

## Risks and Decisions

**Risk: No vendors in discover means lower conversion for people who want to browse first.**
Fix: The category landing pages (`/hvac`, `/plumbing`) still have service area content + CTA to submit request. This is the right tradeoff — we want intent-based leads, not browsing.

**Decision: Do we show "Your request is live" state or go straight to dashboard?**
Go to a confirmation screen first, then link to dashboard. The confirmation is the "you did it" moment. Dashboard is for tracking.

**Decision: When do we show the consumer the provider's name/contact?**
Only after the provider confirms the appointment (status = BOOKED). Before that, the consumer sees "A verified pro in your area will be in touch within 15 minutes."

**Decision: SMS — opt-in or opt-out?**
Opt-in (current). Keep it opt-in. Explain value in the copy. SMS consent on the form is already there — just improve the explanation.

**Decision: Rewards — point-based or cash back?**
Point-based framing is better for consumer trust. "Earn 500 points when your appointment is booked" is clearer and more consistent with the rewards system. Convert all dollar equivalents to points in all consumer-facing copy.

---

*This playbook is a working document. Update after each sprint review.*