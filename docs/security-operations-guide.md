
## 1. Security & access guide

Required security practices, new Git identities, SSH and token access, Wrangler authentication, and safe use of coding agents.

> Scope and status: This is a required operating baseline and onboarding runbook. It records known handover gaps and verification steps. Creating this document does not enable MFA, rotate secrets, enforce branch rules or complete a security audit.

| Document control | Value |
| --- | --- |

| Date / edition | 4 November 2026 - Africa/Lagos / 1.0 |

| Current services | www.medwhole.org and cms.medwhole.org on Hostinger; Cloudflare authoritative DNS |

| Repository | medwholeict-tech/medwhole-site |

| Sharing | No secret values. The separate confidential credential PDF stays in restricted storage. |

Owners: organization account owner, repository maintainer, hosting operator, CMS administrator, operations/finance owners and the incoming developer. Each control needs a named accountable person and dated evidence.


## 2. Must-do security controls

| Required control | Owner / evidence |
| --- | --- |

| Rotate previously shared credentials | Service owner: rotate credentials shared in chat or the plaintext credential document; verify new access and revoke old access. |

| Use named accounts and MFA | Account owner: personal provider membership, MFA/passkeys where supported, restricted recovery codes and two recovery-capable owners. |

| Establish Payload recovery | CMS owner: named reachable administrator and tested authorized recovery method. Native reset email is currently unconfigured. |

| Protect main | Repository owner: reviewed PRs, relevant passing checks, restricted bypass/force-push and an understood Hostinger release trigger. |

| Separate production credentials | Hosting/data owner: development DBs/buckets; role-specific API keys and an approved vault; no production secrets in general agent workspaces. |

| Restrict coding agents | Developer: bounded filesystem/network access, reviewed connectors and explicit authorization for privileged production changes. |

| Verify backups and response | Data owner: access-controlled backups, a restoration drill, logs without secrets, an incident contact and revocation procedure. |

### Known evidence and open checks

The domain cutover verified HTTPS, content and media reads, private API separation and controlled form persistence. Earlier work verified 48 tests and fresh schema creation. That evidence does not establish MFA enforcement, repository branch protection, a restoration drill, token rotation or a complete application security review.

Do not sign off a new privileged operator until identity, access scope and recovery are documented. Record accepted exceptions with an owner, reason, expiry and compensating control; do not describe an exception as an implemented control.


## 3. Secrets, vaults and rotation

Operational credentials were shared in this conversation and collected in a plaintext confidential PDF at the owner request. Treat those values as requiring controlled replacement before broad handover. Do not reproduce them in this guide, an agent prompt, public source, an issue, a screenshot or a log.

### Controlled rotation sequence

- Inventory the credential, owner, provider, scope, consumers and rollback path without copying the value into the inventory.

- Issue a replacement with the smallest required access and an expiry where supported. Store it in the approved vault.

- Update the appropriate Hostinger application environment or approved CI secret store. Preserve unrelated keys; never save masked API responses as real values.

- Rebuild/restart as required and test the exact consumer. Rotate one service at a time. Database users, object-storage keys and application integration keys need their own checks.

- Revoke the old token/key at the provider and verify it no longer works. Remove obsolete local files and review access logs. Deleting a chat message or file does not invalidate a credential.

- Update the restricted access register. The plaintext credential PDF becomes stale after rotation; move ongoing access to the vault and remove unnecessary copies according to the retention policy.

### Session secrets need a separate change plan

NEXTAUTH_SECRET and PAYLOAD_SECRET are not ordinary external API keys. Plan session invalidation and any dependent cryptographic data before changing them. Retain stable values across a routine deployment and test recovery in staging before a coordinated production rotation.

If a credential entered Git history, revoke or rotate it first. Removing the current line or adding .gitignore is insufficient. Coordinate any history rewrite with collaborators, review forks/caches and provider cleanup guidance, and avoid destructive rewriting as an improvised fix.

OWASP: secret lifecycle and access controls: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html

GitHub: removing sensitive repository data: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository


## 4. People, roles and recovery

| System | Required boundary |
| --- | --- |

| GitHub / Hostinger / Cloudflare | Named human accounts with MFA/passkeys where supported. Grant only required team/repository/account permissions; keep owner recovery independent of a contractor. |

| Website /admin | Existing NextAuth identity database. Use unique credentials and document authorized account recovery. |

| Payload /admin | Separate CMS identity. Replace shared/bootstrap ownership with named real operators and a reachable verified recovery address. |

| Editorial staff | Contributor/editor roles for content work; administrator access only for account/permission owners. |

| Operations / finance | Distinct private-inbox roles. Validate authorization on the server, including direct API requests. |

| Website integration | Dedicated service keys for read, editorial, operations, finance and submission creation. Do not turn a human admin account into a shared service login. |

### Required recovery preparation

