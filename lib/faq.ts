// Frequently asked questions about Christ Apostolic Church, adapted from the
// FAQ on the worldwide headquarters site (cacworld.org, fetched 2026-11-02).
// Single source of truth for the /faq page and its FAQPage JSON-LD.
//
// Answers are lightly edited for tone and US spelling; facts are unchanged.
// `local` notes are CACNA's own pointers for readers in North America and
// link only to internal routes.

export const FAQ_SOURCE_URL = "https://cacworld.org/";

export type FaqBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: { term: string; text: string }[] };

export interface FaqItem {
  id: string;
  question: string;
  answer: FaqBlock[];
  local?: { text: string; links: { label: string; href: `/${string}` }[] };
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "About CAC",
    items: [
      {
        id: "origin",
        question: "What is the origin of Christ Apostolic Church (CAC)?",
        answer: [
          { kind: "p", text: "CAC is a distinctly indigenous African Pentecostal church. Its roots go back to a prayer group formed in Ijebu-Ode in 1918, known as the Precious Stone Society. After several changes, the church was incorporated in May 1943." },
          { kind: "p", text: "The church emphasizes prayer, holiness, and the power of the Holy Spirit. From its Nigerian roots, CAC has grown to establish congregations across Africa and around the world, including Europe, North America, and other continents." },
        ],
      },
      {
        id: "motto",
        question: "What is the motto of CAC?",
        answer: [
          { kind: "p", text: "The motto of the church is “One Fold, One Shepherd” (John 10:16), reflecting the unity of the body of Christ under the leadership of Jesus." },
        ],
      },
      {
        id: "vision-mission",
        question: "What are the vision and mission statements of CAC?",
        answer: [
          {
            kind: "list",
            items: [
              { term: "Vision", text: "Soul winning and spiritual re-awakening of the world." },
              { term: "Mission", text: "Leading people into the knowledge of God, through an in-depth study of the Word of God, prevailing prayers, and spiritual worship." },
            ],
          },
        ],
      },
      {
        id: "babalola",
        question: "Was Apostle Joseph Ayo Babalola the founder of CAC?",
        answer: [
          { kind: "p", text: "No, Apostle Joseph Ayo Babalola was not the founder of CAC. He was one of the vessels God used during the Great Revival of 1930 at Oke Ooye, Ilesa, and he was the first General Evangelist of CAC." },
        ],
      },
      {
        id: "the-apostolic-church",
        question: "Is it true that CAC seceded from The Apostolic Church?",
        answer: [
          { kind: "p", text: "No, it is not true. CAC was incorporated in May 1943 with registration No. 147. The Apostolic Church was registered many years later, as No. 186." },
          { kind: "p", text: "In April 1972, the Supreme Court of Nigeria delivered judgment in Suit No. SC.223/70, establishing that The Apostolic Church seceded from Christ Apostolic Church in 1940." },
        ],
        local: {
          text: "You can read more about the church’s history on our About page.",
          links: [{ label: "About CACNA", href: "/about" }],
        },
      },
      {
        id: "organization",
        question: "How is the church organized geographically?",
        answer: [
          { kind: "p", text: "The church operates through a hierarchical structure to ensure effective administration:" },
          {
            kind: "list",
            items: [
              { term: "General Executive Council (GEC)", text: "The highest governing body." },
              { term: "Regions", text: "The church is divided into 17 administrative regions." },
              { term: "DCCs/Zones", text: "Groupings of districts." },
              { term: "Districts", text: "Groups of local assemblies." },
              { term: "Assemblies", text: "The local church." },
            ],
          },
        ],
      },
      {
        id: "future-planning",
        question: "How does the church support future planning?",
        answer: [
          { kind: "p", text: "Through its R&D department, the church uses technology and 2024 census data to plan future outreach programs. This helps it allocate resources efficiently, to areas of membership decline or to plant new churches where they are needed most." },
        ],
      },
    ],
  },
  {
    title: "Beliefs",
    items: [
      {
        id: "divine-healing",
        question: "Does CAC believe in and practice divine healing?",
        answer: [
          { kind: "p", text: "Yes. Divine healing is a fundamental belief and practice in CAC. The church believes that Jesus Christ heals through prayer and faith, and it holds healing services and prayer sessions for the sick." },
          { kind: "p", text: "The church also recognizes the importance of health education and does not forbid members from seeking medical attention, acknowledging that God can work through both divine intervention and medical professionals." },
        ],
      },
      {
        id: "holy-spirit",
        question: "What is the church’s view on the Holy Spirit?",
        answer: [
          { kind: "p", text: "As a Pentecostal pioneer in Nigeria, CAC believes in the definite outpouring of the Holy Spirit, including the manifestation of spiritual gifts for the edification of the Church." },
        ],
      },
    ],
  },
  {
    title: "Membership and worship",
    items: [
      {
        id: "membership",
        question: "How can I become a member of CAC?",
        answer: [
          { kind: "p", text: "Membership begins with a confession of faith in Jesus Christ and evidence of regeneration. New converts are expected to undergo water baptism by immersion and to join a local CAC assembly for spiritual nurturing. Those joining CAC from another background attend a discipleship class for proper grounding in the church’s doctrine." },
        ],
      },
      {
        id: "water-baptism",
        question: "What are the requirements for water baptism?",
        answer: [
          { kind: "p", text: "In CAC, baptism is by immersion, upon confession of the Lordship of Jesus Christ. Candidates must be at least 12 years old and must have completed baptismal classes, so that they understand the spiritual significance of the rite." },
        ],
      },
      {
        id: "visitors",
        question: "Can non-members attend CAC services?",
        answer: [
          { kind: "p", text: "Absolutely. CAC welcomes everyone to its services, whatever their church affiliation. Visitors are always welcome to experience the worship, hear the Word of God, and take part in prayer. You don’t need to be a member to attend services or to benefit from the church’s spiritual programs." },
        ],
      },
      {
        id: "find-a-church",
        question: "How can I find a CAC church near me?",
        answer: [
          { kind: "p", text: "CAC has branches across Nigeria and overseas. The church finder on cacworld.org can help you locate at least the nearest District headquarters, and many CAC branches have social media pages with contact information you can use." },
        ],
        local: {
          text: "In the United States, Canada, and South America, the Zones & DCCs directory helps you find your CACNA zone or DCC and its superintendent. Coming to the Annual Convention at CAC Village? Plan Your Visit covers travel, hotels, and what to pack.",
          links: [
            { label: "Zones & DCCs", href: "/zones" },
            { label: "Plan Your Visit", href: "/plan-your-visit" },
          ],
        },
      },
      {
        id: "what-to-wear",
        question: "What should I wear to CAC services?",
        answer: [
          { kind: "p", text: "CAC encourages modest, decent dress that honors God. Women are generally expected to wear dresses that are not revealing, with head coverings during worship services. Men typically wear formal or semi-formal attire. Ministers are expected to appear in proper clerical attire." },
        ],
      },
      {
        id: "online-services",
        question: "Does CAC offer online services?",
        answer: [
          { kind: "p", text: "Yes. CAC provides online worship services, sermons, and programs through its digital platforms." },
        ],
        local: {
          text: "Here in North America, CACNA streams the Annual Convention and shares message replays on YouTube, with Zoom available during the convention.",
          links: [{ label: "Watch Online", href: "/online" }],
        },
      },
    ],
  },
];

/** The visible answer as plain text, for structured data. */
export function faqAnswerText(item: FaqItem): string {
  const parts = item.answer.map((b) =>
    b.kind === "p" ? b.text : b.items.map((i) => `${i.term}: ${i.text}`).join(" ")
  );
  if (item.local) parts.push(item.local.text);
  return parts.join(" ");
}

/** schema.org FAQPage built from the same data the page renders. */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_GROUPS.flatMap((g) => g.items).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: faqAnswerText(item) },
    })),
  };
}
