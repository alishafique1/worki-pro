# Bark-Style Redesign — Request-First, Auth-Last Consumer Flow

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the sign-up-first consumer flow with a Bark-style guest request wizard — users pick a service, answer dynamic qualifier questions, and create their account via OTP at the very end.

**Architecture:** Three layers ship in sequence: (1) data model + homepage/nav polish, (2) new dynamic service detail pages, (3) the guest request wizard with auth-at-end. The existing `/request-service` page and `/onboarding` flow stay untouched until the wizard is live. The existing OTP endpoint is extended with an optional `pendingRequest` field — fully backward compatible.

**Tech Stack:** Wasp 0.21, React 19, Tailwind CSS 4, Prisma v5 / PostgreSQL (Neon), existing `otpApi.ts` for OTP, Wasp email auth, `getServiceCategories` query already in place.

**Spec:** `docs/superpowers/specs/2026-05-19-bark-style-redesign-design.md`
**Epic:** GitHub #68 | Child issues: #60 (homepage), #64 (wizard), #65 (detail pages)

---

> **Note on testing:** This codebase has no unit test setup — Wasp generates the RPC layer. Testing is done by running `wasp start` and verifying flows manually, plus Playwright E2E (`wasp test`). Each task includes a manual verification step. TypeScript compilation (`tsc --noEmit` in `.wasp/out/server`) is the best automated check for server code.

---

## File Map

### New files
- `src/consumer/GuestRequestWizardPage.tsx` — guest wizard shell + step routing
- `src/consumer/components/wizard/StepCategory.tsx` — step 1: confirm/change category
- `src/consumer/components/wizard/StepSubService.tsx` — step 2: pick sub-service
- `src/consumer/components/wizard/StepQualifiers.tsx` — step 3: dynamic qualifier questions
- `src/consumer/components/wizard/StepLocation.tsx` — step 4: postal code
- `src/consumer/components/wizard/StepContact.tsx` — step 5: name, email, phone
- `src/consumer/components/wizard/StepOtp.tsx` — step 6: OTP verify + account creation
- `src/consumer/components/wizard/WizardProgress.tsx` — step indicator bar
- `src/landing-page/CategoryLandingPage.tsx` — `/services/:categorySlug` detail page

### Modified files
- `schema.prisma` — add `questions Json?` to `ServiceCategory`; add `qualifierAnswers Json?`, `guestEmail String?`, `guestPhone String?` to `ServiceRequest`
- `main.wasp` — add `GuestRequestWizardRoute`, `CategoryLandingRoute`; add `saveGuestRequest` action
- `src/server/webhooks/otpApi.ts` — extend `verifyOtp` to accept + process `pendingRequest`
- `src/consumer/operations.ts` — add `saveGuestRequest` action
- `src/landing-page/LandingPage.tsx` — update `SearchPanel` to navigate to `/get-quotes`, update category card links to `/services/:slug`
- `src/client/components/NavBar/constants.ts` — update nav items
- `src/auth/onboarding/OnboardingPage.tsx` — add consumer fallback path that redirects to wizard
- `src/consumer/categoryQualifiers.ts` — keep as fallback; wizard will prefer DB questions when available

---

## Task 1: Schema changes + migration

**Files:**
- Modify: `schema.prisma`
- Run: `wasp db migrate-dev`

- [x] **Step 1: Add `questions` to `ServiceCategory`**

In `schema.prisma`, find the `ServiceCategory` model and add after `imageUrl`:

```prisma
  questions        Json?             // [{ id, type, label, options?, required? }]
```

- [x] **Step 2: Add guest fields to `ServiceRequest`**

In `schema.prisma`, find the `ServiceRequest` model and add after `email String?`:

```prisma
  guestEmail       String?           // captured pre-auth in guest wizard
  guestPhone       String?           // captured pre-auth in guest wizard
  qualifierAnswers Json?             // { questionId: answer } from wizard step 3
```

- [x] **Step 3: Run migration**

```bash
wasp db migrate-dev --name add-guest-wizard-fields
```

Expected output: `✔ Generated Prisma Client` with no errors.

- [x] **Step 4: Verify schema compiles**

```bash
cd .wasp/out/db && npx prisma validate
```

Expected: `The schema at schema.prisma is valid 🎉`

- [x] **Step 5: Commit**

```bash
git add schema.prisma migrations/
git commit -m "feat: add qualifier questions + guest fields to schema"
```

---

## Task 2: Declare new routes and action in `main.wasp`

**Files:**
- Modify: `main.wasp`

- [x] **Step 1: Add guest wizard route + page**

Find the block with `route RequestServiceRoute` in `main.wasp` and add after it:

```wasp
route GuestRequestWizardRoute { path: "/get-quotes", to: GuestRequestWizardPage }
page GuestRequestWizardPage {
  component: import GuestRequestWizardPage from "@src/consumer/GuestRequestWizardPage"
}
```

- [x] **Step 2: Add category landing route + page**

```wasp
route CategoryLandingRoute { path: "/services/:categorySlug", to: CategoryLandingPage }
page CategoryLandingPage {
  component: import CategoryLandingPage from "@src/landing-page/CategoryLandingPage"
}
```

- [x] **Step 3: Add `saveGuestRequest` action**

Find the `actions` section and add:

```wasp
action saveGuestRequest {
  fn: import { saveGuestRequest } from "@src/consumer/operations",
  entities: [ServiceRequest, User, RewardAccount, RewardTransaction, Referral]
}
```

- [x] **Step 4: Verify wasp compiles**

```bash
wasp build 2>&1 | tail -5
```

Expected: `✅ Your wasp project has successfully compiled.`

- [x] **Step 5: Commit**

```bash
git add main.wasp
git commit -m "feat: declare guest wizard + category landing routes and saveGuestRequest action"
```

---

## Task 3: `saveGuestRequest` server action

**Files:**
- Modify: `src/consumer/operations.ts`

This action is called after OTP verification to atomically save the request and set up the user account.

- [x] **Step 1: Add the action to `operations.ts`**

