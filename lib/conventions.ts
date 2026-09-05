/** The Annual Convention is always held at the same village — this never
 *  changes year to year. */
export const CONVENTION_VENUE = "CAC Village, 14051 Stahley Rd, Blue Ridge Summit, PA 17214";
export const CONVENTION_VENUE_SHORT = "CAC Village, Blue Ridge Summit, PA";

export type RegistrantCategory = "adult" | "young_adult" | "child";

export interface PricingTier {
  category: RegistrantCategory;
  priceCents: number;
  /** ISO date — inclusive start of this tier's window. */
  startsOn: string;
  /** ISO date — inclusive end of this tier's window. */
  endsOn: string;
}

export interface ConventionYear {
  year: number;
  /** ISO date, e.g. "2026-07-13" (always a Monday). */
  startIso: string;
  /** ISO date, e.g. "2026-07-18" (always a Saturday). */
  endIso: string;
  /** Only known/confirmed for the current convention — future years don't have one yet. */
  theme?: string;
  /** Overrides CONVENTION_VENUE for a year that didn't meet at the usual
   *  site — e.g. 2020's virtual, COVID-era convention. Every other year
   *  meets at CAC Village and leaves this unset. */
  venue?: string;
  /** Only set once a real registration link exists for that year. An
   *  internal path (e.g. "/events/cacna-2027/register") renders as a normal
   *  same-site link (see hasExternalRegistrationUrl); an absolute URL opens
   *  in a new tab. */
  registrationUrl?: string;
  /** Registration fees by category and date window. Undefined/empty means
   *  registration for this year isn't open yet — pricing hasn't been set. */
  pricingTiers?: PricingTier[];
  /** Detail page for this year. */
  href: string;
}

/** Every confirmed convention date, current and future. Add a new year here
 *  as soon as it's announced — everything downstream (nav CTA, events page,
 *  announcement bar) picks it up automatically. */
export const conventionYears: ConventionYear[] = [
  // 2019/2020/2024 have no dedicated /events/cacna-YYYY detail page (excluded
  // from the [slug] "Save the Date" template via its FUTURE_YEARS filter,
  // since that copy is written for upcoming years, not archived ones) --
  // href points at the archive listing instead. No pricingTiers recorded for
  // these three; only 2026's fees were ever digitized.
  {
    year: 2019, startIso: "2019-07-15", endIso: "2019-07-20",
    theme: "That the Scripture Might Be Fulfilled",
    href: "/archive",
  },
  {
    year: 2020, startIso: "2020-07-15", endIso: "2020-07-17",
    theme: "God in the Administration of Man",
    // Held via Zoom due to the COVID-19 pandemic -- the one year that
    // wasn't at CAC Village (confirmed against Convention's own
    // lib/content/convention.ts during the Phase B data reconciliation).
    venue: "Virtual (Zoom Video Conference) — held online due to the COVID-19 pandemic",
    href: "/archive",
  },
  {
    year: 2024, startIso: "2024-07-15", endIso: "2024-07-20",
    theme: "Spiritual Power and Gifts for the Body of Christ",
    href: "/archive",
  },
  {
    year: 2026,
    startIso: "2026-07-13",
    endIso: "2026-07-18",
    theme: "The Bible: God’s Message to Man",
    registrationUrl: "https://cacnaconvention.cacsalvationcenter.org/archive",
    // Archival record of what 2026 actually cost — this convention has
    // already happened, so this only ever surfaces on the archive page, not
    // a live /register flow (getOpenPricing() below only reads pricingTiers
    // for the current/next convention).
    pricingTiers: [
      { category: "adult", priceCents: 12500, startsOn: "2025-10-01", endsOn: "2026-01-31" },
      { category: "adult", priceCents: 15000, startsOn: "2026-02-01", endsOn: "2026-04-30" },
      { category: "adult", priceCents: 20000, startsOn: "2026-05-01", endsOn: "2026-07-10" },
      { category: "adult", priceCents: 25000, startsOn: "2026-07-11", endsOn: "2026-07-18" },
      { category: "young_adult", priceCents: 10000, startsOn: "2025-10-01", endsOn: "2026-01-31" },
      { category: "young_adult", priceCents: 12500, startsOn: "2026-02-01", endsOn: "2026-04-30" },
      { category: "young_adult", priceCents: 15000, startsOn: "2026-05-01", endsOn: "2026-07-10" },
      { category: "young_adult", priceCents: 15000, startsOn: "2026-07-11", endsOn: "2026-07-18" },
      { category: "child", priceCents: 0, startsOn: "2025-10-01", endsOn: "2026-07-18" },
    ],
    href: "/events/cacna-2026",
  },
  {
    year: 2027,
    startIso: "2027-07-12",
    endIso: "2027-07-17",
    // Internal now that registration lives on this site (see
    // app/events/cacna-2027/register) — Nav's isExternalHref() picks this up
    // automatically.
    registrationUrl: "/events/cacna-2027/register",
    // Ported from Convention's lib/content/convention.ts during the Phase B
    // data reconciliation -- fees carried over from 2026 verbatim (the
    // owner's explicit choice, 2026-07-21, while aware these aren't
    // confirmed 2027 numbers). Originally meant to open 2026-10-01, but the
    // owner chose to open registration early instead (2026-07-23).
    pricingTiers: [
      { category: "adult", priceCents: 12500, startsOn: "2026-07-23", endsOn: "2027-01-31" },
      { category: "adult", priceCents: 15000, startsOn: "2027-02-01", endsOn: "2027-04-30" },
      { category: "adult", priceCents: 20000, startsOn: "2027-05-01", endsOn: "2027-07-10" },
      { category: "adult", priceCents: 25000, startsOn: "2027-07-11", endsOn: "2027-07-17" },
      { category: "young_adult", priceCents: 10000, startsOn: "2026-07-23", endsOn: "2027-01-31" },
      { category: "young_adult", priceCents: 12500, startsOn: "2027-02-01", endsOn: "2027-04-30" },
      { category: "young_adult", priceCents: 15000, startsOn: "2027-05-01", endsOn: "2027-07-10" },
      { category: "young_adult", priceCents: 15000, startsOn: "2027-07-11", endsOn: "2027-07-17" },
      { category: "child", priceCents: 0, startsOn: "2026-07-23", endsOn: "2027-07-17" },
    ],
    href: "/events/cacna-2027",
  },
  { year: 2028, startIso: "2028-07-10", endIso: "2028-07-15", href: "/events/cacna-2028" },
  { year: 2029, startIso: "2029-07-09", endIso: "2029-07-14", href: "/events/cacna-2029" },
  { year: 2030, startIso: "2030-07-15", endIso: "2030-07-20", href: "/events/cacna-2030" },
];

