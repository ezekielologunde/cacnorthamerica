// OWNER SIGN-OFF NEEDED: these teams are not named as volunteer teams in the
// repo's source text (the printed program in lib/planYourVisit.ts), so the
// site owner should confirm each one before launch:
//   - Children's Ministry Helpers (id "children")
//   - Medical Team (id "medical")
//   - Prayer Team (id "prayer")
//   - Media & Tech (id "media")
//   - Youth Convention Volunteers (id "youth")
// Related mentions that do exist: lib/planYourVisit.ts lists "medical" among
// the convention personnel to follow and a "prayer department" that runs the
// prayer sessions, and the site has a Children's Ministry page; none of these
// says the team takes volunteers.
//
// EDIT HERE: the teams a volunteer can pick on /serve. The page, the sign-up
// form (components/serve/ServeForm.tsx) and the route (app/api/serve) all read
// this one list, so adding, renaming or removing a team is a change to this
// file only. Keep an `id` unchanged once sign-ups exist: stored rows carry it.
// A new team shows a default icon until it gets one in TEAM_ICONS
// (app/(site)/[locale]/serve/page.tsx).
//
// The convention teams the printed program already names (lib/planYourVisit.ts:
// ushers, protocol, security, hospitality, medical, registration), plus the
// teams the site owner asked for. The blurbs are deliberately generic, with no
// dates, shift times or rules. REVIEW: each team lead should confirm or
// rewrite their team's blurb.

export interface ServeTeam {
  id: string;
  name: string;
  blurb: string;
  /** Extra line shown under the blurb on /serve. */
  note?: string;
  /** Bold label in front of `note`; set it whenever `note` is set. */
  noteTitle?: string;
}

export const SERVE_TEAMS = [
  {
    id: "ushers",
    name: "Ushers",
    blurb: "Welcome people into each session, help them find a seat and keep the hall calm and orderly.",
    // REVIEW: generic description of the usher protocols. The real protocols
    // are not in the repo; do not add rules here without the Convention Committee.
    noteTitle: "Usher protocols.",
    note: "Ushers work to a shared set of protocols for how the team welcomes, seats and serves people, so that all things are done decently and in order (1 Cor. 14:40). The Convention Committee will be in touch after you sign up.",
  },
  {
    id: "protocol",
    name: "Protocol",
    blurb: "Receive ministers and guests and help sessions run in good order.",
  },
  {
    id: "care",
    name: "Care Team",
    blurb: "Look out for attendees who need a hand, a listening ear or someone to pray with.",
  },
  {
    id: "hospitality",
    name: "Hospitality",
    blurb: "Help serve food and refreshments and make every guest feel at home on the grounds.",
  },
  {
    id: "choir",
    name: "Choir",
    blurb: "Lead worship with the convention choir.",
  },
  {
    id: "registration",
    name: "Registration Desk",
    blurb: "Greet arrivals, check people in and answer first questions at the desk.",
  },
  {
    id: "media",
    name: "Media & Tech",
    blurb: "Help with sound, cameras, the livestream, photography and screens.",
  },
  {
    id: "children",
    name: "Children's Ministry Helpers",
    blurb: "Support the children's ministry team with activities and care for the youngest attendees.",
  },
  {
    id: "security",
    name: "Security & Parking",
    blurb: "Help people park safely and keep the grounds secure.",
  },
  {
    id: "medical",
    name: "Medical Team",
    blurb: "For nurses, doctors and other health professionals willing to help look after attendees.",
  },
  {
    id: "prayer",
    name: "Prayer Team",
    blurb: "Cover the sessions in prayer and pray with people who ask.",
  },
  {
    id: "youth",
    name: "Youth Convention Volunteers",
    blurb: "Serve alongside the youth and young adult leaders at the youth program.",
  },
] as const satisfies readonly ServeTeam[];

export type ServeTeamId = (typeof SERVE_TEAMS)[number]["id"];

const BY_ID: ReadonlyMap<string, ServeTeam> = new Map(SERVE_TEAMS.map((t) => [t.id, t]));

export function serveTeam(id: string): ServeTeam | undefined {
  return BY_ID.get(id);
}

/** Display names for a list of team ids, in the list's order. */
export function serveTeamNames(ids: readonly string[]): string[] {
  return ids.map((id) => BY_ID.get(id)?.name ?? id);
}
