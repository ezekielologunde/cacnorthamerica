// Ported verbatim from the Convention project's lib/content/news-events.ts.
export type ConventionNewsEvent = {
  title: string;
  date: string;
  endDate?: string;
  location?: string;
  description: string;
  highlights?: string[];
  moreInfoUrl?: string;
};

export const conventionNewsEvents: ConventionNewsEvent[] = [
  {
    title: "CAC North America 50th Anniversary Celebration",
    date: "2026-10-10",
    location: "CAC Village, USA",
    description:
      "Christ Apostolic Church North America celebrates 50 years since its founding in 1976, at CAC Village — the same grounds that host the annual convention.",
    moreInfoUrl: "https://cacnorthamerica.com/",
  },
  {
    title: "2027 Ministers Retreat",
    date: "2027-03-22",
    endDate: "2027-03-26",
    description: "A time of refreshing, renewal, and equipping for CAC North America ministers.",
    highlights: [
      "Spiritual Refreshment — Be renewed in God's Word and presence.",
      "Unity & Fellowship — Strengthen bonds and build lasting connections.",
      "Empowerment — Be equipped to lead with impact.",
      "Prayer & Intercession — Seek God together for our church and communities.",
    ],
    moreInfoUrl: "https://cacnorthamerica.com/events/ministers-retreat-2027",
  },
];