/** The venue to display for a given year -- almost always CONVENTION_VENUE,
 *  except a year with its own `venue` override (currently only 2020,
 *  virtual due to COVID). */
export function venueFor(cy: ConventionYear): string {
  return cy.venue ?? CONVENTION_VENUE;
}

/** True only when `registrationUrl` is set AND points off-site — an
 *  internal path like "/convention/register" should render as a normal
 *  same-site link, not an `<a target="_blank">`. */
export function hasExternalRegistrationUrl(cy: ConventionYear): boolean {
  return !!cy.registrationUrl && /^https?:\/\//.test(cy.registrationUrl);
}

/** The recurring six-day pattern, confirmed across five years of real
 *  convention livestreams — Monday through Saturday, every year. Only the
 *  calendar date changes; the rhythm doesn't. */
export const RECURRING_SESSION_PATTERN = [
  { label: "Registration & Revival Night", desc: "The convention opens as families arrive and register, followed by an evening Revival Night of worship and the Word." },
  { label: "Morning & Evening Sessions", desc: "A full day of teaching and worship under the convention theme, morning and evening." },
  { label: "Morning & Evening Sessions", desc: "Continued teaching sessions on the convention theme, with the Business Group Fellowship meeting alongside." },
  { label: "Sunday School, Business Group & Good Women Day", desc: "Sunday School General Session in the morning, the Business Group General Session and Good Women Convention by day, and a Praise Night to close the evening." },
  { label: "Theme Sessions & Revival Night", desc: "Morning and afternoon sessions on the convention theme, closing with a Revival Night of worship." },
  { label: "Holy Communion & Departure", desc: "The convention closes with a Holy Communion service — some years followed by a Graduation Program — before the family departs, refreshed and rooted." },
] as const;

const DAY_ABBR = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/** Builds the day-by-day schedule for a given convention year, pairing the
 *  recurring pattern with that year's actual calendar dates. */
