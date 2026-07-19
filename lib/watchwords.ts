/** CACNA's annual Watchword — a scripture verse recited each year, distinct
 *  from that year's Convention theme (a separate concept; e.g. 2026's
 *  Convention theme is "The Bible: God's Message to Man" while its Watchword
 *  is Psalm 119:18). This full 1989–2024 list is transcribed verbatim from
 *  the CAC Christian Education Department's own "Watchword to Date" program
 *  page (CACNA Annual Convention 2024) — do not alter the wording or add
 *  years beyond what that source and the current year confirm. */
export interface WatchwordYear {
  year: number;
  verseRef: string;
  verseText: string;
  verseTextYoruba?: string;
  /** Where to read more, if a real page exists for it. */
  href?: string;
}

export const CURRENT_WATCHWORD: WatchwordYear = {
  year: 2026,
  verseRef: "Psalm 119:18",
  verseText: "Open my eyes, that I may see wondrous things from Your law.",
  verseTextYoruba: "Là mí li ojú, kí èmi kí ó lè máa wò ohun ìyanu wọ̀nnì láti inú òfin rẹ.",
  href: "/blog/cacna-2026-chairmans-address",
};

/** 2025 is deliberately absent — no Watchword for that year has been
 *  confirmed (only its Convention theme, "Balancing the Call," which is a
 *  different thing and isn't substituted here). Sorted newest first. */
export const PAST_WATCHWORDS: WatchwordYear[] = [
  { year: 2024, verseRef: "Psalm 119:116", verseText: "Uphold me according to Your word, that I may live; and do not let me be ashamed of my hope." },
  { year: 2023, verseRef: "Psalm 119:105", verseText: "Your word is a lamp to my feet and a light to my path." },
  { year: 2022, verseRef: "2 Chronicles 15:7", verseText: "But you, be strong and do not let your hands be weak, for your work shall be rewarded!" },
  { year: 2021, verseRef: "1 Kings 8:57", verseText: "May the Lord our God be with us, as He was with our fathers. May He not leave us nor forsake us." },
  { year: 2020, verseRef: "Isaiah 45:22", verseText: "Look to Me, and be saved, all you ends of the earth! For I am God, and there is no other." },
  { year: 2019, verseRef: "Romans 10:13", verseText: "Whoever calls on the name of the Lord shall be saved." },
  { year: 2018, verseRef: "Psalm 80:19", verseText: "Restore us, O LORD God of hosts; cause Your face to shine, and we shall be saved!" },
  { year: 2017, verseRef: "John 9:4", verseText: "I must work the works of Him who sent Me while it is day; the night is coming when no one can work." },
  { year: 2016, verseRef: "Mark 16:15", verseText: "And He said to them, \"Go into all the world and preach the gospel to every creature.\"" },
  { year: 2015, verseRef: "Psalm 118:17", verseText: "I shall not die, but live, and declare the works of the LORD." },
  { year: 2014, verseRef: "Psalm 85:8", verseText: "I will hear what God the LORD will speak, for He will speak peace to His people and to His saints; but let them not turn back to folly." },
  { year: 2013, verseRef: "Psalm 34:5", verseText: "They looked to Him and were radiant, and their faces were not ashamed." },
  { year: 2012, verseRef: "Nahum 1:7", verseText: "The LORD is good, a stronghold in the day of trouble; and He knows those who trust in Him." },
  { year: 2011, verseRef: "Psalm 62:1", verseText: "Truly my soul silently waits for God; from Him comes my salvation." },
  { year: 2010, verseRef: "Joshua 24:24", verseText: "And the people said to Joshua, \"The LORD our God we will serve, and His voice we will obey!\"" },
  { year: 2009, verseRef: "Genesis 28:15", verseText: "Behold, I am with you and will keep you wherever you go, and will bring you back to this land; for I will not leave you until I have done what I have spoken to you." },
  { year: 2008, verseRef: "Psalm 121:1", verseText: "I will lift up my eyes to the hills — from whence comes my help?" },
  { year: 2007, verseRef: "Hebrews 12:14-15", verseText: "Pursue peace with all people, and holiness, without which no one will see the Lord." },
  { year: 2006, verseRef: "2 Corinthians 6:17", verseText: "Therefore, come out from among them, and be separate, says the Lord. Do not touch what is unclean, and I will receive you." },
  { year: 2005, verseRef: "John 13:35", verseText: "By this all will know that you are My disciples, if you have love for one another." },
  { year: 2004, verseRef: "Proverbs 3:26", verseText: "For the LORD will be your confidence, and will keep your foot from being caught." },
  { year: 2003, verseRef: "Deuteronomy 31:8", verseText: "And the LORD, He is the One who goes before you. He will be with you, He will not leave you nor forsake you; do not fear nor be dismayed." },
  { year: 2002, verseRef: "Psalm 18:2", verseText: "The LORD is my rock and my fortress and my deliverer; my God, my strength, in whom I will trust; my shield and the horn of my salvation, my stronghold." },
  { year: 2001, verseRef: "John 8:29", verseText: "And He who sent Me is with Me. The Father has not left Me alone, for I always do those things that please Him." },
  { year: 2000, verseRef: "Psalm 16:8", verseText: "I have set the LORD always before me; because He is at my right hand I shall not be moved." },
  { year: 1999, verseRef: "Psalm 145:1", verseText: "Hear my prayer, O LORD, give ear to my supplications! In Your faithfulness answer me, and in Your righteousness." },
  { year: 1998, verseRef: "Psalm 80:19", verseText: "Restore us, O LORD God of hosts; cause Your face to shine, and we shall be saved!" },
  { year: 1997, verseRef: "Isaiah 40:2", verseText: "Speak ye comfortably to Jerusalem, and cry unto her, that her warfare is accomplished, that her iniquity is pardoned: for she hath received of the LORD's hand double for all her sins." },
  { year: 1996, verseRef: "Isaiah 60:20", verseText: "Thy sun shall no more go down; neither shall thy moon withdraw itself: for the LORD shall be thine everlasting light, and the days of thy mourning shall be ended." },
  { year: 1995, verseRef: "Lamentations 5:21", verseText: "Turn thou us unto thee, O LORD, and we shall be turned; renew our days as of old." },
  { year: 1994, verseRef: "Psalm 118:25", verseText: "Save now, I beseech thee, O LORD: O LORD, I beseech thee, send now prosperity." },
  { year: 1993, verseRef: "Nahum 1:7", verseText: "The LORD is good, a stronghold in the day of trouble; and he knoweth them that trust in him." },
  { year: 1992, verseRef: "Psalm 119:126", verseText: "It is time for thee, LORD, to work: for they have made void thy law." },
  { year: 1991, verseRef: "Psalm 132:8", verseText: "Arise, O LORD, into thy rest; thou, and the ark of thy strength." },
  { year: 1990, verseRef: "Psalm 118:17", verseText: "I shall not die, but live, and declare the works of the LORD." },
  { year: 1989, verseRef: "Psalm 68:1", verseText: "Let God arise, let his enemies be scattered: let them also that hate him flee before him." },
];
