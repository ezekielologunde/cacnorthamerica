// Archive extras supplied by the site owner (2026-11-05): older fliers and
// teaching slides. Text only; payment handles from the giving fliers are
// intentionally NOT published here.

export interface ArchivedEvent {
  title: string;
  dateLabel: string;
  detail: string;
  imageSrc?: string;
  imageAlt?: string;
}

/** One-off past events that are not part of the annual convention. */
export const archivedEvents: ArchivedEvent[] = [
  {
    title: "Canada 4 Christ",
    dateLabel: "Friday, 23 August 2024 · 5:30 PM",
    detail:
      "An evening of ministration at The Meeting House, Oakville, Ontario, with Prophet Hezekiah Oladeji, General Evangelist of CAC Nigeria & Overseas.",
  },
  {
    title: "Apostolic Visitation — CAC President visits Canada",
    dateLabel: "Friday 31 July – Sunday 2 August 2026",
    detail:
      "Hosted by CAC Canada with Pastor S.O. Oladele, President of CAC Nigeria & Overseas, and Pastor Timothy Agbeja, Regional Superintendent, CAC North America. Friday 7 PM and Sunday 10 AM (EST) at CAC Bethel, 22–94 Kenhar Drive, Toronto; the CAC Ministers Conference on Saturday 9 AM (EST) at VOC Mississauga, 25 Claireport Crescent, Etobicoke.",
    imageSrc: "/photos/archive/apostolic-visitation-2026.jpg",
    imageAlt: "Flier for the Apostolic Visitation, CAC President visits Canada, 31 July to 2 August 2026",
  },
];

export interface TeachingSection {
  heading: string;
  points: string[];
}

export const spiritualGiftsTeaching = {
  title: "Purpose of Spiritual Gifts for the Body of Christ",
  subtitle: "The Ministries of God the Holy Spirit",
  note:
    "Slide outline kept for the record. It follows the 2024 convention theme, “Spiritual Power and Gifts for the Body of Christ” (Acts 1:8). Speaker not recorded here.",
  sections: [
    {
      heading: "I. Definition and overview",
      points: [
        "The Holy Spirit is the third Person of the Trinity, the Lord and Giver of Life (Nicene Creed), co-equal and co-eternal with the Father and the Son.",
      ],
    },
    {
      heading: "II. Two manifestations",
      points: [
        "Gifts of the Spirit: 1 Corinthians 12:7.",
        "Fruit of the Spirit: Galatians 5:16-18 and 22-26.",
        "Paul places 1 Corinthians 13, on the fruit, between chapters 12 and 14, which are about the gifts.",
      ],
    },
    {
      heading: "III. The danger of gifts without the fruit",
      points: [
        "Being born again is what the manifestation of the fruit is.",
        "1 Corinthians 13:1-3 with Galatians 5:19-26: gifts without the fruit do not save.",
        "Matthew 7:15-20: a prophet who shows every gift but no fruit is still lost.",
        "Gifts can be falsified; the fruit cannot (2 Thessalonians 2:8-12; Acts 8:9-24).",
      ],
    },
    {
      heading: "IV. Acts 1:8 in context and content",
      points: [
        "Context: the post-resurrection appearances (Luke 24:3, 45; Mark 16:9-16; Matthew 28:19-20; John 20:21-22; Acts 1:4-5).",
        "Content: Acts 1:8 is the spiritual enabling (John 6:63). The Lord both teaches and enables His followers to live out His teaching (John 5:3-5).",
        "It separates Christianity from philosophy: Christ, by the Spirit, revealed Himself through mortal apostles who were known as Christ-like at Antioch (Acts 11:26).",
      ],
    },
    {
      heading: "V. What Acts 1:8 with 2:4 implies",
      points: [
        "Power comes with the manifestations of fruit and gifts, a new dimension of power to witness (Ephesians 5:17-21).",
        "Witness is in the language of the epistles: the gospel is the power of God to salvation (Romans 1:16-17; 1 Corinthians 1:18-25).",
        "John 14:26: the Helper will teach all things and bring to remembrance all that Christ said.",
        "Loyalty to the Spirit-empowered means preaching the cross, not storytelling; Paul resolved to know nothing but Jesus Christ and Him crucified (1 Corinthians 2:2).",
      ],
    },
  ] satisfies TeachingSection[],
};
