---
id: 81
status: ready
priority: P1
labels:
  - venture:worki
  - priority:P1
  - persona:pro
  - status:open
repo_issue: 81
title: Provider billing: replace disabled “Buy credits” CTA with real top-up flow
---

# Provider billing: replace disabled “Buy credits” CTA with real top-up flow

## Problem
The provider billing page shows a live balance and ledger, but the main `Buy credits` CTA is disabled and marked as coming soon. Providers cannot complete an in-app top-up flow.

## Scope
Replace the placeholder CTA with a working purchase flow on `/provider/billing`.

## Acceptance criteria
- The CTA is active and routes into a real purchase flow.
- A provider can choose a credit bundle and complete checkout.
- Successful payment updates the provider balance and transaction ledger.
- Errors and cancelled checkouts are handled clearly.
- The flow is available only to authenticated providers.
- No coming-soon placeholder remains on the billing page.

## Source files
- `src/provider/BillingPage.tsx`
- `src/payment/*`
- `src/provider/operations.ts`

## Agent notes
- status: ready
- owner: unassigned
