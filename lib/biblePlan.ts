export interface BibleReadingWeek {
  week: number;
  theme: string;
  sun: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
}

export const FRIDAY_REFLECTION =
  "Set aside time this Friday to reflect on how God's Word has spoken to you this week.";

/** Hope for Today — the weeks the Salvation Center has released so far.
 *  More weeks are added as they come in from the pulpit. */
export const bibleReadingPlan: BibleReadingWeek[] = [
  {
    week: 21,
    theme: "2 Samuel → Romans 1–4",
    sun: "2 Samuel 13–14; Acts 28",
    mon: "2 Samuel 15–17; Psalms 3, 63; Romans 1",
    tue: "2 Samuel 18–20; Psalm 34; Romans 2",
    wed: "2 Samuel 21–23; Psalm 18; Romans 3",
    thu: "2 Samuel 24; 1 Chronicles 21; Romans 4",
  },
  {
    week: 22,
    theme: "1 Chronicles & 1 Kings → Romans 5–9",
    sun: "1 Chronicles 22–25; Psalm 78; Romans 5",
    mon: "1 Kings 1; 1 Chronicles 26–28; Romans 6",
    tue: "1 Kings 2; 1 Chronicles 29; Romans 7",
    wed: "1 Kings 3; 2 Chronicles 1; Psalm 42; Romans 8",
    thu: "1 Kings 4; Proverbs 1–2; Psalm 43; Romans 9",
  },
  {
    week: 23,
    theme: "Proverbs 3–15 → Romans 10–14",
    sun: "Proverbs 3–5; Romans 10",
    mon: "Proverbs 6–7; Psalm 7; Romans 11",
    tue: "Proverbs 8–10; Psalm 144; Romans 12",
    wed: "Proverbs 11–13; Psalm 8; Romans 13",
    thu: "Proverbs 14–15; Romans 14",
  },
  {
    week: 24,
    theme: "Proverbs 16–28 → Romans 15–16, 1 Thess. 1–3",
    sun: "Proverbs 16–18; Romans 15",
    mon: "Proverbs 19–21; Psalm 40; Romans 16",
    tue: "Proverbs 22–23; Psalm 117; 1 Thessalonians 1",
    wed: "Proverbs 24–25; Psalm 41; 1 Thessalonians 2",
    thu: "Proverbs 26–28; 1 Thessalonians 3",
  },
  {
    week: 25,
    theme: "Proverbs 29–31 & Song of Solomon → 1 & 2 Thess.",
    sun: "Proverbs 29–31; 1 Thessalonians 4",
    mon: "Song of Solomon 1–3; Psalm 72; 1 Thessalonians 5",
    tue: "Song of Solomon 4–6; 2 Thessalonians 1",
    wed: "Song of Solomon 7–8; Psalm 127; 2 Thessalonians 2",
    thu: "1 Kings 5; 2 Chronicles 2; 2 Thessalonians 3",
  },
  {
    week: 26,
    theme: "One Fold, One Shepherd — John 10:16",
    sun: "1 Kings 6; 2 Chronicles 3; 1 Timothy 1",
    mon: "1 Kings 7; 2 Chronicles 4; Psalm 44; 1 Timothy 2",
    tue: "1 Kings 8; Psalm 30; 1 Timothy 3",
    wed: "2 Chronicles 5–7; Psalm 121; 1 Timothy 4",
    thu: "1 Kings 9; 2 Chronicles 8; 1 Timothy 5",
  },
  {
    week: 27,
    theme: "Ecclesiastes → 1 & 2 Timothy",
    sun: "1 Kings 10–11; 2 Chronicles 9; 1 Timothy 6",
    mon: "Ecclesiastes 1–3; Psalm 45; 2 Timothy 1",
    tue: "Ecclesiastes 4–6; Psalm 125; 2 Timothy 2",
    wed: "Ecclesiastes 7–9; Psalm 46; 2 Timothy 3",
    thu: "Ecclesiastes 10–12; 2 Timothy 4",
  },
];