Add at the bottom of `src/consumer/operations.ts`:

```typescript
import type { SaveGuestRequest } from 'wasp/server/operations'

type SaveGuestRequestInput = {
  firstName: string
  phone: string
  postalCode: string
  smsConsent: boolean
  serviceCategoryId?: string
  description: string
  qualifierAnswers?: Record<string, string | string[]>
  referralCode?: string
}

export const saveGuestRequest: SaveGuestRequest<SaveGuestRequestInput, { requestId: string }> = async (
  args,
  context
) => {
  if (!context.user) throw new HttpError(401, 'Not authenticated')
  const userId = context.user.id

  // Update user profile (may be first time)
  await context.entities.User.update({
    where: { id: userId },
    data: {
      firstName: args.firstName,
      phone: args.phone,
      postalCode: args.postalCode,
      role: 'CONSUMER',
      smsConsent: args.smsConsent,
      smsConsentAt: args.smsConsent ? new Date() : undefined,
    },
  })

  const request = await context.entities.ServiceRequest.create({
    data: {
      consumerId: userId,
      name: args.firstName,
      phone: args.phone,
      postalCode: args.postalCode,
      email: context.user.email ?? undefined,
      smsConsentGiven: args.smsConsent,
      serviceCategoryId: args.serviceCategoryId ?? null,
      description: args.description,
      qualifierAnswers: args.qualifierAnswers ?? {},
      source: 'WEBSITE',
    },
  })

  // Ensure RewardAccount exists
  await context.entities.RewardAccount.upsert({
    where: { consumerId: userId },
    update: {},
    create: { consumerId: userId },
  })

  // Signup bonus (idempotent)
  const existing = await context.entities.RewardTransaction.findFirst({
    where: { consumerId: userId, type: 'SIGNUP_BONUS' },
  })
  if (!existing) {
    await context.entities.RewardTransaction.create({
      data: {
        consumerId: userId,
        type: 'SIGNUP_BONUS',
        points: 100,
        status: 'APPROVED',
        reason: 'Welcome bonus',
      },
    })
    await context.entities.RewardAccount.update({
      where: { consumerId: userId },
      data: { pointsBalance: { increment: 100 }, lifetimePoints: { increment: 100 } },
    })
  }

  // Referral
  if (args.referralCode) {
    const code = args.referralCode.trim().toUpperCase()
    const referral = await context.entities.Referral.findUnique({ where: { referralCode: code } })
    if (referral && referral.referrerUserId !== userId && !referral.referredUserId) {
      await context.entities.Referral.update({
        where: { id: referral.id },
        data: { referredUserId: userId, status: 'SIGNED_UP' },
      })
    }
  }

  return { requestId: request.id }
}
```

Make sure `HttpError` is imported at the top of the file:
```typescript
import { HttpError } from 'wasp/server'
```

- [x] **Step 2: Verify TypeScript**

```bash
cd .wasp/out/server && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors (or only pre-existing unrelated errors).

- [x] **Step 3: Commit**

```bash
git add src/consumer/operations.ts
git commit -m "feat: add saveGuestRequest action"
```

---

## Task 4: Extend `verifyOtp` to save pending request

**Files:**
- Modify: `src/auth/otpApi.ts`

The existing `verifyOtp` handler returns `{ sessionId, isNewUser }`. We extend it to optionally accept a `pendingRequest` payload and call `saveGuestRequest` logic inline (we can't call Wasp actions from API handlers — we call the Prisma logic directly).

- [x] **Step 1: Add `PendingRequest` type and extend handler**

Replace the `verifyOtp` export in `src/auth/otpApi.ts` with:

```typescript
type PendingRequest = {
  firstName: string
  phone: string
  postalCode: string
  smsConsent: boolean
  serviceCategoryId?: string
  description: string
  qualifierAnswers?: Record<string, string | string[]>
  referralCode?: string
}

