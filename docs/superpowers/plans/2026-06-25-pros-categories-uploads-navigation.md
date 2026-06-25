# Real Pros, New Categories, R2 Photo Upload, Navigation Phase 2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Onboard 5 real verified providers, add 4 new live service categories, let providers upload business photos to Cloudflare R2, and finish navigation Phase 2 (one canonical provider profile + namespaced consumer routes).

**Architecture:** Wasp 0.21 full-stack DSL. Categories + providers are seeded via idempotent functions declared in `main.wasp` `db.seeds`. Photo upload reuses the existing S3-compatible presigned-POST flow pointed at an R2 bucket, storing public URLs on the `Provider` model. Navigation changes are pure routing/link edits in `main.wasp` and React components, using redirect components for backward compatibility.

**Tech Stack:** Wasp 0.21, React 19, Tailwind v4, Prisma v5, PostgreSQL, `@aws-sdk/client-s3` (R2), Playwright (E2E), lucide-react.

## Global Constraints

- **Wasp import paths:** in `.ts`/`.tsx` use `wasp/...` (e.g. `wasp/server/operations`, `wasp/client/operations`, `wasp/client/router`); in `main.wasp` use `@src/...`. Never `@wasp/...`. Prisma enum *values* from `@prisma/client`.
- **Design tokens only** (from CLAUDE.md): Primary `#2563EB`, Navy `#0F172A`, Slate `#475569`, Page bg `#F8FAFC`, Surface `#FFFFFF`, Border `#E2E8F0`, Success `#22C55E`, Amber `#F59E0B`/`#FEF3C7`. Never introduce new colors or the banned legacy tokens.
- **No unit-test framework exists.** The verification cycle for every task is one or more of: `wasp build` (typecheck/compile), running the seed and re-running it (idempotency), Playwright E2E against a local `wasp start`, or a scripted browser check. Do NOT invent pytest/vitest steps.
- **Seeds must be idempotent** — upsert / find-then-create, never blind `create`. Safe to run twice with no duplicates.
- **Lead masking unchanged** — do not alter `getPublicLeadFeed` PII stripping.
- **Verified providers** use `verificationStatus: "VERIFIED"` (Prisma enum `ProviderStatus`) and `active: true`.
- **R2 env** (server): `AWS_S3_ENDPOINT`, `AWS_S3_REGION=auto`, `AWS_S3_IAM_ACCESS_KEY`, `AWS_S3_IAM_SECRET_KEY`, `AWS_S3_FILES_BUCKET`, and new `R2_PUBLIC_URL`. Public photo URL = `${R2_PUBLIC_URL}/${s3Key}`.
- **Run order:** Phase B → C → D1 → A → D2. Each phase is independently shippable.

## File Structure

| File | Responsibility | Phase |
|------|----------------|-------|
| `src/server/scripts/dbSeeds.ts` | add 4 categories to `DEFAULT_VENDOR_CATEGORIES` | B |
| `src/landing-page/marketplace/content.tsx` | homepage category grid entries | B |
| `src/landing-page/CategoryLandingPage.tsx` | generic fallback + content for 4 new slugs | B |
| `src/server/scripts/seedRealProviders.ts` (new) | idempotent real-provider seed | C |
| `main.wasp` | declare seed; add account routes + redirects; declare photo actions; provider-slug query | C, A, D1, D2 |
| `src/consumer/providerProfileData.ts` (new) | researched provider drafts (data only) | C |
| `src/client/components/ProviderCard.tsx` | link by slug | D1 |
| `src/landing-page/ServiceAreaLandingPage.tsx`, `src/consumer/RequestDetailPage.tsx` | link by slug | D1 |
| `src/consumer/ProviderRedirectPage.tsx` (new) | `/pro/:id` → `/pro-public/:slug` redirect | D1 |
| `src/consumer/operations.ts` | `getProviderSlugById` query | D1 |
| `src/file-upload/validation.ts` | add `image/webp` | A |
| `src/provider/operations.ts` | `addPortfolioPhoto`, `removePortfolioPhoto`, `setProfilePhoto` | A |
| `src/provider/ProfilePage.tsx` | Business Photos upload UI | A |
| `.env.server.example` | document `R2_PUBLIC_URL` | A |
| `src/consumer/portalRedirects.tsx` (new) | redirect components for old consumer paths | D2 |
| `src/client/App.tsx`, `src/consumer/layout/ConsumerLayout.tsx`, `src/user/constants.ts`, `src/consumer/DashboardPage.tsx`, `src/auth/*` | repoint to `/account/*` | D2 |
| `tests/e2e/*.spec.ts` | update paths, add redirect/category/upload checks | C, D1, A, D2 |
| `NAVIGATION.md` | reflect new grammar | D2 |

---

## Phase B — 4 new live categories

### Task B1: Seed the 4 new categories

**Files:**
- Modify: `src/server/scripts/dbSeeds.ts` (the `DEFAULT_VENDOR_CATEGORIES` array, ends at the `]` ~line 102)

**Interfaces:**
- Produces: 4 new `ServiceCategory` rows with slugs `digital-marketing`, `software-development`, `video-editing`, `driving-school` (consumed by C2, B2, B3).

- [ ] **Step 1: Add the 4 entries** to the end of `DEFAULT_VENDOR_CATEGORIES`, before the closing `]`:

```ts
  {
    name: "Digital Marketing",
    slug: "digital-marketing",
    description: "SEO, paid ads, social media management, and growth marketing for local businesses",
    icon: "Megaphone",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  },
  {
    name: "Software Development",
    slug: "software-development",
    description: "Custom software, web apps, integrations, and automation built for your business",
    icon: "Code",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
  },
  {
    name: "Video Editing",
    slug: "video-editing",
    description: "Short-form video, reels, promos, and professional video editing and production",
    icon: "Clapperboard",
    imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop",
  },
  {
    name: "Driving School",
    slug: "driving-school",
    description: "Licensed driving instruction, in-car lessons, and MTO-approved beginner courses",
    icon: "Car",
    imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop",
  },
```

- [ ] **Step 2: Verify compile**

Run: `wasp build`
Expected: `Your wasp project has been successfully built!` (no TS errors).

- [ ] **Step 3: Verify the seed creates them idempotently**

Run (db must be up): `wasp db seed seedMockUsers`
Then re-run the same command.
Expected: both runs succeed; `seedVendorCategories` logs "Seeded 12 vendor categories." No duplicate-key errors (it upserts by slug).

- [ ] **Step 4: Commit**

```bash
git add src/server/scripts/dbSeeds.ts
git commit -m "feat(categories): seed Digital Marketing, Software Dev, Video Editing, Driving School"
```

### Task B2: Show the 4 categories in the homepage grid

**Files:**
- Modify: `src/landing-page/marketplace/content.tsx` (the `categoryImages` map ~line 90 and the `categories` array, before the `"More"` entry ~line 178)

**Interfaces:**
- Consumes: the 4 slugs from B1.
- Produces: 4 grid cards linking to `/services/:slug`.

- [ ] **Step 1: Add image entries** to the `categoryImages` object (before its closing `}` ~line 92):

```ts
  "digital-marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
  "software-development": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
  "video-editing": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop",
  "driving-school": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop",
```

- [ ] **Step 2: Ensure icons are imported.** At the top of `content.tsx`, confirm/add to the lucide-react import: `Megaphone`, `Code`, `Clapperboard`, `Car`. (If the import list lacks any, add them.)

- [ ] **Step 3: Add 4 category cards** to the `categories` array, immediately before the `"More"` entry:

```tsx
  {
    icon: <Megaphone className="size-5" />,
    name: "Digital Marketing",
    slug: "digital-marketing",
    description: "SEO, paid ads, social media, and growth marketing.",
    href: "/services/digital-marketing",
    imageUrl: categoryImages["digital-marketing"],
    live: true,
  },
  {
    icon: <Code className="size-5" />,
    name: "Software Development",
    slug: "software-development",
    description: "Custom software, web apps, integrations, and automation.",
    href: "/services/software-development",
    imageUrl: categoryImages["software-development"],
    live: true,
  },
  {
    icon: <Clapperboard className="size-5" />,
    name: "Video Editing",
    slug: "video-editing",
    description: "Short-form video, reels, promos, and editing.",
    href: "/services/video-editing",
    imageUrl: categoryImages["video-editing"],
    live: true,
  },
  {
    icon: <Car className="size-5" />,
    name: "Driving School",
    slug: "driving-school",
    description: "Licensed in-car lessons and beginner driver courses.",
    href: "/services/driving-school",
    imageUrl: categoryImages["driving-school"],
    live: true,
  },
```

- [ ] **Step 4: Verify in browser.** Start `wasp start`, open `http://localhost:3001/`, confirm the 4 new cards appear in the "WHAT WE HELP WITH" grid and each links to `/services/:slug`.

- [ ] **Step 5: Commit**

```bash
git add src/landing-page/marketplace/content.tsx
git commit -m "feat(categories): add 4 new categories to homepage grid"
```

### Task B3: Category landing page — generic fallback + content for new slugs

**Files:**
- Modify: `src/landing-page/CategoryLandingPage.tsx` (the `categoryPages` array and `PRICING` map; the `pageData`/`pricing` lookups ~lines 40-45)

**Interfaces:**
- Consumes: the 4 slugs.
- Produces: a complete landing page for any category slug (hardcoded content when present, otherwise a generic template).

- [ ] **Step 1: Read** `src/landing-page/CategoryLandingPage.tsx` fully to learn the shape of one `categoryPages` entry and one `PRICING` entry.

- [ ] **Step 2: Add `categoryPages` + `PRICING` entries** for the 4 new slugs, matching the existing object shape exactly (same keys as an existing entry like `handyman`). Use this copy (adapt keys to the real shape you read in Step 1):

```ts
// digital-marketing
{ slug: "digital-marketing", heroTitle: "Digital marketing that grows local GTA businesses",
  heroSubtitle: "SEO, paid ads, and social media from vetted marketing pros. One request, matched fast.",
  /* ...remaining keys identical to an existing entry... */ }
// software-development
{ slug: "software-development", heroTitle: "Custom software and web apps, built right",
  heroSubtitle: "Vetted developers for web apps, integrations, and automation. Get matched in minutes." }
// video-editing
{ slug: "video-editing", heroTitle: "Short-form video and editing that converts",
  heroSubtitle: "Reels, promos, and professional edits from local creative pros." }
// driving-school
{ slug: "driving-school", heroTitle: "Licensed driving lessons in Milton, Burlington & Oakville",
  heroSubtitle: "MTO-approved instructors and in-car lessons. Book your first lesson in minutes." }
```