- Keep at least two named organization recovery-capable owners and a documented emergency procedure. Store recovery codes separately from normal session credentials.

- Record exactly which login belongs to the website portal and which belongs to Payload. A known website password is not a confirmed CMS password.

- Configure and test native CMS reset-email delivery or an explicitly authorized recovery procedure before relying on it. The current CMS has no outbound email adapter.

- Review members, API-key owners, SSH keys, tokens, connectors and service identities when staff change and on a regular schedule. Remove stale access at the provider.

Application MFA for the website portal and Payload has not been established by the existing handover. Assess supported controls or an identity-aware access design; do not claim those admin screens are protected by MFA merely because the hosting dashboard is.


## 5. Production data and application controls

- Keep the website identity database and dedicated Payload database separate. Use staging/development databases and storage buckets for routine coding and agent tasks. Require TLS and scoped database/storage roles.

- Enforce private collection access on every server route. Test that anonymous and content-read users cannot enumerate contact, volunteer, donor or registration records. CORS is not authorization.

- Validate public form input, limit payload/file sizes and apply anti-abuse measures at appropriate shared boundaries. The current lib/rate-limit.ts uses an in-process Map, so limits reset on process restart and are not shared across instances.

- Keep exact allowed CORS/CSRF origins, secure cookie behavior, HTTPS and the canonical CMS origin consistent. Review reverse-proxy and forwarded-header behavior rather than disabling TLS or CSRF checks.

- Protect backups, exports and private files as production personal data. Limit download access, logging fields and retention. Keep media consent and alt-text review explicit.

- Validate payment webhooks with provider signatures and expected reference, amount and currency. Preserve idempotency and receipt state. Use test mode for verification.

### Domain and media controls

Cloudflare DNS routes cms.medwhole.org to Hostinger with DNS-only mode; Hostinger serves TLS. Record certificate ownership and renewal checks. Adding Cloudflare Access or a WAF policy must include a design that prevents direct-origin bypass. No such policy should be treated as already enforced here.

For CMS uploads, verify permitted MIME types, size limits and access controls. A published file URL and editorial metadata have different exposure considerations; review direct-file access for sensitive uploads. Keep object-storage credentials server-side and never infer consent from successful migration.

This document does not certify the full application controls above. Schedule a scoped security review and fix verified findings through normal code review.


## 6. Repository, CI/CD and release controls

Both Hostinger applications follow GitHub main. A merge or push to main can therefore publish production. Set the repository rules before extending write access to new people or tools.

- Require reviewed changes and relevant status checks. Restrict who can bypass rules, force-push or delete main. Protect deployment environments and use an organization-owned integration rather than a departing person session.

- Keep workflow permissions minimal. Review dependency and action updates, use reproducible lockfiles and consider pinned action revisions. Do not expose production secrets to untrusted PR code or allow a workflow trigger to run attacker code with privileged credentials.

- Run explicit website/CMS type checks and appropriate tests/builds for code changes. The website build currently skips its embedded lint/type gates; the manual Cloudflare workflow is not an automatic push/PR security gate.

- Add supported secret scanning and dependency/vulnerability checks, assign owners for alerts and document exception expiry. A scan result is not proof that no vulnerability exists.

- Apply reviewed compatible migrations before code that depends on them. Keep backups and a known-good deployment. Never enable production schema push or approve a populated-database reset just to clear a migration error.

- Monitor both Hostinger builds and live service behavior after release. Keep email, payment, DNS and privilege changes explicitly scoped.

### Handling an accidentally committed secret

Pause further distribution, rotate/revoke the credential, identify the affected consumers and validate recovery. Record the incident without pasting the value. Coordinate any repository cleanup and notify the organization security owner. A new commit deleting the value does not erase earlier commits or downloaded copies.

GitHub: secret removal and history consequences: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository


## 7. Safe use of coding agents

An agent can act with the files, credentials, sessions and network permissions available to its execution environment. Login to a model provider is separate from service access. Prompt instructions and ignored-file patterns are not substitutes for enforceable operating-system or sandbox boundaries.

### Before giving a task

- Use a sanitized checkout with development data. Keep confidential credential PDFs, production .env files, SSH private keys, browser profiles and OAuth caches outside the accessible workspace.

- Choose a bounded sandbox/permission profile and allow only needed directories and network destinations. Avoid blanket permission bypass and broad shell/network grants on a machine holding production credentials.

- Review extensions, package scripts, hooks, instructions, skills, plugins and MCP servers. A malicious dependency or document can request credential disclosure or unrelated commands; treat that request as untrusted.

- Give a concrete objective, permitted paths, expected tests and the release boundary. Review high-impact actions such as production deploys, DNS changes, credential rotation, user grants, billing and destructive data operations against explicit authorization.

