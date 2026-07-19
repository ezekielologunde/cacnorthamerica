import { ConventionNav } from "@/components/convention/ConventionNav";
import { ConventionFooter } from "@/components/convention/ConventionFooter";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";
import { youthProgram, youthSchedule } from "@/lib/convention/programs";

export const metadata = {
  title: "Youth & Young Adult Ministry — CACNA Convention",
  description: "CAC North America Youth and Young Adult Ministry program at the CACNA Annual Convention.",
  alternates: { canonical: "/convention/youth" },
};

export default function YouthPage() {
  return (
    <main>
      <ConventionNav />
      <ConventionPageHero
        eyebrow="Sub-Conference"
        title={youthProgram.title}
        subhead={`Theme: "${youthProgram.theme}" · Regional Coordinator: ${youthProgram.regionalCoordinator}`}
      />
      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
          {youthSchedule.map((day, di) => (
            <Reveal key={day.dayLabel} delay={di * 60}>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden" }}>
                <div style={{ padding: "16px 22px", background: "var(--cream-2)", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)" }}>
                    {day.dayLabel}
                  </div>
                </div>
                <div>
                  {day.agenda.map((item, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: item.time ? "112px 1fr" : "1fr", gap: 14, padding: "12px 22px", borderTop: i === 0 ? "none" : "1px solid var(--line)" }}>
                      {item.time ? <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--red-deep)", whiteSpace: "nowrap" }}>{item.time}</div> : null}
                      <div style={{ fontSize: 14.5, color: "var(--ink)", fontWeight: 600, lineHeight: 1.5 }}>{item.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <ConventionFooter />
    </main>
  );
}
