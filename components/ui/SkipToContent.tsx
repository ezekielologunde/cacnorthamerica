"use client";

const hiddenStyle: React.CSSProperties = {
  position: "absolute", width: 1, height: 1, padding: 0, margin: -1,
  overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0,
};

const visibleStyle: React.CSSProperties = {
  position: "fixed", top: 12, left: 12, width: "auto", height: "auto",
  padding: "12px 20px", margin: 0, overflow: "visible", clip: "auto", whiteSpace: "normal",
  background: "#fff", color: "var(--ink)", borderRadius: 8, fontWeight: 700, fontSize: 14,
  boxShadow: "0 8px 24px rgba(0,0,0,.25)",
};

/** Visually hidden until focused, per the standard skip-link pattern —
 *  lets keyboard users jump past the sticky nav straight to page content. */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      style={{ ...hiddenStyle, zIndex: 1000 }}
      onFocus={(e) => Object.assign(e.currentTarget.style, visibleStyle)}
      onBlur={(e) => Object.assign(e.currentTarget.style, hiddenStyle)}
    >
      Skip to main content
    </a>
  );
}
