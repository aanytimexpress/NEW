# Bogura Kothon – বগুড়া কথন

Production-grade multilingual newsroom platform with a custom CMS workflow inspired by WordPress editorial power and BBC-style newsroom operations.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI, Framer Motion, next-intl, PWA
- Admin Dashboard: Next.js App Router, TypeScript, Tailwind CSS, next-intl
- Backend API: Node.js, Express.js, MongoDB (Mongoose), Redis-ready caching
- Auth/Security: JWT secure cookies + bearer token, bcrypt, role permissions, CSRF, Helmet, rate-limit, XSS/mongo sanitize, admin IP whitelist, 2FA ready
- Deployment: GitHub Actions CI/CD, Vercel (frontend/admin), Railway or Render (backend)

## Monorepo Layout

```text
/
  frontend/
  backend/
  admin-dashboard/
  database/
  api/
  components/
  hooks/
  utils/
  config/
  scripts/
  .github/workflows/
```

## Core Features Implemented

- Bangla + English multilingual routing and fallback translation via `next-intl`
- Locale URLs (`/bn/...`, `/en/...`) with localized Bangla pathnames
- Public newsroom pages:
  - Home, Latest, Politics, Local, International, Sports, Business, Technology, Entertainment
  - Editorial, Opinion, Video News, Photo Gallery
  - Search, Archive, Author Profile
  - Event Calendar, Job Circular, Tender Notice, Public Announcement, Obituary
  - About, Contact, Privacy Policy, Terms & Conditions
- Homepage modules:
  - Breaking ticker, hero slider, trending, latest, category blocks
  - Video block, gallery block, popular sidebar, newsletter, ads block
- Newsroom workflow:
  - Reporter/Author draft creation
  - Editor review/approval
  - Admin publishing + scheduled publishing
  - Revision history + badge support (`updated`, `correction`, `exclusive`, `fact_check`, `sponsored`, `live`)
- Admin CMS capability surface:
  - Homepage section builder API
  - Menu builder API
  - Widget/settings APIs
  - Ads manager API
  - Language label management API
  - Maintenance mode toggle support (`settings: maintenance_mode`)
  - Backup/restore + activity log endpoints
- Media library foundation:
  - Upload + validation
  - WebP conversion + compression pipeline
  - Folder metadata
- District/upazila-ready local news data model
- SEO foundation:
  - XML sitemap + Google News sitemap + robots
  - Article schema + breadcrumb schema
  - Canonical and alternate locale metadata
  - Keyword density + internal linking suggestion API
- Performance/security:
  - Redis-ready response caching
  - ISR on frontend fetches
  - Secure middleware stack and brute-force protection on auth
  - Push subscription endpoint + service worker offline cache foundation

## API Highlights (`/api/v1`)

- `auth` (signup/login/refresh/logout, 2FA setup/verify)
- `articles` (CRUD, workflow transitions, schedule, SEO insights)
- `categories`
- `users`
- `comments` + moderation
- `homepage-sections`
- `ads`
- `notifications`
- `push-subscriptions`
- `media`
- `menus`
- `pages`
- `settings`
- `languages`
- `geo` (districts/upazilas)
- `subscribers`
- `system` (activity logs, backup, restore)

OpenAPI skeleton: [api/openapi.yaml](/F:/THINK/api/openapi.yaml)

## Environment Setup

1. Copy [.env.example](/F:/THINK/.env.example) to `.env`.
2. Optionally copy:
   - [frontend/.env.example](/F:/THINK/frontend/.env.example)
   - [backend/.env.example](/F:/THINK/backend/.env.example)
   - [admin-dashboard/.env.example](/F:/THINK/admin-dashboard/.env.example)
3. Fill required secrets (`JWT_*`, MongoDB, Vercel, Railway/Render).

## Local Development

```bash
npm install
npm run dev
```

Apps:

- Frontend: `http://localhost:3000`
- Admin Dashboard: `http://localhost:3001`
- Backend API: `http://localhost:5000`

Seed initial data:

```bash
npm run seed --workspace backend
```

## GitHub Automation + Deployment

- Auto-create/push repository:
  - PowerShell: [scripts/setup-github-repo.ps1](/F:/THINK/scripts/setup-github-repo.ps1)
  - Shell: [scripts/setup-github-repo.sh](/F:/THINK/scripts/setup-github-repo.sh)
  - Node workflow script: [scripts/auto-create-repo.mjs](/F:/THINK/scripts/auto-create-repo.mjs)
- CI/CD workflow: [.github/workflows/ci-cd.yml](/F:/THINK/.github/workflows/ci-cd.yml)
  - Installs deps
  - Builds frontend/backend/admin
  - Deploys frontend/admin to Vercel
  - Deploys backend to Railway (or Render hook fallback)

### Required GitHub Secrets

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID_FRONTEND`
- `VERCEL_PROJECT_ID_ADMIN`
- `RAILWAY_TOKEN` + `RAILWAY_SERVICE_ID` (optional pair)
- `RENDER_DEPLOY_HOOK_URL` (optional fallback)

## Notes

- This repository provides a production-ready architecture and modular implementation baseline.
- For live production launch, connect real storage/CDN, transactional mail provider, moderation provider, and push notification provider credentials.
