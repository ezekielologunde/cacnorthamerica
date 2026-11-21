# Children's Ministry parent information (design)

Date: 2026-11-08. Branch: `feat/children-parent-info`.

## Goal

Parents give the Children's Ministry what it needs to care for a child
(allergies, medical notes, medications, dietary and special needs, photo
consent, who may pick the child up, an emergency contact) in the Youth & Child
registration they already fill in, not a second form.

## Decision: extend the Youth & Child registration

One form, one submission. The existing parent / guardian block (name, email,
phone, church) is the guardian for every child in the registration. Anyone aged
**12 or under** (`CHILD_CARE_MAX_AGE`, matching the Children's Ministry's
5-8 and 9-12 classes) gets a "Care details" panel in their person card.
Siblings share one family block: emergency contact, up to 4 authorized pickup
people and the guardian's care consent.

| Where   | Field                                   | Required    | Limit            |
| ------- | --------------------------------------- | ----------- | ---------------- |
| child   | Allergies: "None" or "Yes" (explicit)   | yes         |                  |
| child   | each allergy: type, what, severity      | if "Yes"    | 6 rows, 80 chars |
| child   | medical conditions / notes              | no          | 300              |
| child   | medications (incl. EpiPen / inhaler)    | no          | 300              |
| child   | dietary needs                           | no          | 200              |
| child   | special needs / accommodations          | no          | 300              |
| child   | photo consent yes / no (explicit)       | yes         |                  |
| family  | emergency contact name, phone, relation | name, phone | 120 / 40 / 60    |
| family  | authorized pickup: name + phone         | no          | 4 people         |
| family  | care consent checkbox                   | yes         |                  |

Allergy type: food, medication, other. Severity: mild, moderate, severe
(life-threatening). Age stays the age field the form already has; no date of
birth is collected (age already gives the age group, and a DOB is more
identifying than the ministry needs).

Friction: one guardian block for all children, "Add another child", a progress
indicator over the three steps, 16px inputs with the right `autocomplete` /
`inputmode` and plain-language hints.

## Data handling (security first)

- New table `cacna.child_care_details` (migration 0026), one row per child,
  keyed `(ref, idx)` like `cacna.checkin_people`. RLS on with **no policies**,
  and all privileges revoked from `anon`, `authenticated` and `public`; only
  `service_role` can touch it.
- Written only by `app/api/register/route.ts` (youth track) through
  `lib/childCareStore.ts`, after the rate limit, form header, honeypot,
  Turnstile and spam checks the route already runs, and before any sheet row,
  check-in row, email or Stripe session.
- **Fail closed:** if the care rows cannot be saved the registration is refused
  with a "try again" message, so a parent never believes allergy details were
  given when they were not. Deploy order therefore matters: apply 0026 before
  deploying this code, or registrations with children 12 and under will fail.
- Server-side validation in `lib/childCare.ts` (pure, unit tested): types,
  enums, explicit choices, length limits, at most 6 allergies and 4 pickups.
- The care data never enters the registration summary, so it is never in the
  sealed URL token, Stripe metadata, the Google Sheet, the confirmation email
  or the confirmation page. For children 12 and under the old free-text
  allergy note is replaced by the structured allergies and is dropped on the
  server, so no allergy text reaches those places either. Logs carry the
  registration ref and an error code only.
- No browser draft: the form writes nothing to `sessionStorage` or
  `localStorage` (owner decision), so nothing typed outlives the page.

## Admin

- `/admin/check-in`: a child's card shows a red allergy flag (most severe
  first) and a short care summary (medications, conditions, pickup people,
  emergency contact, photo consent). Read with the service client after
  `requireAdmin()`, the same gate every admin page uses.
- `/admin/check-in/children`: a printable care sheet for the check-in desk:
  every registered child 12 and under for the year, allergy-flagged children
  first, with a Print button and print CSS that hides the admin chrome. Rows
  only appear when the registration completed (joined to `checkin_people`),
  so an abandoned card payment never shows.

## Not in scope

- Retention: purge `child_care_details` after each convention (owner decision).
  Care rows are saved before the payment step and deleted again if that step
  fails (Stripe error, token error); rows left by an abandoned card checkout
  have no `checkin_people` row and are removed by the purge query in
  migration 0026's header.
- Editing care details after submitting (parents contact the ministry).