- [ ] **Step 3: Add a generic fallback.** Where the component currently does `const pageData = categoryPages.find(...)` and `const pricing = PRICING[categorySlug ?? '']`, make missing data safe:

```ts
const pageData = categoryPages.find(p => p.slug === categorySlug) ?? {
  slug: categorySlug ?? '',
  heroTitle: `${category?.name ?? 'Service'} pros in the GTA`,
  heroSubtitle: `Get matched with a vetted ${category?.name?.toLowerCase() ?? 'service'} pro. One request, matched in minutes.`,
  // include every other key the template reads, with sensible defaults (empty arrays for lists)
};
const pricing = PRICING[categorySlug ?? ''] ?? null;
```
Then guard every place that reads `pricing` with `pricing &&` / optional chaining so a null pricing renders the page without the pricing block.

- [ ] **Step 4: Verify in browser.** With `wasp start` running and DB seeded, open each of `/services/digital-marketing`, `/services/software-development`, `/services/video-editing`, `/services/driving-school`. Confirm each renders a complete page (hero + CTA), no blank/crashed sections.

- [ ] **Step 5: Verify fallback** by opening a real category with no hardcoded entry if any remain (or temporarily confirm the `?? {...}` branch renders). Expected: page still renders from `category.name`.

- [ ] **Step 6: Commit**

```bash
git add src/landing-page/CategoryLandingPage.tsx
git commit -m "feat(categories): landing-page content for new slugs + generic fallback"
```

---

## Phase C — 5 real VERIFIED providers

### Task C1: Research the 5 businesses and capture drafts (review gate)

**Files:**
- Create: `src/consumer/providerProfileData.ts` (exported `REAL_PROVIDERS` array — data only, imported by the seed)

**Interfaces:**
- Produces: `REAL_PROVIDERS: RealProviderSeed[]` consumed by C2.

- [ ] **Step 1: Research each public website** (use the firecrawl skill or WebFetch): `shishachauffeurs.com`, `socialdots.ca`, the Aura Celebrations site (Milton), `shockmedia.ca`, `samsdriving.ca`. Capture per business: business name, public contact email + phone (if shown), a 2-4 sentence bio, services offered, and service areas.

- [ ] **Step 2: Write the data file** with the researched values. Leave a clearly-marked `// REVIEW:` comment on any field that was guessed/unavailable (e.g. a login email):

```ts
export type RealProviderSeed = {
  email: string;          // login + contact email
  firstName: string;
  lastName: string;
  phone: string;
  postalCode: string;
  businessName: string;
  contactName: string;
  website: string;
  slug: string;
  bio: string;
  serviceAreas: string[];
  categorySlugs: string[];
  ratingInternal?: number;
};

export const REAL_PROVIDERS: RealProviderSeed[] = [
  {
    email: "hello@shishachauffeurs.com", // REVIEW: confirm
    firstName: "Shisha", lastName: "Chauffeurs", phone: "", // REVIEW
    postalCode: "L9T 0A1",
    businessName: "Shisha Chauffeurs", contactName: "", // REVIEW
    website: "https://shishachauffeurs.com",
    slug: "shisha-chauffeurs",
    bio: "", // REVIEW: from site
    serviceAreas: ["Milton", "Oakville", "Burlington", "Mississauga", "Brampton"],
    categorySlugs: ["shisha-lounge"],
  },
  // ...repeat for aura-celebrations (events; Milton), socialdots
  // (website-design, ai-services, digital-marketing, software-development),
  // shock-media (video-editing), sams-driving (driving-school;
  // areas Milton, Burlington, Oakville)
];
```

- [ ] **Step 3: STOP — present the drafts to the user for review.** Show the filled `REAL_PROVIDERS` (especially `// REVIEW:` fields) and get explicit approval before proceeding. Apply corrections.

- [ ] **Step 4: Commit** (after approval)

```bash
git add src/consumer/providerProfileData.ts
git commit -m "feat(providers): researched profile data for 5 real pros"
```

### Task C2: Idempotent `seedRealProviders` script

**Files:**
- Create: `src/server/scripts/seedRealProviders.ts`
- Modify: `main.wasp` (`db.seeds` array, ~line 90)

**Interfaces:**
- Consumes: `REAL_PROVIDERS` (C1), category rows (B1), `ensureEmailAuthIdentity` pattern from `dbSeeds.ts`.
- Produces: `User`+`Provider`+`ProviderCategory` rows for the 5 pros.

- [ ] **Step 1: Write the seed.** Follow the exact idempotent pattern in `dbSeeds.ts` (find-then-create for User and Provider, upsert-style for ProviderCategory). Export a Wasp seed `(prisma: PrismaClient) => Promise<void>`:

