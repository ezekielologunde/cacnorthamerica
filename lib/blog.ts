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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    categoryColor: "#FDC841",
    accent: "linear-gradient(135deg,#FDC841,#2D42C9)",
    readTime: "4 min read",
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
    categoryColor: "#2D42C9",
    accent: "linear-gradient(135deg,#2D42C9,#12141E)",
    readTime: "5 min read",
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
    categoryColor: "#7A1128",
    accent: "linear-gradient(135deg,#7A1128,#C81E3A)",
    readTime: "5 min read",
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
    categoryColor: "#EB6342",
    accent: "linear-gradient(135deg,#EB6342,#7A1128)",
    readTime: "5 min read",
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
    categoryColor: "#FDC841",
    accent: "linear-gradient(135deg,#FDC841,#EB6342)",
    readTime: "4 min read",
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
    categoryColor: "#2D42C9",
    accent: "linear-gradient(135deg,#2D42C9,#FDC841)",
    readTime: "3 min read",
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
    categoryColor: "#EB6342",
    accent: "linear-gradient(135deg,#EB6342,#12141E)",
    readTime: "4 min read",
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
    categoryColor: "#7A1128",
    accent: "linear-gradient(135deg,#7A1128,#2D42C9)",
    readTime: "4 min read",
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
    categoryColor: "#2D42C9",
    accent: "linear-gradient(135deg,#2D42C9,#7A1128)",
    readTime: "4 min read",
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
    categoryColor: "#7A1128",
    accent: "linear-gradient(135deg,#7A1128,#EB6342)",
    readTime: "5 min read",
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
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
