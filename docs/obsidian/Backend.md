---
project: cacnorthamerica
type: backend
status: active
last_updated: 2026-11-08
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
| `register` | Convention registration: free, Zelle, card ([[Payments]]); Youth & Child track also saves care details (below) |
| `cron/refresh-content` | Scheduled content refresh (GET, bearer `CRON_SECRET`); see below |
| `store/checkout` | Store Stripe Checkout |
| `giving/checkout` | Giving Stripe Checkout (one-time; recurring behind flag) |
| `giving/zelle` | Zelle giving pledge |
| `giving/cancel/request`, `giving/cancel/confirm` | Self-service recurring-gift cancel (PR #132) |
| `stripe/webhook` | Stripe events (below) |
| `cloudinary/sign` | Signed Cloudinary uploads |
| `gallery`, `instagram` | Gallery data; Behold Instagram feed |
| `approx-location` | Approximate location for the church finder (PR #48 branch name) |

Server action: `app/newsletter/actions.ts`.

## Children's care details in `api/register` (2026-11-08)

In the youth track of `app/api/register/route.ts`, order matters:

1. `parseRegistrationCare` (`lib/childCare.ts`) validates the care details for
   everyone 12 or under; failure is a 400.
2. The encoded summary is checked to fit Stripe metadata (card path) **before**
   anything is saved, so that refusal leaves no care rows behind.
3. `childCareRows` builds the rows and `saveChildCare` (`lib/childCareStore.ts`)
   inserts them into `cacna.child_care_details`. If this fails the route returns
   **503** and nothing else is written: no sheet row, check-in row, email or
   payment (fail closed; see [[Security]]).
4. Every later failure (free-path token error, Zelle not ok, Stripe session
   error) calls `discardCare()` -> `deleteChildCare(ref)`, a best-effort delete
   by `ref`, so a retry leaves no orphans. Rows left by an abandoned card
   checkout are removed by the purge query in migration 0026 ([[Database]]).

Care data is never added to the summary, so it is not in the URL token, Stripe
metadata, sheet or email. `saveChildCare` / `deleteChildCare` log the ref and an
error code only.

## Scheduled content refresh and revalidation (2026-11-08)

- `app/api/cron/refresh-content/route.ts`: `GET`, authorised by
  `isAuthorizedCronRequest` (`lib/cronAuth.ts`, see [[Security]]); runs
  `refreshAllPublicContent()` and returns `{ ok, revalidated, at }` with
  `no-store`. `vercel.json` schedules it `0 9 * * *` (see [[Architecture]]).
- `lib/contentRevalidation.ts` is the one place that revalidates public pages.
  Admin server actions (blog, events, announcements, CAC World news) call
  `revalidateBlogContent`, `revalidateEventContent`, `revalidateAnnouncements`,
  `revalidateCacWorldNewsContent`. It revalidates by **route-file pattern** plus
  `"page"` (for example `/(site)/[locale]/blog`), not by URL. Why: next-intl
  rewrites every public URL to its locale route (`/blog` is served from
  `/en/blog`) and `revalidatePath` matches the rewritten path, so the earlier
  literal `revalidatePath("/blog")` and `revalidatePath("/")` never matched a
  cached page and the home page only caught up on its 60 s timer and `/blog` on
  its hourly one. The scheduled run marks the CAC World feed tag stale
  (`revalidateTag(tag, "max")`, stale-while-revalidate) and the home, blog,
  blog post, calendar and event pages.
- `lib/blogPosts.ts` (`getPublishedBlogPosts`) and `lib/dbEvents.ts`
  (`getPublishedDbEvents`) read published admin blog posts and events from the
  `cacna` schema with the anon client and return empty on failure;
  `lib/blogMerge.ts` merges them with the static posts. See [[Frontend]].

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
