
## 1. Technical handover

Setup, environments, content ownership, CI/CD, deployment and recovery.

> Current architecture: Public website and Payload CMS run as separate Hostinger Node.js applications. Cloudflare manages DNS. Payload is the only active CMS.

| Document control | Value |
| --- | --- |

| Edition | 3.0 - Security and operator onboarding |

| Date | 4 November 2026 - Africa/Lagos |

| Source revision | 3ec4fe1 |

| Repository | github.com/medwholeict-tech/medwhole-site |

| Confidentiality | Operational handover; secret values and personal submissions excluded. |

This edition supersedes the earlier handover. Follow this document and the repository README for the active setup.


## 2. Contents

| Page | Topic |
| --- | --- |

| 3 | Architecture and request flow |

| 4 | Services and repository map |

| 5 | Clone and install |

| 6 | Website environment |

| 7 | CMS environment |

| 8 | Local setup and administrator accounts |

| 9 | Editorial publishing and media |

| 10 | Forms, donations and private records |

| 11 | Database migrations and cutover |

| 12 | CI/CD explained |

| 13 | Release the CMS |

| 14 | Release the website |

| 15 | DNS and HTTPS |

| 16 | Verification and troubleshooting |

| 17 | Backup and recovery |

| 18 | Operations and ownership |

| 19 | New maintainer: Git identity |

| 20 | SSH access on a new workstation |

| 21 | HTTPS, tokens and account switching |

| 22 | Review, push and release safely |

| 23 | Wrangler login on a new workstation |

| 24 | Cloudflare tokens and CI access |

| 25 | Codex, Claude Code, VS Code and CLI |

| 26 | Operator handoff and troubleshooting |

Commands assume the repository root unless a working directory is stated. On Windows, use pnpm.cmd when the execution policy blocks pnpm.ps1. Use a separate development database and bucket.


## 3. Architecture and request flow

The website makes server-side requests to Payload with separate role-specific API keys. Browsers submit forms to the website API, which validates input and saves a native Payload record. Credentials remain on the server.

The website portal at /admin uses NextAuth. Its content links open the native Payload editor, which has its own CMS identity. The two databases and identities serve different purposes.

The old Cloudflare Worker runtime is retired because its Free CPU limit produced error 1102. Cloudflare continues to provide DNS. The main site is not deployed through Wrangler.


## 4. Services and repository map

| Service | Location / ownership |
| --- | --- |

| Public site | https://www.medwhole.org - Hostinger |

| Apex domain | https://medwhole.org - redirect to canonical www |

| Native Payload editor | https://cms.medwhole.org/admin |

| Website portal | /admin/login; /admin/content; /admin/submissions |

| Old editor bookmark | /studio redirects to /admin/content |

| Source control | GitHub medwholeict-tech/medwhole-site, main |

| Website DB | Dedicated website DATABASE_URL; NextAuth administrator identity |

| CMS DB | Dedicated CMS DATABASE_URL; medwhole_cms schema |

| Media | Neon Object Storage through the Payload S3 adapter |

| Email / giving | Resend notifications; optional Paystack payments |

### Repository orientation

| Path | Purpose |
| --- | --- |

| app/; components/ | Website routes, forms, layouts and admin handoff |

| lib/cms/ | Payload client, queries, media and payment persistence |

| cms/ | Independent Next.js + Payload application and lockfile |

| cms/src/collections/ | Content, media, administrators and private inbox definitions |

| cms/src/migrations/ | Reviewed schema upgrade history and snapshots |

| env.sample; cms/env.sample | Sanitized local configuration templates |

| scripts/; __tests__/ | Release helpers, one-time importer and regression tests |


## 5. Clone and install

Install Git, Node.js 22 and pnpm 10.33.2. Obtain repository access and the approved development configuration from the project owner. The CMS has its own pnpm workspace, package manifest and lockfile.

```
git clone https://github.com/medwholeict-tech/medwhole-site.git
cd medwhole-site
corepack enable
corepack prepare pnpm@10.33.2 --activate
pnpm install --frozen-lockfile
pnpm --dir cms install --frozen-lockfile --ignore-workspace
```

### Create local configuration

```
# PowerShell
Copy-Item env.sample .env.local
Copy-Item cms/env.sample cms/.env.local

# Linux / macOS
cp env.sample .env.local
cp cms/env.sample cms/.env.local
```

Populate each file privately. The website DATABASE_URL is not the CMS DATABASE_URL. Do not paste production values into the repository, tickets, screenshots or this handover. Environment files and private migration exports are ignored by Git.

### Version baseline

| Component | Version |
| --- | --- |