```ts
import type { PrismaClient } from "@prisma/client";
import { createProviderId, sanitizeAndSerializeProviderData } from "wasp/auth/utils";
import { REAL_PROVIDERS } from "../../consumer/providerProfileData";

const SEED_PASSWORD = "ChangeMe123"; // providers reset via OTP/password-reset on first login

async function ensureEmailAuthIdentity(prisma: PrismaClient, email: string, password: string) {
  const providerId = createProviderId("email", email);
  const existing = await prisma.authIdentity.findUnique({
    where: { providerName_providerUserId: providerId },
  });
  if (existing) return;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error(`Cannot create auth identity: user ${email} not found`);
  const providerData = await sanitizeAndSerializeProviderData({
    hashedPassword: password, isEmailVerified: true,
    emailVerificationSentAt: null, passwordResetSentAt: null,
  });
  await prisma.auth.create({
    data: { userId: user.id, identities: { create: {
      providerName: providerId.providerName,
      providerUserId: providerId.providerUserId, providerData,
    } } },
  });
}

export async function seedRealProviders(prisma: PrismaClient) {
  console.log("Seeding real providers...");
  for (const p of REAL_PROVIDERS) {
    let user = await prisma.user.findUnique({ where: { email: p.email } });
    if (!user) {
      user = await prisma.user.create({ data: {
        email: p.email, username: p.email, firstName: p.firstName, lastName: p.lastName,
        phone: p.phone, postalCode: p.postalCode, role: "PROVIDER", status: "ACTIVE",
      } });
    }
    await ensureEmailAuthIdentity(prisma, p.email, SEED_PASSWORD);

    let provider = await prisma.provider.findFirst({ where: { userId: user.id } });
    if (!provider) {
      provider = await prisma.provider.create({ data: {
        userId: user.id, businessName: p.businessName, contactName: p.contactName,
        phone: p.phone, email: p.email, website: p.website, slug: p.slug, bio: p.bio,
        serviceAreas: p.serviceAreas, verificationStatus: "VERIFIED", active: true,
        ratingInternal: p.ratingInternal ?? null,
        insuranceStatus: true, referencesChecked: true, onboardingCallDone: true,
      } });
    }

    for (const slug of p.categorySlugs) {
      const cat = await prisma.serviceCategory.findFirst({ where: { slug } });
      if (!cat) { console.warn(`  category ${slug} missing, skipping`); continue; }
      const link = await prisma.providerCategory.findFirst({
        where: { providerId: provider.id, serviceCategoryId: cat.id },
      });
      if (!link) {
        await prisma.providerCategory.create({
          data: { providerId: provider.id, serviceCategoryId: cat.id },
        });
      }
    }
    console.log(`  ✓ ${p.businessName} (${p.slug})`);
  }
  console.log(`Seeded ${REAL_PROVIDERS.length} real providers.`);
}
```

- [ ] **Step 2: Declare the seed** in `main.wasp` `db.seeds` (add after the `seedMockUsers` import):

```wasp
      import { seedRealProviders } from "@src/server/scripts/seedRealProviders",
```

- [ ] **Step 3: Verify compile**

Run: `wasp build`
Expected: success, no TS errors.

- [ ] **Step 4: Run the seed twice (idempotency)**

Run: `wasp db seed seedRealProviders` then run it again.
Expected: both succeed; second run creates no duplicate users/providers (find-then-create); category links not duplicated.

- [ ] **Step 5: Commit**

```bash
git add src/server/scripts/seedRealProviders.ts main.wasp
git commit -m "feat(providers): idempotent seedRealProviders script"
```

### Task C3: Verify the real pros surface in the marketplace

- [ ] **Step 1:** With `wasp start` + seeded DB, open `/discover` and the relevant category pages (`/services/shisha-lounge`, `/services/events`, `/services/digital-marketing`, `/services/video-editing`, `/services/driving-school`). Confirm each pro appears.
- [ ] **Step 2:** Open each `/pro-public/:slug` (e.g. `/pro-public/socialdots`) and confirm the profile renders with bio + categories. Social Dots shows all 4 categories.
- [ ] **Step 3:** No commit (verification only). Note any data gaps back to the user.

---

## Phase D1 — Provider profile convergence

### Task D1.1: Link provider cards by slug

**Files:**
- Modify: `src/client/components/ProviderCard.tsx` (props + `Link to`)
- Modify: `src/landing-page/ServiceAreaLandingPage.tsx:222`, `src/consumer/RequestDetailPage.tsx:363`

**Interfaces:**
- Consumes: `provider.slug` (already present in `getProviders` payload — Provider records are returned without a restrictive `select`).
- Produces: cards/links targeting `/pro-public/:slug`.

- [ ] **Step 1: Add `slug` to `ProviderCardProps`** and use it in the link. In `ProviderCard.tsx`, add `slug?: string | null;` to `ProviderCardProps`, and change the link:

```tsx
// was: to={`/pro/${id}`}
to={slug ? `/pro-public/${slug}` : `/pro/${id}`}
```

- [ ] **Step 2: Pass `slug`** wherever `<ProviderCard ... />` is rendered (search: `grep -rn "ProviderCard" src --include=*.tsx`). Add `slug={provider.slug}` to each usage that has the provider object.

- [ ] **Step 3: Repoint direct links.** In `ServiceAreaLandingPage.tsx:222` and `RequestDetailPage.tsx:363`, change `to={`/pro/${pro.id}`}` / `to={`/pro/${provider.id}`}` to use the slug when available: `to={pro.slug ? `/pro-public/${pro.slug}` : `/pro/${pro.id}`}` (and likewise for `provider`).

- [ ] **Step 4: Verify** `wasp build` passes, then in-browser confirm clicking a provider card on `/discover` lands on `/pro-public/:slug`.

- [ ] **Step 5: Commit**

```bash
git add src/client/components/ProviderCard.tsx src/landing-page/ServiceAreaLandingPage.tsx src/consumer/RequestDetailPage.tsx
git commit -m "feat(nav): link provider cards to canonical /pro-public/:slug"
```

### Task D1.2: Redirect `/pro/:providerId` → `/pro-public/:slug`

