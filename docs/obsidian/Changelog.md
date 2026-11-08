---
project: cacnorthamerica
type: changelog
status: active
last_updated: 2026-11-08
tags: [project/cacnorthamerica]
---

# Changelog

Related: [[Project]] · [[Decisions]] · [[Features]] · [[Payments]] · [[Security]]

## 2026-11-08 -- video blog posts, Pastor Agbeja interview (PR 156)

- Blog posts can now carry an optional `video` (YouTube id, title, channel, channel link), shown click-to-play above the text with a credit line. Rendered by `VideoFacade` in `app/(site)/[locale]/blog/[slug]/page.tsx`. The field exists only in `lib/blog.ts`; posts created in the admin console cannot set it.
- Added the Ancient Alters #0001 interview with Regional Superintendent Pastor Dr. T.A.O. Agbeja as a Featured story (`lib/featuredStories.ts`) and as the blog post `pastor-agbeja-ancient-alters-interview`. The write-up uses only the video's published description.

## 2026-11-07 -- secrets kept out of analytics, one AdSense ID (PR 155)

- Mergestorm review of #73: a padded AdSense ID gave `ads.txt` a valid line but a bad script URL, and only `/register/confirmation` was stripped from GA `page_location`. Both fixed.
- `adsenseClientId()` is now the single normalizer (`ads.txt`, `AdSenseScript`, `BlogAd`, `GoogleTags`, `google-adsense-account` meta). `BlogAd` no longer loads `adsbygoogle.js` itself.
- Query stripped from GA `page_location` and from Vercel Analytics / Speed Insights URLs on the three confirmation pages and `/giving/cancel` (and `/admin` for Vercel); confirmation pages send `no-referrer`. Google tags moved out of the root layout so `/admin` never loads them. Details and the GA4 setting to change: [[Security]].
- `scripts/check-adsense.mjs` now runs in `npm test`.

## 2026-11-06 -- registration contact fields and Quick help

- Adult form: one required **DCC / Zone / Church** field (people who do not know their zone enter their church). Youth form: DCC / Zone is optional (church name is already required).
- **Phone is required** on both forms (client and server, at least 7 digits).
- New **Quick help** panel (`components/register/QuickHelp.tsx`) on both registration pages: how to register, unknown DCC/zone, confirmation email, Zelle and card help, contact links. Support wording only; no refund text.

## 2026-11-06 -- optional gift on convention registration
- Card payments on both registration forms can add an optional gift ($1 to $5,000). It is its own Stripe line item, recorded in the session summary (`gift`), logged as a separate `Giving` row and receipted with the giving email. The registration row's Total and Amount Charged exclude it. The processing fee is still sized on the registration only, so the church absorbs Stripe's percentage on the gift. Zelle and free registrations are not offered it. See `lib/registrationGift.ts`.

## 2026-09-10 to 2026-11-05 -- summary from `git log origin/master --first-parent`

PR titles are the source; details in the linked notes.

- 2026-09-16 #36 Yoruba locale removed; single-locale English, plain URLs
- 2026-11-06 AdSense limited to blog pages only (`/blog`, `/blog/*`).
- 2026-11-05 #73 AdSense readiness: env-gated site-wide script, `/ads.txt`,
  robots/sitemap updates, breadcrumb JSON-LD on blog posts, owner checklist in
  `docs/adsense-readiness.md`
- 2026-11-01 #38 canonical host `cacnorthamerica.com`; #44/#46 form spam
  guards and contact honeypot; #45 purpose email addresses
- 2026-11-02 #71 disclosed processing-fee line on every Stripe Checkout; #80
  Youth & Child registration; #82 per-person check-in codes, QR dropped; #83
  staff check-in page + `checkin_people` (0015); #84 Zelle registration +
  mark-paid (0016); #85 logo in designed emails
- 2026-11-03 #95 optional ACH gifts; #97 Zelle giving records the pledge
  before emailing; #99 canonical host `cacna.org`; #102 contact/mail-from
  on `@cacna.org`; #103/#105/#106 Stripe embedded checkout, hosted default;
  #107 admin password reset; #109/#111/#112/#115 Cloudflare Turnstile; #113
  Apps Script `doGet` for the admin Operations page; #114 large-gift confirm
- 2026-11-04 #121-#123 AdSense (blog-only, off until env set) and CSP;
  #116/#119 "26 Zones & DCCs"; #117/#118 flash drive (sold out); #125-#128
  giving redesign; #129-#133 recurring gifts behind `GIVING_RECURRING_ENABLED`
  (0018); #135 `/youth`, `/yyam` -> `yyam.cacna.org`
- 2026-11-05 #136 `/serve` page and volunteer form (0019)
- 2026-11-05 docs: added [[Database]], [[Backend]], [[Frontend]],
  [[Security]], [[Payments]], [[Bugs]]; i18n and canonical-host notes marked
  superseded

## 2026-09-07 — Canonical host restored to cacna.cacsalvationcenter.org

