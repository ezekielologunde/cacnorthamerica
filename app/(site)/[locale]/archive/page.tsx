import Link from "next/link";
import Image from "next/image";
import "@/app/(site)/[locale]/mobile-events-media.css";
import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { conventionYears, isConventionPast, dateRangeLabel, type RegistrantCategory } from "@/lib/conventions";
import { setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/lib/site";
import { archivedEvents, spiritualGiftsTeaching } from "@/lib/archive-notes";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Past Conventions — CACNA Annual Convention Archive",
    description: "Every past CACNA Annual Convention — themes, dates, and registration fees where recorded.",
    alternates: { canonical: `${SITE_URL}/archive` },
  };
}

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

      <section className="mm-hero" style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(38px,6vw,68px)", letterSpacing: "-0.03em", color: "#fff", margin: 0, lineHeight: 1 }}>
            <RevealText immediate>Past Conventions</RevealText>
          </h1>
          <Reveal delay={140}>
            <p style={{ marginTop: 16, fontSize: 15.5, color: "rgba(245,246,250,.68)", maxWidth: 560, margin: "16px auto 0" }}>
              Prophet H. Oladeji, General Evangelist of CAC Nigeria &amp; Overseas, has led Revival Night or Impartation Night at every CACNA convention since at least 2019.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mm-sec" style={{ background: "var(--cream)", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px)" }}>
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
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "6px 0 0" }}>
                    {dateRangeLabel(cy)}
                    {cy.venue ? ` · ${cy.venue}` : ""}
                  </p>
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
                    <Image src="/photos/archive/cacna-2026-convention-flier.jpg" alt="Flier for the CACNA 2026 Annual Convention, The Bible: God’s Message to Man, 13 to 18 July 2026" width={1127} height={1600} sizes="(max-width: 760px) 100vw, 420px" style={{ width: "100%", maxWidth: 420, height: "auto", borderRadius: 12, marginTop: 16, display: "block" }} />
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

      <section className="mm-sec" style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px) clamp(48px,6vw,72px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--ink)", margin: "16px 0 0" }}>Other past events</h2>
          {archivedEvents.map((ev) => (
            <div key={ev.title} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "24px 26px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--ink)", margin: 0 }}>{ev.title}</h3>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "6px 0 0" }}>{ev.dateLabel}</p>
              <p style={{ fontSize: 14.5, color: "var(--ink-soft)", margin: "10px 0 0", lineHeight: 1.6 }}>{ev.detail}</p>
              {ev.imageSrc && (
                <Image src={ev.imageSrc} alt={ev.imageAlt ?? ""} width={1280} height={1600} sizes="(max-width: 760px) 100vw, 500px" style={{ width: "100%", maxWidth: 420, height: "auto", borderRadius: 12, marginTop: 16 }} />
              )}
            </div>
          ))}

          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--ink)", margin: "32px 0 0" }}>Teaching archive</h2>
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "24px 26px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--ink)", margin: 0 }}>{spiritualGiftsTeaching.title}</h3>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "6px 0 0" }}>{spiritualGiftsTeaching.subtitle}</p>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", margin: "10px 0 0", lineHeight: 1.6 }}>{spiritualGiftsTeaching.note}</p>
            <details style={{ marginTop: 14 }}>
              <summary style={{ cursor: "pointer", fontSize: 14, fontWeight: 700, color: "var(--red)" }}>Read the outline</summary>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 14 }}>
                {spiritualGiftsTeaching.sections.map((sec) => (
                  <div key={sec.heading}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", margin: 0 }}>{sec.heading}</h4>
                    <ul style={{ margin: "6px 0 0", paddingLeft: 20, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>
                      {sec.points.map((pt) => <li key={pt}>{pt}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