| Website | Next.js 15.5.29; React ^19.3.1; NextAuth 5.0.0-beta.32 |

| CMS | Payload 3.91.0; Next.js 15.4.11; React 19.1.1 |

| Runtime / package manager | Node 22; pnpm 10.33.2 |

Use frozen lockfiles for reproducible deployment. Change dependency versions in a reviewed branch and verify both applications.


## 6. Website environment

```
DATABASE_URL=postgresql://website_user:replace-me@localhost/website
NEXTAUTH_SECRET=replace-with-a-long-random-secret
AUTH_SECRET=replace-with-the-same-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_DIST_DIR=.next
ADMIN_EMAIL=admin@example.com
PAYLOAD_CMS_URL=http://localhost:3100
PAYLOAD_CMS_PUBLIC_ENABLED=true
PAYLOAD_CMS_READ_API_KEY=
PAYLOAD_CMS_ADMIN_API_KEY=
PAYLOAD_CMS_OPERATIONS_API_KEY=
PAYLOAD_CMS_FINANCE_API_KEY=
PAYLOAD_CMS_WEBSITE_API_KEY=
RESEND_API_KEY=
EMAIL_FROM=info@example.com
PAYSTACK_SECRET_KEY=
```

| Variable group | Meaning |
| --- | --- |

| DATABASE_URL | Website identity database. Never point this at the CMS schema. |

| NEXTAUTH_SECRET / AUTH_SECRET | Website session and signed anti-bot token secret. Retain stable production values. |

| URL variables | Use https://www.medwhole.org for production website URLs. CMS URL is the separate CMS origin. |

| Five Payload keys | Content read, editor, operations, finance and write-only website integration. No NEXT_PUBLIC prefix. |

| Email / Paystack | Website notifications and optional payment integration; obtain test credentials for development. |

Optional ImageKit variables remain in env.sample for the existing helper. They do not replace Payload object storage. Only public identifiers belong in NEXT_PUBLIC variables.


## 7. CMS environment

```
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3100
PAYLOAD_SECRET=replace-with-a-long-random-secret
DATABASE_URL=postgresql://cms_user:replace-me@localhost/cms
PAYLOAD_DB_PUSH=false
PAYLOAD_CORS_ORIGINS=http://localhost:3000
PAYLOAD_CSRF_ORIGINS=http://localhost:3100,http://localhost:3000
S3_BUCKET=development-bucket
AWS_ENDPOINT_URL_S3=
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_FORCE_PATH_STYLE=true
```

For production, PAYLOAD_PUBLIC_SERVER_URL is https://cms.medwhole.org. Set CORS to the actual website origins and CSRF to the CMS origin plus authorized website origins. Keep PAYLOAD_DB_PUSH=false. Hostinger connects directly to the dedicated CMS Neon DATABASE_URL; no Hyperdrive binding is needed.

| Setting | Operational rule |
| --- | --- |

| PAYLOAD_SECRET | Stable CMS session/encryption secret. Transfer through a private vault. |

| CMS DATABASE_URL | Dedicated database and medwhole_cms schema. Back up before migration. |

| S3 credentials | Existing Neon Object Storage endpoint, bucket and access pair. Keep the entire set consistent. |

| Persistent uploads | Required for production. Local filesystem media is only suitable for disposable development. |

| CORS / CSRF | Comma-separated exact origins, with HTTPS production values. No wildcard needed. |

> Separate configuration: Configure the website and CMS in their own Hostinger application settings. Updating one application environment does not update the other.


## 8. Local setup and administrator accounts

Use new development databases and a development media bucket. For an empty CMS database, the committed migrations establish the schema. Check migration status before running against any populated database.

```
pnpm --dir cms migrate:status
pnpm --dir cms migrate
pnpm cms:dev
# In a second terminal, repository root
pnpm dev
```

Open http://localhost:3100/admin for Payload and http://localhost:3000 for the website. On a fresh CMS, create the first administrator at /admin/create-first-user. Existing production CMS accounts remain in the migrated database.

### Provision integration accounts

| Role | Website variable / purpose |
| --- | --- |

| content_read | PAYLOAD_CMS_READ_API_KEY - published content |

| editor | PAYLOAD_CMS_ADMIN_API_KEY - content integration |

| operations | PAYLOAD_CMS_OPERATIONS_API_KEY - private operational inboxes |

| finance | PAYLOAD_CMS_FINANCE_API_KEY - intents and payment records |

| website_service | PAYLOAD_CMS_WEBSITE_API_KEY - public submission creation |

Enable API keys on separate integration users. Do not use a human administrator password as an API key. Human administrators manage roles and accounts; contributors can create drafts but cannot publish.

### Website portal identity

