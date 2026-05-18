# E2E Test Run Guide

_Last updated: 2026-05-18_

## Prerequisites

- Node.js 20 + Wasp CLI installed
- Docker running (for managed PostgreSQL via Wasp)
- `.env.server` and `.env.client` files present at project root

## Quick Run (3 terminals)

```bash
# Terminal 1 — start the database (keep running)
wasp start db

# Terminal 2 — start the dev server (keep running, wait for "ready")
wasp start

# Terminal 3 — seed test accounts, then run tests
wasp db seed
wasp test
```

## Test Accounts (created by seed)

| Email | Password | Role |
|-------|----------|------|
| `consumer@thehelper.ca` | `HelperTest123` | Consumer |
| `hvac@thehelper.ca` | `HelperTest123` | Provider (HVAC, VERIFIED) |
| `admin@thehelper.ca` | `HelperTest123` | Admin |

## What's Being Tested

| Spec file | Tests | Notes |
|-----------|-------|-------|
| `public-pages.spec.ts` | 20 tests | Unauthenticated pages — landing, service pages, auth pages |
| `consumer-flow.spec.ts` | 7 tests | Auth required — dashboard, requests, rewards, referral, analytics |
| `provider-flow.spec.ts` | 6 tests | Auth required — provider dashboard, leads, profile, billing |

**Total: 33 tests. Target: 27+ passing (80%)**

## Base URL

Playwright uses `http://localhost:3000` by default (set in `playwright.config.ts`).
To run against a different host:

```bash
PLAYWRIGHT_BASE_URL=https://staging.thehelper.ca wasp test
```

## Known Static Analysis Results (2026-05-18)

All page–test contracts verified against source:

| Route | Test Assertion | Status |
|-------|---------------|--------|
| `/` | "Find a Helper" link | ✅ Link exists at LandingPage:181 |
| `/hvac`, `/plumbing`, etc. | h1/h2 + service name text | ✅ All 6 service pages have headings |
| `/areas/:slug` | h1/h2 + area name text | ✅ AreaLandingPage has dynamic heading |
| `/how-it-works` | h1/h2 + `[class*="step"]` | ✅ Fixed: `step-card` class added to step divs |
| `/how-rewards-work` | h1/h2 + "reward" text | ✅ Page has multiple reward headings |
| `/providers` | "Apply" link | ✅ "Apply as a Pro →" link at line 33 |
| `/providers/apply` | form + inputs | ✅ `<form>` with 7+ `<input>` fields |
| `/contact` | form + inputs | ✅ 2-step form with inputs |
| `/login` | email + password inputs | ✅ Wasp LoginForm renders both |
| Login button | `/log in/i` | ✅ Wasp renders "Log in" |
| `/dashboard` | h1/h2 | ✅ |
| `/my-requests` | h1/h2 or empty state | ✅ |
| `/rewards` | h1/h2 + points/reward text | ✅ "Rewards Wallet" h1 + balance |
| `/referral` | `<code>` or "referral code" text | ✅ `<code>` element with referral code |
| `/analytics` | h1/h2 | ✅ "Analytics" h1 |
| `/provider/dashboard` | h1/h2 | ✅ |
| `/provider/leads` | h1/h2 or lead text | ✅ |
| `/provider/appointments` | h1/h2 or appointment text | ✅ |
| `/provider/profile` | h1/h2 + form inputs | ✅ |
| `/provider/billing` | h1/h2 + billing text | ✅ "Billing & Invoices" h1 |
| `/provider/services` | h1/h2 + service text | ✅ "Service Listings" h1 |

## If Tests Fail

**Auth failures** (login times out):
- Check `wasp db seed` was run
- Verify test accounts exist: `wasp db studio` → Users table

**Port mismatch** (can't connect):
- Confirm `wasp start` client is running on `:3000` (check terminal output)
- Some Wasp versions run client on `:3000`, server on `:3001` — both must be running

**Selector not found**:
- Run with `--headed` to watch: `npx playwright test --headed`
- Check route is declared in `main.wasp` and page component exists

## Updating Tests After UI Changes

Tests use broad selectors (`h1, h2`, `.or()` chains) to survive minor copy changes.
Only update tests when:
- A route path changes in `main.wasp`
- A page is completely removed or redesigned
- A key CTA text changes (e.g. "Find a Helper" → "Get Help Now")
