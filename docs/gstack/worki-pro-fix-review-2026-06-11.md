# /autoplan Review — worki-pro Live Site Fixes (2026-06-11)

**Plan file:** PLAN.md (the existing launch plan)
**Branch:** main
**Reviewer scope:** Fix the 3 live bugs Ali reported. No scope expansion.

## Plan Summary

Three bugs break signup, signin, and every DB-driven page on thehelper.ca:

1. **Wrong REACT_APP_API_URL in the deployed JS bundle** — bundle has `"https://thehelper.ca"` but the web container has no nginx proxy from `/api/`, `/auth/`, `/operations/` to the API. Every `useQuery` (Prisma DB read) and every manual `fetch()` returns the SPA HTML and `JSON.parse` blows up.
2. **SignupPage hits `/auth/signup` which is not a real route** — Wasp 0.21's email signup is `/auth/email/signup`. The hardcoded `/auth/signup` 404s the SPA.
3. **Web container nginx has no API proxy** — even if the bundle were rebuilt, requests to `https://thehelper.ca/api/*` 502 (verified). Traefik routes the two containers to two different hostnames; nothing bridges them.

**Fix strategy (P5 explicit, P1 complete):**
- Add `/api/`, `/auth/`, `/operations/` proxy blocks to `deploy/nginx.conf` in the web image.
- Rebuild the bundle with `REACT_APP_API_URL=https://thehelper.ca` (same-origin).
- Switch `SignupPage.tsx` to call `/auth/email/signup` then request OTP (the canonical Wasp 0.21 flow).
- Rebuild web image, redeploy, smoke-test signup + signin + DB query live.

---

## CEO DUAL VOICES — CONSENSUS TABLE

| Dimension | Assessment | Consensus |
|---|---|---|
| Right problem to solve? | Yes — broken signup is a launch blocker, fixing it is the highest-ROI move today. | CONFIRMED |
| Premises valid? | "Neon DB is fine" (verified: GET /auth/me roundtrip <50ms). "Bundle is wrong" (verified: REACT_APP_API_URL baked to wrong value). | CONFIRMED |
| Scope calibration? | 3 bugs, 1 file change in `SignupPage.tsx`, 1 nginx config change, 1 rebuild. No scope creep. | CONFIRMED |
| Alternatives? | Could swap to cross-origin + CORS. Rejected: CSP `connect-src` would need to allow both, and browser CORS adds an attack surface. Same-origin proxy is simpler and matches the existing Traefik front-door design. | CONFIRMED |
| 6-month regret? | None — these are launch-blocker fixes, not architectural decisions. | CONFIRMED |
| Competitive risk? | None — every minute the signup form is broken is a lost lead. | CONFIRMED |

## DESIGN REVIEW

