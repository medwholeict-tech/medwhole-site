# MedWHOLE Payload CMS

Payload 3 runs as a separate Next.js application on the existing Hostinger Business plan. It owns editorial content, persistent media metadata, private operational inboxes and donation records. Production editor: https://cms.medwhole.org/admin. See ../README.md for the full setup and deployment runbook.

Install with pnpm --dir cms install --frozen-lockfile --ignore-workspace. Copy env.sample to .env.local and configure a dedicated development database. Run pnpm --dir cms migrate, then pnpm cms:dev from the repository root. The local editor is http://localhost:3100/admin.

Use separate content_read, editor, operations, finance and website_service integration accounts. Keep PAYLOAD_DB_PUSH=false in production. The website authentication database is separate. Persistent uploads use the existing S3-compatible Neon Object Storage bucket.

Hostinger app settings: same GitHub repo/main, application root cms, Node 22, pnpm, build script build, output .next. Set the dedicated CMS DATABASE_URL, PAYLOAD_SECRET, S3 credentials, PAYLOAD_PUBLIC_SERVER_URL and CORS/CSRF origins in this app's environment. The root website points PAYLOAD_CMS_URL to this CMS origin.

The old Cloudflare Worker deployment is retired because of its Free plan CPU limit. OpenNext/Wrangler files remain optional tooling, not the current production release path. The manual GitHub Cloudflare workflow only builds artifacts.
