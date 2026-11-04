# MedWHOLE website and Payload CMS

The public Next.js website runs on Hostinger. Payload is the only active CMS and the primary store for editorial content, public form submissions, donation intents and payment records. The Payload admin application runs as a separate Hostinger Node.js website. Cloudflare manages authoritative DNS; Hostinger serves the website and TLS.

## Services and routes

| Service | Location | Purpose |
|---|---|---|
| Public website | https://www.medwhole.org | Public pages, forms, server-side CMS requests |
| Apex domain | https://medwhole.org | Redirect to canonical www website |
| Website admin | /admin | Existing NextAuth portal; /admin/content opens Payload, /admin/submissions exposes permitted inboxes |
| Payload editor | https://cms.medwhole.org/admin | Native content editor, media and administrative collections |
| Old editor bookmark | /studio | Redirect to /admin/content |
| CMS database | Dedicated Neon PostgreSQL, medwhole_cms schema | Content, CMS administrators, submissions, donations, versions |
| Website database | Separate Neon connection | Existing NextAuth administrator identity; not a second CMS |
| Media | Neon Object Storage via S3-compatible adapter | Persistent CMS uploads |

## Clone and install

Use Node.js 22 and pnpm 10.33.2. On Windows use pnpm.cmd if PowerShell blocks script execution.

~~~sh
git clone https://github.com/medwholeict-tech/medwhole-site.git
cd medwhole-site
corepack enable
corepack prepare pnpm@10.33.2 --activate
pnpm install --frozen-lockfile
pnpm --dir cms install --frozen-lockfile --ignore-workspace
~~~

Root and cms have separate package manifests and lockfiles. Install both.

## Local environments

Copy env.sample to .env.local and cms/env.sample to cms/.env.local. Obtain real values from the project owner through a private channel. Never commit environment files, source exports, credentials or personal submissions. Use separate development databases and buckets. Production credentials are not a local development template.

The root DATABASE_URL belongs to the website identity database. The CMS DATABASE_URL belongs to the dedicated Payload database. Do not swap them. Configure local CMS URL http://localhost:3100 in the website and local website origin http://localhost:3000 in CMS CORS/CSRF. PAYLOAD_SECRET must be stable for a given CMS installation.

~~~sh
pnpm --dir cms migrate
pnpm cms:dev
# In a second terminal
pnpm dev
~~~

On an existing database inspect migration status and take a backup first. A historical dev migration marker can make Payload CLI propose a schema reset: decline it and reconcile migration history against the actual schema. Never approve a production reset. PAYLOAD_DB_PUSH stays false in production. Create the first CMS administrator at /admin/create-first-user on a fresh database. Create separate integration users and enable API keys with roles: content_read, editor, operations, finance and website_service. Copy each key to its matching server-side website variable. These are not browser credentials. The website portal uses its own NextAuth administrator; pnpm admin:create manages that identity.

## Environment reference

See env.sample and cms/env.sample. Website read, editor, operations, finance and submission keys have separate privileges. PAYLOAD_CMS_ADMIN_API_KEY is the editor integration, not a shared human password. RESEND_API_KEY and EMAIL_FROM configure website notifications. PAYSTACK_SECRET_KEY enables payments; configure the verified webhook endpoint /api/payments/webhook with Paystack. Never test by charging real cards. ImageKit variables support the existing optional upload helper and static image delivery. They do not replace Payload media storage.

## Content and inbox workflow

Edit and publish in the native Payload admin. Drafts are not public. Published content normally revalidates on the website after about 60 seconds. Media requiring consent or alternative-text review must be reviewed before publishing. Existing approved website imagery is also stored in public/images; imported public story images are mirrored in public/images/content and have no dependency on the retired CMS CDN.

Contact, volunteering, partnership, newsletter, event registration and donation intent routes save directly to Payload. Payment initialization, verification and recurring-charge reconciliation use the private donation-payments collection. Failed persistence must fail the request; it must not acknowledge an unsaved submission. Operations and finance inboxes require their own integration keys. Anonymous users and content readers cannot list private submissions.

## Checks

~~~sh
pnpm exec vitest run
pnpm exec tsc --noEmit
pnpm build
pnpm --dir cms build
~~~

The website build configuration currently skips Next.js lint/type checking; run the explicit checks above. This repository's verify command runs tests and the production website build. The public build must use a reachable Payload CMS with valid read credentials.

## Deployment and CI/CD

Both applications run on the existing Hostinger Business plan and use the same GitHub repository, main branch. The public website root is the repository root; the CMS application root is cms. Each has its own environment variables, build logs and process. Node.js is 22, package manager pnpm, build script build, output .next. A GitHub push to main triggers each connected auto-deployment. Verify both build results in Hostinger; a successful Git push alone is not a successful release.

CMS application: https://cms.medwhole.org/admin. The cms CNAME in Cloudflare points to cms.medwhole.org.cdn.hstgr.net (DNS only); Hostinger serves the CMS and its HTTPS certificate. The main domain remains on Cloudflare DNS and points to Hostinger. CMS DATABASE_URL connects directly to its dedicated Neon database; CMS uploads use the existing persistent object-storage bucket. Set PAYLOAD_PUBLIC_SERVER_URL to https://cms.medwhole.org and set the website PAYLOAD_CMS_URL to the same origin. PAYLOAD_PREVIOUS_HOST identifies the former CMS hostname for permanent redirects; leave it empty during local development.

For schema changes: back up, apply reviewed additive migrations and release the compatible CMS before the website that requires those fields. For coordinated releases, use a feature branch for the CMS build first, verify it, then promote that tested commit to main. scripts/deploy-production.ps1 verifies the clean main checkout before pushing; it does not monitor both hosting jobs automatically.

.github/workflows/cloudflare-build.yml is a manually dispatched artifact build for the retired optional Workers deployment. It does not deploy either active Hostinger application. Worker configs and build helpers remain available for a deliberate future platform change; Cloudflare Workers is not the active CMS runtime. No paid Workers plan is required for the current architecture. Run the normal pnpm build / pnpm --dir cms build checks for Hostinger releases.

Cloudflare's Free Worker CPU limit caused intermittent error 1102 in the native CMS admin, so the Payload runtime moved to existing Hostinger capacity. After cutover, the old Worker endpoints are disabled. This change does not affect Cloudflare's authoritative DNS role. Preserve unrelated mail and subdomain records.

## Backup and recovery

Back up the CMS database (including versions and administrators), website identity database and object-storage bucket. Keep credentials in a private vault. Restore into a separate database before switching a service connection. Roll back a website using the previous known-good Git commit and Hostinger deployment; roll back a CMS using its previous Hostinger deployment only if compatible with the current additive schema. Do not run destructive down migrations to undo imported records.

## Migration record

scripts/migrations/payload-only-data.mjs is a one-time, repeatable offline export importer. It previews by default, requires --source with a private NDJSON export, and writes only with --apply. It preserves original identifiers, raw operational details, native rich text and existing editorial edits. The November 2026 cutover imports 25 editorial records and 52 historical inbox records, alongside the pre-existing 39 pages and 26 CMS media assets. The incomplete historical registration remains archived. Source backups and reconciliation reports belong in private storage, not Git. Historical database migration files retain original column names for upgrade/rollback compatibility; current application code and dependencies use Payload only.
