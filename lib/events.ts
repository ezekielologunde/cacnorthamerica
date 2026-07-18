import { SITE } from "@/lib/site";

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
  {
    id: "good-women-anniversary-2026",
    title: "2026 Good Women Anniversary",
    desc: "The Baltimore DCC Good Women mark their annual anniversary — theme: “Who Are You: Mother or Murderer?” (1 Kings 3:16–27). Guest ministers Evang. Mrs Bisi Benson and Evang. Mrs Buky Awosanya, with the BDCC Good Women leadership.",
    dateLabel: "June 28, 2026", timeLabel: "11:00 AM ET", month: "JUN", day: "28",
    startLocal: "20260628T110000", endLocal: "20260628T133000",
    href: "/events/good-women-anniversary", navLabel: "Good Women Anniversary",
  },
  {
    id: "cacna-convention-2026",
    title: "CACNA 2026 Annual Convention",
    desc: "Christ Apostolic Church North America Annual Convention — theme “The Bible: God’s Message to Man.” Six days of worship, teaching, and family at CAC Village, 14051 Stahley Rd, Blue Ridge Summit, PA.",
    dateLabel: "July 13–18, 2026", timeLabel: "All week", month: "JUL", day: "13",
    startLocal: "20260713T180000", endLocal: "20260718T220000",
    href: "/events/cacna-2026", navLabel: "CACNA 2026",
  },
  {
    id: "church-anniversary-2026",
    title: "24th Church Anniversary — Make a Joyful Noise",
    desc: "Three days celebrating 24 years of God’s faithfulness to CAC Salvation Center — theme “Make a Joyful Noise to the Lord” (Psalm 95:1). Friday revival on Zoom (7:00 PM), a Saturday Star Event (movie time, exciting games, and lunch with the Center), and the Sunday Thanksgiving Service with special choir, youth playlet, and the anointed Word.",
    dateLabel: "July 24–26, 2026", timeLabel: "Thanksgiving Sun · 10:30 AM ET", month: "JUL", day: "24",
    startLocal: "20260724T190000", endLocal: "20260726T140000",
    href: "/events/24th-anniversary", navLabel: "24th Anniversary",
  },
  {
    id: "choir-anniversary-2026",
    title: "Choir Anniversary",
    desc: "A special Sunday of praise and thanksgiving celebrating our worship ministry.",
    dateLabel: "September 3, 2026", timeLabel: "10:30 AM ET", month: "SEP", day: "03",
    startLocal: "20260903T103000", endLocal: "20260903T123000",
  },
  {
    id: "dcc-anniversary-2026",
    title: "Baltimore DCC Anniversary",
    desc: "Celebrating our District Coordinating Council with the wider CAC family.",
    dateLabel: "October 1, 2026", timeLabel: "10:30 AM ET", month: "OCT", day: "01",
    startLocal: "20261001T103000", endLocal: "20261001T123000",
  },
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

export const weeklyServices: ChurchEvent[] = [
  {
    id: "sunday-service",
    title: "Sunday Worship",
    desc: "Our main gathering — Spirit-led worship and biblical teaching, onsite and online.",
    dateLabel: "Every Sunday", timeLabel: "10:30 AM ET",
    startLocal: "20260628T103000", endLocal: "20260628T123000", recurDay: "SU",
  },
  {
    id: "bible-study",
    title: "Wednesday Bible Study",
    desc: "Mid-week scriptural teaching to ground the week in the Word. Join online from anywhere.",
    dateLabel: "Every Wednesday", timeLabel: "7:00 PM ET",
    startLocal: "20260624T190000", endLocal: "20260624T203000", recurDay: "WE",
  },
  {
    id: "wakati-itusile",
    title: "Wakati Itusile",
    desc: "High-energy Yoruba worship in our mother tongue. Online.",
    dateLabel: "Every Friday", timeLabel: "7:00 PM ET",
    startLocal: "20260626T190000", endLocal: "20260626T203000", recurDay: "FR",
  },
];

export const monthlyServices: ChurchEvent[] = [
  {
    id: "bdcc-youth-fellowship",
    title: "BDCC Youth Fellowship",
    desc: "A monthly gathering of the next generation — worship, the Word, and real conversation. On Zoom from anywhere.",
    dateLabel: "Every 3rd Saturday", timeLabel: "7:00 PM ET",
    startLocal: "20260620T190000", endLocal: "20260620T203000",
    recurMonthly: "3SA",
  },
  {
    id: "bdcc-monthly-prayer",
    title: "BDCC Monthly Prayer Meeting",
    desc: "The whole house in agreement — intercession, worship, and waiting on the Lord together. Onsite and online.",
    dateLabel: "Every 3rd Friday", timeLabel: "7:00 PM ET",
    startLocal: "20260619T190000", endLocal: "20260619T210000",
    recurMonthly: "3FR",
  },
  {
    id: "crossover-service",
    title: "Cross Over Service",
    desc: "Crossing into the new month with the family — a late-night service of thanksgiving, prayer, and prophecy.",
    dateLabel: "Last day of every month", timeLabel: "10:00 PM ET",
    startLocal: "20260630T220000", endLocal: "20260701T000000",
    recurMonthly: "-1",
  },
];

export interface AnnualMoment {
  id: string;
  title: string;
  when: string;
  desc: string;
}

export const annualMoments: AnnualMoment[] = [
  { id: "macedonia-outreach", title: "Macedonia Outreach", when: "Annually", desc: "An annual mission to forgotten rural ministers in hard-to-reach and unreachable places — carrying the gospel where most cannot go. Follow the journey: @macedonia.outreach on Instagram." },
  { id: "church-anniversary", title: "Church Anniversary", when: "July — 24 years strong in 2026", desc: "Celebrating God’s faithfulness to the Baltimore-Maryland DCC since 2002. Exact date announced from the pulpit each year." },
  { id: "graduation-sunday", title: "Graduation Ceremony", when: "August — annually", desc: "Honoring the graduates of our family — high school, college, and beyond. Date set fresh each year." },
  { id: "mothers-day", title: "Mother’s Day Sunday", when: "2nd Sunday of May", desc: "A Sunday set apart to celebrate and pray over every mother in the house." },
  { id: "fathers-day", title: "Father’s Day Sunday", when: "3rd Sunday of June", desc: "A Sunday set apart to honor the fathers of the Salvation Center family." },
  { id: "womens-day", title: "Women’s Day", when: "Annually — date to be announced", desc: "A special service celebrating the women of the Salvation Center." },
  { id: "pastor-appreciation", title: "Pastor Appreciation", when: "Annually — date to be announced", desc: "A moment as a family to thank God for the shepherds He has given us." },
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
    "PRODID:-//CAC Salvation Center//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${ev.id}@cacsalvationcenter.org`,
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
