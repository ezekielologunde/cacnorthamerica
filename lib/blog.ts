export type PostCategory = "Event Spotlight" | "Devotional" | "Ministry Update" | "Reflection";

/** Category badges use a range of accent colors (some light/warm, some dark/cool) —
 *  pick readable ink-vs-white text per swatch rather than assuming one text color fits all. */
const DARK_BADGE_COLORS = new Set(["#EB6342", "#2D42C9", "#FDC841"]);
export function badgeTextColor(hex: string): string {
  return DARK_BADGE_COLORS.has(hex.toUpperCase()) ? "var(--ink)" : "#fff";
}

import { POST_AUTHORS, type BlogAuthor } from "@/lib/blog-authors";

export type { BlogAuthor };

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
  /** Real photo only — omit entirely rather than fabricate a stock image.
   *  orientation controls how the [slug] page displays it: "landscape"
   *  (default) renders the usual full-width hero band; "portrait" (e.g. a
   *  headshot) instead renders inline alongside the opening paragraph,
   *  since forcing a tall portrait into a short wide band crops the face. */
  image?: { url: string; alt: string; orientation?: "landscape" | "portrait" };
  /** Extra real photos shown under the body (archive posts with several pictures). */
  gallery?: { url: string; alt: string }[];
  /** Who published it (one or more). Empty falls back to "CACNA". */
  authors?: BlogAuthor[];
  /** A YouTube video shown above the text (click-to-play), with its credit. */
  video?: { id: string; title: string; channel: string; channelUrl: string };
  body: string[];
}

