---
project: cacnorthamerica
type: security
status: active
last_updated: 2026-11-05
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
