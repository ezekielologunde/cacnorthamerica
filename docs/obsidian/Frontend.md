---
project: cacnorthamerica
type: frontend
status: active
last_updated: 2026-11-08
tags: [project/cacnorthamerica]
---

# Frontend

Related: [[Architecture]] · [[Features]] · [[Backend]]

- Next.js 16 App Router, React 19, Tailwind CSS 4 (see [[Project]]).
- Public pages: `app/(site)/[locale]/` -- about, accessibility, archive,
  bible-institute, blog, business-group, cacma, calendar, children,
  christian-education, contact, events, faq, forms, gallery, giving, good-women,
  history, leadership, ministers-wives, ministries, online, plan-your-visit,
  privacy, refunds, serve, sitemap, statement-of-faith, store, terms,
  watchwords, youth, zones.
- Single locale `en`, unprefixed URLs (`i18n/routing.ts`); the `[locale]`
  segment remains from the removed bilingual setup. `/youth` itself redirects
  to `yyam.cacna.org` (`next.config.ts`), so the `youth` page folder is not
  reachable at that path.
- Admin: `app/admin/(protected)/` -- admins, announcements, blog,
  cac-world-news, check-in, contact, events, forms, gallery, newsletter,
  operations;
  public `login` and `reset-password`.
- Forms directory: `lib/siteForms.ts` lists every form on the site and feeds both
  the public `/forms` page and the admin `/admin/forms` overview. It is separate
  from `lib/forms.ts`, which holds the submit helpers. Add a new form to the
  list when one is added to the site.
- State: `contexts/CartContext.tsx` (store cart).
- Images: `images.unoptimized: true` (Vercel Image Optimization quota
  exhausted, per `next.config.ts` comment); Cloudinary loader.
- Forms show a Cloudflare Turnstile widget below the fields (PRs #111, #115).

## Round 2 additions (2026-11-08)

- **Shared navigation IA:** `lib/nav.ts` is the single list of sections and
  links; the header (`components/navigation/Nav.tsx`) and the footer
  (`components/sections/FooterExperience.tsx`) both render it so they cannot
  drift. Labels are keys in the `Nav` namespace of `messages/en.json` (links
  built from site data carry their own text); a link can be limited to header or
  footer, and a whole section can be footer-only (`footerOnly`). The header
  shows Who We Are, Ministries, Events, Media; one-off events are on the
  Calendar and in the footer. Current-page highlighting uses
  `lib/navMatch.ts` (tested in `lib/navMatch.test.mjs`). The convention links
  follow `currentOrNextConvention()`.
- **`ChildCareFields`** (`components/register/ChildCareFields.tsx`): the
  Children's Ministry care panel inside `YouthRegisterForm.tsx`, one per child
  12 or under plus one family block (emergency contact, up to 4 pickups, care
  consent). Rules live in `lib/childCare.ts` and are re-checked on the server.
  Its state is never written to browser storage, analytics or the URL. Data
  handling: [[Security]].
- **Admin care views:** `components/admin/ChildCareSummary.tsx` (allergy flag
  and care summary on `/admin/check-in`) and the printable
  `/admin/check-in/children` sheet with `PrintButton`. See [[Backend]].
- **Yoruba-friendly touches:** `lib/yoruba.ts` holds a short list of standard
  Yoruba phrases shown inline on the English-only site (used by the pastor
  welcome, plan-your-visit and the search index), each rendered in an element
  with `lang="yo"`. Strings must stay NFC with tone marks
  (`lib/yoruba.test.mjs`). The site stays single-locale English; see
  [[Decisions]].
- **Home reads merged content:** the home page, hero, Latest News and Upcoming
  Programs read static posts/events merged with those published from the admin
  (`lib/blogPosts.ts`, `lib/blogMerge.ts`, `lib/dbEvents.ts`), the same data as
  `/blog` and `/calendar`. Freshness: [[Architecture]].
