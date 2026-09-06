import { notFound } from "next/navigation";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Link from "next/link";
import { MapPin, CalendarDays, ArrowLeft, CalendarPlus, Download, Sparkles } from "lucide-react";
import { googleCalUrl, icsDataUri, isEventPast } from "@/lib/events";
import { SITE, SITE_URL, breadcrumbJsonLd } from "@/lib/site";
import {
  conventionYears,
  conventionChurchEvent,
  sessionsFor,
  dateRangeLabel,
  CONVENTION_VENUE,
  hasExternalRegistrationUrl,
  type ConventionYear,
} from "@/lib/conventions";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

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
  const { locale, slug } = await params;
  const cy = findYear(slug);
  if (!cy) return {};
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}/events/cacna-${cy.year}`]));
  return {
    title: `CACNA ${cy.year} Annual Convention — Christ Apostolic Church North America`,
    description: `Save the date: the CACNA ${cy.year} National Convention runs ${dateRangeLabel(cy)} at ${CONVENTION_VENUE}. Full schedule and registration details are announced closer to the date.`,
    alternates: { canonical: `${SITE_URL}/${locale}/events/cacna-${cy.year}`, languages },
  };
}

export default async function CACNAFutureYearPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const cy = findYear(slug);
  if (!cy) notFound();

  const ev = conventionChurchEvent(cy);
  const isPast = isEventPast(ev);
  const sessions = sessionsFor(cy);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    description: ev.desc,
    startDate: `${cy.startIso}T18:00:00-04:00`,
    endDate: `${cy.endIso}T22:00:00-04:00`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: `${SITE_URL}/images/logo.png`,
    url: `${SITE_URL}${ev.href}`,
    location: { "@type": "Place", name: "CAC Village", address: { "@type": "PostalAddress", streetAddress: "14051 Stahley Rd", addressLocality: "Blue Ridge Summit", addressRegion: "PA", postalCode: "17214", addressCountry: "US" } },
    organizer: { "@type": "Church", name: SITE.name, url: SITE_URL },
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/calendar" }, { name: `CACNA ${cy.year}`, path: ev.href }])).replace(/</g, "\\u003c") }} />
      <Nav heroDark />
      {isPast && (
        <div role="status" style={{ background: '#2c2825', padding: '13px clamp(20px,5vw,64px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px 20px', fontSize: 14, fontWeight: 600, color: 'rgba(245,246,250,.7)' }}>
          <span>This event has passed — page kept as an archive.</span>
          <Link href="/calendar" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap' }}>See upcoming events →</Link>
        </div>
      )}

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) clamp(80px,10vw,120px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -140, right: -120, width: 760, height: 600, background: "radial-gradient(circle,rgba(253,200,65,.25),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 18s ease-in-out infinite" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -80, left: -80, width: 500, height: 400, background: "radial-gradient(circle,rgba(200,30,58,.15),transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Link href="/calendar" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.6)", textDecoration: "none", marginBottom: 32 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> All events
            </Link>
          </Reveal>

          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Save the date</span>
          </Reveal>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6vw,80px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0 22px", lineHeight: 0.98, textWrap: "balance" }}>
            <RevealText immediate>{`CACNA ${cy.year}`}</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ color: "var(--gold)" }}>National Convention</RevealText>
          </h1>

          <Reveal delay={200}>
            <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(245,246,250,.72)", lineHeight: 1.7, maxWidth: 620, margin: "0 0 44px", textWrap: "pretty" }}>
              {dateRangeLabel(cy)} — {CONVENTION_VENUE}. The full schedule, theme, and registration will be announced closer to the date, but the dates and venue are confirmed today.
            </p>
          </Reveal>

          {!isPast && (
            <Reveal delay={280}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                {cy.registrationUrl ? (
                  hasExternalRegistrationUrl(cy) ? (
                    <a href={cy.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 40px rgba(253,200,65,.4)" }}>
                      {`Convention ${cy.year}`} →
                    </a>
                  ) : (
                    <Link href={cy.registrationUrl} className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 40px rgba(253,200,65,.4)" }}>
                      {`Convention ${cy.year}`} →
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
      </section>

      {/* Recurring day-by-day pattern */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 40 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--flame)" }}>What to expect</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.6vw,44px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 14px" }}>The rhythm stays the same</h2>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 640 }}>
              CACNA's convention follows the same six-day pattern every year — only the calendar dates change. Here is what {cy.year} will look like, based on that recurring rhythm.
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
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3.4vw,40px)", letterSpacing: "-1px", color: "var(--cream)", margin: 0 }}>Confirmed so far</h2>
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
          <p style={{ fontSize: 14, color: "rgba(245,246,250,.5)", marginTop: 28, lineHeight: 1.7 }}>
            Registration fees, the convention theme, and the ministers/speakers list will be announced closer to {dateRangeLabel(cy)} — check back on this page, or <Link href="/plan-your-visit" style={{ color: "inherit", textDecoration: "underline" }}>start planning your visit</Link> in the meantime.
          </p>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