// The site previously carried ~52 generic, unattributed "Devotional" posts
// inherited from the cac-salvation-center template — none referenced CACNA
// in any way (no church name, no CACNA-specific scripture context), so they
// were removed rather than presented as CACNA's own voice. Only the two
// posts genuinely written for CACNA remain; new posts should be added here
// or via the admin console (/admin/blog) going forward.
const RAW_POSTS: Omit<BlogPost, "categoryColor" | "accent">[] = [
  {
    slug: "pastor-agbeja-ancient-alters-interview",
    title: "Faith Through Grief and Hard Lessons: Pastor Agbeja on Ancient Alters",
    excerpt:
      "Regional Superintendent Pastor Dr. T.A.O. Agbeja talks about the calling he first resisted, losing a son, church hurt and keeping Christ central after 52 years in ministry.",
    date: "November 7, 2026",
    dateIso: "2026-11-07",
    category: "Reflection",
    readTime: "3 min read",
    video: {
      id: "eRYo76wMwAk",
      title: "The Mistakes That Almost Cost Him His Ministry | Pastor Dr. T.A.O. Agbeja | Ancient Alters #0001",
      channel: "Ancient Alters, What Alters You?",
      channelUrl: "https://www.youtube.com/@WhatAltersYou",
    },
    body: [
      "_Our Regional Superintendent sits down with host Adelani Eranola for the first episode of Ancient Alters (What Alters You?). Watch the full conversation above._",
      "Pastor Dr. T.A.O. Agbeja is the Regional Superintendent of Christ Apostolic Church in North America. In this interview he looks back on **52 years in ministry and 40 years in America**, a journey that took him from Nigeria to England and then to the United States. The conversation goes behind the public ministry, to the calling he first resisted, the people who shaped him, the hard seasons that tested him and the faith that carried him through.",
      "**A calling he did not plan.** He speaks about answering God’s call when ministry was not his plan, and about the moments along the way when he questioned whether he was where God wanted him to be.",
      "**Mentors and prayer.** He reflects on Christian mentorship, including his time with the late Prophet Obadare, and on prayer and revival, with a caution about depending on systems more than on God.",
      "**Provision.** He shares how God provided for his family through a year without a ministry salary, along with unexpected provision at other points in his journey.",
      "**Trust, hurt and discernment.** He is open about misplaced trust and church hurt, why discernment matters, and the personal mistakes and boundaries every minister has to take seriously.",
      "**Grief.** The interview also turns to the loss of his son. When the person who comforts others becomes the one who needs comfort, he asks what happens to faith, and shares how he found strength in God while continuing to serve others.",
      "**Christ at the center.** He closes with keeping Christ central in everything and passing the faith on to the next generation.",
      "**Who it is for.** Whether you are grieving, questioning your calling, serving in ministry or simply in a hard season, this conversation offers honest reflections on faith, leadership and perseverance. Which lesson stayed with you? Tell us, along with the timestamp, in the comments on the video.",
      "_Credit: the video is from the Ancient Alters, What Alters You? YouTube channel._",
    ],
  },
  {
    slug: "tribute-to-late-pastor-abraham-adegoke-oyedeji",
    title: "A Tribute to Late Pastor (Dr.) Abraham Adegoke Oyedeji",
    excerpt:
      "The Oyedeji family and CAC First in the Americas remember the Senior Pastor and DCC Superintendent who planted the seeds of Christ Apostolic Church in the Western Hemisphere.",
    date: "October 10, 2026",
    dateIso: "2026-10-10",
    category: "Ministry Update",
    readTime: "2 min read",
    image: { url: "/images/leaders/oyedeji-2026.jpg", alt: "Late Pastor (Dr.) Abraham Adegoke Oyedeji, Senior Pastor and DCC Superintendent, CAC First in the Americas", orientation: "portrait" },
    body: [
      "_From the Golden Jubilee brochure: “We celebrate the goodness of God and 50 years of CAC in the Americas.”_",
      "The brochure remembers Late Pastor (Dr.) Abraham Adegoke Oyedeji, Senior Pastor and DCC Superintendent of CAC First in the Americas, as a man of true spiritual leadership, marked by humility, compassion and devotion to the service of others.",
      "**A pioneer of the church in the Americas.** The tribute says that through his pioneering work and dedication he was instrumental in planting the seeds of Christ Apostolic Church in the Western Hemisphere. His efforts and foresight established not only congregations but vibrant spiritual homes and lasting communities where faith thrives.",
      "**A legacy that continues.** The family writes that they are eternally grateful for his legacy, and that his enduring vision and selfless commitment to spreading the Gospel continue to inspire, as a testament to a life lived in service to God and humanity.",
      "_Signed: The Oyedeji Family and CAC First in the Americas._",
    ],
  },
  {
    slug: "apostle-timothy-oluwole-obadare-life-and-ministry",
    title: "Apostle Timothy Oluwole Obadare: A Life of Preaching the Gospel",
    excerpt:
      "From the Golden Jubilee brochure: the life and ministry of the late Apostle Dr. T.O. Obadare, who established Christ Apostolic Church in London in 1979 and in the United States in 1981.",
    date: "October 10, 2026",
    dateIso: "2026-10-10",
    category: "Reflection",
    readTime: "3 min read",
    image: { url: "/images/leaders/obadare-2026.jpg", alt: "The late Apostle Dr. Timothy Oluwole Obadare" },
    body: [
      "_From the Golden Jubilee brochure, the page honouring Apostle T.O. Obadare._",
      "Born in 1925, the late Apostle Dr. Timothy Oluwole Obadare was a chosen preacher of the Word of God. Many called him a divine microphone of the Lord Jesus Christ and an ambassador of Almighty God. Like Paul, he said that it was a must for him to preach the gospel, and he preached in season and out of season.",
      "**A passion for souls.** He travelled the world speaking at revival meetings and crusades, and on radio and television at home and abroad, with a visible burden “to reach the world, be instant in season, out of season, rebuke, exhort, with all long suffering and doctrine” (2 Timothy 4:2).",
      "**Honours.** He received many honorary degrees, including a Doctor of Ministry from St. John’s University, Missouri (1985), and an Honorary Doctor of Divinity from the Trinity College of Ministerial Arts, Aba, Imo State, Nigeria (1990). He was also made a member of the International Affairs Leadership Parliament of the Golden State University of Los Angeles, and was recognised by the International Theological Seminary of Desoto and Honolulu University, Hawaii.",
      "**Service in the church.** He served Christ Apostolic Church worldwide as a choir leader, prophet, pastor, Assistant General Evangelist, General Evangelist and Apostle. By God’s grace he established Christ Apostolic Church in London in 1979 and in the United States in 1981. He was Executive Director and Founder of the World Soul-Winning Evangelistic Ministry (WOSEM), a ministry established solely for evangelism, and President of the Interdenominational Ministers’ Association of Nigeria.",
      "**Signs and wonders.** The brochure records that thousands were saved in his crusades, that the blind received sight, barren women conceived and people were healed of many conditions, and gives glory to God for the life of His servant.",
      "After more than six decades of evangelistic work he lived 88 years and went to be with the Lord in 2013. The brochure closes: “Praise God for such a gift to our generation.”",
    ],
  },
  {
    slug: "golden-jubilee-message-from-the-president",
    title: "Golden Jubilee Message from the President of CAC",
    excerpt:
      "Pastor Samuel Olusegun Oladele, President of Christ Apostolic Church, celebrates fifty years of God’s faithfulness to the church in America.",
    date: "October 10, 2026",
    dateIso: "2026-10-10",
    category: "Ministry Update",
    readTime: "3 min read",
    body: [
      "_From the opening pages of the Golden Jubilee brochure: “Celebrating 50 years of God’s faithfulness to Christ Apostolic Church in America.”_",
      "Pastor S.O. Oladele, President of Christ Apostolic Church, began with James 1:17–18 and gave glory to God for His mercy and faithfulness. He said the emergence of the Christ Apostolic Church in America was not by accident but a fulfilment of prophecy.",
      "**Where the church began.** Christ Apostolic Church is the first Pentecostal church in Nigeria. It began in 1918 as a prayer group known as “The Precious Stone Society”, whose members sought a re-enactment of the experience of believers on the day of Pentecost (Acts 2). The group made contact with the International Faith Tabernacle in Philadelphia. In 1930 the Great Oke Ooye Revival was orchestrated through Apostle Joseph Ayo Babalola, who became the first General Evangelist. The church was incorporated in 1943 as Christ Apostolic Church.",
      "**What the church is known for.** The church is known as a People of Prayer, of the Word of God and of Worship. Its evangelical mandate includes teaching members so that they can add value to society (Matthew 28:18–20), through in-depth Bible study, Sunday School, 17 theological seminaries and the Joseph Ayo Babalola University (JABU) at Ikeji-Arakeji, Osun State, Nigeria, described as the first entrepreneurial university in Nigeria. The church has more than 1.3 million members in 24 nations, including the United States.",
      "**Thanks.** He acknowledged the vision and sacrifice of the pioneers in America, Pastor Abraham Adegoke Oyedeji and Prophet Timothy Oluwole Obadare, and many others too numerous to mention; thanked Pastor Joshua Owoeye, whose leadership was a catalyst for the growth and unity of the church in America; and recognised the Regional Superintendent, Pastor T.O.A. Agbeja, and his lieutenants. He thanked all the members who represent the church and the nation well in their places of work, and praised their contributions to the spiritual and socio-economic growth of America.",
      "**A prayer for the years ahead.** He said the celebration is not only for CAC in the United States but a milestone in the history of CAC Nigeria and Overseas, and prayed for further growth spiritually, numerically and materially, and that the church would continue to be His voice to this generation and hear at the end, “Well done, good and faithful servant.”",
      "_Signed: Pastor Samuel Olusegun Oladele, President, Christ Apostolic Church._",
    ],
  },
  {
    slug: "golden-jubilee-welcome-address-regional-superintendent",
    title: "Golden Jubilee Welcome Address: Regional Superintendent",
    excerpt:
      "Pastor T.A.O. Agbeja’s welcome to the CACNA Golden Jubilee at CAC Village on 10 October 2026 — from a mustard-seed beginning to fifty years of God’s faithfulness.",
    date: "October 10, 2026",
    dateIso: "2026-10-10",
    category: "Ministry Update",
    readTime: "3 min read",
    body: [
      "_A summary of the printed welcome address from the Golden Jubilee brochure, delivered at CAC Village on 10 October 2026._",
      "Pastor T.A.O. Omolayo Agbeja, Ph.D., Regional Superintendent of CAC North America (Latunde Region), opened by giving glory to God for fifty years of the Christ Apostolic Church in America. He compared the small, mustard-seed beginning of the work with what it has become, and drew on Isaiah 40:18, 25 to point to the greatness of God.",
      "He welcomed the President of CAC Nigeria & Overseas, Pastor S.O. Oladele, and Mrs. Susanna Oladele, Leader of the Ministers’ Wives Fellowship; Prophet (Dr.) S.K. Abiara, retired General Evangelist, and Mama Grace Abiara, present by special invitation; Pastor J.O. Owoeye, Ph.D., retired first Coordinator of CAC North America, whom he called the grandfather of all in America; and Evangelist Agnes Adebomi Agbeja, Leader of the Ministers’ Wives.",
      "He closed with thanks to the invited guests, the Convention Planning Committee and every worker, and noted that the history of the work is told in a separate leaflet. The 2026 watchword printed with the address is Psalm 119:18: “Open my eyes, that I may see wondrous things from Your law.”",
    ],
  },
  {
    slug: "golden-jubilee-convention-chairmans-address",
    title: "Golden Jubilee Chairman’s Address",
    excerpt:
      "Fifty years after the apostolic faith was planted in the Americas, the Convention & Conference Committee chairman looks back with thanks and ahead with prayer.",
    date: "October 10, 2026",
    dateIso: "2026-10-10",
    category: "Ministry Update",
    readTime: "3 min read",
    body: [
      "_A summary of the Chairman’s Address printed in the Golden Jubilee brochure._",
      "Pastor Oluwagbemiga Famojuro, D.Min, Chairman of the Convention & Conference Committee (Latunde Region, USA), addressed the President, the General Superintendent, the General Evangelist and the Regional Superintendent. He gave thanks for fifty years since the apostolic faith was planted in the Americas, framing the jubilee around God’s faithfulness and answered prayer (Psalm 107:1; 1 Samuel 7:12, “Ebenezer”).",
      "He remembered the late Pastor Dr. Abraham Adegoke Oyedeji, who planted the church in the Americas, and other pioneers who have passed on: Pastors A.A. Adeojo, J.O. Adeyanju, A.S. Shasanmi, Ogunjeminiyi and J.T.F. Brown. He also noted that the church began in Nigeria in 1918.",
      "The address thanks the committee and everyone who attended, and ends with a prayer for the next fifty years (Psalm 126:3; Deuteronomy 31:8).",
    ],
  },
  {
    slug: "golden-jubilee-messages-from-latunde-region-departments",
    title: "Golden Jubilee Messages from Latunde Region Departments",
    excerpt:
      "Greetings printed in the Golden Jubilee brochure from the Regional Treasurer, Conventions & Conferences, Evangelism & Empowerment, the Women Leader and the youth ministry.",
    date: "October 10, 2026",
    dateIso: "2026-10-10",
    category: "Ministry Update",
    readTime: "3 min read",
    body: [
      "_Departments and offices of Latunde Region each sent a page of congratulations for the Golden Jubilee. Here is what they said, in short._",
      "**Office of the Regional Treasurer** (Pastor Timothy Adelani and Evangelist Mrs. Janet Adelani): thanks to God for five decades of provision, with congratulations to the Regional Superintendent, the Executive Council and the CAC Nigeria leadership.",
      "**Office of Conventions and Conferences** (Pastor Oluwagbemiga Famojuro and Evangelist Mrs. Olajumoke Famojuro): a message celebrating five decades of gatherings, revivals and conventions, with a prayer for a fresh outpouring of the Holy Spirit.",
      "**Evangelical and Empowerment Department:** rejoicing with CAC Nigeria and Overseas and the Regional Superintendent on the Golden Jubilee, signed by the department head and secretary.",
      "**Regional Women Leader** (on behalf of the Good Women Association): honours the women of CACNA as pillars of prayer and service. The **Good Women Association** itself sent a separate greeting (Psalm 68:11).",
      "**Youth and Young Adult Ministry:** congratulations, with a promise that the young people will usher in the next fifty years.",
      "**Christian Education Department:** a congratulatory message to the Latunde Region on its fiftieth anniversary.",
    ],
  },
  {
    slug: "cac-in-brazil-joins-latunde-region",
    title: "CAC in Brazil Joins Latunde Region",
    excerpt:
      "From Pastor Oyeleke’s first visit in 2023 to the Regional Superintendent’s revival in November 2024 — how the church in Brazil became part of Latunde Region.",
    date: "November 18, 2024",
    dateIso: "2024-11-18",
    category: "Ministry Update",
    readTime: "3 min read",
    body: [
      "_From the July 2025 Hope for All newsletter, in pieces written by Pastor A.K. Bamidele, Acting Superintendent in Brazil._",
      "**2023: a first visit.** Pastor S.A. Oyeleke (Rtd.) made a first missionary visit to Brazil from 4 to 23 April 2023 and celebrated Easter at CAC São Paulo on 9 April. He also visited the CAC assembly in Rio de Janeiro, which he had learned of through the secretariat in Nigeria. He returned to São Paulo in September 2023, which began a reformation and realignment of the CAC churches in Brazil.",
      "**November 2023: “Arise São Paulo!”** A power-packed revival program brought Pastor Ayeni back to Brazil from London after eight years away. In August 2024 four ministers from Nigeria, two pastors and two evangelists, joined the work, through the coordinated efforts of CAC Agbala Idande (Akilings Region), CAC Way to Life Ottawa and CAC 1930 Miracle Explosions, Bronx, New York.",
      "**January 2024: joining Latunde Region.** The authority of the church wrote to say that Brazil was now an integral part of Latunde Region. The Regional Superintendent, Pastor T.A.O. Agbeja, Ph.D., called to pray with them and promised a visit, which he made in November 2024.",
      "**12–18 November 2024: regional visit.** Pastor Agbeja and the Regional Secretary, Pastor J.O. Olawale, were welcomed for a revival tagged “And there’s great joy in the city” (Acts 8:8). From 13 to 16 November the team visited Rio de Janeiro, where Pastor Luciano is minister in charge, and held a joint ministers’ meeting. The ministers were urged to work as a team in unity for the rapid growth of the church in Brazil.",
    ],
  },
  {
    slug: "latunde-region-good-women-prayer-and-pilgrimage",
    title: "Latunde Region Good Women: Daily Prayer, Marathon Prayers and the 2022 Pilgrimage",
    excerpt:
      "How “10 Minutes with My Maker” began in July 2021, the 2022 Marathon Prayers, and the pilgrimage to Israel — from the Good Women Association leader’s report.",
    date: "May 10, 2022",
    dateIso: "2022-05-10",
    category: "Ministry Update",
    readTime: "3 min read",
    body: [
      "_From the Latunde Region Good Women Association leader’s report in the convention booklet._",
      "**A new executive, July 2021.** On 15 July 2021 five women were appointed as executive members: a Women Leader, a Secretary, a Chaplain, a Financial Secretary and a Treasurer. The leader asked each of them to encourage the DCCs and zones assigned to them and to help the pastors, evangelists and deaconesses with attendance, timely quarterly contributions and daily prayer.",
      "**“10 Minutes with My Maker.”** The daily prayer meeting began on 23 July 2021, from 8:00 to 8:10 am Eastern. Each of the region’s superintendents leads on a set day each month, and the Regional Superintendent leads on the 1st and 15th.",
      "**Marathon Prayers, 20–26 February 2022.** The week of prayers was themed “Give unto the Lord Glory and Strength” (Psalm 29:1) and marked ten years of the Good Women Association’s Marathon Prayers. It was anchored by the Chaplain and the Holy Spirit, and hosted on Zoom for the first time.",
      "**Pilgrimage to Israel, 2–10 May 2022.** The region’s pilgrimage was led by the Regional Superintendent, Pastor T.A.O. Agbeja, Ph.D., and Pastor Hezekiah Ilufoye, Ph.D., and described as a spiritual exercise with sound teaching at every stop. Preparations for a 2023 pilgrimage were already under way, led by the President of CAC Worldwide, Pastor S.O. Oladele.",
    ],
  },
  {
    slug: "spiritual-power-and-gifts-2024-teaching-outline",
    title: "Purpose of Spiritual Gifts for the Body of Christ",
    excerpt:
      "A teaching outline kept from the 2024 convention theme, “Spiritual Power and Gifts for the Body of Christ” (Acts 1:8): gifts, fruit, and why you need both.",
    date: "July 17, 2024",
    dateIso: "2024-07-17",
    category: "Reflection",
    readTime: "3 min read",
    body: [
      "_A slide outline kept for the record. It follows the 2024 convention theme (Acts 1:8). The speaker is not recorded._",
      "**The Ministries of God the Holy Spirit.** The Holy Spirit is the third Person of the Trinity, the Lord and Giver of Life (Nicene Creed), co-equal and co-eternal with the Father and the Son.",
      "**Two manifestations.** Gifts of the Spirit (1 Corinthians 12:7) and fruit of the Spirit (Galatians 5:16–18, 22–26). Paul places 1 Corinthians 13, on love, between chapters 12 and 14, which are about the gifts.",
      "**The danger of gifts without the fruit.** The fruit of the Spirit is the evidence of being born again. Gifts without the fruit do not save (1 Corinthians 13:1–3; Galatians 5:19–26), and a prophet who shows every gift but no fruit is still lost (Matthew 7:15–20). Gifts can be counterfeited; the fruit cannot (2 Thessalonians 2:8–12; Acts 8:9–24).",
      "**Acts 1:8 in context.** The promise follows the post-resurrection appearances (Luke 24:3, 45; Mark 16:9–16; Matthew 28:19–20; John 20:21–22; Acts 1:4–5). It is spiritual enabling (John 6:63): the Lord both teaches His followers and equips them to live out what He teaches.",
      "**What Acts 1:8 with 2:4 means.** Power comes with the fruit and the gifts, a new power to witness (Ephesians 5:17–21). The witness is the gospel, the power of God to salvation (Romans 1:16–17; 1 Corinthians 1:18–25). The Helper teaches all things and brings to remembrance all that Christ said (John 14:26). Spirit-empowered witness means preaching the cross, not telling stories; Paul resolved to know nothing but Jesus Christ and Him crucified (1 Corinthians 2:2).",
    ],
  },
  {
    slug: "cacna-2026-what-to-expect",
    title: "CACNA 2026 — what to expect.",
    excerpt:
      "Six days of worship and the Word at CAC Village, Blue Ridge Summit PA — July 13–18. Here is how to prepare, what to pack, and why you should not miss it.",
    date: "June 10, 2026",
    dateIso: "2026-06-10",
    category: "Ministry Update",
    readTime: "4 min read",
    featured: true,
    image: { url: "/images/cac-youth-convention.jpg", alt: "CACNA youth at a past Annual Convention" },
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
    readTime: "4 min read",
    featured: true,
    image: { url: "/images/cac-congregation-worship.jpg", alt: "CACNA congregation in worship, from a past gathering" },
    body: [
      '_\"We are therefore Christ\'s ambassadors, as though God were making his appeal through us.\"_ — 2 Corinthians 5:20',
      "An ambassador does not speak in their own name. They carry the authority of the one who sent them, the message of the one who sent them, and the reputation of the one who sent them. Their personal opinions are, in the formal moment, irrelevant.",
      "Paul's picture of the Christian life is astonishingly bold. God, he says, is making his appeal _through us_. The same God who spoke light into being, who parted the sea, who raised his Son — is now, in this age, choosing to make his appeal through people like us. Through the member who shows up to Tuesday night prayer even when tired. Through the one who forgives when they had every right to retaliate. Through the family that gives sacrificially not because they are wealthy but because they believe.",
      "The title comes with weight. Ambassadors can embarrass their country. They can misrepresent. They can go off-message. Paul knew this — the same letter is full of passages about his own weakness, his thorn, his afflictions. But the weakness of the vessel is not the end of the story. \"The power,\" he writes in chapter four, \"belongs to God.\"",
      "Across CACNA's member churches — from zone to zone, across the United States, Canada, and South America — we carry this identity. Everywhere a member of this house goes, an ambassador is present. The question worth sitting with is not whether you hold the title — you do, by virtue of your new creation in Christ — but **whether you are conscious of it when you wake up in the morning.**",
    ],
  },
  {
    slug: "cacna-2026-presidents-message",
    title: "Highlights from the President's Message — CACNA 2026",
    excerpt:
      "Pastor Samuel Olusegun Oladele, President of Christ Apostolic Church, Nigeria and Overseas, addressed this year's CACNA Annual Retreat at CAC Village. Here are the highlights.",
    date: "July 15, 2026",
    dateIso: "2026-07-15",
    category: "Ministry Update",
    readTime: "6 min read",
    featured: true,
    image: { url: "/images/pastor-oladele-portrait.jpg", alt: "Pastor Samuel Olusegun Oladele, President of Christ Apostolic Church, Nigeria and Overseas", orientation: "portrait" },
    body: [
      "Pastor Samuel Olusegun Oladele, President of Christ Apostolic Church, Nigeria and Overseas, delivered the President's Message at this year's CAC Latunde Region (North America) Annual Retreat at the CAC Village in Blue Ridge Summit, Pennsylvania. Below are the highlights of his address to the region.",
      "**Our corporate theme this year is \"The Bible: God's Message to Man.\"** The Bible, Pastor Oladele reminded the gathering, is the means through which God's message to mankind is conveyed — contextually, textually, and verbally inspired by God through the Holy Spirit (2 Timothy 3:16, John 1:1, Hebrews 1:1-4). By reason of its divine authorship, Scripture carries **inerrancy** (entirely free from error), **congruence** (66 books, over 1,500 years, more than 40 authors, yet one consistent picture of God's plan), and **authority** for life and ministry.",
      "He described the Bible's purpose and power through five pictures familiar to every believer: **Bread**, from which we derive strength and nourishment; **Lamp**, guiding our daily walk step-by-step; **Light**, revealing God's will and the bigger picture of His plan; **Mirror**, showing us our true selves before God; and **Hammer**, breaking the stronghold of sin in the hearer's heart. \"Whereas revelation is divine,\" he said, \"the duty to interpret the Bible correctly is ours\" — charging every minister to rightly divide the word of truth (2 Timothy 2:15).",
      "On training and development, the President reported that the **Pastors' Leadership Retreat (PLR)**, which began in January 2022, has now trained about 2,550 senior pastors at the Regional, DCC/Zonal, and District Superintendent level, along with Heads of Departments, Fellowships, Institutions, and Subsidiaries. More than 2,000 superintendents have not yet attended, and the training in the coming year will focus on that group — attendance is mandatory and remains one of the conditions for posting or promotion.",
      "He also spoke about the **CAC Centenary Building Project**, conceived in 2018 to commemorate the Church's 100th anniversary and to help solve accommodation challenges on the prayer camp at Ikeji-Arakeji. The President thanked the region for its continued support of the project — CACNA members who wish to give toward it can find the account details on our **Giving** page.",
      "Closer to home for our region, he acknowledged the formal inauguration of the **CAC Business Group Fellowship (CACBGF)** in Ikeji-Arakeji this past May, and encouraged CACNA to replicate the initiative on a bigger scale here in North America — a platform for interaction, mentorship, and support among CAC members who are business-inclined, in service of the Church's vision of soul winning and spiritual re-awakening.",
      "On policy matters, the President noted that the Church's constitution — last reviewed in 1998 — has gone through a full review by a dedicated committee and is now with the seventeen regions for input ahead of adoption. He also directed a return to the historic **round-neck clerical collar** worn by early leaders of the Church, as part of maintaining a consistent corporate identity, and reaffirmed that the **Seed of Blessing** remains a strictly free-will yearly contribution — no member should ever be cajoled or pressured to give, in choir ministration or otherwise.",
      "\"We are gathered here not just for an annual funfare, but to encounter God,\" Pastor Oladele closed. \"He has promised to be present where two or three of us are gathered in His Name. Make the best use of every moment of this program.\"",
    ],
  },
  {
    slug: "cacna-2026-welcome-address",
    title: "A warm welcome to CACNA 2026.",
    excerpt:
      "Regional Superintendent Pastor Dr. T.A.O. Agbeja opened this year's convention with gratitude, an update on CAC Village, and a welcome to visiting church leaders from across the CAC family.",
    date: "July 13, 2026",
    dateIso: "2026-07-13",
    category: "Ministry Update",
    readTime: "5 min read",
    featured: true,
    image: { url: "/images/pastor-agbeja-portrait.jpg", alt: "Pastor Dr. T.A.O. Agbeja, Regional Superintendent of CACNA (Latunde Region)", orientation: "portrait" },
    body: [
      "As CACNA gathered at CAC Village for the 2026 Annual Convention (July 13–18), Regional Superintendent Pastor Dr. T.A.O. Agbeja delivered the Welcome Address, opening this year's convention with thanksgiving to God and a warm welcome to the visiting church leaders who traveled to be with us.",
      "Pastor Agbeja welcomed President Pastor S.O. Oladele and Mrs. Susana Oladele, General Superintendent Pastor E.O. Odejobi, General Evangelist Prophet Hezekiah Oladeji, Mission Director Pastor C.S. Fasuyi, our brethren from CAC Europe led by Anosike Region Superintendent Pastor Simeon Oladokun, and Bishop and Mrs. Asaju of the Ilesa Anglican Diocese — alongside every DCC/Zonal Superintendent, pastor, evangelist, and member of the Latunde Region family gathered on \"this miracle ground\" for another year.",
      "He shared an encouraging update on **CAC Village** itself: despite the cost of keeping the camp running, the region has continued paying down the Village mortgage — about **$600,000** off the principal to date — while keeping staff paid and the grounds maintained. The Presidential Villa's living room has also been freshly renovated, with new furniture and waterproof tiles replacing the old carpet.",
      "He highlighted the region's **\"Hope For All\" Initiatives** — a charity arm caring for the needy, supporting evangelism and church planting, and organizing a retirement program for ministers — as work that continues to bear fruit season after season.",
      "Pastor Agbeja thanked the Convention Planning Committee, led by Chairman Pastor Dr. David Adenodi and Secretary Pastor Dr. Olugbenga Famojuro, along with every department that made the gathering possible — the Good Women, CACMA, Ministers' Wives, Youth and Young Adults, the Business Group, Christian Education, the Choir, and the IT and Protocol teams among many others. He also singled out the Village's own staff for their year-round care of the camp: Residence Pastor DS Michael Babalola, Village secretary Mrs. Roberta A. Murphy and Mrs. Celeste Silevinac for keeping the grounds beautiful, and the site-supervision and treasury team of Elder (Engineer) Fasakin, Pastor Dr. Richard Olowomeye, and Engineer Osinubi, who make the trip to the Village nearly every weekend.",
      "He closed by reaffirming this year's theme, **\"The Bible: God's Message to Man,\"** and asked everyone gathered to help keep the camp clean throughout the week — a small but meaningful way, he said, of being good stewards of the ground God has given the region. \"May God bless all our deliberations,\" he prayed, \"and give us journey mercy back to all our destinations.\"",
    ],
  },
  {
    slug: "cacna-2026-chairmans-address",
    title: "26 years at the helm — the Convention Chairman's address.",
    excerpt:
      "Pastor David Olusegun Adenodi, Ph.D., Chairman of the CACNA Convention & Conference Planning Committee, marked the completion of his 26-year tenure at this year's convention.",
    date: "July 14, 2026",
    dateIso: "2026-07-14",
    category: "Ministry Update",
    readTime: "5 min read",
    featured: true,
    image: { url: "/images/pastor-adenodi-portrait.jpg", alt: "Pastor David Olusegun Adenodi, Ph.D., Chairman of the CACNA Convention & Conference Planning Committee", orientation: "portrait" },
    body: [
      "Pastor David Olusegun Adenodi, Ph.D., Chairman of the CACNA Convention & Conference Planning Committee, delivered the Convention Chairman's Welcome Address at this year's gathering, welcoming President Pastor S.O. Oladele, General Superintendent Pastor E.O. Odejobi, General Evangelist Prophet Hezekiah Oladeji, Regional Superintendent Pastor Dr. T.O. Agbeja, and the entire Christ Apostolic Church North and South America (Latunde Region) family, reaffirming this year's theme, **\"The Bible: God's Message to Man\"** (2 Timothy 3:16-17, Hebrews 4:12, Psalm 119:105).",
      "\"The Bible remains God's infallible, inspired, and eternal message to humanity,\" he said. \"In a generation characterized by confusion, moral decline, false teachings, and spiritual distractions, God is calling His people back to His Word.\" His prayer for the convention was simple: that every participant would experience a fresh encounter with the God of the Bible, and be corrected, instructed, and equipped through it for effective Christian living and service.",
      "The address carried a personal milestone: **this convention marks the completion of Pastor Adenodi's tenure as Chairman of Conventions and Conferences**, a role he has held since the year 2000 — 26 years of service. \"I have fought a good fight, I have finished my course, I have kept the faith\" (2 Timothy 4:7), he said, marking the close of this chapter. \"My heart is filled with thanksgiving,\" he continued, thanking former Coordinator Pastor Joshua Olabode Owoeye, Ph.D. (Emeritus) and Regional Superintendent Pastor Timothy Omolayo Agbeja, Ph.D. for the privilege of serving in this capacity since 2000.",
      "Reflecting on the Convention's growth since then, he credited it entirely to God rather than human effort alone — quoting Isaiah 60:22 (\"The little one shall become a thousand, and the small one a strong nation\") and Paul's words in 1 Corinthians (\"I planted, Apollos watered; but God gave the increase\"). Where the Convention once faced disappointment, slow growth, and financial struggle, he said, faithful leaders committed to prayer, unity, sacrifice, and obedience saw God turn seasons of difficulty into seasons of fruitfulness.",
      "He offered heartfelt personal thanks to his wife, Evangelist Esther Oluseye Adenodi, for her years of diligent service in the Convention's registration department, and to Secretary Pastor Dr. Oluwagbemiga Timothy Famojuro, whose encouragement, prayers, and faithful partnership made the assignment lighter to carry.",
      "He also thanked the groups whose generosity keeps the Convention's \"food for all\" initiative running amid rising costs: the Good Women, who gave **$40,000** last year and **$50,000** this year; CACMA, under Pastor Dr. Amos Dele Dada, for their prayers and support; and the Business Group, led by Pastor Bolaji Oladunni, who contributed **$3,000** last year — with an appeal to every department, group, and individual to keep supporting the vision.",
      "\"Programs may change, leaders may change, but God's Word remains forever settled in heaven,\" he closed, encouraging the Church to remain steadfast in Scripture, teach sound doctrine, and raise a new generation that honors the Bible and defends the truth in love as this chapter of leadership comes to a close.",
    ],
  },
  {
    slug: "cacna-2026-six-transformative-stories",
    title: "Six transformative stories in the Bible.",
    excerpt:
      "From Ministers' Session 1, \"Transformative Power of the Word\" — on obeying the truth of the gospel, loving one another, and six lives the Bible shows us God can completely remake.",
    date: "July 13, 2026",
    dateIso: "2026-07-13",
    category: "Reflection",
    readTime: "6 min read",
    featured: true,
    image: { url: "/images/pastor-agbeja-portrait.jpg", alt: "Pastor Dr. T.A.O. Agbeja, Regional Superintendent of CACNA (Latunde Region)", orientation: "portrait" },
    body: [
      "Ministers' Session 1 — **\"Transformative Power of the Word\"** — opened this year's convention with Pastor T.A.O. Agbeja teaching from Hebrews 4:12: \"the word of God is quick, and powerful, and sharper than any two-edged sword... a discerner of the thoughts and intents of the heart.\" God's Word, he said, is the only thing able to transform a person on all three levels — spirit, soul, and body. When it takes root in the spirit, it reshapes the way we think (Romans 12:2), and it even reaches the physical body: Proverbs calls it \"health... to all their flesh,\" from a Greek word that also means medicine.",
      "\"Now that you have purified yourselves by obeying the truth so that you have sincere love for each other, love one another deeply, from the heart\" (1 Peter 1:22-25, NIV). From this text, the message turned to a question every believer eventually has to sit with: what does it actually mean to obey the truth?",
      "The \"truth\" the passage has in mind isn't an abstract idea — it's the gospel itself, \"the message of truth\" that Paul calls \"the gospel of your salvation\" in Ephesians 1:13, the good news that has been \"bearing fruit and growing\" everywhere it's preached, per Colossians 1:3-6. Purifying ourselves by obeying that truth, though, isn't our own work — it's God's, worked in us as we receive the gospel. As theologian John Piper has put it, faith alone justifies, but the faith that justifies is never alone; it's always accompanied by a new direction of thought, affection, and behavior. Obedience is the fruit that shows the faith is real.",
      "The message named a persistent failure in the Body of Christ: not loving one another well, especially through hard seasons. Political elections, disagreements over the pandemic, and cultural flashpoints have split churches and ended long friendships between believers over things that should never threaten the love that binds the family of God together. \"Sincere love\" — literally, in the Greek, love _without_ the mask an actor wears on stage — and love \"deeply, from the heart\" are not things we can manufacture in our own strength. They're something God produces in us as we live out our new life in Christ.",
      "To illustrate how completely God can remake a life, six stories from Scripture were held up as **six transformative stories in the Bible**:",
      "**Saul** (Acts 9) — a zealous persecutor of Christians, blinded by a light from heaven and transformed by an encounter with Jesus into one of the most influential apostles the church has ever had.",
      "**Nicodemus** (John 3:1-21) — a Pharisee and member of the ruling council who came to Jesus by night with real questions, and whose honest search for truth eventually led him to put his faith in Christ.",
      "**David** (2 Samuel 12) — a man after God's own heart who nonetheless fell into adultery with Bathsheba, and whose psalms of repentance still teach us that even the most faithful are capable of sin, and that God's forgiveness restores.",
      "**Peter** (Luke 22:54-62) — who denied Jesus three times before the rooster crowed, yet was restored and transformed into one of the most charismatic, influential leaders of the early church.",
      "**Moses** (Exodus 2:11-15) — a murderer and fugitive who became one of the most significant leaders in all of history, proof that no matter how far someone has fallen, it's never too late to turn back to God.",
      "**Zacchaeus** (Luke 19:1-10) — a despised tax collector whose encounter with Jesus, and repentance that followed it, shows that Christ will save anyone, no matter how far they've strayed.",
      "A Word this transforming, Pastor Agbeja said, must also be shared — preached \"in season and out of season\" (2 Timothy 4:1-4), taught so believers are \"thoroughly equipped for every good work\" (2 Timothy 3:16-17), studied as a workman rightly dividing the word of truth (2 Timothy 2:15), and obeyed, resting in the promise that His yoke is easy and His burden is light (Matthew 11:28-30).",
      "The message closed with an invitation: for anyone who has never obeyed the truth of the gospel, this is the moment. \"Sincere love for each other\" and \"love one another deeply from the heart\" aren't things we can produce on our own — they flow out of a life that has already been transformed by the gospel these six stories point to.",
    ],
  },
  {
    slug: "cacna-2026-bible-as-encourager",
    title: "The Bible as an encourager in times of trials.",
    excerpt:
      "Rt. Rev. Prof. Dapo F. Asaju, Bishop of Ilesa Anglican Diocese, delivered Ministers' Session 3 on how Scripture sustains believers through trials, tribulations, and challenges.",
    date: "July 15, 2026",
    dateIso: "2026-07-15",
    category: "Ministry Update",
    readTime: "6 min read",
    featured: true,
    image: { url: "/images/cacna-2026-flyer.jpg", alt: "Official CACNA 2026 Annual Convention flyer" },
    body: [
      "Rt. Rev. Prof. Dapo F. Asaju, Bishop of Ilesa Anglican Diocese, delivered Ministers' Session 3 — **\"The Bible as an Encourager in Times of Trials, Tribulations and Challenges\"** — a lecture grounded in a simple conviction: \"The Holy Bible is divinely-inspired (2 Timothy 3:16). Its contents are infallible and timeless. The written word is an expression of Jesus Christ the Word personified.\"",
      "Bishop Asaju traced the Bible's uniqueness through several marks: its own claim to be holy and to be God's Word; its fulfilled and still-unfolding prophecies; the answers it holds to life's deepest questions — who God is, the origin of creation and sin, spiritual warfare, life after death, and eternity; and its place as the ground of theology, \"the queen of all sciences,\" from which laws, governments, and constitutions the world over ultimately draw. It is, he said, the manual for holy living — for ethics, parenting, education, civic responsibility, marriage, and family.",
      "He was direct about suffering: challenges are not strange to the Christian life, but part of it. Because man is a tripartite being — body, spirit, and soul — Scripture ministers to every part of our need and affairs, and its prophecies about wars, pestilence, famine, and persecution in the end times prepare believers to endure rather than be surprised. \"Ever since the rebellion of Lucifer and the fall of Adam,\" he said, \"the world has experienced battle between the Kingdom of God and that of the devil\" — a battle for souls that Jesus promised His church would ultimately win, since \"the gates of hell shall not prevail against it.\"",
      "He walked through a long roll call of biblical figures who faced real hardship and were not exempt from it because of their faithfulness: Adam misled into disobedience, Noah who stumbled even after being spared the flood, Abraham barren well into old age, Joseph sold into slavery by his own brothers, Moses who led Israel toward the promised land yet was barred from entering it himself, Daniel thrown into a den of lions, Shadrach, Meshach, and Abednego cast into a fiery furnace for refusing to worship an idol, John the Baptist beheaded for his convictions, and Jesus Himself a refugee as a child. \"Bible heroes were not perfect individuals,\" he said. \"They trusted God and found grace to overcome their various challenges.\" Yet Scripture is also God's own instrument of encouragement — giving hope grounded in God's promises even in hopeless situations (Romans 15:4, Jeremiah 29:11, Psalm 42:11), and reminding believers that God never abandons His people (Isaiah 41:10, Joshua 1:9, Matthew 28:20).",
      "David, Elijah, Paul, and Jesus Himself were held up as examples of believers who found courage in God's Word through real difficulty — David in the Psalms amid fear and opposition, Elijah renewed by God's presence after Mount Carmel's high left him discouraged (1 Kings 19), Paul remaining joyful despite imprisonment and suffering (Philippians 4:11-13, 2 Corinthians 4:8-18), and Jesus Himself relying on God's Word to endure temptation (Matthew 4:1-11).",
      "\"The Bible encourages believers today,\" Bishop Asaju said, \"through God's promises, through prayer inspired by Scripture, through assurance of salvation (John 10:27-29), through wisdom for decision-making (Psalm 119:105), and through comfort in grief.\" His counsel for drawing on that encouragement was practical: read the Bible daily, meditating on it day and night per Joshua 1:8; memorize encouraging verses; pray regularly using biblical passages; and participate in Bible study and Christian fellowship, where the testimonies of others strengthen our own trust in God.",
      "\"The Bible is more than a historical or religious book,\" he closed. \"It is God's living and active Word, offering hope, courage, wisdom, and comfort in every season of life... Challenges are temporary, but God's promises are unchanging.\"",
    ],
  },
  {
    slug: "cacna-2026-divine-word-daily-living",
    title: "The Divine Word as a guide for our daily living.",
    excerpt:
      "Pastor Simeon Oladokun, Regional Superintendent of CAC Anosike (Europe) Region, delivered Ministers' Session 2 on why Scripture — not culture, emotion, or majority opinion — must remain the believer's final authority.",
    date: "July 14, 2026",
    dateIso: "2026-07-14",
    category: "Ministry Update",
    readTime: "6 min read",
    featured: true,
    image: { url: "/images/cacna-2026-flyer.jpg", alt: "Official CACNA 2026 Annual Convention flyer" },
    body: [
      "Pastor Simeon Oladokun, Ph.D., D.Th., Regional Superintendent of CAC Anosike (Europe) Region, delivered Ministers' Session 2 — **\"The Divine Word as a Guide for Our Daily Living\"** — opening with a simple observation: \"We live in a time of many voices, many values, and many claims to truth. Yet for the believer, the final guide for faith and conduct is not culture, opinion, emotion, or majority approval, but the Divine Word of God.\" Scripture, he said, reveals God's mind, exposes the human heart, corrects error, and trains us to live in holiness (2 Timothy 3:16-17).",
      "The Bible, he taught, is not merely \"the Good Book\" — it's a **guidebook**. Psalm 119:105 calls it \"a lamp to my feet and a light to my path,\" and Hebrews 4:12 says it doesn't just inform us, it directs us. Jesus Himself prayed, \"Sanctify them by Your truth. Your word is truth\" (John 17:17).",
      "He named three competing authorities eroding that guidance in our day. **Moral relativism** — the belief that right and wrong depend on personal preference or circumstance, leading people to say \"what's true for you may not be true for me\" (echoing Judges 21:25 and Proverbs 14:12) — is countered by Romans 12:1-2's call to be transformed, not conformed. **Doctrinal pluralism** — the idea that contradictory teachings can all be equally true — weakens conviction and reduces the uniqueness of Christ, against John 14:6 and Acts 4:12's claim that salvation is found in no one else. And **monolatrism**, the danger of professing faith in God while still giving ultimate trust, fear, or devotion to something else, runs against Exodus 20:3 and Jesus's own words that \"no one can serve two masters\" (Matthew 6:24).",
      "Beyond these, he identified five more standards quietly competing with Scripture for the believer's allegiance: **emotionalism**, where feelings become the final authority for decisions; **cultural conformism**, following social trends instead of divine instruction (Colossians 2:8); **materialism**, measuring life by possessions and outward success (Luke 12:15); **pragmatism**, judging actions only by results rather than righteousness (\"to obey is better than sacrifice,\" 1 Samuel 15:22); and **egoism**, exalting personal freedom above submission to God (Luke 9:23).",
      "In practice, he said, the Divine Word guides us by shaping the mind, guarding the heart, and directing conduct — **guarding your mind** (Psalm 1:2-3), **guarding your heart** (following Jesus's own pattern of answering temptation with \"it is written,\" Matthew 4:4,7,10), **guarding your ears** (measuring what we hear against Scripture, as the Bereans did in Acts 17:11), and **guarding your life**, letting grace teach us to live \"self-controlled, upright, and godly lives in this present age\" (Titus 2:11-12).",
      "\"In these days of moral relativism, doctrinal pluralism, monolatrism, emotionalism, materialism, and egoism,\" he closed, \"the church must return to the Divine Word as the supreme rule of life and godliness. 'The grass withers and the flowers fall, but the word of our God stands forever' (Isaiah 40:8). Let us therefore read it, believe it, obey it, teach it, and build our daily lives upon it.\"",
    ],
  },
  {
    slug: "cacna-2026-closing-appreciation",
    title: "As we conclude — the Convention Chairman's Appreciation.",
    excerpt:
      "Pastor David Olusegun Adenodi, Ph.D., Chairman of the Convention & Conference Planning Committee, closes CACNA 2026 with thanks to every speaker, volunteer, and family who made \"The Bible: God's Message to Man\" possible.",
    date: "July 18, 2026",
    dateIso: "2026-07-18",
    category: "Ministry Update",
    readTime: "3 min read",
    featured: true,
    image: { url: "/images/pastor-adenodi-portrait.jpg", alt: "Pastor David Olusegun Adenodi, Ph.D., Chairman of the CACNA Convention & Conference Planning Committee", orientation: "portrait" },
    body: [
      "\"Calvary greetings in the name of our Lord and Savior Jesus,\" Pastor David Olusegun Adenodi, Ph.D., Chairman of the CACNA Convention & Conference Planning Committee, wrote as the 2026 convention drew to a close. \"As we conclude this spiritually enriching convention themed 'The Bible: God's Message to Man,' I stand before you with a heart full of gratitude.\"",
      "On behalf of the Convention Committee, he extended thanks to CACNA's leaders and to the convention's distinguished speakers and ministers, \"for delivering messages that have challenged and uplifted us. Your insights have equipped us to lead with wisdom and humility.\"",
      "He also thanked the organizing committee, volunteers, and support staff whose work kept the week running smoothly. \"Your behind-the-scenes efforts have not gone unnoticed,\" he said, and to every attendee: \"thank you for your active participation and enthusiasm. Your presence has made this convention a truly communal and transformative experience.\"",
      "\"As we depart, let us carry forward the lessons learned and continue to build on the foundation laid during this convention,\" he closed. \"May we all strive to exemplify the leadership qualities that glorify God and serve our communities. Thank you, and may God bless you all abundantly.\"",
    ],
  },
  {
    slug: "cacna-business-group-founding-story",
    title: "God initiates, few responded — the Business Group's founding story.",
    excerpt:
      "Pastor Bolaji Oladunni, Chairman of the CACNA Business Group Fellowship, traces the vision back to a 2014 Philadelphia encounter and his own appointment at the July 2021 Convention.",
    date: "July 2025",
    dateIso: "2025-07-01",
    category: "Ministry Update",
    readTime: "4 min read",
    image: { url: "/images/giving-offering.jpg", alt: "CACNA members bringing an offering during a service" },
    body: [
      "\"In Christendom, nothing significant happens without revelation from God. While articulating revelation is important, faithful, committed and dedicated people of like minds are very essential to accomplish it,\" writes Pastor Bolaji Oladunni, Chairman of the CACNA Business Group Fellowship, in the Christ Apostolic Church North America Hope For All newsletter. \"We often reduce revelation to mere information — we pray for changes but few respond.\"",
      "The story traces back to 2014, at an event in Philadelphia, when Deacon Amos Ajibolade — under the tenure of the former regional superintendent, the late Pastor Solomon Oyeleke (Rtd.) — followed a revelation about the business people in Christ Apostolic Church and what the Spirit was leading them to do to reduce poverty and support the church's Village Project.",
      "\"In a deep passion Deacon Ajibolade shared with me and immediately I heard within me 'you live so that others can benefit from what God has given you,'\" Pastor Oladunni recounts. \"I was super excited to be opportune to be part of the vision God was building. Several efforts were made but many are yet to catch the vision!\"",
      "He was appointed as the new Chairman of the CACNA Business Group Fellowship at the July 2021 Convention, to be supervised by Pastor Gabriel Idowu, under the leadership of the CACNA Latunde Region and its Regional Superintendent, Pastor T.A.O. Agbeja. The group consists of business partners, interested members, and those who believe in the leadership of the church, to become a key financial supporter of the CACNA Village Project and its operations.",
      "According to the traditions and regulations of the church and her leadership, changes were made and the Business Group fellowship was accepted and established under the umbrella of the CACNA Latunde Region, who believes in me that I can do the job. All glory to God, and with His hand has fulfilled it, saying: \"Blessed be the Lord God of Israel, who spoke with His mouth to my father David, and with His hand has fulfilled it\" (1 Kings 8:15).",
      "\"The role we play is very important to what God does in the school of faith. Christ Apostolic Church is a fertile ground for everyone who desires partnership with God in their businesses. I look forward to all business owners in Christ Apostolic Church for a better commitment to support this vision — remember, this is our year of REWARD. God bless us all. Amen.\"",
    ],
  },
  {
    slug: "cac-mount-joy-sao-paulo-brazil",
    title: "From obscurity to the limelight — the CAC Brazil story.",
    excerpt:
      "Pastor A.K. Bamidele, Acting Superintendent, traces CAC Mount Joy Sao Paulo Brazil's founding in 2010 through to its 2024 integration into the Latunde Region and a regional visit from Pastor T.O. Agbeja.",
    date: "July 2025",
    dateIso: "2025-07-01",
    category: "Ministry Update",
    readTime: "5 min read",
    image: { url: "/images/cac-clergy-ceremony.jpg", alt: "CACNA clergy at a past ministers' gathering" },
    body: [
      "\"There hasn't been any proper written documentation about the existence of the church prior to 2010, but of course the church started long before 2010,\" writes Pastor A.K. Bamidele, Acting Superintendent, in the Christ Apostolic Church Hope For All newsletter, recounting the founding of CAC Mount Joy Sao Paulo Brazil.",
      "In 2010, Pastor Isaac Ayani, from Mount Joy (UK), made a missionary visit to Sao Paulo with the sole aim of planting a Christ Apostolic Church assembly there. He met Pastor Gabriel Adedokun, now of blessed memory, who was then assisting in pastoring the Redeemed Christian Church of God, since there wasn't any Christ Apostolic Church present. \"Their meeting, facilitated through a known member of Christ Apostolic Church, led to the birth of CAC Mount Joy Sao Paulo, Brazil.\"",
      "A breakdown in communication between the two pastors led Pastor Ayani to discontinue his regular visits to the church, a strained relationship that continued until Pastor Adedokun was called to glory in 2015. Pastor Ayani, informed of his passing, sent a condolence message, and the church organized a befitting funeral. Pastor Bamidele has served as Pastor of the church since 2015.",
      "In December 2021, the church was visited by the late Pastor Adedokun's younger brother, from the USA, who had learned his elder brother had planted a church in Sao Paulo, and was briefed on the church's situation during and after his passing.",
      "\"The church is indeed marching on, and the gates of hell can't prevail against the church advancement. What a mighty God we serve — bringing His church in Brazil from obscurity to the limelight!\" In January 2024, the church received word that it was now an integral part of the Latunde Region. Regional Superintendent Pastor T.O. Agbeja, Ph.D., called to pray for the church and promised to visit before year's end, a promise he kept in November 2024.",
      "With great excitement, the church in Brazil welcomed Pastor Agbeja and Regional Secretary Pastor J.O. Olawale, November 12–18, 2024, for a revival program themed \"And There's Great Joy in the City... Acts 8:8.\" The team also visited the church at Rio de Janeiro, where Pastor Luciano is minister in charge, November 13–16, 2024, for a joint ministers' meeting. \"The Regional Superintendent admonished the ministers on the need to work as a team in unity for the rapid growth of the church in Brazil,\" and Pastor Luciano was encouraged to work closely with Pastor Bamidele for greater assimilation of the church's doctrine.",
    ],
  },
  {
    slug: "church-growth-through-pastoral-care",
    title: "Church growth through pastoral care.",
    excerpt:
      "Pastor Z.O. Oloba, Empowerment & Evangelism Coordinator, on how compassionate pastoral care and welfare strengthen retention, word-of-mouth growth, spiritual maturity, and leadership development.",
    date: "July 2025",
    dateIso: "2025-07-01",
    category: "Reflection",
    readTime: "5 min read",
    image: { url: "/images/cac-congregation-worship.jpg", alt: "CACNA congregation in worship, from a past gathering" },
    body: [
      "\"Church growth through pastoral care and welfare\" refers to the concept that churches can expand and thrive by prioritizing the well-being of their members and the communities they serve,\" writes Pastor Z.O. Oloba, Empowerment & Evangelism Coordinator, CAC Latunde Region. \"This approach emphasizes the importance of spiritual, emotional, and physical support in fostering the development and growth of a healthy and vibrant church.\"",
      "**Strengthening member retention**: compassionate pastoral care fosters strong relationships between church leaders and their members. \"When people feel genuinely cared for, they are more likely to stay committed to the church community and contribute to her growth\" (1 Peter 5:2).",
      "**Encouraging word-of-mouth growth**: acts of kindness, counseling, visitation, and support in times of crisis often lead members to share their positive experiences with others, drawing new members to a caring-centered community (John 13:35). **Fostering spiritual maturity**: through counseling, discipleship, and mentoring, pastoral care helps individuals grow and mature spiritually, becoming active participants in ministry and outreach (Ephesians 4:11-12).",
      "**Addressing practical needs**: welfare programs — food distribution, healthcare, education, financial support — demonstrate Christ's love in action and can serve as an evangelistic tool (James 2:15-16). **Building community trust**: churches that serve as centers of support and care become trusted institutions, opening doors for outreach and the integration of new believers (Matthew 5:16).",
      "**Developing leadership**: ongoing care and development empower emerging leaders from within the congregation, giving younger leaders a place to exercise their spiritual gifts (2 Timothy 2:2). \"In conclusion, the provision of pastoral care and welfare plays a significant role in promoting both vertical and horizontal church growth,\" he closes. \"Just as Jesus invested in His disciples before sending them out, the church must invest in its members to sustain growth, holiness, and impact.\" The Empowerment and Evangelical Department is available to assist Latunde Region churches with workers' seminars and revival programs toward that end.",
    ],
  },
  {
    slug: "global-impact-and-missions-eagles-conference",
    title: "Reigniting the flame of evangelism today.",
    excerpt:
      "Pastor Amos Dada, Ph.D., P.Eng, Convener of the International Gathering of Eagles Conference, on CAC's global evangelistic mandate and a personal testimony of how the conference began in Canada in 2001.",
    date: "July 2025",
    dateIso: "2025-07-01",
    category: "Ministry Update",
    readTime: "5 min read",
    image: { url: "/images/pastor-amos-dada-portrait.jpg", alt: "Pastor Amos Dada, Ph.D., P.Eng, Convener of the International Gathering of Eagles Conference", orientation: "portrait" },
    body: [
      "\"The evangelistic mandate of CAC is not limited to Nigeria. Through the International Gathering of Eagles Conference (IGOEC), global missions and various zonal outreaches, CAC has taken the gospel to Ghana, Kenya, the UK, Canada, the US, and beyond,\" writes Pastor Amos Dada, Ph.D., P.Eng, Convener of the International Gathering of Eagles Conference, in the Christ Apostolic Church Hope For All newsletter. \"This global focus aligns with the vision of taking the gospel to the uttermost parts of the earth\" (Acts 1:8).",
      "\"As a personal example, when I came to Canada in 2001, the Lord said I should put Canada on the spiritual map of the world and raise an eagle generation that led me to start International Gathering of Eagles Conference (IGOEC), a global outreach initiative birthed to fulfill the Great Commission beyond borders. Through this visionary platform, CAC Bethel Canada has extended its evangelistic reach to over 52 nations, engaging in dynamic crusades, revivals, and church planting efforts.\"",
      "\"We have won opportunity to do an outreach to Argentina and Chile. God used the leadership summits, revivals, and believers from around the world to receive fresh fire, divine impartation and empowerment for kingdom expansion. ICOEC serves as a rallying point for revival in San Juan and many souls were won to the kingdom.\"",
      "Reigniting the flame of evangelism today, he writes, means: training and equipping the laity and clergy for effective soul-winning; investing in youth and campus evangelism to reach the next generation; encouraging every assembly to develop an intentional evangelism strategy; and utilizing media and technology to expand digital evangelism and reach unreached audiences — thanking God for the CACNA Bible Institute's part in that work.",
      "\"Reviving the power of prayer and fasting, which has always fueled effective evangelism in the CAC tradition,\" he closes. \"The conference is not just a meeting — it is a mission that brings the transforming power of the gospel to cities and nations,\" mobilizing the church to plant vibrant assemblies and nurture spiritual growth in diverse cultural contexts, so that similar organizations can be developed and strengthened across the mission.",
    ],
  },
  {
    slug: "choosing-joy-proverbs-17-22",
    title: "Choosing joy — a cheerful heart is good medicine.",
    excerpt:
      "Pastor R.O. Adeagbo, Ph.D., HFA Director for CAC Latunde Region, on how laughter, cheerfulness, and choosing joy intentionally shape our outlook and relationships.",
    date: "July 2025",
    dateIso: "2025-07-01",
    category: "Devotional",
    readTime: "4 min read",
    image: { url: "/images/cac-youth-convention.jpg", alt: "CACNA youth at a past Annual Convention" },
    body: [
      "\"This idea is not just about physical health. A cheerful heart can lead to a positive outlook on life and can keep us energetic and vibrant,\" writes Pastor R.O. Adeagbo, Ph.D., HFA Director, CAC Latunde Region, in the Christ Apostolic Church Hope For All newsletter. \"Think of it like watering a healthy plant — happy heart nurtures both our minds and spirits.\"",
      "\"Just like how laughter is contagious, sharing joy can light up the day for others. Imagine walking into a room where friends are sharing happy moments and laughter — it's hard not to get caught up in that positive energy. We can be like light in each other's lives, helping us to counteract dark moments when they arise. Laughter not only boosts our outlook, but it can also improve our relationships,\" he writes, drawing on Proverbs 17:22.",
      "**Choosing joy should be intentional** — rather than waiting for circumstances to be happy or expecting validation from people, we have the power to make circumstances within our hearts feel good, even on tough days. **Encouragement matters** — we should strive to uplift others; acts of affirmation can transform someone else's day. **Facing challenges with a smile** — life is full of challenges, but choosing how we respond can make the difference.",
      "**The importance of community** — Proverbs 17:22 conveys a powerful truth about the connection between our hearts and well-being: the choice to nurture a cheerful heart significantly impacts not just how we feel but our lives and influences those around us. \"Let's choose intentionally to cultivate joy within ourselves and, in doing so, become vessels of positivity — enriching our communities and the lives around us with laughter and love.\"",
    ],
  },
  {
    slug: "fathers-day-call-to-action-2025",
    title: "A call to action this Father's Day.",
    excerpt:
      "Professor (Pastor) Z.D. Adeyewa, Former Vice Chancellor of Redeemer University, on the hidden epidemic of loneliness among fathers and small steps toward restoration.",
    date: "July 2025",
    dateIso: "2025-07-01",
    category: "Reflection",
    readTime: "3 min read",
    image: { url: "/images/cac-gathering-crowd.jpg", alt: "A gathering of the CACNA family" },
    body: [
      "\"Loneliness among fathers is a hidden epidemic, but it's not insurmountable,\" writes Professor (Pastor) Z.D. Adeyewa (fNMetS), Former Vice Chancellor of Redeemer University, Ede, Osun State, Nigeria, in the Christ Apostolic Church Hope For All newsletter. \"This Father's Day, let's commit to seeing fathers not just as providers or protectors, but as individuals with emotional needs. Reach out to a father in your life who might be struggling.\"",
      "\"A simple phone call, text, a heartfelt thank-you, or a visit can go a long way in brightening their day. For fathers feeling isolated, take a small step: join a local church group, share about your thoughts and feelings. Sometimes, all someone needs is someone to talk to. Be present and let them help.\"",
      "\"If you're a father reading this, know that you're not alone. Your role is invaluable, and your feelings matter — let's make Father's Day a turning point: celebrating daddies by fostering connection, breaking stigma, and building a world where no father feels unseen, unloved or unheard.\"",
      "**Celebrating fatherhood**: \"Let's take a moment to appreciate the dads in our lives. Let's celebrate their strengths, their sacrifices, and their unwavering commitment to their families. Let's also make a conscious effort to reach out to those who might be feeling lonely and let them know they're seen, heard, and valued. God loves them!\"",
    ],
  },
  {
    slug: "four-pillars-of-health",
    title: "The four pillars of health every believer should honor.",
    excerpt:
      "Dr. Cassandra Laleye, Chiropractic Doctor, on nutrition, exercise, sleep, and stress management as an act of stewardship over the body — 1 Corinthians 6:19-20, Psalm 139:13.",
    date: "July 2025",
    dateIso: "2025-07-01",
    category: "Reflection",
    readTime: "4 min read",
    image: { url: "/images/bible-institute-graduation.jpg", alt: "A CACNA Bible Institute graduation ceremony" },
    body: [
      "\"As a chiropractor and wellness advocate, I've spent years encouraging patients to tune in to the signals their bodies are sending, whether through pain, fatigue, or restlessness. But more than a physical response, these are often reminders of deeper imbalances in how we care for ourselves,\" writes Dr. Cassandra Laleye, Chiropractic Doctor, in the Christ Apostolic Church Hope For All newsletter. \"And as a woman of faith, I believe our health journey isn't just about wellness — it's about worship.\"",
      "\"Scripture is clear: 'Do you not know that your bodies are temples of the Holy Spirit, who is in you... therefore honor God with your bodies' (1 Corinthians 6:19-20). Our bodies are uniquely designed, miraculously knit together (Psalm 139:13) — and we have a divine responsibility to steward them well.\"",
      "\"That's where the 4 Pillars of Health come in. When we focus on nutrition, exercise, sleep, and stress management, we're not just promoting good health; we're aligning our habits with God's call to care for what He's entrusted to us. Let's take a deeper look at how each pillar supports both body and spirit.\"",
      "**1. Nutrition: fueling your temple.** \"'You are what you eat.' While it sounds cliché, this adage holds scientific and spiritual truth. The food we consume has the power to heal, energize, and restore — or inflame, deplete, and destabilize. In Genesis 1:29, God gave every seed-bearing plant... and every tree that has fruit with seed in it. They will be yours for food.' While we're no longer bound to Eden's menu, this verse reminds us that God provided natural, nourishing food to sustain His creation. Today, our plates are often filled with processed items that strip away the vitality we need. Instead, focus on whole foods — lean proteins, whole grains, healthy fats, and colourful vegetables. Drink plenty of water, too. Think of every bite as an opportunity to build strength, boost immunity, and fuel purpose.\"",
    ],
  },
  {
    slug: "balancing-the-call-burnout",
    title: "Balancing the call: burnout, rest, and the health of a leader's soul.",
    excerpt:
      "Pastor Bolaji Oladunni, Chairman of the Business Group Fellowship, on 3 John 1:1-2 — why spirituality alone isn't an antidote for a leader's health, and how to recognize burnout before it costs you.",
    date: "July 2025",
    dateIso: "2025-07-01",
    category: "Reflection",
    readTime: "4 min read",
    image: { url: "/images/cac-graduation-group.jpg", alt: "CACNA family members at a past gathering" },
    body: [
      "\"While some believers claim that being spiritual is all you need, I want to submit unequivocally that spirituality is not an antidote for the health and overall well-being of a leader, and this requires clarification and must be approached with caution,\" writes Pastor Bolaji Oladunni, Chairman of the Business Group Fellowship, in this year's Business Group Fellowship convention booklet, themed \"Balancing the Call: Burnout, Rest, and the Health of a Leader's Soul\" (Matthew 11:28-29).",
      "\"In the 3rd epistle of John, the Apostle expressed his letter to Gaius — by extension to all believers — to prioritize the desire to be in good health, and prosper in all things; as his soul prospers. 'The elder unto the well-beloved Gaius, whom I love in the truth. Beloved, I wish above all things that thou mayest prosper and be in health, even as thy soul prospereth' (3 John 1:1-2). The text above immediately suggests that physical health is not just a defining factor of a prosperous soul, but also a critical component. Gaius' prosperous soul was so excellent that John prayed his physical health and well-being would match his spiritual vigor.\"",
      "**Maintaining health and leading effectively.** \"The ministry assignment is not for the lazy, as it is a busy combination of hard work and brain work, and no leader is beyond this need. To neglect one's health ultimately can have a cascading negative impact on overall effectiveness, because there are so many 'behind-the-scenes' preparation and logistics factored into ministry work to keep things operational. The assignment of ministry, unlike many other professions, is not one where you clock in and clock out. If care is not exercised, the ministry work can lead to mental exhaustion and ultimately burn out.\"",
      "**Recognize burn out.** \"Our roles often require lots of emotional demand, 'a strong capacity for mind work' which is a function of the heart. The demands of ministry assignment do require intellectual prowess and effective problem-solving skills, which are the core of the brain work. Quite often, many ministers — especially Pastors — are inundated with responsibilities and are always fearful of letting people down, thereby attempting to live up as a 'savior,' forgetting that God Himself has a precedence for humanity; it was scripted in the story of creation that after the seventh day, God rested! It is safe to mention here that wearing many hats without caution is a red flag associated with overburden. It affects individuals, which then results in burnout, and can unfortunately have a downstream harmful impact on the family. Moses would have been a victim of such, if not for the timely counsel\" he received — a reminder, Pastor Oladunni notes, that even the most anointed leaders need someone else to help carry the load.",
    ],
  },
  {
    slug: "leadership-hypocrisy-sunday-school-rally-2025",
    title: "Leadership hypocrisy — the ruins of the present day church.",
    excerpt:
      "Pastor Michael Ekemode, Superintendent, CAC Orlando Zone, on Matthew 23:27-28's rebuke of the Pharisees and what it means for church leadership today.",
    date: "July 2025",
    dateIso: "2025-07-01",
    category: "Reflection",
    readTime: "4 min read",
    image: { url: "/images/cacma-fellowship.jpg", alt: "A CACNA fellowship gathering, from a past event" },
    body: [
      "Delivered at the 2025 Sunday School Rally, Pastor Michael Ekemode, Superintendent of CAC Orlando Zone, took as his text \"Leadership Hypocrisy: The Ruins of the Present Day Church\" (Matthew 23:27-28) — Jesus's rebuke of the Pharisees as \"whitewashed tombs,\" beautiful on the outside but full of decay within.",
      "Drawing on the Merriam-Webster definition of hypocrisy and the Greek word for church, *ekklesia* — literally \"the called-out ones\" — Pastor Ekemode argued that a church, and its leadership, is meant to be defined by integrity between what is professed and what is practiced, not by appearances maintained for others.",
      "He closed with a quote from leadership author John Maxwell, on how a leader's own style and character shape the outcome of the people and institution they lead — a caution that hypocrisy in leadership doesn't just wound the leader, but the whole body they're called to serve.",
    ],
  },
  {
    slug: "from-burnout-to-balance-agbeja",
    title: "From burnout to balance — why intentional rest matters in leadership.",
    excerpt:
      "Pastor T.A.O. Agbeja, Ph.D., Regional Superintendent of CACNA (Latunde Region), on emotional intelligence, self-reflection, and Jesus's invitation to rest (Matthew 11:28-29) — a companion address to the 2025 convention's \"Balancing the Call\" theme.",
    date: "July 2025",
    dateIso: "2025-07-02",
    category: "Reflection",
    readTime: "5 min read",
    image: { url: "/images/pastor-agbeja-portrait.jpg", alt: "Pastor Dr. T.A.O. Agbeja, Regional Superintendent of CACNA (Latunde Region)", orientation: "portrait" },
    body: [
      "\"When we embrace intentional rest and prioritize wellbeing, we are fostering a culture of self-care within our leadership and our teams,\" writes Pastor T.A.O. Agbeja, Ph.D., Regional Superintendent of CACNA (Latunde Region), in a reflection delivered under the 2025 convention's \"Balancing the Call: Burnout, Rest, and the Health of a Leader's Soul\" theme (Matthew 11:28-29). \"It's during these quieter times that leaders can engage in self-reflection and seek feedback from others, both of which are crucial components of emotional intelligence.\"",
      "\"In a world that seems to constantly prioritize busyness and productivity, finding time to recharge can be counterintuitive,\" he continues, recalling a panel discussion he facilitated where \"two wise and experienced leaders shared how emotional intelligence skills shaped their leadership journey\" — and how deeply a focus on wellbeing connected to those same skills.",
      "\"A leader who is committed to wellbeing and seeks time for rest creates space for their team to solve problems, to innovate and to look within themselves for answers,\" he writes. \"After all, a successful leader is someone who helps others be successful. Encouraging employees to be resourceful when facing challenges builds confidence, resilience and collaboration. It also relieves the burden on the leader of needing to have all of the answers.\"",
      "On self-reflection: \"Strong leaders seek feedback and take a considered approach on using what they hear from others about how they approach their work.\" Approaching leadership growth with transparency, he says, \"will not only improve your ability to lead but will also encourage your team members to do the same, fostering a culture of open communication, trust and idea-sharing\" — pointing to Moses, who needed his father-in-law Jethro's counsel to delegate and avoid the \"do-it-all\" syndrome (Exodus 18:17-18). \"This goes to confirm that burnout can affect the most spiritual leaders, and our choices and lifestyle in ministry play a critical role on our overall physical well-being.\"",
      "**Invitation to rest.** \"Have you ever had a difficult time resting? Are you overburdened to the point of hurting yourself, unknowingly? Attending to yourself is not selfish, but actually required for a successful and sustainable ministry.\" Jesus's invitation, he says, is timely: \"'Come to Me, all you who labor and are heavy laden, and I will give you rest. Take My yoke upon you and learn from Me, for I am gentle and lowly in heart, and you will find rest for your souls'\" (Matthew 11:28-29).",
      "\"Don't become so busy 'working for God' that you ignore the essential component of 'walking with God' and consequently experience a burnout,\" he warns. \"Rest is not weakness; it is God's provision for sustained strength.\" Seeking rest, he says, isn't a suggestion but a command — the Lord Himself modeled it with the sabbath. Practically: \"Say 'no' when needed; avoid overcommitment. Go for regular medical check-ups... Eat a healthy balanced diet, and exercise regularly as your schedule permits.\"",
      "\"Looking at the ministry of Jesus, He went on several personal retreats intentionally amidst His busy ministry schedule,\" Pastor Agbeja closes. \"Don't push yourself too hard without taking a break. Remember that if you fail to take a rest now, you may be laid to rest forcefully. The journey of a soul towards health and vitality is all about balance, and you will not fail in this area in Jesus's name.\"",
    ],
  },
  {
    slug: "cacna-2026-dynamic-force-asaju",
    title: "The Bible: a dynamic force for the church.",
    excerpt:
      "Rt. Rev. Prof. Dapo F. Asaju, Bishop of Ilesa Anglican Diocese, delivered this year's Christian Education Department lecture — on the ten powers of Scripture, the antagonisms working against it today, and 21 real consequences of a church that neglects it.",
    date: "July 2026",
    dateIso: "2026-07-16",
    category: "Ministry Update",
    readTime: "7 min read",
    featured: true,
    image: { url: "/images/cacna-2026-flyer.jpg", alt: "Official CACNA 2026 Annual Convention flyer" },
    body: [
      "Rt. Rev. Prof. Dapo F. Asaju — Distinguished Professor of Theology, Former Vice-Chancellor of Ajayi Crowther University, and Bishop Theologian of Ilesa Anglican Diocese — delivered this year's Christian Education Department lecture at the CACNA 2026 National Convention, titled **\"The Bible: A Dynamic Force for the Church\"** (Hebrews 4:12). Bishop Asaju has also addressed CACNA before, delivering Ministers' Session 3 on \"The Bible as an Encourager in Times of Trials, Tribulations and Challenges\" earlier this same convention.",
      "\"The Holy Bible evolved through stages of God's interaction and communication with mankind since creation,\" he opened, tracing the Bible's own history — from oral revelation, through the canonization process, to \"39 books in the Old Testament and 27 in the New Testament (sixty-six books in all),\" the Old Testament ratified at Carthage in AD 397 and the New Testament in AD 911. \"No literature or scripture has shaped humanity like the Holy Bible,\" he said. \"It is a library or collection of many books, written by many authors, most of whom never met to see the works of the other, yet they wrote around the same theme of God's salvation programme among humanity.\"",
      "He laid out **the powers of the Bible** in ten points: it is the mind and revelation of God; the creative power of God (\"Let there be light\"); the healing power of God, citing Jesus's healing of the centurion's servant and the calming of the storm; it contains the power of salvation (John 3:16, Romans 10:9-13); it guards against false teachings and heresies (Jude 3); it is \"the queen of all sciences\" and the ground of all invention; a manual for personal life, morality, family, and law; the main textbook for training prophets, apostles, and pastors; the source of genuine peace that governments lack; and the source of the transformation of society, citing the missionary influence on African communities' education, healthcare, and welfare.",
      "Turning to what opposes Scripture, Bishop Asaju named real, specific **antagonisms against the Gospel and the Word of God** across history and today: Judaism's rejection of Christ; William Tyndale burnt alive for translating the Bible into English; the Quran's core doctrinal contradictions with the Bible and the historical loss of North Africa and Asia Minor to Islam; secularism; communist atheism; AI and robotics \"which violate normal human relations\"; liberal theology and biblical revisionism; the Anglican church's recognition of same-sex marriage; and \"modern day heresies: extreme prosperity theology... doctrine of permanent unconditional salvation... theological compromises on homosexuality, marriage, family, divorce, remarriage, abortion, denial of life after death, denial of heaven and hell, denial of the Second Coming of Jesus.\"",
      "From there, he moved to 21 real **consequences and challenges of violating the dynamic powers of the Word of God** — among them: \"too many fake pastors and false prophets and charlatans occupy the pulpits\"; ministers ordained after only \"one or two years training\" when \"Moses' training lasted 40 years\" and Jesus \"waited 18 more years after He appeared in the Temple at age 12\"; materialism, where \"pastors or leaders exploit the sheep rather than feed them\"; unpreparedness to imitate the suffering of Christ and the apostles; a church \"one mile long but one inch deep\"; the internet's \"easy access to pornographic images\"; \"false powers and strange altars in church\" and ministers who employ \"non-Christian powers to gather congregations\"; the dwindling spirituality of the Christian family, where \"virtues such as virginity before marriage, faithfulness to marriage... are fast disappearing among the younger generations\"; and, most urgently, unpreparedness for heaven itself — \"the mission of the church is to save souls of people from possible hellfire.\"",
      "**The Way Forward**, he closed, is five-fold: members must be genuinely born-again and grounded in Scripture, since \"denominationalism and their doctrines cannot save anyone\"; children, youths, and all members must be trained to \"read, memorize and confess the word of God daily\" (Joshua 1:8); the pulpits of ministers who are \"not born again, not saved, not evangelical and not ethically credible\" must be cured; every message preached must be sound and spiritually efficacious gospel; and the church must raise leaders for the mission field, focused on the Great Commission (Matthew 28:19). \"Programs may change, leaders may change,\" he said in closing, thanking his \"spiritual father and mentor,\" CAC President Pastor S.O. Oladele, \"but God's Word remains forever settled in heaven.\"",
    ],
  },
  {
    slug: "cacna-2026-ultimate-authority-olajide",
    title: "The Bible: the ultimate authority for Christians.",
    excerpt:
      "Evang. Mrs. Janet Olajide's address to the 2026 Sunday School Rally in Latunde Region — a theological survey from David to Calvin, real 2024-2026 statistics on the chaos facing the modern church, and the Bible reframed as humanity's \"source code.\"",
    date: "July 2026",
    dateIso: "2026-07-16",
    category: "Ministry Update",
    readTime: "6 min read",
    featured: true,
    image: { url: "/images/cacna-2026-flyer.jpg", alt: "Official CACNA 2026 Annual Convention flyer" },
    body: [
      "Evang. Mrs. Janet Olajide delivered **\"The Bible: The Ultimate Authority for Christians\"** at the 2026 Sunday School Rally in the Latunde Region — a message built around the subtopic \"The Bible: Manual to Navigate This Chaotic World to Eternity\" (2 Timothy 3:16-17). \"The core premise is that the Bible is God's foundational owner's manual,\" she said. \"Ignoring its instructions causes spiritual and practical failure, while following it ensures safe passage through life's turbulences.\"",
      "To establish Scripture's authority, she drew together how figures across church history have described it: **King David** called it \"a perfect law, a lamp to the feet, a light to the path, and sweeter than honey\" (Psalm 119:105, Psalm 19:7,10); **Moses** called it \"life itself, as well as the source of wisdom and understanding\" (Deuteronomy 30:19, 4:6); **Apostle Paul** called it \"the sword of the Spirit\" (Ephesians 6:17, Romans 15:4); **Prophet Isaiah** called it \"eternal and unchanging\" (Isaiah 40:8, 30:21); the **Gospel of Matthew** calls it \"the ultimate authority that outlasts heaven and earth\" (Matthew 24:35); and among historical theologians, **Augustine of Hippo** described it as \"a supreme, perfect speech existing beyond time\" and **John Calvin** as \"a unique, authentic, infallible, and authoritative divine revelation to humanity.\"",
      "She then turned to real, cited data on the scale of the crisis facing the modern church: \"approximately 388 million Christians globally face intense persecution and discrimination. An average of over 12 Christians were killed daily for their faith, with 72% of these killings occurring in Nigeria\" (Open Doors, 2026; Hartley, 2026). She cited conservative studies estimating 27% to 33% of U.S. adults have experienced some form of religious or spiritual trauma (Slade et al., 2023), and statistical trends showing the global Christian population share dropping from 33% in 2000 to 32.3% in 2025 (Gallup, 2024) — alongside \"declining membership, lack of volunteerism, financial hardships, internal conflicts, family stress, and youth disengagement\" within the church itself.",
      "To make the Bible's relevance concrete, she framed it through four theological and learning frameworks: **Divine Command Theory** (Thomas Aquinas) — invoking the Bible during chaos means declaring and executing God's direct commands to stabilize the environment; **Natural Law Theory** (Aristotle, Aquinas, Locke) — the Bible as the structural manual needed to align human conduct with the moral order God built into creation; **Covenant Theology** (John Calvin) — Scripture as a binding, relational agreement guaranteeing God's permanent presence through good and chaotic times; and **Transformational Learning Theory** — the Bible's four pillars of teaching, rebuking, correcting, and training actively renewing the human mind.",
      "In her closing \"Programmer Analogy,\" she framed the Bible as humanity's \"source code\": \"running life on personal code results in system errors, emotional crashes, and infinite loops of bad decisions.\" Loving your neighbor, she said, \"serves as a critical bug fix\"; forgiving others \"repairs corrupted personal files\"; trusting in the Lord \"removes the anxiety virus\"; and seeking God's kingdom \"fully restores the spiritual navigation system.\" \"The Bible is not an ordinary piece of literature,\" she closed; \"to successfully navigate the turbulence of this changing world and secure safe passage to eternity, believers must consistently 'press the code' — meditating on, trusting, and executing the principles of the Manual day and night.\"",
    ],
  },
  {
    slug: "cacna-2026-authority-victory-brown",
    title: "The authority and victory of the Word.",
    excerpt:
      "Pastor Adekunmi Browne, Director of Youth & Young Adults CACNA, on Jesus's temptation in the wilderness, the Seven Dimensions of Scripture, and three lives — Augustine, John Newton, and C.S. Lewis — transformed by the Word.",
    date: "July 2026",
    dateIso: "2026-07-16",
    category: "Ministry Update",
    readTime: "6 min read",
    featured: true,
    image: { url: "/images/cacna-2026-flyer.jpg", alt: "Official CACNA 2026 Annual Convention flyer" },
    body: [
      "Pastor Adekunmi Browne, Director of Youth & Young Adults CACNA, delivered **\"The Authority and Victory of the Word\"** at this year's Christian Education Department session, anchored on 2 Timothy 3:16-17. \"In a world driven by changing philosophies, cultural trends, and human reasoning, the Bible stands as the ultimate, unalterable authority for the Christian faith,\" he opened. \"It is not just literature; it is God's divine revelation. While public opinions shift, believers were called to align their lives with Scripture. The world must adjust to the Bible, not the other way around.\"",
      "He built his message around **Jesus's victory in the wilderness** (Matthew 4:1-10), walking through five real applications: Jesus **defeated Satan with the Word**, proving Scripture's authority outweighs any spiritual attack, since it is \"our primary offensive weapon, the sword of the Spirit\" (Ephesians 6:17); Satan's opening line, \"If You are the Son of God...,\" **targeted Jesus's identity and truth**, echoing his same tactic in Eden — \"Has God indeed said...?\"; Jesus declared that man lives \"by every word from God's mouth,\" showing that **Scripture is mandatory, daily nourishment for the soul**, not optional (Jeremiah 15:16); Satan quoted Scripture out of context to mislead Jesus, a warning that **not everyone quoting the Bible speaks truth** — believers must \"rightly divide the word of truth\" (2 Timothy 2:15); and when confronted with correctly applied Scripture, \"the enemy fled, and angels came to minister to Jesus\" — **standing firmly on the Word guarantees victory** (James 4:7).",
      "From there he outlined **the Seven Dimensions of Scripture**: the Bible is God-breathed and infallible, its source divine rather than human (2 Peter 1:21); it reveals Jesus Christ as the primary theme of Scripture from Genesis to Revelation, not simple self-help (John 5:39, Luke 24:27); it is the Christian's standard for living, actively governing decisions, speech, finances, and morality (Psalm 119:105); it has power to transform lives, being \"living, powerful, and sharp enough to pierce hearts, renew minds, and break chains\" (Hebrews 4:12); it is the weapon against Satan, since a Christian who neglects Bible study \"is spiritually unarmed\" (Psalm 119:11); it endures forever while earthly empires and philosophies fade (Matthew 24:35, Isaiah 40:8); and it will judge humanity, standing as \"the ultimate criteria by which every human soul would be evaluated on the last day\" (John 12:48).",
      "As a \"cloud of witnesses,\" he pointed to three real historical lives transformed by Scripture: **Augustine of Hippo** (354–430 AD), once \"trapped in intense immorality, lust, and worldly philosophy,\" who encountered Scripture, surrendered to Christ, and became a pillar of global Christian theology; **John Newton** (1725–1807), a \"ruthless, cruel slave trader living in deep wickedness,\" convicted by the Word, who repented, became a gospel minister, and penned the hymn \"Amazing Grace\"; and **C.S. Lewis** (1888–1963), a \"deeply skeptical, intellectual atheist scholar,\" convinced by the logical truth and claims of Christ, who became a premier defender of the faith in *Mere Christianity*.",
      "\"A church without the Bible loses power; a Christian without the Bible loses direction,\" he closed. \"Do not merely carry it — believe it. Do not merely quote it — obey it. Do not merely admire it — live by it. 'But be doers of the word, and not hearers only, deceiving yourselves'\" (James 1:22).",
    ],
  },
  {
    slug: "purity-and-restitution",
    title: "Purity and Restitution",
    excerpt:
      "Lesson 29 of the CAC Unified Bible Study Manual, on Numbers 5 — what it means to stay clean before God, and what to do the moment we aren't: confession, restitution, and the God who makes both possible.",
    date: "September 10, 2026",
    dateIso: "2026-09-10",
    category: "Reflection",
    readTime: "3 min read",
    body: [
      '_"Know ye not that your body is the temple of the Holy Ghost which is in you, which ye have of God, and ye are not your own? For ye are bought with a price."_ — 1 Corinthians 6:19–20',
      "Numbers 5 is not the easiest chapter to preach from. It opens with instructions for removing the ceremonially unclean from the camp, moves through a law of confession and restitution, and closes with a difficult test for a husband's jealousy. Read together, the chapter is doing one thing: showing a community how to stay clean before God, and what to do the moment it isn't. That is what Lesson 29 of the Unified Bible Study Manual sets before us — **purity and restitution**, held together as two sides of the same call.",
      "**Purity is not the absence of a body but of contamination.** In the opening verses, anyone unclean — the leper, the one with a discharge, the one defiled by contact with the dead — had to be put outside the camp until they were clean again (vv. 1–4). The instruction was not cruelty; it was protection. A camp that ignored what was unclean in its midst would not stay a place where God's presence could dwell. The same is true of a life, or a church: what we tolerate in our midst determines what kind of dwelling place we remain.",
      "**Restitution is what purity looks like after a failure.** Verses 5 through 10 give the process for someone who has sinned against another person, and in doing so sinned against the Lord: confess it plainly, repay what was taken in full, add a fifth to it, and bring an offering. Confession alone was never enough — restitution had to reach both directions, to the person wronged **and** to God (v. 8). Sin is not settled by feeling sorry. It is settled by making it right.",
      "The chapter's second half is harder to sit with — the test God prescribes when a husband suspects his wife of unfaithfulness (vv. 11–31). Read in its own context, it is an act of restraint: rather than let jealousy decide a woman's fate, the law hands the matter to God alone, publicly, through a process no husband could manipulate. Whatever we make of its details today, its intent matches the rest of the chapter — **God cares how His people handle accusation, suspicion, and guilt** — and He does not leave that to human temper.",
      "The study leaves us with questions worth carrying past this week. _How can you embrace purity, and why does it matter to you personally?_ (1 John 3:3) _What would restitution look like in the relationship you've been avoiding_ — the apology not yet made, the debt not yet repaid? (Hebrews 12:14; vv. 6–7). Numbers 5 will not let purity stay an abstract idea. It insists on a person, a debt, a conversation you have been putting off.",
      "Paul's words to the Corinthians are the New Testament echo of this whole chapter: **your body is the temple of the Holy Spirit; you are not your own; you were bought with a price** (1 Corinthians 6:19–20). Purity is not a rule kept for its own sake — it is the natural posture of someone who knows they belong to Someone else. And when we fail, the way back is never hiding. It is confession, restitution, and a return to the God who is faithful to forgive (1 Thessalonians 4:7; 1 Corinthians 4:2). **Let your yes be yes and your no be no — and where you have wronged someone, go and make it right.**",
    ],
  },
  {
    slug: "offerings-from-the-tribal-leaders",
    title: "Offerings from the Tribal Leaders",
    excerpt:
      "Study 31 of the CAC Unified Bible Study Manual, on Numbers 7 — twelve leaders, twelve days, the same offering from each: what Israel's dedication of the altar teaches about unity, commitment, and worship.",
    date: "November 2, 2026",
    dateIso: "2026-11-02",
    category: "Reflection",
    readTime: "3 min read",
    body: [
      '_"Endeavouring to keep the unity of the Spirit in the bond of peace."_ — Ephesians 4:3',
      "Numbers 7 comes after the dedication of the tabernacle and the ordination of the priests (Leviticus 8–10). It records the offerings the leaders of Israel's twelve tribes brought to dedicate the altar and celebrate the tabernacle's completion. Study 31 of the Unified Bible Study Manual draws out what the long, repeated list is really saying: **each leader brought the same offering for his tribe**, and in doing so the twelve tribes showed their unity, and their leaders showed their commitment to God as representatives of their people.",
      "**The people in the story.** Moses received God's instructions and oversaw the dedication. The tribal leaders brought the offerings. The priests, led by Aaron, were responsible for the sacrifices and for worship at the tabernacle, with the Levites assisting them. The offerings themselves were gifts for worship, thanksgiving, or atonement — animals, grain, and precious metals — and through them the altar was **dedicated: set apart for God's use.**",
      "**Twelve days, one offering.** The leaders brought their offerings over twelve days, a communal act that shows the importance of working together in faith — the same unity of the Spirit Paul urges us to keep (Ephesians 4:3). Each brought the same gifts: silver plates, sprinkling bowls, fine flour, wine, incense, and animals for the different sacrifices (vv. 13–17). No tribe outgave another; the identical offerings promoted equality and unity. Romans 12:1 asks the same of us — **to offer our lives as living sacrifices to God**, just as those leaders offered their gifts.",
      "**Dedicated together.** Moses oversaw the dedication and Aaron performed the sacrifices (vv. 84–86) — a reminder that we are co-workers with God in His ongoing work (1 Corinthians 3:9). The offerings marked the tabernacle's completion and the leaders' dedication (v. 88), and they were, above all, worship. Hebrews 13:15 calls us to offer God the sacrifice of praise in the same spirit.",
      "The study's questions for reflection: _How can you help promote unity and cooperation in your community, church, or workplace? How can you set an example for others in your commitment to God? Who are you accountable to, and how can you meet your responsibilities? How can you show generosity, obedience, and support for God's work? How can you support and encourage your leaders in their roles and responsibilities?_",
      "Like the tribal leaders, we are called to work toward unity in our churches and communities, and to show our commitment to God in both words and actions (Numbers 7:6–9). Generous giving expresses gratitude to God with our resources, time, and actions (vv. 13–17). Set aside time each day for prayer and worship, and let go of grudges, forgiving as God forgives us (Matthew 6:12; Ephesians 4:32). Support those in need as an act of faith (1 John 3:17–18), and be supportive and obedient to God and to your leaders, as Israel followed Moses and the priests (Numbers 7:89; Hebrews 13:17). **True leadership means leading by example, putting worship first, and showing devotion through our actions and sacrifices.** Pray with the study for unity among believers, for a deeper commitment to Christ in word, action, and sacrifice, and for every leader to lead by example.",
    ],
  },
  {
    slug: "consequences-of-complaints",
    title: "Consequences of Complaints",
    excerpt:
      "Study 33 of the CAC Unified Bible Study Manual, on Numbers 10–11 — Israel's grumbling in the wilderness, a leader at the end of himself, and the God who kept providing anyway.",
    date: "November 2, 2026",
    dateIso: "2026-11-02",
    category: "Reflection",
    readTime: "3 min read",
    body: [
      '_"Do all things without murmurings and disputings."_ — Philippians 2:14',
      "Numbers 10 and 11 follow Israel out from Mount Sinai and into a season of complaint. Study 33 of the Unified Bible Study Manual traces what that grumbling cost them: God's anger and a fire that consumed part of the camp (Numbers 11:1–3), Moses' frustration and his plea for help (vv. 10–15), the appointment of 70 elders to share his load, and a provision of quail that ended in a plague (vv. 16–35). The study defines its subject carefully: **the consequences of a complaint depend on how it is expressed, received, and addressed.**",
      "**How the story unfolds.** God had Moses make two silver trumpets to signal gatherings, movements, and warnings (10:1–10), and the people left Sinai following the cloud of His presence (10:11–36). Soon they grumbled about their hardships, and God's anger burned in a fire at the edge of the camp (11:1–3). Then they despised the manna and craved meat (11:4–6). Overwhelmed, Moses brought the burden to God (11:10–15). God answered by appointing 70 elders and putting on them some of the spirit that rested on Moses, so that they could carry the leadership with him (11:16–30). He gave the people quail — but their indulgence brought a plague, and many died (11:31–35).",
      "The study's questions for reflection: _Do you often find yourself complaining about your circumstances, and what triggers it? How do you respond to challenges or difficulties? Do you trust God's sovereignty and provision? How do your words and attitudes affect those around you — do you encourage or discourage others? How can you deepen your understanding of God's character as revealed in Numbers 10–11, and apply these lessons to your spiritual growth and relationships?_",
      "**Gratitude guards the heart.** Israel's complaints about God's provision remind us to be thankful for what we have and to avoid grumbling, because it brings its own consequences (11:1–2; Philippians 2:14). **Leadership is meant to be shared.** Moses' frustration and God's response show the importance of supporting one another and empowering others to lighten the load (vv. 16–17; Ecclesiastes 4:9–10); the 70 elders show the strength of a community that shares responsibility (vv. 24–25; 1 Corinthians 12:4–7). **God keeps providing.** Even through the complaints, He went on caring for His people — so we can trust His sovereignty when things are not going as planned (vv. 31–34; Philippians 4:19).",
      "The study's practical counsel: keep a gratitude journal, focus on God's faithfulness, encourage others, and build communities where tasks and leadership are shared (1 Thessalonians 5:18). Pray with it this week: _Lord, help me appreciate Your goodness and provision; I trust in Your sovereignty even when I do not understand Your ways; guide me to empower others and build unity; protect me from the consequences of my own complaining, and help me trust You instead._ **Even in challenging times, God will provide.**",
    ],
  },
  {
    slug: "miriams-rebellion",
    title: "Miriam's Rebellion",
    excerpt:
      "Study 34 of the CAC Unified Bible Study Manual, on Numbers 12 — when Moses' own sister and brother challenged his place, God answered, judged, and then showed mercy.",
    date: "November 2, 2026",
    dateIso: "2026-11-02",
    category: "Reflection",
    readTime: "3 min read",
    body: [
      '_"And they said, Hath the LORD indeed spoken only by Moses? hath he not spoken also by us? And the LORD heard it."_ — Numbers 12:2',
      "Numbers 12 records a painful moment in the wilderness: Miriam and Aaron, Moses' own sister and brother, spoke against his leadership. Study 34 of the Unified Bible Study Manual points out that **this was not just an attack on Moses but on God's sovereign choice of him.** Their complaint pointed to Moses' marriage to a Cushite woman, but the deeper issue was jealousy of his unique place with God and a desire for equal authority (vv. 1–2).",
      "**A challenge to God's choice.** Their question — _has the Lord spoken only through Moses? Has He not spoken through us also?_ — came at a point in the journey when Moses' leadership was vital (vv. 2–3). Scripture shows the same pattern elsewhere, in Korah's rebellion (Numbers 16) and in Israel's demand for a king (1 Samuel 8:7). The event reminded Israel that **rejecting the leader God had chosen was rejecting God Himself** (Exodus 4:10–16).",
      "**God's response.** God called Moses, Miriam, and Aaron to the Tent of Meeting and rebuked the two for questioning Moses' position (vv. 4–9). He affirmed that Moses was His chosen servant, with whom He spoke face to face, unlike other prophets (vv. 6–8), and His anger made plain that speaking against His appointed leaders is an offence against Him. Miriam was struck with leprosy, her skin white as snow — a visible sign of judgement on undermining God's authority (v. 10).",
      "**Then mercy.** Aaron admitted their wrong and asked Moses to pray, and Moses, in humility and compassion, immediately prayed for his sister's healing (vv. 11–13). God had Miriam stay outside the camp for seven days, a time of both discipline and restoration; afterwards she was healed and brought back (vv. 14–15). **God's justice is swift, but His mercy is abundant** — when we repent, He forgives and restores.",
      "The study's questions for reflection: _How do you react when you disagree with leaders, and what can Miriam and Aaron teach you about handling disagreement respectfully? Are you quick to criticise, or do you approach issues with humility? Have you felt jealous or proud when others are in charge, and how can you guard against it? What should your attitude be toward those in authority? How can we reduce rebellion, jealousy, and argument in our groups, and encourage unity and respect for leadership in the Church?_",
      "Rebellion against God's appointed leaders is serious; defying them is like defying God (1 Samuel 15:23). Jealousy and pride divide, while humility, submission to God's will, and loyalty build unity. Leaders and followers are both accountable — leaders need humility, and followers should support and uplift them. So **pray for your leaders, appreciate their work, and speak respectfully even when you disagree.** Pray with the study: _Lord, help me honour and support the leaders You have placed over me, and grant them wisdom; bring unity to the body of Christ; and rid me of pride and rebellion, giving me grace to be loyal and humble in all things, in Jesus' name._",
    ],
  },
  {
    slug: "the-twelve-spies",
    title: "The Twelve Spies",
    excerpt:
      "Study 35 of the CAC Unified Bible Study Manual, on Numbers 13 — twelve leaders saw the same land, and only two saw God in it. What kind of report are we bringing back?",
    date: "November 2, 2026",
    dateIso: "2026-11-02",
    category: "Reflection",
    readTime: "4 min read",
    body: [
      '_"And Caleb stilled the people before Moses, and said, Let us go up at once, and possess it; for we are well able to overcome it."_ — Numbers 13:30',
      "The previous study looked at Miriam's rebellion and the importance of respecting the leaders God has chosen. Numbers 13 turns the question around: **leaders, too, must lead with commitment, dedication, and trust in God**, guiding the people toward the inheritance He has promised. Study 35 of the Unified Bible Study Manual uses the story of the twelve spies to teach how to keep faith and hope in the face of obstacles — by keeping our eyes on the greatness and power of God.",
      "**Who were the spies?** As Israel prepared to enter Canaan, twelve men were chosen to survey the land (vv. 1–2; Deuteronomy 1:22–23). Each one was a leader of his tribe, expected to strengthen the people's faith and encourage them to take what God was giving (v. 3; 1 Peter 2:9). Only two — Joshua (Oshea) and Caleb — came back with a good report. The other ten spread fear and doubt through the camp (vv. 30–33; 14:6–9; Joshua 14:6–9). Good leaders build faith, hope, and progress in others, helping them trust God's plans (Hebrews 10:23; 1 Thessalonians 5:11). Bad leadership causes delay, and can keep people from the blessings God meant for them (Numbers 14:1–4; 2 Corinthians 5:20).",
      "**The mission and the commission.** The task was simple: scout the land God had promised to their ancestors (vv. 2, 17–20). It was not Moses' idea or the spies' own — **God ordered the mission**, and Moses sent them at His command (vv. 1–3). A mission backed by God's power was never going to fail on God's side. When it failed, it was because the spies did not recognise His part in it (Joshua 1:5; 2 Corinthians 3:5).",
      "**What they left out, and what they said.** The ten had a clear task, yet instead of inspiring confidence they spread fear (14:1–4). They saw a great deal — a beautiful land flowing with milk and honey, and giants living in it (vv. 25–29, 31–33) — **but they failed to see God**, the true source of their strength (Isaiah 41:10; Psalm 121:1–2). Only Caleb and Joshua tried to quiet the negative report (v. 30). The others preached hopelessness, impossibility, and defeat. The study puts the question to each of us: _what message are we spreading?_",
      "The study's questions for reflection are worth carrying through the week. _How can you show godly leadership when facing challenges? How can you support your leaders in guiding you to the blessings God has for you? Why do you think God allows challenges in your life — is it to strengthen your trust in Him? What steps can you take to trust God more as a leader and help others grow in their faith? How can you improve your leadership attitude to help others stay on track?_",
      "**Our words carry spiritual weight.** Fear spread through a negative report (Numbers 13:31–33); faith-filled speech builds hope (Proverbs 18:21). Doubt cost Israel the promise (Numbers 14:22–23), but those with a different spirit, like Caleb, received God's best (Numbers 14:24). Trusting God above all gives strength and direction in uncertain times, and acknowledging Him makes our paths clear (Proverbs 3:5–6). God also tests our obedience and loyalty through the leaders He appoints over His people (Numbers 13:1–3; Hebrews 13:17), and seeing His hand in that leadership helps us follow wisely.",
      "Challenges can look like giants. But when we focus on God's greatness, they shrink. David saw Goliath not as a threat but as an opportunity for God's power to be revealed (1 Samuel 17:45–47). **True leadership begins with deep trust in God and a heart anchored in hope** — recognising His presence in all things, speaking with faith, and walking in obedience, so that we can overcome every challenge and lead others into their God-given purpose. The study closes in prayer: thanking God for bringing us this far, asking Him to build our confidence in Him, and asking Him to help our leaders, in the church and in public life, lead His people well.",
    ],
  },
  {
    slug: "israels-fear-and-rebellion",
    title: "Israel's Fear and Rebellion",
    excerpt:
      "Study 36 of the CAC Unified Bible Study Manual, on Numbers 14 — how fear turned into rebellion at the edge of the Promised Land, and what Caleb's different spirit teaches us.",
    date: "November 2, 2026",
    dateIso: "2026-11-02",
    category: "Reflection",
    readTime: "3 min read",
    body: [
      '_"But my servant Caleb, because he had another spirit with him, and hath followed me fully, him will I bring into the land whereinto he went; and his seed shall possess it."_ — Numbers 14:24',
      "Numbers 14 is a turning point in Israel's journey. Standing at the edge of the land, the people had a choice between faith and fear — and even after everything they had seen God do, they gave in to fear when things got hard. Study 36 of the Unified Bible Study Manual points out that **their reaction was not just emotion; it showed a heart resisting God.** The chapter shows how fear can block what God wants to do in our lives, and the value of the courage and full trust Caleb had (v. 24).",
      "**What happened.** The people mourned, murmured, and wanted to go back to Egypt (vv. 1–4). Caleb and Joshua answered with bold trust in God's promise (vv. 6–9). The crowd rejected that faith-filled leadership and nearly turned to violence (v. 10). God judged their unbelief and withheld the promise from that generation (vv. 22–23), while Caleb was honoured for his devoted faith (v. 24). Then Israel went ahead presumptuously, without God's presence, and was defeated (vv. 44–45).",
      "**Fear made them forget.** The people let fear take over and forgot how God had helped them, despite all the miracles they had seen (v. 1; Psalm 106:7–13). Instead of thanking Him, they complained and longed for their old life in Egypt — a life that had been full of pain (vv. 3–4; Exodus 16:2–3). They lost confidence in their leaders and ignored the direction God had clearly given through Moses (v. 4). Fear did not just make them anxious; it pushed them toward bad decisions. **The fear of man brings a snare, but whoever trusts in the Lord is kept safe** (Proverbs 29:25). Israel learnt that the hard way.",
      "**Fear became rebellion.** It did not stay quiet. God treated their refusal to trust Him as a serious offence (v. 11), and because of their unbelief, that whole generation was told it would not enter the land — they missed what could have been theirs (Hebrews 3:18–19). When they then tried to go up anyway, it looked like obedience, but it was too late, and they were defeated (vv. 44–45). Scripture compares rebellion to witchcraft and stubbornness to idolatry (1 Samuel 15:23). **It is not just bad behaviour; it is a heart problem.**",
      "The study's questions for reflection: _What fears are keeping you from full obedience today? Are you relying on God's past faithfulness, or focusing on present challenges? Do your words feed courage or encourage doubt in those around you? What is your response when God says \"wait\" or redirects you? What does cultivating a \"different spirit\" look like in your personal walk?_",
      "We need faith that stands when others panic. Caleb and Joshua held on to what God said, not what the crowd felt (vv. 6–9; 2 Timothy 1:7). Real obedience means following God when He leads — not only doing the right thing, but doing it at the right time and in the right way (Proverbs 3:5–6). And what we say matters: the ten spies discouraged a whole nation, while Joshua and Caleb tried to lift its heart (Proverbs 18:21). **Caleb's different spirit is a call not to settle or follow the crowd.** Pray with the study this week: _Lord, help me trust You more deeply when fear clouds my judgement; give me a heart like Caleb's, willing to stand when others shrink back; and teach me to follow Your lead with patience, wisdom, and unwavering faith._",
    ],
  },
  {
    slug: "offerings-ordinance-and-korahs-rebellion",
    title: "Offerings' Ordinance in Canaan and Korah's Rebellion",
    excerpt:
      "Study 37 of the CAC Unified Bible Study Manual, on Numbers 15–16 — what God asked of Israel's worship in Canaan, and why Korah's grab for power ended in judgement.",
    date: "November 2, 2026",
    dateIso: "2026-11-02",
    category: "Reflection",
    readTime: "5 min read",
    body: [
      '_"Let nothing be done through strife or vainglory; but in lowliness of mind let each esteem other better than themselves."_ — Philippians 2:3',
      "Numbers 15 and 16 sit side by side for a reason. The first restates how God wanted Israel to worship once they entered Canaan; the second records Korah, a Levite, rising up against the authority of Moses and Aaron. Study 37 of the Unified Bible Study Manual notes that the rebellion brought severe consequences **not only on Korah and his followers but on the whole community.** Read together, the two chapters set grateful, ordered worship against a heart that wanted power.",
      "**The ordinance of offerings.** When Israel entered the land, God specified what they were to bring Him, and how and when (15:1–16). Burnt offerings and freewill offerings were to be a pleasing aroma to Him, each accompanied by its measure of fine flour, olive oil, and wine; a vow offering of a young bullock had to come with its grain offering (15:8). **The native-born and the foreigner were to offer the same** (15:14–16). A portion of the first ground meal from the threshing floor was given as a heave offering (15:18–21). God provided atonement for unintentional sin (15:22–29), while deliberate sin — such as wilfully breaking the Sabbath — was punished (15:30–36). And Israel was to wear tassels on their garments as a reminder to keep His commandments (15:37–41).",
      "**Korah's rebellion.** Rebellion is defiance against authority, rules, or expectations, and it often grows out of a desire for change, autonomy, or recognition (1 Samuel 15:23). Korah, with Dathan, Abiram, and 250 prominent men, accused Moses and Aaron of taking too much power and of not recognising the holiness of the whole congregation (16:1–3). The study reads Korah's real motive as a desire for power and recognition. Moses answered in humility, leaving the judgement to God (16:4–19) — and God's judgement came: the earth swallowed Korah, Dathan, Abiram, and their households, and fire consumed the 250 men (16:23–35).",
      "The study's questions for reflection: _How can you show gratitude to God for His blessings, including daily provision and Jesus' sacrifice? What does the New Testament teach about worship and sacrifice, now that we no longer follow Old Testament rituals? How can you offer yourself as a living sacrifice, holy and pleasing to God (Romans 12:1–2)? How can you guard against a desire for power, like Korah's, that sets you against leaders or authority? What should your attitude be when you work under a leader you feel is ungodly — and how can you support godly leaders instead of criticising them?_",
      "**The offerings still point somewhere.** They remind us of worship, honour, and trust in God's provision. Jesus' sacrifice is symbolised in the drink and burnt offerings (Matthew 26:28), and the peace offering shows the closeness God wants with His people (Leviticus 7:11–15). Christ is the atonement for all sin, and the Sabbath remains a holy day of rest and worship (Matthew 12:8; Hebrews 4:9–10). So give thanks for His provision and commit to His will (1 Thessalonians 5:18).",
      "**Rebellion is not tolerated by God, and its consequences are severe** (Numbers 16:31–33). Leadership is ordained by God, and we are called to show respect, love, and obedience to those in authority (Romans 13:1–2; Hebrews 13:17), staying humble before Him (James 4:10) and guarding against selfish ambition (Proverbs 3:5–6; Philippians 2:3–4). Numbers 15–16 call us to gratitude, sacrifice, humility, and obedience — trusting God's provision, submitting to His authority, and recognising His sovereignty in every part of life (Colossians 3:17). Pray with the study: _Lord, keep me humble before the authority You have placed in my life; protect me from selfish ambition; give me courage to follow Your guidance when it is hard; and help me stay faithful to You and respect the leaders You have set before me._",
      "**A reflection from the study: who led the rebellion?** Numbers 16:1 names four men: **Korah**, a Levite; and **Dathan, Abiram and On**, from the tribe of Reuben. Verse 2 adds 250 prominent leaders of the congregation who joined them. They had two different grievances, and God answered each one.",
      "**Dathan, Abiram and Korah's company.** Dathan and Abiram accused Moses of failing to bring them to a land flowing with milk and honey and of making himself a prince over them (vv. 12–14). Moses told the congregation to move away from their tents (v. 26), and the ground opened and swallowed their households and everything belonging to Korah's company (vv. 31–33). Numbers 26:11 adds that \"the children of Korah died not\", which is why the Psalms of the sons of Korah exist.",
      "**The 250 men.** Korah and the 250 challenged the priesthood of Aaron and his sons, saying the whole congregation was holy (v. 3). Moses set a test: take censers, put in fire and incense, and stand before the Lord (vv. 6–7, 16–18). Fire came out from the Lord and consumed the 250 as they offered incense (v. 35). God had Eleazar hammer their bronze censers into a covering for the altar, a lasting reminder that no one outside Aaron's line was to burn incense before the Lord (vv. 36–40).",
      "**What happened to On?** He is named in verse 1 and never mentioned again. Scripture does not say why. Some Jewish and Christian commentators suggest he withdrew from the conspiracy before the confrontation, but that is tradition, not something the text states.",
    ],
  },
  // Imported from the CACNA newsletter blog (cacnewsletter.blogspot.com, May 6, 2015).
  {
    slug: "cac-village-ready-for-use-2015",
    title: "CAC Village is ready for use.",
    excerpt: "We give glory and honor to the Almighty God for the purchase of C.A.C. Village. The property is for all of us in C.A.C. North America and available for any Church for…",
    date: "May 6, 2015",
    dateIso: "2015-05-06",
    category: "Ministry Update",
    readTime: "1 min read",
    image: {
      url: "/images/blog/archive/village-ready-2015.jpg",
      alt: "Tables set with red napkins and glassware for a banquet"
    },
    body: [
      "We give glory and honor to the Almighty God for the purchase of C.A.C. Village. The property is for all of us in C.A.C. North America and available for any Church for important events.",
      "The CAC Village is ready to be used for the following:",
      "Center for our Convention/Conference",
      "Center for Youth Camp for C.A.C. NA, and All",
      "Prayer Mountain For ALL",
      "Center For Retreat for Ministers, CACMA, Good Women, Youth etc.",
      "Center For Resort – For Vacation, Holiday, Family Reunion etc.",
      "Church Workers Refresher Programs etc.",
      "For Multipurpose use like Inside or Outside Weddings, Re-Union, etc.",
      "For the use of any Christian Organization or Group.",
      "And many more.",
      "We need financial support from everyone through donations to be able to maintain and keep the place up to the standard. For the details of the usage of the place, donations, and more information, visit our website, www.cacnorthamerica.net"
    ]
  },
  // Imported from the CACNA newsletter blog (cacnewsletter.blogspot.com, May 6, 2015).
  {
    slug: "cacna-2015-convention-faithfulness-of-god",
    title: "CACNA 2015 Convention — The Faithfulness of God.",
    excerpt: "Preparation for the 2015 Convention is coming from Monday, July 6, to Friday, July 10, 2015. The Theme for this year Convention is:",
    date: "May 6, 2015",
    dateIso: "2015-05-06",
    category: "Event Spotlight",
    readTime: "1 min read",
    image: {
      url: "/images/blog/archive/convention-2015-ad.png",
      alt: "Flyer for the 2015 CAC North America Convention at CAC Village, July 6–10, theme The Faithfulness of God"
    },
    body: [
      "Preparation for the 2015 Convention is coming from Monday, July 6, to Friday, July 10, 2015. The Theme for this year Convention is:",
      "THE FAITHFULNESS OF GOD.",
      "The Schedule for the event is as followed:",
      "Monday, July 6, Arrival Day. Evening Revival. By General Evangelist. Pastor S.K. Abiara - 7 pm to 9 pm",
      "Tuesday, July 7, Ministers Conference. 9 am to 6 pm. Evening Revival. By General Evangelist. Pastor S.K. Abiara - 7 pm to 9 pm",
      "Wednesday, July 8, CACMA, GOOD WOMEN, MINISTERS WIVES & YOUTH CONFERENCES. 9 am to 6 pm. Evening Revival. By General Evangelist. Pastor S.K. Abiara - 7 pm to 9 pm",
      "Thursday, July 9, CONVENTION DAY. 9 am to 6 pm. Evening Revival. By General Evangelist. Pastor S.K. Abiara - 7 pm to 9 pm",
      "Friday, July 10, Ordination of Pastors & Closing of the program.",
      "VENUE:",
      "C.A.C. VILLAGE",
      "14051 Stahley Road,",
      "Blue Ridge Summit, PA 17214"
    ]
  },
  // Imported from the CACNA newsletter blog (cacnewsletter.blogspot.com, February 20, 2013).
  {
    slug: "cacna-chairmen-re-invigorated-2013",
    title: "CAC North America chairmen re-invigorated.",
    excerpt: "After four days of retreat at Atlanta Georgia,by the Chairmen of Christ Apostolic Church North America, where Church Management Principles and Leadership Techniques…",
    date: "February 20, 2013",
    dateIso: "2013-02-20",
    category: "Ministry Update",
    readTime: "2 min read",
    image: {
      url: "/images/blog/archive/chairmen-retreat-2013.gif",
      alt: "Chairmen seated at tables during the retreat in Atlanta, Georgia"
    },
    gallery: [
      {
        url: "/images/blog/archive/bible-institute-2013.gif",
        alt: "Banner graphic for the CAC Bible Institute, U.S.A."
      }
    ],
    body: [
      "After four days of retreat at Atlanta Georgia,by the Chairmen of Christ Apostolic Church North America, where Church Management Principles and Leadership Techniques were properly treated,a great hope is in sight for a great development in the Church.",
      "The Coordinator,Pastor Dr. Joshua Owoeye demonstrated a true leadership quality that was appreciated by all the Chairmen present.This is a follow up to a similar program that was held earlier in September, 2012 at Chicago.IL.''THE CHURCH IS MARCHING ON.''",
      "ANOTHER NATIONAL COUNCIL MEETING OF C.A.C.N.A.",
      "CAME UP SUCCESSFULLY.",
      "As the Chairmen were concluding their retreat,other members of this Council comprising of selected District Superintendents,Elders representatives and National Good Women Leader sat to deliberate on the progress of the Church in North America.",
      "Reports of last year activities were rendered,discussed and decisions were taken as to means of moving the Church forward in North America.",
      "Highlights of logistics of finally taking over the CAC Village very soon were considered and approved.Therefore, high expectations of using this site",
      "for programs of the Church this year, beginning with Good Women Association Convention,from April 10th -13th,2013 is D.V.possible.",
      "Every one is implored to pay his/her contributions-$1,000.00, $500.00, $250.00 now and have your receipts,letters and Golden buttons,etc.",
      "C.A.C. BIBLE INSTITUTE - U.S.A.TAKES OFF.",
      "Another milestone is the take off of the Bible Institute,C.A.C North America.Mondays from 8 pm -10 pm Eastern Time, is the forum for the un-ordained Ministers, while Thursday 8 pm-10 pm is that of ordained Ministers.",
      "It will be concluded in July with practicals and graduation ceremonies. The Provost,Pastor Dr.Timothy Agbeja assisted by able men of God have been giving impressive teachings after the coordinator- Pastor Dr. Joshua Owoeye declared the program open.",
      "''UNPRECEDENTED'' - A MARATHON WEEK OF SPIRITUAL RELAY RACE",
      "''Behold,how good and pleasant it is for brethren to dwell together in unity''(Psalm 133 Vs.1).",
      "This came alive at the just concluded ''MARATHON 7 DAYS OF PRAISE,PRAYER AND FASTING''-TELECONFERENCE, organized by Christ Apostolic Church North America Good Women Association from Sunday January 27th to Saturday February 2nd,2013.",
      "Amazingly,what was supposed to be a program of a small group of women suddenly exploded and became worldwide and involving not only women,but also men including non CAC Members and Muslims.It was followed by a thanksgiving service in various Assemblies all over North America.The Good Women Leader,CAC worldwide - Deaconess Adebule congratulated her comrades and encouraged them to move forward as such prayers can not but bring miraculous results. The President of the Church- Pastor A.O. Akinosun blessed the participants in the program."
    ]
  },
  // Imported from the CACNA newsletter blog (cacnewsletter.blogspot.com, October 30, 2012).
  {
    slug: "first-sunday-school-rally-orlando-2012",
    title: "First Sunday School Rally in CAC North America, Orlando, Florida.",
    excerpt: "Christ Apostolic Church (Worldwide) is a Pentecostal church which is known for passionate evangelism, divine healing and ceaseless prophetic prayer among others. It…",
    date: "October 30, 2012",
    dateIso: "2012-10-30",
    category: "Event Spotlight",
    readTime: "4 min read",
    image: {
      url: "/images/blog/archive/sunday-school-rally-2012-1.jpg",
      alt: "Delegates seated at tables during a session of the Sunday School Rally"
    },
    gallery: [
      {
        url: "/images/blog/archive/sunday-school-rally-2012-2.jpg",
        alt: "Delegates at the Sunday School Rally in Orlando"
      },
      {
        url: "/images/blog/archive/sunday-school-rally-2012-3.jpg",
        alt: "Attendees of the Sunday School Rally"
      },
      {
        url: "/images/blog/archive/sunday-school-rally-2012-4.jpg",
        alt: "Group photo of delegates at the Sunday School Rally in Orlando, Florida"
      }
    ],
    body: [
      "Christ Apostolic Church (Worldwide) is a Pentecostal church which is known for passionate evangelism, divine healing and ceaseless prophetic prayer among others. It was therefore not a surprise when the CAC North America organized it first Sunday school Rally at Orlando, Florida on Oct. 4th- 6th, 2012.",
      "The Theme of the Rally was - Wanted: Sacrificial, Sincere and Sanctified Vessels The National coordinator, Pastor Dr. Joshua O. Owoeye PhD declared the conference open. In his opening remark, he declared that: \"This is truly the doing of the Lord-for us members of Christ Apostolic Church North America, to see the inauguration and the First North America Conference Sunday School Rally. We have come this far by faith and by the grace of God. We will keep moving ahead in the Lord and doing exploits in God despite what the enemy may bring. As a church and part of the body of Christ, we are victorious and every of our endeavor shall succeed gloriously in Jesus Name. Amen.\" The Chairman of the Education Department, CAC North America, Pastor Dr. Gabriel Dada Th.D whose selfless service with the committee members of the Education department made the conference a reality, remarked in his Welcome Address that:",
      "\"Firstly, God has His work (program) here with us; Secondly, He is looking for vessels to serve Him; Thirdly, He has standard and qualities for the work; and fourthly’ the examples of Jesus. God has always chosen people. He has always thrown out His gracious invitation for people to respond (II Chro. 6:9; Isa. 6:8).”",
      "The president of the CAC (Worldwide) Pastor Abraham O. Akinosun’s sent in his goodwill address which was read by Pastor J.A. Olawale Secretary, CAC North America. The President declared that:",
      "\"God has good, pleasing and perfect plans for His children. He wants us to be transformed people with renewed minds, living to honor and obey Him. Because He wants only what is best for us, and because He gave His Son to make our new lives possible, we should joyfully give ourselves as living sacrifices for His service.\" The opening lecture was given by Pastor Dr. Francis Iselowo Th.D who spoke on “Jesus Came, Lived and Died For Mankind.” He emphasized that:",
      "Our lives must be rooted in Jesus Christ whose mission was to make Himself the sacrificial Lamb of God that takes away our sins. If you are a Christian and you are not making any sacrifice for His kingdom sake, check your stand in the Lord. Jesus called us to come to him, live for Him and die for Him if possible.",
      "Notable speakers include Pastor Felix Adunyame a Ghanian whose lecture on The Quantity And Quality Of Jesus Prayer resonated with the audience. Pastor Oyegoke spoke on The Compassionate and Passionate Jesus and Dr. Duke Maduagwu spoke on Christ and Crisis Management. Pastor Arnold Ogunmoyero gave the fourth lecture on Jesus and The Children.",
      "The praise and worship team comprised of Lady Evangelist Bolanle Mustapha, Mama Joy Iselowo, Lady Evangelist Funke Ogunwuyi (Texas) and Sister Adejoke Oyelowo from Atlanta Georgia.",
      "There was time for prayers where burdens were lifted up to mount Calvary.",
      "We want to place on record the services of our CAC members in Orlando Florida for their impeccable hospitality. Deacon and Deaconess Ben Akinola and Engineer Olaleye from Orlando Florida supervised and sacrificed their resources in transporting delegates from the Orlando International Airport to the conference venue at Double Tree Hotel by Hilton, Orlando Florida.",
      "The conference ended with the National Coordinator, Pastor Dr. Joshua O. Owoeye praying and declaring prophetic blessings upon the delegates that attended. Finally, Pastor Dr. Gabriel Dada Th. D declared that:",
      "God really glorified Himself considering the short notice and all the Zones in CAC North America which included 10 delegates from Canada. This portrayed a good sign of Unity for CAC here in North America and Canada under the visionary leadership of our Father in the Lord Pastor Dr. Joshua Owoeye PhD whose unwavering love for the correct teaching of the word of God in our churches motivated our organizing this 1st Sunday School Rally and Orlando, Florida happened to be the first history making city in pioneering the venue of the meeting. Thanks to my committee members and our brethren in Orlando Florida.",
      "Glory Be to God!"
    ]
  },
];