export function sessionsFor(cy: ConventionYear) {
  const [y, m, d] = cy.startIso.split("-").map(Number);
  return RECURRING_SESSION_PATTERN.map((s, i) => {
    const date = new Date(Date.UTC(y, m - 1, d + i));
    const day = `${DAY_ABBR[i]} · ${MONTH_ABBR[date.getUTCMonth()]} ${date.getUTCDate()}`;
    return { day, ...s };
  });
}

/** Human-readable date range, e.g. "July 13–18, 2026". */
export function dateRangeLabel(cy: ConventionYear): string {
  const [, sm, sd] = cy.startIso.split("-").map(Number);
  const [, , ed] = cy.endIso.split("-").map(Number);
  return `${MONTH_FULL[sm - 1]} ${sd}–${ed}, ${cy.year}`;
}

/** True once 10pm ET on the convention's end date has passed. Approximate
 *  DST like lib/events.ts's isEventPast: EDT (UTC-4) March–October. */
export function isConventionPast(cy: ConventionYear): boolean {
  const [y, m, d] = cy.endIso.split("-").map(Number);
  const offset = m >= 3 && m <= 10 ? 4 : 5;
  return Date.now() > Date.UTC(y, m - 1, d, 22 + offset, 0);
}

/** The convention that's either upcoming or currently underway — the one the
 *  whole site should be pointing visitors toward right now. Falls back to the
 *  last listed year if every known date has passed (keeps everything defined
 *  instead of throwing while a new year gets confirmed). */
export function currentOrNextConvention(): ConventionYear {
  return conventionYears.find((cy) => !isConventionPast(cy)) ?? conventionYears[conventionYears.length - 1];
}

export type ConventionState = "upcoming" | "live" | "concluded-recent" | "concluded";

/** How long (days) after a convention ends it's still treated as the site's
 *  headline story — a recap window before it fades into plain archive. */
const CONCLUDED_RECENT_DAYS = 21;

/** True once the convention's start date has begun (midnight ET on startIso).
 *  Mirrors isConventionPast's DST approximation. */
function hasConventionStarted(cy: ConventionYear): boolean {
  const [y, m, d] = cy.startIso.split("-").map(Number);
  const offset = m >= 3 && m <= 10 ? 4 : 5;
  return Date.now() > Date.UTC(y, m - 1, d, 0 + offset, 0);
}

/** Single source of truth for "what should the site be featuring about this
 *  convention year right now" — upcoming (hasn't started), live (underway),
 *  concluded-recent (ended, still within the recap window), or concluded
 *  (fully archived). */
export function getConventionState(cy: ConventionYear): ConventionState {
  if (!hasConventionStarted(cy)) return "upcoming";
  if (!isConventionPast(cy)) return "live";
  const [y, m, d] = cy.endIso.split("-").map(Number);
  const offset = m >= 3 && m <= 10 ? 4 : 5;
  const endedAt = Date.UTC(y, m - 1, d, 22 + offset, 0);
  const daysSince = (Date.now() - endedAt) / 86400000;
  return daysSince <= CONCLUDED_RECENT_DAYS ? "concluded-recent" : "concluded";
}

/** Which day of the convention "today" is (1-indexed), or null when not live.
 *  Powers the Hero's "Day X of 6" live-state indicator. */
export function conventionDayNumber(cy: ConventionYear): number | null {
  if (getConventionState(cy) !== "live") return null;
  const [y, m, d] = cy.startIso.split("-").map(Number);
  const startUtc = Date.UTC(y, m - 1, d);
  const daysElapsed = Math.floor((Date.now() - startUtc) / 86400000);
  return Math.min(RECURRING_SESSION_PATTERN.length, Math.max(1, daysElapsed + 1));
}

/** The convention year most relevant to feature RIGHT NOW. Unlike
 *  currentOrNextConvention() (which rolls to next year the instant the
 *  current one is past), this holds onto a just-concluded convention through
 *  its recap window so the site can acknowledge it instead of silently
 *  flipping to "Save the Date" for next year. Falls through to
 *  currentOrNextConvention() once the recap window elapses. */
export function conventionToFeature(): { cy: ConventionYear; state: ConventionState } {
  const prior = [...conventionYears].reverse().find((cy) => isConventionPast(cy));
  if (prior && getConventionState(prior) === "concluded-recent") {
    return { cy: prior, state: "concluded-recent" };
  }
  const cy = currentOrNextConvention();
  return { cy, state: getConventionState(cy) };
}

