---
id: 82
status: ready
priority: P2
labels:
  - venture:worki
  - priority:P2
  - persona:homeowner
  - status:open
repo_issue: 82
title: Finish consumer account management
---

# Finish consumer account management

## Problem
The consumer account page still has TODOs for profile photo upload and password/email changes. The current page exposes only basic profile fields and leaves core account actions unfinished.

## Scope
Complete the account settings surface for consumers.

## Acceptance criteria
- User can upload or change profile photo.
- User can change password or initiate password reset from the account area.
- User can change email or start a verified email-change flow if supported.
- Existing profile fields still save correctly.
- Errors and success states are clear.

## Source files
- `src/user/AccountPage.tsx`
- `src/auth/email-and-pass/*`
- `src/auth/onboardingOperations.ts`

## Agent notes
- status: ready
- owner: unassigned
