# The Helper — Full UI Overhaul Design Spec
_Date: 2026-05-14_

## Overview

A full frontend redesign of TheHelper.ca — a two-sided home services marketplace serving the GTA (Milton, Oakville, Burlington). The redesign replaces the current pink/dark aesthetic with a clean white/blue design system, overhauls the landing page into a category-hub architecture, integrates the rewards program throughout, and applies consistent The Helper brand ad copy across all public-facing pages.

**What changes:** Landing page, NavBar, shared marketplace components, consumer dashboard, provider dashboard, auth pages, rewards page, and all public SEO/landing pages.

**What does NOT change:** Backend logic, database schema, Wasp operations, routing, or auth flow.

---

## 1. Design System

### 1.1 Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#2563EB` | Buttons, links, active states, icons |
| `--color-primary-dark` | `#1D4ED8` | Hover states on primary |
| `--color-primary-light` | `#EFF6FF` | Pill backgrounds, card highlights |
| `--color-primary-border` | `#BFDBFE` | Borders on highlighted elements |
| `--color-navy` | `#0F172A` | Page titles, dark sections background |
| `--color-slate` | `#475569` | Body text secondary |
| `--color-muted` | `#94A3B8` | Placeholder, tertiary text |
| `--color-bg` | `#F8FAFC` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, panels |
| `--color-border` | `#E2E8F0` | Dividers, card borders |
| `--color-success` | `#22C55E` | Trust checks, completed status |
| `--color-reward` | `#F59E0B` | Reward accents, star ratings |
| `--color-reward-bg` | `#FEF3C7` | Reward pill/card backgrounds |
| `--color-reward-border` | `#FDE68A` | Reward card borders |

**Remove entirely:** All `#F2B5D7` pink, `#0C110F` near-black, `var(--accent)` dark-mode variables from public pages.

### 1.2 Typography

| Role | Class | Spec |
|---|---|---|
| Display / H1 | `.text-display` | 42–48px, weight 900, tracking -0.03em |
| H2 / Section title | `.text-h2` | 28–32px, weight 800, tracking -0.02em |
| H3 / Card title | `.text-h3` | 16–18px, weight 700 |
| Body | `.text-body` | 14–15px, weight 400, line-height 1.65 |
| Caption / Label | `.text-label` | 10–11px, weight 700, tracking 0.08em, uppercase |
| CTA | `.text-cta` | 14–15px, weight 700 |

Font: System Inter stack (`'Inter', -apple-system, BlinkMacSystemFont, sans-serif`).

### 1.3 Spacing & Shape

- Base unit: 4px
- Border radius: `6px` (small), `10px` (inputs/pills), `14px` (cards), `20px` (pill badges)
- Card shadow: `0 4px 20px rgba(0,0,0,0.06)`
- Elevated shadow: `0 8px 40px rgba(37,99,235,0.10)`
- Primary button shadow: `0 4px 16px rgba(37,99,235,0.35)`

### 1.4 Component Library Changes

**`src/landing-page/marketplace/components.tsx`** — full restyle of all exported components:

| Component | Change |
|---|---|
| `Button` variant=primary | `bg-[#2563EB]` + blue shadow. Remove pink `#F2B5D7`. |
| `Button` variant=secondary | `bg-white border-[#E2E8F0]` stays. Adjust hover to `border-[#BFDBFE]`. |
| `Hero` | Replace with split layout (see §3.1). |
| `CategoryCard` | White card, blue icon bg, blue link. |
| `StepCard` | Blue numbered circle, clean body text. |
| `TrustBadge` | Dark navy card (used in trust section). |
| `Footer` | Dark navy `#0F172A` background with new link structure. |
| `SectionHeader` | eyebrow in `#2563EB`, title in `#0F172A`. |

---

## 2. NavBar

**File:** `src/client/components/NavBar/NavBar.tsx` + `Announcement.tsx`

### 2.1 Announcement Banner

Replace current black bar with a blue bar:
- Background: `#1D4ED8`
- Copy: _"Now serving Milton · Oakville · Burlington 🇨🇦 — Earn rewards on every completed job."_
- CTA pill: "Request Help Today!" → `/request-help` (fix route, change from service to help) — white pill, blue text

### 2.2 NavBar

- Background: `white`, border-bottom `#E2E8F0` (same sticky scroll behaviour)
- Logo: Keep `logo.webp` but add "The Helper" wordmark in `#0F172A` font-weight 800
- Nav links: `Services`, `How it works`, `Rewards`, `For Pros`
- Right side: `Log in` (text, slate), `Request Help Today!` (blue pill button)
- Remove: `DarkModeSwitcher` from public/landing pages (keep only inside authenticated dashboard)
- Mobile: Hamburger sheet — same links, blue CTA at bottom of drawer