/** Shape-compatible with lib/events.ts's ChurchEvent — kept structural (no
 *  import of that type) so this module never depends on lib/events.ts. */
export interface ConventionChurchEvent {
  id: string; title: string; desc: string; dateLabel: string; timeLabel: string;
  month: string; day: string; startLocal: string; endLocal: string; href: string; navLabel: string;
}

/** Builds a ChurchEvent-shaped object for any given convention year — used
 *  both for "whichever one is current" (lib/events.ts) and for a specific,
 *  permanently-fixed year (e.g. the 2026 archive page, which must keep
 *  showing 2026 regardless of which year is "current" by then). */
export function conventionChurchEvent(cy: ConventionYear): ConventionChurchEvent {
  const [, , startDay] = cy.startIso.split("-");
  return {
    id: `cacna-convention-${cy.year}`,
    title: `CACNA ${cy.year} Annual Convention`,
    desc: cy.theme
      ? `Christ Apostolic Church North America Annual Convention — theme “${cy.theme}.” Six days of worship, teaching, and family at ${CONVENTION_VENUE}.`
      : `Christ Apostolic Church North America Annual Convention — six days of worship, teaching, and family at ${CONVENTION_VENUE}. Registration details announced closer to the date.`,
    dateLabel: dateRangeLabel(cy), timeLabel: "All week", month: "JUL", day: startDay,
    startLocal: `${cy.startIso.replace(/-/g, "")}T180000`, endLocal: `${cy.endIso.replace(/-/g, "")}T220000`,
    href: cy.href, navLabel: `CACNA ${cy.year}`,
  };
}

// ---------------------------------------------------------------------------
// Registration pricing
// ---------------------------------------------------------------------------

/** The tiers active for `cy` on a given date, using America/New_York's
 *  calendar date (the convention's own timezone) rather than UTC, so a
 *  tier cutover lands on the convention's real local date regardless of
 *  the timezone the server process happens to run in. Empty when this
 *  year's registration isn't open yet (no pricingTiers set). */
export function activePricing(cy: ConventionYear, onDate: Date = new Date()): PricingTier[] {
  if (!cy.pricingTiers) return [];
  const iso = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(onDate);
  return cy.pricingTiers.filter((t) => t.startsOn <= iso && t.endsOn >= iso);
}

export function priceForCategory(tiers: PricingTier[], category: RegistrantCategory): number | null {
  return tiers.find((t) => t.category === category)?.priceCents ?? null;
}

/** True once a category has ever had a priced tier for `cy` — used to tell
 *  "this year's registration isn't open yet" apart from "this category
 *  simply isn't offered" (not currently a distinction this data models,
 *  but kept as a single choke point in case that changes). */
export function registrationIsOpen(cy: ConventionYear): boolean {
  return activePricing(cy).length > 0;
}

// ---------------------------------------------------------------------------
// Detailed schedule (real per-session data, where it exists)
// ---------------------------------------------------------------------------

/** Which crowd a session targets -- ported from Convention's own
 *  lib/content/convention.ts (the two evolved independently but describe the
 *  exact same 2026 program; Convention's version had this field, CACNA's
 *  didn't). "all" covers general/ministers sessions everyone attends;
 *  breakout sessions instead list every group they run in parallel for. */
export type ScheduleAudience = "all" | "youth" | "adult" | "children";

export interface ScheduleSession {
  dayIso: string;
  startsAt: string;
  endsAt: string;
  title: string;
  ministerName?: string;
  ministerTitle?: string;
  track: "general" | "ministers" | "breakout";
  audience: ScheduleAudience[];
}

/** Real, session-by-session detail for years that have it transcribed (only
 *  2026 today, from the printed program). Years without an entry here fall
 *  back to the generic sessionsFor() pattern above. */
