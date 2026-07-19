import { ConventionNav } from "@/components/convention/ConventionNav";
import { ConventionFooter } from "@/components/convention/ConventionFooter";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";
import { AgendaTable } from "@/components/convention/AgendaTable";
import { ExecutiveGrid } from "@/components/convention/ExecutiveGrid";
import { goodWomenConference, goodWomenExecutives, goodWomenSchedule } from "@/lib/convention/programs";

export const metadata = {
  title: "Good Women Conference — CACNA Convention",
  description: "CAC Latunde Region Good Women Association conference at the CACNA Annual Convention.",
  alternates: { canonical: "/convention/good-women" },
};

export default function GoodWomenPage() {
  return (
    <main>
      <ConventionNav />
      <ConventionPageHero
        eyebrow="Sub-Conference"
        title={goodWomenConference.title}
        subhead={`Led by ${goodWomenConference.leader}, ${goodWomenConference.leaderTitle}`}
      />
      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 44 }}>
          <Reveal>
            <ExecutiveGrid people={goodWomenExecutives} title="Executives" />
          </Reveal>
          <Reveal>
            <AgendaTable sessions={goodWomenSchedule} />
          </Reveal>
        </div>
      </section>
      <ConventionFooter />
    </main>
  );
}
