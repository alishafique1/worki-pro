---
id: 84
status: ready
priority: P1
labels:
  - venture:worki
  - priority:P1
  - persona:admin
  - status:open
repo_issue: 84
title: Turn contact form submissions into a real admin inbox
---

# Turn contact form submissions into a real admin inbox

## Problem
Contact form submissions are not yet a real admin inbox. There is a TODO in `main.wasp` for making user messages accessible from the admin dashboard, but the current admin screen is still more like a lead list than a support inbox.

## Scope
Turn inbound contact messages into an actionable admin inbox.

## Acceptance criteria
- Contact form submissions appear in `/admin/messages`.
- Each message shows sender details, message body, timestamp, and triage state.
- Admin can view full details without leaving the inbox.
- Admin can update status, assignment, or internal notes.
- Messages persist across refreshes.
- Non-admin users cannot access the inbox.

## Source files
- `main.wasp`
- `src/consumer/ContactPage.tsx`
- `src/admin/dashboards/messages/MessagesPage.tsx`
- `src/server/webhooks/ghl.ts`

## Agent notes
- status: ready
- owner: unassigned
