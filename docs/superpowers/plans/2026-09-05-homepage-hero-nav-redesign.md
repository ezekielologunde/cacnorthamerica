# Homepage Hero Redesign + Navigation Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Swap the homepage hero's Welcome/Convention slide backgrounds from photo to video (with a poster-image fallback since no real video file exists yet), remove the floating ambient background words, and add a "Ministries" mega-menu dropdown to the primary nav so the 6 sub-ministry pages plus `/children` are discoverable from the nav bar.

**Architecture:** Two independent, separately-committed changes against existing components — no new files, no new dependencies. `components/sections/Hero.tsx`'s `SlideBg` discriminated union gains a `video` variant; `components/navigation/Nav.tsx`'s `navItems` data array gains one more entry and its dropdown-panel renderer gains an optional 2-column grid layout.

**Tech Stack:** Next.js (App Router), TypeScript, `framer-motion` (existing `AnimatePresence`/`motion.div` crossfade, unchanged), `next-intl` (existing `useTranslations`/`getTranslations`, unchanged).

## Global Constraints

- No real video asset is being sourced or committed — code points at `/videos/welcome-hero.mp4` and `/videos/convention-hero.mp4`, which do not exist in `public/videos/` yet. The `poster` image is the real, currently-visible fallback and must always be supplied.
- No icons in the new Ministries mega-menu — text-only (label + one-line description), matching the site's 3 existing dropdowns exactly.
- `/plan-your-visit` and `/sitemap` are NOT added to any nav dropdown — they stay footer-only.
- This repo has no automated test runner (`docs/obsidian/Tasks.md` confirms none exists). Verification in every task uses `npm run build` and `npx tsc --noEmit` (both already used as this project's verification method per `docs/obsidian/Changelog.md`), plus a manual browser walk — not a new test framework.
- New Nav-namespace translation keys go into **both** `messages/en.json` and `messages/yo.json` with **identical English text** in both files. This matches this specific namespace's existing, established convention (most Nav dropdown labels/descriptions — e.g. `eventsConvention`, `calendarEventsDesc`, `watchOnlineDesc` — are still English placeholders in `yo.json` today; see its top-level `_translationStatus` note). Do not draft new Yoruba for these keys — that's separate, deferred work requiring the site owner's own review pass (see the spec's Follow-up section).

---

### Task 1: Hero background video (Welcome + Convention slides) + remove ambient floating words

**Files:**
- Modify: `components/sections/Hero.tsx`

**Interfaces:**
- Consumes: nothing new — self-contained within this file's existing `Slide`/`SlideBg` types and `useSlides()` hook.
- Produces: `SlideBg` gains a third variant, `{ type: "video"; src: string; poster: string; alt: string }`, alongside the existing `"photo"` and `"gradient"` variants. Nothing outside this file consumes `SlideBg`.

- [ ] **Step 1: Extend the `SlideBg` type with a `video` variant**

In `components/sections/Hero.tsx`, find:

```ts
type SlideBg = { type: "photo"; src: string; alt: string } | { type: "gradient"; value: string };
```

Replace with:

```ts
type SlideBg =
  | { type: "photo"; src: string; alt: string }
  | { type: "video"; src: string; poster: string; alt: string }
  | { type: "gradient"; value: string };
```

- [ ] **Step 2: Switch the Welcome slide's background to video**

Find (inside `useSlides()`):

```ts
      bg: { type: "photo", src: "/images/cac-congregation-worship.jpg", alt: "CACNA congregation in worship" },
    });
```

(this is the `slides.push({ key: "welcome", ... })` call). Replace the `bg` line with:

```ts
      bg: { type: "video", src: "/videos/welcome-hero.mp4", poster: "/images/cac-congregation-worship.jpg", alt: "CACNA congregation in worship" },
    });
```

- [ ] **Step 3: Switch the Convention slide's background to video**

Find (inside the `slides.push({ key: "convention", ... })` call):

```ts
      bg: { type: "photo", src: "/images/cac-youth-convention.jpg", alt: "CACNA youth at a past Annual Convention" },
    });
```

Replace with:

```ts
      bg: { type: "video", src: "/videos/convention-hero.mp4", poster: "/images/cac-youth-convention.jpg", alt: "CACNA youth at a past Annual Convention" },
    });
```

- [ ] **Step 4: Render the video background in the crossfade block**

Find the background-crossfade block:

