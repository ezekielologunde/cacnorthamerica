"use client";
import { useState } from "react";
import Link from "next/link";
import { PAST_WATCHWORDS } from "@/lib/watchwords";

export function WatchwordArchive({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const line = dark ? "rgba(253,200,65,.4)" : "var(--line)";
  const soft = dark ? "rgba(245,246,250,.65)" : "var(--ink-soft)";
  const link = dark ? "var(--gold)" : "var(--red)";

  return (
    <div style={{ marginTop: 26 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="press"
        aria-expanded={open}
        style={{
          background: "transparent", border: `1px solid ${line}`, borderRadius: 999,
          padding: "9px 20px", fontSize: 13, fontWeight: 700, letterSpacing: ".3px",
          color: link, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
        }}
      >
        Previous years&apos; Watchwords
        <span aria-hidden style={{ display: "inline-block", transition: "transform .25s", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
      </button>

      {open && (
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12, maxWidth: 460, marginLeft: "auto", marginRight: "auto", textAlign: "left" }}>
          {PAST_WATCHWORDS.map((w) => (
            <div key={w.year} style={{ borderTop: `1px solid ${line}`, paddingTop: 12 }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: link }}>{w.year}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: dark ? "#fff" : "var(--ink)", margin: "4px 0 0" }}>
                &ldquo;{w.theme}&rdquo;
              </div>
              {w.verseRef && (
                <div style={{ fontSize: 13, color: soft, marginTop: 3 }}>{w.verseRef}</div>
              )}
              {w.href && (
                <Link href={w.href} style={{ fontSize: 13, fontWeight: 700, color: link, textDecoration: "none", display: "inline-block", marginTop: 6 }}>
                  Read more →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