The website portal uses its existing NextAuth database. pnpm admin:create provisions that separate identity. A website portal login is not automatically a Payload login. /admin/content clearly hands off to the CMS editor.

> Populated databases: If Payload warns that a dev-mode push occurred and offers a destructive reset, decline. Inspect the actual schema and migration history. Do not reset production to make a command pass.


## 9. Editorial publishing and media

- Open the native Payload /admin editor and select the appropriate collection or global.

- Edit a draft, preview the content and publish when approved. Published changes normally appear after about 60 seconds of website revalidation.

- Use Pages for approved page content; Programmes, Events and News for their respective records; Homepage, Navigation and Site Settings for global values.

- Use the native content rich-text field for new long-form text. Imported article and event formatting is converted to Lexical.

- Review alt text and consent before publishing a media asset. Migration review flags remain intact; they were not automatically approved.

### Images and durable storage

All 26 imported CMS media objects are present in persistent object storage. Eight images already used by public event/news stories are additionally mirrored in public/images/content with original checksums verified. This preserves their existing public appearance while CMS consent and alt-text review remains explicit.

For new content, select a published, permitted Payload media asset. The website resolves native /api/media/file URLs against the CMS origin. Changing the CMS origin must therefore include website configuration and media checks.

### Access boundaries

Anonymous and content-read requests see published editorial content. Editorial source snapshots are private to editors. Operations and finance records are not public. The website service account can create submissions but cannot list the private inboxes.

Some layout and approved fallback copy remains versioned in the website source. This is repository content, not another CMS. A code-only visual change still needs a website deployment.


## 10. Forms, donations and private records

| Website route | Payload collection / behavior |
| --- | --- |

| /api/contact | contact-submissions - native record ID returned after persistence |

| /api/volunteer | volunteer-applications - structured fields and details |

| /api/partnership | partnership-applications - organisation and contact details |

| /api/newsletter/subscribe | newsletter-subscribers - unique email; active/unsubscribed lifecycle |

| /api/event-registration | event-registrations - native event relationship and form data |

| /api/donation-intent | donation-intents - reference, donor details and email status |

| /api/payments/initialize | donation-payments - pending record before provider initialization |

| /give/complete; payment webhook | Verified amount, currency, donor and reference; recurring reconciliation |

Validation, anti-bot checks and rate limiting run at the website layer. A failed primary write must return an error rather than report an unsaved submission as successful. REST create/update responses are unwrapped to native documents before using their IDs.

### Email and payment setup

Website notifications use Resend with RESEND_API_KEY and EMAIL_FROM. Configure the Paystack webhook at /api/payments/webhook and retain signature verification. Use provider test credentials in development. Migration verification did not charge cards or send donor notifications.

The native CMS currently has no outbound email adapter; its password-reset email delivery must be configured separately before relying on that feature. Existing credential-based login remains available.

### Inbox management

Website /admin/submissions provides authorized inbox views. Native Payload also manages these collections. Operations can read operational submissions; finance can read donations. Internal notes and imported raw details remain private.


## 11. Database migrations and cutover

The cutover preserves the existing 39 pages, 26 media assets and global settings. It completes 25 editorial records: 18 programmes, 4 events and 3 news articles. It imports 52 historical operational records: 26 contacts, 16 volunteers, 5 partnerships, 4 donation intents and 1 incomplete event registration.

The incomplete registration is archived with its original raw fields. No missing event, contact name or email was invented. Operational drafts are included because they can contain unique submissions. Editorial drafts do not override current native edits.

### Migration implementation

- cms/src/migrations/20261104_160000_payload_only.ts adds fields and preserves older physical columns for compatibility. The matching JSON snapshot records the current expected schema.

- scripts/migrations/payload-only-data.mjs previews by default and applies only with --apply and a private offline NDJSON export.

- Original IDs populate indexed externalId/sourceId fields for reconciliation and repeatability. Existing native editorial details are not overwritten.

- The importer preserves raw private details, converts supported rich text and verifies original public image checksums. A repeat import does not create duplicate submissions.

```
# Preview the private offline export
pnpm cms:migrate-content --source /private/export.ndjson
# After reviewed backup and schema upgrade
pnpm cms:migrate-content --source /private/export.ndjson --apply
```

An initial original-asset download may require MIGRATION_ASSET_TOKEN; this is a one-time importer input, not a website or CMS runtime variable. Keep exports, backups and reconciliation reports outside Git. Final source reconciliation should be performed after website cutover to include any last submissions.

> Recovery rule: Do not delete the source account or run destructive down migrations as part of routine rollback. Retain private offline backups according to the owner retention policy.


## 12. CI/CD explained

