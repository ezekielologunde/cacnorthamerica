import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";
import { AgendaTable } from "@/components/convention/AgendaTable";
import { ExecutiveGrid } from "@/components/convention/ExecutiveGrid";
import { ministersWivesConference, ministersWivesSchedule } from "@/lib/convention/programs";

export const metadata = {
  title: "Ministers' Wives Conference — CACNA Convention",
  description: "CAC Latunde Region Convention Ministers' Wives Conference at the CACNA Annual Convention.",
  alternates: { canonical: "/convention/ministers-wives" },
};

export default function MinistersWivesPage() {
  return (
    <main>
      <Nav heroDark />
      <ConventionPageHero
        eyebrow="Sub-Conference"
        title={ministersWivesConference.title}
      />
      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 44 }}>
          <Reveal>
            <ExecutiveGrid people={ministersWivesConference.executiveMembers} title="Executives" />
          </Reveal>
          <Reveal>
            <AgendaTable sessions={ministersWivesSchedule} />
          </Reveal>
        </div>
      </section>
      <FooterExperience />
    </main>
  );
}
