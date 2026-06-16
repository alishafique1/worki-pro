# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This App Is

**The Helper** (codebase: worki-pro) is a two-sided home services marketplace connecting GTA homeowners (Milton, Oakville, Burlington) with vetted local service providers. Primary flow: consumer submits a service request → provider browses masked leads → provider claims lead → appointment booked → review submitted → consumer earns rewards.

## Design System

All UI uses this token set — never introduce new colours or CSS variables:

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#2563EB` | Buttons, links, active states |
| Navy | `#0F172A` | Dark sections, footer |
| Slate | `#475569` | Body text, secondary |
| Page bg | `#F8FAFC` | Page background |
| Surface | `#FFFFFF` | Cards, panels |
| Border | `#E2E8F0` | Dividers, card borders |
| Success | `#22C55E` | Status badges |
| Amber | `#F59E0B` / `#FEF3C7` | Warnings, rewards |

**Never use**: `#F2B5D7` pink, `#0C110F` near-black, `var(--accent)`, `var(--surface-raised)`, `var(--text-secondary)`, `mesh-gradient`, `glass-dark`, `btn-shine`, `card-glow-pink`.

## Commands

This project uses the **Wasp CLI** exclusively — there are no npm scripts.

```bash
wasp start db          # Start managed PostgreSQL via Docker (keep running in Terminal 1)
wasp start             # Start full-stack dev server (keep running in Terminal 2)
wasp db migrate-dev --name <name>   # Create + apply a migration after schema changes
wasp build             # Generate production build (outputs to .wasp/out/)
wasp clean             # Reset all generated code and node_modules
wasp test              # Run Playwright E2E tests
```

**Seed the database** (after `wasp start db` is running):
```bash
# In the Wasp console or via operations — runs seedVendorCategories + seedMockUsers
wasp db seed
```

**If `wasp db migrate-dev` hangs**, use the fallback:
```bash
cd .wasp/out/db && npx prisma db push --accept-data-loss
```

## Architecture

**Stack**: Wasp 0.21 (full-stack DSL) → React 19 + **Tailwind CSS v4** (frontend) + Node.js/Express (backend) + Prisma v5 + PostgreSQL.

**Fonts**: Fraunces (headings, 300–900 weight) + DM Sans (body, 300–700 weight) — loaded via Google Fonts in `main.wasp` head.

**`main.wasp`** is the single source of truth for the app graph — every page, route, query, action, job, and webhook must be declared there. The framework code-generates the React Router wiring, RPC layer, and Express routes from it. Use `//#region FeatureName` / `//#endregion` to group related declarations.

**`schema.prisma`** lives at the project root (not inside `src/`).

**API endpoints (declared in `main.wasp`, handled manually)**:
- `POST /api/auth/request-otp` / `verify-otp` — passwordless email OTP login
- `POST /webhooks/twilio` — inbound SMS handling
- `POST /webhooks/ghl` — GoHighLevel webhooks
- `POST /calcom-webhook` — Cal.com scheduling events
- `GET /api/health` — health check

**Background jobs**: `dailyStatsJob` runs hourly via PgBoss, calls `calculateDailyStats` in `src/analytics/stats`.

## Source Structure

Code is organized by feature domain, not by layer:

```
src/
├── admin/          # Admin dashboard: users, leads, providers, reviews, analytics
├── analytics/      # Daily stats calculations and background jobs
├── auth/           # OTP verification, email templates, signup field customization, onboarding
├── consumer/       # Request wizard, dashboard, rewards, referrals, messages
├── provider/       # Lead feed, appointments, profile editing, billing, messages
├── landing-page/   # Marketing and SEO pages (area/category based)
│   ├── marketplace/     content.tsx (all copy), components.tsx (reusable sections)
│   ├── HvacLandingPage  (one per live category + /services/:categorySlug dynamic)
│   └── AreaLandingPage, ServiceAreaLandingPage, CategoryLandingPage
├── server/
│   ├── webhooks/   # Twilio, Cal.com, GoHighLevel webhook handlers
│   ├── services/   # Business logic services (ghl.ts, etc.)
│   └── scripts/    # DB seeding (dbSeeds.ts — DEFAULT_VENDOR_CATEGORIES here)
├── client/
│   └── components/
│       ├── NavBar/  # constants.ts (nav items), NavBar.tsx, Announcement.tsx
│       └── ui/      # shadcn/ui components (button, card, dialog, toast, etc.)
├── file-upload/    # AWS S3 upload operations
├── demo-ai-app/    # Demo app with GPT responses + tasks
├── user/           # Account page, profile editing
└── shared/         # Terms, Privacy, Help pages
```

Each feature dir typically contains: `operations.ts` (queries + actions), `*Page.tsx` (React components).

## Service Categories

