"use client";

import { useMemo, useState } from "react";
import { PlayCircle } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import {
  archiveCategories,
  archiveSearchUrl,
  groupArchiveByYear,
  type ArchiveCategory,
  type ArchiveEntry,
} from "@/lib/archive";

const categoryAccent: Record<ArchiveCategory, string> = {
  Convention: "var(--red)",
  "Good Women Marathon": "var(--gold)",
  CACMA: "#F0742F",
  Ordination: "#7A5C2E",
  Other: "rgba(245,246,250,.5)",
};

export function ArchiveBrowser({ entries }: { entries: ArchiveEntry[] }) {
  const [active, setActive] = useState<ArchiveCategory | "All">("All");

  const filtered = useMemo(
    () => (active === "All" ? entries : entries.filter((e) => e.category === active)),
    [entries, active]
  );
  const grouped = useMemo(() => groupArchiveByYear(filtered), [filtered]);

  return (
    <div>
      {/* Filter chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
        {(["All", ...archiveCategories] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className="press"
            style={{
              padding: "9px 18px",
              borderRadius: 999,
              fontSize: 13.5,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: "pointer",
              border: active === cat ? "none" : "1px solid rgba(245,246,250,.2)",
              background: active === cat ? "var(--gold)" : "transparent",
              color: active === cat ? "#12141E" : "rgba(245,246,250,.7)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {grouped.length === 0 && (
        <p style={{ color: "rgba(245,246,250,.6)", fontSize: 15 }}>No entries in this category yet.</p>
      )}

      {grouped.map(({ year, entries: yearEntries }) => (
        <div key={year} style={{ marginBottom: 48 }}>
          <Reveal>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(24px,3vw,36px)",
                letterSpacing: "-.5px",
                color: "var(--gold)",
                margin: "0 0 20px",
              }}
            >
              {year}
            </h3>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
            {yearEntries.map((entry, i) => (
              <Reveal key={entry.title} delay={(i % 6) * 50}>
                <a
                  href={archiveSearchUrl(entry.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-lift"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    gap: 14,
                    padding: "22px 22px 20px",
                    borderRadius: 18,
                    background: "rgba(245,246,250,.05)",
                    border: "1px solid rgba(245,246,250,.1)",
                    textDecoration: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 10.5,
                        fontWeight: 800,
                        letterSpacing: "1.2px",
                        textTransform: "uppercase",
                        color: categoryAccent[entry.category],
                      }}
                    >
                      <PlayCircle size={13} strokeWidth={2} aria-hidden /> {entry.category}
                    </span>
                    <span style={{ fontSize: 11.5, color: "rgba(245,246,250,.45)", fontWeight: 600 }}>{entry.duration}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--cream)", lineHeight: 1.4, flex: 1 }}>
                    {entry.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "rgba(245,246,250,.4)" }}>{entry.approxViews}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--gold)" }}>Watch →</span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
