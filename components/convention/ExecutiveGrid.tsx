import { Reveal } from "@/components/ui/Reveal";
import type { Person } from "@/lib/convention/types";

function initials(name: string) {
  return name.replace(/^(Pastor|Evang\.?|Evangelist|Mrs\.?|Mr\.?|L\/Evang\.?|Dr\.?)\s+/i, "")
    .split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export function ExecutiveGrid({ people, title }: { people: Person[]; title?: string }) {
  return (
    <div>
      {title ? (
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.6vw,28px)", color: "var(--ink)", margin: "0 0 20px" }}>
          {title}
        </h2>
      ) : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
        {people.map((p, i) => (
          <Reveal key={p.name} delay={i * 40}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "16px 18px" }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,var(--red),var(--red-deep))",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 800, fontSize: 14,
              }}>
                {initials(p.name)}
              </div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink)", lineHeight: 1.35 }}>{p.name}</div>
                {(p.role || p.title) ? (
                  <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>{p.role || p.title}</div>
                ) : null}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