CI checks whether a revision builds and behaves as expected. CD releases it to hosting. In this setup Hostinger performs the active build and deployment after a connected GitHub branch changes. There are two separate Node.js applications, not one shared runtime.

| Trigger / stage | Actual behavior |
| --- | --- |

| Local checks | Tests, explicit TypeScript checks and production builds run before a release. |

| GitHub push to main | Triggers Hostinger auto-deployment for each connected application. |

| Website Hostinger build | Repository root; pnpm install; build script build; .next output. |

| CMS Hostinger build | Application root cms; independent pnpm workspace; build script build; .next output. |

| Production verification | Check both hosting build statuses, native CMS admin, content reads, media and public forms. |

| Cloudflare GitHub workflow | Manual workflow_dispatch; builds optional OpenNext artifacts only. It does not deploy active Hostinger applications. |

### Safe release order

For a CMS schema change: back up, apply a reviewed compatible migration, deploy the CMS, verify it, then release the website that needs the new fields. Use a feature branch for the CMS first when coordination is required; promote the verified commit to main afterwards.

A successful Git push is not proof of deployment. Follow the Hostinger build through completed status and verify the actual URL. A failed build must be investigated before declaring the release complete.

The current repository does not have an automatic push/PR test gate in the manual Cloudflare artifact workflow. Run the documented checks explicitly. Next.js website build ignores type/lint errors, so the separate type check matters.


## 13. Release the CMS

| Hostinger setting | Value |
| --- | --- |

| Application | Separate Node.js website on existing Business plan |

| Repository / branch | medwholeict-tech/medwhole-site / main |

| Root directory | cms |

| Node / package manager | 22 / pnpm |

| Build script / output | build / .next |

| Public CMS origin | https://cms.medwhole.org |

| Database / media | Dedicated Neon DATABASE_URL and existing S3-compatible bucket |

- Confirm the release revision and take a CMS database backup before any schema change.

- Set the CMS application environment, including PAYLOAD_PUBLIC_SERVER_URL, PAYLOAD_SECRET, DATABASE_URL, S3 values and exact origins.

- Apply only reviewed migrations. Never enable PAYLOAD_DB_PUSH in production.

- Build the selected branch in Hostinger. cms/pnpm-workspace.yaml ensures dependencies are installed in the CMS instead of the parent website.

- Wait for completed, then verify /admin/login, published collections, private access and at least one native media URL.

- Retain the previous compatible deployment for rollback. Update the website CMS origin only after the replacement is ready.

### Optional Worker tooling

OpenNext and Wrangler files remain in the repository for a deliberate future hosting change. They are not the active release path. The former Worker endpoints are retired after successful cutover. No paid Cloudflare Workers subscription is required for the Hostinger architecture.


## 14. Release the website

| Hostinger setting | Value |
| --- | --- |

| Domain | medwhole.org; canonical public URL https://www.medwhole.org |

| Repository / branch | medwholeict-tech/medwhole-site / main |

| Root directory | Repository root |

| Node / package manager | 22 / pnpm |

| Build script / output | build / .next |

| NEXT_DIST_DIR | .next |

| PAYLOAD_CMS_URL | https://cms.medwhole.org |

```
pnpm exec vitest run
pnpm exec tsc --noEmit
pnpm build
# Commit reviewed changes, then push main
git push origin main
```

scripts/deploy-production.ps1 is the existing Windows release helper. It checks a clean main checkout and pushes to GitHub. Hostinger then builds the connected website. Monitor the provider job separately.

- Verify that all five server-side Payload API keys are present and point to the intended roles.

- Confirm website canonical URLs; keep NEXT_DIST_DIR=.next in the hosting environment.

- Wait for the build to complete, then test the apex redirect, homepage, news/event detail, media and admin handoff.

- Check contact/newsletter persistence with controlled test data and remove only the specific verification records afterwards.

For environment-only changes, update the full real environment values privately and rebuild/restart as required. Never replace secret values with the masked strings returned by a settings API.


## 15. DNS and HTTPS

Cloudflare is the authoritative DNS manager. Hostinger runs the website processes and serves their HTTPS certificates. The domain registrar remains responsible for the registered nameserver delegation. NS records copied inside a zone do not by themselves change that delegation.

| Record / service | Operational meaning |
| --- | --- |

| medwhole.org / www | Website records point to Hostinger; apex redirects to www. |

| CMS origin | cms.medwhole.org; CNAME to cms.medwhole.org.cdn.hstgr.net in Cloudflare, DNS only. |

| academy / office | Separate existing subdomain targets; preserve unless explicitly migrating them. |

| MX / SPF / DKIM / verification | Existing email and verification configuration; not part of the CMS runtime migration. |

