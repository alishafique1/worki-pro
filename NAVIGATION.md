# NAVIGATION.md — Information Architecture & Sitemap

Source of truth for The Helper's routes and navigation surfaces. Read this before
adding a route or a nav item. The app graph itself lives in `main.wasp`; this file
explains *how it's organized and why*.

## Principles

1. **One destination per concept.** A label means the same page everywhere.
2. **Every route is reachable from a menu** (or is intentionally programmatic —
   redirects, deep links, dynamic detail pages). No URL-only orphans.
3. **Three audiences, three chromes.** Public/marketing uses the top `NavBar`.
   Consumer portal and provider portal each use a left sidebar. Admin uses its
   own sidebar. The chrome is chosen in `src/client/App.tsx`.
4. **Authed users never re-enter the guest funnel.** Logged-in consumers request
   service via `/request-service`; only logged-out visitors use `/get-quotes`.

## Audience map

### Public (logged-out + marketing) — top `NavBar`
Nav: **Services ▾ · How it Works · For Pros · Rewards** · [Log in] [Sign up] [Get quotes]

| Path | Page | Notes |
|------|------|-------|
| `/` | LandingPage | |
| `/services` | ConsumerServicesPage | all-services index (NavBar "Services" parent) |
| `/services/:categorySlug` | CategoryLandingPage | dynamic category SEO page — includes Digital Marketing, Software Development, Video Editing, Driving School |
| `/services/:serviceSlug/:areaSlug` | ServiceAreaLandingPage | dynamic SEO |
| `/hvac` `/plumbing` `/electrical` `/appliance-repair` `/smart-home` `/handyman` | *LandingPage | dedicated SEO pages (intentional, keep) |
| `/areas/:areaSlug` | AreaLandingPage | dynamic SEO |
| `/discover` | DiscoveryPage | consumer browse/search |
| `/how-it-works` | HowItWorksPage | |
| `/how-rewards-work` | HowRewardsWorkPage | the **Rewards** explainer |
| `/providers` | ProviderLandingPage | "For Pros" marketing |
| `/providers/apply` | ProviderApplyPage | |
| `/contact` | ContactPage | linked from footer |
| `/pro/:providerId` | ProviderDetailPage | → redirects to `/pro-public/:slug` (id→slug lookup) |
| `/pro-public/:slug` | ProPublicPage | canonical public SEO profile (by slug) |
| `/terms` `/privacy` | Terms/Privacy | footer |
| `/get-quotes` | GuestRequestWizardPage | **guest** request funnel only |
| `/request-success` | RequestSuccessPage | post-submit |

Auth pages (no chrome): `/login` `/signup` `/onboarding` `/request-password-reset`
`/password-reset` `/email-verification`.

### Consumer portal — left sidebar (`ConsumerLayout`)
All consumer portal paths are namespaced under `/account/*`. `/help` is public
(dual-use: portal chrome shows for authenticated consumers, marketing chrome shows
for guests).

| Section | Item | Path |
|---------|------|------|
| Overview | Dashboard | `/account` |
| Services | Request Service | `/account/request-service` |
| Services | My Requests | `/account/requests` |
| Account | Rewards | `/account/rewards` |
| Account | Referrals | `/account/referrals` |
| Account | Activity | `/account/activity` |
| Account | Help | `/help` (public, dual-use) |
| Account | Profile | `/account/profile` |

Programmatic / detail (portal chrome, not in sidebar): `/account/requests/:requestId`,
`/account/requests/:requestId/messages`, `/account/requests/:requestId/review`,
`/account/book/:requestId`.

Old paths (`/dashboard`, `/my-requests`, `/rewards`, `/referral`, `/analytics`,
`/book/:id`) are kept as redirect shims (via `src/consumer/portalRedirects.tsx`) for
bookmark and external-link compatibility.

`CONSUMER_PORTAL_PATHS` in `App.tsx` is now `['/account', '/help']` — the
`startsWith('/account/')` prefix check covers all nested portal pages.

### Provider portal — left sidebar (`ProviderLayout`)
| Section | Item | Path |
|---------|------|------|
| Overview | Dashboard | `/provider/dashboard` |
| Business | Leads | `/provider/leads` |
| Business | Appointments | `/provider/appointments` |
| Business | My Services | `/provider/services` |
| Account | Profile | `/provider/profile` |
| Account | Billing | `/provider/billing` |

Per-request message threads at `/provider/requests/:requestId/messages` (deep link).
There is **no** provider messages *index* — do not add a "Messages" nav item until
an index page exists.

### Admin — left sidebar (`src/admin/layout/Sidebar.tsx`)
| Section | Items |
|---------|-------|
| Overview | Dashboard (`/admin`) |
| CRM | Requests, Providers, Users |
| Quality | Reviews, Rewards |
| Catalog | Categories, Messages |
| System | Settings (`/admin/settings`), Calendar (`/admin/calendar`) |

Dev-only: `/admin/ui/buttons` (UI kit reference, not surfaced in nav).

## Removed in this pass
- `/file-upload` (OpenSaaS demo page) — route + page removed; S3 operations kept.
- `/listings` — dead duplicate of `/discover`.
- `/list-your-services` — overlapped `/providers` + `/providers/apply`.
- Dead nav arrays `consumerNavigationItems` / `providerNavigationItems` /
  `adminNavigationItems` / `demoNavigationitems` — sidebars own their menus.

## Implemented in this pass
- **Provider profile convergence (Phase D1).** `/pro/:providerId` now redirects
  to `/pro-public/:slug` via an id→slug lookup (`getProviderSlugById`). Provider
  cards link directly to `/pro-public/:slug`. One canonical public profile.
- **URL grammar / consumer namespace (Phase D2).** Consumer portal is now
  namespaced under `/account/*`. Old flat paths redirect via shim components in
  `src/consumer/portalRedirects.tsx`. See Consumer portal table above.

## Open items (future, not done here)
- None from navigation. Further design consistency passes are separate scope.