```tsx
      {/* Background — crossfades with the active slide */}
      <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <AnimatePresence>
          <motion.div
            key={slide.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: 0,
              ...(slide.bg.type === "photo"
                ? { backgroundImage: `url(${slide.bg.src})`, backgroundSize: "cover", backgroundPosition: "center" }
                : { background: slide.bg.value }),
            }}
          />
        </AnimatePresence>
      </div>
```

Replace with:

```tsx
      {/* Background — crossfades with the active slide */}
      <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <AnimatePresence>
          <motion.div
            key={slide.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: 0,
              ...(slide.bg.type === "photo"
                ? { backgroundImage: `url(${slide.bg.src})`, backgroundSize: "cover", backgroundPosition: "center" }
                : slide.bg.type === "gradient"
                ? { background: slide.bg.value }
                : {}),
            }}
          >
            {slide.bg.type === "video" && (
              <video
                key={slide.bg.src}
                autoPlay
                muted
                loop
                playsInline
                poster={slide.bg.poster}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              >
                <source src={slide.bg.src} type="video/mp4" />
              </video>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
```

The `poster` attribute is what actually renders right now (and always, if the video fails to load or autoplay is blocked) — `public/videos/welcome-hero.mp4` and `public/videos/convention-hero.mp4` do not exist yet, so this step is what makes that safe.

- [ ] **Step 5: Remove the ambient floating background words**

Find and delete this constant (near the top of the file, above `export function Hero()`):

```ts
const BG_WORDS = [
  { w: "GRACE",     l: 4,  delay: 0,   dur: 22, sz: 48, o: 0.05  },
  { w: "FAITH",     l: 77, delay: 1,   dur: 28, sz: 30, o: 0.04  },
  { w: "HOPE",      l: 21, delay: 2,   dur: 18, sz: 62, o: 0.055 },
  { w: "LOVE",      l: 63, delay: 0.5, dur: 24, sz: 38, o: 0.045 },
  { w: "FAMILY",    l: 53, delay: 1.2, dur: 32, sz: 18, o: 0.04  },
] as const;
```

Then find and delete this rendering block, further down inside `export function Hero()`:

```tsx
      {/* Floating ambient words — decorative, not slide-dependent */}
      {!reduce && (
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden", pointerEvents: "none" }}>
          {BG_WORDS.map(({ w, l, delay, dur, sz, o }) => (
            <motion.span
              key={w}
              initial={{ y: "110vh" }}
              animate={{ y: "-110vh" }}
              transition={{ duration: dur, delay, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", left: `${l}%`, top: 0, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: sz, color: `rgba(255,255,255,${o})`, letterSpacing: "-0.02em", userSelect: "none", whiteSpace: "nowrap" }}
            >
              {w}
            </motion.span>
          ))}
        </div>
      )}
```

Do not remove the `reduce` variable itself (`const reduce = useReducedMotion();`) — it's still used by the slide auto-advance effect and the content crossfade's `y` offset.

- [ ] **Step 6: Verify the build and types are clean**

Run: `npm run build`
Expected: build completes with no errors (existing pages still prerender).

Run: `npx tsc --noEmit`
Expected: no type errors.

- [ ] **Step 7: Manual check in the browser**

