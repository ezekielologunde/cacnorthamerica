import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";
import { AgendaTable } from "@/components/convention/AgendaTable";
import { ExecutiveGrid } from "@/components/convention/ExecutiveGrid";
import {
  businessGroupFellowship,
  businessGroupAgenda,
  businessGroupExecutives,
  kingdomEconomicsMessage,
} from "@/lib/convention/programs";

export const metadata = {
  title: "Business Group Fellowship — CACNA Convention",
  description: "CACNA Business Group Fellowship at the Annual Convention — agenda, executives, and the Kingdom Economics message.",
  alternates: { canonical: "/convention/business-group" },
};

export default function BusinessGroupPage() {
  return (
    <main>
      <Nav heroDark />
      <ConventionPageHero
        eyebrow="Sub-Conference"
        title={businessGroupFellowship.title}
        subhead={businessGroupFellowship.date}
      />

      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 44 }}>
          <Reveal>
            <AgendaTable sessions={[{ dayLabel: businessGroupFellowship.date, timeRange: "", agenda: businessGroupAgenda }]} />
          </Reveal>

          <Reveal>
            <ExecutiveGrid people={businessGroupExecutives} title="Executives" />
          </Reveal>

          <Reveal>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "clamp(24px,4vw,36px)" }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)" }}>
                {kingdomEconomicsMessage.verse}
              </span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.8vw,28px)", color: "var(--ink)", margin: "10px 0 18px", lineHeight: 1.2 }}>
                {kingdomEconomicsMessage.title}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {kingdomEconomicsMessage.contributors.map((c) => (
                  <div key={c.name} style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>
                    <strong style={{ color: "var(--ink)" }}>{c.name}</strong> — {c.title}
                  </div>
                ))}
              </div>
              {kingdomEconomicsMessage.body.map((p, i) => (
                <p key={i} style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 14 }}>{p}</p>
              ))}
              <p style={{ fontSize: 13.5, color: "var(--ink-soft)", fontStyle: "italic" }}>{kingdomEconomicsMessage.fullMessageNote}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
