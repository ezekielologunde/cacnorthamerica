// The site's information architecture: one list of sections and links that
// both the header (components/navigation/Nav.tsx) and the footer
// (components/sections/FooterExperience.tsx) render, so the two can't drift.
// Add or move a page here and both pick it up.
//
// Labels are keys in the "Nav" messages namespace (messages/en.json), except
// links built from site data (events), which carry their own text.

import { currentOrNextConvention } from "@/lib/conventions";
import type { MatchableGroup } from "@/lib/navMatch";

export type NavText =
  | { key: string; values?: Record<string, string | number> }
  | { literal: string };

export interface NavLink {
  href: string;
  label: NavText;
  /** One line under the label in header dropdowns (the footer shows labels only). */
  desc?: NavText;
  /** Highlighted as the section's main action (the convention CTA). */
  feature?: boolean;
  /** Shown in only one of the two menus; both by default. */
  only?: "header" | "footer";
}

export interface NavGroup extends MatchableGroup {
  label: NavText;
  /** Where the section's own name links to. */
  href: string;
  links: NavLink[];
  /** Two-column header dropdown, for sections with many links. */
  layout?: "grid";
  /** Listed in the footer directory only, not in the header bar. */
  footerOnly?: boolean;
}

type Translate = (key: string, values?: Record<string, string | number>) => string;

export const navText = (t: Translate, text: NavText): string =>
  "literal" in text ? text.literal : t(text.key, text.values);

export const isExternalHref = (href: string) => /^https?:\/\//.test(href);

const key = (k: string, values?: Record<string, string | number>): NavText => ({ key: k, values });

// Whichever convention is current/next: once this year's dates pass, every
// convention link moves to the next confirmed year on its own.
export const nextConvention = currentOrNextConvention();
export const conventionCtaHref = nextConvention.registrationUrl ?? nextConvention.href;
// The youth & child form lives at <register>/youth when registration is
// on-site; until then the Youth page's register section says it opens soon.
const internalReg = nextConvention.registrationUrl?.startsWith("/") ? nextConvention.registrationUrl : undefined;
export const youthRegisterHref = internalReg ? `${internalReg}/youth` : "/youth#register";

/** Every /events/* page (the current and past conventions, Golden Jubilee-era
 *  gatherings, the pilgrimage, ministers' retreat, summits) is part of Events. */
const isEventPage = (p: string) => p.startsWith("/events/");

/** Every section, in menu order. The header shows Who We Are, Ministries,
 *  Events and Media; one-off events (Golden Jubilee, Holy Land Pilgrimage,
 *  Ministers Retreat, Hope For All Summit) live on the Calendar and are
 *  listed individually in the footer only. */
