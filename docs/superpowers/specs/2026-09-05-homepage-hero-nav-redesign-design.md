---
project: cacnorthamerica
type: spec
status: approved
date: 2026-09-05
tags: [project/cacnorthamerica, homepage, navigation]
---

# Homepage Hero Redesign + Navigation Optimization

## Context

Following the Convention→CACNA content merge (Phases A–H, all live on `master`),
several real pages have no entry point in the primary navigation — the 6
sub-ministry pages, `/children`, `/plan-your-visit`, and `/sitemap` are only
reachable via the `/ministries` directory page or the footer. Separately, the
homepage hero (`components/sections/Hero.tsx`) uses a rotating photo/gradient
carousel; the site owner wants a video background instead.

This spec covers two independent, separately-shippable changes:

1. **Hero**: swap select slide backgrounds from photo to video.
2. **Navigation**: add a dedicated "Ministries" mega-menu so the merged pages
   are actually discoverable.

Both keep every other piece of existing behavior (carousel timing, dropdown
hover mechanics, mobile accordion, locale-awareness, scroll-aware theming)
unchanged.

## Goals

- Give the hero a more contemporary, motion-forward feel via video, without
  a rewrite of its carousel architecture.
- Make the ministries added during the Convention merge actually discoverable
  from the primary nav, not just the footer or `/ministries`.
- Change nothing else about site structure, copy, or unrelated components.

## Non-goals

- No real video asset is being produced or sourced as part of this work — the
  code will point at real file paths that don't exist yet; the site owner
  supplies the actual footage afterward.
- `/plan-your-visit` and `/sitemap` are not added to the primary nav — they
  stay footer-only (owner's explicit call: they're reference pages, not
  primary nav material).
- No icons are added to the new mega-menu (owner's explicit call: stay
  consistent with the existing text-only dropdowns).
- Unrelated to this spec: the two calendar events (HOPE Annual Summit,
  CACMA Latunde Region prayer meeting) surfaced during this conversation, the
  Yoruba native-speaker review, the admin console gaps, and the Chase account
  discrepancy. All deferred — see [[Tasks]].

## Design: Hero background video

### Data model change

`components/sections/Hero.tsx`'s `SlideBg` union gains a third variant:

```ts
type SlideBg =
  | { type: "photo"; src: string; alt: string }
  | { type: "video"; src: string; poster: string; alt: string }
  | { type: "gradient"; value: string };
```

`poster` is required, not optional — every video-backed slide must supply a
still image. This is what actually renders whenever the video file is
missing, still loading, or the browser can't autoplay it, so the hero always
looks correct even before a real file is dropped in.

### Which slides get video

Only the **Welcome** slide (`key: "welcome"`) and the **Convention** slide
(`key: "convention"`) switch to `type: "video"`. Anniversary, Pilgrimage/Ad,
Giving, and News slides keep their current `photo`/`gradient` backgrounds —
untouched.

Video paths (files to be supplied later by the site owner):
- Welcome slide: `/videos/welcome-hero.mp4`, poster = today's existing
  `/images/cac-congregation-worship.jpg`
- Convention slide: `/videos/convention-hero.mp4`, poster = today's existing
  `/images/cac-youth-convention.jpg`

### Rendering

Inside the background-crossfade block (currently switching on
`slide.bg.type === "photo"` vs. the gradient fallback), add a third branch:
a `<video>` element with `autoPlay muted loop playsInline poster={slide.bg.poster}`,
sized identically to the photo case (`inset:0`, `object-fit: cover`). It
participates in the same `AnimatePresence`/`key={slide.key}` crossfade as
today — no changes to the crossfade mechanism itself.

`prefers-reduced-motion` is already respected for the ambient words and the
carousel's auto-advance timer (both gated on the existing `reduce` flag from
`useReducedMotion()`); the video's `autoPlay` is left as-is since a muted,
looping background video is standard practice under reduced-motion and the
poster frame is the correct static fallback if a browser or extension blocks
autoplay.

### Motion cleanup

Remove the `BG_WORDS` floating ambient word animation (the
`GRACE`/`FAITH`/`HOPE`/`LOVE`/`FAMILY` drifting text layer) entirely — video
already provides ambient motion, and the two layered together read as
cluttered. This means removing the `BG_WORDS` constant and its rendering
block; no other motion in the hero is affected.

### Everything else unchanged

Carousel auto-advance (7s), pause-on-hover, prev/next arrows, dot indicators,
crossfade transitions and timing, the centered content layout (eyebrow →
title → description → CTA → quick-links), and the dark gradient/vignette
overlays all stay exactly as they are today.

## Design: Navigation — Ministries mega-menu

### New nav item