| Proxy mode | Preserve the tested website configuration; do not toggle proxying as a generic fix. |

The former temporary CMS hostname redirects to this canonical origin using PAYLOAD_PREVIOUS_HOST. Keep that hostname different from the canonical CMS hostname to prevent a redirect loop.

### When changing website DNS

- Read the current authoritative records before editing.

- Obtain the exact Hostinger target for the website being changed.

- Change only the relevant website records. Preserve email and unrelated subdomains.

- Wait for propagation, verify certificate coverage and test HTTPS at apex and www.

- Record the prior values and rollback path in the change log.

### HTTPS troubleshooting

Inspect Hostinger SSL status and certificate names. Do not bypass certificate warnings. A working preview URL does not prove the custom domain has a valid certificate. CDN purge may be useful after a confirmed successful deployment, but does not repair a failed process or missing environment value.


## 16. Verification and troubleshooting

```
pnpm exec vitest run
pnpm exec tsc --noEmit
pnpm build
pnpm --dir cms build
```

Migration validation includes a clean schema installation covering 70 tables and 903 columns, 48 automated tests, explicit website and CMS TypeScript checks, production builds, native Payload storage/access checks, source-ID reconciliation, media storage verification and rendered website checks. Check the final release record for the deployed revision and any remaining limitations.

| Symptom | Check / next action |
| --- | --- |

| Connection closed / blank page | Inspect the failed request and server logs. Verify complete React server payload and consistent deployment assets. The JSON-LD regression has a dedicated test. |

| CMS error 1102 | Old Cloudflare runtime CPU limit. Use the active Hostinger CMS origin; verify no stale website URL remains. |

| News missing | Check publication state/date, CMS origin, read key and API availability; do not treat an outage as proof that records were deleted. |

| Form returns an error | Check validation, rate limiting, bot token, website-service key and CMS persistence response. |

| CMS media 500 | Check the complete S3 credential/endpoint/bucket set and object existence. Verify through the native file route. |

| CMS build cannot find @payloadcms/next | Confirm application root cms and its committed pnpm-workspace.yaml; inspect install logs. |

| Admin login differs | Website NextAuth and native Payload have separate identities. Use the correct login destination. |

The native CMS has no outbound email adapter configured. Treat CMS password-reset email as a separate outstanding integration; do not tell an operator that those messages are being delivered.


## 17. Backup and recovery

### What to back up

- CMS Neon database, including editorial versions, administrators, private inboxes and payment records.

- Website Neon identity database, including its NextAuth administrator records.

- Persistent object-storage bucket and media metadata together.

- Source repository, both lockfiles, deployment settings and revision history.

- Secret values in a private vault, with named owners and a recovery procedure.

### Restore and rollback

Restore backups into a separate database and verify counts, representative records, media and access restrictions before switching a live connection. Keep PAYLOAD_SECRET consistent with the intended installation. Test the restoration procedure rather than relying only on a backup-success notification.

A website rollback restores a known-good Git revision through Hostinger. A CMS rollback restores a compatible Hostinger build. The cutover schema is additive; keep imported records and new columns. Rolling back code does not require deleting migrated data.

After any restore or origin change, verify website-to-CMS keys, native media URLs, both login flows and private inbox boundaries. Preserve payment references and receipt state to avoid duplicate business actions.

### Private migration evidence

Offline source exports, pre-change database snapshots and reconciliation reports are stored privately under ignored migration working files during the cutover. Transfer them to the organization approved backup storage with access controls. They are not included in this PDF or Git.


## 18. Operations and ownership

| Owner | Responsibilities |
| --- | --- |

| Repository maintainer | Review changes, run checks, manage main and release records. |

| Hosting operator | Maintain two Hostinger application environments, builds, process health and TLS. |

| CMS administrator | Manage human CMS accounts, roles, API integrations and editorial permissions. |

| Content owner | Approve copy, publication, media consent and alternative text. |

| Operations / finance | Handle their own private inboxes, donation follow-up and payment reconciliation. |

| Domain / email owner | Maintain Cloudflare DNS, registrar access, mail records and sender configuration. |

### Acceptance checks

- Public domain loads over HTTPS and redirects consistently.

- Native Payload admin opens at the documented Hostinger address.

- All published editorial records and existing public images are available.

- Controlled forms save to Payload, and unauthorized clients cannot list private submissions.

- Both GitHub-connected Hostinger release paths and rollback procedures are understood.

- Secret values and private backups have been transferred outside this document.

- The CMS password-reset email adapter is tracked as a separate operational item.

### References

Repository setup and operating runbook: https://github.com/medwholeict-tech/medwhole-site

