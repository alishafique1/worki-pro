---
id: 83
status: ready
priority: P2
labels:
  - venture:worki
  - priority:P2
  - persona:admin
  - status:open
repo_issue: 83
title: Make admin settings page functional or hide it
---

# Make admin settings page functional or hide it

## Problem
The admin settings page is visible in navigation, but most controls are disabled and the page is explicitly read-only during launch stabilization. That creates dead-end UI for admins.

## Scope
Either implement the settings actions or remove the page from the shipped admin nav until it is functional.

## Acceptance criteria
- Admin can edit the intended settings fields, or the page is hidden from nav if not ready.
- Disabled save/cancel/upload controls are replaced with real behavior or removed.
- The page has a clear purpose and no dead controls.
- Any persisted settings are reflected after reload.

## Source files
- `src/admin/elements/settings/SettingsPage.tsx`
- `src/admin/layout/Sidebar.tsx`
- `main.wasp`

## Agent notes
- status: ready
- owner: unassigned