export const verifyOtp = async (req: Request, res: Response, context: any): Promise<void> => {
  const { email, code, pendingRequest } = req.body as {
    email?: string
    code?: string
    pendingRequest?: PendingRequest
  }

  if (!email || !code) {
    res.status(400).json({ error: 'Email and code are required.' })
    return
  }

  const normalizedEmail = email.toLowerCase().trim()

  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      email: normalizedEmail,
      used: false,
      expiresAt: { gt: new Date() },
      attempts: { lt: 5 },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!otpRecord) {
    throw new HttpError(400, 'No valid OTP found. Please request a new code.')
  }

  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { attempts: { increment: 1 } },
  })

  if (otpRecord.code !== hashCode(code.trim())) {
    throw new HttpError(400, 'Incorrect verification code.')
  }

  await prisma.otpCode.update({ where: { id: otpRecord.id }, data: { used: true } })

  const providerId = createProviderId('email', normalizedEmail)
  let authIdentity = await findAuthIdentity(providerId)
  let authId: string
  let isNewUser = false

  if (!authIdentity) {
    isNewUser = true
    const serializedProviderData = await sanitizeAndSerializeProviderData({
      hashedPassword: crypto.randomUUID(),
      isEmailVerified: true,
      emailVerificationSentAt: null,
      passwordResetSentAt: null,
    })
    const result = await createUser(providerId, serializedProviderData, {
      email: normalizedEmail,
    })
    if (!result.auth) throw new Error('Failed to create auth record.')
    authId = result.auth.id
  } else {
    authId = authIdentity.authId
  }

  const session = await createSession(authId)

  // If a pending request was submitted with the OTP, save it now
  let requestId: string | undefined
  if (pendingRequest) {
    // Fetch the user record we just created/found
    const userRecord = await prisma.user.findFirst({ where: { email: normalizedEmail } })
    if (userRecord) {
      // Update profile
      await prisma.user.update({
        where: { id: userRecord.id },
        data: {
          firstName: pendingRequest.firstName,
          phone: pendingRequest.phone,
          postalCode: pendingRequest.postalCode,
          role: 'CONSUMER',
          smsConsent: pendingRequest.smsConsent,
          smsConsentAt: pendingRequest.smsConsent ? new Date() : undefined,
        },
      })

      // Create service request
      const request = await prisma.serviceRequest.create({
        data: {
          consumerId: userRecord.id,
          name: pendingRequest.firstName,
          phone: pendingRequest.phone,
          postalCode: pendingRequest.postalCode,
          email: normalizedEmail,
          smsConsentGiven: pendingRequest.smsConsent,
          serviceCategoryId: pendingRequest.serviceCategoryId ?? null,
          description: pendingRequest.description,
          qualifierAnswers: pendingRequest.qualifierAnswers ?? {},
          source: 'WEBSITE',
        },
      })
      requestId = request.id

      // RewardAccount + signup bonus (idempotent)
      await prisma.rewardAccount.upsert({
        where: { consumerId: userRecord.id },
        update: {},
        create: { consumerId: userRecord.id },
      })
      const existingBonus = await prisma.rewardTransaction.findFirst({
        where: { consumerId: userRecord.id, type: 'SIGNUP_BONUS' },
      })
      if (!existingBonus) {
        await prisma.rewardTransaction.create({
          data: {
            consumerId: userRecord.id,
            type: 'SIGNUP_BONUS',
            points: 100,
            status: 'APPROVED',
            reason: 'Welcome bonus',
          },
        })
        await prisma.rewardAccount.update({
          where: { consumerId: userRecord.id },
          data: { pointsBalance: { increment: 100 }, lifetimePoints: { increment: 100 } },
        })
      }

      // Referral
      if (pendingRequest.referralCode) {
        const code = pendingRequest.referralCode.trim().toUpperCase()
        const referral = await prisma.referral.findUnique({ where: { referralCode: code } })
        if (referral && referral.referrerUserId !== userRecord.id && !referral.referredUserId) {
          await prisma.referral.update({
            where: { id: referral.id },
            data: { referredUserId: userRecord.id, status: 'SIGNED_UP' },
          })
        }
      }
    }
  }

  res.json({ success: true, sessionId: session.id, isNewUser, requestId })
}
```

- [x] **Step 2: Test backward compatibility**

Start the app (`wasp start`) and verify the existing login flow still works:
1. Go to `http://localhost:3002` (or whatever port)
2. Click "Sign in", enter `consumer@thehelper.ca`, get OTP
3. Verify — should land on `/dashboard` as before

- [x] **Step 3: Commit**

```bash
git add src/auth/otpApi.ts
git commit -m "feat: extend verifyOtp to atomically save pending guest request"
```

---

## Task 5: Homepage update — wire up `/get-quotes` + `/services/:slug`

**Files:**
- Modify: `src/landing-page/LandingPage.tsx`
- Modify: `src/landing-page/marketplace/content.tsx`

The `SearchPanel` already exists. We update its navigation and the category card links.

- [x] **Step 1: Update `SearchPanel` navigation in `LandingPage.tsx`**

Find the `onKeyDown` handler in `SearchPanel` and update:

```tsx
onKeyDown={(e) => {
  if (e.key === 'Enter') {
    navigate(`/get-quotes?q=${encodeURIComponent(searchQuery)}`);
  }
}}
```

