# CAC North America

Public website and admin console for Christ Apostolic Church North America (CACNA), rebuilt from the legacy WordPress site.

- **Public site**: home, about, tenets, leadership/zones directory, ministries, events (with registration), live streaming, contact.
- **Admin console** (`/admin`): full content management for events, departments, sermons/live streams, announcements, leaders, tenets, member churches, media, registrations, and site settings — gated behind Supabase Auth.
- **Stack**: Next.js (App Router) + Supabase (Postgres, Auth, RLS).

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.local` (Supabase project URL + publishable key) before running locally — see `src/lib/supabase/`.

## Deployment

Deployed to Vercel, auto-deploying from the `master` branch on [GitHub](https://github.com/ezekielologunde/cacnorthamerica).
