# The Helper — Brand Guidelines

_Last updated: 2026-06-09_

The refreshed identity keeps The Helper's house-and-tools concept but rebalances it to a **predominantly blue palette with a single warm amber accent**. This matches the product's design tokens, reads as trustworthy/professional (the category cue for home services), and scales cleanly from a hero lockup down to a 16px favicon.

## Logo

| Asset | File | Use |
|-------|------|-----|
| Horizontal lockup (light bg) | `public/logo.svg` | Marketing pages, light backgrounds |
| Horizontal lockup (dark bg) | `public/logo-dark.svg` | Footer / navy sections |
| Icon mark | `public/logo-icon.svg`, `src/client/static/logo.webp` | NavBar, admin sidebar, auth, app icon |
| Favicon | `public/favicon.ico` (16/32/48/64) | Browser tab |
| Apple touch icon | `public/apple-touch-icon.png` (180×180) | iOS home screen, email header |

Construction: a blue gradient app-tile (`#3B82F6 → #2563EB → #1E3A8A`), a white house with chimney + door, and one amber growth arrow (`#FBBF24 → #F59E0B`) signalling the tagline "tackling your to-do list."

**Rules**
- Amber appears **only** in the arrow — never recolor the house or tile orange.
- Minimum icon size 16px; keep clear space ≥ the chimney height on all sides.
- On dark backgrounds use `logo-dark.svg` (white "the/.ca", `#60A5FA` "helper").
- Don't stretch, add shadows, or place the lockup on busy photos without a solid panel.

## Colour palette

Primary brand colours (unchanged from the design system) plus documented support roles:

| Role | Token | Hex |
|------|-------|-----|
| Primary | Brand Blue | `#2563EB` |
| Primary hover | Blue 700 | `#1D4ED8` |
| Gradient deep | Blue 900 | `#1E3A8A` |
| Highlight | Blue 500 | `#3B82F6` |
| Tint / accent bg | Blue 100 | `#DBEAFE` / `#EFF6FF` |
| Ink | Navy | `#0F172A` |
| Body text | Slate | `#475569` |
| Muted text | Slate 400 | `#94A3B8` |
| Page bg | Slate 50 | `#F8FAFC` |
| Surface | White | `#FFFFFF` |
| Border | Slate 200 | `#E2E8F0` |
| Success | Green | `#22C55E` |
| Warm accent | Amber | `#F59E0B` / `#FBBF24` |
| Accent bg | Amber 100 | `#FEF3C7` |

**Amber discipline:** amber/orange is an _accent only_ — logo arrow, rewards, ratings, and warning badges. Never use it for primary buttons, links, or large fills. Everything interactive stays blue.

These values now also back the CSS design tokens in `src/client/Main.css` (`:root` and `.dark`), which previously shipped a leftover pink (`#F2B5D7`) primary from the template. That has been corrected.

## Voice (quick reference)

- Confident, plain-spoken, local. Short sentences.
- Tagline: **"Tackling your to-do list."**
- Canonical name: **The Helper** (two words) in copy; `thehelper.ca` in the wordmark.
- Avoid unverifiable superlatives ("#1", "best", "guaranteed") — see the audit report for specific fixes.
