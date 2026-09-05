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
verified end-to-end against the local dev server. Still pending, roughly
in order:

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
  a separate blanket sweep.
- **Merge the overlapping top-level pages**: `/about`, `/contact`,
  `/giving`, `/online`, `/blog` each have their own independently-built
  Convention-site counterpart with different (event-specific) scope that
  hasn't been folded in yet -- e.g. a "Convention Committee" contact block
  for `/contact`, verifying `/giving`'s existing Village Pay Off campaign
  already covers what Convention's version said.
- **Enrich cacma/youth/christian-education/good-women/ministers-wives/
  business-group** with Convention's day-by-day schedules (this repo's
  versions currently have leader/history summaries only); add `/children`
  as a new page (no CACNA equivalent exists).
- **Port `/plan-your-visit`** and a human-readable `/sitemap` page -- the
  two genuine gaps with zero CACNA equivalent.
- Branding cleanup: the stale `FooterExperience`
  "Annual Convention" link (already fixed to point internally, see
  [[Changelog]]) was the main one; still worth a pass over `lib/site.ts`'s
  JSON-LD and `ROUTES`/sitemap coverage once new routes exist.

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