Start the dev server (`npm run dev`), open the homepage, and confirm:
- The Welcome and Convention slides show their poster images (today's existing photos) — no broken video icon, no blank frame.
- The other 4 slides (Anniversary, Pilgrimage, Giving, News) look exactly as they did before.
- No floating "GRACE/FAITH/HOPE/LOVE/FAMILY" text appears anywhere in the hero.
- The carousel still auto-advances, arrows/dots still work.

- [ ] **Step 8: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "Hero: video background for Welcome/Convention slides, remove ambient floating words"
```

---

### Task 2: Add "Ministries" nav translation keys

**Files:**
- Modify: `messages/en.json` (`Nav` namespace)
- Modify: `messages/yo.json` (`Nav` namespace)

**Interfaces:**
- Consumes: nothing.
- Produces: 15 new keys in the `Nav` namespace, identical text in both files: `cacma`, `cacmaDesc`, `youth`, `youthDesc`, `christianEducation`, `christianEducationDesc`, `goodWomen`, `goodWomenDesc`, `ministersWives`, `ministersWivesDesc`, `businessGroup`, `businessGroupDesc`, `children`, `childrenDesc`, `seeAllMinistries`. Task 3 calls `t('cacma')`, `t('cacmaDesc')`, etc. on these, plus the two pre-existing keys `t('ministries')` ("Ministries") and `t('ministriesDesc')` ("Find your place to serve").

- [ ] **Step 1: Add the keys to `messages/en.json`**

In the `Nav` namespace, find:

```json
    "bibleInstitute": "Bible Institute",
    "bibleInstituteDesc": "Ministerial training arm of CACNA",
    "media": "Media",
```

Replace with:

```json
    "bibleInstitute": "Bible Institute",
    "bibleInstituteDesc": "Ministerial training arm of CACNA",
    "cacma": "CACMA",
    "cacmaDesc": "Supporting CACNA's ministers and Bible training",
    "youth": "Youth & Young Adult",
    "youthDesc": "Discipleship, evangelism, and worship for CACNA's youth",
    "christianEducation": "Christian Education",
    "christianEducationDesc": "Sunday School and Bible teaching across CACNA",
    "goodWomen": "Good Women Association",
    "goodWomenDesc": "Prayer, hospitality, and generosity across CACNA",
    "ministersWives": "Ministers' Wives Conference",
    "ministersWivesDesc": "Fellowship for the wives of CACNA's ministers",
    "businessGroup": "Business Group Fellowship",
    "businessGroupDesc": "Mentorship and support for business-inclined members",
    "children": "Children's Ministry",
    "childrenDesc": "Worship, teaching, and care for CACNA's youngest",
    "seeAllMinistries": "All Ministries",
    "media": "Media",
```

- [ ] **Step 2: Add the same keys, same English text, to `messages/yo.json`**

In the `Nav` namespace, find:

```json
    "bibleInstitute": "Bible Institute",
    "bibleInstituteDesc": "Ministerial training arm of CACNA",
    "media": "Media",
```

Replace with the identical block used in Step 1 (same English text — see Global Constraints for why this namespace stays English for now):

```json
    "bibleInstitute": "Bible Institute",
    "bibleInstituteDesc": "Ministerial training arm of CACNA",
    "cacma": "CACMA",
    "cacmaDesc": "Supporting CACNA's ministers and Bible training",
    "youth": "Youth & Young Adult",
    "youthDesc": "Discipleship, evangelism, and worship for CACNA's youth",
    "christianEducation": "Christian Education",
    "christianEducationDesc": "Sunday School and Bible teaching across CACNA",
    "goodWomen": "Good Women Association",
    "goodWomenDesc": "Prayer, hospitality, and generosity across CACNA",
    "ministersWives": "Ministers' Wives Conference",
    "ministersWivesDesc": "Fellowship for the wives of CACNA's ministers",
    "businessGroup": "Business Group Fellowship",
    "businessGroupDesc": "Mentorship and support for business-inclined members",
    "children": "Children's Ministry",
    "childrenDesc": "Worship, teaching, and care for CACNA's youngest",
    "seeAllMinistries": "All Ministries",
    "media": "Media",
```

- [ ] **Step 3: Verify both files are valid JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); JSON.parse(require('fs').readFileSync('messages/yo.json','utf8')); console.log('OK')"`
Expected: `OK` (no `SyntaxError`).

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/yo.json
git commit -m "Add Nav translation keys for the Ministries mega-menu"
```

---

### Task 3: Nav.tsx — Ministries mega-menu (data + 2-column grid rendering)

**Files:**
- Modify: `components/navigation/Nav.tsx`

**Interfaces:**
- Consumes: the 15 translation keys from Task 2, plus the pre-existing `t('ministries')` / `t('ministriesDesc')`.
- Produces: `NavItem` interface gains `layout?: 'grid'`. `navItems` gains one more top-level entry (label `t('ministries')`, `href: '/ministries'`, `layout: 'grid'`, 8-item dropdown). The `Nav` component's exported behavior (props, other rendering) is otherwise unchanged — nothing outside this file consumes `NavItem`.

- [ ] **Step 1: Add the `layout` field to `NavItem`**

Find:

```ts
interface NavItem {
  label: string;
  href?: string;
  dropdown?: { href: string; label: string; desc: string; external?: boolean }[];
}
```

Replace with:

```ts
interface NavItem {
  label: string;
  href?: string;
  dropdown?: { href: string; label: string; desc: string; external?: boolean }[];
  /** Renders the dropdown panel as a 2-column grid instead of a single
   *  stack — for menus with enough items that one column would run long. */
  layout?: 'grid';
}
```

- [ ] **Step 2: Remove the redundant `/ministries` entry from "Who We Are", add the new "Ministries" top-level item**

Find:

```ts
    {
      label: t('whoWeAre'),
      href: withLocale('/about', locale),
      dropdown: [
        { href: withLocale('/about', locale), label: t('aboutCacna'), desc: t('aboutCacnaDesc') },
        { href: withLocale('/leadership', locale), label: t('leadership'), desc: t('leadershipDesc') },
        { href: withLocale('/zones', locale), label: t('zonesDccs'), desc: t('zonesDccsDesc') },
        { href: withLocale('/ministries', locale), label: t('ministries'), desc: t('ministriesDesc') },
        { href: withLocale('/bible-institute', locale), label: t('bibleInstitute'), desc: t('bibleInstituteDesc') },
      ],
    },
    {
      label: t('media'),
```

Replace with:

```ts
    {
      label: t('whoWeAre'),
      href: withLocale('/about', locale),
      dropdown: [
        { href: withLocale('/about', locale), label: t('aboutCacna'), desc: t('aboutCacnaDesc') },
        { href: withLocale('/leadership', locale), label: t('leadership'), desc: t('leadershipDesc') },
        { href: withLocale('/zones', locale), label: t('zonesDccs'), desc: t('zonesDccsDesc') },
        { href: withLocale('/bible-institute', locale), label: t('bibleInstitute'), desc: t('bibleInstituteDesc') },
      ],
    },
    {
      label: t('ministries'),
      href: withLocale('/ministries', locale),
      layout: 'grid',
      dropdown: [
        { href: withLocale('/cacma', locale), label: t('cacma'), desc: t('cacmaDesc') },
        { href: withLocale('/youth', locale), label: t('youth'), desc: t('youthDesc') },
        { href: withLocale('/christian-education', locale), label: t('christianEducation'), desc: t('christianEducationDesc') },
        { href: withLocale('/good-women', locale), label: t('goodWomen'), desc: t('goodWomenDesc') },
        { href: withLocale('/ministers-wives', locale), label: t('ministersWives'), desc: t('ministersWivesDesc') },
        { href: withLocale('/business-group', locale), label: t('businessGroup'), desc: t('businessGroupDesc') },
        { href: withLocale('/children', locale), label: t('children'), desc: t('childrenDesc') },
        { href: withLocale('/ministries', locale), label: t('seeAllMinistries'), desc: t('ministriesDesc') },
      ],
    },
    {
      label: t('media'),
```

- [ ] **Step 3: Render the dropdown panel as a 2-column grid when `layout === 'grid'`**

Find (inside the desktop dropdown rendering):

```tsx
                      <div style={{
                        background: dark ? 'rgba(18,20,26,.97)' : 'var(--paper)',
                        borderRadius: 16, padding: 8,
                        boxShadow: '0 20px 50px rgba(18,20,30,.16)',
                        border: `1px solid ${dark ? 'rgba(255,255,255,.1)' : 'var(--line)'}`,
                        minWidth: 200,
                      }}>
```

Replace with:

```tsx
                      <div style={{
                        background: dark ? 'rgba(18,20,26,.97)' : 'var(--paper)',
                        borderRadius: 16, padding: 8,
                        boxShadow: '0 20px 50px rgba(18,20,30,.16)',
                        border: `1px solid ${dark ? 'rgba(255,255,255,.1)' : 'var(--line)'}`,
                        minWidth: item.layout === 'grid' ? 440 : 200,
                        ...(item.layout === 'grid'
                          ? { display: 'grid' as const, gridTemplateColumns: '1fr 1fr', gap: 2 }
                          : {}),
                      }}>
```

No other change is needed here — each dropdown item already renders as its own block-level element, which lays out correctly as a grid cell too. The other 3 dropdowns (`item.layout` is `undefined` for them) keep rendering exactly as before, since `item.layout === 'grid'` is `false` for them.

- [ ] **Step 4: Verify the build and types are clean**

Run: `npm run build`
Expected: build completes with no errors, all routes (including `/en/...` and `/yo/...`) still prerender.

Run: `npx tsc --noEmit`
Expected: no type errors.

- [ ] **Step 5: Manual check in the browser — desktop**

Start the dev server, open the homepage at both `/en` and `/yo`, and confirm:
- A new "Ministries" item appears in the top nav, after "Who We Are" and before "Media".
- Hovering it opens a 2-column grid panel with 8 links: CACMA, Youth & Young Adult, Christian Education, Good Women Association, Ministers' Wives Conference, Business Group Fellowship, Children's Ministry, and "All Ministries" — each with its one-line description underneath, no icons.
- Every link navigates to the correct locale-prefixed route (e.g. `/en/cacma`, `/yo/youth`) and highlights as active on arrival.
- Opening "Who We Are" no longer shows a "Ministries" entry (only About CACNA, Leadership, Zones & DCCs, Bible Institute).
- The other 2 dropdowns (Events & Convention, Media) still render as a single-column stack, unchanged.

- [ ] **Step 6: Manual check in the browser — mobile**

Resize to a mobile viewport (or use the mobile emulation preset), open the hamburger menu, and confirm:
- "Ministries" appears as a new expandable accordion section, in the same position.
- Expanding it shows all 8 links stacked in a single column (the grid layout is desktop-only — the mobile overlay already renders dropdown items as a `flex-direction: column` stack regardless of `layout`).
- Tapping a link navigates and closes the mobile menu, same as every other nav link today.

- [ ] **Step 7: Commit**

```bash
git add components/navigation/Nav.tsx
git commit -m "Nav: add Ministries mega-menu dropdown (2-column grid)"
```

---

### Task 4: Update project docs, final end-to-end verification

**Files:**
- Modify: `docs/obsidian/Changelog.md`
- Modify: `docs/obsidian/Tasks.md`

**Interfaces:**
- Consumes: Tasks 1-3 complete and committed.
- Produces: nothing consumed elsewhere — this is the terminal task.

- [ ] **Step 1: Add a Changelog entry**

At the top of `docs/obsidian/Changelog.md`, right after the `# Changelog` heading and its `Related:` line, insert a new dated entry:

```markdown
## 2026-09-05 — Homepage hero video background + Ministries nav mega-menu

Implemented the approved design (see `docs/superpowers/specs/2026-09-05-homepage-hero-nav-redesign-design.md`). The Welcome and Convention hero slides now use a `video` background (poster-fallback, since no real video file has been supplied yet -- `public/videos/welcome-hero.mp4` and `public/videos/convention-hero.mp4` are placeholders for the site owner to fill in); the other 4 slides are unchanged. Removed the floating ambient background words (GRACE/FAITH/HOPE/LOVE/FAMILY) since the video already supplies motion. Added a "Ministries" mega-menu to the primary nav (2-column grid, text-only) linking all 6 sub-ministry pages plus `/children`, so content added during the Convention merge is finally discoverable from the nav bar instead of only `/ministries` or the footer; removed the now-redundant `/ministries` link from the "Who We Are" dropdown.
```

- [ ] **Step 2: Update `docs/obsidian/Tasks.md`**

In the "Remaining, not yet done" list under "## Phase H: final data-completeness audit (2026-09-05)", the nav-discoverability gap this work closes isn't explicitly listed there today, so no line needs removing. Instead, add a new top-level section documenting the follow-up items this conversation surfaced but deliberately did not implement. Find the end of the file (after the "## No automated test suite found" section) and append:

```markdown

## Homepage hero + nav follow-ups (2026-09-05)

The hero/nav redesign (see [[Changelog]] and `docs/superpowers/specs/2026-09-05-homepage-hero-nav-redesign-design.md`) is implemented, but real video files still need to be supplied by the site owner at `public/videos/welcome-hero.mp4` and `public/videos/convention-hero.mp4` -- until then, the Welcome/Convention hero slides show their poster image, same as before this change visually.

Also surfaced during that conversation, not yet started:
- Two calendar events to add to `lib/events.ts`'s `specialEvents`: the HOPE Annual Summit (Sept 12, 2026) and the CACMA Latunde Region prayer/fasting meeting (real Zoom details already provided).
- Connecting the registration flow's Google Sheets logging (`lib/sheetsWebhook.ts`) to the site owner's own Google account/spreadsheet, and confirming the Zelle/payment details shown on the register page are correct.
```

- [ ] **Step 3: Final full-repo verification**

Run: `npm run build`
Expected: clean build, all routes prerender at both `/en/...` and `/yo/...`.

Run: `npx tsc --noEmit`
Expected: no type errors.

Run: `npm run lint`
Expected: no new lint errors introduced by Tasks 1-3 (pre-existing warnings, if any, are out of scope).

- [ ] **Step 4: Commit**

```bash
git add docs/obsidian/Changelog.md docs/obsidian/Tasks.md
git commit -m "Update Changelog/Tasks for the hero video + Ministries nav mega-menu"
```
