# Spec: Real Pros, New Categories, R2 Photo Upload, Navigation Phase 2

Date: 2026-06-25
Branch: charming-agnesi-ea572e
Status: Approved design — ready for implementation plan

## Summary

Four independent, independently-shippable workstreams:

- **A. R2 business-photo upload** — let providers upload business/portfolio photos to a public-read Cloudflare R2 bucket, shown on their public profile.
- **B. 4 new live categories** — Digital Marketing, Software Development, Video Editing, Driving School.
- **C. 5 real VERIFIED providers** — onboard real businesses via an idempotent, prod-safe seed script.
- **D. Navigation Phase 2** — (D1) converge provider profiles onto one slug-based public page; (D2) namespace consumer routes under `/account/*` with redirect shims.

**Build order:** B → C → D1 → A → D2. Categories first (pros depend on them); namespacing last (churny, safe to defer).

## Context (current state)

- `src/file-upload/s3Utils.ts` is already S3-compatible **and R2-ready**: `region: process.env.AWS_S3_REGION ?? 'auto'`, optional `endpoint: process.env.AWS_S3_ENDPOINT`, bucket `AWS_S3_FILES_BUCKET`. Upload uses presigned POST (`getUploadFileSignedURLFromS3`). The standalone `/file-upload` demo page was removed in the prior nav pass; the **operations remain**.
- `Provider` model already has `profilePhotoUrl String?` and `portfolioJson String? @default("[]")` (`[{url, caption}]`). `/pro-public/:slug` (ProPublicPage) reads these.
- `ALLOWED_FILE_TYPES` includes `image/jpeg`, `image/png` (also pdf/mp4); `MAX_FILE_SIZE_BYTES = 5MB`.
- Categories live in `DEFAULT_VENDOR_CATEGORIES` (`src/server/scripts/dbSeeds.ts`) and the marketing grid in `src/landing-page/marketplace/content.tsx`. Current 8: Handyman, Plumbing, Smart Home, Events, Food Catering, Shisha Lounge, AI Services, Website Design.
- `CategoryLandingPage.tsx` is **not fully generic**: it reads per-category content from a hardcoded `categoryPages` array + `PRICING` map; an unknown slug renders incomplete.
- Two provider profile routes exist: `/pro/:providerId` (ProviderDetailPage, internal, by id) and `/pro-public/:slug` (ProPublicPage, public SEO, by slug). Internal cards link by id.
- `NAVIGATION.md` is the IA source of truth (created in the prior pass).

---

## A. R2 business-photo upload

**Storage/display model:** public-read R2 bucket. Upload via the existing presigned-POST flow; store the resulting **public URL** in `Provider.portfolioJson` / `Provider.profilePhotoUrl` (NOT the generic `File` table — public/SEO pages need stable public URLs, not expiring signed ones).

**Config (new env):**
- `R2_PUBLIC_URL` — public base for objects (r2.dev URL or custom domain). Public photo URL = `${R2_PUBLIC_URL}/${s3Key}`.
- `AWS_S3_ENDPOINT`, `AWS_S3_REGION=auto`, `AWS_S3_IAM_ACCESS_KEY`, `AWS_S3_IAM_SECRET_KEY`, `AWS_S3_FILES_BUCKET` set to the R2 values.
- Add `R2_PUBLIC_URL` to `.env.server.example`.

