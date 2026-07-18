import { SITE } from "@/lib/site";
import { currentOrNextConvention, conventionChurchEvent } from "@/lib/conventions";

const LOCATION = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`;
const TZ = "America/New_York";

export interface ChurchEvent {
  id: string;
  title: string;
  desc: string;
  dateLabel: string;
  timeLabel: string;
  month?: string;
  day?: string;
  /** Local wall-clock start/end in YYYYMMDDTHHMMSS (interpreted in America/New_York). */
  startLocal: string;
  endLocal: string;
  recurDay?: "SU" | "WE" | "FR";
  /** Monthly recurrence — "3SA" for 3rd Saturday, "3FR" for 3rd Friday, "-1" for last day of month. */
  recurMonthly?: string;
  /** Optional dedicated detail page for a featured event. */
  href?: string;
  /** Short label for the nav dropdown (falls back to title). */
  navLabel?: string;
}

/**
 * Returns true when a non-recurring event's end time (ET) has passed.
 * Weekly/monthly recurring events always return false — they're never "over".
 * Approximate DST: EDT (UTC-4) March–October, EST (UTC-5) November–February.
 */
export function isEventPast(ev: ChurchEvent): boolean {
  if (ev.recurDay || ev.recurMonthly) return false;
  const s = ev.endLocal || ev.startLocal;
  const y = +s.slice(0, 4), mo = +s.slice(4, 6) - 1, d = +s.slice(6, 8);
  const h = +s.slice(9, 11), mi = +s.slice(11, 13);
  const offset = mo >= 2 && mo <= 9 ? 4 : 5;
  return Date.now() > Date.UTC(y, mo, d, h + offset, mi);
}

/**
 * Single source of truth for ordering one-off events. Splits a list into
 * upcoming (soonest first) and past (most recently concluded first).
 * `startLocal` is a zero-padded YYYYMMDDTHHMMSS string, so a plain string
 * comparison sorts chronologically. Recurring services are never "past" —
 * pass only one-off `specialEvents` (and DB events) here.
 */
export function splitByDate(events: ChurchEvent[]): { upcoming: ChurchEvent[]; past: ChurchEvent[] } {
  const upcoming = events
    .filter((e) => !isEventPast(e))
    .sort((a, b) => a.startLocal.localeCompare(b.startLocal));
  const past = events
    .filter((e) => isEventPast(e))
    .sort((a, b) => b.startLocal.localeCompare(a.startLocal));
  return { upcoming, past };
}

export const specialEvents: ChurchEvent[] = [
  // Once this year's convention passes, this slot automatically picks up the
  // next confirmed year's dates (and theme, once known) — see lib/conventions.ts.
  conventionChurchEvent(currentOrNextConvention()),
  {
    id: "holy-land-pilgrimage-2026",
    title: "Holy Land Pilgrimage 2026",
    desc: "CACNA Latunde Region Pilgrimage to Israel & Egypt, November 2–12, 2026. Package includes round-trip flights from JFK, 8 nights accommodation (7 in Israel + 1 in St. Catherine, Egypt), daily meals, private guide, group coach, and Pilgrimage Certificate. Price $4,795 · $500 deposit to register · $2,000 second payment due Oct 31. Contact: info@cacnapilgrimage.org | @cacnapilgrimage",
    dateLabel: "November 2–12, 2026", timeLabel: "Departing JFK", month: "NOV", day: "02",
    startLocal: "20261102T060000", endLocal: "20261112T230000",
    href: "/events/pilgrimage-2026", navLabel: "Holy Land Pilgrimage",
  },
];

export const CACNA_LOCATION = "CAC Village, Blue Ridge Summit, PA";

export interface AnnualMoment {
  id: string;
  title: string;
  when: string;
  desc: string;
}

export const annualMoments: AnnualMoment[] = [
  { id: "cacna-convention", title: "CACNA Annual Convention", when: "July — CAC Village, PA", desc: "Six days of worship, teaching, and family across every CACNA member church — our flagship gathering, onsite and online." },
  { id: "ministers-retreat", title: "Ministers Retreat", when: "Annually — Regional", desc: "A season of prayer, teaching, and fellowship for CACNA's ministers across the United States and Canada." },
  { id: "sunday-school-rally", title: "Sunday School Rally", when: "Annually — Regional", desc: "Celebrating and equipping Sunday School departments across every CACNA zone." },
  { id: "macedonia-outreach", title: "Macedonia Outreach", when: "Annually", desc: "An annual mission to forgotten rural ministers in hard-to-reach and unreachable places — carrying the gospel where most cannot go. Follow the journey: @macedonia.outreach on Instagram." },
  { id: "good-women-marathon", title: "Good Women Marathon Fasting & Prayers", when: "February/March — Latunde Region, Annually", desc: "A 7-day annual fasting and prayer marathon for CACNA's Good Women — now in its 14th year, streamed live each evening." },
];

function recurRule(ev: ChurchEvent): string | null {
  if (ev.recurDay) return `RRULE:FREQ=WEEKLY;BYDAY=${ev.recurDay}`;
  if (ev.recurMonthly === "-1") return "RRULE:FREQ=MONTHLY;BYMONTHDAY=-1";
  if (ev.recurMonthly) return `RRULE:FREQ=MONTHLY;BYDAY=${ev.recurMonthly}`;
  return null;
}

/** One-click Google Calendar template URL (timezone-correct via ctz). */
export function googleCalUrl(ev: ChurchEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates: `${ev.startLocal}/${ev.endLocal}`,
    details: ev.desc,
    location: LOCATION,
    ctz: TZ,
  });
  let url = `https://calendar.google.com/calendar/render?${params.toString()}`;
  const rule = recurRule(ev);
  if (rule) url += `&recur=${encodeURIComponent(rule)}`;
  return url;
}

/** Downloadable .ics (Apple Calendar / Outlook) as a data URI — no backend needed. */
export function icsDataUri(ev: ChurchEvent): string {
  const rule = recurRule(ev);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CAC North America//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${ev.id}@cacnorthamerica.com`,
    "DTSTAMP:20260101T000000Z",
    `DTSTART;TZID=${TZ}:${ev.startLocal}`,
    `DTEND;TZID=${TZ}:${ev.endLocal}`,
    ...(rule ? [rule] : []),
    `SUMMARY:${ev.title}`,
    `DESCRIPTION:${ev.desc}`,
    `LOCATION:${LOCATION}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