**Files:**
- Create: `src/consumer/ProviderRedirectPage.tsx`
- Modify: `src/consumer/operations.ts` (add `getProviderSlugById` query), `main.wasp` (query decl + repoint `ProviderDetailRoute`)

**Interfaces:**
- Consumes: `providerId` route param.
- Produces: client-side redirect to `/pro-public/:slug`.

- [ ] **Step 1: Add the query** to `src/consumer/operations.ts`:

```ts
import type { GetProviderSlugById } from 'wasp/server/operations'

export const getProviderSlugById: GetProviderSlugById<{ id: string }, { slug: string | null }> =
  async ({ id }, context) => {
    const provider = await context.entities.Provider.findUnique({
      where: { id }, select: { slug: true },
    });
    return { slug: provider?.slug ?? null };
  };
```

- [ ] **Step 2: Declare the query** in `main.wasp` (Consumer region):

```wasp
query getProviderSlugById {
  fn: import { getProviderSlugById } from "@src/consumer/operations",
  entities: [Provider]
}
```

- [ ] **Step 3: Create the redirect page** `src/consumer/ProviderRedirectPage.tsx`:

```tsx
import { useParams, Navigate } from 'react-router'
import { useQuery, getProviderSlugById } from 'wasp/client/operations'

export default function ProviderRedirectPage() {
  const { providerId } = useParams<{ providerId: string }>()
  const { data, isLoading } = useQuery(getProviderSlugById, { id: providerId ?? '' })
  if (isLoading) return <div className="p-8 text-sm text-[#475569]">Redirecting…</div>
  if (data?.slug) return <Navigate to={`/pro-public/${data.slug}`} replace />
  return <Navigate to="/discover" replace />
}
```

- [ ] **Step 4: Repoint the route** in `main.wasp`. Change `ProviderDetailRoute`'s page to the redirect:

```wasp
route ProviderDetailRoute   { path: "/pro/:providerId",      to: ProviderDetailPage }
page ProviderDetailPage     { component: import ProviderRedirectPage from "@src/consumer/ProviderRedirectPage" }
```
(Optionally delete the now-unused `src/consumer/ProviderDetailPage.tsx`.)

- [ ] **Step 5: Verify** `wasp build`, then visit `/pro/<a real provider id>` and confirm it redirects to `/pro-public/<slug>`.

- [ ] **Step 6: Commit**

```bash
git add src/consumer/ProviderRedirectPage.tsx src/consumer/operations.ts main.wasp
git commit -m "feat(nav): redirect /pro/:id to canonical /pro-public/:slug"
```

### Task D1.3: E2E for profile convergence

**Files:**
- Modify: `tests/e2e/public-pages.spec.ts` (add a test)

- [ ] **Step 1: Add a test** that visits a known provider via `/pro/:id` (or clicks a card on `/discover`) and asserts the final URL contains `/pro-public/`:

```ts
test('provider cards resolve to /pro-public/:slug', async ({ page }) => {
  await page.goto('/discover');
  const card = page.locator('a[href^="/pro-public/"]').first();
  await expect(card).toBeVisible();
});
```

- [ ] **Step 2: Run it**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test public-pages.spec.ts -g "pro-public"`
Expected: PASS (with `wasp start` + seeded DB running).

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/public-pages.spec.ts
git commit -m "test(nav): assert provider links use /pro-public/:slug"
```

---

## Phase A — R2 business-photo upload

### Task A1: Config — webp + public URL env

**Files:**
- Modify: `src/file-upload/validation.ts`, `.env.server.example`

- [ ] **Step 1: Add webp** to `ALLOWED_FILE_TYPES` in `src/file-upload/validation.ts`:

```ts
  "image/jpeg",
  "image/png",
  "image/webp",
```

- [ ] **Step 2: Document the env.** Add to `.env.server.example`:

```
# Cloudflare R2 public base URL for provider photos (no trailing slash)
R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev
```

- [ ] **Step 3: Verify** `wasp build` passes.

- [ ] **Step 4: Commit**

```bash
git add src/file-upload/validation.ts .env.server.example
git commit -m "chore(upload): allow webp + document R2_PUBLIC_URL"
```

### Task A2: Provider photo actions

**Files:**
- Modify: `src/provider/operations.ts`, `main.wasp` (Provider region)

**Interfaces:**
- Consumes: `createFileUploadUrl` (existing, for presigned POST), `checkFileExistsInS3`, `deleteFileFromS3` from `src/file-upload/s3Utils`.
- Produces: actions `addPortfolioPhoto`, `removePortfolioPhoto`, `setProfilePhoto`.

- [ ] **Step 1: Implement the actions** in `src/provider/operations.ts`:

```ts
import type { AddPortfolioPhoto, RemovePortfolioPhoto, SetProfilePhoto } from 'wasp/server/operations'
import { HttpError } from 'wasp/server'
import { checkFileExistsInS3, deleteFileFromS3 } from '../file-upload/s3Utils'

const MAX_PORTFOLIO = 12
const publicUrl = (s3Key: string) => `${process.env.R2_PUBLIC_URL}/${s3Key}`

async function getMyProvider(context: any) {
  if (!context.user) throw new HttpError(401, 'Not authorized')
  const provider = await context.entities.Provider.findFirst({ where: { userId: context.user.id } })
  if (!provider) throw new HttpError(404, 'Provider profile not found')
  return provider
}

export const addPortfolioPhoto: AddPortfolioPhoto<{ s3Key: string; caption?: string }, { url: string; caption?: string }[]> =
  async ({ s3Key, caption }, context) => {
    const provider = await getMyProvider(context)
    const exists = await checkFileExistsInS3({ s3Key })
    if (!exists) throw new HttpError(404, 'Uploaded file not found')
    const portfolio = provider.portfolioJson ? JSON.parse(provider.portfolioJson) as { url: string; caption?: string }[] : []
    if (portfolio.length >= MAX_PORTFOLIO) throw new HttpError(400, `Max ${MAX_PORTFOLIO} photos`)
    portfolio.push({ url: publicUrl(s3Key), caption })
    await context.entities.Provider.update({ where: { id: provider.id }, data: { portfolioJson: JSON.stringify(portfolio) } })
    return portfolio
  }

export const removePortfolioPhoto: RemovePortfolioPhoto<{ url: string }, { url: string; caption?: string }[]> =
  async ({ url }, context) => {
    const provider = await getMyProvider(context)
    const portfolio = (provider.portfolioJson ? JSON.parse(provider.portfolioJson) : []) as { url: string; caption?: string }[]
    const next = portfolio.filter((p) => p.url !== url)
    await context.entities.Provider.update({ where: { id: provider.id }, data: { portfolioJson: JSON.stringify(next) } })
    if (process.env.R2_PUBLIC_URL && url.startsWith(process.env.R2_PUBLIC_URL)) {
      const s3Key = url.slice(process.env.R2_PUBLIC_URL.length + 1)
      try { await deleteFileFromS3({ s3Key }) } catch { /* best-effort */ }
    }
    return next
  }

export const setProfilePhoto: SetProfilePhoto<{ url: string }, { profilePhotoUrl: string }> =
  async ({ url }, context) => {
    const provider = await getMyProvider(context)
    await context.entities.Provider.update({ where: { id: provider.id }, data: { profilePhotoUrl: url } })
    return { profilePhotoUrl: url }
  }
```

- [ ] **Step 2: Declare the actions** in `main.wasp` (Provider region):

```wasp
action addPortfolioPhoto {
  fn: import { addPortfolioPhoto } from "@src/provider/operations",
  entities: [Provider]
}
action removePortfolioPhoto {
  fn: import { removePortfolioPhoto } from "@src/provider/operations",
  entities: [Provider]
}
action setProfilePhoto {
  fn: import { setProfilePhoto } from "@src/provider/operations",
  entities: [Provider]
}
```

- [ ] **Step 3: Verify** `wasp build` passes.

- [ ] **Step 4: Commit**

```bash
git add src/provider/operations.ts main.wasp
git commit -m "feat(upload): provider portfolio + profile photo actions"
```

### Task A3: Business Photos upload UI on the provider profile

**Files:**
- Modify: `src/provider/ProfilePage.tsx`

**Interfaces:**
- Consumes: `createFileUploadUrl`, `addPortfolioPhoto`, `removePortfolioPhoto`, `setProfilePhoto` (call actions directly with `await`, per CLAUDE.md — not `useAction`).

- [ ] **Step 1: Add a "Business Photos" section.** Add an uploader: on file select, validate type ∈ {jpeg,png,webp} and size ≤ 5MB, call `createFileUploadUrl({ fileType, fileName })`, POST the file to `s3UploadUrl` with `s3UploadFields` (multipart form), then `await addPortfolioPhoto({ s3Key })`. Render the returned portfolio as a thumbnail grid with a delete button (`removePortfolioPhoto({ url })`) and a "Set as profile photo" button (`setProfilePhoto({ url })`). Use design tokens only.

```tsx
const upload = async (file: File) => {
  const okTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!okTypes.includes(file.type)) return toast({ title: 'Use JPG, PNG, or WEBP' })
  if (file.size > 5 * 1024 * 1024) return toast({ title: 'Max 5MB' })
  const { s3UploadUrl, s3UploadFields, s3Key } = await createFileUploadUrl({ fileType: file.type, fileName: file.name })
  const form = new FormData()
  Object.entries(s3UploadFields).forEach(([k, v]) => form.append(k, v as string))
  form.append('file', file)
  const res = await fetch(s3UploadUrl, { method: 'POST', body: form })
  if (!res.ok) return toast({ title: 'Upload failed' })
  const portfolio = await addPortfolioPhoto({ s3Key })
  setPortfolio(portfolio)
}
```

- [ ] **Step 2: Keep the existing `profilePhotoUrl` text field** as a fallback, but also allow "Set as profile photo" from an uploaded portfolio image.

- [ ] **Step 3: Verify (manual, requires real R2 creds in `.env.server`).** With `wasp start`, log in as a provider, upload an image, confirm it appears in the grid and persists after reload. If R2 creds aren't set locally, verify the UI + action wiring compile and the presigned POST request is issued (network tab), and defer the live round-trip to staging.

- [ ] **Step 4: Commit**

```bash
git add src/provider/ProfilePage.tsx
git commit -m "feat(upload): business photos uploader on provider profile"
```

### Task A4: Confirm photos render on the public profile

- [ ] **Step 1:** `ProPublicPage.tsx` already parses `portfolioJson` and renders `profilePhotoUrl` + a gallery (lines ~104, ~143, ~254). Open `/pro-public/:slug` for a provider with uploaded photos; confirm the gallery + profile photo render from the R2 public URLs while logged out.
- [ ] **Step 2:** No commit (verification). If URLs 404, re-check `R2_PUBLIC_URL` and bucket public access.

