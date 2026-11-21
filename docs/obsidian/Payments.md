---
project: cacnorthamerica
type: payments
status: active
last_updated: 2026-11-06
tags: [project/cacnorthamerica]
---

# Payments

Related: [[Backend]] · [[Database]] · [[Security]] · [[Decisions]]

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
