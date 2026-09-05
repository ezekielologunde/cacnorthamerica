---
project: cacnorthamerica
type: changelog
status: active
last_updated: 2026-09-05
tags: [project/cacnorthamerica]
---

# Changelog

Related: [[Project]] · [[Decisions]] · [[Features]]

## 2026-09-05 — Convention data reconciliation, staff-passcode gate, check-in QR

Second phase of merging the Convention site into CACNA (see [[Decisions]]),
stacked on the i18n branch below. `lib/conventions.ts` gained 2027's real
pricing tiers and 2026's schedule sessions gained the `audience` field,
both ported from Convention's `lib/content/convention.ts` after a
field-by-field diff; also recorded that the 2020 convention was virtual
(COVID) via a new optional `venue` override, surfaced on the archive page.
The register flow (`RegisterForm`, `/api/register`) gained a third
"Complimentary" tab gated by a server-checked `STAFF_PASSCODE`, and the
confirmation page now renders a check-in QR code once payment (or a free/
comp registration) is confirmed -- both via a new `lib/checkoutSummary.ts`
carrying registration details through the URL and Stripe metadata, the same
pattern Convention's own Supabase-removal rewrite used. Verified end-to-end
against the local dev server: Complimentary tab renders, wrong passcode
403s, correct passcode logs to Sheets and renders a real QR on confirmation.

## 2026-09-05 — Bilingual (en/yo) routing foundation

First phase of merging the Convention site into CACNA (see [[Decisions]]).
Added next-intl, moved every public route under `app/(site)/[locale]/`,
made Nav/Footer genuinely locale-aware (including fixing a stale
`FooterExperience` link that pointed external to the standalone Convention
site's registration page -- it now points at whatever this site's own
current-year convention register/save-the-date route is). `npm run build`
prerenders ~140 pages at both `/en/...` and `/yo/...`; `/admin/**` and
`/api/**` are unaffected. Individual page content isn't translated yet
beyond Nav/Footer -- see [[Tasks]].

Condensed from `git log --oneline`. The project's history is almost
entirely a single long stream of content/copy/UX passes on top of a schema
and admin console that arrived complete via the fork — key milestones below.

## Foundation (schema + port)

- Initial schema: `profiles`, `events`, `departments`,
  `sermons_livestreams`, `announcements`, `churches`, `media`,
  `site_content`, `site_settings` (0001)
- Leadership, zones, and event-registration schema added (0002)
- Full schema replacement to port the cac-salvation-center app structure:
  `admin_profiles`, `blog_posts`, `contact_submissions`, `gallery_images`,
  `newsletter_subscribers`, `products`, `orders`, `prayer_requests`,
  `testimonies` (0003)
- CAC World News table added (0004)

## Leadership & content build-out

- Real photos added progressively for zone/DCC superintendents, past
  Secretaries/Treasurers, and CACNA leaders (commits `618404d` through
  `fedbae7`, `c402ce1`, `a7c0559`)
- Real ministry histories added for CACMA, Music, Evangelical, Christian
  Education departments
- Ministries page redesigned into one interactive directory (`f068943`)

## Homepage iteration (heaviest churn area)

Many redesigns/reversions of the homepage hero — carousel vs. slideshow vs.
static welcome, Instagram block added then removed, multiple "consolidate
sections" and "revert" pairs (e.g. `a2a2430` → `a1359e0` revert), settling on
a "news/events/ads carousel — the college site pattern" (`e055b72`) with a
later redesign adding shared gradient tokens, real video Watch section, and
photo marquee (`6fb8cd8`).

## Feature drops / scope narrowing

- `testimonies` and `prayer_requests` tables dropped (0008)
- Convention registration schema added then dropped again once the decision
  was made to cross-link the dedicated Convention site instead (0007, then
  0009, `1522461`)

## Zone Directory / church finder

- Iteratively built the "Find a Church Near You" geolocation search over
  multiple passes adding real member-church addresses zone by zone
  (`6e11483`, `f221475`, `767234a`, `ebbcbc5`, `908c915`), plus an honest
  coverage-gap message (`2c805e2`)

## Accessibility & correctness passes

- 6 WCAG 2.1 AA issues fixed in an audit pass (`46160b2`)
- Canonical domain fixed across sitemap/llms.txt/SITE_URL (`e352201`,
  `7e0daf1`)

## Recent (latest commits)

- Enriched Christian Education content from the 2026 CED convention
  booklet; added 3 real churches (`08c785a`)
- Cross-linked CACNA with the dedicated Convention site (`1522461`)
- Brought Convention handoff content onto CACNA: Statement of Faith,
  gallery, department pages (`dbf0f68`)
- Added a dedicated Youth & Young Adult page (`9ca08d1`)
