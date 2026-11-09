---
project: cacnorthamerica
type: decisions
status: active
last_updated: 2026-11-08
tags: [project/cacnorthamerica]
---

# Decisions

Related: [[Project]] · [[Architecture]] · [[Features]]

## Children's care details extend the Youth & Child registration (2026-11-08)

One form, one submission: the existing parent/guardian block is the guardian for
every child, and anyone 12 or under (`CHILD_CARE_MAX_AGE`) gets a care panel;
siblings share one family block. A separate children's system was not built.
Care data is stored in its own service-role-only table, fails closed, and is kept
out of the sheet, email, Stripe and URL token. Retention is a purge after each
convention (owner decision). See [[Security]], [[Database]].

## No browser draft for the registration form (2026-11-08)

The form writes nothing to `sessionStorage` or `localStorage` (owner decision),
so a child's medical details typed into it never outlive the page. The cost is
that a reload loses what was typed. See [[Security]].

## Daily cron, not sub-daily (2026-11-08)

The content refresh runs once a day (`0 9 * * *`) because the project is on
Vercel Hobby, which rejects sub-daily cron schedules (per
`docs/cron-refresh-content.md`, confirmed by a failed deploy). Admin saves
refresh at once and timers cover the rest. Revisit if the plan changes. See
[[Architecture]], [[Backend]].

## Keep a single English locale with Yoruba-friendly content (2026-11-08)

The site stays single-locale English (see [[Architecture]]); Yoruba appears only
as short inline phrases (`lib/yoruba.ts`) marked `lang="yo"`, limited to
standard phrases. No translation is added that a native speaker has not
confirmed. See [[Frontend]].

## Convention registration gift: its own line, fee not passed on (2026-11-06)

A card registration can add an optional gift. It is a separate Stripe line item
and a separate `Giving` row with a giving receipt, so it is receipted as a
donation and the registration fee is not. The processing fee stays sized on the
registration only, so the church absorbs Stripe's percentage on the gift and the
donor's receipt equals what they chose. Zelle and free registrations are not
offered it (no Stripe session to carry it). Charging the fee on the gift too is
a small change if the church prefers. See [[Payments]].

## Merge the Convention site into CACNA, in phases (2026-09)

The Convention site (a dedicated registration/schedule/store site) and
CACNA had been drifting toward one merged site for a while --
registration/schedule/archive/store/meal-request were already "brought
in-house" earlier. The owner then asked to fold in the rest properly:
bilingual (en/yo) support for real (not just flattened to English), the
overlapping pages (about/contact/giving/online/blog exist independently on
both sites with different scope) kept as CACNA's single top-level pages
rather than nested under `/events/...`, CACNA's existing sub-ministry pages
enriched with Convention's day-by-day schedules rather than replaced
outright, and the end goal of CACNA becoming the only site once parity is
confirmed. Given the real size of this (a site-wide i18n retrofit plus
per-page content reconciliation across ~13 pages), it's being done in
ordered, independently-reviewable phases rather than one large change --
see [[Tasks]] for what's landed vs. still pending.

## i18n added via next-intl, mirroring the Convention site's own setup

Rather than design a new bilingual approach, this repo's `i18n/routing.ts`
/ `i18n/request.ts` / the intl half of `proxy.ts` are a direct port of the
Convention site's already-working next-intl configuration (always-prefixed
`/en`/`/yo` URLs, one nested `[locale]` layout adding only
`NextIntlClientProvider`). `/admin` and `/api` stay outside it entirely,
matching how Convention itself exempted its own admin/auth routes.

## Phases C-F content merge: verify before porting, don't pad real lists

For each of the 5 "overlapping" pages, checked what CACNA already had
before writing anything -- two (`/giving`, `/blog`) turned out to already
fully cover Convention's content (identical Village Pay Off account
numbers; a more detailed existing blog post on the Convention Chairman's
tenure than Convention's own terse version) and needed no changes at all.
Only genuine gaps got new content: `/contact`'s Convention Committee block,
`/about`'s Convention-institution section and the real 1976 founding fact,
and `/online`'s convention-week playlist embed (additive to, not replacing,
the existing single-video live-check).

