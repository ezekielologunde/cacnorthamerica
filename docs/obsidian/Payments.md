---
project: cacnorthamerica
type: payments
status: active
last_updated: 2026-11-06
tags: [project/cacnorthamerica]
---

# Payments

Related: [[Backend]] · [[Database]] · [[Security]] · [[Decisions]]

## Retry hardening and verification (2026-11-06, local source)

- Paid checkout rows use `checkout-session/<session>/<step>` keys. Youth rows
  each have a distinct index; registration and optional-gift rows are separate.
  Recurring rows use `invoice/<invoice>/sheet`. The receiver stores an
  `Idempotency Key` cell alongside the row while holding a checked script lock.
  A retry on a cold instance or after append-before-database-mark finds that
  row instead of appending again. Keep that column and its rows intact.
- Missing/wrong receiver secrets and lock contention reject writes. The checked
  sender rejects missing URL/secret, non-JSON replies, and missing/mismatched key
  acknowledgements, with a 10-second request timeout. Stripe receives 500 when
  recording fails and can retry. Ordinary unkeyed forms retain append semantics.
- Checkout step memory is still process-local. Receipt emails use Resend's
  24-hour idempotency window, not a permanent exactly-once ledger. A cold retry
  after that window, or an invoice email sent before its DB mark fails, can
  still duplicate a receipt. No payment is recharged by these recorders.
- `npm test` now includes receiver tests and `npm run test:payments` (Node 24).
  The payment gate uses pure helpers or mocked Stripe, Sheets, Turnstile,
  Supabase stores and email. It covers adult/youth gifts, pending versus settled
  payment, cold retries, invoice crash recovery, recurring checkout consent,
  card/ACH cadence, setup fees, caps, cancellation and problem handlers.
  These are local regressions, not Stripe sandbox or production evidence.

### Local verification result (2026-11-06)

- `npm test`: passed all 22 Node tests and the 12-script offline payment gate
  (519 PASS lines, including the aggregate recurring-route check).
- `tsc --noEmit --incremental false`: passed. Focused ESLint on changed
  source/test files: passed. `git diff --check`: passed.
- Full-repository ESLint: failed with 9 errors and 6 warnings in unchanged
  UI files (including admin error navigation, AdminShell, HomepageAnnouncements,
  SearchModal and SiteOverlays). These are outside this payment patch.
- `npm run build`: compilation and TypeScript passed; prerender failed because
  this isolated worktree has no Supabase URL/API key. No live `.env.local` was
  copied. This is not a successful complete production build.
- No browser flow, Stripe sandbox end-to-end run, or live deployment was performed.

### Owner deployment checklist (not performed)

1. Verify all existing callers share the receiver secret. Install and redeploy
   the updated Apps Script first, with `WEBHOOK_SECRET` matching the server's
   `SHEETS_WEBHOOK_SECRET`. Test against an isolated spreadsheet, not donor data.
2. Only then publish the app changes. An old receiver will not acknowledge the
   keys, so deploying the app first causes retries and may append duplicate rows
   in that old receiver. Historical rows without keys are not backfilled or
   deduplicated automatically; reconcile outstanding historical retries first.
3. Run Stripe test-mode card/ACH registration-gift and recurring first/renewal,
   failure, replay and cancellation flows with isolated Sheets/email targets.
   Verify migration 0018 and webhook subscriptions before enabling recurring.
   No flags, dashboard settings, migrations or external deployments were changed.
4. Confirm tax treatment and the handling of proration/manual invoices with the
   owner/adviser. The existing billing-reason policy is unchanged.

Stripe (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,
`STRIPE_WEBHOOK_SECRET`) plus Zelle. **Stripe live-mode settings, account,
payout and webhook endpoint configuration are dashboard-only: Unverified.**

## Fees (`lib/processingFee.ts`)

- Card: payer covers Stripe's 2.9% + 30c; `total = ceil((subtotal + 30) /
  (1 - 0.029))`, fee shown as its own "Processing fee" line (PR #71).
- Bank (ACH) gifts (PR #95): 0.8% capped at $5, plus $1.50 instant
  verification, grossed up and capped; ACH gifts limited to $10,000.
- Free registrations have no fee. Zelle has no fee.
- Registration gift (`lib/registrationGift.ts`): an optional $1 to $5,000 gift on a
  card registration is its own Stripe line item ("Gift to the CACNA Convention")
  and is not grossed up. The fee above is sized on the registration only, so the
  church absorbs Stripe's percentage on the gift. Not offered on Zelle or free
  registrations. See [[Decisions]].

## Flows

| Flow | Route | Status |
|---|---|---|
| Convention registration, card | `api/register` -> Stripe Checkout | Implemented |
| Convention registration gift, card | `api/register` (`donationCents`) | Implemented; webhook logs a separate `Giving` row and sends the giving receipt (the registration row excludes it) |
| Convention registration, Zelle (default) | `api/register` (`confirmByZelle`) | Implemented; staff mark paid on `/admin/check-in` (PR #84) |
| Store | `api/store/checkout` | Implemented |
| Giving, one-time card/ACH | `api/giving/checkout` | Implemented |
| Giving, Zelle pledge | `api/giving/zelle` | Implemented; pledge recorded before email (PR #97) |
| Giving, recurring | `api/giving/checkout` + webhook + `api/giving/cancel/*` | **Partial: off** unless `GIVING_RECURRING_ENABLED === "true"` |

Checkout UI: Stripe-hosted by default; embedded when
`NEXT_PUBLIC_STRIPE_EMBEDDED` is set (PRs #103, #105, #106).

## Recurring gifts (PRs #129-#133)

- #129 fees and validation; #130 invoice recording (`giving_invoices`, 0018);
  #131 failed charges, ended gifts, disputes; #132 self-service cancel; #133
  checkout, behind the flag.
- Monthly or every 2 weeks; tithe and projects only (`lib/givingRecurring.ts`).
- Webhook events: `invoice.paid`, `invoice.payment_failed`,
  `customer.subscription.deleted`, `charge.dispute.created`.
- **Unverified / placeholder:** end-to-end Stripe test-mode run of the
  recurring flow; whether 0018 is applied; whether the flag is set anywhere.
  The flag's purpose per the code comment is to allow test-mode testing
  "before any donor sees it".

## Zelle

Recipient address lives in `paymentOptions` (`lib/registrationInfo.ts`);
memo reference `ZEL-` + 8 characters (`lib/zelleReference.ts`). Receipt is
confirmed manually by staff -- there is no automated Zelle reconciliation.
Full flow in [[Architecture]] "Paying by Zelle".

## Logging

Successful payments are logged to Google Sheets via `lib/sheetsWebhook.ts`;
paid registrations also write `checkin_people`. See [[Backend]].
