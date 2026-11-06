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

/** 2026 convention record, from the printed convention booklet. Speeches are
 *  summarised; financial figures quoted in them are not republished. */
export const convention2026Highlights = {
  heading: "From the 2026 convention booklet",
  items: [
    "Convention & Conference Committee chaired by Pastor David O. Adenodi, Ph.D., with Pastor Oluwagbemiga Famojuro, D.Min, as Secretary.",
    "Ministers’ sessions: Pastor T.A.O. Agbeja on “Transformative Power of the Word”; Pastor Simeon Oladokun, Regional Superintendent, Anosike Region (CAC Europe), on “Divine Guide for Our Living”; Right Rev. Prof. Dapo F. Asaju, Bishop of Ijesha Diocese, on “The Perfect Encourager in Time of Tries, Tribulations and Challenges”; and Pastor S.O. Oladele, President of CAC Nigeria & Overseas, in Ministers’ Session 4.",
    "Revival Nights led by Prophet H. Oladeji; Praise Night on Thursday, 16 July; Impartation Night, Ordination Service and the Holy Communion and Closing Service on 17–18 July.",
    "Welcome address by the Regional Superintendent: a welcome to the President, the General Superintendent, the Mission Director and guests from Nigeria and Europe, and thanks to every department and zone for their support of the work at CAC Village.",
    "Children’s Convention program: “Preparing God’s People for Leadership” (Psalm 12:1), with daily sessions on God’s message to children (Mark 10:14) from Wednesday 15 to Friday 17 July.",
    "Christian Education Department session, themed “The Bible: A Dynamic Force for the Church” (Hebrews 4:12), chaired by Pastor Gbenga Famojuro, D.Min.",
    "Good Women Association conference on Wednesday 15 and Thursday 16 July, on “Raising Godly children in marriages, while navigating cultural and social challenges”.",
    "Business Group Fellowship on Thursday 16 July, with a guest lecture by Dr. Jumoke Ojo; the Men Association (CACMA) held sessions on 15 and 16 July.",
    "Youth and Young Adult Ministry, 16–17 July, themed “Did God Really Say…? Knowing God’s Word for Yourself”, with workshops, the annual CACNA picnic, a Praise Night and Bible Jeopardy.",
  ],
};

/** Short, factual look-backs from the 2022–2025 printed booklets and newsletters.
 *  No contact details, payment figures or photographs of people. */
export const regionHistory = [
  {
    title: "CAC in Brazil joins Latunde Region",
    dateLabel: "2023 – 2024",
    points: [
      "April 2023: Pastor S.A. Oyeleke (Rtd.) made a first missionary visit to Brazil (4–23 April) and celebrated Easter at CAC São Paulo on 9 April. He also visited the CAC assembly in Rio de Janeiro.",
      "November 2023: the revival program “Arise São Paulo!” opened a season of reformation and realignment of the CAC churches in Brazil.",
      "January 2024: the church in Brazil was formally made part of Latunde Region.",
      "12–18 November 2024: the Regional Superintendent, Pastor T.O. Agbeja, Ph.D., and the Regional Secretary visited Brazil for the revival “And there’s great joy in the city” (Acts 8:8), including a joint ministers’ meeting in Rio de Janeiro (13–16 November).",
    ],
  },
  {
    title: "Latunde Region Good Women Association",
    dateLabel: "2021 – 2022",
    points: [
      "July 2021: a new executive was appointed, and the daily “10 Minutes with My Maker” prayer meeting began on 23 July 2021 (8:00–8:10 am Eastern).",
      "20–26 February 2022: Marathon Prayers on the theme “Give unto the Lord Glory and Strength” (Psalm 29:1), marking ten years of the Good Women Association’s Marathon Prayers.",
      "2–10 May 2022: the Latunde Region pilgrimage to Israel, led by the Regional Superintendent, Pastor T.A.O. Agbeja, Ph.D., and Pastor Hezekiah Ilufoye, Ph.D.",
    ],
  },
  {
    title: "CACNA Business Group Fellowship",
    dateLabel: "Since 2015",
    points: [
      "The group has run in Latunde Region since late 2015 under a chairman and executives, with the aim of bringing business men and women together in gospel matters.",
      "A new executive took office in late 2021. Its stated mission is to help members in giving and prayer, and to serve as a facilitator of progress for the region.",
    ],
  },
];
