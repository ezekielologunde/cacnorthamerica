---
project: cacnorthamerica
type: features
status: active
last_updated: 2026-11-08
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
- Blog posts can carry a credited click-to-play YouTube video (`video` field in `lib/blog.ts`, rendered with `VideoFacade` on `blog/[slug]`); videos shown in the Featured stories band come from `lib/featuredStories.ts` (PR #156)
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
- Forms overview `/admin/forms`: every site form, where its submissions go, and
  live row counts for the ones stored in the database
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
- Yoruba locale -- removed 2026-09-16 (PR #36)
- In-app `/youth` page -- `/youth` and `/yyam` now redirect to
  `https://yyam.cacna.org/` (PR #135, `next.config.ts`)

## Added 2026-09 to 2026-11 (verified in git log / code)

Implemented unless marked otherwise. Details in [[Payments]], [[Backend]].

- Forms directory: public `/forms` page grouping every form (contact, newsletter,
  convention and youth registration, serve, give, cancel a recurring gift, store)
  with what each is for and a link; admin `/admin/forms` adds where submissions
  go and row counts. Both read `lib/siteForms.ts`. See [[Frontend]].
- Convention registration with per-person 4-character check-in codes, adult
  fields, QR dropped (PR #82); Youth & Child registration (PR #80)
- Staff check-in lookup `/admin/check-in` (PR #83); pay registration by Zelle
  with staff "Mark paid" (PR #84)
- Giving page: Stripe checkout (embedded, PR #103; hosted by default, PR
  #106), Zelle pledges (`/api/giving/zelle`), optional ACH bank gifts (PR
  #95), large-gift confirmation (PR #114), Offering/Tithe/projects redesign
  (PR #127)
- **Partial (off by default):** recurring gifts, monthly / every 2 weeks,
  tithe and projects only, behind `GIVING_RECURRING_ENABLED` (PRs #129-#133)
- Store: 2026 convention flash drive, $20, marked sold out (PRs #117, #118)
- Cloudflare Turnstile on public forms (PRs #109, #111, #112, #115)
- `/serve` volunteer sign-up (PR #136)
- Admin password reset (PR #107); admin `operations` page reading the Apps
  Script `doGet` (PR #113)
- Pages: accessibility, faq, history, privacy, refunds, terms (present under
  `app/(site)/[locale]/`)
- **Partial (off until env set):** blog-only AdSense unit (PR #123)
- **Partial (off until `NEXT_PUBLIC_ADSENSE_ID` is set):** AdSense auto-ads script on **blog pages only** (rule in `lib/adsense.ts`, owner decision 2026-11-06), public `/ads.txt` built from the same variable (404 while unset), and robots/sitemap tuned for AdSense's crawler. Owner steps in `docs/adsense-readiness.md` (PR #73)
- **Children's Ministry care details (2026-11-08):** the Youth & Child
  registration collects, for each child 12 or under, allergies (type and
  severity), medical notes, medications, dietary and special needs and photo
  consent, plus a shared family block (emergency contact, up to 4 authorized
  pickups, guardian consent). Stored in `cacna.child_care_details`
  ([[Database]]); check-in staff see an allergy flag and care summary on
  `/admin/check-in` and a printable sheet at `/admin/check-in/children`.
  **Needs migration 0026 applied before deploy**; legal wording not yet
  reviewed. See [[Security]], [[Tasks]].
- **Shared navigation (2026-11-08):** header and footer render one list
  (`lib/nav.ts`), with the current page highlighted. See [[Frontend]].
- **Yoruba-friendly touches (2026-11-08):** inline Yoruba phrases
  (`lib/yoruba.ts`) on the otherwise English site; native-speaker review
  pending ([[Tasks]]).
- **Home shows admin-published content (2026-11-08):** posts and events
  published in `/admin/blog` and `/admin/events` appear on the home page as
  well as `/blog` and `/calendar`.
- **Scheduled content refresh (2026-11-08):** a daily Vercel Cron job refreshes
  the CAC World News feed and public pages; admin saves refresh immediately.
  Needs `CRON_SECRET` set. See [[Backend]], [[Architecture]].