`cacna.cacsalvationcenter.org` is now attached to the `cacnorthamerica` Vercel project and serving the site, so the `SITE_URL` default in `lib/site.ts` goes back to it (PR #31 had reverted it to `cacnorthamerica.vercel.app` while the subdomain was not wired up). Until this ships, every page's canonical, hreflang alternates and the sitemap declare the vercel.app host, so Google indexes vercel.app and treats the subdomain as a duplicate; Search Console on the sibling site cannot see the subdomain at all (only a `www.cacsalvationcenter.org` URL-prefix property is verified there). Added a permanent host-based redirect in `next.config.ts` from `cacnorthamerica.vercel.app` to the subdomain for every non-API path, and `.env.example` now shows the expected `NEXT_PUBLIC_SITE_URL`. The Vercel env var and the Supabase redirect allow-list still have to be updated by hand: see [[Tasks]].

## 2026-09-07 — Dead cacnaconvention.org link removed from the 2026 convention data

Found while cross-checking dead links on the sibling church site: `cacnaconvention.org` (the vendor page used for 2026 registration payments — a different domain from `cacna-convention.vercel.app`) returns "403 Access forbidden!" to a normal browser, not just bots. `lib/conventions.ts`'s 2026 entry no longer has a `registrationUrl` — matches the 2020/2024 archived entries, which also have none, since the convention is over and there's nothing to register for. `app/(site)/[locale]/events/cacna-2026/page.tsx`'s `CACNA_REG` is now `cy2026.registrationUrl` (no longer non-null-asserted): the JSON-LD `Offer` is omitted entirely when it's undefined instead of citing a dead URL, and the two CTA buttons (already correctly hidden once the event is past) are now also guarded on `CACNA_REG` being set, not just on `!isPast`. The parallel dead link on the sibling site (`cacnaconvention.org` hardcoded in its own blog CTA and its own `/events/cacna-2026` page) is fixed there directly.

## 2026-09-05 — Homepage hero video background + Ministries nav mega-menu

Implemented the approved design (see `docs/superpowers/specs/2026-09-05-homepage-hero-nav-redesign-design.md`). The Welcome and Convention hero slides now use a `video` background (poster-fallback, since no real video file has been supplied yet -- `public/videos/welcome-hero.mp4` and `public/videos/convention-hero.mp4` are placeholders for the site owner to fill in); the other 4 slides are unchanged. Removed the floating ambient background words (GRACE/FAITH/HOPE/LOVE/FAMILY) since the video already supplies motion. Added a "Ministries" mega-menu to the primary nav (2-column grid, text-only) linking all 6 sub-ministry pages plus `/children`, so content added during the Convention merge is finally discoverable from the nav bar instead of only `/ministries` or the footer; removed the now-redundant `/ministries` link from the "Who We Are" dropdown.

## 2026-09-05 — Phase H: final data-completeness audit, two real gaps fixed

Ran a full audit of every remaining Convention data source before deciding
the fate of the Convention repo/Vercel project. Found two real gaps: the
6 sub-ministry pages were missing the 3-photo strips Convention's own
versions show (fixed via a new `PhotoStrip` component + `lib/
mainGalleryPhotos.ts`, reusing photos already self-hosted for `/gallery`
-- no new assets needed), and the register page had no full fee ladder
(fixed -- a new "Registration Fees" section shows every price tier per
category with a "Current Rate" badge, sourced from data already in
`lib/conventions.ts`). Everything else re-checked in this pass (gallery
photos, sub-ministry content, contacts, statement of faith, store,
registration guidelines) was already correctly in place.

## 2026-09-05 — Drafted Yoruba for all sub-ministry pages, Youth, and Give (site owner reviewing)

Third translation pass, same day. Unlike the first two (which only carried
over Convention's own already-reviewed Yoruba), this one drafts genuinely
new Yoruba text -- the site owner is a Yoruba speaker and asked to proceed
on that basis, reviewing the draft directly rather than leaving it as
placeholder indefinitely. Covers: all 5 `SubConferencePage`-based pages
(cacma, christian-education, good-women, ministers-wives, business-group),
the Youth page's full bespoke copy, and `/give`'s three campaign cards.
The Give work required a real structural change -- `lib/giving.ts`'s
`GivingCampaign` type now carries an optional `translations.yo` field and
a `localizeCampaign()` helper, since that data feeds three different
components (`/giving`, the blog's `GivingAdWidget`, and the homepage
`Hero` carousel). Every drafted string is flagged with `_translationStatus`
in `messages/yo.json` pending the owner's review. Direct quotes, schedule
content, and business listings still deliberately stay English -- same
reasoning as the first two passes.

## 2026-09-05 — More real Yoruba: store, online, about, give, sub-ministry chrome

Second translation pass, same day. The entire Store cart/checkout flow
(`StoreCatalog.tsx`) is now genuinely bilingual -- add/remove/checkout
labels, cart headings, category names, and error text all matched
Convention's `Store` namespace almost verbatim. Also wired up: one CTA on
`/online`, `/about`'s "Biblically Based"/"Kingdom Focused" sub-headings,
`/give`'s hero eyebrow, and `SubConferencePage`'s shared "Executive
Committee" default heading (now an async component so it can call
`getTranslations`). Deliberately left the sub-ministry pages' bespoke
intro/theme copy and `/give`'s campaign body text (in `lib/giving.ts`,
not page-level JSX) untranslated -- neither has a safe 1:1 match without
either rewriting real content or restructuring the data model.

