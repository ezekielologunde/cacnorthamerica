export interface SearchItem {
  title: string;
  desc: string;
  href: string;
  tag: "Page" | "Blog" | "Event" | "Store";
  keywords?: string;
}

export const SEARCH_INDEX: SearchItem[] = [
  // Core pages
  { title: "Home", desc: "Welcome to CAC Salvation Center — a spirit-filled church in Randallstown, MD", href: "/", tag: "Page", keywords: "home welcome church cac salvation center" },
  { title: "Who We Are", desc: "Our mission, vision, history, and 13 tenets of faith", href: "/about", tag: "Page", keywords: "about mission vision history apostolic faith tenets belief" },
  { title: "Leadership", desc: "Meet our five pastors and church leadership team", href: "/leadership", tag: "Page", keywords: "pastors elders leadership team pastor ilufoye oladele agbeja" },
  { title: "Ilorin HQ", desc: "Our parent assembly in Ilorin, Nigeria — the fountainhead of the church", href: "/ilorin", tag: "Page", keywords: "nigeria ilorin headquarters parent assembly africa origin history" },
  { title: "Ministries", desc: "Men, Women, Youth, Children, Choir, Ushering and more", href: "/ministries", tag: "Page", keywords: "ministry men women youth children choir ushering evangelism department" },
  { title: "Testimonies", desc: "Stories of healing, salvation, and God's faithfulness", href: "/testimonies", tag: "Page", keywords: "testimonies healing miracles stories faith answered prayer" },
  { title: "Gallery", desc: "Photos from church services, events, and fellowship", href: "/gallery", tag: "Page", keywords: "photos gallery pictures events fellowship moments" },
  // Grow
  { title: "Watch Online", desc: "Live and on-demand services — YouTube, Facebook, Zoom", href: "/online", tag: "Page", keywords: "watch live stream youtube facebook zoom podcast sermon online service" },
  { title: "Salvation City", desc: "Our Rosedale, MD assembly — Salvation City campus", href: "/salvationcity", tag: "Page", keywords: "rosedale salvation city campus maryland assembly branch" },
  { title: "Devotional", desc: "Daily Word, podcast, and spiritual reflections", href: "/devotional", tag: "Page", keywords: "devotional daily word podcast reflection morning bible" },
  { title: "Bible Reading Plan", desc: "Hope for Today — structured weekly Bible readings", href: "/bible-plan", tag: "Page", keywords: "bible reading plan hope today scripture weekly study" },
  { title: "Prayer", desc: "Submit a prayer request. Daily 5 AM prayer line: (857) 216-6700", href: "/prayer", tag: "Page", keywords: "prayer request intercession prayer line 5am urgent personal" },
  { title: "Salvation", desc: "Accept Jesus Christ as Lord and Saviour today", href: "/salvation", tag: "Page", keywords: "salvation born again accept christ jesus gospel sinner forgiveness eternal life" },
  // Visit
  { title: "Visit Us", desc: "Sundays 10:30 AM · 10710 Marriottsville Rd, Randallstown MD", href: "/visit", tag: "Page", keywords: "visit directions sunday service address location randallstown maryland marriottsville" },
  { title: "Venue Hire", desc: "Book our hall & parking for weddings, programs, and events", href: "/venue", tag: "Page", keywords: "venue hire rental hall parking book event wedding program space" },
  // Events & Calendar
  { title: "Calendar", desc: "Weekly, monthly, and annual church calendar", href: "/calendar", tag: "Page", keywords: "calendar schedule services rhythm annual monthly weekly" },
  { title: "Events", desc: "Upcoming special events, gatherings, and anniversaries", href: "/events", tag: "Event", keywords: "events special gatherings anniversary upcoming" },
  { title: "Macedonia Outreach", desc: "Annual mission to forgotten rural ministers in hard-to-reach places — carrying the gospel where most cannot go", href: "/events/macedonia-outreach", tag: "Event", keywords: "macedonia outreach mission rural unreachable forgotten ministers evangelism remote nigeria" },
  { title: "Holy Land Pilgrimage 2026", desc: "Nov 2–12 — CACNA Latunde Region Pilgrimage to Israel & Egypt — $500 deposit", href: "/events/pilgrimage-2026", tag: "Event", keywords: "holy land pilgrimage 2026 israel egypt jfk cacna november travel ilufoye mustapha" },
  { title: "CACNA 2026", desc: "National convention July 13–18, Blue Ridge Summit PA", href: "/events/cacna-2026", tag: "Event", keywords: "cacna 2026 national convention july blue ridge summit pennsylvania north america" },
  { title: "Good Women Anniversary", desc: "Annual celebration of womanhood in faith — June 28", href: "/events/good-women-anniversary", tag: "Event", keywords: "good women anniversary womanhood faith celebration june 28" },
  // Give
  { title: "Giving", desc: "Tithe & offering — Zelle, Tithe.ly, Givelify, in-person", href: "/giving", tag: "Page", keywords: "giving tithe offering donate zelle givelify tithely first fruits" },
  { title: "Building Project", desc: "A house for His Name — multi-million dollar building fund", href: "/building", tag: "Page", keywords: "building project fund capital campaign sanctuary house of god construction" },
  // Resources
  { title: "Blog & News", desc: "Salvation Herald — stories, devotionals, and church news", href: "/blog", tag: "Blog", keywords: "blog news salvation herald stories articles devotional reflections" },
  { title: "Store", desc: "Apparel, Bibles, worship music, and custom prints", href: "/store", tag: "Store", keywords: "store shop apparel hoodie shirt bible music print merchandise buy" },
  // Contact
  { title: "Contact", desc: "Get in touch with the pastoral team", href: "/contact", tag: "Page", keywords: "contact pastoral team phone email address reach out" },
  // Blog posts
  { title: "2026 Good Women Anniversary", desc: '"Who Are You?" — June 28, hosted by Baltimore DCC Good Women', href: "/blog/good-women-anniversary-2026", tag: "Blog", keywords: "good women anniversary 2026 who are you 1 kings solomon mother" },
  { title: "The God Who Builds the House", desc: "On Psalm 127, the Building Project, and every nail driven in trust", href: "/blog/god-builds-the-house", tag: "Blog", keywords: "psalm 127 building project house god labor vain devotional" },
  { title: "CACNA 2026 — What to Expect", desc: "Six days of worship at CAC Village, Blue Ridge Summit, July 13–18", href: "/blog/cacna-2026-what-to-expect", tag: "Blog", keywords: "cacna 2026 convention blue ridge village july pack prepare" },
  { title: "What It Means to Be Ambassadors", desc: "2 Corinthians 5:20 and the daily call on every believer", href: "/blog/what-it-means-to-be-ambassadors", tag: "Blog", keywords: "ambassadors 2 corinthians 5 20 representatives christ commission" },
];
