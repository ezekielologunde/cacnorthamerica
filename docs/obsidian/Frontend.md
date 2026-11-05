---
project: cacnorthamerica
type: frontend
status: active
last_updated: 2026-11-05
tags: [project/cacnorthamerica]
---

# Frontend

Related: [[Architecture]] · [[Features]] · [[Backend]]

- Next.js 16 App Router, React 19, Tailwind CSS 4 (see [[Project]]).
- Public pages: `app/(site)/[locale]/` -- about, accessibility, archive,
  bible-institute, blog, business-group, cacma, calendar, children,
  christian-education, contact, events, faq, gallery, giving, good-women,
  history, leadership, ministers-wives, ministries, online, plan-your-visit,
  privacy, refunds, serve, sitemap, statement-of-faith, store, terms,
  watchwords, youth, zones.
- Single locale `en`, unprefixed URLs (`i18n/routing.ts`); the `[locale]`
  segment remains from the removed bilingual setup. `/youth` itself redirects
  to `yyam.cacna.org` (`next.config.ts`), so the `youth` page folder is not
  reachable at that path.
- Admin: `app/admin/(protected)/` -- admins, announcements, blog,
  cac-world-news, check-in, contact, events, gallery, newsletter, operations;
  public `login` and `reset-password`.
- State: `contexts/CartContext.tsx` (store cart).
- Images: `images.unoptimized: true` (Vercel Image Optimization quota
  exhausted, per `next.config.ts` comment); Cloudinary loader.
- Forms show a Cloudflare Turnstile widget below the fields (PRs #111, #115).
