# Worki Pro Neon Migration and Questionnaire Parity

**Status:** review spec; safe, reversible questionnaire persistence fix is implemented on `worki/neon-tayyari-parity`. Production migration, infrastructure changes, and the remaining runtime connection configuration are not authorized by this work.

## Outcome

Prepare TheHelper / Worki Pro to run its existing Wasp and Prisma marketplace against Neon without changing production data or adopting Tayyari's incompatible application stack. Preserve the current consumer, provider, auth, billing, OTP, and review behavior. Carry forward only questionnaire interaction patterns that fit home-service intake.

## Architecture comparison

| Concern | Worki Pro / TheHelper | Tayyari | Decision |
|---|---|---|---|
| Application | Wasp 0.21, React 19, Node/Express, Prisma 5 | Next.js 16 App Router, handwritten Postgres client and SQL | Keep Wasp and Prisma as canonical. Do not copy Next.js route handlers, SQL migrations, or packages into this app. |
| Database model | `schema.prisma` plus ordered Prisma migrations in `migrations/` | Ordered SQL files in `db/migrations/` | Use Worki's Prisma schema and migration history. Never apply Tayyari SQL to Worki. |
| Database access | Prisma via Wasp generated server/client | `postgres` client, pooled `DATABASE_URL_POOLED`, `prepare: false`; migration script prefers `DATABASE_URL_UNPOOLED` | Neon can serve PostgreSQL to Worki, but Worki needs its own Wasp/Prisma connection configuration and deployment validation. Tayyari's `prepare: false` is not a Wasp/Prisma setting to copy. |
| Authentication | Wasp email auth and custom email OTP endpoints; app session/user data in Worki's schema; `JWT_SECRET` participates in server auth | Neon Auth with separate Next.js server/client modules | Keep Wasp auth, existing user/session records, cookie/origin behavior, and `JWT_SECRET`. Do not introduce Neon Auth or change session format. |
| Intake | Service category, home-service qualifiers, job description, timing/location/contact, email OTP for guests | Event/wedding planner questionnaire and local-first plan builder | Reuse stable step identity, progress, draft recovery and completion feedback only after product/privacy choices. Map every retained answer to existing home-service fields. |

Tayyari's questionnaire is for event planning. Its questions, schemas, plan builder, account synchronization, SQL, and auth are not applicable to home services.

## Worki Pro evidence and current parity gap

- `src/consumer/GuestRequestWizardPage.tsx` presents service category, category qualifiers, job details and timing/location/contact. Guests then verify email; logged-in users skip that step.
- `src/consumer/components/wizard/StepQualifiers.tsx` uses `ServiceCategory.questions` when present and otherwise falls back to `src/consumer/categoryQualifiers.ts`. It stores answers and issue chips in the page's `WizardState`.
- `schema.prisma` already has `ServiceRequest.qualifierAnswers` (`Json?`) and `preferredTime`; no schema migration is needed to persist the current answers.
- Before this change, the submit action passed description, category, location, contact and urgency, but dropped `qualifierAnswers`, selected issue chips, `preferredTime`, and `smsConsent`. That meant the questionnaire was not in parity with the stored lead.
- `src/consumer/operations.ts` also contains `saveGuestRequest`, but the current `GuestRequestWizardPage` uses `submitServiceRequest`; the existing submit path is the correct single-write integration point. The OTP endpoint creates/verifies the user session before the action; it must remain a separate auth step.
- The server action already stores submitted SMS consent in `ServiceRequest.smsConsentGiven` and uses `ServiceRequest.qualifierAnswers`, so the implemented change writes into existing fields and does not alter the database schema.
- Current urgency in `StepDetails` is hard-coded to `FLEXIBLE`; keep the existing urgency mapping until Ali chooses urgency choices and requiredness. The free-form `preferredTime` is a separate scheduling hint.

## Tayyari patterns suitable for later use

Patterns observed in Tayyari's `src/components/planner/questionnaire.tsx` and planner draft helpers:

1. Give each logical step a stable ID; use it for restoration and branching rather than relying only on the step's array index.
2. Show a progress indicator derived from the active step and visible step count. Mark completion separately from the active step.
3. Restore a versioned local draft only when the entry context matches, and handle storage failures without blocking the questionnaire.
4. Persist after hydration, not during initial render, to avoid overwriting a saved draft with defaults.
5. Keep browser draft recovery distinct from creating a server-side lead. Final ServiceRequest creation remains on Worki's authenticated/verified action path.

