---
project: cacnorthamerica
type: tasks
status: active
last_updated: 2026-08-22
tags: [project/cacnorthamerica]
---

# Tasks / Gaps

Related: [[Project]] · [[Features]] · [[Architecture]]

No `TODO`/`FIXME` comments were found in `app/`, `lib/`, or `components/` —
the codebase is clean of inline markers. Gaps below are inferred from the
README, dependency list, and route structure.

## Content

- **Primary ongoing task**: the site still ships with cac-salvation-center's
  own content (copy, staff names, event details, blog posts) in most places
  — this is being replaced page by page with real CAC North America content
  and data (stated directly in README's "Content status" section). Most of
  the commit history to date is this replacement work; it is not finished.

## Stripe integration appears incomplete

`stripe` is a dependency and `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`
are in `.env.example`, but no `/api` route for checkout sessions or webhook
handling was found under `app/api` (only `contact`, `gallery`, `instagram`,
`cloudinary/sign` exist). The `products`/`orders` tables and `CartContext`
exist, so a checkout/payment flow may be planned but not yet wired up —
worth confirming with the project owner before assuming it's live.

## Admin coverage vs. site content

Admin console covers announcements, blog, events, gallery, newsletter,
orders, and admin users — but public pages also pull from `departments`,
`leaders`, `tenets`, `churches`, `site_content`, and `site_settings`, none
of which have an obvious admin UI in `app/admin/(protected)`. If those are
meant to be editable without a direct SQL/Supabase-studio edit, admin pages
for them may be a gap.

## No automated test suite found

No test runner/config (`jest`, `vitest`, `playwright`, etc.) appears in
`package.json`. Confirm this is intentional for a content site before
adding CI test requirements.
