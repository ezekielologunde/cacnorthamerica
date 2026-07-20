"use client";
import { useState } from "react";
import Image from "next/image";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { Reveal } from "@/components/ui/Reveal";

export type TeamMember = { name: string; title: string; photo: string };

export type Department = {
  key: string;
  label: string;
  heading: string;
  body: string[];
  photo?: { src: string; alt: string; objectPosition?: string };
  team?: TeamMember[];
};

export function DepartmentDirectory({ departments }: { departments: Department[] }) {
  const [active, setActive] = useState(departments[0].key);
  const dept = departments.find((d) => d.key === active) ?? departments[0];

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 40 }}>
        {departments.map((d) => {
          const isActive = d.key === active;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setActive(d.key)}
              className="press"
              style={{
                padding: "10px 22px", borderRadius: 999, fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
                border: isActive ? "none" : "1px solid var(--line)",
                background: isActive ? "var(--red)" : "var(--paper)",
                color: isActive ? "#fff" : "var(--ink-soft)",
                transition: "background .25s var(--ease-out-quart), color .25s var(--ease-out-quart)",
              }}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      <div key={dept.key} style={{ display: "grid", gridTemplateColumns: dept.photo ? "1.1fr 1fr" : "1fr", gap: "clamp(28px,4vw,48px)", alignItems: "start" }} className="dept-grid">
        <Reveal>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,36px)", letterSpacing: "-.8px", color: "var(--ink)", margin: "0 0 18px", lineHeight: 1.05 }}>
              {dept.heading}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {dept.body.map((p, i) => (
                <p key={i} style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.8, margin: 0 }}>{p}</p>
              ))}
            </div>
          </div>
        </Reveal>

        {dept.photo && (
          <Reveal delay={80}>
            <div style={{ position: "relative", width: "100%", height: "clamp(220px,26vw,340px)", borderRadius: 22, overflow: "hidden", boxShadow: "0 20px 44px rgba(18,20,30,.15)" }}>
              <ImageLightbox src={dept.photo.src} alt={dept.photo.alt} objectPosition={dept.photo.objectPosition ?? "center"} />
            </div>
          </Reveal>
        )}
      </div>

      {dept.team && dept.team.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 18 }}>
            Department leadership
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {dept.team.map((p, i) => (
              <Reveal key={p.name} delay={(i % 6) * 40}>
                <div className="card-lift" style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "18px 16px", display: "flex", alignItems: "center", gap: 12, height: "100%" }}>
                  <div style={{ position: "relative", width: 52, height: 52, borderRadius: 14, overflow: "hidden", flexShrink: 0, boxShadow: "0 8px 18px rgba(18,20,30,.15)" }}>
                    <Image src={p.photo} alt={p.name} fill style={{ objectFit: "cover", objectPosition: "center top" }} sizes="52px" unoptimized />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14.5, letterSpacing: "-.2px", color: "var(--ink)", margin: "0 0 2px", lineHeight: 1.2 }}>{p.name}</h4>
                    <div style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.35 }}>{p.title}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 760px) {
          .dept-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