export const CATEGORY_COLOR: Record<PostCategory, string> = {
  "Ministry Update": "#2D42C9",
  "Reflection": "#7A1128",
  "Devotional": "#FDC841",
  "Event Spotlight": "#EB6342",
};

export const CATEGORY_ACCENT: Record<PostCategory, string> = {
  "Ministry Update": "linear-gradient(135deg,#2D42C9,#12141E)",
  "Reflection": "linear-gradient(135deg,#7A1128,#C81E3A)",
  "Devotional": "linear-gradient(135deg,#FDC841,#EB6342)",
  "Event Spotlight": "linear-gradient(135deg,#EB6342,#7A1128)",
};

/** One consistent color + gradient per category — assigned here, once, so
 *  every post in the same category reads the same way instead of each
 *  entry picking its own swatch. */
export const POSTS: BlogPost[] = RAW_POSTS.map((p) => ({
  ...p,
  authors: p.authors ?? POST_AUTHORS[p.slug],
  categoryColor: CATEGORY_COLOR[p.category],
  accent: CATEGORY_ACCENT[p.category],
}));

/** Posts dated before this are the old newsletter archive (2012-2015 imports).
 *  They live on /blog under "From the Archives" and never appear in "latest"
 *  strips like the homepage Latest News. */
export const ARCHIVE_BEFORE = "2020-01-01";

/** The convention closing-appreciation post: the hero shows it on its own
 *  recap slide, so it is never also the hero's "Latest News" slide. */
export const CONVENTION_RECAP_SLUG = "cacna-2026-closing-appreciation";

export function isArchivePost(p: Pick<BlogPost, "dateIso">): boolean {
  return p.dateIso < ARCHIVE_BEFORE;
}

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
