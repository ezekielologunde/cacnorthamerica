/** Yoruba words and phrases shown on the (English-only) site.
 *
 *  The site is single-locale English; Yoruba appears only as short inline
 *  phrases, each rendered inside an element with lang="yo" so screen readers
 *  switch voice and the browser applies Yoruba text shaping.
 *
 *  Keep this list to common, standard phrases. Do not add a translation that
 *  a native speaker has not confirmed. Every string must stay in Unicode NFC
 *  with tone marks written out (lib/yoruba.test.mjs enforces this), so the
 *  site fonts render the marks instead of falling back to a system font. */

export interface YorubaPhrase {
  yo: string;
  en: string;
}

/** The greeting used on the home page welcome. */
export const YORUBA_WELCOME = "Ẹ káàbọ̀";

/** Words a first-time visitor is likely to hear at a CAC gathering. */
export const YORUBA_PHRASES: YorubaPhrase[] = [
  { yo: YORUBA_WELCOME, en: "Welcome" },
  { yo: "Ẹ kú àárọ̀", en: "Good morning" },
  { yo: "Ẹ kú alẹ́", en: "Good evening" },
  { yo: "Ẹ ṣé", en: "Thank you" },
  { yo: "Ẹ jọ̀ọ́", en: "Please" },
  { yo: "Àmín", en: "Amen" },
  { yo: "Àdúrà", en: "Prayer" },
  { yo: "Olúwa", en: "Lord" },
  { yo: "Ọlọ́run", en: "God" },
  { yo: "Ògo ni fún Ọlọ́run", en: "Glory be to God" },
];
