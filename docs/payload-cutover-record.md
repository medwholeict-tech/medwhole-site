# Payload cutover - 4 November 2026

The public website and Payload CMS now run as separate Node.js applications on the existing Hostinger Business plan. Cloudflare continues to manage authoritative DNS.

- Public website: https://www.medwhole.org
- Native CMS admin: https://cms.medwhole.org/admin
- Source: medwholeict-tech/medwhole-site, main; code baseline 25e682d.
- CMS app settings: root cms, Node 22, pnpm, build script build, output .next.
- Website app settings: repository root, Node 22, pnpm, build script build, output .next.
- Both applications use GitHub main auto-deployment. The manual Cloudflare workflow builds optional artifacts only.

## Data reconciliation

Preserved 39 existing pages, 26 media assets and global settings. Completed native rich text and details for 18 programmes, 4 events and 3 news articles. Imported and reconciled 26 contacts, 16 volunteer applications, 5 partnership applications, 4 donation intents and 1 incomplete event registration: 52 historical private records in total. The incomplete registration is archived without fabricated fields. Final source export after cutover still contains all 52 operational records. Repeated import creates no duplicates.

Verified all 26 persistent object-storage files against stored sizes. Mirrored eight already-public story images locally and verified original SHA-1 checksums. Media consent and alternative-text review flags remain unchanged.

## Verification

- 48 automated tests passed; website and CMS TypeScript checks and production builds passed.
- Fresh isolated schema installation verified 70 tables and 903 columns, then removed only its own empty verification schema in the same transaction.
- Production migration status confirms all three committed schema migrations have run. The historical development sentinel was removed only after expected schema and migration history were verified.
- All seven native Payload record types accepted controlled writes. Private details were checked directly for persistence and exact test records were removed.
- Website contact, volunteer, partnership and newsletter forms saved native Payload records successfully; their verification records were removed.
- Content-read and website-service keys cannot list private submissions; operations and finance access remain separated.
- Production homepage, news listing and migrated article rendered without browser console errors. Native CMS login and media endpoints returned HTTP 200.
- Website hosting environment has no retired CMS variables. Its CMS origin points to Hostinger. The former CMS and website Worker public endpoints are disabled.

## Operational notes

Native Payload and the website NextAuth portal use separate accounts. Existing CMS accounts and passwords were preserved. The CMS has no outbound email adapter configured; password-reset delivery remains a separate operational integration. Website notification email still uses Resend. No paid payment was initiated and no donor notification was sent during migration verification.

Private source exports, pre-change database backups and reconciliation reports remain outside Git under ignored migration working files. Transfer them to approved organizational backup storage. Historical source columns in migration SQL are retained for database compatibility; active application code, dependencies and environment use Payload.
