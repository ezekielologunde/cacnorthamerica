import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { RegisterForm } from "@/components/register/RegisterForm";
import { CONVENTION_VENUE, conventionYears, dateRangeLabel, activePricing, type ConventionYear } from "@/lib/conventions";

export const revalidate = 3600;

function findYear(slug: string): ConventionYear | undefined {
  const match = /^cacna-(\d{4})$/.exec(slug);
  if (!match) return undefined;
  // Years through 2026 either have their own page or, for 2019/2020/2024, no
  // detail page at all -- registration only ever makes sense for years still
  // ahead of us.
  return conventionYears.find((cy) => cy.year > 2026 && cy.year === Number(match[1]));
}

export function generateStaticParams() {
  return conventionYears
    .filter((cy) => cy.registrationUrl && !cy.registrationUrl.startsWith("http"))
    .map((cy) => ({ slug: `cacna-${cy.year}` }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cy = findYear(slug);
  if (!cy) return {};
  return {
    title: `Register — CACNA ${cy.year} Annual Convention`,
    description: `Register for the CACNA ${cy.year} Annual Convention, ${dateRangeLabel(cy)} at ${CONVENTION_VENUE}.`,
    alternates: { canonical: `/events/cacna-${cy.year}/register` },
  };
}

export default async function RegisterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cy = findYear(slug);
  if (!cy) notFound();

  const tiers = activePricing(cy);
  const isOpen = tiers.length > 0;
  const adultPrice = tiers.find((t) => t.category === "adult")?.priceCents;

  return (
    <main id="main-content">
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 640, height: 520, background: "radial-gradient(circle,rgba(253,200,65,.28),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Link href={cy.href} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.6)", textDecoration: "none", marginBottom: 32 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> Back to Convention {cy.year}
            </Link>
          </Reveal>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>
              {dateRangeLabel(cy)} · {CONVENTION_VENUE}
            </span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(38px,6vw,72px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0 0", lineHeight: 1 }}>
            <RevealText immediate>{`Register for CACNA ${cy.year}`}</RevealText>
          </h1>
          {isOpen && adultPrice !== undefined && (
            <Reveal delay={140}>
              <p style={{ marginTop: 20, fontSize: 15, color: "rgba(245,246,250,.72)" }}>
                Adult rate is ${(adultPrice / 100).toFixed(0)} right now — register before it goes up.
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* Form / not-open state */}
      <section style={{ background: "var(--paper)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {isOpen ? (
            <RegisterForm year={cy.year} />
          ) : (
            <div style={{ textAlign: "center", background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 20, padding: "clamp(32px,5vw,48px)" }}>
              <Sparkles size={28} strokeWidth={2} color="var(--gold)" aria-hidden style={{ marginBottom: 16 }} />
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,30px)", color: "var(--ink)", margin: "0 0 12px" }}>
                Registration isn&apos;t open yet
              </h2>
              <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: 0 }}>
                {`Bookmark this page — pricing and the registration form for CACNA ${cy.year} will go live here as soon as they're confirmed.`}
              </p>
            </div>
          )}
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