**Live** (have dedicated SEO landing pages): HVAC, Plumbing, Electrical, Appliance Repair, Handyman, Smart Home.

**Defined in seed, shown as "coming soon" on landing page**: Cleaning, Painting, Flooring, Roofing, Landscaping, Snow Removal, Tree Services, Pest Control, Locksmith, Window Cleaning, Moving, Garage Door, Junk Removal, Waterproofing, Renovation, Home Inspection, Fence & Gate, Pool & Spa, Events.

**To add a live category** (e.g. Cleaning):
1. Add a `CleaningLandingPage.tsx` in `src/landing-page/`
2. Add the route in `main.wasp`: `route CleaningRoute { path: "/cleaning", to: CleaningLandingPage }`
3. Update `href` and `comingSoon: false` in `src/landing-page/marketplace/content.tsx`
4. Add to `marketingNavigationItems` in `src/client/components/NavBar/constants.ts` if needed

## Dev Test Accounts

After running `wasp db seed`:

| Email | Password | Role |
|-------|----------|------|
| `consumer@thehelper.ca` | `HelperTest123` | Consumer (Sarah Chen, Milton) |
| `consumer2@thehelper.ca` | `HelperTest123` | Consumer (James Kowalski, Oakville) |
| `hvac@thehelper.ca` | `HelperTest123` | Provider — HVAC (Mike Torres, VERIFIED) |
| `plumber@thehelper.ca` | `HelperTest123` | Provider — Plumbing (Dave Singh, VERIFIED) |
| `admin@thehelper.ca` | `HelperTest123` | Admin |

## Wasp-Specific Patterns

**Declaring operations** — every query/action needs two things:

1. An entry in `main.wasp`:
```wasp
query getMyRequests {
  fn: import { getMyRequests } from "@src/consumer/operations",
  entities: [ServiceRequest]
}
```

2. An implementation in `src/{feature}/operations.ts`:
```ts
import type { GetMyRequests } from 'wasp/server/operations'
export const getMyRequests: GetMyRequests = async (args, context) => { ... }
```

**Import paths** (critical — do not mix these up):
| Context | Prefix | Example |
|---------|--------|---------|
| `.ts`/`.tsx` files | `wasp/...` | `import { User } from 'wasp/entities'` |
| `.ts`/`.tsx` files (client ops) | `wasp/client/operations` | `import { useQuery, myAction } from 'wasp/client/operations'` |
| `.ts`/`.tsx` files (server ops) | `wasp/server/operations` | `import type { GetMyRequests } from 'wasp/server/operations'` |
| `.ts`/`.tsx` files (auth) | `wasp/client/auth` | `import { useAuth } from 'wasp/client/auth'` |
| `.ts`/`.tsx` files (server errors) | `wasp/server` | `import { HttpError } from 'wasp/server'` |
| `main.wasp` | `@src/...` | `import { getMyRequests } from "@src/consumer/operations"` |
| Prisma enum *values* | `@prisma/client` | `import { RequestStatus } from '@prisma/client'` |
| `.ts`/`.tsx` relative paths | `./` or `../` | `import { utils } from './lib/utils'` |

**Never use** `@wasp/...` (undescore prefix), `@src/...` in `.ts`/`.tsx` files, or `wasp/...` in `main.wasp`.

**Client data fetching**:
```ts
const { data, isLoading } = useQuery(myQuery, args)  // queries — useQuery hook
await myAction(args)                                  // actions — call directly, NOT via useAction
```
**Do NOT use** `useAction` unless implementing optimistic updates. Call actions with `await` directly.

**Server error handling** — throw `HttpError` from `wasp/server`:
```ts
import { HttpError } from 'wasp/server'
if (!context.user) throw new HttpError(401, 'Not authorized')
```

## shadcn/ui Components

All shadcn UI components live in `src/client/components/ui/`. Currently available:
`accordion`, `alert`, `avatar`, `button`, `card`, `checkbox`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `progress`, `select`, `separator`, `sheet`, `switch`, `textarea`, `toast`, `toaster`.

**To add a new shadcn component**, run `npx shadcn@latest add <component>` — then manually fix the `utils` import path to `../../utils` (from the `src/client/components/ui/` dir).

**Tailwind CSS v4**: This project uses Tailwind v4, not v3. Configuration differs (CSS-based config, not `tailwind.config.js`). The app uses **custom Dribbble-inspired tokens** (listed in the Design System table above) — do not introduce new colours beyond the token set.

## External Integrations — Webhook Flow

| Integration | Direction | Handler | Route |
|-------------|-----------|---------|-------|
| Twilio SMS | Inbound SMS → App | `src/server/webhooks/twilio.ts` | `POST /webhooks/twilio` |
| Cal.com | Booking events → App | `src/server/webhooks/calcom.ts` | `POST /calcom-webhook` |
| GoHighLevel | Lead/contact → App | `src/server/webhooks/ghl.ts` | `POST /webhooks/ghl` |

