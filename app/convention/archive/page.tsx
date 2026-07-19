import { ConventionNav } from "@/components/convention/ConventionNav";
import { ConventionFooter } from "@/components/convention/ConventionFooter";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";
import { currentOrNextConvention, dateRangeLabel } from "@/lib/conventions";
import { pastConventionYears } from "@/lib/convention/archive";

export const metadata = {
  title: "Archive — CACNA Convention",
  description: "Past CACNA Annual Convention years, themes, and dates.",
  alternates: { canonical: "/convention/archive" },
};

function fmtRange(startIso: string, endIso: string, year: number) {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const [, sm, sd] = startIso.split("-").map(Number);
  const [, , ed] = endIso.split("-").map(Number);
  return `${months[sm - 1]} ${sd}–${ed}, ${year}`;
}

export default function ConventionArchivePage() {
  const cy = currentOrNextConvention();
  const current = cy.theme ? { year: cy.year, theme: cy.theme, label: dateRangeLabel(cy) } : null;

  return (
    <main>
      <ConventionNav />
      <ConventionPageHero
        eyebrow="Archive"
        title="Convention Archive"
        subhead="Past themes and dates from the CACNA Annual Convention."
      />
      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {current ? (
            <Reveal>
              <div style={{ background: "var(--paper)", border: "2px solid var(--red)", borderRadius: 18, padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)" }}>{current.year}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)" }}>Current</span>
                </div>
                <p style={{ fontSize: 15, color: "var(--ink)", fontWeight: 600, margin: "8px 0 4px" }}>&ldquo;{current.theme}&rdquo;</p>
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{current.label}</p>
              </div>
            </Reveal>
          ) : null}

          {pastConventionYears.map((y, i) => (
            <Reveal key={y.year} delay={(i + 1) * 60}>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 24px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)" }}>{y.year}</span>
                <p style={{ fontSize: 15, color: "var(--ink)", fontWeight: 600, margin: "8px 0 4px" }}>&ldquo;{y.theme}&rdquo;</p>
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{fmtRange(y.startIso, y.endIso, y.year)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <ConventionFooter />
    </main>
  );
}