Hostinger Node.js deployment: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/

Payload migrations: https://payloadcms.com/docs/database/migrations

Cloudflare Worker resource limits: https://developers.cloudflare.com/workers/platform/limits/

Accepted by: _____________________  Date: _____________________

Before granting a new maintainer production access, complete the operator setup on the following pages and the separate Security and Access Operating Guide. Required controls there are not claims that MFA, credential rotation or branch rules are already enforced.


## 19. New maintainer: Git identity

Every incoming maintainer uses their own provider accounts. Record the person, repository role and expiry in the access register. Obtain repository membership before authenticating. The examples below are instructions for that operator; they were not executed to change this workstation identity.

| Identity | What it controls |
| --- | --- |

| Git user.name / user.email | Author attribution on new commits. |

| SSH key, HTTPS helper or token | Which GitHub account authenticates a network operation. |

| Agent product login | Which Codex or Claude account/billing workspace is used. |

| Hostinger / Cloudflare / Payload | Separate service permissions and application accounts. |

### Configure this repository after cloning

```
cd medwhole-site
git config --local user.name "Your Full Name"
git config --local user.email "verified-email@example.com"
git config --local user.useConfigOnly true
git config --show-origin --get user.name
git config --show-origin --get user.email
git var GIT_AUTHOR_IDENT
```

Choose SSH or HTTPS on the next two pages to authenticate and clone the repository once. Use an email verified on the intended GitHub account, or the exact noreply address shown in that account settings. Repository-local values avoid changing the author identity of unrelated projects.

Author settings do not grant repository access and do not alter previous commits. Do not rewrite shared history merely to replace the previous operator name. Check origin and the authenticated account before the first push.

```
git remote -v
git status --short
git branch --show-current
```

GitHub: commit identity: https://docs.github.com/en/get-started/git-basics/setting-your-username-in-git


## 20. SSH access on a new workstation

Create a new passphrase-protected key for this person/device. Do not overwrite an existing key or copy the outgoing operator private key. Upload only the .pub public key in GitHub Settings > SSH and GPG keys.

### Git Bash, macOS or Linux

```
mkdir -p ~/.ssh
ssh-keygen -t ed25519 -C "verified-email@example.com" -f ~/.ssh/id_ed25519_medwhole
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_medwhole
cat ~/.ssh/id_ed25519_medwhole.pub
```

### Windows PowerShell alternative

```
New-Item -ItemType Directory -Force "$env:USERPROFILE/.ssh" | Out-Null
ssh-keygen -t ed25519 -C "verified-email@example.com" -f "$env:USERPROFILE/.ssh/id_ed25519_medwhole"
# Administrator PowerShell: enable the service once, if needed.
Set-Service -Name ssh-agent -StartupType Automatic
Start-Service ssh-agent
# Normal PowerShell:
ssh-add "$env:USERPROFILE/.ssh/id_ed25519_medwhole"
```

Use one SSH implementation consistently. Windows OpenSSH and Git Bash may use different agents. If deliberately using Windows OpenSSH, configure this repository to use that executable when needed; do not change every repository globally.

### Dedicated host alias in the operator ~/.ssh/config

```
Host github-medwhole
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_medwhole
  IdentitiesOnly yes

ssh -T git@github-medwhole
git clone git@github-medwhole:medwholeict-tech/medwhole-site.git
```

Verify the first host-key fingerprint against GitHub official fingerprints before accepting it. The successful test must name the intended account; GitHub provides no interactive shell, so the success message can accompany exit status 1. For an existing checkout, set origin to the same SSH URL. An SSH alias selects a key, not commit authorship.

GitHub: SSH setup and connection test: https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection


## 21. HTTPS, tokens and account switching

### Browser login with a secure credential store

```
gh auth login --hostname github.com --git-protocol https --web
gh auth status --hostname github.com
gh api user --jq .login
gh auth setup-git
git clone https://github.com/medwholeict-tech/medwhole-site.git
```

Use Git Credential Manager or a GitHub CLI setup backed by the OS credential store. GitHub CLI can fall back to a plaintext credentials file when secure storage is unavailable; check its storage status and fix that condition before storing production access. Do not enable insecure storage or the plaintext Git credential-store helper.

### When a personal access token is required

- Create a separate expiring fine-grained token for the actual repository owner, medwholeict-tech, selecting medwhole-site only. Confirm organization approval or SSO authorization when applicable.

- Grant Contents read/write for pushes. Add Workflows write only for workflow changes and Pull requests write only if the CLI must create PRs. The account must independently have repository access.