**Scorecard:**
- Information hierarchy: 8/10 — current signin form is clear.
- Missing states: 4/10 — error path shows "Unexpected token '<'…" raw JSON parse error. Need a friendly error.
- User journey: 5/10 — signup → email-verify-OTP flow is reasonable, but the broken `/auth/signup` call makes the "Create account" button throw before any state advances.
- Specificity: 7/10 — design tokens (Brand #2563EB, Navy #0F172A) are consistent.

**Critical design fix:** Replace the raw JSON parse error message with a user-friendly fallback: "Something went wrong. Please try again or email support@thehelper.ca."

## ENG REVIEW — Architecture & Edge Cases

### What already exists
- `main.wasp` declares `requestOtp` and `verifyOtp` custom routes at `/api/auth/request-otp` and `/api/auth/verify-otp` — these work (verified live).
- `main.wasp` declares email auth with `getEmailUserFields` — produces a User on signup.
- `/auth/email/signup` is the real Wasp 0.21 endpoint (verified: returns 200 with `{"success":true}`).
- The OTP path returns the `sessionId` that the client sets via `setSessionId` to log the user in.

### Architecture diagram (after fix)
```
Browser (thehelper.ca)
  │
  ├─ HTML/JS bundle (nginx) ──────────► /api/*  ───► thehelper-api:3001 (via Traefik dns or same-host)
  │   REACT_APP_API_URL=https://thehelper.ca       │
  │   config.apiUrl = same-origin                  │
  │   useQuery(x) → POST /operations/{x} ──────────┤
  │   SignupPage → POST /auth/email/signup ────────┤
  │   LoginPage → POST /api/auth/request-otp ──────┤
  │                                                ├─► Prisma → Neon Postgres
  │                                                └─► emailSender → Mailgun
```

### Test diagram

| Codepath | Test |
|---|---|
| Signup creates user | `POST /auth/email/signup` with valid email+password → 200 |
| OTP request fires after signup | UI hits Send code button → 200 from `/api/auth/request-otp` |
| OTP verify completes signin | `POST /api/auth/verify-otp` with valid code → `{success:true, sessionId}` |
| `useQuery(getServiceCategories)` returns rows | `GET /operations/getServiceCategories` (with session cookie) → 200 with array |
| `useQuery(getProviders)` returns rows | `GET /operations/getProviders` → 200 |
| Web nginx proxies `/api/*` to API | `curl https://thehelper.ca/api/auth/request-otp` returns JSON, not HTML |
| Web nginx proxies `/operations/*` to API | `curl https://thehelper.ca/operations/getServiceCategories` returns JSON |

### Failure modes

| Mode | Impact | Mitigation |
|---|---|---|
| `config.apiUrl` re-baked wrong on next build | Recurrence of bug | Add CI check: `grep -q "REACT_APP_API_URL:.\"https://thehelper.ca\"" deploy/dist/assets/*.js` in deploy.sh |
| Signup form throws on slow network | User abandons | Add try/catch + friendly error message |
| OTP email never arrives | User can't verify | Add "Resend code" button (already exists in LoginPage but not SignupPage — copy the pattern) |
| Reverse proxy in web nginx goes down | All API calls 502 | Add a `/healthz` on the web container that also pings the API |

### Out of scope
- Switching the OTP/SMS provider (GHL webhook already in `.env.server`).
- Reworking the `getProviders` / lead feed query shape.
- Reviewing the uncommitted LandingPage design polish (low risk, can ship later).

## DX REVIEW — N/A (no new developer-facing surface)

The plan doesn't add APIs, CLIs, or SDKs. The web proxy and bundle rebuild are operational, not developer-facing. Skipping DX review.

---

## Implementation Tasks (aggregated)

- [ ] **P1 (CC: 5 min) — Add `/api/`, `/auth/`, `/operations/` proxy to `deploy/nginx.conf`.** Files: `deploy/nginx.conf`.
- [ ] **P1 (CC: 10 min) — Fix `SignupPage.tsx`: change `${apiUrl}/auth/signup` to `${apiUrl}/auth/email/signup`; add friendly error message; add Resend-code button to mirror LoginPage.** Files: `src/auth/SignupPage.tsx`.
- [ ] **P1 (CC: 5 min) — Same friendly-error fix in `LoginPage.tsx` for OTP path.** Files: `src/auth/LoginPage.tsx`.
- [ ] **P1 (CC: 10 min) — Rebuild React bundle with `REACT_APP_API_URL=https://thehelper.ca`:** `REACT_APP_API_URL=https://thehelper.ca npx vite build --outDir deploy/dist`. Files: `deploy/dist/assets/index-*.js`.
- [ ] **P1 (CC: 5 min) — Rebuild web image + restart thehelper-web container on VPS.** Files: VPS only.
- [ ] **P1 (CC: 5 min) — Rebuild API image (rebuild also needs `.wasp/out/` regenerated with `wasp build`).** Files: VPS only.
- [ ] **P1 (CC: 5 min) — Smoke test:** signup, login, OTP, listings page, lead feed. All return JSON not HTML.
- [ ] **P2 (CC: 2 min) — Add bundle-hash check to `deploy/build.sh`:** assert that the built bundle contains `REACT_APP_API_URL:"https://thehelper.ca"` before allowing `git commit`. Files: `deploy/build.sh`.

**Total:** ~45 min CC, blocks a launch-blocking bug.

## Deferred to TODOS.md
- Resend-code UX polish (have basic version after fix; full countdown/UX pass later).
- Review the uncommitted LandingPage design changes in main branch before next ship.
- `GET /health` 404 in the API container — Dockerfile HEALTHCHECK pings `/health` but Wasp doesn't expose it. Add a tiny health route or remove the HEALTHCHECK.

---

## AUTOPLAN DECISIONS

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|---|---|---|---|---|---|
| 1 | Eng | Add `/api/`, `/auth/`, `/operations/` proxy to web nginx | Mechanical | P1 (complete) | Traefik routes by hostname, not path — only web nginx can bridge them. | Alternative: change to cross-origin — rejected (CORS + CSP expansion) |
| 2 | Eng | Fix SignupPage to use `/auth/email/signup` | Mechanical | P1 (complete) | `/auth/signup` 404s the SPA, causing the JSON.parse error visible to users. | Alt: keep custom route — rejected (Wasp's built-in handles user creation + email verification together) |
| 3 | Eng | Rebuild bundle with `REACT_APP_API_URL=https://thehelper.ca` | Mechanical | P1 (complete) | Same-origin avoids CORS, works with new web nginx proxy. | Alt: cross-origin — rejected (more config, more failure modes) |
| 4 | Eng | Skip OTP SMS flow fix (GHL webhook stub) | Taste | P6 (action) | Current OTP path works; SMS-via-GHL is a follow-up, not a blocker for browser signup. | — |
| 5 | Design | Replace raw `JSON.parse` error with friendly message | Mechanical | P1 (complete) | Users see "Unexpected token '<', \"<!DOCTYPE \"… is not valid JSON" — bad UX. | — |
| 6 | Eng | Add bundle-hash guard to `deploy/build.sh` | Mechanical | P2 (boil lakes) | Same bug class bit us — add a 5-line check to fail fast next time. | — |

**No User Challenges.** No taste decisions surfaced at the gate (auto-decided).