const DETAILED_SCHEDULE: Record<number, ScheduleSession[]> = {
  2026: [
    { dayIso: "2026-07-13", startsAt: "09:00", endsAt: "10:00", title: "Daily General Opening Session — Praise/Worship and Prayer", track: "general", audience: ["all"] },
    { dayIso: "2026-07-13", startsAt: "10:00", endsAt: "11:30", title: "Registration", track: "general", audience: ["all"] },
    { dayIso: "2026-07-13", startsAt: "11:45", endsAt: "13:15", title: "Registration", track: "general", audience: ["all"] },
    { dayIso: "2026-07-13", startsAt: "17:00", endsAt: "19:00", title: "Ministers Prayer Night", ministerName: "Prophet H. Oladeji", ministerTitle: "Gen. Evangelist, CAC Nigeria & Overseas", track: "ministers", audience: ["adult"] },
    { dayIso: "2026-07-14", startsAt: "10:00", endsAt: "11:30", title: "Ministers' Session 1 — Transformative Power of The Word", ministerName: "Pastor T. A. O. Agbeja", ministerTitle: "Regional Supt. Latunde Region", track: "ministers", audience: ["adult"] },
    { dayIso: "2026-07-14", startsAt: "11:45", endsAt: "13:15", title: "Ministers' Session 2 — Divine Guide For Our Living", ministerName: "Pastor Simeon Oladokun", ministerTitle: "Regional Supt. Anosike Region", track: "ministers", audience: ["adult"] },
    { dayIso: "2026-07-14", startsAt: "13:15", endsAt: "15:30", title: "Lunch Time", track: "general", audience: ["all"] },
    { dayIso: "2026-07-14", startsAt: "15:30", endsAt: "17:00", title: "Ministers' Session 3 — The Perfect Encourager In Time of Tries, Tribulations and Challenges", ministerName: "Right Rev. Prof. Dapo F. Asaju", ministerTitle: "Bishop of Ijesha Diocese", track: "ministers", audience: ["adult"] },
    { dayIso: "2026-07-14", startsAt: "17:00", endsAt: "19:00", title: "Revival Night", ministerName: "Prophet H. Oladeji", ministerTitle: "Gen. Evangelist, CAC Nigeria & Overseas", track: "general", audience: ["all"] },
    { dayIso: "2026-07-15", startsAt: "10:00", endsAt: "11:30", title: "Ministers' Session 4", ministerName: "Pastor S. O. Oladele", ministerTitle: "President, CAC Nigeria & Overseas", track: "ministers", audience: ["adult"] },
    { dayIso: "2026-07-15", startsAt: "11:45", endsAt: "13:15", title: "Break Out #1 — CACMWF, CACMA, CACNAGWA, Youth/Young Adult, Children", track: "breakout", audience: ["youth", "adult", "children"] },
    { dayIso: "2026-07-15", startsAt: "15:30", endsAt: "17:00", title: "Break Out #2 — CACMWF, CACMA, CACNAGWA, Youth/Young Adult, Children", track: "breakout", audience: ["youth", "adult", "children"] },
    { dayIso: "2026-07-15", startsAt: "17:00", endsAt: "19:00", title: "Revival Night", ministerName: "Prophet H. Oladeji", ministerTitle: "Gen. Evangelist, CAC Nigeria & Overseas", track: "general", audience: ["all"] },
    { dayIso: "2026-07-16", startsAt: "09:00", endsAt: "11:00", title: "Sunday School General Session for All", track: "general", audience: ["all"] },
    { dayIso: "2026-07-16", startsAt: "11:15", endsAt: "12:45", title: "Business Group General Session for All", track: "general", audience: ["all"] },
    { dayIso: "2026-07-16", startsAt: "13:00", endsAt: "14:15", title: "Break Out #3 — CACMWF, CACMA, CACNAGWA, Youth/Young Adult, Children", track: "breakout", audience: ["youth", "adult", "children"] },
    { dayIso: "2026-07-16", startsAt: "14:15", endsAt: "19:00", title: "Picnic, Sports & Games", track: "general", audience: ["all"] },
    { dayIso: "2026-07-16", startsAt: "19:00", endsAt: "21:00", title: "Praise Night", track: "general", audience: ["all"] },
    { dayIso: "2026-07-17", startsAt: "10:00", endsAt: "14:00", title: "Convention Program", track: "general", audience: ["all"] },
    { dayIso: "2026-07-17", startsAt: "14:00", endsAt: "17:00", title: "Ordination Service", track: "general", audience: ["all"] },
    { dayIso: "2026-07-17", startsAt: "17:00", endsAt: "19:00", title: "Impartation Night", ministerName: "Prophet H. Oladeji", ministerTitle: "Gen. Evangelist, CAC Nigeria & Overseas", track: "general", audience: ["all"] },
    { dayIso: "2026-07-18", startsAt: "09:00", endsAt: "10:00", title: "Holy Communion and Closing Service", ministerName: "Pastor S. O. Oladele", ministerTitle: "President, CAC Nigeria & Overseas", track: "general", audience: ["all"] },
  ],
};