Find the "Get Free Quotes" / submit button (or search button) in `SearchPanel` and update its `onClick` to:
```tsx
onClick={() => navigate(`/get-quotes${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`)}
```

- [x] **Step 2: Update category card links in `SearchPanel`**

In `SearchPanel`, find the category card `Link` components and update so active categories go to `/services/:slug` and coming-soon categories stay on `/get-quotes`:

```tsx
{categories.map((cat) => (
  <Link key={cat.name} to={cat.comingSoon ? '/get-quotes' : `/services/${cat.slug ?? cat.name.toLowerCase().replace(/\s+/g, '-')}`}>
    <div className="flex flex-col items-center gap-2 rounded-xl border border-[#E2E8F0] p-3 text-center transition duration-150 hover:border-[#BFDBFE] hover:bg-[#EFF6FF] cursor-pointer">
      <span className="text-[#2563EB]">{cat.icon}</span>
      <span className="text-xs font-medium text-[#0F172A]">{cat.name}</span>
    </div>
  </Link>
))}
```

- [x] **Step 3: Add `slug` field to categories in `content.tsx`**

In `src/landing-page/marketplace/content.tsx`, find the `categories` array. Add a `slug` field matching the DB slug to each active category entry. Example:

```tsx
{ name: 'HVAC', slug: 'hvac', icon: <AirVent />, href: '/services/hvac', comingSoon: false },
{ name: 'Plumbing', slug: 'plumbing', icon: <ShowerHead />, href: '/services/plumbing', comingSoon: false },
// ... etc
```

- [x] **Step 4: Verify manually**

Run `wasp start`, go to homepage. Click an active category card — should navigate to `/services/hvac` (404 for now, that's expected until Task 7). Type in search and hit Enter — should go to `/get-quotes` (404 for now, expected until Task 6).

- [x] **Step 5: Commit**

```bash
git add src/landing-page/LandingPage.tsx src/landing-page/marketplace/content.tsx
git commit -m "feat: wire homepage search and category cards to new routes"
```

---

## Task 6: Nav dropdown — dynamic categories

**Files:**
- Modify: `src/client/components/NavBar/constants.ts`
- Modify: `src/client/components/NavBar/NavBar.tsx`

- [ ] **Step 1: Update `constants.ts` to mark Services as a dropdown trigger**

In `src/client/components/NavBar/constants.ts`, find `marketingNavigationItems`. Update the "Services" item to include a `hasDropdown: true` flag:

```typescript
export const marketingNavigationItems = [
  { name: 'Services', href: '/services', hasDropdown: true },
  { name: 'How it Works', href: '/how-it-works' },
  { name: 'Rewards', href: '/rewards' },
]
```

- [ ] **Step 2: Add dropdown to `NavBar.tsx`**

In `src/client/components/NavBar/NavBar.tsx`, add a `useQuery(getServiceCategories)` call and render a dropdown for the Services nav item. Add the import:

```typescript
import { useQuery, getServiceCategories } from 'wasp/client/operations'
```

Add inside the component:
```tsx
const { data: categories } = useQuery(getServiceCategories)
const activeParents = (categories ?? []).filter(c => !c.parentCategoryId && c.active)
```

For the Services nav link, replace with:
```tsx
<div className="relative group">
  <Link to="/services" className="...existing classes...">Services</Link>
  {activeParents.length > 0 && (
    <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-[#E2E8F0] rounded-2xl shadow-lg p-3 min-w-[200px] z-50">
      {activeParents.map(cat => (
        <Link
          key={cat.id}
          to={`/services/${cat.slug}`}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )}
</div>
```

- [ ] **Step 3: Verify manually**

Hover "Services" in the nav — dropdown should show all active categories from DB. Each links to `/services/:slug`.

- [ ] **Step 4: Commit**

```bash
git add src/client/components/NavBar/constants.ts src/client/components/NavBar/NavBar.tsx
git commit -m "feat: add dynamic services dropdown to nav"
```

---

## Task 7: Category landing page (`/services/:categorySlug`)

**Files:**
- Create: `src/landing-page/CategoryLandingPage.tsx`

- [ ] **Step 1: Create the component**

Create `src/landing-page/CategoryLandingPage.tsx`:

```tsx
import { useParams, Link } from 'react-router'
import { useQuery, getServiceCategories } from 'wasp/client/operations'
import type { ServiceCategory } from 'wasp/entities'

const PRICING: Record<string, string> = {
  hvac: 'Most HVAC repairs in Milton cost $150–$400',
  plumbing: 'Most plumbing jobs in the GTA cost $100–$350',
  electrical: 'Electrical work typically ranges from $120–$500',
  handyman: 'Handyman jobs usually cost $80–$250',
  'smart-home': 'Smart home installs typically cost $150–$600',
  'appliance-repair': 'Appliance repairs usually cost $100–$300',
}

const FAQS: Record<string, { q: string; a: string }[]> = {
  hvac: [
    { q: 'How quickly can I get an HVAC tech?', a: 'Most verified HVAC pros can come within 24–48 hours. Mark urgent for same-day.' },
    { q: 'Is a free quote really free?', a: 'Yes — providers compete for your job. You choose who to hire.' },
    { q: 'What areas do you cover?', a: 'Milton, Oakville, Burlington, and surrounding GTA areas.' },
    { q: 'Are providers vetted?', a: 'All providers go through our verification process before receiving leads.' },
  ],
  plumbing: [
    { q: 'Can you help with emergency leaks?', a: 'Yes — mark your request as urgent and we\'ll match you with available plumbers immediately.' },
    { q: 'Do plumbers bring their own parts?', a: 'Most do for common repairs. They\'ll let you know if they need to source parts.' },
    { q: 'What areas do you cover?', a: 'Milton, Oakville, Burlington, and surrounding GTA areas.' },
    { q: 'Are providers vetted?', a: 'All providers are verified before they can receive leads through The Helper.' },
  ],
}

const DEFAULT_FAQS = [
  { q: 'Is it free to get quotes?', a: 'Yes — getting quotes through The Helper is completely free for homeowners.' },
  { q: 'How quickly will I hear back?', a: 'Most homeowners receive their first quote within a few hours.' },
  { q: 'What areas do you cover?', a: 'Milton, Oakville, Burlington, and surrounding GTA areas.' },
  { q: 'Are providers vetted?', a: 'All providers go through our verification process before receiving leads.' },
]

export default function CategoryLandingPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const { data: categories, isLoading } = useQuery(getServiceCategories)

  const category = (categories as ServiceCategory[] | undefined)?.find(
    c => c.slug === categorySlug && !c.parentCategoryId
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-pulse text-[#475569]">Loading…</div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-black text-[#0F172A]">Service not found</h1>
        <Link to="/" className="text-[#2563EB] hover:underline">← Back to home</Link>
      </div>
    )
  }

  const faqs = FAQS[categorySlug ?? ''] ?? DEFAULT_FAQS
  const pricing = PRICING[categorySlug ?? '']

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="bg-[#0F172A] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-4">{category.name} in Milton, Oakville & Burlington</h1>
          <p className="text-[#94A3B8] text-lg mb-8">
            Get free quotes from verified local {category.name.toLowerCase()} professionals — no commitment required.
          </p>
          <Link
            to={`/get-quotes?category=${category.id}&slug=${category.slug}`}
            className="inline-block px-10 py-4 bg-[#2563EB] text-white font-bold rounded-full text-lg hover:bg-[#1D4ED8] transition-colors"
          >
            Get Free Quotes →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-[#0F172A] mb-8 text-center">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { n: '1', title: 'Describe your job', desc: 'Tell us what you need — takes 2 minutes.' },
            { n: '2', title: 'Get matched', desc: 'Verified local pros receive your request and send quotes.' },
            { n: '3', title: 'Choose your Helper', desc: 'Compare quotes, read reviews, book with confidence.' },
          ].map(step => (
            <div key={step.n} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 text-center">
              <div className="w-10 h-10 bg-[#EFF6FF] text-[#2563EB] rounded-full flex items-center justify-center font-black text-lg mx-auto mb-4">{step.n}</div>
              <h3 className="font-bold text-[#0F172A] mb-2">{step.title}</h3>
              <p className="text-sm text-[#475569]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      {pricing && (
        <section className="py-8 px-6 max-w-4xl mx-auto">
          <div className="bg-[#FEF3C7] border border-[#F59E0B]/30 rounded-2xl p-6">
            <h2 className="font-bold text-[#92400E] mb-1">Typical pricing</h2>
            <p className="text-[#78350F]">{pricing}</p>
            <p className="text-sm text-[#92400E] mt-2">Exact quotes depend on scope — get yours free in 2 minutes.</p>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-[#0F172A] mb-8">Common questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
              <h3 className="font-bold text-[#0F172A] mb-2">{faq.q}</h3>
              <p className="text-[#475569] text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust + Footer CTA */}
      <section className="py-16 px-6 bg-[#0F172A] text-white text-center">
        <p className="text-[#94A3B8] mb-4">Verified {category.name.toLowerCase()} pros serving Milton · Oakville · Burlington</p>
        <Link
          to={`/get-quotes?category=${category.id}&slug=${category.slug}`}
          className="inline-block px-10 py-4 bg-[#2563EB] text-white font-bold rounded-full text-lg hover:bg-[#1D4ED8] transition-colors"
        >
          Get Free Quotes →
        </Link>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Verify manually**

Navigate to `http://localhost:3002/services/hvac`. Should show the HVAC landing page with hero, how-it-works, pricing, FAQs. "Get Free Quotes" links to `/get-quotes?category=...` (wizard, not yet built — 404 is fine).

- [ ] **Step 3: Commit**

```bash
git add src/landing-page/CategoryLandingPage.tsx
git commit -m "feat: add dynamic category landing pages (/services/:slug)"
```

---

## Task 8: Guest wizard — shell + progress bar

**Files:**
- Create: `src/consumer/GuestRequestWizardPage.tsx`
- Create: `src/consumer/components/wizard/WizardProgress.tsx`

- [ ] **Step 1: Create `WizardProgress.tsx`**

Create `src/consumer/components/wizard/WizardProgress.tsx`:

```tsx
type WizardProgressProps = { current: number; total: number; labels: string[] }

export default function WizardProgress({ current, total, labels }: WizardProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {labels.map((label, i) => (
          <div key={i} className={`text-xs font-semibold ${i + 1 === current ? 'text-[#2563EB]' : i + 1 < current ? 'text-[#22C55E]' : 'text-[#94A3B8]'}`}>
            {i + 1 < current ? '✓' : i + 1 === current ? label : label}
          </div>
        ))}
      </div>
      <div className="h-1.5 bg-[#E2E8F0] rounded-full">
        <div
          className="h-1.5 bg-[#2563EB] rounded-full transition-all duration-300"
          style={{ width: `${((current - 1) / (total - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create wizard shell `GuestRequestWizardPage.tsx`**

Create `src/consumer/GuestRequestWizardPage.tsx`:

```tsx
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import WizardProgress from './components/wizard/WizardProgress'
import StepCategory from './components/wizard/StepCategory'
import StepSubService from './components/wizard/StepSubService'
import StepQualifiers from './components/wizard/StepQualifiers'
import StepLocation from './components/wizard/StepLocation'
import StepContact from './components/wizard/StepContact'
import StepOtp from './components/wizard/StepOtp'

export type WizardState = {
  categoryId: string | null
  categorySlug: string | null
  categoryName: string | null
  subServiceId: string | null
  subServiceName: string | null
  qualifierAnswers: Record<string, string | string[]>
  description: string
  postalCode: string
  firstName: string
  email: string
  phone: string
  smsConsent: boolean
  referralCode: string
}

const STEP_LABELS = ['Service', 'Details', 'Questions', 'Location', 'Contact', 'Verify']
const TOTAL_STEPS = 6

export default function GuestRequestWizardPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const [state, setState] = useState<WizardState>({
    categoryId: searchParams.get('category'),
    categorySlug: searchParams.get('slug'),
    categoryName: null,
    subServiceId: null,
    subServiceName: null,
    qualifierAnswers: {},
    description: '',
    postalCode: searchParams.get('postal') ?? '',
    firstName: '',
    email: '',
    phone: '',
    smsConsent: false,
    referralCode: '',
  })

  function update(patch: Partial<WizardState>) {
    setState(prev => ({ ...prev, ...patch }))
    setError(null)
  }

  function next() { setStep(s => Math.min(s + 1, TOTAL_STEPS)); setError(null) }
  function back() { setStep(s => Math.max(s - 1, 1)); setError(null) }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center font-black text-white text-sm">H</div>
            <span className="text-xl font-black tracking-tight text-[#0F172A]">The Helper</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#0F172A]">Get free quotes</h2>
          <p className="text-[#475569] text-sm mt-1">No account needed — takes 2 minutes</p>
        </div>

        <WizardProgress current={step} total={TOTAL_STEPS} labels={STEP_LABELS} />

        <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-8 shadow-lg">
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {step === 1 && <StepCategory state={state} update={update} onNext={next} />}
            {step === 2 && <StepSubService state={state} update={update} onNext={next} onBack={back} />}
            {step === 3 && <StepQualifiers state={state} update={update} onNext={next} onBack={back} />}
            {step === 4 && <StepLocation state={state} update={update} onNext={next} onBack={back} />}
            {step === 5 && <StepContact state={state} update={update} onNext={next} onBack={back} />}
            {step === 6 && (
              <StepOtp
                state={state}
                update={update}
                onBack={back}
                onSuccess={(requestId) => navigate(`/dashboard${requestId ? `?newRequest=${requestId}` : ''}`)}
                setError={setError}
              />
            )}
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-[10px] px-4 py-3">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify the page renders**

Navigate to `http://localhost:3002/get-quotes`. Should show The Helper header, progress bar, and a blank step 1 area (StepCategory will error until created in Task 9).

- [ ] **Step 4: Commit**

```bash
git add src/consumer/GuestRequestWizardPage.tsx src/consumer/components/wizard/WizardProgress.tsx
git commit -m "feat: wizard shell and progress bar"
```

---

## Task 9: Wizard steps 1–3 (Category, Sub-service, Qualifiers)

**Files:**
- Create: `src/consumer/components/wizard/StepCategory.tsx`
- Create: `src/consumer/components/wizard/StepSubService.tsx`
- Create: `src/consumer/components/wizard/StepQualifiers.tsx`

- [ ] **Step 1: Create `StepCategory.tsx`**

```tsx
import { useQuery, getServiceCategories } from 'wasp/client/operations'
import type { ServiceCategory } from 'wasp/entities'
import type { WizardState } from '../../GuestRequestWizardPage'

type Props = { state: WizardState; update: (p: Partial<WizardState>) => void; onNext: () => void }

export default function StepCategory({ state, update, onNext }: Props) {
  const { data: categories, isLoading } = useQuery(getServiceCategories)
  const parents = (categories as ServiceCategory[] | undefined)?.filter(c => !c.parentCategoryId && c.active) ?? []

  function select(cat: ServiceCategory) {
    update({ categoryId: cat.id, categorySlug: cat.slug, categoryName: cat.name, subServiceId: null, subServiceName: null })
    onNext()
  }

  if (isLoading) return <div className="animate-pulse text-center text-[#94A3B8] py-8">Loading services…</div>

  return (
    <div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">What do you need help with?</h3>
      <p className="text-[#475569] text-sm mb-6">Select a category to get started.</p>
      <div className="grid grid-cols-2 gap-3">
        {parents.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => select(cat)}
            className={`border-2 rounded-2xl p-5 text-left transition-all cursor-pointer ${
              state.categoryId === cat.id ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8]'
            }`}
          >
            <p className="font-bold text-sm text-[#0F172A]">{cat.name}</p>
            {cat.description && <p className="text-xs text-[#475569] mt-1 line-clamp-2">{cat.description}</p>}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `StepSubService.tsx`**

```tsx
import { useQuery, getServiceCategories } from 'wasp/client/operations'
import type { ServiceCategory } from 'wasp/entities'
import type { WizardState } from '../../GuestRequestWizardPage'

type Props = { state: WizardState; update: (p: Partial<WizardState>) => void; onNext: () => void; onBack: () => void }

export default function StepSubService({ state, update, onNext, onBack }: Props) {
  const { data: categories } = useQuery(getServiceCategories)
  const children = (categories as ServiceCategory[] | undefined)?.filter(c => c.parentCategoryId === state.categoryId) ?? []

  function select(cat: ServiceCategory) {
    update({ subServiceId: cat.id, subServiceName: cat.name })
    onNext()
  }

  function skip() {
    update({ subServiceId: null, subServiceName: null })
    onNext()
  }

  return (
    <div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">What type of {state.categoryName} work?</h3>
      <p className="text-[#475569] text-sm mb-6">Pick the closest match, or skip if unsure.</p>
      <div className="grid grid-cols-2 gap-3">
        {children.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => select(cat)}
            className={`border-2 rounded-2xl p-5 text-left transition-all cursor-pointer ${
              state.subServiceId === cat.id ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8]'
            }`}
          >
            <p className="font-bold text-sm text-[#0F172A]">{cat.name}</p>
          </button>
        ))}
        {children.length === 0 && (
          <p className="col-span-2 text-sm text-[#94A3B8] text-center py-4">No sub-services yet — click Skip below.</p>
        )}
      </div>
      <div className="flex justify-between mt-6">
        <button type="button" onClick={onBack} className="text-[#475569] font-bold hover:text-[#0F172A]">← Back</button>
        <button type="button" onClick={skip} className="text-[#2563EB] font-bold hover:underline">Skip →</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `StepQualifiers.tsx`**

```tsx
import { useState } from 'react'
import { useQuery, getServiceCategories } from 'wasp/client/operations'
import type { ServiceCategory } from 'wasp/entities'
import { CATEGORY_QUALIFIERS } from '../../categoryQualifiers'
import type { WizardState } from '../../GuestRequestWizardPage'

type Props = { state: WizardState; update: (p: Partial<WizardState>) => void; onNext: () => void; onBack: () => void }

export default function StepQualifiers({ state, update, onNext, onBack }: Props) {
  const { data: categories } = useQuery(getServiceCategories)
  const [description, setDescription] = useState(state.description)
  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(state.qualifierAnswers).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]))
  )

  // Prefer DB questions on the sub-service, fall back to hardcoded categoryQualifiers
  const subCat = (categories as ServiceCategory[] | undefined)?.find(c => c.id === state.subServiceId)
  const dbQuestions = subCat?.questions as { id: string; label: string; options: string[] }[] | null | undefined
  const fallback = state.categorySlug ? CATEGORY_QUALIFIERS[state.categorySlug] : undefined
  const questions = dbQuestions?.length
    ? dbQuestions
    : fallback
    ? [fallback.q1, ...(fallback.q2 ? [fallback.q2] : [])].map(q => ({ id: q.id, label: q.label, options: q.options }))
    : []

  function setAnswer(id: string, value: string) {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  function handleNext() {
    update({ qualifierAnswers: answers, description })
    onNext()
  }

  return (
    <div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">Tell us more</h3>
      <p className="text-[#475569] text-sm mb-6">Help pros understand your job. All questions are optional.</p>

      {questions.map(q => (
        <div key={q.id} className="mb-5">
          <p className="text-sm font-semibold text-[#475569] mb-2">{q.label}</p>
          <div className="flex flex-wrap gap-2">
            {q.options.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setAnswer(q.id, opt)}
                className={`px-4 py-2 rounded-full text-sm border-2 transition-all ${
                  answers[q.id] === opt ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-bold' : 'border-[#E2E8F0] text-[#475569] hover:border-[#94A3B8]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-4">
        <label className="block text-sm font-semibold text-[#475569] mb-1.5">Any other details? <span className="font-normal opacity-60">(optional)</span></label>
        <textarea
          className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] resize-none"
          rows={3}
          placeholder="e.g. 'AC stopped working overnight, unit is 8 years old'"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" onClick={onBack} className="text-[#475569] font-bold hover:text-[#0F172A]">← Back</button>
        <button type="button" onClick={handleNext} className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-full hover:bg-[#1D4ED8] transition-colors">Next →</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify steps 1–3 manually**

Go to `/get-quotes`. Should be able to:
1. Pick a category → advances to step 2
2. Pick a sub-service or skip → advances to step 3
3. Answer qualifier questions, add description → "Next" advances to step 4 (StepLocation, errors until Task 10)

- [ ] **Step 5: Commit**

```bash
git add src/consumer/components/wizard/StepCategory.tsx src/consumer/components/wizard/StepSubService.tsx src/consumer/components/wizard/StepQualifiers.tsx
git commit -m "feat: wizard steps 1-3 (category, sub-service, qualifiers)"
```

---

## Task 10: Wizard steps 4–6 (Location, Contact, OTP)

**Files:**
- Create: `src/consumer/components/wizard/StepLocation.tsx`
- Create: `src/consumer/components/wizard/StepContact.tsx`
- Create: `src/consumer/components/wizard/StepOtp.tsx`

- [ ] **Step 1: Create `StepLocation.tsx`**

```tsx
import { useState } from 'react'
import type { WizardState } from '../../GuestRequestWizardPage'

type Props = { state: WizardState; update: (p: Partial<WizardState>) => void; onNext: () => void; onBack: () => void }

const CA_POSTAL = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/

export default function StepLocation({ state, update, onNext, onBack }: Props) {
  const [postal, setPostal] = useState(state.postalCode)
  const [error, setError] = useState<string | null>(null)

  function handleNext() {
    const trimmed = postal.trim().toUpperCase()
    if (!trimmed) { setError('Postal code is required.'); return }
    if (!CA_POSTAL.test(trimmed)) { setError('Enter a valid Canadian postal code (e.g. L9T 2X5).'); return }
    update({ postalCode: trimmed })
    onNext()
  }

  return (
    <div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">Where are you located?</h3>
      <p className="text-[#475569] text-sm mb-6">We use this to match you with local pros.</p>
      <label className="block text-sm font-semibold text-[#475569] mb-1.5">Postal Code *</label>
      <input
        type="text"
        className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors uppercase"
        placeholder="L9T 2X5"
        value={postal}
        onChange={e => { setPostal(e.target.value); setError(null) }}
        maxLength={7}
      />
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      <p className="text-xs text-[#94A3B8] mt-2">We serve Milton, Oakville, Burlington and surrounding GTA areas.</p>
      <div className="flex justify-between mt-8">
        <button type="button" onClick={onBack} className="text-[#475569] font-bold hover:text-[#0F172A]">← Back</button>
        <button type="button" onClick={handleNext} className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-full hover:bg-[#1D4ED8] transition-colors">Next →</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `StepContact.tsx`**

```tsx
import { useState } from 'react'
import type { WizardState } from '../../GuestRequestWizardPage'

type Props = { state: WizardState; update: (p: Partial<WizardState>) => void; onNext: () => void; onBack: () => void }

const inputClass = 'w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors'

export default function StepContact({ state, update, onNext, onBack }: Props) {
  const [firstName, setFirstName] = useState(state.firstName)
  const [email, setEmail] = useState(state.email)
  const [phone, setPhone] = useState(state.phone)
  const [smsConsent, setSmsConsent] = useState(state.smsConsent)
  const [referralCode, setReferralCode] = useState(state.referralCode)
  const [showReferral, setShowReferral] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleNext() {
    if (!firstName.trim()) { setError('First name is required.'); return }
    if (!email.trim() || !email.includes('@')) { setError('A valid email is required.'); return }
    if (!phone.trim()) { setError('Phone number is required.'); return }
    update({ firstName: firstName.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), smsConsent, referralCode })
    onNext()
  }

  return (
    <div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">Almost done!</h3>
      <p className="text-[#475569] text-sm mb-6">We'll send your request to local pros and email you a 6-digit code to verify.</p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#475569] mb-1.5">First Name *</label>
          <input type="text" className={inputClass} placeholder="Jane" value={firstName} onChange={e => { setFirstName(e.target.value); setError(null) }} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#475569] mb-1.5">Email *</label>
          <input type="email" className={inputClass} placeholder="jane@example.com" value={email} onChange={e => { setEmail(e.target.value); setError(null) }} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#475569] mb-1.5">Phone *</label>
          <input type="tel" className={inputClass} placeholder="(416) 555-0100" value={phone} onChange={e => { setPhone(e.target.value); setError(null) }} />
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-0.5 accent-[#2563EB]" checked={smsConsent} onChange={e => setSmsConsent(e.target.checked)} />
          <span className="text-sm text-[#475569]">I agree to receive SMS updates about my service request</span>
        </label>
        {!showReferral ? (
          <button type="button" onClick={() => setShowReferral(true)} className="text-xs text-[#2563EB] hover:underline">Have a referral code?</button>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-[#475569] mb-1.5">Referral Code <span className="font-normal opacity-60">(optional)</span></label>
            <input type="text" className={inputClass} placeholder="REF-XXXXXX" value={referralCode} onChange={e => setReferralCode(e.target.value.toUpperCase())} />
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      <div className="flex justify-between mt-8">
        <button type="button" onClick={onBack} className="text-[#475569] font-bold hover:text-[#0F172A]">← Back</button>
        <button type="button" onClick={handleNext} className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-full hover:bg-[#1D4ED8] transition-colors">Send code →</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `StepOtp.tsx`**

```tsx
import { useState, useRef, useEffect } from 'react'
import { setSessionId } from 'wasp/client/api'
import type { WizardState } from '../../GuestRequestWizardPage'

type Props = {
  state: WizardState
  update: (p: Partial<WizardState>) => void
  onBack: () => void
  onSuccess: (requestId?: string) => void
  setError: (e: string | null) => void
}

export default function StepOtp({ state, onBack, onSuccess, setError }: Props) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    sendCode()
  }, [])

  async function sendCode() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send code.')
      setCodeSent(true)
      setResendCooldown(60)
      const timer = setInterval(() => setResendCooldown(prev => { if (prev <= 1) { clearInterval(timer); return 0 } return prev - 1 }), 1000)
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    const codeValue = code.join('')
    if (codeValue.length !== 6) return
    setIsLoading(true)
    setError(null)
    try {
      const pendingRequest = {
        firstName: state.firstName,
        phone: state.phone,
        postalCode: state.postalCode,
        smsConsent: state.smsConsent,
        serviceCategoryId: state.subServiceId ?? state.categoryId ?? undefined,
        description: state.description || `${state.categoryName ?? 'Service'} request`,
        qualifierAnswers: state.qualifierAnswers,
        referralCode: state.referralCode || undefined,
      }
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.email, code: codeValue, pendingRequest }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Verification failed.')
      setSessionId(data.sessionId)
      onSuccess(data.requestId)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleInput(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...code]; next[index] = digit; setCode(next)
    setError(null)
    if (digit && index < 5) inputRefs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !code[index] && index > 0) inputRefs.current[index - 1]?.focus()
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) { setCode(pasted.split('')); inputRefs.current[5]?.focus() }
  }

  return (
    <div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">Check your email</h3>
      <p className="text-[#475569] text-sm mb-6">
        We sent a 6-digit code to <span className="font-semibold text-[#0F172A]">{state.email}</span>
      </p>
      {!codeSent && isLoading && <p className="text-sm text-[#94A3B8] text-center py-4">Sending code…</p>}
      {codeSent && (
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#475569] mb-3">Enter your 6-digit code</label>
            <div className="flex gap-2 justify-between" onPaste={handlePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleInput(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-2xl font-black bg-white border-2 rounded-xl transition-colors focus:outline-none focus:border-[#2563EB]"
                  style={{ borderColor: digit ? '#2563EB' : '#E2E8F0' }}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || code.join('').length !== 6}
            className="w-full py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Verifying…' : 'Verify & get quotes'}
          </button>
          <p className="text-center text-sm text-[#475569]">
            Didn't get it?{' '}
            {resendCooldown > 0 ? (
              <span>Resend in {resendCooldown}s</span>
            ) : (
              <button type="button" onClick={sendCode} className="text-[#2563EB] font-semibold hover:underline">Resend code</button>
            )}
          </p>
        </form>
      )}
      <div className="mt-6">
        <button type="button" onClick={onBack} className="text-[#475569] text-sm hover:text-[#0F172A]">← Change contact info</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: End-to-end test**

Run the full guest wizard flow:
1. Go to `http://localhost:3002/get-quotes`
2. Pick HVAC → sub-service → answer qualifier → enter postal code → enter name/email/phone → get OTP → verify
3. Should land on `/dashboard` showing the new request
4. Check DB: `ServiceRequest` row should exist with `qualifierAnswers`, `consumerId` set, and `User` record created

- [ ] **Step 5: Test returning user**

Repeat with the same email (`consumer@thehelper.ca`). After OTP verify:
- Should land on dashboard
- A second `ServiceRequest` should be created and attached to the existing user
- No duplicate `SIGNUP_BONUS` reward transaction

- [ ] **Step 6: Commit**

```bash
git add src/consumer/components/wizard/StepLocation.tsx src/consumer/components/wizard/StepContact.tsx src/consumer/components/wizard/StepOtp.tsx
git commit -m "feat: wizard steps 4-6 (location, contact, OTP + account creation)"
```

---

## Task 11: Simplify consumer onboarding fallback

**Files:**
- Modify: `src/auth/onboarding/OnboardingPage.tsx`

Consumers who arrive at `/onboarding` without a pending request (direct login with no request) should be offered the wizard for their first request.

- [ ] **Step 1: Add redirect to wizard for consumers on step 3**

In `OnboardingPage.tsx`, find where step 3 renders for consumers (the `CategoryCardGrid` for interests). Replace it with a redirect prompt:

```tsx
{step === 3 && !isProvider && (
  <div className="text-center py-4">
    <h3 className="text-xl font-black mb-2 text-[#0F172A]">Ready to get quotes?</h3>
    <p className="text-[#475569] text-sm mb-6">Tell us what you need and we'll match you with local pros.</p>
    <button
      type="button"
      onClick={() => navigate('/get-quotes')}
      className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-[22px] hover:bg-[#1D4ED8] transition-colors"
    >
      Find a local pro →
    </button>
    <button
      type="button"
      onClick={handleNext}
      className="block mx-auto mt-3 text-sm text-[#475569] hover:text-[#0F172A]"
    >
      Skip for now
    </button>
  </div>
)}
```

Update `validate()` so step 3 for consumers has no validation (the redirect handles it):
```typescript
// Remove the step 3 consumer validation entirely — step 3 is now a redirect
```

Update `handleNext` for consumers at step 3: if they click "Skip for now", call `completeOnboarding` with empty `interestCategoryIds` and navigate to dashboard.

- [ ] **Step 2: Verify**

Log in with a fresh email (never used before). Complete OTP → `/onboarding` → step 1 role → step 2 profile → step 3 should show "Find a local pro" CTA or "Skip for now". Clicking the CTA should go to `/get-quotes`.

- [ ] **Step 3: Commit**

```bash
git add src/auth/onboarding/OnboardingPage.tsx
git commit -m "feat: simplify consumer onboarding step 3 to wizard redirect"
```

---

---

> **Out of scope for this plan (follow-up):** GHL lead capture on wizard abandonment — saving `guestEmail`/`guestPhone` to a partial `ServiceRequest` mid-wizard so GHL can follow up on drop-offs. This requires a new `savePartialGuestRequest` action and a debounced call after Step 5.

---

## Task 12: Smoke test + cleanup

- [ ] **Step 1: Full happy-path test**

New user → homepage → click "HVAC" → service detail page → "Get Free Quotes" → wizard → complete → dashboard with request

- [ ] **Step 2: Returning user test**

Same email → get-quotes → complete → dashboard (second request created, no duplicate bonus)

- [ ] **Step 3: Provider flow unchanged**

Log in as `hvac@thehelper.ca` → `/onboarding` → should still show 4-step provider flow unchanged

- [ ] **Step 4: Nav dropdown**

Hover "Services" in nav → dropdown shows all active categories → click HVAC → goes to `/services/hvac`

- [ ] **Step 5: Close visual companion server**

```bash
bash /Users/alishafique/.claude/plugins/cache/claude-plugins-official/superpowers/5.1.0/skills/brainstorming/scripts/stop-server.sh /Users/alishafique/Code/worki-pro/.superpowers/brainstorm/70781-1779239469
```

- [ ] **Step 6: Final commit + push**

```bash
git push origin main
```
