"use client";

import { describeCode } from "@/lib/social/messages";
import {
  BRANDED_CONTENT_POLICY_URL,
  MUSIC_USAGE_URL,
  TIKTOK_PRIVACY_LABELS,
  type TikTokChoices,
  type TikTokComposer,
  type TikTokPrivacyLevel,
} from "@/lib/social/tiktok-choices";

// The TikTok part of the upload form. Every control follows TikTok's Content
// Sharing Guidelines for Direct Post
// (https://developers.tiktok.com/doc/content-sharing-guidelines; section
// numbers below), cited in full in lib/social/tiktok-choices.ts. Nothing is
// pre-chosen: the privacy dropdown starts empty, the interactions and the
// commercial disclosure start off, and the declaration must be ticked.

export type TikTokDraft = {
  privacyLevel: TikTokPrivacyLevel | "";
  allowComment: boolean;
  allowDuet: boolean;
  allowStitch: boolean;
  commercialOn: boolean;
  yourBrand: boolean;
  brandedContent: boolean;
  consent: boolean;
};

export const EMPTY_TIKTOK_DRAFT: TikTokDraft = {
  privacyLevel: "",
  allowComment: false,
  allowDuet: false,
  allowStitch: false,
  commercialOn: false,
  yourBrand: false,
  brandedContent: false,
  consent: false,
};

/** The draft as the choices the server checks (lib/social/tiktok-choices.ts
 *  parseTikTokChoices). Unmade choices stay unmade, so the server refuses
 *  them rather than guessing. */
export function draftToChoices(d: TikTokDraft): Record<keyof TikTokChoices, unknown> {
  return {
    privacyLevel: d.privacyLevel,
    allowComment: d.allowComment,
    allowDuet: d.allowDuet,
    allowStitch: d.allowStitch,
    commercial: d.commercialOn ? { yourBrand: d.yourBrand, brandedContent: d.brandedContent } : null,
    consent: d.consent,
  };
}

/** §3a: with the disclosure on and nothing ticked, posting is disabled. */
export function draftBlocksPosting(d: TikTokDraft): boolean {
  return d.commercialOn && !d.yourBrand && !d.brandedContent;
}

const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 };
const hint: React.CSSProperties = { fontSize: 12.5, color: "var(--ink-soft)", margin: "6px 0 0" };
const check: React.CSSProperties = { display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13.5, color: "var(--ink)", margin: "6px 0" };

