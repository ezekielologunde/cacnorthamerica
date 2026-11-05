import { POSTS } from "@/lib/blog";
import { specialEvents } from "@/lib/events";
import { conventionYears } from "@/lib/conventions";

export interface SearchItem {
  title: string;
  desc: string;
  href: string;
  tag: "Page" | "Blog" | "Event";
  keywords?: string;
}

// Only pages are written by hand. Events, convention years, registration and
// blog posts are generated from the data the site itself renders
// (lib/events.ts, lib/conventions.ts, lib/blog.ts), so a new post or
// convention year is searchable without anyone remembering to edit this file.
// keywords hold the words people type that the title and description do not
// contain (for example "register" for a page titled "Registration").
const PAGES: SearchItem[] = [
  { title: "Home", desc: "Welcome to Christ Apostolic Church North America (CACNA)", href: "/", tag: "Page", keywords: "home welcome church cacna christ apostolic north america" },
  { title: "Who We Are", desc: "Our mission, history, and the tenets of faith", href: "/about", tag: "Page", keywords: "about mission vision history apostolic faith tenets belief" },
  { title: "Our History", desc: "The story of Christ Apostolic Church, from the 1918 prayer group to today", href: "/history", tag: "Page", keywords: "history origin 1918 ijebu-ode precious stone faith tabernacle babalola oke ooye 1930 revival 1943 registration supreme court 1972" },
  { title: "Leadership", desc: "Meet our Regional Superintendent and Coordinating Council", href: "/leadership", tag: "Page", keywords: "leadership team pastor agbeja adenodi latunde adelani oluwatimilehin coordinating council" },
  { title: "Ministries", desc: "Administration, Christian Education, Evangelism, Youth, Missions, Music, and more", href: "/ministries", tag: "Page", keywords: "ministry department administration evangelism youth missions music welfare good women cacma" },
  { title: "FAQs", desc: "Common questions about CAC: its origin, beliefs, membership, water baptism, and worship", href: "/faq", tag: "Page", keywords: "faq frequently asked questions origin motto vision mission divine healing babalola founder holy spirit apostolic church secession membership baptism visitors dress wear online services" },
  { title: "Gallery", desc: "Photos from across CACNA's member churches and the Annual Convention", href: "/gallery", tag: "Page", keywords: "photos gallery pictures events fellowship moments" },
  { title: "Watch Online", desc: "The Annual Convention live, and message replays on YouTube", href: "/online", tag: "Page", keywords: "watch live stream youtube sermon online convention" },
  { title: "Watchwords", desc: "Every annual Watchword since 1989", href: "/watchwords", tag: "Page", keywords: "watchword scripture annual theme archive" },
  { title: "Find a Church", desc: "Find a CACNA member church near you across the U.S., Canada, and South America", href: "/contact", tag: "Page", keywords: "visit directions find a church zone superintendent member church" },
  { title: "Blog & News", desc: "CACNA News — stories, devotionals, and news", href: "/blog", tag: "Blog", keywords: "blog news cacna stories articles devotional reflections" },
  { title: "Calendar", desc: "CACNA's annual rhythm and special gatherings", href: "/calendar", tag: "Page", keywords: "events upcoming calendar schedule annual convention ministers retreat sunday school rally" },
  { title: "Giving", desc: "Support CACNA's ministries and missions", href: "/giving", tag: "Page", keywords: "giving tithe offering donate" },
  { title: "Serve at the Convention", desc: "Volunteer at the Annual Convention: ushers, protocol, care team, hospitality, food and welfare, sanctuary keepers, choir, social media and more", href: "/serve", tag: "Page", keywords: "serve volunteer volunteering usher ushers protocol care team hospitality food welfare meals sanctuary keepers cleaning choir registration media social media security prayer sign up" },
  { title: "Store", desc: "Apparel, books, and convention merchandise", href: "/store", tag: "Page", keywords: "store shop merchandise apparel shirt t-shirt book buy order" },
  { title: "Plan Your Visit", desc: "Directions, parking, and what to expect at CAC Village", href: "/plan-your-visit", tag: "Page", keywords: "visit directions address map parking hotel lodging blue ridge summit pennsylvania cac village" },
  { title: "Convention Archive", desc: "Photos and recaps from past Annual Conventions", href: "/archive", tag: "Page", keywords: "archive past conventions 2019 2020 2024 recap history" },
  { title: "Refund Policy", desc: "Refunds for registration, store, and giving", href: "/refunds", tag: "Page", keywords: "refund refunds cancel cancellation policy money back" },
  { title: "Zones & DCCs", desc: "The directory of Zones and District Church Councils, with member-church contacts", href: "/zones", tag: "Page", keywords: "zone zones dcc district church council find a church near me directory superintendent member churches" },
];

const CONVENTIONS: SearchItem[] = conventionYears
  .filter((cy) => cy.href !== "/archive" && (cy.theme || cy.registrationUrl))
  .map((cy) => ({
    title: `CACNA ${cy.year} Annual Convention`,
    desc: `${cy.theme ? `"${cy.theme}" — ` : ""}${cy.startIso} to ${cy.endIso} at CAC Village, Blue Ridge Summit, PA`,
    href: cy.href,
    tag: "Event" as const,
    keywords: `annual convention ${cy.year} july cac village blue ridge summit schedule dates theme${cy.registrationUrl ? " registration open" : ""}`,
  }));

// Registration pages exist only for years with an on-site registration link,
// so a year becomes searchable for "register" the moment its link is set in
// lib/conventions.ts, and not before.
const REGISTRATION: SearchItem[] = conventionYears.flatMap((cy) => {
  const url = cy.registrationUrl;
  if (!url || /^https?:\/\//.test(url)) return [];
  return [
    {
      title: `Register for CACNA ${cy.year}`,
      desc: `Adult (30+) registration for the ${cy.year} Annual Convention, pay by Zelle or card`,
      href: url,
      tag: "Event" as const,
      keywords: `register registration sign up adult pay zelle card fee price rate ${cy.year} convention check-in code`,
    },
    {
      title: `Youth & Child Registration ${cy.year}`,
      desc: `Register children, youth, and young adults (under 30) for the ${cy.year} Annual Convention, with meals`,
      href: `${url}/youth`,
      tag: "Event" as const,
      keywords: `register registration youth child children young adult kids teens meals allergies ${cy.year} convention`,
    },
  ];
});

const EVENTS: SearchItem[] = specialEvents
  .filter((ev) => ev.href)
  .map((ev) => ({
    title: ev.title,
    desc: `${ev.dateLabel} — ${ev.desc}`,
    href: ev.href as string,
    tag: "Event" as const,
    keywords: `${ev.navLabel ?? ""} ${ev.dateLabel} event`,
  }));

const BLOG: SearchItem[] = POSTS.map((p) => ({
  title: p.title,
  desc: p.excerpt,
  href: p.href ?? `/blog/${p.slug}`,
  tag: "Blog" as const,
  keywords: `${p.category} ${p.date}`,
}));

// First entry for a destination wins, so a hand-written page beats a
// generated one for the same URL.
const seen = new Set<string>();
export const SEARCH_INDEX: SearchItem[] = [...PAGES, ...CONVENTIONS, ...REGISTRATION, ...EVENTS, ...BLOG].filter((item) => {
  if (seen.has(item.href)) return false;
  seen.add(item.href);
  return true;
});
