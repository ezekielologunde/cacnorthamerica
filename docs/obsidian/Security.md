---
project: cacnorthamerica
type: security
status: active
last_updated: 2026-11-08
tags: [project/cacnorthamerica]
---

# Security

Related: [[Database]] · [[Backend]] · [[Payments]] · [[Bugs]] · [[Decisions]]

## Auth and authorization

- `proxy.ts`: every `/admin/*` request except `/admin/login` and
  `/admin/reset-password` (PR #107) redirects to login unless a Supabase
  session user exists. No roles beyond "is an admin".
- Server actions and admin writes call `requireAdmin()`
  (`lib/supabase/require-admin.ts`); the database side is `cacna.is_admin()`
  ([[Database]]).
- Service-role writes need `SUPABASE_SERVICE_ROLE_KEY` server-side.
- Password-reset links depend on the Supabase redirect allow-list naming
  `https://cacna.org` (`lib/site.ts` comment) -- dashboard state
  **Unverified**.

## Row Level Security

On for every table. Public-form tables lost anon INSERT in 0011; PII tables
(`checkin_people`, `giving_invoices`, `serve_signups`) revoke all from anon
and are admin-read only. Details in [[Database]].

## Form abuse controls

- Cloudflare Turnstile on public forms (PR #109), the Zelle giving form
  (PR #112); server check in `lib/turnstile.ts` with `TURNSTILE_SECRET_KEY`.
  Exact form coverage beyond these PRs is **Unverified** here.
- `lib/rateLimit.ts`, `lib/spam.ts`, honeypot (PR #46). `/api/serve` keeps the
  contact route's order: rate limit, form header, honeypot, Turnstile,
  validation ([[Architecture]]).
- Per-address email caps: Zelle registration confirmation 3/day; serve
  confirmation 1/day ([[Architecture]]).
- Prices are recomputed server-side; the client never sets the charged amount
  (`lib/processingFee.ts`, [[Architecture]]).

## Headers (`next.config.ts`)

CSP (`default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, allow-lists
for Stripe, Turnstile, Google Analytics/Ads/AdSense, YouTube, Supabase,
Cloudinary, map tiles), HSTS with preload, `X-Frame-Options: SAMEORIGIN`,
`nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy` (camera/mic off, geolocation self), COOP
`same-origin-allow-popups`. `poweredByHeader: false`.

## Signed tokens

`REGISTRATION_SIGNING_SECRET` signs registration confirmation tokens
(`lib/registrationToken.ts`); `lib/cancelToken.ts` backs recurring-gift
cancel links. Token formats not re-read for this note.

## Analytics and secret-bearing URLs

Some URLs carry a secret in the query string: the Stripe `session_id` or
sealed `t` token on the three confirmation pages (event registration, giving,
store), and the sealed `t` token in the emailed `/giving/cancel` link (it
lists and cancels a donor's recurring gifts). What keeps them out of
analytics (`lib/analytics.ts`, `scripts/check-adsense.mjs`):

- `SECRET_URL_PATH` names exactly those routes. The inline gtag script
  (`gtagInitScript()`) sends a query-free `page_location` to Google Analytics
  and Google Ads on them.
- `scrubTelemetryUrl()` is the `beforeSend` of Vercel Analytics and Speed
  Insights (`components/analytics/VercelTelemetry.tsx`). It also strips the
  query on `/admin`, where check-in search puts registrant names and codes in
  `?q=`.
- The three confirmation pages send `referrer: "no-referrer"` (as
  `/giving/cancel` does when it has a token), so the URL never travels as a
  Referer or `page_referrer`.
- `GoogleTags` is mounted in the `[locale]` layout and `app/not-found.tsx`,
  not the root layout, so `/admin` never loads Google tags.
- `adsenseClientId()` (`lib/adsense.ts`) is the single normalizer for the
  AdSense ID used by `/ads.txt`, the ad script, `BlogAd`, `GoogleTags` and the
  `google-adsense-account` meta tag.
- `npm test` runs `scripts/check-adsense.mjs`, which executes the real inline
  script and asserts each call site uses these helpers.

Required GA4 setting (outside the repo): turn off **Page changes based on
browser history events** under Enhanced measurement. See [[Features]] for the
AdSense pieces and [[Changelog]] for when this landed.

## Children's medical data (2026-11-08)

Youth & Child registrations collect Children's Ministry care details for every
child 12 or under (allergies, medical notes, medications, dietary and special
needs, photo consent, emergency contact, authorized pickups, guardian consent).
This is the most sensitive data on the site.

- **Storage:** `cacna.child_care_details` (migration 0026): RLS enabled and
  forced with no policies, all privileges revoked from `public`/`anon`/
  `authenticated`, `service_role` only. Details in [[Database]].
- **Fail closed:** `lib/childCareStore.ts` `saveChildCare` returns false if
  `SUPABASE_SERVICE_ROLE_KEY` is unset (it refuses rather than fall back to the
  anon key, which has no privileges on the table) or the insert fails or times
  out (5 s). The register route then answers **503** and nothing is registered
  (no sheet row, check-in row, email or payment), so a parent never believes the
  ministry has allergy details it does not. See [[Backend]].
- **No care data elsewhere:** care details are kept out of the registration
  summary, so they never reach the sealed URL token, Stripe metadata, the Google
  Sheet, the confirmation email or the confirmation page. For children 12 or
  under the old free-text allergy note is dropped server-side. Logs carry the
  registration ref and an error code only, never a name or a medical detail
  (a database error message can echo row values).
- **No browser copy:** the form writes nothing to `sessionStorage` or
  `localStorage`, and the care state is not sent to analytics or the URL. A
  draft-saving feature was deliberately not built (owner decision; see
  [[Decisions]]).
- **Admin reads:** `/admin/check-in` and the printable `/admin/check-in/children`
  sheet read with the service client after `requireAdmin()` and render on the
  server only. Only children with a `checkin_people` row appear, so an abandoned
  card checkout never shows.
- **Server validation:** `lib/childCare.ts` re-checks every field (enums,
  explicit choices, length limits, at most 6 allergies and 4 pickups).
- **Retention:** purge a convention's rows once it is over; see [[Database]] and
  [[Tasks]].

## Cron endpoint authentication (2026-11-08)

`GET /api/cron/refresh-content` requires `Authorization: Bearer ${CRON_SECRET}`
(Vercel Cron sends it itself once `CRON_SECRET` is set on the project).
`lib/cronAuth.ts` `isAuthorizedCronRequest` fails closed: an unset secret or one
shorter than 16 characters (`CRON_SECRET_MIN_LENGTH`) rejects every request, and
the comparison hashes both sides with SHA-256 and uses `timingSafeEqual`, so it
takes the same time whatever the header holds and leaks no length. Refusals
return 401 with `Cache-Control: no-store`; a missing secret is logged. The secret
must not go in any `NEXT_PUBLIC_` variable. See [[Backend]], [[Architecture]]
and `docs/cron-refresh-content.md`.

## Known risks

- `script-src` and `style-src` allow `'unsafe-inline'`.
- 0010's default privileges grant `select` to anon on every new `cacna`
  table; each new PII table must revoke explicitly (0015, 0018, 0019 do).
- Shared Supabase project with the sibling site: a mistake in that project's
  settings affects both sites.
- 0010 header: `createServiceClient()` falls back to the anon key and
  swallows errors by design, so a broken DB connection fails silently.
- Domain-reputation flags on the old WordPress host and Stripe/Vercel
  dashboard settings are outside the repo: **Unverified**.
- Analytics stripping runs at page load. A client-side jump onto a secret-bearing page would not be re-stripped for GA4's automatic history-change page views; every link to these pages is absolute so they load fresh, and the GA4 setting above closes it. Whether that setting is off in the property: **Unverified**.
- `gtag('config', {page_location})` persists for the life of the page, so a later soft navigation can be reported under the stripped URL (misreports, does not leak).

## Social cross-post credentials (PR #161)

Platform tokens are encrypted at rest with `SOCIAL_TOKEN_ENCRYPTION_KEY` (`lib/social/token-crypto.ts`). TikTok refresh tokens rotate, so refresh is serialised by a compare-and-swap lease. Posting is idempotent per `(post_id, platform)`, and a kill switch, dry run and per-platform toggles default to off. Cloudinary uploads are signed server-side and sent direct from the browser (CSP `connect-src` adds `api.cloudinary.com`; `media-src` allows `blob:` for the admin preview). Never run against real Meta or TikTok yet: **Unverified**.