---

## 3. Landing Page (`src/landing-page/LandingPage.tsx`)

Architecture: **Category hub** — homepage sells the platform broadly; each category card links to an existing category-specific page. New categories can be added by appending to the `categories` array.

### 3.1 Hero Section

**Layout:** Split — left text column, right live activity card.

**Left column:**
- Badge: `● Now serving GTA — Milton · Oakville · Burlington` (green dot, blue pill)
- H1: **"Get help with anything."** (em on "anything" in `#2563EB`)
- Subhead: _"Verified local pros for your home, events, and more — matched, booked, and tracked in one place."_
- Reward pill (amber): 🏆 _"The only platform where you get rewarded for getting things done at home."_
- CTA: `[Request Help Today!]` (primary blue) + `See how it works →` (ghost)
- Trust micro-row: ✓ Verified pros · ✓ GTA coverage · ✓ 4.9★ avg rating (hardcoded marketing stat, not from DB) · ✓ 🇨🇦 Canadian owned

**Right column — Live Activity Card (static/illustrative — no DB query):**
- This card is hardcoded marketing content on the public landing page. It does not query real requests (page is unauthenticated). Content is illustrative to communicate platform activity.
- Header: "Live requests near you" + green `● Live` badge
- 3 activity rows: service type, location, time-to-match, status chip (Done ✓ / Active / New)
- Reward earned callout at bottom: amber card — "James earned **$50** this month" (from job_completed — real earning amount per `REWARD_VALUES.JOB_COMPLETED`)
- Floating notification above card: avatar + "Sarah just earned $5! · AC repair submitted · Milton, ON"

**Inline search expansion (on CTA click):**
- Implementation: `useState<boolean>(false)` on the "Request Help Today!" button. Panel mounts below the CTA with `max-height` CSS transition (`transition-all duration-300 overflow-hidden`) — no page navigation, no modal.
- Panel contains:
  - Search input: `🔍 e.g. "AC not cooling", "leaky faucet", "outdoor lighting"…` — typing filters the popular services list client-side (no API call)
  - Section: **BROWSE CATEGORIES** — 4-column grid of category tiles (icon + name)
  - Active categories (6): HVAC, Handyman, Plumbing, Electrical, Smart Home, Appliances
  - Coming soon (2 dashed tiles): Events 🎉, More ➕ — visually disabled, no click action
  - Section: **POPULAR SERVICES** — 3 static rows (icon + service name + category label)
  - Clicking a live category tile → navigates to that category's landing page (e.g., `/services/hvac`)
  - Clicking a popular service row → navigates to `/request-service` (existing flow)

### 3.2 Services Section

- Eyebrow: "How Our Helpers Work"
- H2: _"Every service. One platform."_
- Subhead: _"Starting with home services — expanding into events, vendors, and local help as The Helper grows."_
- 3-column grid of `ServiceCard` components — 5 live + 1 dashed "Events & More (coming soon)"
- Each card: icon bg `#EFF6FF`, name, 1-line description, "View [category] services →" link

### 3.3 How It Works

- Eyebrow: "HOW IT WORKS"
- H2: _"From request to done — fast."_
- 4 steps in a row:
  1. **Describe the job** — _"Tell us what you need, where you are, and when you're available."_
  2. **Get matched** — _"We surface the right verified pro for your category and location."_
  3. **Confirm & book** — _"Schedule the appointment and track everything from your dashboard."_
  4. **Job done. Earn rewards.** — _"Rate your pro — and earn points toward your next service. 🏆"_

### 3.4 Rewards Section

**Background:** Blue gradient (`#1E3A8A → #1D4ED8`). Full-width. Two-column layout.

**Left — Copy:**
- Eyebrow: "THE HELPER REWARDS" (light blue)
- H2: _"The **only** platform where you get rewarded for getting things done."_ (em "only" in amber `#FCD34D`)
- Body: _"Every completed job earns you real cash back — redeemable as gift cards. The more you use The Helper, the more you save."_
- CTA: `[See how rewards work →]` (white button, blue text)