While transcribing Convention's `/plan-your-visit` source data (hotels,
nearby essentials, rules), an early draft padded the "nearby essentials"
list with plausible-sounding but unverified business names to round it out
to a nicer-looking list -- caught and corrected before committing, replaced
with the actual 17 real, sourced entries from Convention's own
`nearby-essentials.ts`. Worth remembering: transcription work is exactly
where fabrication creeps in silently, since a summary of a source file can
read as "close enough" when it's actually incomplete.

The 30-member Convention & Conference Committee roster was deliberately
kept off the public `/contact` page -- only the 3-person contact block
(chairman/secretary/general inquiries) was ported, matching the scope
Convention's own `/contact` page used for the same content.

## Phase B data reconciliation: port real facts forward, flag real conflicts

Diffing `lib/conventions.ts` against Convention's `lib/content/convention.ts`
field-by-field (2026-09-05) found: identical 2026 pricing and identical 2026
schedule content in both, so those needed no changes beyond porting over the
`audience` field Convention's schedule sessions had and CACNA's didn't. Two
real gaps, both resolved by porting Convention's already-correct data rather
than guessing: CACNA had no 2027 pricing tiers at all (Convention's rewrite
had already recorded the real ones, opened early on 2026-07-23), and CACNA's
model had no way to record that 2020's convention was virtual (COVID) rather
than at CAC Village -- added an optional `venue` override on `ConventionYear`
for that one exception rather than a broader schema change. See [[Tasks]].

Also ported from Convention's own recent Supabase-removal rewrite: a
server-checked `STAFF_PASSCODE` gating the Complimentary registration tab
(the tab is publicly visible, but submitting it without the right passcode
403s), and a check-in QR code on the registration confirmation page. Both
needed a `lib/checkoutSummary.ts` (registration details travel encoded in
the confirmation URL and Stripe metadata, since this site also has no
database) -- ported near-verbatim from Convention's version, adjusted to
carry a `year` field since CACNA's register flow is per-year
(`/events/cacna-YYYY/register`) where Convention's is single-edition. The
Stripe webhook's Sheets logging was pointed at the same decoded summary
instead of parsing registrant categories back out of Stripe line-item
description strings -- more accurate, and CACNA's own `lib/sheetsWebhook.ts`
fire-and-forget logging plumbing itself was left untouched, per the plan.

## Translation completeness is honest, not fabricated

Yoruba translations were only carried over from Convention's own `yo.json`
where the exact same concept/wording already existed there and had
presumably already been reviewed; everything else in this repo's
`messages/yo.json` is an explicitly-labeled English placeholder rather than
a fabricated translation. Church/doctrinal/organizational text is exactly
the kind of content where a wrong guess is costly -- this gets a real
native-speaker review pass as its own follow-up (see [[Tasks]]), not
invented content shipped silently.

Notable choices inferred from code and commit history (no ADR docs exist in
the repo — this is reconstructed).

## Fork the sibling site rather than build from scratch

CACNA's site is a full copy of cac-salvation-center.org's Next.js app,
re-pointed at its own Supabase project, per the README. This explains why
the schema (migration 0001–0003) and admin console arrived essentially
complete on day one, and why nearly the entire subsequent commit history is
content/copy replacement rather than net-new features.

## Drop features the donor site had but CACNA doesn't need

- `testimonies` and `prayer_requests` tables dropped (0008) — CACNA chose
  not to run these donor-site features.
- The full convention registration schema (`convention_registrants`,
  `convention_registrations`, `convention_pricing_tiers`,
  `convention_schedule_sessions`) was added (0007) then dropped again
  (0009) — registration was handled by linking out to a dedicated
  Convention site instead of duplicating it in-app (commit `1522461`,
  "Cross-link CACNA with the dedicated Convention site").

## Everything except Supabase URL/key is optional and fails soft

Per the README: Cloudinary, Stripe, Resend, Behold, Google Analytics/Ads,
YouTube, and the Sheets webhook are all optional env vars — each integration
no-ops or errors gracefully at the point of use if left blank. This keeps
local dev and preview deploys usable without provisioning every third-party
service.

## Single-tier auth gate for /admin

No roles/permissions system — `proxy.ts` middleware redirects any
unauthenticated request under `/admin` (except `/admin/login`) to login.
Admin write access relies on `SUPABASE_SERVICE_ROLE_KEY` being present
server-side; without it, admin login/writes don't work but public pages
still render in an RLS-limited fallback (per README).

