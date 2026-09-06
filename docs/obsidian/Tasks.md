---
project: cacnorthamerica
type: tasks
status: active
last_updated: 2026-09-05
tags: [project/cacnorthamerica]
---

# Tasks / Gaps

Related: [[Project]] · [[Features]] · [[Architecture]] · [[Decisions]]

## Convention-merge follow-up (in progress, 2026-09)

Phase A (bilingual routing foundation) is done: every public route moved
under `app/(site)/[locale]/`, Nav/Footer are genuinely bilingual, the site
builds and prerenders cleanly at both `/en/...` and `/yo/...`.

Phase B (data reconciliation) is also done, stacked on Phase A's branch:
`lib/conventions.ts` now carries 2027's real pricing tiers and the 2020
virtual-convention venue override (both diffed field-by-field against
Convention's `lib/content/convention.ts` -- see [[Decisions]]), schedule
sessions carry the same `audience` targeting Convention's data had, and the
register flow has the staff-passcode-gated Complimentary tab and a
check-in QR on the confirmation page, both ported from Convention and
verified end-to-end against the local dev server.

Phases C-F are also done now (stacked further on Phase B's branch, one PR
per phase, all verified via build + typecheck + manual browser walk -- see
[[Decisions]] and [[Changelog]] for what actually landed and why):

- **Phase C** (merge the 5 overlapping top-level pages): `/contact` gained
  a Convention Committee block, `/about` gained an "About the Convention"
  section plus the real 1976/Rev. Goke Oyedeji founding fact, `/online`
  gained a convention-week-only session playlist embed. `/giving` and
  `/blog` needed no changes -- both verified to already fully cover what
  Convention's versions said (CACNA's "Village Pay Off" account numbers
  already matched exactly; CACNA's blog post on the Chairman's tenure was
  already more detailed than Convention's own version).
- **Phase D** (enrich sub-ministry pages): all 6 (cacma, youth,
  christian-education, good-women, ministers-wives, business-group) now
  show their real 2026 day-by-day convention schedule, transcribed from
  Convention's per-ministry program files. `/children` added as a genuine
  new page (schedule, daily rhythm, 2026 teacher roster) and linked from
  `/ministries`.
- **Phase E** (net-new pages): `/plan-your-visit` (travel, hotels, weather,
  packing list, nearby essentials, rules & etiquette) and a human-readable
  `/sitemap` (grouped by topic, using CACNA's own real route set, not a
  copy of Convention's) -- both linked from the footer.
- **Phase F** (branding cleanup): `lib/site.ts`'s `ROUTES` list was missing
  every sub-ministry page plus `/statement-of-faith` and `/store` --
  fixed. Two stale external links to the standalone Convention site
  (`cacnaconvention.cacsalvationcenter.org`) found and pointed internally
  instead, on the 2026/2027 event detail pages. The anniversary-banner and
  "CACNA Home ↗" items from the original plan turned out to already be
  resolved on CACNA's side -- verified, no change needed.

## Convention-merge: remaining data audit (2026-09-05)

After Phases A-F, did a full pass over every remaining file in Convention's
`lib/content/` to check for anything real that hadn't actually made it into
CACNA yet (the user asked to "keep moving all Convention data"). Found:

- **Already fully covered, verified, no action needed**: `statement-of-faith.ts`
  (CACNA's live `/statement-of-faith` has the identical 12 articles,
  word-for-word), `welcome.ts` (CACNA's homepage `PastorWelcome` component
  already paraphrases the same "Calvary greetings... spirit of excellence"
  message), `leadership.ts` (all 5 named leaders already present on CACNA's
  live, DB-backed `/leadership` page), `archive.ts`'s recurring-speaker
  note and `anniversary.ts` (both already ported in earlier sessions).
- **Real gaps, now ported**: `store-items.ts` -- 12 real Christian
  Education products (Sunday School lessons, Bible study manuals, real
  prices, real photos) were sitting completely unused; added as a new
  `christian_education` category in `lib/conventions.ts`'s `storeProducts`
  (previously empty), with the real product photos copied into
  `public/photos/store/` and a small thumbnail added to `StoreCatalog`.
  `registration-guidelines.ts` and `payment-options.ts` -- informational
  copy (5 guidelines, a free-food note, 3 payment methods) that Convention
  showed on its register page but CACNA's never did; added as a
  "Registration Guidelines" / "Payment Options" section on
  `/events/[slug]/register`, via a new `lib/registrationInfo.ts`. The
  Zelle/Check account details there are the registration-specific ones
  (`cacnaconvention@gmail.com` / Chase 823936908, "CACNA CONVENTION") --
  deliberately kept distinct from `/giving`'s different Village Pay Off
  account, since these serve different purposes (see [[Decisions]]).
- **Deliberately not ported**: `committee.ts`'s 30-member roster -- stays
  off the public site, matching Convention's own restraint (only the
  3-person contact block from `contacts.ts` is public-facing). Would be
  worth a dedicated internal reference/PDF if ever needed, not a public
  page. `external-resources.ts` -- these are outbound links FROM Convention
  TO cacnorthamerica.com; nothing to port on CACNA's side.

## Real Yoruba translation pass, chrome-first (2026-09-05)

Discovered that Convention's own `messages/yo.json` already has real,
reviewed Yoruba for nearly every page merged in Phases C-G -- since much of
CACNA's newly-added UI (register form fields, Convention Committee labels,
plan-your-visit/sitemap/children headings) was itself ported from
Convention's design in earlier phases, the two `Register`/`Contact`/etc.
namespaces line up closely. Wired up real `next-intl` translations
(matching Convention's yo.json exactly, or trivially adapted where CACNA's
English wording differs only cosmetically) for: the entire register form
(`RegisterForm.tsx` + the register page's headings), the Contact page's
Convention Committee role labels, `/plan-your-visit`'s section headings and
nearby-essentials category labels, `/sitemap`'s title, and `/children`'s
coordinator/morning/afternoon labels. Verified live on `/yo/...` in a
browser session.

**Important nuance carried over from Convention's own pattern, not a new
gap**: only page *chrome* (headings, field labels, buttons) is translated.
Substantive content -- registration guidelines, payment option details,
schedule agenda items, nearby-essentials business names -- stays English on
both locales, because Convention's own site does the exact same thing (its
`lib/content/*` data files were never translated either, only the
`messages/yo.json` UI strings around them).