---

## Phase D2 — Consumer URL namespacing → `/account/*`

### Task D2.1: Add `/account/*` routes + redirect shims for old paths

**Files:**
- Create: `src/consumer/portalRedirects.tsx`
- Modify: `main.wasp` (Consumer region)

**Interfaces:**
- Produces: new canonical routes + redirect pages from old paths.

- [ ] **Step 1: Create redirect components** `src/consumer/portalRedirects.tsx` (one per old path; they preserve params):

```tsx
import { Navigate, useParams } from 'react-router'

export const DashboardRedirect = () => <Navigate to="/account" replace />
export const RequestServiceRedirect = () => <Navigate to="/account/request-service" replace />
export const MyRequestsRedirect = () => <Navigate to="/account/requests" replace />
export const RewardsRedirect = () => <Navigate to="/account/rewards" replace />
export const ReferralRedirect = () => <Navigate to="/account/referrals" replace />
export const AnalyticsRedirect = () => <Navigate to="/account/activity" replace />
export const AccountProfileRedirect = () => <Navigate to="/account/profile" replace />
export const RequestDetailRedirect = () => {
  const { requestId } = useParams<{ requestId: string }>()
  return <Navigate to={`/account/requests/${requestId}`} replace />
}
export const BookingRedirect = () => {
  const { requestId } = useParams<{ requestId: string }>()
  return <Navigate to={`/account/book/${requestId}`} replace />
}
```

- [ ] **Step 2: In `main.wasp`, add the new `/account/*` routes** pointing at the EXISTING page components (Wasp allows multiple routes → same page; give each route a unique name). Example:

```wasp
route AccountHomeRoute      { path: "/account",                    to: AccountHomePage }
page AccountHomePage        { component: import DashboardPage from "@src/consumer/DashboardPage", authRequired: true }

route AccountRequestServiceRoute { path: "/account/request-service", to: AccountRequestServicePage }
page AccountRequestServicePage   { component: import RequestServicePage from "@src/consumer/RequestServicePage", authRequired: true }

route AccountRequestsRoute  { path: "/account/requests",            to: AccountRequestsPage }
page AccountRequestsPage    { component: import MyRequestsPage from "@src/consumer/MyRequestsPage", authRequired: true }

route AccountRequestDetailRoute { path: "/account/requests/:requestId", to: AccountRequestDetailPage }
page AccountRequestDetailPage   { component: import RequestDetailPage from "@src/consumer/RequestDetailPage", authRequired: true }

route AccountRequestMessagesRoute { path: "/account/requests/:requestId/messages", to: AccountRequestMessagesPage }
page AccountRequestMessagesPage   { component: import RequestMessagesPage from "@src/consumer/RequestMessagesPage", authRequired: true }

route AccountRequestReviewRoute { path: "/account/requests/:requestId/review", to: AccountRequestReviewPage }
page AccountRequestReviewPage   { component: import SubmitReviewPage from "@src/consumer/SubmitReviewPage", authRequired: true }

route AccountRewardsRoute   { path: "/account/rewards",             to: AccountRewardsPage }
page AccountRewardsPage     { component: import RewardsPage from "@src/consumer/RewardsPage", authRequired: true }

route AccountReferralsRoute { path: "/account/referrals",          to: AccountReferralsPage }
page AccountReferralsPage   { component: import ReferralPage from "@src/consumer/ReferralPage", authRequired: true }

route AccountActivityRoute  { path: "/account/activity",           to: AccountActivityPage }
page AccountActivityPage    { component: import AnalyticsPage from "@src/consumer/AnalyticsPage", authRequired: true }

route AccountProfileRoute2  { path: "/account/profile",            to: AccountProfilePage2 }
page AccountProfilePage2    { component: import AccountPage from "@src/user/AccountPage", authRequired: true }

route AccountBookRoute      { path: "/account/book/:requestId",     to: AccountBookPage }
page AccountBookPage        { component: import BookingPage from "@src/consumer/BookingPage", authRequired: true }
```
(Confirm the real import path/name for `AccountPage` from the existing `AccountRoute` declaration and reuse it.)

- [ ] **Step 3: Repoint the OLD routes to redirect components.** Change each existing old route's `to:` page to the matching redirect from `portalRedirects.tsx`. Example for `/dashboard`:

```wasp
route DashboardRoute        { path: "/dashboard",           to: DashboardPage }
page DashboardPage          { component: import { DashboardRedirect } from "@src/consumer/portalRedirects" }
```
Do the same for `/request-service`, `/my-requests`, `/my-requests/:requestId`, `/my-requests/:requestId/messages`, `/my-requests/:requestId/review`, `/rewards`, `/referral`, `/analytics`, `/account` (old profile → `AccountProfileRedirect`), `/book/:requestId`. Leave `/help` untouched.

- [ ] **Step 4: Verify** `wasp build` passes (watch for duplicate route/page name collisions — every name must be unique).

- [ ] **Step 5: Verify redirects** in browser: visiting `/dashboard` lands on `/account`; `/my-requests/<id>` lands on `/account/requests/<id>`.

- [ ] **Step 6: Commit**

```bash
git add src/consumer/portalRedirects.tsx main.wasp
git commit -m "feat(nav): add /account/* routes with redirects from old consumer paths"
```

### Task D2.2: Repoint all in-app links + auth redirects

