# MedWHOLE Payload service

This directory contains the separate Payload CMS application. It runs on
Next.js 15.4.11, which is supported by the pinned Payload release, independently
from the public Next.js 14 website. Public content remains on its current
sources until CMS import and verification are complete.

## Local setup

Install workspace dependencies with `pnpm install`, then copy `env.sample` to
`cms/.env.local` and provide private values. `DATABASE_URL` must point to the
dedicated Payload Neon database, not the public website's existing database.
Start the CMS from the repository root with `pnpm cms:dev`; it runs on port
3100. The Payload adapter uses the `medwhole_cms` schema within that dedicated
database. Configure durable S3-compatible storage for media before production.

Create the first administrator at `http://localhost:3100/admin`. The first
administrator account is bootstrap-enabled; later administrator creation is
restricted to an existing administrator. Create separate integration users:
`content_read` for public reads, `editor` for the custom admin, `operations`
for general submissions, `finance` for donation records, and
`website_service` for form submissions. Generate separate API keys for each.

The CMS package exposes Payload's migration CLI: use `pnpm migrate:create`
after completing schema changes, `pnpm migrate:status` to inspect migration
state, and `pnpm migrate` to apply pending migrations. Local development uses
the configured Postgres push mode; production must use checked-in migrations.
Do not use destructive commands such as `migrate:fresh` on any shared or
production database.

From the repository root, `pnpm cms:migrate-sanity` previews the editorial
import without writing. Once the database and editor API key are configured,
`pnpm cms:migrate-sanity -- --apply` imports records as drafts. Existing
records are skipped unless `--update-existing` is also explicitly supplied.

Never commit `.env.local`. The public website uses server-only
`PAYLOAD_CMS_URL`, `PAYLOAD_CMS_READ_API_KEY` and
`PAYLOAD_CMS_ADMIN_API_KEY`, `PAYLOAD_CMS_OPERATIONS_API_KEY`, and
`PAYLOAD_CMS_FINANCE_API_KEY`, plus `PAYLOAD_CMS_WEBSITE_API_KEY` for narrowly
scoped server-side submission/email writes; these keys must remain distinct. The website
will not expose private Payload records through public endpoints.

## Collection order

1. `media`
2. `pages`
3. `homepage` global
4. `programmes`, `events`, `news`, `communities`
5. `team-members`, `partners`, `resources`, `jobs`
6. private form and payment records

The first four are the editorial foundation. Operational records remain
private and are migrated only after email delivery, access control and retention
rules have been tested.
