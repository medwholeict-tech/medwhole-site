# MedWHOLE Alliance Website

Official website for MedWhole - A non-profit organization advancing holistic healthcare in Nigeria.

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Neon Database
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string

### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your credentials (see [ADMIN_SETUP.md](./ADMIN_SETUP.md) for details):
```env
DATABASE_URL=postgresql://username:password@your-project.neon.tech/neondb?sslmode=require
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your-key
IMAGEKIT_PRIVATE_KEY=your-key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your-endpoint
```

### 4. Push Database Schema & Create Admin
```bash
pnpm db:push
pnpm admin:create
```

### 5. Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Panel

Access: **http://localhost:3000/admin/login**

Complete CMS for managing:
- ✅ Team Members (with photo uploads)
- ✅ Programs (with images, objectives, outcomes)
- ✅ Statistics (impact metrics)
- ✅ Partners (with logo uploads)
- ✅ Job Postings
- ✅ Events (coming soon)
- ✅ Impact Stories (coming soon)

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for complete setup guide.

### Database Management

- **Push schema**: `pnpm db:push`
- **Open Drizzle Studio**: `pnpm db:studio`
- **Create admin user**: `pnpm admin:create`

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth v5
- **Image Management**: ImageKit
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── admin/           # Admin dashboard & CRUD pages
│   ├── api/             # API routes (auth, admin)
│   ├── (public pages)/  # Public-facing pages
├── components/          # React components
├── db/                  # Database schema & connection
├── lib/                 # Utilities (auth, imagekit)
├── scripts/             # Setup scripts
└── public/              # Static assets
```

## Core Data Models

- **Team Members**: Leadership team profiles
- **Programs**: Academy, Health, Consult programs
- **Impact Stories**: Success stories and testimonials
- **Statistics**: Homepage metrics
- **Events**: Upcoming conferences, webinars
- **Partners**: Partner organizations
- **Job Postings**: Career opportunities
- **Admin Users**: Authentication

## Status

1. ✅ Database schema created
2. ✅ Admin authentication (NextAuth)
3. ✅ Image uploads (ImageKit)
4. ✅ Team Members CRUD
5. ✅ Programs CRUD
6. ✅ Statistics CRUD
7. ✅ Partners CRUD
8. ✅ Jobs CRUD
9. ⏳ Events CRUD (in progress)
10. ⏳ Impact Stories CRUD (in progress)
11. ⏳ Connect admin data to frontend pages

## Deployment

Production uses **Hostinger Node.js hosting** for the website, **Cloudflare
Workers** for Payload CMS, and **Cloudflare DNS** for `medwhole.org`.

- Canonical website: `https://www.medwhole.org` (`medwhole.org` redirects here).
- CMS: `https://medwhole-cms.medwhole.workers.dev` (admin at `/admin`).
- Hostinger preview: `https://aqua-jellyfish-909555.hostingersite.com`.
- GitHub repository: `medwholeict-tech/medwhole-site`, branch `main`.

Hostinger builds new pushes to `main` with Node 22, pnpm, build script `build`,
output directory `.next`, and `NEXT_DIST_DIR=.next`. Set `NEXTAUTH_URL`,
`NEXT_PUBLIC_APP_URL`, and `NEXT_PUBLIC_SITE_URL` to `https://www.medwhole.org`.
Set `PAYLOAD_CMS_URL` to the CMS URL above and `PAYLOAD_CMS_PUBLIC_ENABLED=true`.
Keep the distinct Payload API keys and other service secrets in Hostinger's
environment settings. Never use `localhost` as the production CMS address.

`pnpm deploy:production` verifies a clean `main` checkout and pushes it to GitHub.
Confirm that the Hostinger build completes before treating the change as live.
The CMS is deployed separately with `pnpm --dir cms cf:deploy`; its allowed
origins are maintained in `cms/wrangler.jsonc` and the Cloudflare build workflow.

Cloudflare website DNS targets (DNS only, using Hostinger CDN):

| Type | Name | Target |
| --- | --- | --- |
| CNAME | `@` | `medwhole.org.cdn.hstgr.net` |
| CNAME | `www` | `www.medwhole.org.cdn.hstgr.net` |

Replace the old website A/AAAA/CNAME records when moving hosts. Preserve email
and verification records. Cloudflare flattens the apex CNAME. Once these records
resolve to Hostinger, confirm its domain SSL certificate is active and HTTPS
redirection is enabled. The old website Worker is retained as a fallback and is
not the main production host.

## Future Enhancements

- Add Sanity CMS for blog/news content
- Implement rich text editor for descriptions
- Email notifications for form submissions
- Analytics dashboard
