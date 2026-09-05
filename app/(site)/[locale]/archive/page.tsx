import Link from "next/link";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { conventionYears, isConventionPast, dateRangeLabel, type RegistrantCategory } from "@/lib/conventions";
import { setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Past Conventions — CACNA Annual Convention Archive",
  description: "Every past CACNA Annual Convention — themes, dates, and registration fees where recorded.",
  alternates: { canonical: "/archive" },
};

const CATEGORY_LABEL: Record<RegistrantCategory, string> = {
  adult: "Adults", young_adult: "Young Adults", child: "Children",
};

function formatFee(range: { min: number; max: number }): string {
  if (range.min === 0) return "Free";
  const fmt = (c: number) => `$${(c / 100).toFixed(0)}`;
  return range.min === range.max ? fmt(range.min) : `${fmt(range.min)}–${fmt(range.max)}`;
}

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pastYears = conventionYears.filter(isConventionPast).sort((a, b) => b.year - a.year);

  return (
    <main id="main-content">
      <Nav heroDark />

      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Archive</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(38px,6vw,68px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0 0", lineHeight: 1 }}>
            <RevealText immediate>Past Conventions</RevealText>
          </h1>
          <Reveal delay={140}>
            <p style={{ marginTop: 16, fontSize: 15.5, color: "rgba(245,246,250,.68)", maxWidth: 560, margin: "16px auto 0" }}>
              Prophet H. Oladeji, General Evangelist of CAC Nigeria &amp; Overseas, has led Revival Night or Impartation Night at every CACNA convention since at least 2019.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--cream)", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
          {pastYears.map((cy, i) => {
            const tiers = cy.pricingTiers ?? [];
            const feesByCategory = new Map<RegistrantCategory, { min: number; max: number }>();
            for (const t of tiers) {
              const existing = feesByCategory.get(t.category);
              feesByCategory.set(t.category, existing
                ? { min: Math.min(existing.min, t.priceCents), max: Math.max(existing.max, t.priceCents) }
                : { min: t.priceCents, max: t.priceCents });
            }
            return (
              <Reveal key={cy.year} delay={i * 50}>
                <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "24px 26px" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)", margin: 0 }}>
                    {cy.year}{cy.theme ? ` — “${cy.theme}”` : ""}
                  </h2>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "6px 0 0" }}>{dateRangeLabel(cy)}</p>
                  {feesByCategory.size > 0 && (
                    <div style={{ marginTop: 16, borderTop: "1px solid var(--line)", paddingTop: 14, display: "flex", flexWrap: "wrap", gap: "6px 24px" }}>
                      {(Object.keys(CATEGORY_LABEL) as RegistrantCategory[]).map((cat) => {
                        const range = feesByCategory.get(cat);
                        if (!range) return null;
                        return (
                          <div key={cat} style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>
                            {CATEGORY_LABEL[cat]}: <strong style={{ color: "var(--ink)" }}>{formatFee(range)}</strong>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {cy.year === 2026 && (
                    <Link href="/events/cacna-2026/schedule" style={{ display: "inline-block", marginTop: 16, fontSize: 13.5, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>
                      View full schedule →
                    </Link>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
