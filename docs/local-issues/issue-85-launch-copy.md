---
id: 85
status: ready
priority: P2
labels:
  - venture:worki
  - priority:P2
  - persona:homeowner
  - persona:pro
  - status:open
repo_issue: 85
title: Clean up public copy that overpromises or still says “coming soon”
---

# Clean up public copy that overpromises or still says “coming soon”

## Problem
Several public-facing pages still use launch-staging language or stronger claims than the product currently supports. We should tighten the copy so it matches the actual shipped scope.

## Scope
Review public and marketing pages and remove or soften any wording that makes the product sound unfinished or overpromises features.

## Acceptance criteria
- Public pages do not promise unsupported features as if they are live.
- Coming-soon references are removed, hidden, or moved to a clear waitlist pattern.
- Headlines, badges, and CTAs match actual product behavior.
- Copy feels consistent and credible across the site.

## Source files
- `src/landing-page/LandingPage.tsx`
- `src/auth/onboarding/OnboardingPage.tsx`
- `src/provider/BillingPage.tsx`
- `NAVIGATION.md`

## Agent notes
- status: ready
- owner: unassigned