- Use scoped service identities or a trusted credential broker when available. Prefer returning only necessary results to the model rather than raw secret values. A secret injected into an unrestricted shell environment can still be read by code running there.

### When switching agents or devices

Codex, Claude Code, editor extensions and a terminal may share the same OS account and credential helpers. A new chat, branch or worktree usually does not remove that access. Use separate OS identities or isolated environments for operators that should not share credentials. Never copy the outgoing operator token cache as the team onboarding method.

OpenAI: agent approvals and security: https://learn.chatgpt.com/docs/agent-approvals-security

Claude Code: security model: https://code.claude.com/docs/en/security

VS Code: Workspace Trust: https://code.visualstudio.com/docs/editing/workspaces/workspace-trust


## 8. Backups, incidents and offboarding

### Backups and monitoring

- Back up the CMS database including versions and private records, the separate website identity database, and the durable media bucket. Restrict access and retention; preserve vault-managed recovery information.

- Set recovery objectives with the owner and perform a restore into an isolated environment. Verify counts, relationships, media, access boundaries and representative workflows. A fresh schema installation is not a backup restoration drill.

- Monitor website and CMS availability, failed logins, rejected writes, certificate renewal, release failures and privileged account/DNS changes. Keep log access controlled and redact tokens, passwords, payment credentials and unnecessary personal data.

### Incident procedure

Identify the system and affected credential, preserve minimal relevant evidence, notify the named owner, contain access at the provider, rotate/revoke credentials and recover the exact consumers. Validate service behavior, review what was accessed, document the timeline and follow organization notification obligations. Do not destroy logs or rewrite history before the incident owner assesses evidence.

### Offboarding procedure

Remove individual provider/repository memberships and revoke personal SSH keys, tokens, OAuth grants and agent connectors. Rotate shared access the departing person could read. Reassign service integrations and recovery ownership; verify Hostinger auto-deployment and both live applications. Local logout or deleting a laptop file alone does not revoke a copied remote token.

### Required sign-off

Account owner: __________________  Repository owner: __________________

CMS/recovery owner: ____________  Hosting/data owner: ________________

Evidence location / review date: ___________________________________

Unresolved exceptions, named owner and expiry: ________________________


## 9. New maintainer: Git identity

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


## 10. SSH access on a new workstation

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


## 11. HTTPS, tokens and account switching

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


## 12. Review, push and release safely

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


## 13. Wrangler login on a new workstation

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


## 14. Cloudflare tokens and CI access

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


## 15. Codex, Claude Code, VS Code and CLI

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


## 16. Operator handoff and troubleshooting

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


## 17. Official references: Git and Cloudflare

GitHub: author identity: https://docs.github.com/en/get-started/git-basics/setting-your-username-in-git

GitHub: generate SSH keys and use ssh-agent: https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

GitHub: verify an SSH connection: https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection

GitHub: scoped personal access tokens: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

GitHub CLI: authentication and storage: https://cli.github.com/manual/gh_auth_login

GitHub CLI: account switching: https://cli.github.com/manual/gh_auth_switch

Cloudflare: Wrangler login and whoami: https://developers.cloudflare.com/workers/wrangler/commands/general/

Cloudflare: create scoped API tokens: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/

Cloudflare: Worker secret storage: https://developers.cloudflare.com/workers/configuration/secrets/

Cloudflare: non-interactive CI authentication: https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/

Command examples use placeholders. Do not paste a real token into a command argument. Check installed CLI --help before using a version-dependent option. The project-pinned Wrangler login help was inspected read-only for this guide.


## 18. Official references: agents and security

OpenAI: Codex authentication: https://learn.chatgpt.com/docs/auth

OpenAI: agent approvals and security: https://learn.chatgpt.com/docs/agent-approvals-security

OpenAI: Codex CLI commands: https://learn.chatgpt.com/docs/developer-commands?surface=cli

OpenAI: Codex IDE extension: https://learn.chatgpt.com/docs/codex/ide

Claude Code: authentication: https://code.claude.com/docs/en/authentication

Claude Code: CLI reference: https://code.claude.com/docs/en/cli-reference

Claude Code: permissions: https://code.claude.com/docs/en/permissions

Claude Code: security: https://code.claude.com/docs/en/security

VS Code: GitHub integration: https://code.visualstudio.com/docs/sourcecontrol/github

VS Code: Workspace Trust: https://code.visualstudio.com/docs/editing/workspaces/workspace-trust

OWASP: secrets management: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html

Project evidence: README.md; cms/payload.config.ts; cms/src/access/roles.ts; lib/auth.ts; lib/rate-limit.ts; next.config.mjs; .github/workflows/cloudflare-build.yml; docs/payload-cutover-record.md. Repository source describes implementation, not proof that every operational control is enforced.

Review this baseline whenever ownership, domains, authentication, agent tooling, provider permissions or deployment automation changes.
