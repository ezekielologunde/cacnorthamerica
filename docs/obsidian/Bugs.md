---
project: cacnorthamerica
type: bugs
status: active
last_updated: 2026-11-06
tags: [project/cacnorthamerica]
---

# Bugs / Known Issues

Related: [[Tasks]] · [[Security]] · [[Database]]

## Payment retry limitations (2026-11-06)

The local source now deduplicates paid rows at the Apps Script receiver and
rejects missing secrets or failed locks. The fix requires that receiver version
and matching configuration; live state remains **Unverified**. Old rows without
keys are not backfilled. Checkout email dedupe is still limited to Resend's
24-hour window; an invoice email sent before a failed database mark has the same
window. See [[Payments]] for rollout and test boundaries.

Only issues found in code comments, migration headers or PR titles.

- **Image optimization off.** Vercel's Image Optimization quota is exhausted
  (402 `OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED`), so `images.unoptimized`
  is `true` and raw files are served (`next.config.ts`).
- **Live Apps Script lags the repo copy.** The Zelle column-placement change
  in `docs/google-apps-script/sheets-webhook.gs` needs re-pasting and a new
  deployment; until then add the "Zelle Reference" header by hand
  ([[Architecture]]). Current live state **Unverified**.
- **Migration-dependent features degrade silently.** Without 0015/0016 the
  check-in page shows a setup notice or "Couldn't load the check-in list";
  without 0019 `/serve` saves no row and sends no volunteer confirmation
  (migration headers). Applied state **Unverified**.
- **Silent DB failures.** `createServiceClient()` falls back to anon and
  swallows errors (0010 header); that hid a deleted Supabase project for a
  time.
- **Check-in codes are not unique**; staff must verify the name
  ([[Architecture]]).
- Migration number 0014 is absent from `supabase/migrations/`.
