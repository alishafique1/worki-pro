# TheHelper / worki-pro — Agent Conventions

This document captures project-specific conventions for AI agents working on the `worki-pro` codebase (a Wasp + React + Prisma marketplace app).

---

## Stack Overview

| Layer | Technology |
|---|---|
| Framework | [Wasp 0.21](https://wasp.sh) — full-stack DSL (React + Node.js + Prisma) |
| Database | PostgreSQL, schema at `schema.prisma` in the project root |
| ORM | Prisma v5 — auto-imported via Wasp |
| Auth | Wasp email auth (see `main.wasp` `auth` block) |
| Payments | Stripe (via `ProviderFee` + `Provider.stripeSubId`) |
| Email | Mailgun via `wasp/server/email` `emailSender` |
| SMS | Twilio REST API (see `src/server/webhooks/twilio.ts`) |
| Scheduling | Cal.com (via `calComWebhook` in `main.wasp`) |
| CRM | GoHighLevel via `src/server/services/ghl.ts` |

---

## Wasp Patterns

### Declaring operations (required)

Every query/action must be declared in `main.wasp` AND implemented in `src/**/operations.ts`:

```wasp
// main.wasp
query myQuery {
  fn: import { myQuery } from "@src/feature/operations",
  entities: [ModelA, ModelB]  // ALL models used must be listed
}
```

```typescript
// src/feature/operations.ts
import type { MyQuery } from 'wasp/server/operations';
export const myQuery: MyQuery<InputType, OutputType> = async (args, context) => {
  // context.entities.ModelA is available because it's in the entities list
};
```

### Type imports

- Operation types: `import type { MyQuery } from 'wasp/server/operations'`
- Entity types: `import type { MyModel } from 'wasp/entities'`
- Enum values (runtime): `import { MyEnum } from '@prisma/client'`  ← NOT from `wasp/entities`

### Client usage

- Queries: `const { data, isLoading } = useQuery(myQuery, args, { refetchInterval: 5000 })`
- Actions: `const result = await myAction(args)` — call directly, **not** via `useAction` unless you need optimistic updates

---

## Schema Conventions

- Schema file: `schema.prisma` at project root
- After editing: run `wasp db migrate-dev --name <migration-name>` in the terminal
- If Wasp migrate-dev hangs (interactive prompt issue): run `prisma db push --accept-data-loss` directly from `.wasp/out/` with `DATABASE_URL` set

### Key models

| Model | Purpose |
|---|---|
| `User` | All users — role: `CONSUMER / PROVIDER / ADMIN` |
| `Provider` | Professional profile; extends `User`; has `slug`, `bio`, `reviews[]` |
| `ServiceRequest` | A customer lead; status flows from `NEW` → `ASSIGNED` → `COMPLETED` |
| `ProviderFee` | Revenue event; type: `QUALIFIED_LEAD / BOOKED_APPOINTMENT / SUCCESS_FEE` |
| `Review` | Consumer → Provider review (1–5 stars); status: `PENDING / PUBLISHED / REJECTED` |
| `OtpVerification` | Phone OTP records — 10min TTL, max 5 attempts |
| `CommunicationLog` | In-app messages (channel: `INTERNAL_NOTE`, direction: `INBOUND/OUTBOUND`) |
| `RewardAccount` | Consumer points wallet |

---

## Business Rules

### Lead masking (critical)
`getPublicLeadFeed` must NEVER return `name`, `phone`, or `email` from `ServiceRequest`.  
Only reveal PII after `claimLead` is called and `assignedProviderId` is set.

### claimLead invariants
- Provider must have `verificationStatus === "VERIFIED"` to claim
- Claiming creates a `ProviderFee(feeType: QUALIFIED_LEAD, amount: 5.00)`
- Calling `claimLead` twice with the same requestId returns `{ alreadyClaimed: true }` (idempotent)
- Fires email notification to consumer via `emailSender`

### Review rules
- Consumers may only submit one review per `serviceRequestId`
- After submit: recompute `Provider.ratingInternal` via Prisma `aggregate(_avg.rating)`
- Admin can moderate via `ReviewStatus: PENDING / PUBLISHED / REJECTED`

### OTP flow
- `sendOtp(phone)` → Twilio SMS → stores hashed code in `OtpVerification`
- `verifyOtp(phone, code)` → SHA-256 comparison, increments `attempts`
- Rate limit: max 3 OTP sends in 5 minutes per phone number

---

## Route Map (key pages)

### Consumer
| Path | Page |
|---|---|
| `/request-service` | 4-step wizard (category → details → contact → OTP verify) |
| `/my-requests/:requestId/messages` | In-app messaging thread |
| `/my-requests/:requestId/review` | Leave review after job complete |
| `/pro-public/:slug` | Public provider profile |
| `/services/:serviceSlug/:areaSlug` | SEO city×service landing page |

### Provider
| Path | Page |
|---|---|
| `/provider/leads` | Bark-style lead feed (masked, filter by category + urgency) |
| `/provider/requests/:requestId/messages` | Reply to customer in thread |
| `/provider/profile` | Edit profile incl. slug, bio, portfolio, response time |

### Admin
| Path | Page |
|---|---|
| `/admin/reviews` | Review moderation (publish/reject) |
| `/admin/requests` | View all service requests |
| `/admin/providers` | Approve/reject provider applications |

---

## Notification Conventions

- Email via `emailSender.send(...)` from `wasp/server/email` — fire-and-forget with `.catch()` logging
- Consumer notified by email when a provider claims their lead (`claimLead`)
- Provider notified by email when a consumer sends a message (`sendCustomerMessage`)
- Consumer notified by email when a provider sends a message (`sendProviderMessage`)
- Twilio SMS handled in `src/server/webhooks/twilio.ts`

---

## Common Pitfalls

1. **Forgetting to list a model in `entities: [...]`** — If you access `context.entities.Review` but `Review` isn't in the entities list in `main.wasp`, the TypeScript build will fail with a confusing type error.
2. **Using `useAction` instead of direct `await`** — Only use `useAction` for optimistic updates. Otherwise call actions directly.
3. **Enum values at runtime** — Import from `@prisma/client`, not `wasp/entities`.
4. **Migration in non-interactive shell** — `wasp db migrate-dev` may hang. Use `wasp db migrate-dev --name <name>` or fall back to `prisma db push --accept-data-loss` from `.wasp/out/`.
5. **PII in lead feed** — `getPublicLeadFeed` strips `name`, `phone`, `email`. Don't add them back.
