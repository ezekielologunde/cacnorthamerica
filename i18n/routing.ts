import { defineRouting } from "next-intl/routing";

// Single-locale routing: English only, no visible URL prefix. Yoruba was
// retired (2026-09) after most /yo pages turned out to be untranslated
// near-duplicates of their English counterparts, which Google Search
// Console was flagging as duplicate content with a canonical mismatch.
export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