**Server (provider operations, `src/provider/operations.ts`):**
- Reuse `createFileUploadUrl` for the presigned POST (auth-gated; key namespaced by user id).
- New actions on the Provider:
  - `addPortfolioPhoto({ s3Key, caption? })` — verifies object exists in bucket, appends `{ url: ${R2_PUBLIC_URL}/${s3Key}, caption }` to `portfolioJson`. Enforces image-only + per-provider cap (12).
  - `removePortfolioPhoto({ url })` — removes entry; best-effort delete from bucket.
  - `setProfilePhoto({ url })` — sets `profilePhotoUrl` (must be one of the provider's portfolio URLs or a freshly uploaded one).
- Declare these actions in `main.wasp` (entities: [Provider]).
- Restrict photo uploads to `image/jpeg | image/png | image/webp`. (Add `image/webp` to `ALLOWED_FILE_TYPES`.)

**Client (UI on `/provider/profile`, `src/provider/ProfilePage.tsx`):**
- "Business Photos" section: file picker → presigned POST upload → `addPortfolioPhoto`. Thumbnail grid with caption edit, delete, and "Set as profile photo". Client-side guard on type + 5MB.

**Display:** `/pro-public/:slug` gallery + profile photo already read these fields; verify rendering.

**Testing:** upload round-trips to R2; public URL renders on the public profile while logged out; delete removes from grid; non-image rejected; cap enforced.

---

## B. 4 new live categories

Add: **Digital Marketing**, **Software Development**, **Video Editing**, **Driving School**.

- `DEFAULT_VENDOR_CATEGORIES` (dbSeeds.ts): add 4 entries (name, slug, description/icon per existing shape). Slugs: `digital-marketing`, `software-development`, `video-editing`, `driving-school`.
- `content.tsx` homepage grid: add 4 cards, `comingSoon: false`, `href: /services/:slug`.
- `CategoryLandingPage.tsx`: add a **generic fallback** (render hero/body from `category.name` + a default template when no `categoryPages`/`PRICING` entry exists) AND add drafted content entries (hero copy, pricing tiers) for the 4 new slugs (drafted from research).
- Dynamic `/services/:categorySlug` route already wires the page; no new routes needed.
- **Asset gap:** category card images — use icon/placeholder unless art is provided.

**Testing:** each new category appears in the homepage grid and Services dropdown, `/services/:slug` renders a complete page, and a category with no hardcoded entry still renders via the fallback.

---

## C. 5 real VERIFIED providers (idempotent seed)

New `src/server/scripts/seedRealProviders.ts`, declared as a **named Wasp seed**, idempotent (upsert by user email + provider slug), safe to run against production (`wasp db seed seedRealProviders`). Separate from the demo/mock seed.

Per pro: `User`(role PROVIDER, email) + `Provider`(businessName, slug, bio, website, serviceAreas, `verificationStatus: VERIFIED`, `active: true`) + `ProviderCategory` links.

| Pro | slug | categories | service areas |
|---|---|---|---|
| Shisha Chauffeurs | `shisha-chauffeurs` | shisha-lounge | GTA |
| Aura Celebrations | `aura-celebrations` | events | Milton + GTA |
| Social Dots | `socialdots` | website-design, ai-services, digital-marketing, software-development | GTA (remote) |
| Shock Media | `shock-media` | video-editing | GTA (remote) |
| Sam's Driving | `sams-driving` | driving-school | Milton, Burlington, Oakville |

**Data sourcing:** research each public website (shishachauffeurs.com, socialdots.ca, the Aura Celebrations / shockmedia.ca / samsdriving.ca sites) to draft bio, services, public contact info, service areas → **present drafts to the user for review** → user approves → run the seed (dev first, then prod).

**Login:** account created with the business email; provider sets a password via reset/OTP when they want portal access. Social Dots gets a rich multi-category profile at `/pro-public/socialdots` (no bespoke page).

**Testing:** seed runs twice with no duplicates (idempotent); each provider appears in browse/discover and at `/pro-public/:slug`; category filters include them.

---

## D. Navigation Phase 2

### D1. Provider profile convergence
- **Canonical:** `/pro-public/:slug` (ProPublicPage). `/pro/:providerId` → redirect component that resolves id→slug and `<Navigate to="/pro-public/:slug" replace />`.
- Add `slug` to the `getProviders` payload so cards link directly by slug.
- Repoint internal links (`ProviderCard`, `ServiceAreaLandingPage`, `RequestDetailPage`) to `/pro-public/:slug`. The `/pro/:id` redirect remains as a safety net.
- Add a small id→slug resolver (query or include in existing provider queries) for the redirect.

### D2. Consumer URL namespacing → `/account/*`
Every old path keeps working via a redirect (no broken bookmarks). `/help` stays public (dual-use with the footer "Help centre").

| Old | New |
|---|---|
| `/dashboard` | `/account` (portal home) |
| `/request-service` | `/account/request-service` |
| `/my-requests` | `/account/requests` |
| `/my-requests/:id` (+ `/messages`, `/review`) | `/account/requests/:id` (+ …) |
| `/rewards` | `/account/rewards` |
| `/referral` | `/account/referrals` |
| `/analytics` | `/account/activity` |
| `/account` (profile) | `/account/profile` |
| `/book/:id` | `/account/book/:id` |
| `/help` | unchanged (public) |

- Old routes kept as redirect components → new paths.
- Update `CONSUMER_PORTAL_PATHS` (App.tsx), ConsumerLayout sidebar, `userMenuItems` dropdown, DashboardPage internal links, and post-auth redirects (`LoginPage`/`SignupPage`/`AuthCallback`/`useRoleGuard` currently send to `/dashboard` → `/account`).
- Update E2E specs to the new paths (redirects cover anything missed).
- Update `NAVIGATION.md` to reflect the new grammar and move these out of "Open items".

**Testing:** old paths 301/redirect to new; sidebar/dropdown/CTAs use new paths; post-login lands on `/account`; E2E green.

---

## Needs from the user (at implementation)
- R2 env values: endpoint, access key, secret, bucket, `R2_PUBLIC_URL`.
- Review of the 5 researched provider drafts before the production seed run.
- (Optional) category card art for the 4 new categories.

## Future / out of scope (separate effort)
- **Design-consistency pass across all service/category landing pages** so every service page matches one design system (pairs with `/design-consultation` / a DESIGN.md). Explicitly deferred.
- Provider messages *index* page (only per-request threads exist today).

## Risks
- Namespacing (D2) touches many link sites + the E2E suite; redirect shims mitigate breakage but every consumer link must be updated.
- New categories stretch beyond "home services" positioning (consistent with existing AI/Website/Events categories; accepted).
- Real provider data quality depends on what each website exposes; user review gate before prod mitigates.