`components/navigation/Nav.tsx`'s `navItems` array gains a new top-level
entry, positioned after "Who We Are" and before "Media":

```ts
{
  label: t('ministries'), // reuses existing "Ministries" translation key
  href: withLocale('/ministries', locale),
  dropdown: [
    { href: withLocale('/cacma', locale), label: t('cacma'), desc: t('cacmaDesc') },
    { href: withLocale('/youth', locale), label: t('youth'), desc: t('youthDesc') },
    { href: withLocale('/christian-education', locale), label: t('christianEducation'), desc: t('christianEducationDesc') },
    { href: withLocale('/good-women', locale), label: t('goodWomen'), desc: t('goodWomenDesc') },
    { href: withLocale('/ministers-wives', locale), label: t('ministersWives'), desc: t('ministersWivesDesc') },
    { href: withLocale('/business-group', locale), label: t('businessGroup'), desc: t('businessGroupDesc') },
    { href: withLocale('/children', locale), label: t('children'), desc: t('childrenDesc') },
    { href: withLocale('/ministries', locale), label: t('seeAllMinistries'), desc: t('seeAllMinistriesDesc') },
  ],
  layout: 'grid', // new optional flag, see below
}
```

New translation keys needed in the `Nav` namespace (`messages/en.json` /
`messages/yo.json`): `ministries`, plus a `label`/`desc` pair for each of the
7 items above (`cacma`, `cacmaDesc`, `youth`, `youthDesc`, …) and
`seeAllMinistries`/`seeAllMinistriesDesc`. The 6 sub-ministry names and
"Children" already have equivalent copy elsewhere in the site's translation
files (their own page namespaces) — reuse that exact wording for consistency
rather than drafting new phrasing.

Remove the existing `/ministries` entry from the "Who We Are" dropdown (it's
now redundant with the new dedicated dropdown, which also carries a
"See All Ministries" link back to the same page).

### Grid layout

`NavItem` interface gains an optional `layout?: 'grid'` field. In the desktop
dropdown panel's rendering, when `item.layout === 'grid'`, the container that
currently lays out dropdown items as a single-column stack switches to a
2-column CSS grid (`display: grid; grid-template-columns: 1fr 1fr; gap: ...`)
and gets a wider `minWidth` (today's dropdown panel is `minWidth: 200`; the
grid panel needs roughly double that to fit two columns of label+description
comfortably — final pixel value decided during implementation against real
rendered text). Item styling (label/description typography, hover
background, padding) is unchanged — only the container's layout direction
differs. Panels without `layout: 'grid'` keep rendering exactly as they do
today (no regression to the other 3 dropdowns).

### Mobile

No special-casing needed: the mobile accordion already renders each
dropdown's items as a `flex-direction: column` stack regardless of desktop
layout. The Ministries section's 7 links simply appear as one more
expandable accordion section, stacked, matching how every other mobile
dropdown section already behaves.

### Everything else unchanged

Desktop hover/mouseleave "bridge" mechanics, the `Cmd/Ctrl+K` search
shortcut, the convention CTA pill (auto-hiding once `isConventionPast`),
scroll-aware background/text-color transitions, and the mobile hamburger
overlay structure are all untouched.

## Verification

- `npm run build` + `npx tsc --noEmit` — must stay clean after both changes.
- Manual browser walk (both locales, desktop + mobile viewport):
  - Confirm the Welcome and Convention slides render their poster image
    correctly (since no real video file exists yet, this is the actual
    visible behavior until the owner supplies footage) and that the other
    4 slides are visually unchanged.
  - Confirm the ambient floating words are gone.
  - Confirm the new "Ministries" dropdown opens as a 2-column grid on desktop,
    links to all 7 pages resolve correctly (locale-prefixed), and the
    "Who We Are" dropdown no longer duplicates the `/ministries` link.
  - Confirm the mobile accordion shows "Ministries" as a new expandable
    section with all 7 links stacked.

## Follow-up work (not in this spec)

- Site owner supplies real video files at `/videos/welcome-hero.mp4` and
  `/videos/convention-hero.mp4` (no filler/stock video is being committed as
  part of this work).
- Add the two calendar events raised during this conversation (HOPE Annual
  Summit — Sept 12, 2026; CACMA Latunde Region prayer meeting — real Zoom
  details, single entry spanning Fri 7PM–Sat 10PM ET) to `lib/events.ts`'s
  `specialEvents`, following the existing `ChurchEvent` pattern.
- Yoruba native-speaker review of all `_translationStatus`-flagged strings.
- Admin console gaps for `departments`/`leaders`/`tenets`/`churches`/
  `site_content`/`site_settings`.
- Resolve the Chase account number discrepancy between registration payments
  and the Village Pay Off giving campaign (needs owner confirmation, not a
  code change by itself).
