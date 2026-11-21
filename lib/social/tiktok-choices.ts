// The per-post choices TikTok requires the poster to make, and the checks on
// them. TikTok's Content Sharing Guidelines for Direct Post
// (https://developers.tiktok.com/doc/content-sharing-guidelines, "Required UX
// Implementation in Your App") require, for every post:
//
//   1a. the creator's nickname shown, and 1. creator info fetched fresh
//       whenever the posting page is rendered;
//   2b. "Users must manually select the privacy status from a dropdown and
//       there should be no default value", with the options taken from
//       creator_info's privacy_level_options;
//   2c. Comment, Duet and Stitch: "none should be checked by default", and
//       greyed out when the creator has turned that interaction off;
//   3a. a commercial content disclosure toggle, off by default; when on, at
//       least one of "Your brand" / "Branded content" must be ticked;
//   3b. branded content "can only be configured with visibility as
//       public/friends" (we use the guidelines' Option A: refuse it with
//       private visibility rather than change the visibility);
//   2 NOTE and 4. the declaration "By posting, you agree to TikTok's Music
//       Usage Confirmation" (plus the Branded Content Policy when branded
//       content is ticked) before the publish button; 5c. nothing is sent
//       until the user has expressly consented.
//
// The admin makes these choices on the upload form; they are stored on the
// post and sent exactly as chosen (post_info in
// https://developers.tiktok.com/doc/content-posting-api-reference-direct-post:
// privacy_level, disable_comment, disable_duet, disable_stitch,
// brand_organic_toggle, brand_content_toggle). A missing or malformed choice
// is refused, never filled in. Pure module (node --test loads it directly).

export const TIKTOK_PRIVACY_LEVELS = [
  "PUBLIC_TO_EVERYONE",
  "MUTUAL_FOLLOW_FRIENDS",
  "FOLLOWER_OF_CREATOR",
  "SELF_ONLY",
] as const;
export type TikTokPrivacyLevel = (typeof TIKTOK_PRIVACY_LEVELS)[number];

export const TIKTOK_PRIVACY_LABELS: Record<TikTokPrivacyLevel, string> = {
  PUBLIC_TO_EVERYONE: "Everyone",
  MUTUAL_FOLLOW_FRIENDS: "Friends (followers you follow back)",
  FOLLOWER_OF_CREATOR: "Followers",
  SELF_ONLY: "Only me (private)",
};

/** What the admin chose for one post. */
export type TikTokChoices = {
  privacyLevel: TikTokPrivacyLevel;
  allowComment: boolean;
  allowDuet: boolean;
  allowStitch: boolean;
  /** Commercial content disclosure: null when switched off; when on, at
   *  least one of the two is true. */
  commercial: { yourBrand: boolean; brandedContent: boolean } | null;
  /** The admin ticked the declaration (Music Usage Confirmation, and the
   *  Branded Content Policy when branded content is ticked). */
  consent: true;
};

/** What creator_info/query reported for the connected account. */
export type TikTokCreatorInfo = {
  nickname: string;
  privacyOptions: TikTokPrivacyLevel[];
  commentDisabled: boolean;
  duetDisabled: boolean;
  stitchDisabled: boolean;
  maxDurationSec: number | null;
};

export const MUSIC_USAGE_URL = "https://www.tiktok.com/legal/page/global/music-usage-confirmation/en";
export const BRANDED_CONTENT_POLICY_URL = "https://www.tiktok.com/legal/page/global/bc-policy/en";

const isPrivacy = (v: unknown): v is TikTokPrivacyLevel =>
  typeof v === "string" && (TIKTOK_PRIVACY_LEVELS as readonly string[]).includes(v);

/** Checks untrusted input (from the browser, or read back from the database)
 *  and returns the choices, or the code of the first problem. Every field is
 *  required: nothing is defaulted. */
export function parseTikTokChoices(input: unknown): { ok: true; choices: TikTokChoices } | { ok: false; code: string } {
  if (!input || typeof input !== "object") return { ok: false, code: "tiktok_choices_missing" };
  const v = input as Record<string, unknown>;
  if (!isPrivacy(v.privacyLevel)) return { ok: false, code: "tiktok_privacy_not_chosen" };
  const privacyLevel = v.privacyLevel;
  const { allowComment, allowDuet, allowStitch } = v;
  if (typeof allowComment !== "boolean" || typeof allowDuet !== "boolean" || typeof allowStitch !== "boolean") {
    return { ok: false, code: "tiktok_choices_missing" };
  }
  let commercial: TikTokChoices["commercial"];
  if (v.commercial === null) {
    commercial = null;
  } else {
    const c = v.commercial as Record<string, unknown> | undefined;
    if (!c || typeof c !== "object" || typeof c.yourBrand !== "boolean" || typeof c.brandedContent !== "boolean") {
      return { ok: false, code: "tiktok_choices_missing" };
    }
    if (!c.yourBrand && !c.brandedContent) return { ok: false, code: "tiktok_commercial_not_chosen" };
    commercial = { yourBrand: c.yourBrand, brandedContent: c.brandedContent };
  }
  if (commercial?.brandedContent && privacyLevel === "SELF_ONLY") {
    return { ok: false, code: "tiktok_branded_content_private" };
  }
  if (v.consent !== true) return { ok: false, code: "tiktok_consent_missing" };
  return { ok: true, choices: { privacyLevel, allowComment, allowDuet, allowStitch, commercial, consent: true } };
}

/** The privacy levels the form may offer: creator_info's options, and only
 *  SELF_ONLY until TikTok has audited the app ("All content posted by
 *  unaudited clients will be restricted to private viewing mode"). */
export function offeredPrivacy(info: Pick<TikTokCreatorInfo, "privacyOptions">, audited: boolean): TikTokPrivacyLevel[] {
  return info.privacyOptions.filter((p) => audited || p === "SELF_ONLY");
}

/** Why TikTok would refuse these choices for this account right now, or
 *  null. Checked at publish time against fresh creator info. */
export function choicesRefusedBy(choices: TikTokChoices, info: TikTokCreatorInfo, audited: boolean): string | null {
  if (!offeredPrivacy(info, audited).includes(choices.privacyLevel)) {
    return !audited && info.privacyOptions.includes(choices.privacyLevel)
      ? "tiktok_unaudited_private_only"
      : "tiktok_privacy_level_unavailable";
  }
  if ((choices.allowComment && info.commentDisabled) || (choices.allowDuet && info.duetDisabled) ||
    (choices.allowStitch && info.stitchDisabled)) {
    return "tiktok_interaction_unavailable";
  }
  return null;
}

/** post_info fields for video/init, exactly as chosen. */
export function postInfoFields(choices: TikTokChoices) {
  return {
    privacy_level: choices.privacyLevel,
    disable_comment: !choices.allowComment,
    disable_duet: !choices.allowDuet,
    disable_stitch: !choices.allowStitch,
    brand_content_toggle: choices.commercial?.brandedContent ?? false,
    brand_organic_toggle: choices.commercial?.yourBrand ?? false,
  };
}

/** What the upload form needs to render its TikTok section. `standIn`: a dry
 *  run with no TikTok connection, so the options are the unaudited default
 *  rather than the account's. `unavailable`: creator info couldn't be read
 *  (the code says why); the form then can't offer TikTok and it is skipped. */
export type TikTokComposer =
  | ({ state: "ready"; standIn: boolean } & TikTokCreatorInfo)
  | { state: "unavailable"; code: string };
