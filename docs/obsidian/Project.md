---
project: cacnorthamerica
type: project-overview
status: active
last_updated: 2026-08-22
tags: [project/cacnorthamerica]
---

# CAC North America (cacnorthamerica)

Public website and admin console for **Christ Apostolic Church North America
(CACNA)**, the regional corporate body over CAC's member churches and zones
in North America.

## Origin

The codebase is a **full fork of a sibling site, cac-salvation-center.org**
(same owner, ported with permission), re-pointed at this project's own
Supabase backend. Content is being replaced page-by-page with real CACNA
content — the git history is almost entirely a long series of content and
copy passes rather than feature engineering, which reflects that origin: the
app shell, schema, and admin console arrived essentially finished from the
donor project. See [[Changelog]].

## Purpose

- **Public site**: home, about, ministries, leadership, events, blog,
  gallery, giving/store, contact, zone/church directory ("Find a Church Near
  You"), Bible Institute, Christian Education, CACMA, Good Women, Ministers'
  Wives, Youth & Young Adult, Business Group, watchwords, statement of faith.
- **Admin console** (`/admin`): announcements, blog, events, gallery,
  newsletter, orders, admin users — gated behind Supabase Auth, requires
  `SUPABASE_SERVICE_ROLE_KEY`.
- Cross-linked with a dedicated **Convention site** (cacnaconvention.org) —
  content and photos have been pulled in from there rather than duplicating
  a full registration flow (see [[Decisions]]).

## Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (Postgres, Auth, Row Level Security)
- **Payments**: Stripe (`stripe` SDK) — used for the store/giving flow
- **Email**: Resend
- **Media**: Cloudinary (image hosting/transform), Cloudinary loader for
  `next/image`
- **Analytics**: Vercel Analytics + Speed Insights, Google Analytics/Ads
  (optional, env-gated)
- **Misc integrations**: Behold (Instagram feed), YouTube Data API, a
  Google Sheets webhook — all optional, no-op gracefully if env vars are
  blank (per README)
- **Deployment**: Vercel, auto-deploy from `master`

See [[Architecture]] for how these pieces fit together, [[Features]] for
what's implemented, and [[Decisions]] for notable choices visible in the
code and commit history.

## Scope notes (what this project deliberately does NOT have)

- No `Database.md`/`Backend.md` split — the backend is entirely Supabase
  (schema + RLS), covered inline in [[Architecture]].
- No `Security.md` — auth is a single gate (Supabase Auth + `proxy.ts`
  middleware protecting `/admin`); covered in [[Architecture]] and
  [[Decisions]].
- No `Payments.md` — Stripe is present as a dependency but there is no
  checkout/webhook code under `app/api` yet (only `contact`, `gallery`,
  `instagram`, `cloudinary/sign`); noted as a gap in [[Tasks]].
- This is a **content site**, not a SaaS product — most "features" are
  informational pages backed by Supabase tables editable from `/admin`.