**Files:**
- Modify: `src/client/App.tsx` (`CONSUMER_PORTAL_PATHS`), `src/consumer/layout/ConsumerLayout.tsx`, `src/user/constants.ts`, `src/consumer/DashboardPage.tsx`, `src/auth/LoginPage.tsx`, `src/auth/SignupPage.tsx`, `src/auth/AuthCallback.tsx`, `src/shared/useRoleGuard.ts`

- [ ] **Step 1: Update `CONSUMER_PORTAL_PATHS`** in `App.tsx` to the new namespace:

```ts
const CONSUMER_PORTAL_PATHS = ['/account', '/help'];
```
(`/account` + the `startsWith('/account/')` check covers all portal pages; `/help` keeps portal chrome for logged-in consumers. Verify the existing `isConsumerPortal` matcher handles `/account` exact + prefix.)

- [ ] **Step 2: Update the ConsumerLayout sidebar** `to:` values: `/account` (Dashboard), `/account/request-service`, `/account/requests`, `/account/rewards`, `/account/referrals`, `/account/activity`, `/help`, `/account/profile`.

- [ ] **Step 3: Update `userMenuItems`** in `src/user/constants.ts`: Dashboard→`/account`, My Requests→`/account/requests`, Rewards→`/account/rewards`, profile/Account Settings→`/account/profile`. (Use `routes.*` where a route helper exists for the new route names; otherwise string paths.)

- [ ] **Step 4: Update DashboardPage links** (`/request-service`→`/account/request-service`, `/my-requests`→`/account/requests`, `/rewards`→`/account/rewards`, `/referral`→`/account/referrals`, `/how-rewards-work` stays).

- [ ] **Step 5: Update post-auth redirects** — replace `navigate('/dashboard')` with `navigate('/account')` in `LoginPage.tsx`, `SignupPage.tsx`, `AuthCallback.tsx` (`getDashboardPath` for consumers), and `useRoleGuard.ts` (`navigate('/account', ...)`).

- [ ] **Step 6: Verify** `wasp build`, then log in as `consumer@thehelper.ca` → lands on `/account`; sidebar items navigate to `/account/*`; no link points to a bare old path.

- [ ] **Step 7: Commit**

```bash
git add src/client/App.tsx src/consumer/layout/ConsumerLayout.tsx src/user/constants.ts src/consumer/DashboardPage.tsx src/auth/LoginPage.tsx src/auth/SignupPage.tsx src/auth/AuthCallback.tsx src/shared/useRoleGuard.ts
git commit -m "feat(nav): repoint consumer links + auth redirects to /account/*"
```

### Task D2.3: Update E2E specs to new paths

**Files:**
- Modify: `tests/e2e/consumer-flow.spec.ts`, `tests/e2e/consumer-journey.spec.ts` (any direct navigation to `/dashboard`, `/my-requests`, `/rewards`, `/referral`, `/analytics`, `/account`)

- [ ] **Step 1: Search** `grep -rn "/dashboard\|/my-requests\|/rewards\|/referral\|/analytics\|'/account'" tests/e2e` and update each `page.goto(...)` / URL assertion to the `/account/*` equivalent. (Redirects keep old ones working, but tests should assert the canonical paths.)

- [ ] **Step 2: Run the consumer specs**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test consumer-flow.spec.ts consumer-journey.spec.ts`
Expected: no regressions vs the prior baseline (login-gated specs may still hit the pre-existing cookie-banner issue — that is out of scope here; compare against the last known pass set).

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/consumer-flow.spec.ts tests/e2e/consumer-journey.spec.ts
git commit -m "test(nav): update consumer E2E paths to /account/*"
```

### Task D2.4: Update NAVIGATION.md

**Files:**
- Modify: `NAVIGATION.md`

- [ ] **Step 1:** Update the Consumer portal table to the `/account/*` paths, note `/help` stays public, and move "Provider profile convergence" + "URL grammar (Phase 2)" out of **Open items** into the implemented structure. Add the 4 new categories to the Public table.

- [ ] **Step 2: Commit**

```bash
git add NAVIGATION.md
git commit -m "docs(nav): update sitemap for /account/* + new categories + profile convergence"
```

### Task D2.5: Full build + smoke

- [ ] **Step 1:** Run `wasp build` — expect clean.
- [ ] **Step 2:** Run the full E2E suite: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test` (with `wasp start` + seeded DB). Compare pass count to the prior baseline; investigate any NEW failures (pre-existing cookie-banner login failures are out of scope).
- [ ] **Step 3:** No commit (verification). Report results.

---

## Self-Review (completed)

- **Spec coverage:** A → Phase A (A1-A4); B → Phase B (B1-B3); C → Phase C (C1-C3); D1 → Phase D1 (D1.1-D1.3); D2 → Phase D2 (D2.1-D2.5). Future/out-of-scope (design-consistency pass) intentionally excluded.
- **Placeholder scan:** the only deliberate "REVIEW" markers are in the C1 researched-data file, gated by an explicit user-review step — not plan placeholders.
- **Type consistency:** `addPortfolioPhoto`/`removePortfolioPhoto` return `{url, caption?}[]`; `setProfilePhoto` returns `{profilePhotoUrl}`; `getProviderSlugById` returns `{slug}`; `RealProviderSeed` fields match the seed's usage; `ProviderCard` `slug?` matches `getProviders` payload.
- **Known adaptation:** verification uses `wasp build` + Playwright + idempotent seed runs (no unit framework in this repo).
