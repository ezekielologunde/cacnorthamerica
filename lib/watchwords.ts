/** CACNA's annual Watchword/theme, current year and confirmed past years.
 *  Only years with a verified real theme are listed — no placeholder or
 *  guessed years. Full bilingual verse text is only included where it was
 *  actually confirmed (so far, just 2026); earlier years show the theme
 *  and, where known, its verse reference. */
export interface WatchwordYear {
  year: number;
  theme: string;
  verseRef?: string;
  verseText?: string;
  verseTextYoruba?: string;
  /** Where to read more, if a real page exists for it. */
  href?: string;
}

export const CURRENT_WATCHWORD: WatchwordYear = {
  year: 2026,
  theme: "The Bible: God’s Message to Man",
  verseRef: "Psalm 119:18",
  verseText: "Open my eyes, that I may see wondrous things from Your law.",
  verseTextYoruba: "Là mí li ojú, kí èmi kí ó lè máa wò ohun ìyanu wọ̀nnì láti inú òfin rẹ.",
  href: "/blog/cacna-2026-chairmans-address",
};

/** Confirmed past years — sourced from real convention material, not
 *  reconstructed. Sorted newest first. */
export const PAST_WATCHWORDS: WatchwordYear[] = [
  {
    year: 2025,
    theme: "Balancing the Call",
    href: "/blog/balancing-the-call-burnout",
  },
  {
    year: 2023,
    theme: "Proving Our Growth Through Sound Doctrine",
    verseRef: "2 Timothy 2:15",
  },
];