**Right — Tier Cards (real data from `LEVELS` array in `RewardsPage.tsx`):**
```
🏠 New Homeowner      0 – 499 pts      Start earning from your first booking
⭐ Active Homeowner   500 – 1,999 pts  Keep going — your next job unlocks more
🔧 Smart Maintainer   2,000 – 4,999 pts You're a regular — thank you
🏆 Home Rewards Pro   5,000+ pts        Top tier — maximum rewards every time
```
Note: Tier benefit copy (e.g., "priority matching") is aspirational display copy only — no backend privilege changes are in scope. These are marketing descriptions of the tiers, not gated features.
- Amber callout below tiers: 🎁 _"Refer a friend — both of you earn $5 when they submit their first request."_

**Earning summary (small row below tiers):**
- Submit a request → **+$** Points earned 
- Appointment booked → **+$**
- Job completed → **+$** ← highlighted
- Referral → **+$5 each**

### 3.5 Trust Section

**Background:** `#0F172A` dark navy. 4-column grid.

- Eyebrow: "BUILT ON TRUST" (light blue)
- H2: _"Every pro verified. Every job tracked."_
- Cards:
  - 🛡️ **Verified providers** — _"Credentials, insurance, and service areas reviewed before approval."_
  - ⭐ **Real reviews** — _"Ratings from verified completed jobs — no fake reviews, ever."_
  - 💬 **Secure messaging** — _"All communication stays connected to the job, in one place."_
  - 🇨🇦 **Canadian owned** — _"Built for Canadian homeowners. GTA-first, growing city by city."_

### 3.6 Testimonials

- Eyebrow: "WHAT HOMEOWNERS SAY"
- H2: _"Trusted by GTA homeowners."_
- 3 cards — each references rewards naturally:
  - _"Found an HVAC tech in 3 hours. AC fixed same day. And I earned reward points I didn't even expect."_ — Sarah M., Milton
  - _"One request, no calling around. Matched, booked, done. The referral bonus was a nice touch too."_ — James K., Oakville
  - _"A platform that actually vets who they send. The rewards program is a great bonus."_ — Priya S., Burlington

### 3.7 Provider CTA Band

**Background:** Light blue gradient (`#EFF6FF → #F0F9FF`).

- H3: _"Are you a local pro? Join The Helper network."_
- Body: _"Get matched with qualified leads in your service area. Manage bookings, messages, and reviews — all in one place."_
- Stats row: `6 service categories · GTA coverage · Free to apply`
- CTA: `[Apply as a Pro →]` (navy button)

### 3.8 Final CTA + Footer

**Final CTA (blue `#2563EB` background):**
- H2: _"Ready to get help — and earn rewards?"_
- Subhead: _"Join GTA homeowners who trust The Helper to get things done right."_
- Button: `[Request Help Today!]` (white, blue text)

**Footer (navy `#0F172A`):**
- 4 columns: Brand tagline | Services | Company | Legal
- Brand tagline: _"Canada's trusted platform for home services and local help."_
- Services: HVAC, Plumbing, Electrical, Handyman, Smart Home
- Company: How it works, Rewards, For Pros, Areas served, Help centre
- Legal: Privacy Policy, Terms of Service
- Bottom: © 2026 The Helper · 🇨🇦 Made in Canada

---

## 4. Consumer Dashboard Pages

Apply the new design tokens throughout. No structural changes to data flow.

### 4.1 DashboardPage

- Replace `var(--surface-raised)`, `var(--accent)` with explicit blue/white Tailwind classes
- "Welcome back" section: add reward balance chip next to heading (e.g., "🏆 $12.50 in rewards")
- Request cards: status chips in blue (active), green (done), slate (pending)
- Rewards widget: show current tier + progress bar in amber/blue

### 4.2 RewardsPage

- Replace dark-mode variable styles with light design system
- Balance card: white card, large `$12.50` in `#2563EB`, tier badge in amber
- Progress bar: blue fill on slate track
- Tier progression: show all 4 tiers as a timeline (current highlighted in blue/amber)
- Transaction history: clean white rows, green for earned, red for redeemed
- Redemption presets: blue selected state, white unselected

### 4.3 ReferralPage

- Header: _"Earn $5 for every friend you refer — they earn $5 too."_
- Referral card: prominent referral code + copy button
- Stats: referrals sent, referrals converted, total earned

### 4.4 RequestServicePage (intake wizard)

- Step indicator: blue active circles, slate inactive
- Input fields: `border-[#E2E8F0]` + `focus:border-[#2563EB]` ring
- CTA on each step: blue primary button
- Step 4 (OTP): keep existing OTP flow, apply new button styles

### 4.5 MyRequestsPage / RequestDetailPage