- Enter the token through the approved credential-manager prompt as the HTTPS password. Never place a token in the remote URL, source, chat, command argument or shell history. A GitHub account password is not the Git HTTPS token.

- For GitHub CLI automation, inject a fine-grained token as GH_TOKEN through the approved secret manager for the job. Do not publish its value. GitHub CLI recommends this over treating a fine-grained token as a broad classic-token login.

### Switch to another already-authorized account

```
gh auth switch --hostname github.com --user YOUR_GITHUB_LOGIN
gh api user --jq .login
git ls-remote origin HEAD
```

GH_TOKEN/GITHUB_TOKEN can override a stored CLI account. Inspect variable presence without printing values. gh account switching does not select an SSH key or necessarily replace another credential helper. ls-remote confirms read access, not permission to push.

GitHub: scoped personal access tokens: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

GitHub CLI: login and account switching: https://cli.github.com/manual/gh_auth_login


## 22. Review, push and release safely

main is connected to two Hostinger applications. Updating main is a production release trigger. Use a feature branch and review the exact diff before authorizing publication. A developer SSH key or token is independent of Hostinger GitHub App access.

```
git fetch origin
git switch -c codex/onboarding-docs origin/main
git status --short
git diff --check
# Edit only the approved files, then inspect them.
git diff -- docs/security-operations-guide.md
git add docs/security-operations-guide.md
git diff --cached --stat
git diff --cached --check
git commit -m "docs: update security operating guidance"
git push -u origin HEAD
gh pr create --base main --fill
```

Use an unused branch name. The final gh command requires appropriate PR permission; the GitHub web interface is an alternative. Never assume that changing user.name fixes a 403 push failure. Confirm the authenticated account, repository role, token scope and branch rules.

### Required checks for application changes

```
pnpm exec vitest run
pnpm exec tsc --noEmit
pnpm build
pnpm --dir cms exec tsc --noEmit
pnpm --dir cms build
```

Run checks appropriate to the patch; document-only changes need document/link/secret checks. A website build currently skips embedded lint/type checking, so explicit type checks matter for code changes. Preserve both lockfiles and install them independently.

- Require review and applicable status checks on main; restrict bypass, force-push and branch deletion. Verify the actual repository rules and available plan features before claiming enforcement.

- After the approved merge, verify both Hostinger jobs and the live website, CMS admin, published content and a controlled form. Keep the prior compatible deployment for rollback.

- Do not run another agent in the same checkout while Git operations are in progress. Use separate authorized checkouts/worktrees for parallel work; they are not credential-security boundaries.


## 23. Wrangler login on a new workstation

Wrangler is retained for Cloudflare administration and optional Worker tooling. The active website and Payload CMS run on Hostinger; logging in to Wrangler does not publish either application. Install the repository dependencies first to use the project-pinned CLI.

```
pnpm --dir cms exec wrangler --version
pnpm --dir cms exec wrangler login --help
pnpm --dir cms exec wrangler login --use-keyring
pnpm --dir cms exec wrangler whoami
```

Complete the browser approval yourself and verify the account shown. The installed Wrangler 4.155.0 help supports --use-keyring, --device and --scopes-list. Keyring support depends on the OS; if secure storage is unavailable, resolve it or use an approved isolated environment.

### Remote terminal or unreachable localhost callback

```
pnpm --dir cms exec wrangler login --device --use-keyring
pnpm --dir cms exec wrangler whoami
```

Approve only a device code initiated by your own session. Do not share OAuth callback URLs, one-time codes, access tokens or refresh tokens. Use the least supported OAuth scopes needed; inspect login --scopes-list before selecting them.

### Change the Cloudflare operator

```
pnpm --dir cms exec wrangler logout
pnpm --dir cms exec wrangler login --use-keyring
pnpm --dir cms exec wrangler whoami
```

Run logout only for the intended local session. Check for a supplied CLOUDFLARE_API_TOKEN that may select token authentication instead of the expected OAuth session. A valid Worker login is not proof of DNS Edit access. Local logout is not a substitute for provider-side revocation during offboarding.

Cloudflare: login, keyring, device flow and whoami: https://developers.cloudflare.com/workers/wrangler/commands/general/


## 24. Cloudflare tokens and CI access

| Service / task | Required approach |
| --- | --- |

| Cloudflare DNS | Separate token with Zone > DNS > Edit and Zone > Zone > Read, scoped to medwhole.org. Confirm the intended record and target. |

| Optional Worker CI | Job-scoped CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID with only the required account permissions. No copied human OAuth cache. |

| Hostinger deployments | Organization-controlled GitHub App connection and private application environments. Developer Git login does not configure this connection. |

| Payload integration | Separate content-read, editor, operations, finance and website-service users/keys. A CMS API key is not a human password. |

