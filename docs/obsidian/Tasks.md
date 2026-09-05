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

Remaining, not yet done:

- **Real Yoruba translations** for every page beyond Nav/Footer --
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