export function navGroups(): NavGroup[] {
  return [
    {
      id: "about",
      label: key("whoWeAre"),
      href: "/about",
      layout: "grid",
      links: [
        { href: "/about", label: key("aboutCacna"), desc: key("aboutCacnaDesc") },
        { href: "/history", label: key("history"), desc: key("historyDesc") },
        { href: "/leadership", label: key("leadership"), desc: key("leadershipDesc") },
        { href: "/leadership/past", label: key("pastLeaders"), only: "footer" },
        { href: "/statement-of-faith", label: key("statementOfFaith"), desc: key("statementOfFaithDesc") },
        { href: "/zones", label: key("zonesDccs"), desc: key("zonesDccsDesc") },
        { href: "/bible-institute", label: key("bibleInstitute"), desc: key("bibleInstituteDesc") },
        { href: "/faq", label: key("faq"), desc: key("faqDesc") },
        // CAC North America is one region of the global Christ Apostolic
        // Church, headquartered in Nigeria.
        { href: "https://cacworld.org/", label: { literal: "CAC World Headquarters" }, only: "footer" },
      ],
    },
    {
      id: "ministries",
      label: key("ministries"),
      href: "/ministries",
      layout: "grid",
      links: [
        { href: "/youth", label: key("youth"), desc: key("youthDesc") },
        { href: "/children", label: key("children"), desc: key("childrenDesc") },
        { href: "/good-women", label: key("goodWomen"), desc: key("goodWomenDesc") },
        { href: "/cacma", label: key("cacma"), desc: key("cacmaDesc") },
        { href: "/ministers-wives", label: key("ministersWives"), desc: key("ministersWivesDesc") },
        { href: "/business-group", label: key("businessGroup"), desc: key("businessGroupDesc") },
        { href: "/christian-education", label: key("christianEducation"), desc: key("christianEducationDesc") },
        { href: "/ministries", label: key("seeAllMinistries"), desc: key("ministriesDesc") },
      ],
    },
    {
      id: "events",
      label: key("events"),
      href: "/calendar",
      match: isEventPage,
      links: [
        {
          href: conventionCtaHref,
          label: key("conventionCta", { year: nextConvention.year }),
          desc: key(nextConvention.registrationUrl ? "conventionCtaDescOpen" : "conventionCtaDescComingSoon"),
          feature: true,
        },
        { href: youthRegisterHref, label: key("youthRegister"), desc: key("youthRegisterDesc") },
        { href: `${nextConvention.href}/schedule`, label: key("schedule"), desc: key("scheduleDesc") },
        { href: "/plan-your-visit", label: key("planYourVisit"), desc: key("planYourVisitDesc") },
        { href: "/calendar", label: key("calendarEvents"), desc: key("calendarEventsDesc") },
        { href: "/archive", label: key("pastConventions"), desc: key("pastConventionsDesc") },
        { href: "/about#convention", label: key("aboutConvention"), only: "footer" },
        { href: "/golden-jubilee", label: key("goldenJubilee"), only: "footer" },
        { href: "/events/pilgrimage-2026", label: { literal: "Holy Land Pilgrimage" }, only: "footer" },
        { href: "/events/ministers-retreat-2027", label: { literal: "Ministers Retreat" }, only: "footer" },
        { href: "/events/hope-for-all-summit-2026", label: { literal: "Hope For All Summit" }, only: "footer" },
      ],
    },
    {
      id: "media",
      label: key("media"),
      href: "/online",
      links: [
        { href: "/online", label: key("watchOnline"), desc: key("watchOnlineDesc") },
        { href: "/blog", label: key("blogNews"), desc: key("blogNewsDesc") },
        { href: "/watchwords", label: key("watchwords"), desc: key("watchwordsDesc") },
        { href: "/gallery", label: key("gallery"), desc: key("galleryDesc") },
      ],
    },
    {
      // Give has its own pill in the header; the rest live in the footer.
      id: "get-involved",
      label: key("getInvolved"),
      href: "/forms",
      footerOnly: true,
      links: [
        { href: "/giving", label: key("give"), desc: key("giveDesc") },
        { href: "/serve", label: key("serveConvention"), desc: key("serveConventionDesc") },
        { href: "/store", label: key("store"), desc: key("storeDesc") },
        { href: "/forms", label: key("allForms"), desc: key("allFormsDesc") },
      ],
    },
  ];
}

/** Top-level header links that have no dropdown. */
export const NAV_CONTACT: NavLink = { href: "/contact", label: key("contact") };

/** The one secondary action that stays on the header bar beside the
 *  convention CTA (also in the footer's Get Involved). */
export const NAV_GIVE: NavLink = { href: "/giving", label: key("give") };

/** Footer bottom row. Labels are keys in the "Footer" namespace. */
export const FOOTER_LEGAL: { href: string; labelKey: string }[] = [
  { href: "/about#tenets", labelKey: "ourTenets" },
  { href: "/privacy", labelKey: "privacy" },
  { href: "/terms", labelKey: "terms" },
  { href: "/refunds", labelKey: "refunds" },
  { href: "/accessibility", labelKey: "accessibility" },
  { href: "/sitemap", labelKey: "sitemap" },
];

export const linksFor = (group: NavGroup, menu: "header" | "footer") =>
  group.links.filter((l) => !l.only || l.only === menu);
