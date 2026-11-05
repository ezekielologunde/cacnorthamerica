---
project: cacnorthamerica
type: backend
status: active
last_updated: 2026-11-05
tags: [project/cacnorthamerica]
---

# Backend

Related: [[Architecture]] · [[Database]] · [[Payments]] · [[Security]]

Next.js route handlers under `app/api/` (outside `[locale]`), plus server
actions. Supabase is the data store ([[Database]]).

## API routes (`app/api/**/route.ts`)

| Route | Purpose |
|---|---|
| `contact` | Contact form |
| `serve` | `/serve` volunteer sign-up (PR #136) |
| `register` | Convention registration: free, Zelle, card ([[Payments]]) |
| `store/checkout` | Store Stripe Checkout |
| `giving/checkout` | Giving Stripe Checkout (one-time; recurring behind flag) |
| `giving/zelle` | Zelle giving pledge |
| `giving/cancel/request`, `giving/cancel/confirm` | Self-service recurring-gift cancel (PR #132) |
| `stripe/webhook` | Stripe events (below) |
| `cloudinary/sign` | Signed Cloudinary uploads |
| `gallery`, `instagram` | Gallery data; Behold Instagram feed |
| `approx-location` | Approximate location for the church finder (PR #48 branch name) |

Server action: `app/newsletter/actions.ts`.

## Stripe webhook

`app/api/stripe/webhook/route.ts` requires `STRIPE_WEBHOOK_SECRET` and
handles: `checkout.session.completed`,
`checkout.session.async_payment_succeeded`,
`checkout.session.async_payment_failed`, `invoice.paid`,
`invoice.payment_failed`, `customer.subscription.deleted`,
`charge.dispute.created`. API paths are excluded from host redirects so
webhooks pointed at old hosts still arrive (`next.config.ts`).

## Google Sheets (Apps Script)

`lib/sheetsWebhook.ts` posts rows (env `SHEETS_WEBHOOK`, secret
`SHEETS_WEBHOOK_SECRET`); `lib/sheetsRead.ts` reads back. The script source is
`docs/google-apps-script/sheets-webhook.gs`; PR #113 documents a `doGet` the
admin Operations page reads. Live deployment state is **Unverified** (see
[[Tasks]]).

## Email (Resend)

`RESEND_API_KEY`. Email modules in `lib/`: `email.ts`, `registrationEmail.ts`,
`contactReplyEmail.ts`, `givingEmail.ts`, `givingCancelEmail.ts`,
`givingProblemEmail.ts`, `storeOrderEmail.ts`, `serveEmail.ts`. Mail-from and
contact addresses on `@cacna.org` (PR #102); logo in designed emails (PR #85).
Domain verification and inbound routing are dashboard-only: **Unverified**.

## Other integrations

Cloudinary, YouTube Data API (`YOUTUBE_API_KEY`), Behold (`BEHOLD_FEED_ID`),
Turnstile verification (`lib/turnstile.ts`, `TURNSTILE_SECRET_KEY`).
