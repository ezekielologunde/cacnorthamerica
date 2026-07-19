export type PostCategory = "Event Spotlight" | "Devotional" | "Ministry Update" | "Reflection";

/** Category badges use a range of accent colors (some light/warm, some dark/cool) —
 *  pick readable ink-vs-white text per swatch rather than assuming one text color fits all. */
const DARK_BADGE_COLORS = new Set(["#EB6342", "#2D42C9", "#FDC841"]);
export function badgeTextColor(hex: string): string {
  return DARK_BADGE_COLORS.has(hex.toUpperCase()) ? "var(--ink)" : "#fff";
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateIso: string;
  category: PostCategory;
  categoryColor: string;
  accent: string;
  readTime: string;
  featured?: boolean;
  href?: string;
  body: string[];
}

// The site previously carried ~52 generic, unattributed "Devotional" posts
// inherited from the cac-salvation-center template — none referenced CACNA
// in any way (no church name, no CACNA-specific scripture context), so they
// were removed rather than presented as CACNA's own voice. Only the two
// posts genuinely written for CACNA remain; new posts should be added here
// or via the admin console (/admin/blog) going forward.
export const POSTS: BlogPost[] = [
  {
    slug: "cacna-2026-what-to-expect",
    title: "CACNA 2026 — what to expect.",
    excerpt:
      "Six days of worship and the Word at CAC Village, Blue Ridge Summit PA — July 13–18. Here is how to prepare, what to pack, and why you should not miss it.",
    date: "June 10, 2026",
    dateIso: "2026-06-10",
    category: "Ministry Update",
    categoryColor: "#FDC841",
    accent: "linear-gradient(135deg,#FDC841,#2D42C9)",
    readTime: "4 min read",
    href: "/events/cacna-2026",
    body: [
      "The Christ Apostolic Church North America National Convention returns to CAC Village in Blue Ridge Summit, Pennsylvania from **July 13 to 18, 2026**. This is the gathering where the scattered family of CAC across North America becomes, for one week, a single congregation.",
      "**What to expect.** The convention runs morning and evening sessions, six days. Expect deep worship, extended prayer, and messages from pastors and evangelists across the CAC global fellowship. The village setting means you are not commuting to an arena — you are resident in a camp, taking meals together, going on prayer walks, staying in late-night worship that no one wants to end.",
      "**Who should come.** Everyone. The convention is not a pastors' retreat. Youth services run in parallel to the main sessions. Children's programming is provided. Singles, couples, the elderly — the village is full of people at every stage of life pressing into God together.",
      "**How to prepare.** Registration is open at the CACNA convention website. Secure your accommodation early — village beds are allocated first-come. Carpooling is often organized by individual member churches — speak to your zone superintendent to join a car.",
      "Pack for outdoor Pennsylvania in July: warm mornings, hot afternoons, cool evenings. Bring a Bible with writing margins. Bring a journal. Leave your calendar empty for six days and come with open hands.",
    ],
  },
  {
    slug: "what-it-means-to-be-ambassadors",
    title: "What it means to be ambassadors.",
    excerpt:
      "2 Corinthians 5:17–20 and the daily call on every believer across CACNA. We are not tourists in this world — we are representatives.",
    date: "May 25, 2026",
    dateIso: "2026-05-25",
    category: "Reflection",
    categoryColor: "#7A1128",
    accent: "linear-gradient(135deg,#7A1128,#C81E3A)",
    readTime: "4 min read",
    body: [
      '_\"We are therefore Christ\'s ambassadors, as though God were making his appeal through us.\"_ — 2 Corinthians 5:20',
      "An ambassador does not speak in their own name. They carry the authority of the one who sent them, the message of the one who sent them, and the reputation of the one who sent them. Their personal opinions are, in the formal moment, irrelevant.",
      "Paul's picture of the Christian life is astonishingly bold. God, he says, is making his appeal _through us_. The same God who spoke light into being, who parted the sea, who raised his Son — is now, in this age, choosing to make his appeal through people like us. Through the member who shows up to Tuesday night prayer even when tired. Through the one who forgives when they had every right to retaliate. Through the family that gives sacrificially not because they are wealthy but because they believe.",
      "The title comes with weight. Ambassadors can embarrass their country. They can misrepresent. They can go off-message. Paul knew this — the same letter is full of passages about his own weakness, his thorn, his afflictions. But the weakness of the vessel is not the end of the story. \"The power,\" he writes in chapter four, \"belongs to God.\"",
      "Across CACNA's member churches — from zone to zone, across the United States and Canada — we carry this identity. Everywhere a member of this house goes, an ambassador is present. The question worth sitting with is not whether you hold the title — you do, by virtue of your new creation in Christ — but **whether you are conscious of it when you wake up in the morning.**",
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
