import { ConventionNav } from "@/components/convention/ConventionNav";
import { ConventionFooter } from "@/components/convention/ConventionFooter";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";
import { childrenConvention, childrenTeachers, childrenSchedule } from "@/lib/convention/programs";

export const metadata = {
  title: "Children's Convention — CACNA Convention",
  description: "The Children's Convention program at the CACNA Annual Convention — daily structure, teachers, and schedule.",
  alternates: { canonical: "/convention/children" },
};

export default function ChildrenPage() {
  return (
    <main>
      <ConventionNav />
      <ConventionPageHero
        eyebrow="Sub-Conference"
        title="Children's Convention"
        subhead={`Theme: "${childrenConvention.theme}" (${childrenConvention.themeVerse}) · Coordinator: ${childrenConvention.coordinator}`}
      />
      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 44 }}>
          <Reveal>
            <div style={{ background: "rgba(200,30,58,.07)", border: "1px solid rgba(200,30,58,.15)", borderRadius: 16, padding: "18px 22px" }}>
              <p style={{ margin: 0, fontSize: 14.5, color: "var(--ink)", lineHeight: 1.6 }}>{childrenConvention.safetyNote}</p>
            </div>
          </Reveal>

          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.6vw,28px)", color: "var(--ink)", margin: "0 0 20px" }}>Schedule</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {childrenSchedule.map((day) => (
                <div key={day.date} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "18px 22px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 10 }}>
                    {day.dayLabel}
                  </div>
                  {day.morning ? (
                    <div style={{ marginBottom: day.afternoon ? 10 : 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--red-deep)" }}>Morning · {day.morning.time}</div>
                      {day.morning.message ? <div style={{ fontSize: 14.5, color: "var(--ink)", marginTop: 4 }}>{day.morning.message}</div> : null}
                      {day.morning.activity ? <div style={{ fontSize: 14.5, color: "var(--ink)", marginTop: 4 }}>{day.morning.activity}</div> : null}
                    </div>
                  ) : null}
                  {day.afternoon ? (
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--red-deep)" }}>Afternoon · {day.afternoon.time}</div>
                      {day.afternoon.message ? <div style={{ fontSize: 14.5, color: "var(--ink)", marginTop: 4 }}>{day.afternoon.message}</div> : null}
                      {day.afternoon.activity ? <div style={{ fontSize: 14.5, color: "var(--ink)", marginTop: 4 }}>{day.afternoon.activity}</div> : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.6vw,28px)", color: "var(--ink)", margin: "0 0 20px" }}>Teachers</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
              {childrenTeachers.map((t) => (
                <div key={t.name} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: "12px 16px", fontSize: 14, color: "var(--ink)" }}>
                  {t.name}
                  {t.ageRange ? <span style={{ display: "block", fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>{t.ageRange}</span> : null}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--red)", textAlign: "center" }}>{childrenConvention.closingNote}</p>
          </Reveal>
        </div>
      </section>
      <ConventionFooter />
    </main>
  );
}