All webhook handlers are declared in `main.wasp` as `api` blocks (not `action`/`query`) and receive raw HTTP requests. Log webhook payloads via `WebhookLog` entities where possible.

## Key Domain Rules

**Lead masking**: `getPublicLeadFeed` must strip `name`, `phone`, and `email` from `ServiceRequest`. These are only revealed after `claimLead` succeeds.

**Claim lead** is idempotent: calling twice returns `{ alreadyClaimed: true }`. It requires provider status `VERIFIED`, creates a `ProviderFee(QUALIFIED_LEAD, $5.00)`, and sends the consumer an email notification.

**Request status lifecycle**: `NEW → SMS_STARTED → QUALIFYING → QUALIFIED → ASSIGNED → ACCEPTED_BY_PROVIDER → BOOKED → COMPLETED → REWARD_PENDING → REWARD_APPROVED → CLOSED`. Also: `LOST`, `INVALID`, `SPAM` for dead ends.

**OTP flow**: `sendOtp(phone)` → Twilio SMS → `verifyOtp(phone, code)` (SHA-256 hash, 5 attempt max, 3 sends per 5 minutes per phone, 10-minute TTL).

**Provider onboarding**: Signup → `completeOnboarding` action → role selection (CONSUMER/PROVIDER) → if PROVIDER: fill business info, select service categories → `submitProviderApplication` → status `PENDING`. Admin approves → status `VERIFIED`. Provider then sees lead feed and can claim leads.

**Public provider profile**: Consumers and search engines can view `/pro-public/:slug` — a Bark-style public profile with bio, portfolio photos, accreditations, and reviews. The slug is set on the Provider model and is unique.

**Reviews**: One review per `serviceRequestId` per consumer. After submission, recompute `Provider.ratingInternal` via Prisma `aggregate(_avg.rating)`. Admin moderates `PENDING → PUBLISHED` or `REJECTED`.

**Role guards**: Admin routes check `user.isAdmin`. Provider portal routes check `context.user.role === 'PROVIDER'`. Consumer routes check `context.user.role === 'CONSUMER'`. The auth guard (`authRequired: true`) is declared per page in `main.wasp`.

**Email OTP (passwordless)**: Users can request an OTP code at `/api/auth/request-otp` → emailed via Mailgun → verify at `/api/auth/verify-otp` → creates or retrieves user session.

## Key Data Models

| Model | Purpose |
|-------|---------|
| `User` | All users; role: `CONSUMER / PROVIDER / ADMIN` |
| `Provider` | Pro profile (slug, bio, rating, categories, verification status) — 1:1 with User |
| `ServiceRequest` | A consumer lead; status: `NEW → ASSIGNED → COMPLETED` |
| `Appointment` | Scheduled job linked to a ServiceRequest and Provider |
| `ProviderFee` | Revenue events: `QUALIFIED_LEAD` ($5), `BOOKED_APPOINTMENT`, `SUCCESS_FEE` |
| `OtpVerification` | Phone OTP with TTL and attempt tracking |
| `Review` | 1-5 star; status: `PENDING / PUBLISHED / REJECTED` |
| `CommunicationLog` | In-app messages (channel, direction) |
| `RewardAccount` / `RewardTransaction` | Consumer points wallet |

## Auth

Wasp email authentication with Mailgun. Signup fields (firstName, lastName, phone, postalCode, role) are customized via `getEmailUserFields` in `src/auth/`. Social auth is intentionally disabled. Default post-signup redirect: `/onboarding`.

Email templates are in `src/auth/email-and-pass/emails.ts` — branded as The Helper with `#2563EB` button colour.

## NavBar

`marketingNavigationItems` in `src/client/components/NavBar/constants.ts` controls the 3-item public nav: Services · How it Works · Rewards. Keep it short — no more than 4 items.

## Environment Variables

Secrets live in `.env.server` (server-side) and `.env.client` (client-side, prefixed `REACT_APP_`). Never commit these files.

Required for production:
```
DATABASE_URL=postgresql://...
WASP_WEB_CLIENT_URL=https://thehelper.ca
JWT_SECRET=<64-char hex>
PORT=3001
MAILGUN_API_KEY=...
MAILGUN_DOMAIN=...
ADMIN_EMAILS=socialdots.ca@gmail.com
```

## Deployment

`wasp build` produces `.wasp/out/` with a ready-to-use `Dockerfile`. Use the Dockerfile for production — it handles all dependency resolution correctly. Recommended platforms: Railway, Fly.io, or Render (all support the Wasp Dockerfile natively).

**Do not deploy by manually copying the build** — the Node.js server bundle has dependencies that must be installed inside the correct directory structure that the Dockerfile manages.
