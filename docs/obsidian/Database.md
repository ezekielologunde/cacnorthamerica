---
project: cacnorthamerica
type: database
status: active
last_updated: 2026-11-08
tags: [project/cacnorthamerica]
---

# Database

Related: [[Architecture]] · [[Security]] · [[Backend]] · [[Payments]]

Supabase Postgres. Since migration `0010_cacna_schema_on_shared_project.sql`
all CACNA tables live in a **`cacna` schema on the sibling
cac-salvation-center Supabase project** (CACNA's own project no longer
exists, per the 0010 header). 0010 was applied via the Supabase MCP, not the
CLI (no local CLI link). See [[Decisions]].

## Migrations (`supabase/migrations/`)

| # | Purpose (from file header) |
|---|---|
| 0001-0009 | Original port, later drops (testimonies, prayer requests, convention registration tables). History in [[Architecture]] |
| 0010 | Recreate 16 tables in `cacna`, `cacna.is_admin()`, RLS + grants, expose schema to PostgREST |
| 0011 | Revoke anon/authenticated INSERT on `contact_submissions`, `newsletter_subscribers` (writes go through the service client) |
| 0012 | Restore leadership roster; widen `leaders_category_check` |
| 0013 | Pastor Ilufoye Bible Institute faculty row |
| 0014 | **Missing** (number skipped; reason Unverified) |
| 0015 | `checkin_people` |
| 0016 | `checkin_people`: `awaiting_zelle` status, `zelle_ref` |
| 0017 | Ilufoye title to Ph.D. |
| 0018 | `giving_invoices` |
| 0019 | `serve_signups` |
| 0020 | `leaders` data update from the Golden Jubilee brochure (data only, no schema change); **applied to the live project 2026-11-05** at the owner's instruction ("follow brochure") as `leaders_golden_jubilee_2026` |

Whether 0015, 0016, 0018, 0019 are applied in production is **Unverified**:
each header says apply only with the site owner's say-so. See [[Tasks]].

## Tables (`cacna` schema)

From 0010: `admin_profiles`, `announcements`, `events`, `blog_posts`,
`contact_submissions`, `gallery_images`, `newsletter_subscribers`,
`cac_world_news`, `profiles`, `departments`, `sermons_livestreams`,
`churches`, `media`, `site_content`, `site_settings`, `leaders`, `tenets`.
`products` / `orders` are **not** recreated in 0010.

Later:
- `checkin_people` (0015/0016) -- one row per registrant; index on
  `(year, code)`; unique `(ref, idx)`. Details in [[Architecture]].
- `giving_invoices` (0018) -- one row per paid recurring-gift invoice:
  `invoice_id` PK, `subscription_id`, `billing_reason`, `amount_paid_cents`,
  `subtotal_cents`, `processing_fee_cents`, `setup_fee_cents`, `frequency`,
  `sheet_done`, `email_done`, `claimed_at`. Exists so the webhook records each
  charge once across redeliveries (in-memory dedupe can't cover renewals).
- `serve_signups` (0019) -- `name`, `email`, `phone`, `teams text[]`
  (non-empty), `note`, `under_18`, `guardian_consent`, `convention_year`;
  index on `created_at` (the one-confirmation-a-day check).

- `child_care_details` (0026) -- Children's Ministry care details, one row per
  child aged 12 or under in a Youth & Child registration, keyed `(ref, idx)`
  (unique) like `checkin_people`. Columns: `id` uuid PK, `year`, `ref`, `idx`
  (>= 0), `child_name` (<= 241), `age` (1-12), `has_allergies`, `allergies`
  jsonb array (<= 6; each `{type: food|medication|other, name,
  severity: mild|moderate|severe}`), `max_allergy_severity`, `medical_notes`
  (<= 300), `medications` (<= 300), `dietary_needs` (<= 200), `special_needs`
  (<= 300), `photo_consent`, `emergency_name` / `emergency_phone` /
  `emergency_relationship`, `pickups` jsonb array (<= 4; `{name, phone}`),
  `guardian_name`, `guardian_phone`, `consent_at`, `created_at`. A check
  constraint ties `has_allergies` to a non-empty `allergies` array; index on
  `year`. Rationale and data model: [[Security]], [[Decisions]].
  - **Apply BEFORE deploying the code that writes it** (and only with the site
    owner's say-so, per the file header). The writer fails closed, so until the
    table exists every Youth & Child registration that includes a child 12 or
    under is refused with a "please try again" message. See [[Tasks]].
  - **Retention:** rows are only needed for their convention. Purge a year once
    it is over: `delete from cacna.child_care_details where year = N`.
  - **Orphans:** care rows are saved before the payment step and deleted again
    if it fails, but an abandoned card checkout (Stripe sessions expire after
    24 hours) leaves rows with no matching `checkin_people` row. The header of
    0026 carries the purge query: delete rows older than 2 days with no
    `checkin_people` row for the same `(ref, idx)`. Look for `[checkin]` errors
    in the logs first, since a paid registration whose check-in row failed
    would match too.

## RPCs / functions

- `cacna.is_admin()` -- `security definer`, `search_path = cacna`, true when
  `auth.uid()` is in `admin_profiles`. Used by every admin policy.
- No other RPCs or triggers found in 0010-0020.

## RLS

RLS is enabled on every table. Pattern from 0010: public `select` where
`published` / `is_published` / `active` / `status = 'approved'` (or always,
for `media`, `site_content`, `site_settings`), admin write via
`cacna.is_admin()`. `contact_submissions` and `newsletter_subscribers` are
admin-read only. `checkin_people`, `giving_invoices`, `serve_signups`:
`revoke all` from anon/authenticated, `grant select` to authenticated with an
admin-only select policy, `grant all` to `service_role` (writes are
server-side only). Note 0010's default privileges grant `select` to anon on
every new table, which is why each later migration revokes explicitly -- see
[[Security]].

## Social cross-post tables (migrations 0027, 0028; written, not applied)

`cacna.social_settings` (kill switch, dry run, per-platform toggles), `cacna.social_posts`, `cacna.social_post_targets` (unique `(post_id, platform)`, one row per platform attempt) and `cacna.social_credentials` (encrypted, rotating TikTok tokens with a CAS lease). RLS is forced with no policies; access is service-role only, as with other sensitive tables. Must land after 0026 (PR #160). See [[Security]] and [[Features]].

### `child_care_details` (0026) RLS

RLS is enabled **and forced**, with **no policies on purpose**: with RLS on and
no policy every non-bypass role is denied every row. All privileges are revoked
from `public`, `anon` and `authenticated` (0010's default privileges would
otherwise grant `select` to anon and authenticated), and `grant all` goes to
`service_role` only. So neither the public anon key nor a signed-in admin's own
session can read or write it through PostgREST; both the writer
(`app/api/register/route.ts` via `lib/childCareStore.ts`) and the readers (the
admin check-in pages, after `requireAdmin()`) use the service client. See
[[Security]] and [[Backend]].
