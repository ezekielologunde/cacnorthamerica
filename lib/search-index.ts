export interface SearchItem {
  title: string;
  desc: string;
  href: string;
  tag: "Page" | "Blog" | "Event";
  keywords?: string;
}

export const SEARCH_INDEX: SearchItem[] = [
  // Core pages
  { title: "Home", desc: "Welcome to Christ Apostolic Church North America (CACNA)", href: "/", tag: "Page", keywords: "home welcome church cacna christ apostolic north america" },
  { title: "Who We Are", desc: "Our mission, history, and the tenets of faith", href: "/about", tag: "Page", keywords: "about mission vision history apostolic faith tenets belief" },
  { title: "Leadership", desc: "Meet our Regional Superintendent and Coordinating Council", href: "/leadership", tag: "Page", keywords: "leadership team pastor agbeja adenodi latunde adelani oluwatimilehin coordinating council" },
  { title: "Ministries", desc: "Administration, Christian Education, Evangelism, Youth, Missions, Music, and more", href: "/ministries", tag: "Page", keywords: "ministry department administration evangelism youth missions music welfare good women cacma" },
  { title: "Gallery", desc: "Photos from across CACNA's member churches and the Annual Convention", href: "/gallery", tag: "Page", keywords: "photos gallery pictures events fellowship moments" },
  // Grow
  { title: "Watch Online", desc: "The Annual Convention live, and message replays on YouTube", href: "/online", tag: "Page", keywords: "watch live stream youtube sermon online convention" },
  { title: "Watchwords", desc: "Every annual Watchword since 1989", href: "/watchwords", tag: "Page", keywords: "watchword scripture annual theme archive" },
  // Visit
  { title: "Find a Church", desc: "Find a CACNA member church near you across the U.S., Canada, and South America", href: "/contact", tag: "Page", keywords: "visit directions find a church zone superintendent member church" },
  // Events & Calendar
  { title: "Calendar", desc: "CACNA's annual rhythm and special gatherings", href: "/calendar", tag: "Page", keywords: "calendar schedule annual convention ministers retreat sunday school rally" },
  { title: "Events", desc: "Upcoming special events and gatherings", href: "/calendar", tag: "Event", keywords: "events special gatherings upcoming" },
  { title: "Holy Land Pilgrimage 2026", desc: "Nov 2–12 — CACNA Latunde Region Pilgrimage to Israel & Egypt — $500 deposit", href: "/events/pilgrimage-2026", tag: "Event", keywords: "holy land pilgrimage 2026 israel egypt jfk cacna november travel" },
  { title: "CAC North America 50th Anniversary Celebration", desc: "October 10, 2026 — 50 years since CACNA's founding in 1976, at CAC Village, PA", href: "/events/cacna-50th-anniversary-2026", tag: "Event", keywords: "50th anniversary 1976 cacna cac village october 2026 milestone" },
  { title: "CACNA 2026", desc: "Annual Convention July 13–18, CAC Village, Blue Ridge Summit PA", href: "/events/cacna-2026", tag: "Event", keywords: "cacna 2026 annual convention july blue ridge summit pennsylvania north america" },
  // Give
  { title: "Giving", desc: "Support CACNA's ministries and missions", href: "/giving", tag: "Page", keywords: "giving tithe offering donate" },
  // Resources
  { title: "Blog & News", desc: "CACNA News — stories, devotionals, and news", href: "/blog", tag: "Blog", keywords: "blog news cacna stories articles devotional reflections" },
  // Contact
  { title: "Contact", desc: "Get in touch with the CACNA team", href: "/contact", tag: "Page", keywords: "contact team phone email address reach out" },
  // Blog posts
  { title: "CACNA 2026 — What to Expect", desc: "Six days of worship at CAC Village, Blue Ridge Summit, July 13–18", href: "/blog/cacna-2026-what-to-expect", tag: "Blog", keywords: "cacna 2026 convention blue ridge village july pack prepare" },
  { title: "What It Means to Be Ambassadors", desc: "2 Corinthians 5:20 and the daily call on every believer", href: "/blog/what-it-means-to-be-ambassadors", tag: "Blog", keywords: "ambassadors 2 corinthians 5 20 representatives christ commission" },
];