**Second pass (same day)**: went through `/store`, `/online`, `/about`,
`/give`, and the shared `SubConferencePage` component (used by cacma,
good-women, ministers-wives, business-group, christian-education) for any
remaining exact-match strings, rather than translating everything
wholesale. Real wins found and wired up: the entire Store cart/checkout
flow (`StoreCatalog.tsx` -- add/remove/checkout/cart labels, category
names, error text all matched Convention's `Store` namespace almost
verbatim), one CTA on `/online` ("Watch Live on YouTube"), `/about`'s
"Biblically Based"/"Kingdom Focused" sub-headings (part of the Phase C
ported content, so a direct match), `/give`'s single-word hero eyebrow,
and `SubConferencePage`'s default "Executive Committee" heading (safe as
one shared string since Convention's GoodWomen/MinistersWives/BusinessGroup
namespaces all translate their own version of that heading to the exact
same Yoruba phrase, despite differing English wording).

Explicitly did **not** force a translation onto strings that only
loosely matched Convention's wording -- e.g. `/about`'s hero copy, `/give`'s
campaign body text (which lives in `lib/giving.ts`'s shared data array,
not page-level JSX, and would need a data-model change to be locale-aware),
and most of the sub-ministry pages' bespoke intro/theme copy, which is
real CACNA-specific prose that doesn't correspond 1:1 to anything in
Convention's yo.json.

**Third pass (same day)**: the site owner is a Yoruba speaker and asked to
proceed with drafting real Yoruba for the remaining bespoke content
themselves reviewing it, rather than leaving it as English placeholder
indefinitely. Drafted and wired up: all 5 `SubConferencePage`-based pages'
kicker/heading/intro/leaderLabel/highlightLabel/note/relatedLink text (new
`Cacma`/`ChristianEducation`/`GoodWomen`/`MinistersWives`/`BusinessGroup`
namespaces, plus a shared `OfficerTitle` namespace for repeated executive
titles like Secretary/Treasurer/Chairman), the Youth page's entire bespoke
copy (hero, vision/mission/values, history, section headings, meal RSVP,
closing CTA), and `/give`'s three campaign cards -- the last one required
making `lib/giving.ts`'s `GivingCampaign` type carry an optional
`translations.yo` field and a `localizeCampaign(campaign, locale)` helper,
since campaign text lives in a shared data array consumed by three
different components (`/giving`, the blog's `GivingAdWidget`, and the
homepage `Hero` carousel) -- all three now call the helper.

**Every newly-drafted Yoruba string in this third pass carries an explicit
`_translationStatus` note in `messages/yo.json`** (and a code comment in
`lib/giving.ts`) saying it was drafted by Claude and is pending the site
owner's own review -- unlike the first two passes, this isn't Convention's
already-reviewed text, so it needs that explicit flag until confirmed.

Still deliberately left untranslated, same reasoning as before: direct
quotes attributed to named speakers (translating a quote would misrepresent
what they actually said), schedule/agenda item text, and nearby-essentials
business listings.

## Phase H: final data-completeness audit (2026-09-05)

Requested after all of Phases A-G were merged to `master` -- a last check
for anything from Convention that still isn't on cacnorthamerica.com before
deciding whether to archive/retire the Convention repo and its Vercel
project. Found two real, concrete gaps (everything else re-checked --
gallery photos including the 20 children's photos, sub-ministry content,
contacts, statement of faith, store, registration guidelines -- was
already confirmed correctly in place from earlier phases):

