/** The Annual Convention is always held at the same village — this never
 *  changes year to year. */
export const CONVENTION_VENUE = "CAC Village, 14051 Stahley Rd, Blue Ridge Summit, PA 17214";
export const CONVENTION_VENUE_SHORT = "CAC Village, Blue Ridge Summit, PA";

export interface ConventionYear {
  year: number;
  /** ISO date, e.g. "2026-07-13" (always a Monday). */
  startIso: string;
  /** ISO date, e.g. "2026-07-18" (always a Saturday). */
  endIso: string;
  /** Only known/confirmed for the current convention — future years don't have one yet. */
  theme?: string;
  /** Only set once a real registration link exists for that year. */
  registrationUrl?: string;
  /** Detail page for this year. */
  href: string;
}

/** Every confirmed convention date, current and future. Add a new year here
 *  as soon as it's announced — everything downstream (nav CTA, events page,
 *  announcement bar) picks it up automatically. */
export const conventionYears: ConventionYear[] = [
  {
    year: 2026,
    startIso: "2026-07-13",
    endIso: "2026-07-18",
    theme: "The Bible: God’s Message to Man",
    registrationUrl: "https://cacna-convention.vercel.app/archive",
    href: "/events/cacna-2026",
  },
  { year: 2027, startIso: "2027-07-12", endIso: "2027-07-17", registrationUrl: "https://cacna-convention.vercel.app/register", href: "/events/cacna-2027" },
  { year: 2028, startIso: "2028-07-10", endIso: "2028-07-15", href: "/events/cacna-2028" },
  { year: 2029, startIso: "2029-07-09", endIso: "2029-07-14", href: "/events/cacna-2029" },
  { year: 2030, startIso: "2030-07-15", endIso: "2030-07-20", href: "/events/cacna-2030" },
];

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
