import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";
import { AgendaTable } from "@/components/convention/AgendaTable";
import { christianEducation, christianEducationAgenda } from "@/lib/convention/programs";

export const metadata = {
  title: "Christian Education Department — CACNA Convention",
  description: "CACNA Christian Education Department (CACNA-CED) session at the Annual Convention.",
  alternates: { canonical: "/convention/christian-education" },
};

export default function ChristianEducationPage() {
  return (
    <main>
      <Nav heroDark />
      <ConventionPageHero
        eyebrow="Sub-Conference"
        title={christianEducation.title}
        subhead={`${christianEducation.date} · Theme: "${christianEducation.theme}" (${christianEducation.themeVerse})`}
      />
      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 24 }}>
              Moderator: <strong style={{ color: "var(--ink)" }}>{christianEducation.moderator}</strong>
            </p>
          </Reveal>
          <Reveal>
            <AgendaTable sessions={[{ dayLabel: christianEducation.date, timeRange: "", agenda: christianEducationAgenda }]} />
          </Reveal>
        </div>
      </section>
      <FooterExperience />
    </main>
  );
}
