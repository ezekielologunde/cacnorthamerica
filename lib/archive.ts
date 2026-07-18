// Curated archive of real past CACNA (CAC North America / Latunde Region)
// YouTube livestreams, transcribed from the channel's actual upload history.
// No YOUTUBE_API_KEY is available, so individual video IDs can't be resolved
// programmatically — each entry links out to a channel-scoped search for its
// exact title instead of a guessed/fabricated direct video URL.
//
// Curation notes: stream-reconnect duplicate fragments (same session, several
// short VOD pieces) are deduped down to the single longest recording; blank or
// generic "is live!" placeholder clips and clips under ~2 minutes with no
// distinguishing title are omitted; a private family memorial/funeral tribute
// series is intentionally excluded as it is not general church content.

export type ArchiveCategory = "Convention" | "Good Women Marathon" | "CACMA" | "Ordination" | "Other";

export interface ArchiveEntry {
  title: string;
  duration: string;
  approxViews: string;
  year: number;
  category: ArchiveCategory;
}

export const YOUTUBE_CHANNEL_SEARCH_BASE = "https://www.youtube.com/@cacnorthamericalatunderegi1330/search";

export function archiveSearchUrl(title: string): string {
  return `${YOUTUBE_CHANNEL_SEARCH_BASE}?query=${encodeURIComponent(title)}`;
}

export const archiveCategories: ArchiveCategory[] = ["Convention", "Good Women Marathon", "CACMA", "Ordination", "Other"];