export default function TikTokFields({
  composer,
  draft,
  onChange,
  disabled,
}: {
  composer: TikTokComposer;
  draft: TikTokDraft;
  onChange: (d: TikTokDraft) => void;
  disabled: boolean;
}) {
  const set = (patch: Partial<TikTokDraft>) => onChange({ ...draft, ...patch });

  if (composer.state === "unavailable") {
    return (
      <fieldset style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, padding: "12px 16px", margin: 0 }}>
        <legend style={{ fontSize: 13, fontWeight: 700, padding: "0 6px" }}>TikTok</legend>
        <p style={{ ...hint, margin: 0 }}>
          TikTok can&apos;t be offered right now: {describeCode(composer.code)} If you post now, this video skips TikTok.
        </p>
      </fieldset>
    );
  }

  const branded = draft.commercialOn && draft.brandedContent;
  const interaction = (key: "allowComment" | "allowDuet" | "allowStitch", name: string, off: boolean) => (
    <label style={{ ...check, opacity: off ? 0.5 : 1 }}>
      <input type="checkbox" checked={draft[key]} disabled={disabled || off}
        onChange={(e) => set({ [key]: e.target.checked })} style={{ marginTop: 3 }} />
      <span>Allow {name}{off ? " (turned off in the TikTok account's settings)" : ""}</span>
    </label>
  );

  return (
    <fieldset style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, padding: "12px 16px 14px", margin: 0, display: "grid", gap: 14 }}>
      <legend style={{ fontSize: 13, fontWeight: 700, padding: "0 6px" }}>TikTok</legend>

      {/* §1a: show whose account this posts to. */}
      <p style={{ ...hint, margin: 0 }}>
        {composer.standIn
          ? "Dry run: TikTok isn't connected, so these are stand-in options (Only me, as until TikTok audits the app)."
          : <>Posting to TikTok as <strong style={{ color: "var(--ink)" }}>{composer.nickname || "the connected account"}</strong>.</>}
        {composer.maxDurationSec !== null && ` Videos up to ${Math.floor(composer.maxDurationSec / 60)} min ${composer.maxDurationSec % 60} s.`}
      </p>

      {/* §2b: options from creator info, no default value. §3b: branded content can't be private. */}
      <div>
        <label htmlFor="tiktok-privacy" style={label}>Who can see this video</label>
        <select id="tiktok-privacy" required disabled={disabled} value={draft.privacyLevel}
          onChange={(e) => set({ privacyLevel: e.target.value as TikTokPrivacyLevel | "" })}
          style={{ padding: "9px 12px", border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: 8, fontSize: 14, fontFamily: "inherit", background: "white" }}>
          <option value="" disabled>Choose...</option>
          {composer.privacyOptions.map((p) => (
            <option key={p} value={p} disabled={p === "SELF_ONLY" && branded}
              title={p === "SELF_ONLY" && branded ? "Branded content visibility cannot be set to private." : undefined}>
              {TIKTOK_PRIVACY_LABELS[p]}
            </option>
          ))}
        </select>
      </div>

      {/* §2c: none on by default; greyed out when the creator has turned it off. */}
      <div>
        <span style={label}>Interactions</span>
        {interaction("allowComment", "comments", composer.commentDisabled)}
        {interaction("allowDuet", "Duet", composer.duetDisabled)}
        {interaction("allowStitch", "Stitch", composer.stitchDisabled)}
      </div>

      {/* §3a: off by default; when on, at least one of the two. */}
      <div>
        <label style={check}>
          <input type="checkbox" checked={draft.commercialOn} disabled={disabled}
            onChange={(e) => set({ commercialOn: e.target.checked, yourBrand: false, brandedContent: false })} style={{ marginTop: 3 }} />
          <span><strong>Disclose commercial content</strong>: this video promotes a brand, product or service.</span>
        </label>
        {draft.commercialOn && (
          <div style={{ paddingLeft: 24 }}>
            <label style={check}>
              <input type="checkbox" checked={draft.yourBrand} disabled={disabled}
                onChange={(e) => set({ yourBrand: e.target.checked })} style={{ marginTop: 3 }} />
              <span>Your brand: promotes the church or its own events.</span>
            </label>
            <label style={{ ...check, opacity: draft.privacyLevel === "SELF_ONLY" ? 0.5 : 1 }}
              title={draft.privacyLevel === "SELF_ONLY" ? "Branded content visibility cannot be set to private." : undefined}>
              <input type="checkbox" checked={draft.brandedContent} disabled={disabled || draft.privacyLevel === "SELF_ONLY"}
                onChange={(e) => set({ brandedContent: e.target.checked })} style={{ marginTop: 3 }} />
              <span>Branded content: a paid partnership promoting someone else.
                {draft.privacyLevel === "SELF_ONLY" && " Branded content visibility cannot be set to private."}</span>
            </label>
            <p style={hint}>
              {draft.brandedContent
                ? "Your video will be labeled as ‘Paid partnership’."
                : draft.yourBrand
                  ? "Your video will be labeled as ‘Promotional content’."
                  : "You need to indicate if your content promotes yourself, a third party, or both."}
            </p>
          </div>
        )}
      </div>

      {/* §2 NOTE, §4: the declaration, before the publish button; §5c: express consent. */}
      <label style={check}>
        <input type="checkbox" required checked={draft.consent} disabled={disabled}
          onChange={(e) => set({ consent: e.target.checked })} style={{ marginTop: 3 }} />
        <span>
          By posting, you agree to TikTok&apos;s{" "}
          {branded && (<><a href={BRANDED_CONTENT_POLICY_URL} target="_blank" rel="noopener noreferrer">Branded Content Policy</a> and </>)}
          <a href={MUSIC_USAGE_URL} target="_blank" rel="noopener noreferrer">Music Usage Confirmation</a>.
        </span>
      </label>

      {/* §5d */}
      <p style={{ ...hint, margin: 0 }}>After posting, it may take a few minutes for the video to process and show on the TikTok profile.</p>
    </fieldset>
  );
}