For TheHelper, possible step IDs are `service`, `job_details`, `location_timing`, `contact`, and `email_verification`. Existing UI currently combines `location_timing` and `contact` into one details step. Reordering or splitting those steps needs UX approval and must keep guest and authenticated progress labels correct.

Do not persist contact name, email, phone, OTP code, or session tokens in localStorage. If local recovery is approved, persist only non-PII service-intake state (category, answers, description, issue chips, location only if approved, timing, current stable step ID) with a schema version, age limit, and an explicit clear-on-submit/clear-on-account-change policy. Account-backed drafts require a server-side draft model/API, access rules, expiry, and a product decision; do not reuse Tayyari's browser-to-account sync implementation.

## Preserved marketplace invariants

- `getPublicLeadFeed` must continue to mask `name`, `phone`, and `email` until a verified provider successfully claims the lead.
- `claimLead` remains restricted to `Provider.verificationStatus === VERIFIED`; the atomic assignment and fee write remain a single transaction, and retries by the same provider remain idempotent.
- OTP rate limits, expiration, attempt limits, hashed SMS OTP storage, email OTP/session behavior, and origin checks remain intact.
- Reviews remain tied to the consumer's completed assigned request, one per `serviceRequestId`, and moderation continues to control published ratings.
- No new intake persistence path may create a second ServiceRequest or bypass existing validation, rewards, GHL logging, or rate limits.

## Neon connection design

Worki currently has one Prisma datasource URL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Target design after deployment compatibility is resolved:

- `DATABASE_URL`: Neon pooled endpoint for long-lived Wasp API runtime and background jobs. Use the exact URL and parameters generated for the Neon pooler; confirm Prisma 5 and Wasp 0.21 behavior under Neon's transaction pooler. Keep runtime connections bounded for the number of API replicas.
- `DIRECT_URL`: Neon unpooled endpoint for Prisma CLI schema/migration/admin operations and `pg_dump`/`pg_restore`. Prisma 5 supports `datasource.directUrl`; validate that Wasp 0.21 preserves it in `.wasp/out/db/schema.prisma` before enabling it.
- Never send `pg_dump`, `pg_restore`, or production migrations through the pooled endpoint. Neon documents transaction pooling and recommends direct endpoints for migrations and dump/restore workflows.
- Do not put either URL in client environment variables, committed files, task bodies, CI logs, or runtime diagnostic output. Store them only in the selected hosting platform's server-side secrets and approved operator secret storage.
- For local development, both URLs may point to the same local Postgres database. Do not require a Neon credential for `wasp start db`.
- `DATABASE_URL` and `DIRECT_URL` must address the same database/schema during migration. Treat switching only one as a release-blocking configuration error.

**Current implementation blocker:** `.wasp/out/db/schema.prisma` is generated by Wasp and currently has no `directUrl`. The checked-in `docker-compose.yml` passes only `DATABASE_URL`; its API service says Prisma migrations are skipped because the database is already migrated and migration files are stale. Other repo docs describe `prisma migrate deploy`, and `docs/gstack/ship-plan-2026-06-14.md` says Coolify + Neon. The manual `.github/workflows/deploy.yml` instead targets a Tailscale-reached VPS and `main`. These are conflicting deployment sources. Adding a required `DIRECT_URL` to the Prisma datasource now could make deployed migration commands or startup fail. Resolve the real deployment owner/runbook and prove generated-schema/runtime behavior in a disposable environment before changing datasource or deployment configuration.

## Schema and migration parity

1. Before any migration, inspect the live source database's PostgreSQL version, extensions, schemas, table/sequence inventory, constraints, indexes, row counts, and `_prisma_migrations` records. Do not infer these from checked-in files.
2. Compare the live schema and migration checksums with the exact source commit's `schema.prisma` and `migrations/`. Resolve drift explicitly. Do not use `prisma db push --accept-data-loss` for this production move.
3. Confirm Wasp-generated `.wasp/out/db/schema.prisma`, migration paths and Prisma CLI version from a clean build. Check that the deployed container includes the same migration directory and migration lock file.
4. Restore the complete PostgreSQL dump into the approved Neon target before running pending migrations. If migration history was never maintained or is stale, create and rehearse a formal baseline/reconciliation plan; do not mark migrations applied by assumption.
5. Compare source and restored row counts by table; verify key uniqueness, foreign keys, indexes, sequence values, and representative User, Provider, ServiceRequest, ProviderFee, Review, OTP, reward, appointment, and webhook data. Do not export raw PII into logs or the task record.
6. Run `prisma migrate status` and review generated SQL against a disposable restored copy. Apply only reviewed migrations to staging first, with direct connection. Verify data and the critical marketplace flows after each schema change.

