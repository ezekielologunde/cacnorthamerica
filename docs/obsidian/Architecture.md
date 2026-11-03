---
project: cacnorthamerica
type: architecture
status: active
last_updated: 2026-09-05
tags: [project/cacnorthamerica]
---

# Architecture

Related: [[Project]] · [[Features]] · [[Decisions]]

## Layout

```
app/
  (site)/[locale]/   Every public page, bilingual (en/yo) via next-intl --
                      about, ministries, leadership, events, blog, gallery,
                      giving, zones, calendar, bible-institute,
                      christian-education, cacma, good-women,
                      ministers-wives, youth, business-group, children,
                      watchwords, statement-of-faith, online, contact,
                      archive, store, plan-your-visit, sitemap
  admin/(protected)/ Admin console pages, gated by proxy.ts -- NOT under
                      [locale]; stays English-only, unaffected by i18n
  admin/login/       Supabase Auth login
  api/                contact, gallery, instagram, cloudinary/sign,
                      register, store/checkout, stripe/webhook
                      -- also NOT under [locale] (route handlers, no UI)
  newsletter/actions.ts  Server action (not a page/route of its own)
components/          admin/ blog/ calendar/ media/ ministries/ navigation/
                     providers/ sections/ ui/ zones/
contexts/            CartContext.tsx (giving/store cart state)
i18n/                routing.ts, request.ts -- next-intl config
messages/            en.json, yo.json -- translation catalogs
lib/                 data-access + integration helpers (see below)
lib/supabase/        client.ts, server.ts, require-admin.ts
supabase/migrations/ SQL schema history (0001–0009)
types/database.types.ts  Generated Supabase types
proxy.ts             Next.js proxy (formerly "middleware") -- branches on
                     pathname: /admin/* gets the pre-existing Supabase auth
                     gate, everything else runs next-intl's own middleware
next.config.ts       Wrapped with next-intl's plugin (createNextIntlPlugin)
                     so it can find i18n/request.ts
```

## Internationalization (i18n)

Added 2026-09-05 as the first step of merging the sibling Convention site
into this one (see [[Decisions]]). Mirrors the exact next-intl setup that
site already used successfully: `defineRouting({ locales: ["en", "yo"],
defaultLocale: "en" })`, always-prefixed URLs (`/en/...`, `/yo/...`), a
`generateStaticParams` on `app/(site)/[locale]/layout.tsx` so both locales
prerender at build time.

That nested layout only adds `NextIntlClientProvider` -- it does **not**
redeclare `<html>/<body>` (the root `app/layout.tsx` above it still owns
those, plus fonts/analytics/the live announcement-banner fetch, completely
unchanged). Nav/Footer continue to be rendered per-page (this site's
existing pattern, not changed by the migration); both are now Client
Components reading the active locale via `useLocale()` and prefixing every
internal `href` themselves (see `components/navigation/Nav.tsx`,
`components/sections/FooterExperience.tsx`).

**Translation status is honest, not complete.** Only Nav and Footer chrome
text is genuinely bilingual right now (a handful of high-confidence words
carried over from the Convention site's own already-reviewed `yo.json`,
the rest English placeholders clearly marked in `messages/yo.json` itself).
Every individual page's body content still renders identical English text
at both `/en/X` and `/yo/X` -- only the *route structure* and *chrome* are
bilingual so far. See [[Tasks]] for the translation follow-up work, and for
a known gap: pages' own internal links (CTAs inside page-body components,
as opposed to Nav/Footer) were intentionally left un-prefixed in this pass
-- clicking one still works (next-intl's middleware redirects a bare
`/about` to `/en/about`), just via an extra redirect hop rather than a
direct link.

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
- Stripe — `api/register`, `api/store/checkout`, `api/stripe/webhook` (added
  when the Convention site's registration/store flows were brought
  in-house; re-prices server-side from `lib/conventions.ts`, never trusts a
  client-sent price). Logs to a Google Sheet via `lib/sheetsWebhook.ts` on
  the webhook's `checkout.session.completed` only -- no pending/updated row,
  a failed or abandoned checkout simply never produces a log entry.
  Registration details (no database to look them up from) travel encoded in
  the confirmation URL and in Stripe metadata via `lib/checkoutSummary.ts`
  -- ported from Convention's own version during Phase B of the Convention
  merge (see [[Decisions]]). The register API also gates a "Complimentary"
  tab behind a server-checked `STAFF_PASSCODE` env var, and the confirmation
  page and email show each person's 4-character check-in code
  (`lib/checkinCode.ts`, `components/register/RegistrantCheckinList.tsx`),
  the only check-in method (the earlier check-in QR was dropped).
- Resend — transactional email (contact form, likely)
- Behold — Instagram feed via `/api/instagram`
- Google Analytics / Ads, YouTube Data API, a Google Sheets webhook

## Check-in lookup table (`cacna.checkin_people`)

One row per registrant of every successful convention registration
(`supabase/migrations/0015_checkin_people.sql`), so the admin check-in page
can find a person by name prefix or by their 4-character check-in code.
Rows carry the year, the registration `ref` and the person's position
(`idx`, unique together), the code from `lib/checkinCode.ts`, category, age,
church, DCC / zone, contact details, sheet-style meals, allergies, payment
status (`free` / `paid`), the Stripe session, and `checked_in_at` /
`checked_in_by` for the door. Codes are not globally unique, so staff still
verify the name.

