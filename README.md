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

- **Framework**: Next.js 14 (App Router)
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

Recommended: **Vercel**

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy
5. Run `pnpm admin:create` in production

## Future Enhancements

- Add Sanity CMS for blog/news content
- Implement rich text editor for descriptions
- Email notifications for form submissions
- Analytics dashboard
