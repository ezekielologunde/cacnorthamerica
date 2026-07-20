"use client";
import { useEffect, useState } from "react";

export type HomepageAnnouncement = {
  id: string;
  title: string;
  body: string | null;
  cta_text: string | null;
  cta_url: string | null;
  bg_color: string;
  text_color: string;
};

/** Compact, dismissible homepage announcement strip — matches the quality
 *  bar of the site-wide SiteOverlays banner (localStorage-remembered
 *  dismissal, small close button) instead of a plain non-dismissible block. */
export function HomepageAnnouncements({ announcements }: { announcements: HomepageAnnouncement[] }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = new Set<string>();
    for (const ann of announcements) {
      if (localStorage.getItem(`ann-home-${ann.id}`)) stored.add(ann.id);
    }
    setDismissed(stored);
    setReady(true);
  }, [announcements]);

  function dismiss(id: string) {
    localStorage.setItem(`ann-home-${id}`, "1");
    setDismissed((prev) => new Set(prev).add(id));
  }

  if (!ready) return null;
  const visible = announcements.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {visible.map((ann) => (
        <div key={ann.id} style={{
          background: ann.bg_color,
          color: ann.text_color,
          padding: "10px clamp(20px,5vw,64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          flexWrap: "wrap",
          textAlign: "center",
          fontSize: 13.5,
        }}>
          <span style={{ fontWeight: 700 }}>{ann.title}</span>
          {ann.body && <span style={{ opacity: 0.85 }}>{ann.body}</span>}
          {ann.cta_text && ann.cta_url && (
            <a href={ann.cta_url} style={{
              background: "rgba(255,255,255,0.2)",
              color: ann.text_color,
              fontWeight: 800,
              fontSize: 12.5,
              padding: "5px 14px",
              borderRadius: 20,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.35)",
              whiteSpace: "nowrap",
            }}>
              {ann.cta_text}
            </a>
          )}
          <button
            onClick={() => dismiss(ann.id)}
            aria-label="Dismiss announcement"
            style={{ background: "none", border: "none", color: ann.text_color, cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0, opacity: 0.6, flexShrink: 0 }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