## Zone Directory: honest about coverage gaps

Commit `2c805e2` ("NearbyChurchFinder: honest coverage-gap message when
closest church is far away") — a deliberate UX choice to surface when the
`churches` data doesn't actually cover a searcher's area, rather than
silently showing a far-away result as if it were nearby.

## Canonical domain correction

Commits `e352201` and `7e0daf1` fixed the site's declared canonical domain
(sitemap.xml, llms.txt, SITE_URL) to `cacna.cacsalvationcenter.org` after it
was found pointing at the wrong site — worth knowing if the production
domain changes again, since it's declared in multiple places
(`next.config.ts`/env, `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt`).

Update 2026-09-07: PR #31 had temporarily reverted the `SITE_URL` default to `cacnorthamerica.vercel.app` because the subdomain was not yet attached to the Vercel project and Supabase's redirect allow-list did not include it. The subdomain is attached now, so the default is `https://cacna.cacsalvationcenter.org` again and `next.config.ts` permanently redirects `cacnorthamerica.vercel.app` to it (API routes excepted, so webhooks configured against the old host keep working). The rule going forward: the code default, `NEXT_PUBLIC_SITE_URL` in Vercel, and the Supabase redirect allow-list must all name the same host, because the env var overrides the default and the allow-list gates the password-reset link.

## `llms.txt` for LLM crawlers

`public/llms.txt` exists and is deliberately maintained (kept in sync with
site metadata per commit `8f1c9ec`), showing the project actively considers
LLM-based crawling/indexing of its content.

## Retire Yoruba; single-locale English (2026-09-16, PR #36)

Supersedes the two i18n decisions above. Most `/yo` pages were untranslated
near-duplicates of the English ones, and Search Console flagged duplicate
content with a canonical mismatch on 22 pages (PR #36 body). Locales cut to
`["en"]` with `localePrefix: "as-needed"`, `messages/yo.json` deleted,
`/yo/*` and legacy `/en/...` destinations redirected to plain paths.

## Canonical host is cacna.org (2026-11-03, PR #99)

Supersedes "Canonical domain correction" above (which moved through
`cacna.cacsalvationcenter.org` and, in PR #38, `cacnorthamerica.com`).
`lib/site.ts` defaults `SITE_URL` to `https://cacna.org`; four older hosts
redirect there for non-API paths so webhooks pointed at old hosts keep
working. The code comment says `NEXT_PUBLIC_SITE_URL` was deleted from Vercel
on 2026-11-03 (PR #100) -- dashboard state, **Unverified** here.

## Separate `cacna` schema on the shared Supabase project (0010)

CACNA's own Supabase project was gone (confirmed 2026-09-06 per the
migration header), so the tables were recreated in a `cacna` schema on the
sibling cac-salvation-center project rather than its `public` schema, which
already serves that live site. See [[Database]].

## Payer covers processing fees, disclosed as a line item (PRs #71, #95)

`lib/processingFee.ts`: card fee grosses the charge up so the church nets the
subtotal (2.9% + 30c); bank (ACH) fee likewise, capped. See [[Payments]].

## Zelle is the recommended registration payment (PR #84)

No card fee; forms default to Zelle; staff confirm receipt by memo reference
on `/admin/check-in`. See [[Payments]].

## Recurring gifts ship dark (PRs #129-#133)

Recurring code merged in five PRs but stays off until the server-only
`GIVING_RECURRING_ENABLED` is `"true"`, so it can be tested in Stripe test
mode first (`lib/givingRecurring.ts`). Tithe and projects only; a general
offering is "given as the donor is led, not on a schedule" (code comment).

## Stripe hosted checkout by default, embedded opt-in (PR #106)

Embedded checkout was added (PRs #103, #105), then hosted made the default;
embedded is behind `NEXT_PUBLIC_STRIPE_EMBEDDED`.

## Social cross-post lives in the CACNA admin (PR #161)

Chosen over a third-party scheduler: upload once in admin, fully automatic fan-out to Facebook Page, Instagram Reels and TikTok (X dropped). Cloudinary holds the source because YouTube does not release the original; TikTok pulls through a `/social-video` rewrite. Idempotent per platform, with a kill switch and dry run. TikTok unaudited posts stay private until audit.
