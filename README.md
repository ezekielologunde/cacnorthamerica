# CAC North America

Public website and admin console for Christ Apostolic Church North America (CACNA).

The codebase is a full copy of the sibling site cac-salvation-center.org's
Next.js app (with permission — same owner), re-pointed at this project's own
Supabase backend, with CAC North America-specific content replacing the
Salvation Center content page by page.

- **Public site**: home, about, ministries, leadership, events, blog, gallery,
  giving/store, prayer requests, testimonies, contact, and more.
- **Admin console** (`/admin`): announcements, blog, events, gallery,
  newsletter, orders, prayer requests, store, testimonies, admin users —
  gated behind Supabase Auth (requires `SUPABASE_SERVICE_ROLE_KEY`, see below).
- **Stack**: Next.js (App Router) + Supabase (Postgres, Auth, RLS) + Stripe +
  Resend + Cloudinary, ported as-is from the source project.

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — already set for this project's Supabase instance.
- `SUPABASE_SERVICE_ROLE_KEY` — **required for the admin console to work** (Project Settings → API → service_role key). Without it, public pages still render (RLS-limited fallback), but admin login/writes won't.
- Everything else (Cloudinary, Stripe, Resend, Behold, Google Analytics/Ads, YouTube, Sheets webhook) is optional — each feature no-ops or errors gracefully at the point of use if left blank.

## Deployment

Deployed to Vercel, auto-deploying from the `master` branch on [GitHub](https://github.com/ezekielologunde/cacnorthamerica).

## Content status

The site currently ships with cac-salvation-center's own content (copy, staff
names, event details, blog posts) in most places — this is being replaced
page by page with real CAC North America content and data.