## 2026-09-05 — Real Yoruba translations: register, contact, plan-your-visit, sitemap, children

Discovered Convention's `messages/yo.json` already has real, reviewed
Yoruba matching most of what was just merged into CACNA (since that UI was
itself ported from Convention's own design). Wired up genuine `next-intl`
translations for the register form and page headings, the Contact page's
Convention Committee labels, `/plan-your-visit`'s headings and category
labels, `/sitemap`'s title, and `/children`'s coordinator/morning/afternoon
labels -- verified live on `/yo/...`. Following Convention's own pattern,
only UI chrome is translated; substantive content (guidelines, schedules,
business listings) stays English on both locales, same as it does on
Convention itself.

## 2026-09-05 — Remaining Convention data: store catalog, registration info

Final data-audit pass of the Convention merge. Checked every remaining
`lib/content/*` file in Convention against CACNA: `statement-of-faith.ts`,
`welcome.ts`, `leadership.ts`, `archive.ts`, and `anniversary.ts` were all
already fully covered (verified, no changes). Two real gaps found and
ported: a real 12-product Christian Education catalog (Sunday School
lessons, Bible study manuals, with real prices and photos) that was sitting
completely unused -- added as a new `christian_education` store category
with real product photos in `public/photos/store/` and a thumbnail added
to `StoreCatalog`; and registration guidelines + payment options copy,
added to `/events/[slug]/register` via a new `lib/registrationInfo.ts`.
The 30-member Convention Committee roster stays off the public site,
matching Convention's own restraint.

## 2026-09-05 — Content merge Phases C-F: overlapping pages, sub-ministry schedules, net-new pages, branding cleanup

Third phase of merging the Convention site into CACNA (see [[Decisions]]),
stacked on Phase B's branch. `/contact` gained a 3-person "Convention
Committee" block; `/about` gained an "About the Convention" section plus
CACNA's actual 1976 founding (Rev. Goke Oyedeji, Brooklyn NY) which wasn't
on the page before; `/online` gained a convention-week-only YouTube
playlist embed (separate from the existing single-video live-check).
`/giving` and `/blog` needed no changes after verification. All 6
sub-ministry pages (cacma, youth, christian-education, good-women,
ministers-wives, business-group) gained their real 2026 day-by-day
schedule, transcribed from Convention's per-ministry program files;
`SubConferencePage` gained an optional `schedule` prop for this. Added
`/children` (new) and linked it from `/ministries`. Added `/plan-your-visit`
(travel/hotels/weather/packing/nearby essentials/rules) and a
human-readable `/sitemap`, both linked from the footer. Fixed `lib/site.ts`'s
`ROUTES` list (was missing every sub-ministry page) and two stale external
links to the standalone Convention site on the 2026/2027 event pages.
Verified via `npm run build` + `tsc --noEmit` + a manual browser walk of
every new/changed page.

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
- Added the CACNA Singles Ministry Virtual Game Night (Sat Oct 31, 2026, 6:00 PM ET, Zoom, link TBA) to `specialEvents` in `lib/events.ts`; text-only, no detail page or flyer yet; end time 8:00 PM is an assumption
- Added Bible Study 31 "Offerings from the Tribal Leaders" (Numbers 7), Study 33 "Consequences of Complaints" (Numbers 10–11) and Study 34 "Miriam's Rebellion" (Numbers 12) as Reflection posts in `lib/blog.ts`
- Added Bible Study 35 "The Twelve Spies" (Numbers 13), Study 36 "Israel's Fear and Rebellion" (Numbers 14) and Study 37 "Offerings' Ordinance in Canaan and Korah's Rebellion" (Numbers 15–16) as Reflection posts in `lib/blog.ts`
- Added the Business Group Fellowship Quarterly Summit "Investment: Triple Net" (Mon Oct 26, 2026, 8:30 PM ET, Zoom) to `specialEvents`; already past, so it lists under Past events on /calendar; Zoom meeting ID/passcode deliberately not published; end time 10:00 PM is an assumption
- Added a Golden Jubilee look-back page (`/golden-jubilee`) for the 50th anniversary celebrated Oct 10, 2026 at CAC Village; facts only from the printed programme (no photos, adverts or giving details); listed in the sitemap and search, linked from /history and /about
- Updated `cacna.leaders` from the Golden Jubilee brochure p12 (migration 0020, applied to the live project 2026-11-05 at the owner's instruction): replaced the superintendents of Bethel DCC (Olowomeye), Western DCC (Adeleke), South Florida DCC (Olukitibi) and Philadelphia Zone (Ademoye) with their old photos and bios cleared; added zones Staten Island, Ontario and Winnipeg; added Agbeja's Chancellor (Bible Institute) role; appended regional roles to seven superintendents; spellings Aroniyi and Zaccheaus. `zone_name` values were not renamed (the brochure says "Vineyard of Comfort" where the table says "Agbala Itura"; lib/churches.ts matches names exactly, so that rename needs a coordinated code change)