- **Sub-ministry photo strips were missing.** Convention's 6 sub-ministry
  pages each embed a real 3-photo strip from the 2025 convention gallery
  right under the hero (e.g. CACMA shows photos 4-6, Youth shows 1-3).
  CACNA's versions had the schedules but never got the photos, even though
  all 41 of the exact same photos already existed in
  `public/photos/gallery/` (used on `/gallery`). Fixed: new
  `components/ministries/PhotoStrip.tsx` (ported from Convention's own
  `components/ui/PhotoStrip.tsx`) + `lib/mainGalleryPhotos.ts` (the same
  41-photo ordered list, so the same slice indices produce the same
  photos), wired into `SubConferencePage` (as an optional `photoStrip`
  prop) and directly into the bespoke Youth page.
- **The register page had no fee ladder.** Convention's register page
  shows the complete early-bird schedule per category (e.g. "$125 through
  Jan 31 -> $150 through Apr 30 -> ... -> $250 at the door") so people know
  when prices increase; CACNA's only ever showed the current adult rate as
  a one-liner. The tier data already existed in `lib/conventions.ts`
  (`ConventionYear.pricingTiers`) -- just needed a "Registration Fees"
  section built and wired in, with a "Current Rate" badge on whichever
  tier is active today. Real Yoruba for the two new labels (`pricingHeading`,
  `pricingCurrentBadge`) came from Convention's own already-reviewed
  `Register` namespace.

Remaining, not yet done:

- **Everything else beyond Nav/Footer/the pages above** --
  `messages/yo.json` is honest English-placeholder content everywhere else
  right now (see [[Decisions]]). Needs a native-speaker review pass, not
  just more of what I can generate myself.
- **Per-page internal links aren't locale-prefixed yet** -- a page's own
  body content (CTAs inside `components/sections/*`, individual page
  components) still hardcodes bare hrefs like `/about`. These still work
  (next-intl's middleware redirects a bare path to the default locale) but
  cost an extra redirect hop instead of linking directly. Worth cleaning up
  page-by-page as each one gets touched for real translation, rather than
  a separate blanket sweep. (New pages added in Phases D-E were written
  with locale-prefixed links from the start, so this gap doesn't grow.)
- A **real content-fact discrepancy found but not resolved**: Convention's
  `lib/content/payment-options.ts` lists a *different* Chase account number
  (823936908, "CACNA CONVENTION") than the one on both sites' Village Pay
  Off campaign (823986275) -- these appear to be two genuinely different
  accounts (one for registration check-payments, one for general Village
  giving) rather than a stale duplicate, but this should be confirmed with
  the site owner rather than assumed.
- The 30-member Convention & Conference Committee roster
  (Convention's `lib/content/committee.ts`) was deliberately **not** ported
  to the public `/contact` page -- only the 3-person contact block was
  (chairman/secretary/general inquiries), matching Convention's own
  restraint. The fuller roster may be worth a dedicated page/PDF someday if
  ever needed publicly.

## Content

- **Primary ongoing task**: the site still ships with cac-salvation-center's
  own content (copy, staff names, event details, blog posts) in most places
  — this is being replaced page by page with real CAC North America content
  and data (stated directly in README's "Content status" section). Most of
  the commit history to date is this replacement work; it is not finished.

## Stripe integration (now wired up)

`api/register`, `api/store/checkout`, and `api/stripe/webhook` were added
when the Convention site's registration/store flows were brought in-house
-- see [[Architecture]]. Whether this uses the `products`/`orders` Supabase
tables or `lib/conventions.ts`'s own in-code catalog/pricing is worth
double-checking if working on checkout -- confirmed as of this writing that
pricing/catalog data comes from `lib/conventions.ts`, not those tables.

## Admin coverage vs. site content

Admin console covers announcements, blog, events, gallery, newsletter,
orders, and admin users — but public pages also pull from `departments`,
`leaders`, `tenets`, `churches`, `site_content`, and `site_settings`, none
of which have an obvious admin UI in `app/admin/(protected)`. If those are
meant to be editable without a direct SQL/Supabase-studio edit, admin pages
for them may be a gap.

## No automated test suite found

No test runner/config (`jest`, `vitest`, `playwright`, etc.) appears in
`package.json`. Confirm this is intentional for a content site before
adding CI test requirements.

## Homepage hero + nav follow-ups (2026-09-05)

The hero/nav redesign (see [[Changelog]] and `docs/superpowers/specs/2026-09-05-homepage-hero-nav-redesign-design.md`) is implemented, but real video files still need to be supplied by the site owner at `public/videos/welcome-hero.mp4` and `public/videos/convention-hero.mp4` -- until then, the Welcome/Convention hero slides show their poster image, same as before this change visually.

Also surfaced during that conversation, not yet started:
- Two calendar events to add to `lib/events.ts`'s `specialEvents`: the HOPE Annual Summit (Sept 12, 2026) and the CACMA Latunde Region prayer/fasting meeting (real Zoom details already provided).
- Connecting the registration flow's Google Sheets logging (`lib/sheetsWebhook.ts`) to the site owner's own Google account/spreadsheet, and confirming the Zelle/payment details shown on the register page are correct.
