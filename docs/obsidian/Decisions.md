---
project: cacnorthamerica
type: decisions
status: active
last_updated: 2026-08-22
tags: [project/cacnorthamerica]
---

# Decisions

Related: [[Project]] · [[Architecture]] · [[Features]]

Notable choices inferred from code and commit history (no ADR docs exist in
the repo — this is reconstructed).

## Fork the sibling site rather than build from scratch

CACNA's site is a full copy of cac-salvation-center.org's Next.js app,
re-pointed at its own Supabase project, per the README. This explains why
the schema (migration 0001–0003) and admin console arrived essentially
complete on day one, and why nearly the entire subsequent commit history is
content/copy replacement rather than net-new features.

## Drop features the donor site had but CACNA doesn't need

- `testimonies` and `prayer_requests` tables dropped (0008) — CACNA chose
  not to run these donor-site features.
- The full convention registration schema (`convention_registrants`,
  `convention_registrations`, `convention_pricing_tiers`,
  `convention_schedule_sessions`) was added (0007) then dropped again
  (0009) — registration was handled by linking out to a dedicated
  Convention site instead of duplicating it in-app (commit `1522461`,
  "Cross-link CACNA with the dedicated Convention site").

## Everything except Supabase URL/key is optional and fails soft

Per the README: Cloudinary, Stripe, Resend, Behold, Google Analytics/Ads,
YouTube, and the Sheets webhook are all optional env vars — each integration
no-ops or errors gracefully at the point of use if left blank. This keeps
local dev and preview deploys usable without provisioning every third-party
service.

## Single-tier auth gate for /admin

No roles/permissions system — `proxy.ts` middleware redirects any
unauthenticated request under `/admin` (except `/admin/login`) to login.
Admin write access relies on `SUPABASE_SERVICE_ROLE_KEY` being present
server-side; without it, admin login/writes don't work but public pages
still render in an RLS-limited fallback (per README).

## Zone Directory: honest about coverage gaps

Commit `2c805e2` ("NearbyChurchFinder: honest coverage-gap message when
closest church is far away") — a deliberate UX choice to surface when the
`churches` data doesn't actually cover a searcher's area, rather than
silently showing a far-away result as if it were nearby.

## Canonical domain correction

Commits `e352201` and `7e0daf1` fixed the site's declared canonical domain
(sitemap.xml, llms.txt, SITE_URL) to `cacna.cacsalvationcenter.org` after it
was found pointing at the wrong site — worth knowing if the production
domain changes again, since it's declared in multiple places
(`next.config.ts`/env, `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt`).

## `llms.txt` for LLM crawlers

`public/llms.txt` exists and is deliberately maintained (kept in sync with
site metadata per commit `8f1c9ec`), showing the project actively considers
LLM-based crawling/indexing of its content.