## Backup and import rehearsal

- Ali/operator must confirm source Postgres host/ownership, database name, maintenance window, Neon organization/project/region, retention requirements, and approved access role.
- Take an encrypted, access-controlled pre-migration backup from the unpooled source endpoint. Record dump checksum, source timestamp/version, tool version, and secure backup location outside the repo/Notion. Verify the dump can be read and restore it into a disposable database before the migration window.
- Use PostgreSQL `pg_dump` custom format and `pg_restore` against direct/unpooled connections. Restore with explicit ownership/privilege handling appropriate to Neon roles, then compare the restored result against the source inventory and counts.
- Select a Neon plan/history window that meets the business recovery objective. Neon PITR/history is not a substitute for an independently retained and tested export when business continuity requires one.
- Rehearse restore duration, post-restore validation, and application smoke checks on a non-production target. Estimate downtime from the measured restore and validation, not from a guess.

## Cutover and rollback

### Before cutover

- Resolve the deployment target conflict and identify one source of truth for the running production API, migration command, deploy trigger, web/API URLs, env ownership, and rollback procedure.
- Rehearse full import and a restore from the retained backup. Confirm Neon region, access, SSL, backup/PITR retention, connection budget, and monitoring with Ali.
- Confirm current source and Neon schemas/migration histories match; freeze schema changes for the cutover window.
- Record counts, checksums, representative record checks, and a no-PII smoke-test plan. Capture current server env values securely for rollback without copying secrets into this repo.

### Cutover

1. Announce maintenance and stop new writes at the application boundary. Do not run two writable databases or dual-write.
2. Take the final source backup using the direct source URL; record timestamp and checksum.
3. Restore into the approved Neon database using the rehearsed process. Verify schema, rows, sequences, migration history, constraints and counts before pointing any app at it.
4. Configure pooled `DATABASE_URL` for runtime and direct `DIRECT_URL` for migrations in the verified deployment system. Keep `JWT_SECRET`, cookie/session settings, auth URLs, CORS/origin allowlists, and API/web domains unchanged.
5. Run reviewed pending migrations on the direct URL, then start one API instance against Neon and verify DB health and read/write checks with controlled test records. Confirm email OTP/session, guest request intake, lead-feed masking, provider claim/fee idempotency, messages, review authorization/moderation, rewards, and webhook logging.
6. Re-enable traffic only after owner/operator signs off on validation evidence and the rollback decision window.
7. Keep the old source database intact and read-only through the agreed observation period. Do not delete it as part of cutover.

### Rollback

- If validation fails before writes resume, stop the new API, restore the previous server-side connection setting to the source database, restart the verified previous app build, and prove health plus a controlled read/write.
- If production writes have reached Neon, do not simply repoint the app to the old source: that would lose post-cutover writes. Freeze writes again, take a Neon backup, reconcile or restore post-cutover changes using a pre-agreed recovery procedure, verify counts and critical records, then re-open traffic.
- Keep the source database available until Ali approves decommissioning separately. Do not destroy or modify source data in this implementation branch.

## Auth and session compatibility

- Preserve Worki's Wasp auth provider and auth tables/records in the same schema restore. Neon is a PostgreSQL host here, not an auth replacement.
- Keep `JWT_SECRET` stable during migration and do not change cookie domain, secure/same-site settings, web/API hostnames, CORS origin, or email OTP logic in the same release. A secret or origin change may invalidate sessions or block requests.
- Verify existing sessions and logged-in users can still authenticate after connecting to the restored database. Test logout/re-login, guest email OTP, signup and password reset against staging before cutover.
- Do not migrate or copy Tayyari Neon Auth identities/tables/tokens to Worki.

## Questionnaire to home-services mapping