- Request status chips: blue (active), green (completed), amber (pending), red (cancelled)
- Message thread: consumer messages right-aligned blue, provider left-aligned slate

---

## 5. Provider Dashboard Pages

Same token replacement. No structural changes.

- Lead feed cards: white cards, blue "Claim Lead" button, status chips
- Profile page: blue save button, input focus rings
- Appointments: green completed, blue active, slate pending

---

## 6. Auth Pages (login / signup / password reset)

- Remove pink accent from `Button` component (already fixed by §1.4)
- Login page left panel: keep dark background — update headline to _"Your home. Handled right."_ and subhead to _"Trusted local pros, real rewards, one platform."_
- Trust bullets on login panel: ✓ Verified pros · ✓ Earn rewards · ✓ GTA coverage

---

## 7. Category-Specific SEO Pages

Files: `HvacLandingPage.tsx`, `PlumbingLandingPage.tsx`, `ElectricalLandingPage.tsx`, `HandymanLandingPage.tsx`, `SmartHomeLandingPage.tsx`, `ApplianceLandingPage.tsx`, `AreaLandingPage.tsx`

- Apply new `marketplace/components.tsx` styles (automatic once components are updated)
- Each page hero subhead should end with: _"...and earn rewards on every completed job."_
- Ensure each page has a prominent `[Request Help Today!]` CTA using the new blue button

---

## 8. Ad Copy — The Helper Brand Voice

**Brand personality:** Trustworthy, Canadian, helpful, modern, plain-spoken. Not salesy. Not corporate.

**Taglines (use throughout):**
- _"Get help with anything."_ (homepage hero — broad)
- _"Your home. Handled right."_ (auth pages, email subject lines)
- _"The only platform where you get rewarded for getting things done."_ (rewards hooks)
- _"Trusted local pros. One request away."_ (SEO pages, meta descriptions)
- _"Vetted. Matched. Done."_ (trust section eyebrow variant)

**CTA copy (consistent):**
- Primary consumer CTA: **"Request Help Today!"**
- Secondary: **"See how it works →"**
- Provider CTA: **"Apply as a Pro →"**
- Rewards CTA: **"See how rewards work →"**
- Coming soon: **"Get notified →"**

**Reward-specific hooks (sprinkle throughout):**
- _"Earn $5 just for submitting your first request."_
- _"Get $50 back when your job is marked complete."_
- _"Refer a friend — you both earn $5."_
- _"The more you maintain your home, the more you save."_

**Trust copy:**
- _"Every pro is vetted before they work."_
- _"No fake reviews. Ever."_
- _"GTA-first. Growing city by city."_
- _"Canadian owned and operated."_

---

## 9. Scalability — Adding New Categories

The category hub is designed for zero-code category expansion:

1. The `categories` export in `src/landing-page/marketplace/content.tsx` gains two new optional fields as part of this overhaul:
   - `comingSoon?: boolean` — when true, renders a dashed "Soon" tile, non-clickable
   - `href?: string` — the route for the category page (e.g., `/services/hvac`)
2. Existing 6 categories get `comingSoon: false` + their existing `href` filled in
3. To add a new category: append an entry with `comingSoon: true` — it appears automatically everywhere
4. When the category goes live: set `comingSoon: false`, add `href`

New category appears in: homepage services grid, inline search panel, footer services column — all driven from the single `categories` array. NavBar "Services" dropdown is a future enhancement (not in this spec).

---

## 10. Files Changed (Summary)

| File | Change type |
|---|---|
| `src/client/components/NavBar/NavBar.tsx` | Restyle — blue/white, remove dark mode switcher |
| `src/client/components/NavBar/Announcement.tsx` | New copy + blue background |
| `src/landing-page/marketplace/components.tsx` | Full restyle of all components |
| `src/landing-page/marketplace/content.tsx` | Updated ad copy, add `comingSoon` flag to categories |
| `src/landing-page/LandingPage.tsx` | New section order + rewards section + split hero |
| `src/consumer/RewardsPage.tsx` | Replace CSS vars with explicit blue/white classes |
| `src/consumer/ReferralPage.tsx` | Updated copy + new styles |
| `src/consumer/DashboardPage.tsx` | Token replacement + rewards chip |
| `src/consumer/RequestServicePage.tsx` | Button + input styles |
| `src/provider/LeadsPage.tsx` | Button + card styles |
| `src/provider/ProfilePage.tsx` | Button + input styles |
| All `*LandingPage.tsx` SEO pages | Inherit from updated components (no direct edits needed) |
