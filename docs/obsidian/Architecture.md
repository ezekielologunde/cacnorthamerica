---
project: cacnorthamerica
type: architecture
status: active
last_updated: 2026-08-22
tags: [project/cacnorthamerica]
---

# Architecture

Related: [[Project]] · [[Features]] · [[Decisions]]

## Layout

```
app/                 Next.js App Router routes
  admin/(protected)/ Admin console pages, gated by proxy.ts
  admin/login/       Supabase Auth login
  api/                contact, gallery, instagram, cloudinary/sign
  <public pages>/     about, ministries, leadership, events, blog, gallery,
                      giving, zones, calendar, bible-institute,
                      christian-education, cacma, good-women,
                      ministers-wives, youth, business-group, watchwords,
                      statement-of-faith, online, newsletter, contact
components/          admin/ blog/ calendar/ media/ ministries/ navigation/
                     providers/ sections/ ui/ zones/
contexts/            CartContext.tsx (giving/store cart state)
lib/                 data-access + integration helpers (see below)
lib/supabase/        client.ts, server.ts, require-admin.ts
supabase/migrations/ SQL schema history (0001–0009)
types/database.types.ts  Generated Supabase types
proxy.ts             Next.js middleware — auth gate for /admin
```

## Data layer (Supabase / Postgres)

Schema evolved through 9 migrations. Current tables (post 0008/0009 drops):

- `profiles`, `admin_profiles` — user/admin identity
- `departments`, `leaders`, `tenets` — org structure and leadership bios
- `events` — recreated in 0003 as part of a general schema replacement
  when the site was ported from cac-salvation-center
- `blog_posts`, `announcements`, `gallery_images`, `media`
- `contact_submissions`, `newsletter_subscribers`
- `products`, `orders` — giving/store
- `cac_world_news` — added 0004, syndicated CAC-wide news
- `site_content`, `site_settings` — CMS-style key/value content editable
  from `/admin`
- `churches` — backs the Zone Directory / "Find a Church Near You" feature

Notable schema churn: `event_pricing_tiers`, `event_registrations`,
`event_registrants` were added in 0002, then the whole registration flow was
dropped again in 0009 (`convention_*` tables), and `testimonies` /
`prayer_requests` were dropped in 0008 — features present in the donor site
that CACNA chose not to carry forward. See [[Decisions]].

All tables have `enable row level security`; write access in the app goes
through `lib/supabase/server.ts` (server client) and
`lib/supabase/require-admin.ts` (admin-only route/page guard), with a
service-role key used server-side for admin writes per the README.

## Auth

`proxy.ts` is Next.js middleware: any request under `/admin` other than
`/admin/login` is redirected to login unless a Supabase session user is
present. This is the entire access-control model — no separate roles/
permissions system found in the codebase.

## Content/data access helpers (`lib/`)

Each domain has its own thin data-access module rather than a shared ORM
layer: `archive.ts`, `blog.ts`, `cacWorldNews.ts`, `churches.ts`,
`conventions.ts`, `events.ts`, `feedback.ts`, `forms.ts`, `giving.ts`,
`global.ts`, `leaders.ts`, `prayerLine.ts`, `reviews.ts`, `search-index.ts`,
`sermons.ts`, `site.ts`, `staff-directory.ts`, `watchwords.ts`, plus
`rateLimit.ts` (basic rate limiting, likely for `/api/contact`) and
`cloudinary-loader.ts` (custom `next/image` loader pointing at Cloudinary).

## Integrations (all optional / env-gated, per README)

- Cloudinary — image hosting + `/api/cloudinary/sign` for signed uploads
- Stripe — dependency present; no `/api` route found for checkout/webhooks
  yet (see [[Tasks]])
- Resend — transactional email (contact form, likely)
- Behold — Instagram feed via `/api/instagram`
- Google Analytics / Ads, YouTube Data API, a Google Sheets webhook
