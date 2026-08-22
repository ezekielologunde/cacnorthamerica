---
project: cacnorthamerica
type: features
status: active
last_updated: 2026-08-22
tags: [project/cacnorthamerica]
---

# Features

Related: [[Project]] · [[Architecture]] · [[Changelog]]

## Public site

- Homepage: hero/news/events/ads carousel, welcome message from the
  Regional Superintendent, 50th anniversary section, photo marquee, Watch
  (video) section, Upcoming Programs, Latest News
- About — CACNA's regional story (rewritten to read as a region, not a
  single church)
- Ministries directory — interactive directory of department histories
  (CACMA, Music, Evangelical, Christian Education, Bible Institute, Good
  Women, Ministers' Wives, Youth & Young Adult, Business Group)
- Leadership — current leaders + Past Leaders (Secretaries, Treasurers,
  Superintendents) with real photos, clickable/viewable site-wide
- Zone Directory / "Find a Church Near You" — geolocation-based nearest-
  church search over the `churches` table, with an honest coverage-gap
  message when the closest church is far away
- Events + Calendar
- Blog — categorized, each category has its own hero band; masthead redesign
- Gallery — Cloudinary-backed photo gallery, including real convention
  photos pulled from cacnaconvention.org
- Giving/store — cart context (`CartContext.tsx`), products/orders tables
- Contact — form backed by `/api/contact`, likely rate-limited and emailed
  via Resend
- Newsletter signup
- CAC World News feed (`cac_world_news` table, added 0004)
- Statement of Faith / Tenets
- Watchwords (Yorùbá watchword featured on homepage)
- Convention cross-linking — content, hotel/travel/rules info, and photos
  pulled from the dedicated cacnaconvention.org site rather than duplicated
  registration logic

## Admin console (`/admin`, Supabase-Auth gated)

- Announcements, blog, events, gallery, newsletter, orders, admin users
- Login page at `/admin/login`; all other `/admin/*` routes protected by
  `proxy.ts` middleware

## Accessibility

- A dedicated accessibility audit pass fixed 6 WCAG 2.1 AA issues
  (commit `46160b2`)

## Removed / not carried forward from the donor site

- `testimonies` and `prayer_requests` — tables and features dropped
  (migration 0008)
- Convention registration flow — `convention_registrants`,
  `convention_registrations`, `convention_pricing_tiers`,
  `convention_schedule_sessions` dropped (migration 0009) in favor of
  linking out to the dedicated Convention site
- Instagram block — removed from the homepage during a copy pass
  (commit `886cc94`), though `/api/instagram` (Behold-backed) still exists
