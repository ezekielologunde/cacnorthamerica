import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowDown, ArrowLeft, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { RegisterForm } from "@/components/register/RegisterForm";
import { CONVENTION_VENUE, conventionYears, dateRangeLabel, activePricing, type ConventionYear } from "@/lib/conventions";
import { registrationGuidelines } from "@/lib/registrationInfo";
import { PaymentOptions } from "@/components/register/PaymentOptions";
import { QuickHelp } from "@/components/register/QuickHelp";
import { ServeCallout } from "@/components/ServeCallout";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/lib/site";

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

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const cy = findYear(slug);
  if (!cy) return {};
  return {
    title: `Register — CACNA ${cy.year} Annual Convention`,
    description: `Register for the CACNA ${cy.year} Annual Convention, ${dateRangeLabel(cy)} at ${CONVENTION_VENUE}.`,
    alternates: { canonical: `${SITE_URL}/events/cacna-${cy.year}/register` },
  };
}

export default async function RegisterPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Register");

  const cy = findYear(slug);
  if (!cy) notFound();

  const tiers = activePricing(cy);
  const isOpen = tiers.length > 0;
  const adultPrice = tiers.find((t) => t.category === "adult")?.priceCents;
  // Child is always free regardless of the active tier window (the same
  // unconditional rule app/api/register/route.ts applies server-side) --
  // baked in here so the form's live total matches what checkout will
  // actually charge.
  const priceMap: Partial<Record<"adult" | "young_adult" | "child", number>> = { child: 0 };
  for (const tier of tiers) priceMap[tier.category] = tier.priceCents;

  // Full fee ladder -- every tier for this year, not just today's active
  // one, so visitors can see the whole early-bird schedule at a glance.
  // Ported from Convention's own PricingCards during the Phase H
  // data-completeness audit (2026-09).
  const activeTierKeys = new Set(tiers.map((tr) => `${tr.category}-${tr.startsOn}`));
  const allTiers = cy.pricingTiers ?? [];
  const CATEGORY_ORDER: { category: "adult" | "young_adult" | "child"; labelKey: "categoryAdult" | "categoryYoungAdult" | "categoryChild" }[] = [
    { category: "adult", labelKey: "categoryAdult" },
    { category: "young_adult", labelKey: "categoryYoungAdult" },
    { category: "child", labelKey: "categoryChild" },
  ];
  const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
  // Hero rate card: today's adult tier and the one that replaces it.
  const adultTiers = allTiers.filter((tr) => tr.category === "adult").sort((a, b) => a.startsOn.localeCompare(b.startsOn));
  const currentAdult = adultTiers.find((tr) => activeTierKeys.has(`${tr.category}-${tr.startsOn}`));
  const nextAdult = currentAdult ? adultTiers.find((tr) => tr.startsOn > currentAdult.startsOn) : undefined;
  const pricingLadder = CATEGORY_ORDER.map(({ category, labelKey }) => {
    const rows = allTiers.filter((tr) => tr.category === category).sort((a, b) => a.startsOn.localeCompare(b.startsOn));
    const lastStartsOn = rows.reduce((max, tr) => (tr.startsOn > max ? tr.startsOn : max), "");
    return {
      category,
      label: t(labelKey),
      tiers: rows.map((tr) => ({
        key: `${tr.category}-${tr.startsOn}`,
        priceLabel: tr.priceCents === 0 ? "Free" : `$${(tr.priceCents / 100).toFixed(0)}`,
        dateLabel: tr.startsOn === lastStartsOn ? "At the Convention Ground" : `Through ${shortDate.format(new Date(`${tr.endsOn}T12:00:00Z`))}`,
        isCurrent: activeTierKeys.has(`${tr.category}-${tr.startsOn}`),
      })),
    };
  });

  return (
    <main id="main-content">
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "clamp(120px,16vw,164px) clamp(20px,5vw,64px) clamp(56px,7vw,88px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -140, right: -120, width: 720, height: 560, background: "radial-gradient(circle,rgba(253,200,65,.22),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: "clamp(36px,6vw,72px)", alignItems: "center" }}>
          <div>
            <Reveal>
              <Link href={cy.href} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 700, color: "rgba(245,246,250,.72)", textDecoration: "none", marginBottom: 28 }}>
                <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> Back to Convention {cy.year}
              </Link>
            </Reveal>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6.4vw,80px)", letterSpacing: "-0.035em", color: "#fff", margin: 0, lineHeight: 0.98, textWrap: "balance" }}>
              <RevealText immediate>{t("heroHeading", { year: cy.year })}</RevealText>
            </h1>
            <Reveal delay={120}>
              <ul style={{ listStyle: "none", margin: "28px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 12, color: "rgba(245,246,250,.82)", fontSize: 16, lineHeight: 1.5 }}>
                <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <CalendarDays size={20} strokeWidth={2} color="var(--gold)" aria-hidden style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{dateRangeLabel(cy)}</span>
                </li>
                <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <MapPin size={20} strokeWidth={2} color="var(--gold)" aria-hidden style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{CONVENTION_VENUE}</span>
                </li>
              </ul>
            </Reveal>
            {isOpen && (
              <Reveal delay={200}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 36 }}>
                  <a
                    href="#register-form"
                    className="btn-sheen press"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 52, padding: "0 28px", borderRadius: 999, background: "linear-gradient(100deg,var(--red-deep),var(--red))", color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none" }}
                  >
                    Start registration <ArrowDown size={18} strokeWidth={2.5} aria-hidden />
                  </a>
                  <a
                    href="#registration-fees"
                    className="press"
                    style={{ display: "inline-flex", alignItems: "center", minHeight: 52, padding: "0 24px", borderRadius: 999, border: "1.5px solid rgba(245,246,250,.35)", color: "#fff", fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}
                  >
                    See all rates
                  </a>
                </div>
                <p style={{ margin: "18px 0 0", fontSize: 15.5, lineHeight: 1.5, color: "rgba(245,246,250,.82)" }}>
                  {t("youthCalloutLead")}{" "}
                  <Link href={`/events/cacna-${cy.year}/register/youth`} style={{ color: "var(--gold)", fontWeight: 800, display: "inline-block", padding: "10px 0" }}>
                    {t("youthCalloutLink")}
                  </Link>
                </p>
              </Reveal>
            )}
          </div>

          {isOpen && adultPrice !== undefined && (
            <Reveal delay={160}>
              <div style={{ position: "relative", background: "var(--cream)", borderRadius: 26, boxShadow: "0 28px 60px -24px rgba(0,0,0,.6), 0 6px 14px -6px rgba(0,0,0,.35)", maxWidth: 440, width: "100%", marginInline: "auto" }}>
                <div style={{ padding: "30px 32px 26px" }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--ink-soft)" }}>Adult rate today</p>
                  <p style={{ margin: "6px 0 0", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(56px,8vw,76px)", lineHeight: 1, letterSpacing: "-0.03em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
                    ${(adultPrice / 100).toFixed(0)}
                  </p>
                  {currentAdult && (
                    <p style={{ margin: "10px 0 0", fontSize: 15, color: "var(--ink-soft)" }}>Through {shortDate.format(new Date(`${currentAdult.endsOn}T12:00:00Z`))}</p>
                  )}
                </div>
                <div aria-hidden style={{ position: "relative", height: 0, borderTop: "2px dashed var(--line)" }}>
                  <span style={{ position: "absolute", left: -13, top: -14, width: 26, height: 26, borderRadius: "50%", background: "var(--ink)" }} />
                  <span style={{ position: "absolute", right: -13, top: -14, width: 26, height: 26, borderRadius: "50%", background: "var(--ink)" }} />
                </div>
                <div style={{ padding: "22px 32px 28px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {nextAdult && (
                    <p style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: "var(--red)" }}>
                      Rises to ${(nextAdult.priceCents / 100).toFixed(0)} on {shortDate.format(new Date(`${nextAdult.startsOn}T12:00:00Z`))}
                    </p>
                  )}
                  <p style={{ margin: 0, fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                    {priceMap.young_adult !== undefined && <>Young adults ${(priceMap.young_adult / 100).toFixed(0)} · </>}
                    Children free · Under 30s register on the{" "}
                    <Link href={`/events/cacna-${cy.year}/register/youth`} style={{ color: "var(--red)", fontWeight: 700 }}>Youth &amp; Child form</Link>
                  </p>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Full fee ladder */}
      {isOpen && (
        <section id="registration-fees" style={{ background: "var(--cream)", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px) 0", scrollMarginTop: 72 }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,30px)", color: "var(--ink)", margin: "0 0 8px" }}>{t("pricingHeading")}</h2>
            <p style={{ margin: "0 0 20px", fontSize: 15, lineHeight: 1.5, color: "var(--ink-soft)" }}>
              {t("pricingYouthNote")}{" "}
              <Link href={`/events/cacna-${cy.year}/register/youth`} style={{ color: "var(--red)", fontWeight: 700, display: "inline-block", padding: "10px 0" }}>
                {t("youthCalloutLink")}
              </Link>
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
              {pricingLadder.map((cat) => (
                <div key={cat.category} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 22px" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "var(--ink)", margin: "0 0 14px" }}>{cat.label}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {cat.tiers.map((tier) => (
                      <div key={tier.key} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, borderRadius: 10, padding: "8px 10px", background: tier.isCurrent ? "var(--cream-2)" : "transparent" }}>
                        <span>
                          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--ink)" }}>{tier.priceLabel}</span>
                          <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-soft)", marginTop: 2 }}>{tier.dateLabel}</span>
                        </span>
                        {tier.isCurrent && (
                          <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 800, letterSpacing: "0.5px", textTransform: "uppercase", color: "#fff", background: "var(--red)", borderRadius: 999, padding: "4px 10px" }}>
                            {t("pricingCurrentBadge")}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Form / not-open state */}
      <section id="register-form" style={{ background: "var(--paper)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)", scrollMarginTop: 72 }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {isOpen ? (
            <RegisterForm year={cy.year} startIso={cy.startIso} priceMap={priceMap} />
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
          <ServeCallout style={{ marginTop: 32 }} />
        </div>
      </section>

      {/* Registration guidelines + payment options */}
      <section style={{ background: "var(--cream-2)", padding: "0 clamp(20px,5vw,64px) clamp(64px,8vw,100px)" }}>
        <div className="r2" style={{ maxWidth: 900, margin: "0 auto", gap: 40 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,30px)", color: "var(--ink)", margin: "0 0 16px" }}>{t("guidelinesHeading")}</h2>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {registrationGuidelines.items.map((item, i) => (
                <li key={item} style={{ display: "flex", gap: 10, fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>
                  <span style={{ color: "var(--red)", fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span> {item}
                </li>
              ))}
            </ol>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--red)", marginTop: 16 }}>{registrationGuidelines.freeFoodNote}</p>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,30px)", color: "var(--ink)", margin: "0 0 16px" }}>{t("paymentOptionsHeading")}</h2>
            <PaymentOptions />
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <QuickHelp />
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