| Intake need | Current source | Worki persistence |
|---|---|---|
| Service category | `categorySlug` / selected category | `ServiceRequest.serviceCategoryId` resolved by slug |
| Home-service qualifiers | `qualifierAnswers` from DB questions or `categoryQualifiers.ts` | `ServiceRequest.qualifierAnswers` JSON |
| Selected issue chips | `detailChips` | `ServiceRequest.qualifierAnswers.selectedDetailChips` |
| Job scope | `description` | `ServiceRequest.description` (existing server validation/sanitization) |
| Urgency | current selection maps TODAY / THIS_WEEK / FLEXIBLE to EMERGENCY / STANDARD / PLANNED | `ServiceRequest.urgency`; current step defaults to FLEXIBLE pending product choice |
| Schedule hint | `preferredTime` free text | `ServiceRequest.preferredTime` |
| Postal location | Canadian postal code | `ServiceRequest.postalCode` |
| Contact identity | first name, email and optional phone | `ServiceRequest` PII fields; still masked from public provider lead feed until claim |
| SMS consent | explicit checkbox | `ServiceRequest.smsConsentGiven` and existing user consent fields |
| Media/access/property details | Not part of current guest wizard | Add only after an explicit field/schema and privacy decision; no event-planning fields |

## Product decisions needed before draft recovery or question expansion

1. Should drafts survive refresh only in the same browser, or should customers recover them across devices through a server-side draft account? The local-only and account-backed designs have different privacy, auth, expiry and data-model requirements.
2. Which non-PII fields may be saved in localStorage, especially postal code and free-form job description, and for how long? Contact data and OTP must never be stored there.
3. Which home-service details are required globally or by category: property type, own/rent, access constraints, photo upload, desired timing, and urgency? Current qualifier config varies by category and most questions are optional.
4. Should service requests without a phone remain valid when email OTP succeeds? Current details UI treats phone as optional and OTP verifies email; this changes provider contact expectations and SMS follow-up capability.
5. Confirm urgency choices and labels. `StepDetails` currently forces `FLEXIBLE`, while `preferredTime` is free text and urgency filtering exists on provider leads.

Until those choices are made, retain the current steps and question requirements, and do not add localStorage persistence or new required intake fields.

## Verification plan

### Code and schema checks (local/review branch)

- `wasp build`; verify generated schema/migrations and API/client operation generation.
- `npx tsc --noEmit`.
- Run targeted Playwright request-wizard and lead-feed/claim/review regressions with a disposable Postgres database and deterministic email/SMS/webhook mocks.
- Assert submitted `qualifierAnswers`, selected issue chips, preferred time and SMS consent are present on the created ServiceRequest; assert category, description, postal code, urgency and user/session behavior remain correct.
- Assert public provider feed response contains no name/email/phone before claim; verified-provider claim reveals the correct contact fields, creates exactly one fee, and a same-provider retry creates no extra fee.
- Exercise OTP rate limits/expiry and one-review-per-serviceRequestId after the schema/data restore rehearsal.
- Validate pooled runtime and direct Prisma migration connections against a disposable Neon database with the exact Wasp-generated output and deployment image before production config changes.

### Staging and human gates

- Rehearse full dump/restore, migration-status review, backup restoration, environment switch, smoke checks and rollback against a staging clone.
- Ali approves product choices above and the downtime/recovery objective.
- Ali/operator approves Neon project/region/plan/access, source backup location, data retention, and allowed migration window.
- Infra owner confirms which deploy system is authoritative and updates its server-only env configuration. This PR does not modify VPS/Coolify/Vercel settings, GitHub secrets, Neon resources, production database data, DNS, or deployment state.
- A human reviews the schema/config change and PR before any production action. Production cutover, app deploy, data import, source changes, and database deletion need separate explicit approval.

## Reference documentation

- [Neon connection pooling](https://neon.com/docs/connect/connection-pooling) — Neon transaction pooling and direct-versus-pooled use cases.
- [Neon Postgres import with `pg_dump`/`pg_restore`](https://neon.com/docs/import/migrate-from-postgres) — use a direct endpoint for dump/restore and align PostgreSQL client versions.
- [Neon backups](https://neon.com/docs/postgres/backup-restore/backups) — history/PITR and independent dump options.
- [Prisma 5 data source `directUrl`](https://www.prisma.io/docs/orm/v5/reference/prisma-schema-reference#datasource) — separate direct URL support in this repo's Prisma generation line.
- Tayyari read-only references: `src/server/db.ts`, `scripts/migrate-admin.mjs`, `src/components/planner/questionnaire.tsx`, `src/lib/planner-draft.ts`, `src/data/event-config.ts`, and `db/migrations/013_assistance_requests.sql` in `/Users/ali-mac/Code/tayyari-2026`.
