"use client";

import { useState, useTransition } from "react";
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/app/admin/(protected)/announcements/actions";

type Announcement = {
  id: string;
  title: string;
  body: string | null;
  cta_text: string | null;
  cta_url: string | null;
  bg_color: string;
  text_color: string;
  placement: string;
  active: boolean;
  expires_at: string | null;
};

const inp: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid rgba(0,0,0,0.12)",
  borderRadius: 8,
  fontSize: 15,
  fontFamily: "inherit",
  background: "white",
  boxSizing: "border-box",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--ink)",
  marginBottom: 6,
};

const muted: React.CSSProperties = { fontWeight: 400, opacity: 0.5 };

export default function AnnouncementForm({
  announcement,
}: {
  announcement?: Announcement | null;
}) {
  const isEdit = !!announcement;

  const [title, setTitle] = useState(announcement?.title ?? "");
  const [body, setBody] = useState(announcement?.body ?? "");
  const [ctaText, setCtaText] = useState(announcement?.cta_text ?? "");
  const [ctaUrl, setCtaUrl] = useState(announcement?.cta_url ?? "");
  const [bgColor, setBgColor] = useState(announcement?.bg_color ?? "#D62828");
  const [textColor, setTextColor] = useState(announcement?.text_color ?? "#ffffff");
  const [placement, setPlacement] = useState(announcement?.placement ?? "homepage");
  const [active, setActive] = useState(announcement?.active ?? true);
  const [expiresAt, setExpiresAt] = useState(
    announcement?.expires_at ? announcement.expires_at.slice(0, 16) : ""
  );

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (isEdit) {
          await updateAnnouncement(announcement.id, formData);
          setSaved(true);
        } else {
          await createAnnouncement(formData);
        }
      } catch (err) {
        if (typeof err === 'object' && err !== null && 'digest' in err) throw err;
        setError(err instanceof Error ? err.message : "Failed to save");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Delete this announcement? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteAnnouncement(announcement!.id);
      } catch (err) {
        if (typeof err === 'object' && err !== null && 'digest' in err) throw err;
        setError(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <style>{`
        .adm-inp { transition: border-color 0.15s, box-shadow 0.15s; }
        .adm-inp:focus-visible { border-color: var(--red); box-shadow: 0 0 0 3px rgba(214,40,40,0.12); }
        .adm-inp:hover:not(:focus-visible) { border-color: rgba(27,19,14,0.24); }
      `}</style>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Title */}
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              name="title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setSaved(false); }}
              required
              className="adm-inp"
              style={inp}
              placeholder="e.g. Sunday Service Time Change"
            />
          </div>

          {/* Body */}
          <div>
            <label style={labelStyle}>Body / Description <span style={muted}>— optional</span></label>
            <textarea
              name="body"
              value={body}
              onChange={(e) => { setBody(e.target.value); setSaved(false); }}
              rows={3}
              className="adm-inp"
              style={{ ...inp, resize: "vertical" }}
              placeholder="Additional details shown beneath the title…"
            />
          </div>

          {/* CTA */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <div>
              <label style={labelStyle}>CTA Button Text <span style={muted}>— optional</span></label>
              <input
                name="cta_text"
                value={ctaText}
                onChange={(e) => { setCtaText(e.target.value); setSaved(false); }}
                className="adm-inp"
                style={inp}
                placeholder="Register Now →"
              />
            </div>
            <div>
              <label style={labelStyle}>CTA URL <span style={muted}>— optional</span></label>
              <input
                type="url"
                name="cta_url"
                value={ctaUrl}
                onChange={(e) => { setCtaUrl(e.target.value); setSaved(false); }}
                className="adm-inp"
                style={inp}
                placeholder="https://…"
              />
            </div>
          </div>

          {/* Colors */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div>
              <label style={labelStyle}>Background Color</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="color"
                  name="bg_color"
                  value={bgColor}
                  onChange={(e) => { setBgColor(e.target.value); setSaved(false); }}
                  style={{ width: 48, height: 40, border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: 8, cursor: "pointer", padding: 2 }}
                />
                <span style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", fontFamily: "monospace" }}>{bgColor}</span>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Text Color</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="color"
                  name="text_color"
                  value={textColor}
                  onChange={(e) => { setTextColor(e.target.value); setSaved(false); }}
                  style={{ width: 48, height: 40, border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: 8, cursor: "pointer", padding: 2 }}
                />
                <span style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", fontFamily: "monospace" }}>{textColor}</span>
              </div>
            </div>
          </div>

          {/* Placement + Expires */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <div>
              <label style={labelStyle}>Placement</label>
              <select
                name="placement"
                value={placement}
                onChange={(e) => { setPlacement(e.target.value); setSaved(false); }}
                className="adm-inp"
                style={{ ...inp }}
              >
                <option value="homepage">Homepage</option>
                <option value="banner">Banner (site-wide)</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Expires At <span style={muted}>— optional</span></label>
              <input
                type="datetime-local"
                name="expires_at"
                value={expiresAt}
                onChange={(e) => { setExpiresAt(e.target.value); setSaved(false); }}
                className="adm-inp"
                style={inp}
              />
            </div>
          </div>

          {/* Active */}
          <div>
            <input type="hidden" name="active" value={active ? "true" : "false"} />
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "var(--ink)" }}>
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => { setActive(e.target.checked); setSaved(false); }}
                style={{ width: 16, height: 16, cursor: "pointer" }}
              />
              Active (visible on site)
            </label>
          </div>

          {/* Live Preview */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 10 }}>Live Preview</p>
            <div
              style={{
                background: bgColor,
                color: textColor,
                borderRadius: 10,
                padding: "18px 22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                minHeight: 56,
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: textColor }}>
                  {title || <em style={{ opacity: 0.5 }}>Title preview</em>}
                </p>
                {body && (
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: textColor, opacity: 0.85 }}>{body}</p>
                )}
              </div>
              {ctaText && (
                <span
                  style={{
                    background: textColor,
                    color: bgColor,
                    borderRadius: 6,
                    padding: "7px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {ctaText}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", paddingTop: 8 }}>
            <button
              type="submit"
              disabled={isPending}
              style={{
                background: "var(--red)",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: isPending ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                opacity: isPending ? 0.65 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Announcement"}
            </button>

            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                style={{
                  background: "transparent",
                  color: "#dc2626",
                  border: "1.5px solid #dc2626",
                  borderRadius: 8,
                  padding: "9px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: isPending ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                Delete
              </button>
            )}

            {error && <p style={{ color: "#dc2626", fontSize: 14, margin: 0 }}>{error}</p>}
            {saved && <p style={{ color: "#16a34a", fontSize: 14, margin: 0 }}>Saved!</p>}
          </div>

        </div>
      </form>
    </div>
  );
}
