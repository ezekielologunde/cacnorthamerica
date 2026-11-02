// Every social link on the Youth page (app/(site)/[locale]/youth) lives here,
// so filling one in is a one-line edit. An empty string means "not provided
// yet": the page renders nothing for it (no dead buttons). The explicit
// `string` annotations keep TypeScript from narrowing "" to a literal, so the
// emptiness checks below stay valid once a real link is pasted in.

export type SocialPlatform = "instagram" | "tiktok" | "x" | "whatsapp";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
  /** Shown on the page, e.g. "@cacnayyam". */
  handle: string;
  /** Who runs the account, so visitors know what they are following. */
  owner: "youth" | "cacna";
};

/** Youth & Young Adult Ministry (YYAM). Instagram verified 2026-07-21. */
export const YOUTH_INSTAGRAM_URL: string = "https://instagram.com/cacnayyam";
export const YOUTH_TIKTOK_URL: string = "https://www.tiktok.com/@cacnayyam";
/** CACNA's main account (not youth-only). */
export const CACNA_X_URL: string = "https://x.com/christ_north";
// TODO(owner): paste the youth WhatsApp group invite link
// (https://chat.whatsapp.com/...). Until then no WhatsApp button renders.
export const YOUTH_WHATSAPP_URL: string = "";

/** Singles Ministry. TODO(owner): fill any of these in; until at least one is
 *  set the page shows "Singles Ministry: links coming soon". */
export const SINGLES_INSTAGRAM_URL: string = "";
export const SINGLES_TIKTOK_URL: string = "";
export const SINGLES_WHATSAPP_URL: string = "";

export const YOUTH_CONTACT_EMAIL = "cacnayyam@outlook.com";

/** Only links that are actually filled in with an https URL. */
export function filledLinks(links: SocialLink[]): SocialLink[] {
  return links.filter((l) => /^https:\/\/\S+$/.test(l.url.trim()));
}

export function youthSocialLinks(): SocialLink[] {
  return filledLinks([
    { platform: "instagram", url: YOUTH_INSTAGRAM_URL, handle: "@cacnayyam", owner: "youth" },
    { platform: "tiktok", url: YOUTH_TIKTOK_URL, handle: "@cacnayyam", owner: "youth" },
    { platform: "x", url: CACNA_X_URL, handle: "@christ_north", owner: "cacna" },
    { platform: "whatsapp", url: YOUTH_WHATSAPP_URL, handle: "Youth group chat", owner: "youth" },
  ]);
}

export function singlesSocialLinks(): SocialLink[] {
  return filledLinks([
    { platform: "instagram", url: SINGLES_INSTAGRAM_URL, handle: "Instagram", owner: "youth" },
    { platform: "tiktok", url: SINGLES_TIKTOK_URL, handle: "TikTok", owner: "youth" },
    { platform: "whatsapp", url: SINGLES_WHATSAPP_URL, handle: "WhatsApp", owner: "youth" },
  ]);
}
