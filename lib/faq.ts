// Frequently asked questions about Christ Apostolic Church, based on the FAQ
// on the worldwide headquarters site (cacworld.org, fetched 2026-11-02).
// Single source of truth for the /faq page and its FAQPage JSON-LD.
//
// Answers are written in CACNA's own words from the facts in that FAQ; only
// the motto and the vision and mission statements are quoted as published.
// `local` notes are CACNA's own pointers for readers in North America and
// link only to internal routes.

import { CONVENTION_VENUE, conventionYears, dateRangeLabel } from "@/lib/conventions";

export const FAQ_SOURCE_URL = "https://cacworld.org/";

// The 2027 convention entry in lib/conventions.ts. Dates and venue below are
// read from it so these answers cannot drift from the event page.
const CONVENTION_2027 = conventionYears.find((cy) => cy.year === 2027)!;

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
    title: "The 2027 Annual Convention",
    items: [
      {
        id: "convention-2027-dates",
        question: "When is the CACNA 2027 Annual Convention?",
        answer: [
          // Source: lib/conventions.ts, conventionYears entry year 2027, fields startIso "2027-07-12" and
          // endIso "2027-07-17" (via dateRangeLabel); six days Monday to Saturday per the same entry's
          // `programme` array (six items) and the "always a Monday/Saturday" note on startIso/endIso.
          { kind: "p", text: `The CACNA 2027 Annual Convention runs ${dateRangeLabel(CONVENTION_2027)}, six days from Monday to Saturday.` },
        ],
        local: {
          text: "Details for the year are on the convention page.",
          links: [{ label: "CACNA 2027 Convention", href: "/events/cacna-2027" }],
        },
      },
      {
        id: "convention-2027-venue",
        question: "Where is the CACNA 2027 Annual Convention held?",
        answer: [
          // Source: lib/conventions.ts, CONVENTION_VENUE ("always held at the same village"); the 2027
          // entry sets no `venue` override, so the default applies.
          { kind: "p", text: `It is held at ${CONVENTION_VENUE}.` },
        ],
        local: {
          text: "Travel, hotels and what to pack are covered in Plan Your Visit.",
          links: [{ label: "Plan Your Visit", href: "/plan-your-visit" }],
        },
      },
      {
        id: "convention-2027-who",
        question: "Who is the CACNA 2027 Annual Convention for?",
        answer: [
          // Source: lib/events.ts, annualMoments entry id "cacna-convention", field `desc` ("across every
          // CACNA member church"; "onsite and online"); age groups from CATEGORY_LABEL in
          // app/(site)/[locale]/events/[slug]/page.tsx (Adults 30 and over, Young adults 20-29,
          // Children ages 1-19), matching RegistrantCategory in lib/conventions.ts.
          { kind: "p", text: "It is CACNA’s flagship gathering, open to every member church and the whole family, onsite and online. Registration has three groups: adults (30 and over), young adults (20–29), and children and youth (ages 1–19)." },
        ],
        local: {
          text: "You can also watch the convention online.",
          links: [{ label: "Watch Online", href: "/online" }],
        },
      },
      {
        id: "convention-2027-register",
        question: "How do I register for the CACNA 2027 Annual Convention?",
        answer: [
          // Source: lib/conventions.ts, 2027 entry field `registrationUrl` ("/events/cacna-2027/register",
          // an on-site path, not an external link). Under-30 routing from messages/en.json
          // YouthRegister.heroBody ("Everyone under 30 registers here ... submit once").
          { kind: "p", text: "Register online on this site, on the 2027 convention registration page. Anyone under 30 registers on the separate youth and child form." },
        ],
        local: {
          text: "Start here:",
          links: [
            { label: "Register for 2027", href: "/events/cacna-2027/register" },
            { label: "Convention page", href: "/events/cacna-2027" },
          ],
        },
      },
      {
        id: "convention-2027-youth",
        question: "How do children, youth and young adults register for the 2027 convention?",
        answer: [
          // Source: messages/en.json YouthRegister.heroBody and Youth.registerBody ("Everyone under 30
          // registers ... on one form: add each child, youth or young adult and choose their meals in the
          // same step"); age bands "1-10", "11-19", "20-29" from the `ages` array in
          // app/(site)/[locale]/youth/page.tsx; route app/(site)/[locale]/events/[slug]/register/youth.
          { kind: "p", text: "Everyone under 30 registers on one form: add each child (ages 1–10), youth (11–19) or young adult (20–29), choose their convention meals, and submit once." },
        ],
        local: {
          text: "The youth registration form and the Youth & Young Adult Ministry page:",
          links: [
            { label: "Youth registration", href: "/events/cacna-2027/register/youth" },
            { label: "Youth & Young Adults", href: "/youth" },
          ],
        },
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
