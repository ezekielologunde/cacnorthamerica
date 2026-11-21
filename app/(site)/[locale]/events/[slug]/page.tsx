import { notFound } from "next/navigation";
import "@/app/(site)/[locale]/mobile-events-media.css";
import { PastEventBanner } from "@/components/events/PastEventBanner";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Link from "next/link";
import Image from "next/image";
import { MapPin, CalendarDays, ArrowLeft, CalendarPlus, Download, Sparkles, Phone } from "lucide-react";
import { googleCalUrl, icsDataUri, isEventPast } from "@/lib/events";
import { SITE, SITE_URL, breadcrumbJsonLd } from "@/lib/site";
import {
  conventionYears,
  conventionChurchEvent,
  sessionsFor,
  activePricing,
  dateRangeLabel,
  CONVENTION_VENUE,
  hasExternalRegistrationUrl,
  type ConventionYear,
} from "@/lib/conventions";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 3600;

// 2026 (and every year before it) either has its own hand-built page
// (app/events/cacna-2026) or no detail page at all (2019/2020/2024, whose
// href points at /archive instead) — this "Save the Date" template is only
// appropriate for years that haven't happened yet, so it only ever actually
// renders for 2027 and beyond.
const FUTURE_YEARS = conventionYears.filter((cy) => cy.year > 2026);

export function generateStaticParams() {
  return FUTURE_YEARS.map((cy) => ({ slug: `cacna-${cy.year}` }));
}

