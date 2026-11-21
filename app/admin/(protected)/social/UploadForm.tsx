"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signVideoUpload, submitVideo } from "./actions";
import type { UploadSignature } from "@/lib/social/cloudinary";
import { TITLE_MAX, UPLOAD_FORMATS, UPLOAD_MAX_BYTES } from "@/lib/social/limits";
import { describeCode } from "@/lib/social/messages";
import { parseTikTokChoices, type TikTokComposer } from "@/lib/social/tiktok-choices";
import TikTokFields, { draftBlocksPosting, draftToChoices, EMPTY_TIKTOK_DRAFT, type TikTokDraft } from "./TikTokFields";

// The video goes straight from this browser to Cloudinary in 20 MB chunks
// (Cloudinary requires every chunk but the last to be over 5 MB:
// https://cloudinary.com/documentation/upload_images#chunked_asset_upload).
// It never passes through our server, whose request bodies are capped at a
// few MB. Only the resulting public id, the title and the caption are sent to
// the submitVideo action.
const CHUNK_BYTES = 20 * 1024 * 1024;

async function uploadToCloudinary(
  file: File,
  sig: UploadSignature,
  onProgress: (fraction: number) => void,
): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${encodeURIComponent(sig.cloudName)}/video/upload`;
  const uploadId = crypto.randomUUID();
  let last: { public_id?: unknown } | null = null;
  for (let start = 0; start < file.size; start += CHUNK_BYTES) {
    const end = Math.min(start + CHUNK_BYTES, file.size);
    const body = new FormData();
    body.append("file", file.slice(start, end), file.name);
    body.append("api_key", sig.apiKey);
    body.append("timestamp", String(sig.timestamp));
    body.append("signature", sig.signature);
    body.append("folder", sig.folder);
    body.append("allowed_formats", sig.allowedFormats);
    const res = await fetch(url, {
      method: "POST",
      body,
      headers: { "X-Unique-Upload-Id": uploadId, "Content-Range": `bytes ${start}-${end - 1}/${file.size}` },
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.error?.message ? `Upload failed: ${json.error.message}` : `Upload failed (${res.status}).`);
    last = json;
    onProgress(end / file.size);
  }
  if (typeof last?.public_id !== "string") throw new Error("The upload finished without a video id. Please try again.");
  return last.public_id;
}

const inp: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid rgba(0,0,0,0.12)",
  borderRadius: 8,
  fontSize: 15,
  fontFamily: "inherit",
  background: "white",
  boxSizing: "border-box",
};
const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 };
const hint: React.CSSProperties = { fontSize: 12.5, color: "var(--ink-soft)", margin: "6px 0 0" };

type Phase = "idle" | "uploading" | "submitting";

/** `tiktok`: the TikTok section (lib/social/adapters.ts tiktokComposer), or
 *  null when TikTok isn't in play. Its choices go with the same single
 *  submit as everything else. */
export default function UploadForm({ modeNote, tiktok }: { modeNote: string; tiktok: TikTokComposer | null }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  // Kept after a successful upload, so a failed submit can be retried without
  // uploading again (and resubmitting the same video is idempotent anyway).
  const [publicId, setPublicId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [tiktokDraft, setTiktokDraft] = useState<TikTokDraft>(EMPTY_TIKTOK_DRAFT);
  // A local preview of the video about to be posted (TikTok's guidelines,
  // section 5a); the file itself never leaves for our server.
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  const tiktokReady = tiktok?.state === "ready";

  function pickFile(f: File | null) {
    setError("");
    setDone("");
    setPublicId(null);
    setProgress(0);
    if (!f) return setFile(null);
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!(UPLOAD_FORMATS as readonly string[]).includes(ext)) {
      setFile(null);
      return setError(`Choose an ${UPLOAD_FORMATS.join(" or ").toUpperCase()} video.`);
    }
    if (f.size > UPLOAD_MAX_BYTES) {
      setFile(null);
      return setError(`That file is ${(f.size / 1048576).toFixed(0)} MB; the limit is ${UPLOAD_MAX_BYTES / 1048576} MB.`);
    }
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (phase !== "idle") return;
    setError("");
    setDone("");
    if (!file && !publicId) return setError("Choose a video first.");
    if (!title.trim()) return setError("Add a title.");
    // Checked here for a quick message; the server checks the same rules.
    let tiktokChoices: unknown = undefined;
    if (tiktokReady) {
      tiktokChoices = draftToChoices(tiktokDraft);
      const checked = parseTikTokChoices(tiktokChoices);
      if (!checked.ok) return setError(describeCode(checked.code));
    }

    try {
      let id = publicId;
      if (!id) {
        setPhase("uploading");
        const signed = await signVideoUpload();
        if (!signed.ok) throw new Error(signed.error);
        id = await uploadToCloudinary(file as File, signed.upload, setProgress);
        setPublicId(id);
      }
      setPhase("submitting");
      const res = await submitVideo({ publicId: id, title, caption, tiktok: tiktokChoices });
      if (!res.ok) throw new Error(res.error);
      setDone(res.duplicate ? "This video was already submitted; its log entry is below." : "Submitted. See the post log below.");
      setFile(null);
      setPublicId(null);
      setTitle("");
      setCaption("");
      setTiktokDraft(EMPTY_TIKTOK_DRAFT);
      setProgress(0);
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err) {
      if (typeof err === "object" && err !== null && "digest" in err) throw err;
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPhase("idle");
    }
  }

  const busy = phase !== "idle";
  return (
    <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: 10, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "grid", gap: 18 }}>
      <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink)", fontWeight: 600 }}>{modeNote}</p>

      <div>
        <label htmlFor="social-video" style={label}>Video</label>
        <input id="social-video" type="file" accept="video/mp4,video/quicktime,.mp4,.mov" disabled={busy}
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
        <p style={hint}>MP4 or MOV, up to {UPLOAD_MAX_BYTES / 1048576} MB. Vertical 9:16 works best on Reels and TikTok. Facebook takes MP4 only.</p>
        {previewUrl && (
          <video src={previewUrl} controls muted playsInline
            style={{ display: "block", marginTop: 10, maxHeight: 280, maxWidth: "100%", borderRadius: 8, background: "#000" }} />
        )}
      </div>

      <div>
        <label htmlFor="social-title" style={label}>Title</label>
        <input id="social-title" style={inp} value={title} maxLength={TITLE_MAX} disabled={busy} required
          onChange={(e) => setTitle(e.target.value)} />
        <p style={hint}>Facebook shows it as the video title; Instagram and TikTok put it on the first line of the caption.</p>
      </div>

      <div>
        <label htmlFor="social-caption" style={label}>Caption</label>
        <textarea id="social-caption" style={{ ...inp, minHeight: 120, resize: "vertical" }} value={caption} disabled={busy}
          onChange={(e) => setCaption(e.target.value)} />
        <p style={hint}>{title.length + caption.length + (caption ? 2 : 0)} / 2200 characters with the title. Instagram allows 30 hashtags and 20 @ tags.</p>
      </div>

      {tiktok && <TikTokFields composer={tiktok} draft={tiktokDraft} onChange={setTiktokDraft} disabled={busy} />}

      {error && <p role="alert" style={{ margin: 0, color: "#dc2626", fontSize: 13.5 }}>{error}</p>}
      {done && <p role="status" style={{ margin: 0, color: "#16a34a", fontSize: 13.5 }}>{done}</p>}

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button type="submit" disabled={busy || (tiktokReady && draftBlocksPosting(tiktokDraft))}
          style={{ background: "var(--red)", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.65 : 1 }}>
          {phase === "uploading" ? `Uploading ${Math.round(progress * 100)}%` : phase === "submitting" ? "Posting..." : publicId ? "Submit again" : "Upload and post"}
        </button>
        {busy && <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Keep this tab open until it finishes.</span>}
      </div>
    </form>
  );
}