Written only server-side by `recordCheckinPeople()` in
`lib/checkinStore.ts` (service-role client): from `api/register` on the free
adult and free Youth & Child paths, and from `api/stripe/webhook` for paid
registrations once the sheet row is written. It upserts on `(ref, idx)` with
do-nothing on conflict, so Stripe retries never duplicate a row or reset a
check-in. It is best-effort: a missing `SUPABASE_SERVICE_ROLE_KEY`, a
database error or anything thrown is logged with the ref only and never
fails a registration or a webhook. The Google Sheet stays the record staff
already use; this table is a lookup copy of it. PII: RLS on, no anon access,
admins read it through a `cacna.is_admin()` select policy. Pinned by
`node scripts/check-checkin-store.mjs`.

## Staff check-in page (`/admin/check-in`)

`app/admin/(protected)/check-in/` (nav: "Check-in"). Volunteers at the door
type a name or a 4-character code into a plain GET form (`?q=`, optional
`?year=`, default `currentOrNextConvention()`), so it works on a phone
without JavaScript. `lib/checkinSearch.ts` classifies the query: trimmed,
capped at 60 characters; exactly 4 characters that normalise to a valid
code also search `code`, and every query searches `full_name` and
`contact_name` with `ilike` on an escaped `%q%` pattern (`%`, `_`, `\`
escaped, `*` dropped). Results are merged by id, ordered by name, capped at
50. Cards show the code, age group, church / DCC, contact, paid / free,
meals and allergies (highlighted), and flag codes shared within the results.
`checkInPerson` / `undoCheckIn` call `requireAdmin()` themselves; check-in
only updates where `checked_in_at is null` (a double tap never overwrites
who or when), undo clears both columns, then each redirects back to the same
search. If the table is missing (0015 not applied) the page shows a setup
notice instead of failing. Pinned by `node scripts/check-checkin-admin.mjs`.

## Paying by Zelle (registration)

Zelle is the recommended way to pay (no card fee) and the forms' default.
End to end:

1. **Form.** `RegisterForm` and `YouthRegisterForm` start from
   `DEFAULT_PAYMENT_METHOD` (`"zelle"`, `components/register/PaymentMethodChoice.tsx`)
   and show the "How would you like to pay?" radios only when `total > 0`.
   They send `paymentMethod` (`"zelle"` | `"card"`) to `POST /api/register`.
2. **Route.** With `paymentMethod: "zelle"` and a total over $0, both tracks
   go through `confirmByZelle` in `app/api/register/route.ts`: no Stripe and
   no processing fee. Absent means card; any other value is a 400; a $0
   registration takes the free path whatever the method.
3. **Token.** The visitor gets a sealed confirmation token carrying
   `pay: "zelle"` and `zelleRef` (`ZEL-` plus 8 Crockford characters,
   deterministic per ref, `lib/zelleReference.ts`), plus `emailed` when a
   confirmation email was attempted (per-address cap of 3 a day, key
   `zelle-confirm:<email>` with the address trimmed and lower-cased; an
   address containing whitespace, `<`, `>`, `,` or `;` is a 400).
4. **Confirmation page and email.** `lib/registrationConfirmation.ts` opens
   the token as `payment: "awaiting_zelle"`; the page shows
   `ZellePaymentPanel` (amount due = subtotal, the recipient from
   `paymentOptions`' Zelle entry, the memo reference, one-tap copy) and an
   "Awaiting Zelle payment" chip. `sendRegistrationConfirmationEmail(...,
   { zelleRef })` sends the matching "Awaiting payment" email, with every
   visitor-typed value escaped. `paymentOptions` (`lib/registrationInfo.ts`)
   is the single source of the Zelle address and lists Zelle first.
5. **Sheet.** Rows have Status `awaiting Zelle (unverified email)`, Total =
   subtotal, Processing Fee `$0.00`, blank Amount Charged and Stripe
   Session, and a `Zelle Reference` column just before `Check-in Code`
   (which stays last).
6. **Check-in table.** `checkin_people.payment_status` is one of `free`,
   `paid` or `awaiting_zelle`; Zelle rows carry `zelle_ref`.
7. **Staff.** On `/admin/check-in` an `awaiting_zelle` person shows a
   "Payment not received yet" warning and a **Mark paid** button
   (`markZellePaid`: `requireAdmin()`, then sets `paid` only where the status
   is still `awaiting_zelle`). Staff match the Zelle memo to the reference.

**Deploy order:** apply migration `0016_checkin_awaiting_zelle.sql` (widens
the `payment_status` check, adds `zelle_ref`) **before** deploying this code:
the check-in page selects `zelle_ref`. Pinned by
`node scripts/check-zelle-registration.mjs` (route, token, sheet, check-in
rows, email and cap, admin action, the Apps Script's column placement) and
`node scripts/check-zelle-ui.mjs` (forms, confirmation page, panel, email
escaping).

**Sheets webhook:** the repo copy of `docs/google-apps-script/sheets-webhook.gs`
inserts a column the tab has not seen just before a trailing `Check-in Code`
column (anywhere else it is added at the far right), so the first Zelle row on
an existing tab puts `Zelle Reference` before `Check-in Code`. The live script
does not do this yet. Re-paste this into the live Apps Script project
(Extensions > Apps Script) and redeploy a new version for it to take effect;
until then, add the 'Zelle Reference' header by hand before 'Check-in Code'.
