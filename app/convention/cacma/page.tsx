import { ConventionNav } from "@/components/convention/ConventionNav";
import { ConventionFooter } from "@/components/convention/ConventionFooter";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";
import { AgendaTable } from "@/components/convention/AgendaTable";
import { cacmaSchedule } from "@/lib/convention/programs";

export const metadata = {
  title: "CACMA — CACNA Convention",
  description: "Christ Apostolic Church Men's Association (CACMA) sessions at the CACNA Annual Convention.",
  alternates: { canonical: "/convention/cacma" },
};

export default function CacmaPage() {
  return (
    <main>
      <ConventionNav />
      <ConventionPageHero
        eyebrow="Sub-Conference"
        title="CACMA — Men's Association"
        subhead="Sessions for the men of CACNA across the convention week."
      />
      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Reveal>
            <AgendaTable sessions={cacmaSchedule} />
          </Reveal>
        </div>
      </section>
      <ConventionFooter />
    </main>
  );
}