export function getDetailedSchedule(year: number): ScheduleSession[] | null {
  return DETAILED_SCHEDULE[year] ?? null;
}

// ---------------------------------------------------------------------------
// Store (merch + materials) — apparel categories have no real catalog yet;
// add real products there (with a real id/slug/priceCents/sizes) once one
// exists, following registrationUrl's "empty means not live" convention.
// christian_education is a real, live catalog -- ported from Convention's
// lib/content/store-items.ts during the Phase G data merge (2026-09),
// verified directly against cacnachristianeducation.com/shop.
// ---------------------------------------------------------------------------

export interface StoreProduct {
  id: string;
  name: string;
  category: "convention" | "good_women" | "youth" | "christian_education";
  priceCents: number;
  sizes: string[];
  /** Real product photo only — omit entirely rather than fabricate one. */
  imageSrc?: string;
}

export const storeProducts: StoreProduct[] = [
  { id: "ce-2026-youth-young-adults-lesson", name: "2026 Youth & Young Adults Teenagers Sunday School Lesson", category: "christian_education", priceCents: 1600, sizes: [], imageSrc: "/photos/store/store-2026-youth-young-adults-lesson.jpg" },
  { id: "ce-2026-pre-teen-lesson", name: "2026 Pre-Teen Sunday School Lesson", category: "christian_education", priceCents: 1600, sizes: [], imageSrc: "/photos/store/store-2026-pre-teen-lesson.jpg" },
  { id: "ce-2026-elementary-lesson", name: "2026 Elementary Sunday School Lesson", category: "christian_education", priceCents: 1600, sizes: [], imageSrc: "/photos/store/store-2026-elementary-lesson.jpg" },
  { id: "ce-2026-unified-bible-study-manual", name: "2026 Unified Bible Study Manual", category: "christian_education", priceCents: 1800, sizes: [], imageSrc: "/photos/store/store-2026-unified-bible-study-manual.jpg" },
  { id: "ce-2026-omi-iye-naa", name: "2026 Ọmi Ìyè Náà Ìwé Atọ́nisọ́nà Fún Àdúrà Ojoojúmọ́", category: "christian_education", priceCents: 2000, sizes: [], imageSrc: "/photos/store/store-2026-omi-iye-naa.jpg" },
  { id: "ce-2026-living-water-devotional", name: "2026 Living Water Prayer and Bible Devotional", category: "christian_education", priceCents: 2000, sizes: [], imageSrc: "/photos/store/store-2026-living-water-devotional.jpg" },
  { id: "ce-2026-eko-ile-eko-akekoo", name: "2026 Àwọn Ẹ̀kọ́ Ilé Ẹ̀kọ́ Ọjọ́ Ìsimi tí Akẹ́kọ̀ọ́", category: "christian_education", priceCents: 1800, sizes: [], imageSrc: "/photos/store/store-2026-eko-ile-eko-akekoo.jpg" },
  { id: "ce-2026-eko-ile-eko-oluko", name: "2026 Àwọn Ẹ̀kọ́ Ilé Ẹ̀kọ́ Ọjọ́ Ìsimi tí Olùkọ́", category: "christian_education", priceCents: 2000, sizes: [], imageSrc: "/photos/store/store-2026-eko-ile-eko-oluko.jpg" },
  { id: "ce-2026-sunday-school-student-copy", name: "2026 Sunday School Student's Copy", category: "christian_education", priceCents: 1800, sizes: [], imageSrc: "/photos/store/store-2026-sunday-school-student-copy.jpg" },
  { id: "ce-2026-sunday-school-teacher-copy", name: "2026 Sunday School Teacher's Copy", category: "christian_education", priceCents: 2000, sizes: [], imageSrc: "/photos/store/store-2026-sunday-school-teacher-copy.jpg" },
  { id: "ce-2025-2026-unified-bible-study-manual", name: "2025–2026 Unified Bible Study Manual", category: "christian_education", priceCents: 1800, sizes: [], imageSrc: "/photos/store/store-2025-2026-unified-bible-study-manual.jpg" },
  { id: "ce-2025-elementary-manual", name: "2025 Elementary Manual — Children & Godly Leadership", category: "christian_education", priceCents: 1600, sizes: [], imageSrc: "/photos/store/store-2025-elementary-manual.jpg" },
];
