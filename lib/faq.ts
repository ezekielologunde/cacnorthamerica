// Frequently asked questions about Christ Apostolic Church, based on the FAQ
// on the worldwide headquarters site (cacworld.org, fetched 2026-11-02).
// Single source of truth for the /faq page and its FAQPage JSON-LD.
//
// Answers are written in CACNA's own words from the facts in that FAQ; only
// the motto and the vision and mission statements are quoted as published.
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
          { kind: "p", text: "CAC is a Pentecostal church of fully African, indigenous origin. It grew out of the Precious Stone Society, a prayer group that started meeting in Ijebu-Ode in 1918. The movement went through several changes before it was formally incorporated in May 1943." },
          { kind: "p", text: "Prayer, holy living and the work of the Holy Spirit sit at the center of its life. From Nigeria it has spread to congregations elsewhere in Africa and on other continents, Europe and North America among them." },
        ],
      },
      {
        id: "motto",
        question: "What is the motto of CAC?",
        answer: [
          { kind: "p", text: "The church’s motto is “One Fold, One Shepherd” (John 10:16): all of Christ’s people gathered as a single flock, with Jesus as their leader." },
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
          { kind: "p", text: "No, he did not found the church. God used him as one of the instruments of the 1930 Great Revival at Oke Ooye in Ilesa, and he became CAC’s first General Evangelist." },
        ],
      },
      {
        id: "the-apostolic-church",
        question: "Is it true that CAC seceded from The Apostolic Church?",
        answer: [
          { kind: "p", text: "No. CAC came first: it was incorporated in May 1943 as registration No. 147, while The Apostolic Church was not registered until years afterward, as No. 186." },
          { kind: "p", text: "Nigeria’s Supreme Court settled the matter in April 1972. Its judgment in Suit SC.223/70 held that the secession went the other way: in 1940, The Apostolic Church broke away from Christ Apostolic Church." },
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
          { kind: "p", text: "Administration is layered, from the top down:" },
          {
            kind: "list",
            items: [
              { term: "General Executive Council (GEC)", text: "Governs the whole church; no body sits above it." },
              { term: "Regions", text: "17 in all, each an administrative division of the church." },
              { term: "DCCs/Zones", text: "Each brings several districts together." },
              { term: "Districts", text: "Each is made up of a number of local assemblies." },
              { term: "Assemblies", text: "Individual local congregations." },
            ],
          },
        ],
      },
      {
        id: "future-planning",
        question: "How does the church support future planning?",
        answer: [
          { kind: "p", text: "Its research and development (R&D) department draws on technology and figures from the 2024 census when planning outreach. That lets the church direct resources efficiently: toward areas where membership has fallen, or toward places that most need a new church." },
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
          { kind: "p", text: "Yes, it is central to both CAC’s faith and its practice. The church holds that Jesus Christ heals in answer to prayer and faith, and it runs healing services and prayer meetings for people who are ill." },
          { kind: "p", text: "Members are not barred from seeing a doctor. The church values health education and accepts that God may heal by direct intervention or by way of medical professionals." },
        ],
      },
      {
        id: "holy-spirit",
        question: "What is the church’s view on the Holy Spirit?",
        answer: [
          { kind: "p", text: "As one of Nigeria’s Pentecostal pioneers, CAC firmly believes the Holy Spirit is poured out on believers, and that spiritual gifts are at work among them to build up the Church." },
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
          { kind: "p", text: "A person becomes a member by professing faith in Jesus Christ, and their life should show evidence of regeneration. New believers are then expected to be baptized by immersion and to join a local CAC assembly, where they are nurtured in the faith. People coming to CAC from another church background first take a discipleship class that grounds them in its teaching." },
        ],
      },
      {
        id: "water-baptism",
        question: "What are the requirements for water baptism?",
        answer: [
          { kind: "p", text: "CAC baptizes by immersion once a person confesses that Jesus Christ is Lord. Candidates must be 12 or older and must first complete baptismal classes, so they understand what the rite means spiritually." },
        ],
      },
      {
        id: "visitors",
        question: "Can non-members attend CAC services?",
        answer: [
          { kind: "p", text: "Yes, everyone is welcome. You do not have to belong to CAC, or to any particular church, to come to a service. Visitors are free to join in the worship and prayer, hear God’s Word preached, and share in the church’s spiritual programs." },
        ],
      },
      {
        id: "find-a-church",
        question: "How can I find a CAC church near me?",
        answer: [
          { kind: "p", text: "CAC congregations are spread throughout Nigeria and beyond. The church finder on cacworld.org will point you to, at the very least, the District headquarters closest to you, and many local branches post contact details on their social media pages." },
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
          { kind: "p", text: "Dress modestly and decently, in a way that honors God. Women generally wear clothing that is not revealing and cover their heads for worship. Men usually dress formally or semi-formally, and ministers are expected to be in proper clerical dress." },
        ],
      },
      {
        id: "online-services",
        question: "Does CAC offer online services?",
        answer: [
          { kind: "p", text: "Yes. Worship services, sermons and other programs are available online on the church’s digital platforms." },
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
