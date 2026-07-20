"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { MapPin, Landmark, Phone, Mail } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { Leader } from "@/lib/leaders";

type Category = "all" | "zonal_superintendent" | "dcc_superintendent";

const FILTERS: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "zonal_superintendent", label: "Zones" },
  { value: "dcc_superintendent", label: "DCCs" },
];

const gradients = [
  "linear-gradient(135deg,#7A1128,#C81E3A)",
  "linear-gradient(135deg,#C81E3A,#2D42C9)",
  "linear-gradient(135deg,#2D42C9,#FDC841)",
  "linear-gradient(135deg,#12141E,#7A1128)",
];

function initials(name: string) {
  const parts = name.replace(/^(Pastor|Prophet|Evangelist|Apostle)\s+(Dr\.?\s+)?(\(Mrs\.?\)\s+)?/i, "").trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "")).toUpperCase();
}

export function ZoneDirectory({ leaders }: { leaders: Leader[] }) {
  const [category, setCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leaders.filter((l) => {
      if (category !== "all" && l.category !== category) return false;
      if (!q) return true;
      return (l.zone_name ?? "").toLowerCase().includes(q) || l.full_name.toLowerCase().includes(q);
    });
  }, [leaders, category, query]);

  return (
    <div>
      {/* Filter controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {FILTERS.map((f) => {
            const active = category === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setCategory(f.value)}
                className="press"
                style={{
                  padding: "9px 20px", borderRadius: 999, fontSize: 13.5, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
                  border: active ? "none" : "1px solid var(--line)",
                  background: active ? "var(--red)" : "var(--paper)",
                  color: active ? "#fff" : "var(--ink-soft)",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by zone or name…"
          className="field-input"
          style={{
            width: "min(280px,100%)", padding: "10px 16px", borderRadius: 999,
            border: "1.5px solid var(--line)", background: "var(--paper)",
            fontSize: 14, color: "var(--ink)", fontFamily: "var(--font-body)",
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <p style={{ fontSize: 15, color: "var(--ink-soft)", textAlign: "center", padding: "40px 0" }}>
          No match for &ldquo;{query}&rdquo; — try a different zone or name.
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
          {filtered.map((l, i) => {
            const isDcc = l.category === "dcc_superintendent";
            const Icon = isDcc ? Landmark : MapPin;
            return (
              <Reveal key={l.id} delay={(i % 9) * 40}>
                <div className="card-lift" style={{ height: "100%", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "24px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon size={15} strokeWidth={2.5} color="var(--red)" aria-hidden />
                      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--red)" }}>{l.zone_name}</span>
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: "var(--ink-soft)", background: "var(--cream-2)", padding: "3px 9px", borderRadius: 999 }}>
                      {isDcc ? "DCC" : "Zone"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {l.photo_url ? (
                      <div style={{ position: "relative", width: 52, height: 52, borderRadius: 14, overflow: "hidden", flexShrink: 0, boxShadow: "0 8px 18px rgba(18,20,30,.18)" }}>
                        <Image src={l.photo_url} alt={l.full_name} fill style={{ objectFit: "cover", objectPosition: "center top" }} sizes="52px" unoptimized />
                      </div>
                    ) : (
                      <div aria-hidden style={{
                        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                        background: gradients[i % gradients.length],
                        display: "grid", placeItems: "center",
                        color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17,
                      }}>{initials(l.full_name)}</div>
                    )}
                    <div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, letterSpacing: "-.3px", color: "var(--ink)", margin: "0 0 3px", lineHeight: 1.2 }}>{l.full_name}</h3>
                      <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{l.title}</div>
                    </div>
                  </div>
                  {(l.phone || l.email) && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto", paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                      {l.phone && (
                        <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}>
                          <Phone size={14} strokeWidth={2} color="var(--ink-soft)" aria-hidden /> {l.phone}
                        </a>
                      )}
                      {l.email && (
                        <a href={`mailto:${l.email}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--ink)", textDecoration: "none", wordBreak: "break-all" }}>
                          <Mail size={14} strokeWidth={2} color="var(--ink-soft)" aria-hidden /> {l.email}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
