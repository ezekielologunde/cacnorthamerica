import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { YouthRegisterForm } from "@/components/register/YouthRegisterForm";
import { ServeCallout } from "@/components/ServeCallout";
import { CONVENTION_VENUE, conventionYears, dateRangeLabel, activePricing, type ConventionYear } from "@/lib/conventions";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

// Same year rules as the main register page (../page.tsx): only conventions
// still ahead of us take registrations.
function findYear(slug: string): ConventionYear | undefined {
  const match = /^cacna-(\d{4})$/.exec(slug);
  if (!match) return undefined;
  return conventionYears.find((cy) => cy.year > 2026 && cy.year === Number(match[1]));
}

export function generateStaticParams() {
  return conventionYears
    .filter((cy) => cy.registrationUrl && !cy.registrationUrl.startsWith("http"))
    .map((cy) => ({ slug: `cacna-${cy.year}` }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const cy = findYear(slug);
  if (!cy) return {};
  return {
    title: `Youth & Child Registration — CACNA ${cy.year} Annual Convention`,
    description: `Register children, youth and young adults (under 30) for the CACNA ${cy.year} Annual Convention, ${dateRangeLabel(cy)} at ${CONVENTION_VENUE}, with Convention meals.`,
    alternates: { canonical: `${SITE_URL}/events/cacna-${cy.year}/register/youth` },
  };
}

export default async function YouthRegisterPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("YouthRegister");

  const cy = findYear(slug);
  if (!cy) notFound();

  const tiers = activePricing(cy);
  const isOpen = tiers.length > 0;
  const youngAdultPriceCents = tiers.find((tr) => tr.category === "young_adult")?.priceCents;
  const adultFormHref = `/events/cacna-${cy.year}/register`;

  return (
    <main id="main-content">
      <Nav />

      <section style={{ background: "var(--cream)", padding: "clamp(112px,14vw,148px) clamp(20px,5vw,64px) clamp(36px,5vw,56px)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Link href={adultFormHref} style={{ display: "inline-flex", alignItems: "center", gap: 7, minHeight: 44, fontSize: 14, fontWeight: 700, color: "var(--ink-soft)", textDecoration: "none", marginBottom: 12 }}>
            <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> {t("backToRegister")}
          </Link>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,5.4vw,56px)", letterSpacing: "-0.03em", color: "var(--ink)", margin: 0, lineHeight: 1.04, textWrap: "balance" }}>
            {t("heroHeading", { year: cy.year })}
          </h1>
          <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.6, color: "var(--ink)" }}>{t("heroBody")}</p>
          <ul style={{ listStyle: "none", margin: "20px 0 0", padding: 0, display: "flex", flexWrap: "wrap", gap: "10px 22px", color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.5 }}>
            <li style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <CalendarDays size={18} strokeWidth={2} color="var(--red)" aria-hidden /> {dateRangeLabel(cy)}
            </li>
            <li style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <MapPin size={18} strokeWidth={2} color="var(--red)" aria-hidden /> {CONVENTION_VENUE}
            </li>
          </ul>
          {isOpen && (
            <p style={{ margin: "20px 0 0", padding: "12px 16px", borderRadius: 12, background: "var(--paper)", borderLeft: "4px solid var(--gold)", fontSize: 15, lineHeight: 1.5, color: "var(--ink)" }}>
              {youngAdultPriceCents !== undefined
                ? t("feeNoteWithPrice", { price: `$${(youngAdultPriceCents / 100).toFixed(0)}` })
                : t("feeNote")}
            </p>
          )}
          <p style={{ margin: "16px 0 0", fontSize: 15, color: "var(--ink-soft)" }}>
            {t("adultFormLead")}{" "}
            <Link href={adultFormHref} style={{ color: "var(--red)", fontWeight: 700, display: "inline-block", padding: "12px 0" }}>{t("adultFormLink")}</Link>
          </p>
        </div>
      </section>

      <section id="register-form" style={{ background: "var(--paper)", padding: "clamp(24px,5vw,56px) clamp(20px,5vw,64px) clamp(56px,7vw,90px)", scrollMarginTop: 72 }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {isOpen ? (
            <YouthRegisterForm year={cy.year} startIso={cy.startIso} youngAdultPriceCents={youngAdultPriceCents} />
          ) : (
            <div style={{ textAlign: "center", background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 20, padding: "clamp(32px,5vw,48px)" }}>
              <Sparkles size={28} strokeWidth={2} color="var(--gold)" aria-hidden style={{ marginBottom: 16 }} />
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,30px)", color: "var(--ink)", margin: "0 0 12px" }}>{t("notOpenHeading")}</h2>
              <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: 0 }}>{t("notOpenBody", { year: cy.year })}</p>
            </div>
          )}
          <ServeCallout style={{ marginTop: 32 }} />
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
