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
        Watchwords since 1989
        <span aria-hidden style={{ display: "inline-block", transition: "transform .25s", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
      </button>

      {open && (
        <div style={{
          marginTop: 18, maxWidth: 520, marginLeft: "auto", marginRight: "auto", textAlign: "left",
          maxHeight: 420, overflowY: "auto", paddingRight: 6,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PAST_WATCHWORDS.map((w) => (
              <div key={w.year} style={{ borderTop: `1px solid ${line}`, paddingTop: 12 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "1px", color: link, flexShrink: 0 }}>{w.year}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: soft }}>{w.verseRef}</span>
                </div>
                <p style={{ fontSize: 14.5, fontStyle: "italic", color: dark ? "rgba(255,255,255,.88)" : "var(--ink)", margin: "5px 0 0", lineHeight: 1.55 }}>
                  &ldquo;{w.verseText}&rdquo;
                </p>
                {w.href && (
                  <Link href={w.href} style={{ fontSize: 13, fontWeight: 700, color: link, textDecoration: "none", display: "inline-block", marginTop: 6 }}>
                    Read more →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