export const archiveEntries: ArchiveEntry[] = [
  // ── 2026 ─────────────────────────────────────────────────────────────────
  { title: "CACNA 2026 Convention — Revival Night (Day 5)", duration: "1:18:10", approxViews: "499 views", year: 2026, category: "Convention" },
  { title: "CACNA 2026 Convention — The Bible, God's Message to Man (Day 5) Afternoon Session", duration: "42:31", approxViews: "493 views", year: 2026, category: "Convention" },
  { title: "CACNA 2026 Convention — The Bible, God's Message to Man (Day 5) Morning Session", duration: "2:29:30", approxViews: "885 views", year: 2026, category: "Convention" },
  { title: "Praise Night Convention 2026 (Day 4)", duration: "1:28:06", approxViews: "1.9K views", year: 2026, category: "Convention" },
  { title: "Good Women Convention 2026 (Day 4)", duration: "1:53:17", approxViews: "510 views", year: 2026, category: "Convention" },
  { title: "CACNA 2026 Convention — Business Group General Session", duration: "1:14:43", approxViews: "295 views", year: 2026, category: "Convention" },
  { title: "CACNA 2026 Convention — Sunday School General Session (Day 4) Morning Session", duration: "1:37:16", approxViews: "702 views", year: 2026, category: "Convention" },
  { title: "CAC North America Annual Convention 2026 — Day 3 Evening Program", duration: "2:53:46", approxViews: "586 views", year: 2026, category: "Convention" },
  { title: "Good Women Conference Convention 2026 Part 3", duration: "1:42:01", approxViews: "379 views", year: 2026, category: "Convention" },
  { title: "Good Women Conference Convention 2026", duration: "1:14:29", approxViews: "776 views", year: 2026, category: "Convention" },
  { title: "CACNA 2026 Convention — The Bible, God's Message to Man (Day 3) Morning Session", duration: "2:14:36", approxViews: "938 views", year: 2026, category: "Convention" },
  { title: "CACNA 2026 Convention — The Bible, God's Message to Man (Day 2) Evening Session", duration: "3:49:45", approxViews: "1.3K views", year: 2026, category: "Convention" },
  { title: "CACNA 2026 Convention — The Bible, God's Message to Man (Day 2)", duration: "3:25:40", approxViews: "672 views", year: 2026, category: "Convention" },
  { title: "Latunde Region Good Women 14th Annual Marathon Fasting & Prayers — Day 7", duration: "4:28:15", approxViews: "238 views", year: 2026, category: "Good Women Marathon" },
  { title: "Latunde Region Good Women 14th Annual Marathon Fasting & Prayers — Day 6", duration: "2:49:19", approxViews: "124 views", year: 2026, category: "Good Women Marathon" },
  { title: "Latunde Region Good Women 14th Annual Marathon Fasting & Prayers — Day 5", duration: "4:31:04", approxViews: "78 views", year: 2026, category: "Good Women Marathon" },
  { title: "Latunde Region Good Women 14th Annual Marathon Fasting & Prayers — Day 4", duration: "3:00:26", approxViews: "125 views", year: 2026, category: "Good Women Marathon" },
  { title: "Latunde Region Good Women 14th Annual Marathon Fasting & Prayers — Day 3", duration: "2:39:52", approxViews: "62 views", year: 2026, category: "Good Women Marathon" },
  { title: "Latunde Region Good Women 14th Annual Marathon Fasting & Prayers — Day 2", duration: "3:46:30", approxViews: "117 views", year: 2026, category: "Good Women Marathon" },
  { title: "Latunde Region Good Women 14th Annual Marathon Fasting & Prayers — Day 1", duration: "3:42:37", approxViews: "147 views", year: 2026, category: "Good Women Marathon" },

  // ── 2025 ─────────────────────────────────────────────────────────────────
  { title: "CAC North America Annual Convention 2025 — Day 5 Holy Communion", duration: "2:54:13", approxViews: "757 views", year: 2025, category: "Convention" },
  { title: "CAC North America Annual Convention 2025 — Graduation Program", duration: "3:10:51", approxViews: "1.1K views", year: 2025, category: "Convention" },
  { title: "CAC North America Annual Convention 2025 — Day 5 Morning Session", duration: "3:49:40", approxViews: "1K views", year: 2025, category: "Convention" },
  { title: "CAC North America Annual Convention 2025 — Day 4 Evening 2", duration: "3:11:07", approxViews: "1.1K views", year: 2025, category: "Convention" },
  { title: "CAC North America Annual Convention 2025 — Day 4 Evening", duration: "58:13", approxViews: "396 views", year: 2025, category: "Convention" },
  { title: "CAC North America (Latunde Region) — CACMA Session 1 Part 1", duration: "1:13:41", approxViews: "337 views", year: 2025, category: "CACMA" },
  { title: "CAC North America (Latunde Region) — Session 1 Part 2", duration: "36:10", approxViews: "188 views", year: 2025, category: "CACMA" },
  { title: "CAC North America Annual Convention 2025 — Day 3 (Revival Night)", duration: "1:19:27", approxViews: "256 views", year: 2025, category: "Convention" },
  { title: "CAC North America Annual Convention 2025 — Day 3 (Evening Session)", duration: "1:34:30", approxViews: "609 views", year: 2025, category: "Convention" },
  { title: "CAC North America Annual Convention 2025", duration: "2:05:44", approxViews: "594 views", year: 2025, category: "Convention" },
  { title: "Ministering: Pastor Samuel O. Oladele (Minister's Session 4)", duration: "2:48:13", approxViews: "1.2K views", year: 2025, category: "Other" },
  { title: "CACNA Convention 2025: Revival Night Day 1", duration: "1:26:41", approxViews: "488 views", year: 2025, category: "Convention" },
  { title: "CACNA Convention 2025: Interventional Leader & Legacy (Session 3)", duration: "1:39:12", approxViews: "399 views", year: 2025, category: "Other" },
  { title: "CACNA Convention 2025: Christlike Legacy in Leadership (Session 2)", duration: "1:56:22", approxViews: "1.1K views", year: 2025, category: "Other" },
  { title: "CACNA Convention 2025: Watch Your Character & Teaching (Session 1)", duration: "59:01", approxViews: "512 views", year: 2025, category: "Other" },
  { title: "CACNA Convention 2025: Interventional Leader & Legacy (Session 1)", duration: "1:04:25", approxViews: "1.1K views", year: 2025, category: "Other" },
  { title: "Latunde Region Good Women 13th Annual Marathon Fasting & Prayers — Day 7", duration: "3:53:22", approxViews: "88 views", year: 2025, category: "Good Women Marathon" },
  { title: "Latunde Region Good Women 13th Annual Marathon Fasting & Prayers — Day 6", duration: "2:28:13", approxViews: "49 views", year: 2025, category: "Good Women Marathon" },

  // ── 2024 ─────────────────────────────────────────────────────────────────
  { title: "CAC North America Convention 2024: Holy Communion Service (Day 5)", duration: "54:45", approxViews: "514 views", year: 2024, category: "Convention" },
  { title: "CAC North America Convention 2024: Convention Program (Day 5)", duration: "2:12:52", approxViews: "1.5K views", year: 2024, category: "Convention" },
  { title: "CAC North America Convention 2024: Sunday School General Session (Morning Day 4)", duration: "2:32:35", approxViews: "1.2K views", year: 2024, category: "Convention" },
  { title: "CAC North America Convention 2024: Revival Night Service (Day 3)", duration: "2:08:41", approxViews: "937 views", year: 2024, category: "Convention" },
  { title: "CAC North America Convention 2024: Minister's Session 4 (Day 3)", duration: "1:51:44", approxViews: "1.6K views", year: 2024, category: "Other" },
  { title: "CAC North America Convention 2024: Revival Night Day 2", duration: "1:09:12", approxViews: "394 views", year: 2024, category: "Convention" },
  { title: "CAC North America Convention 2024: Spiritual Power and Gifts for the Body of Christ", duration: "3:23:18", approxViews: "1.1K views", year: 2024, category: "Other" },
  { title: "CAC North America (Latunde Region): Night Vigil Part 2", duration: "3:42:48", approxViews: "366 views", year: 2024, category: "Other" },
  { title: "CAC North America (Latunde Region): God of Our Fathers Night Vigil", duration: "57:22", approxViews: "563 views", year: 2024, category: "Other" },
  { title: "CAC North America (Latunde Region): God of Our Fathers", duration: "3:15:40", approxViews: "373 views", year: 2024, category: "Other" },
  { title: "CAC North America (Latunde Region): God of Our Fathers (Day 2)", duration: "3:52:26", approxViews: "860 views", year: 2024, category: "Other" },
  { title: "CAC North America (Latunde Region): God of Our Fathers (Day 1)", duration: "2:34:18", approxViews: "1K views", year: 2024, category: "Other" },

  // ── 2023 ─────────────────────────────────────────────────────────────────
  { title: "CAC North America Convention 2023 — Impartation Night", duration: "4:18:36", approxViews: "1.1K views", year: 2023, category: "Convention" },
  { title: "CAC North America Convention 2023 — Day 5", duration: "2:46:02", approxViews: "1.1K views", year: 2023, category: "Convention" },
  { title: "CAC North America Convention 2023 — Day 4 Praise Night", duration: "2:00:15", approxViews: "1K views", year: 2023, category: "Convention" },
  { title: "CAC North America Convention 2023 — Day 4 Morning Session", duration: "5:13:43", approxViews: "1.5K views", year: 2023, category: "Convention" },
  { title: "CAC North America Convention 2023 — Day 3 Evening Session", duration: "2:14:46", approxViews: "883 views", year: 2023, category: "Convention" },
  { title: "CAC North America Convention 2023 — Day 3 Morning", duration: "2:10:21", approxViews: "2.1K views", year: 2023, category: "Convention" },
  { title: "CAC North America Convention 2023 — Day 2 Evening", duration: "1:49:33", approxViews: "946 views", year: 2023, category: "Convention" },
  { title: "CAC North America Convention 2023 — Day 2", duration: "1:48:20", approxViews: "251 views", year: 2023, category: "Convention" },

  // ── 2022 ─────────────────────────────────────────────────────────────────
  { title: "CAC North America (Latunde Region) 2022 Revival Service", duration: "1:54:50", approxViews: "1.1K views", year: 2022, category: "Other" },
  { title: "CAC North America (Latunde Region) 2022 Ordination Service", duration: "1:39:59", approxViews: "1.1K views", year: 2022, category: "Ordination" },
  { title: "CAC North America (Latunde Region) 2022 Day 5 Evening Session", duration: "2:09:32", approxViews: "1.3K views", year: 2022, category: "Convention" },
  { title: "CAC North America (Latunde Region) 2022 Day 5 Morning Session", duration: "1:59:28", approxViews: "739 views", year: 2022, category: "Convention" },
  { title: "CAC North America (Latunde Region) 2022 Day 4 Evening Session", duration: "2:33:43", approxViews: "1.3K views", year: 2022, category: "Convention" },
  { title: "CAC North America (Latunde Region) 2022 Day 4 Morning Session", duration: "3:24:22", approxViews: "610 views", year: 2022, category: "Convention" },
  { title: "CAC North America (Latunde Region) 2022 Day 3 Revival Session", duration: "16:15", approxViews: "164 views", year: 2022, category: "Convention" },
  { title: "CAC North America (Latunde Region) 2022 Day 3 Business Group Fellowship Session", duration: "2:31:50", approxViews: "568 views", year: 2022, category: "Convention" },
  { title: "CAC North America (Latunde Region) 2022 Day 3 Morning Session", duration: "2:24:10", approxViews: "932 views", year: 2022, category: "Convention" },
  { title: "CAC North America (Latunde Region) 2022 Day 2 (Revival Session)", duration: "1:21:07", approxViews: "676 views", year: 2022, category: "Convention" },
  { title: "CAC North America (Latunde Region) 2022 Day 2", duration: "1:07:57", approxViews: "372 views", year: 2022, category: "Convention" },
];

export interface ArchiveYearGroup {
  year: number;
  entries: ArchiveEntry[];
}

export function groupArchiveByYear(entries: ArchiveEntry[]): ArchiveYearGroup[] {
  const years = Array.from(new Set(entries.map((e) => e.year))).sort((a, b) => b - a);
  return years.map((year) => ({ year, entries: entries.filter((e) => e.year === year) }));
}
