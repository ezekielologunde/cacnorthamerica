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
  {
    slug: "cacna-2026-presidents-message",
    title: "Highlights from the President's Message — CACNA 2026",
    excerpt:
      "Pastor Samuel Olusegun Oladele, President of Christ Apostolic Church, Nigeria and Overseas, addressed this year's CACNA Annual Retreat at CAC Village. Here are the highlights.",
    date: "July 15, 2026",
    dateIso: "2026-07-15",
    category: "Ministry Update",
    categoryColor: "#2D42C9",
    accent: "linear-gradient(135deg,#2D42C9,#12141E)",
    readTime: "6 min read",
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
    categoryColor: "#EB6342",
    accent: "linear-gradient(135deg,#EB6342,#7A1128)",
    readTime: "5 min read",
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
    categoryColor: "#FDC841",
    accent: "linear-gradient(135deg,#FDC841,#7A1128)",
    readTime: "5 min read",
    body: [
      "Pastor David Olusegun Adenodi, Ph.D., Chairman of the CACNA Convention & Conference Planning Committee, delivered the Convention Chairman's Welcome Address at this year's gathering, welcoming President Pastor S.O. Oladele, General Superintendent Pastor E.O. Odejobi, General Evangelist Prophet Hezekiah Oladeji, Regional Superintendent Pastor Dr. T.O. Agbeja, and the entire Christ Apostolic Church North and South America (Latunde Region) family, reaffirming this year's theme, **\"The Bible: God's Message to Man\"** (2 Timothy 3:16-17, Hebrews 4:12, Psalm 119:105).",
      "\"The Bible remains God's infallible, inspired, and eternal message to humanity,\" he said. \"In a generation characterized by confusion, moral decline, false teachings, and spiritual distractions, God is calling His people back to His Word.\" His prayer for the convention was simple: that every participant would experience a fresh encounter with the God of the Bible, and be corrected, instructed, and equipped through it for effective Christian living and service.",
      "The address carried a personal milestone: **this convention marks the completion of Pastor Adenodi's tenure as Chairman of Conventions and Conferences**, a role he has held since the year 2000 — 26 years of service. \"My heart is filled with thanksgiving,\" he said, thanking former Coordinator Pastor Joshua Olabode Owoeye, Ph.D. (Emeritus) and Regional Superintendent Pastor Timothy Omolayo Agbeja, Ph.D. for the privilege of serving in this capacity since 2000.",
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
    categoryColor: "#2D42C9",
    accent: "linear-gradient(135deg,#2D42C9,#7A1128)",
    readTime: "6 min read",
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
    categoryColor: "#EB6342",
    accent: "linear-gradient(135deg,#EB6342,#12141E)",
    readTime: "6 min read",
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
    categoryColor: "#2D42C9",
    accent: "linear-gradient(135deg,#2D42C9,#FDC841)",
    readTime: "6 min read",
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
    categoryColor: "#2D42C9",
    accent: "linear-gradient(135deg,#2D42C9,#FDC841)",
    readTime: "3 min read",
    body: [
      "\"Calvary greetings in the name of our Lord and Savior Jesus,\" Pastor David Olusegun Adenodi, Ph.D., Chairman of the CACNA Convention & Conference Planning Committee, wrote as the 2026 convention drew to a close. \"As we conclude this spiritually enriching convention themed 'The Bible: God's Message to Man,' I stand before you with a heart full of gratitude.\"",
      "On behalf of the Convention Committee, he extended thanks to CACNA's leaders and to the convention's distinguished speakers and ministers, \"for delivering messages that have challenged and uplifted us. Your insights have equipped us to lead with wisdom and humility.\"",
      "He also thanked the organizing committee, volunteers, and support staff whose work kept the week running smoothly. \"Your behind-the-scenes efforts have not gone unnoticed,\" he said, and to every attendee: \"thank you for your active participation and enthusiasm. Your presence has made this convention a truly communal and transformative experience.\"",
      "\"As we depart, let us carry forward the lessons learned and continue to build on the foundation laid during this convention,\" he closed. \"May we all strive to exemplify the leadership qualities that glorify God and serve our communities. Thank you, and may God bless you all abundantly.\"",
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