| Agent provider | Own Codex/ChatGPT or Claude login and approved billing workspace. This does not authorize Git, DNS, CMS or hosting access. |

### Cloudflare secrets and local development

Worker secret values belong in secret bindings; non-secret vars in wrangler.jsonc are not a secret store. Keep .dev.vars and local environment files out of Git. A future authorized Worker CI job must inject credentials from its secret store, restrict environment access and avoid printing values. The current manual Cloudflare workflow builds artifacts only.

### Production origins and storage

- Website PAYLOAD_CMS_URL and CMS PAYLOAD_PUBLIC_SERVER_URL use https://cms.medwhole.org. CORS/CSRF lists contain exact approved origins.

- The cms CNAME is DNS only and points to cms.medwhole.org.cdn.hstgr.net. Hostinger serves HTTPS. A Cloudflare Access or WAF rule does not protect an origin that can be reached around it; design access restrictions end to end.

- Do not swap the website identity DATABASE_URL with the CMS connection. Production storage credentials and personal submissions stay outside agent development workspaces.

Cloudflare: scoped API tokens: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/

Cloudflare: Worker secrets: https://developers.cloudflare.com/workers/configuration/secrets/


## 25. Codex, Claude Code, VS Code and CLI

| Tool | Sign-in and operating rule |
| --- | --- |

| Codex desktop / ChatGPT | Use the operator own approved account/workspace. Open the intended repository and review filesystem, network and connector permissions. A browser/cloud chat has no automatic access to the local terminal Git identity. |

| Codex in VS Code | Install the official extension and sign in there. Confirm the selected local/remote workspace. Git credentials are supplied separately by that execution environment. |

| Codex CLI | Use codex login and codex login status. Select restricted project access and appropriate action review; do not use blanket sandbox/approval bypass on a production-credential workstation. |

| Claude Code | Use claude auth login and claude auth status. Review permissions and approved authentication/billing method. Start with plan mode for an unfamiliar repository. |

| VS Code / plain terminal | Install Git, choose SSH or HTTPS, set repository-local author identity and verify the active account. Editor or agent sign-in alone does not grant repository write access. |

```
# Codex CLI, after official installation
codex login
codex login status
codex --help
# Claude Code, after official installation
claude auth login
claude auth status
claude --permission-mode plan
```

Older CLI versions can differ; check --help and current official installation guidance. Do not blindly copy authentication flags or another developer credential cache. Unexpected OPENAI_API_KEY, ANTHROPIC_API_KEY or provider-token variables can select a different authentication/billing path.

OpenAI: Codex authentication and IDE setup: https://learn.chatgpt.com/docs/auth

Claude Code: authentication and CLI commands: https://code.claude.com/docs/en/cli-reference

VS Code: GitHub integration: https://code.visualstudio.com/docs/sourcecontrol/github


## 26. Operator handoff and troubleshooting

### Before the first change

- Confirm the organization, repository, branch, verified commit email and authenticated GitHub account. Confirm personal repository membership independently of the outgoing operator token.

- Use a development database/bucket and a checkout without production environment files, confidential PDFs or credential caches. .gitignore prevents accidental staging; it does not prevent an agent from reading a file.

- Review repository instructions, package scripts, hooks, tasks, extensions, skills and MCP connections before executing them. Treat issue text, web pages and tool output as untrusted input.

- Give an agent a bounded task, permitted paths and required checks. Keep production release, DNS, billing, credential rotation, account grants and destructive-data actions under explicit operator control.

- Check the concrete diff, selected files and secret scan before committing. A branch or worktree isolates code changes but usually shares the OS user and credentials.

### Common failures

| Symptom | Check |
| --- | --- |

| Wrong commit author | Repository-local user.name/user.email and GIT_AUTHOR_IDENT; changing CLI login alone does not change authorship. |

| Push returns 403 | Actual SSH greeting or HTTPS account, repository role, token scope/SSO and branch rules. |

| Wrong Cloudflare account | wrangler whoami and whether an API-token environment variable overrides the expected session. |

| Agent cannot use Git | The tool execution environment must have Git, the checkout and its own authorized credential method. A chat subscription is separate. |

| Remote/WSL cannot find keys | Verify the actual OS/home directory and SSH implementation. Do not solve it by copying another person private key. |

### When a person or agent leaves

Revoke that operator repository membership, personal tokens, SSH keys, agent connectors and provider sessions as appropriate. Rotate shared credentials they could access, then verify the Hostinger GitHub App connection and both applications still work. Transfer ownership and recovery to named maintainers; never hand over a personal OAuth refresh token as the team deployment identity.