function findYear(slug: string): ConventionYear | undefined {
  const match = /^cacna-(\d{4})$/.exec(slug);
  if (!match) return undefined;
  const year = Number(match[1]);
  return FUTURE_YEARS.find((cy) => cy.year === year);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const cy = findYear(slug);
  if (!cy) return {};
  const title = `CACNA ${cy.year} Annual Convention — Christ Apostolic Church North America`;
  const description = `${cy.theme ? `Theme: “${cy.theme}.” ` : "Save the date: "}The CACNA ${cy.year} National Convention runs ${dateRangeLabel(cy)} at ${CONVENTION_VENUE}. ${cy.registrationUrl ? "Registration is open." : "Full schedule and registration details are announced closer to the date."}`;
  const url = `${SITE_URL}/events/cacna-${cy.year}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, type: "website", siteName: SITE.name,
      ...(cy.flyers ? { images: [{ url: cy.flyers.leaders, width: 1122, height: 1402, alt: cy.flyers.alt.leaders }] } : {}),
    },
    twitter: {
      card: "summary_large_image" as const, title, description,
      ...(cy.flyers ? { images: [cy.flyers.leaders] } : {}),
    },
  };
}

const CATEGORY_LABEL: Record<string, string> = { adult: "Adults (30 and over)", young_adult: "Young adults (20–29)", child: "Children (ages 1–19)" };
const money = (cents: number) => (cents === 0 ? "Free" : `$${(cents / 100).toFixed(2)}`);
const shortDay = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));

export default async function CACNAFutureYearPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const cy = findYear(slug);
  if (!cy) notFound();

  const ev = conventionChurchEvent(cy);
  const isPast = isEventPast(ev);
  const sessions = sessionsFor(cy);
  const nowTiers = activePricing(cy);
  const tiersFor = (cat: string) => (cy.pricingTiers ?? []).filter((t) => t.category === cat);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    description: ev.desc,
    startDate: `${cy.startIso}T18:00:00-04:00`,
    endDate: `${cy.endIso}T22:00:00-04:00`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: `${SITE_URL}${cy.flyers?.leaders ?? "/images/logo.png"}`,
    url: `${SITE_URL}${ev.href}`,
    location: { "@type": "Place", name: "CAC Village", address: { "@type": "PostalAddress", streetAddress: "14051 Stahley Rd", addressLocality: "Blue Ridge Summit", addressRegion: "PA", postalCode: "17214", addressCountry: "US" } },
    organizer: { "@type": "Church", name: SITE.name, url: SITE_URL },
    performer: { "@type": "Church", name: SITE.name, url: SITE_URL },
    ...(nowTiers.length
      ? { offers: nowTiers.map((t) => ({ "@type": "Offer", name: CATEGORY_LABEL[t.category] ?? t.category, price: (t.priceCents / 100).toFixed(2), priceCurrency: "USD", availability: "https://schema.org/InStock", validThrough: t.endsOn, url: cy.registrationUrl ? (hasExternalRegistrationUrl(cy) ? cy.registrationUrl : `${SITE_URL}${cy.registrationUrl}`) : `${SITE_URL}${ev.href}` })) }
      : {}),
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/calendar" }, { name: `CACNA ${cy.year}`, path: ev.href }])).replace(/</g, "\\u003c") }} />
      <Nav heroDark />
      {isPast && <PastEventBanner />}

      {/* Hero */}
      <section className="mm-hero" style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) clamp(80px,10vw,120px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -140, right: -120, width: 760, height: 600, background: "radial-gradient(circle,rgba(253,200,65,.25),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 18s ease-in-out infinite" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -80, left: -80, width: 500, height: 400, background: "radial-gradient(circle,rgba(200,30,58,.15),transparent 65%)", pointerEvents: "none" }} />

        <style>{`.conv-hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(32px,5vw,60px);align-items:center}.conv-hero-grid.solo{grid-template-columns:1fr;max-width:960px!important}@media(max-width:900px){.conv-hero-grid{grid-template-columns:1fr}}`}</style>
        <div className={`conv-hero-grid${cy.flyers ? "" : " solo"}`} style={{ maxWidth: 1140, margin: "0 auto", position: "relative", zIndex: 2 }}>
         <div>
          <Reveal>
            <Link href="/calendar" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.6)", textDecoration: "none", marginBottom: 32 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> All events
            </Link>
          </Reveal>

          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>{cy.registrationUrl && !isPast ? "Registration open" : "Save the date"}</span>
          </Reveal>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6vw,80px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0 22px", lineHeight: 0.98, textWrap: "balance" }}>
            <RevealText immediate>{`CACNA ${cy.year}`}</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ color: "var(--gold)" }}>National Convention</RevealText>
          </h1>

          {cy.theme && (
            <Reveal delay={150}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,34px)", letterSpacing: "-.5px", lineHeight: 1.1, margin: "0 0 14px", background: "linear-gradient(95deg,#FFE08A,#FDC841 45%,#F28C38)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                Theme: “{cy.theme}”
              </p>
              {cy.scripture && (
                <p style={{ fontSize: 14.5, color: "rgba(245,246,250,.62)", lineHeight: 1.6, maxWidth: 560, margin: "0 0 22px", fontStyle: "italic" }}>
                  “{cy.scripture.text}” — {cy.scripture.reference}
                </p>
              )}
            </Reveal>
          )}
          <Reveal delay={200}>
            <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(245,246,250,.72)", lineHeight: 1.7, maxWidth: 620, margin: "0 0 44px", textWrap: "pretty" }}>
              {dateRangeLabel(cy)} — {CONVENTION_VENUE}.
            </p>
          </Reveal>

          {!isPast && (
            <Reveal delay={280}>
              <div className="mm-actions" style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                {cy.registrationUrl ? (
                  hasExternalRegistrationUrl(cy) ? (
                    <a href={cy.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 40px rgba(253,200,65,.4)" }}>
                      {`Register for ${cy.year}`} →
                    </a>
                  ) : (
                    <Link href={cy.registrationUrl} className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 40px rgba(253,200,65,.4)" }}>
                      {`Register for ${cy.year}`} →
                    </Link>
                  )
                ) : (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(253,200,65,.14)", border: "1px solid rgba(253,200,65,.3)", color: "var(--gold)", fontWeight: 700, fontSize: 15, padding: "16px 26px", borderRadius: 999 }}>
                    <Sparkles size={16} strokeWidth={2} aria-hidden /> Registration opens closer to the date
                  </span>
                )}
                <a href={googleCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "16px 28px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>
                  <CalendarPlus size={17} strokeWidth={2} aria-hidden /> Add to Calendar
                </a>
                <a href={icsDataUri(ev)} download={`cacna-${cy.year}.ics`} className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(245,246,250,.06)", color: "rgba(245,246,250,.7)", fontWeight: 700, fontSize: 14, padding: "16px 22px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.14)" }}>
                  <Download size={16} strokeWidth={2} aria-hidden /> Apple / Outlook
                </a>
              </div>
            </Reveal>
          )}
         </div>
          {cy.flyers && (
            <Reveal delay={160}>
              <a href={cy.flyers.leaders} target="_blank" rel="noopener noreferrer" style={{ display: "block", position: "relative", borderRadius: 24, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,.45)", border: "1px solid rgba(245,246,250,.12)" }}>
                <Image src={cy.flyers.leaders} alt={cy.flyers.alt.leaders} width={1122} height={1402} sizes="(max-width: 900px) 100vw, 520px" style={{ width: "100%", height: "auto", display: "block" }} preload />
              </a>
            </Reveal>
          )}
        </div>
      </section>

      {/* Registration fees */}
      {nowTiers.length > 0 && (
        <section className="mm-sec" style={{ background: "var(--paper)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <Reveal style={{ marginBottom: 32 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--flame)" }}>Registration fees</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.6vw,44px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 10px" }}>Register early, pay less</h2>
              <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 640, margin: 0 }}>
                The price steps up on the dates below. The tier open today is highlighted. Children and teenagers (ages 1–19) always register free.
              </p>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
              {(["adult", "young_adult", "child"] as const).map((cat) => (
                <Reveal key={cat}>
                  <div style={{ background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 20, padding: "22px 22px 18px", height: "100%" }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)", marginBottom: 14 }}>{CATEGORY_LABEL[cat]}</div>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                      {tiersFor(cat).map((t, ti, all) => {
                        const live = nowTiers.some((n) => n.category === t.category && n.startsOn === t.startsOn);
                        return (
                          <li key={t.startsOn} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14.5, padding: "8px 12px", borderRadius: 12, background: live ? "var(--ink)" : "transparent", color: live ? "#fff" : "var(--ink-soft)", fontWeight: live ? 800 : 500 }}>
                            <span>{cat === "child" ? "All dates" : ti === 0 ? `Through ${shortDay(t.endsOn)}` : ti === all.length - 1 ? "At the convention ground" : `${shortDay(t.startsOn)} – ${shortDay(t.endsOn)}`}{live ? " · now" : ""}</span>
                            <span style={{ color: live ? "var(--gold)" : "var(--ink)", fontWeight: 800 }}>{money(t.priceCents)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
            {cy.registrationUrl && !isPast && (
              <Reveal delay={120}>
                <div style={{ marginTop: 28 }}>
                  {hasExternalRegistrationUrl(cy) ? (
                    <a href={cy.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--ink)", color: "#fff", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none" }}>
                      Register now →
                    </a>
                  ) : (
                    <Link href={cy.registrationUrl} className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--ink)", color: "#fff", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none" }}>
                      Register now →
                    </Link>
                  )}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* Recurring day-by-day pattern */}
      <section className="mm-sec" style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 40 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--flame)" }}>What to expect</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.6vw,44px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 14px" }}>{cy.programme ? "The week at a glance" : "The rhythm stays the same"}</h2>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 640 }}>
              {cy.programme ? `Six days, ${dateRangeLabel(cy)}. Every night is a combined revival for all.` : `The convention follows the same six-day pattern every year. Here is what ${cy.year} will look like.`}
            </p>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sessions.map((s, i) => (
              <Reveal key={s.day} delay={i * 60}>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 24px" }}>
                  <div style={{ flexShrink: 0, minWidth: 92, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "var(--flame)" }}>{s.day}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)", marginBottom: 4 }}>{s.label}</div>
                    <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Logistics */}
      <section className="mm-sec" style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3.4vw,40px)", letterSpacing: "-1px", color: "var(--cream)", margin: 0 }}>{cy.theme ? "Venue & dates" : "Confirmed so far"}</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
            {[
              { icon: MapPin, label: "Venue", detail: CONVENTION_VENUE },
              { icon: CalendarDays, label: "Dates", detail: dateRangeLabel(cy) },
            ].map((item) => (
              <div key={item.label} style={{ background: "rgba(245,246,250,.05)", border: "1px solid rgba(245,246,250,.1)", borderRadius: 20, padding: "24px 22px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 12, background: "rgba(253,200,65,.15)", display: "grid", placeItems: "center" }}>
                  <item.icon size={19} strokeWidth={2} color="var(--gold)" aria-hidden />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 15, color: "var(--cream)", lineHeight: 1.5 }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
          {cy.highlights && (
            <ul style={{ listStyle: "none", margin: "24px 0 0", padding: 0, display: "flex", flexWrap: "wrap", gap: 10 }}>
              {cy.highlights.map((h) => (
                <li key={h} style={{ background: "rgba(253,200,65,.14)", border: "1px solid rgba(253,200,65,.3)", color: "var(--gold)", fontWeight: 700, fontSize: 14, padding: "9px 16px", borderRadius: 999 }}>{h}</li>
              ))}
            </ul>
          )}
          {cy.officers && (
            <div style={{ marginTop: 32 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>For further information, contact</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                {cy.officers.map((o) => (
                  <a key={o.phone} href={`tel:${o.phone.replace(/\D/g, "")}`} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(245,246,250,.07)", border: "1px solid rgba(245,246,250,.14)", borderRadius: 18, padding: "16px 20px", textDecoration: "none" }}>
                    <span style={{ flexShrink: 0, display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,var(--gold),#B8860B)" }}>
                      <Phone size={18} color="#fff" strokeWidth={2} aria-hidden />
                    </span>
                    <span>
                      <span style={{ display: "block", fontWeight: 700, fontSize: 14, color: "var(--cream)" }}>{o.name} ({o.role})</span>
                      <span style={{ display: "block", fontSize: 16, fontWeight: 800, color: "var(--gold)", fontFamily: "monospace" }}>{o.phone}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
          {!cy.theme && (
            <p style={{ fontSize: 14, color: "rgba(245,246,250,.5)", marginTop: 28, lineHeight: 1.7 }}>
              Registration fees, the convention theme, and the ministers/speakers list will be announced closer to {dateRangeLabel(cy)} — check back on this page, or <Link href="/plan-your-visit" style={{ color: "inherit", textDecoration: "underline" }}>start planning your visit</Link> in the meantime.
            </p>
          )}
        </div>
      </section>

      {/* Church leadership featured on the flyer */}
      {cy.leaders && cy.flyers && (
        <section className="mm-sec" style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
          <div style={{ maxWidth: 1040, margin: "0 auto" }}>
            <Reveal style={{ marginBottom: 32 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--flame)" }}>Leadership</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.6vw,44px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 10px" }}>Convention leadership</h2>
              <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 640, margin: 0 }}>The church leaders featured on this year’s flyer.</p>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
              {cy.leaders.map((g, i) => (
                <Reveal key={g.name} delay={i * 60}>
                  <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, overflow: "hidden", height: "100%" }}>
                    <div style={{ position: "relative", aspectRatio: "1 / 1", background: "var(--line)" }}>
                      <Image src={g.photo} alt={g.name} fill sizes="200px" style={{ objectFit: "cover", objectPosition: "center 20%" }} />
                    </div>
                    <div style={{ padding: "14px 16px 18px" }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)", lineHeight: 1.25 }}>{g.name}</div>
                      <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.45, marginTop: 4 }}>{g.title}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div style={{ marginTop: 44, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "center", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 24, padding: "20px 22px" }}>
                <a href={cy.flyers.programme} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "min(100%, 220px)", borderRadius: 14, overflow: "hidden", boxShadow: "0 14px 34px rgba(18,20,30,.2)" }}>
                  <Image src={cy.flyers.programme} alt={cy.flyers.alt.programme} width={1122} height={1402} sizes="220px" style={{ width: "100%", height: "auto", display: "block" }} />
                </a>
                <div style={{ flex: "1 1 240px", maxWidth: 420 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--ink)", marginBottom: 8 }}>The full flyer</div>
                  <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>
                    Registration fees, the daily programme and the convention contacts, as printed. Tap the flyer to open it full size, save it or share it.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <FooterExperience />
    </main>
  );
}
