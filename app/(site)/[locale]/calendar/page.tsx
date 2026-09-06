import { createClient } from "@supabase/supabase-js";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { MonthCalendar } from "@/components/calendar/MonthCalendar";
import { IconBadge } from "@/components/ui/IconBadge";
import Link from "next/link";
import { CalendarPlus, Download, Circle, ArrowDown, Users, BookOpen, GraduationCap, HeartHandshake } from "lucide-react";
import { specialEvents, annualMoments, googleCalUrl, icsDataUri, splitByDate, type ChurchEvent } from "@/lib/events";
import { SITE, SITE_URL } from "@/lib/site";
import { conventionYears, currentOrNextConvention, dateRangeLabel, CONVENTION_VENUE_SHORT } from "@/lib/conventions";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

const MOMENT_ICONS: Record<string, typeof Users> = {
  "cacna-convention": Users,
  "ministers-retreat": BookOpen,
  "sunday-school-rally": GraduationCap,
  "good-women-marathon": HeartHandshake,
};

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}/calendar`]));
  return {
    title: "Calendar & Events — Christ Apostolic Church North America (CACNA)",
    description:
      "CACNA's annual rhythm and special events — the Annual Convention, Ministers Retreat, Sunday School Rally, and more. Save any of them to Google, Apple, or Outlook.",
    alternates: { canonical: `${SITE_URL}/${locale}/calendar`, languages },
  };
}

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function toIso(s: string): string {
  const mo = parseInt(s.slice(4, 6), 10);
  const off = mo >= 3 && mo <= 10 ? "-04:00" : "-05:00";
  return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}T${s.slice(9,11)}:${s.slice(11,13)}:00${off}`;
}

function evPlace(id: string) {
  if (id.startsWith("cacna-convention-"))
    return { "@type": "Place", name: "CAC Village", address: { "@type": "PostalAddress", streetAddress: "14051 Stahley Rd", addressLocality: "Blue Ridge Summit", addressRegion: "PA", postalCode: "17214", addressCountry: "US" } };
  if (id === "holy-land-pilgrimage-2026")
    return { "@type": "Place", name: "Israel & Egypt (departing JFK)", address: { "@type": "PostalAddress", addressCountry: "IL" } };
  return { "@type": "Place", name: SITE.name, address: { "@type": "PostalAddress", streetAddress: SITE.address.street, addressLocality: SITE.address.city, addressRegion: SITE.address.region, postalCode: SITE.address.postalCode, addressCountry: SITE.address.country } };
}

function evOffers(id: string) {
  if (id === "holy-land-pilgrimage-2026")
    return { "@type": "Offer", price: "4549", priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${SITE_URL}/events/pilgrimage-2026` };
  return { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" };
}

type DbEventRow = {
  id: string; title: string; description: string | null;
  event_date: string; end_date: string | null;
  location: string | null; event_url: string | null;
};

function dbEventToChurchEvent(e: DbEventRow): ChurchEvent {
  const start = new Date(e.event_date);
  const end = e.end_date ? new Date(e.end_date) : start;
  const pad = (n: number) => n.toString().padStart(2, "0");
  const toLocal = (dt: Date) =>
    `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00`;
  return {
    id: e.id,
    title: e.title,
    desc: e.description ?? "",
    dateLabel: start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }),
    timeLabel: start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }) + " ET",
    month: MONTHS[start.getUTCMonth()],
    day: pad(start.getUTCDate()),
    startLocal: toLocal(start),
    endLocal: toLocal(end),
    href: e.event_url ?? undefined,
  };
}

function AddToCalendar({ ev, dark = false }: { ev: ChurchEvent; dark?: boolean }) {
  const ghost = dark
    ? { color: "var(--cream)", border: "1.5px solid rgba(245,246,250,.28)", background: "rgba(245,246,250,.06)" }
    : { color: "var(--ink)", border: "1.5px solid var(--line)", background: "var(--paper)" };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      <a href={googleCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 14, padding: "11px 18px", borderRadius: 999, textDecoration: "none", boxShadow: "0 8px 20px rgba(200,30,58,.3)" }}>
        <CalendarPlus size={16} strokeWidth={2} aria-hidden /> Google
      </a>
      <a href={icsDataUri(ev)} download={`${ev.id}.ics`} className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, padding: "11px 18px", borderRadius: 999, textDecoration: "none", ...ghost }}>
        <Download size={16} strokeWidth={2} aria-hidden /> Apple / Outlook
      </a>
    </div>
  );
}

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { data: dbRows } = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
    .from("events")
    .select("id, title, description, event_date, end_date, location, event_url")
    .eq("published", true)
    .order("event_date");

  const dynamicEvents = (dbRows ?? []).map(dbEventToChurchEvent);
  const allEvents = [...specialEvents, ...dynamicEvents];
  const { upcoming: upcomingSpecial, past } = splitByDate(allEvents);

  const activeYear = currentOrNextConvention().year;
  const futureConventions = conventionYears.filter((cy) => cy.year !== activeYear);

  const eventsJsonLd = upcomingSpecial.length > 0 ? {
    "@context": "https://schema.org",
    "@graph": upcomingSpecial.map((ev) => ({
      "@type": "Event",
      name: ev.title,
      description: ev.desc,
      startDate: toIso(ev.startLocal),
      endDate: toIso(ev.endLocal),
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      image: `${SITE_URL}/images/logo.png`,
      url: ev.href ? `${SITE_URL}${ev.href}` : `${SITE_URL}/calendar`,
      location: evPlace(ev.id),
      organizer: { "@type": "Church", name: SITE.name, url: SITE_URL },
      offers: evOffers(ev.id),
    })),
  } : null;

  return (
    <main id="main-content">
      {eventsJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 90px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 620, height: 460, background: "radial-gradient(circle,rgba(253,200,65,.22),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Calendar &amp; Events</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(46px,7vw,98px)", letterSpacing: "-2.2px", color: "#fff", margin: "16px 0", lineHeight: 0.93 }}>
              Every gathering,<br />
              <span style={{ color: "var(--red)" }}>one calendar.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(245,246,250,.72)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto" }}>
              CACNA's annual rhythm and special gatherings — save any of them to your phone in one tap.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 34 }}>
              {[
                { href: "#this-month", label: "This month" },
                { href: "#special-gatherings", label: "Special gatherings" },
                { href: "#future-dates", label: "Future dates" },
                { href: "#annual-rhythm", label: "Annual rhythm" },
              ].map((l) => (
                <a key={l.href} href={l.href} className="press" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.82)",
                  border: "1.5px solid rgba(245,246,250,.22)", background: "rgba(245,246,250,.05)",
                  borderRadius: 999, padding: "9px 18px", textDecoration: "none",
                }}>
                  {l.label} <ArrowDown size={13} strokeWidth={2.5} aria-hidden />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Month calendar */}
      <section id="this-month" style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px) clamp(56px,7vw,90px)", scrollMarginTop: 90 }}>
        <style>{`
          .cal-layout { grid-template-columns: minmax(0,1fr) 260px; }
          @media (max-width: 780px) { .cal-layout { grid-template-columns: 1fr; } }
        `}</style>
        <div className="cal-layout" style={{ maxWidth: 1040, margin: "0 auto", display: "grid", gap: 28, alignItems: "start" }}>
          <Reveal>
            <MonthCalendar events={allEvents} />
          </Reveal>
          <Reveal delay={100}>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 24, padding: "24px 22px", boxShadow: "0 10px 26px rgba(18,20,30,.05)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 14 }}>How to read it</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <Circle size={9} fill="var(--red)" color="var(--red)" aria-hidden />
                <span style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>A gathering is happening that day — tap it for details.</span>
              </div>
              <div style={{ height: 1, background: "var(--line)", marginBottom: 18 }} />
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 12 }}>Jump to</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="#special-gatherings" style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", textDecoration: "none" }}>Special gatherings →</a>
                <a href="#future-dates" style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", textDecoration: "none" }}>Future dates →</a>
                <a href="#annual-rhythm" style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", textDecoration: "none" }}>Annual rhythm →</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Special events */}
      <section id="special-gatherings" style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)", scrollMarginTop: 24 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 40 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Coming Up</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1px", color: "var(--cream)", margin: "12px 0 0" }}>Special gatherings</h2>
          </Reveal>
          {upcomingSpecial.length === 0 ? (
            <Reveal>
              <p style={{ fontSize: 16, color: "rgba(245,246,250,.6)", lineHeight: 1.7 }}>
                No special events on the calendar right now — check back soon.
              </p>
            </Reveal>
          ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {upcomingSpecial.map((ev, i) => (
              <Reveal key={ev.id} delay={i * 90}>
                <div className="card-lift" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,36px)", alignItems: "center", background: "rgba(245,246,250,.05)", borderRadius: 24, padding: "clamp(22px,3vw,32px)", border: "1px solid rgba(245,246,250,.1)" }}>
                  <div style={{ flexShrink: 0, width: 104, height: 104, borderRadius: 20, background: "linear-gradient(150deg,var(--flame),var(--red))", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: 1, boxShadow: "0 14px 30px rgba(200,30,58,.3)" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "1.5px" }}>{ev.month}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 44 }}>{ev.day}</span>
                  </div>
                  <div style={{ flex: "1 1 280px", minWidth: 0 }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,2.6vw,30px)", letterSpacing: "-.5px", color: "var(--cream)", margin: "0 0 6px" }}>{ev.title}</h3>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", marginBottom: 10 }}>{ev.dateLabel} · {ev.timeLabel}</div>
                    <p style={{ fontSize: 15.5, color: "rgba(245,246,250,.7)", lineHeight: 1.65, margin: "0 0 18px" }}>{ev.desc}</p>
                    <AddToCalendar ev={ev} dark />
                    {ev.href && (
                      <Link href={ev.href} className="press" style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 16, fontSize: 14, fontWeight: 700, color: "var(--gold)", textDecoration: "none" }}>
                        See full details <span aria-hidden style={{ fontSize: 16 }}>→</span>
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Past special events — auto-populated once end date passes */}
      {past.length > 0 && (
        <section style={{ background: "var(--cream)", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <Reveal style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3.5vw,42px)", letterSpacing: "-1px", color: "var(--ink-soft)", margin: 0 }}>Past events</h2>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {past.map((ev, i) => (
                <Reveal key={ev.id} delay={i * 70}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(16px,2.5vw,28px)", alignItems: "center", background: "var(--paper)", borderRadius: 22, padding: "clamp(18px,2.5vw,26px)", border: "1px solid var(--line)", opacity: 0.82 }}>
                    <div style={{ flexShrink: 0, width: 88, height: 88, borderRadius: 18, background: "linear-gradient(150deg,#8a8480,#6b6560)", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px" }}>{ev.month}</span>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 38 }}>{ev.day}</span>
                    </div>
                    <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                      <div style={{ display: "inline-block", fontSize: 10, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", background: "#edeae6", color: "#888780", padding: "3px 10px", borderRadius: 999, marginBottom: 8 }}>Archived</div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(18px,2.2vw,26px)", letterSpacing: "-.5px", color: "var(--ink-soft)", margin: "0 0 5px" }}>{ev.title}</h3>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 8 }}>{ev.dateLabel} · {ev.timeLabel}</div>
                      {ev.href && (
                        <Link href={ev.href} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--ink-soft)", textDecoration: "none" }}>
                          View archived page <span aria-hidden>→</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Future Convention dates — confirmed venue/dates, details TBA */}
      {futureConventions.length > 0 && (
        <section id="future-dates" style={{ background: "var(--paper)", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px)", scrollMarginTop: 24 }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <Reveal style={{ marginBottom: 32 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--flame)" }}>Looking further ahead</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.6vw,44px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 0" }}>Future Convention dates</h2>
              <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 600, margin: "14px 0 0" }}>
                The venue never changes — every CACNA Convention meets at {CONVENTION_VENUE_SHORT}. Themes, registration, and full schedules are announced closer to each date.
              </p>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
              {futureConventions.map((cy, i) => (
                <Reveal key={cy.year} delay={i * 70}>
                  <Link href={cy.href} className="card-lift" style={{ display: "block", background: "var(--cream-2)", border: "1px solid var(--line)", borderRadius: 18, padding: "22px 22px", textDecoration: "none" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--ink)", letterSpacing: "-.5px" }}>{cy.year}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--red)", margin: "6px 0 4px" }}>{dateRangeLabel(cy)}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{CONVENTION_VENUE_SHORT}</div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Annual moments */}
      <section id="annual-rhythm" style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px) clamp(70px,9vw,110px)", scrollMarginTop: 24 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 36 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Mark your year</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 10px" }}>Annual moments</h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, margin: 0, maxWidth: 620 }}>The yearly gatherings that mark CACNA's calendar. Firm dates are announced on this site as they approach.</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {annualMoments.map((m, i) => {
              const Icon = MOMENT_ICONS[m.id] ?? Users;
              const featured = m.id === "cacna-convention";
              return (
                <Reveal key={m.id} delay={(i % 3) * 70} style={featured ? { gridColumn: "1 / -1" } : undefined}>
                  <div className="card-lift" style={{
                    height: "100%", display: featured ? "flex" : "block", alignItems: featured ? "center" : undefined,
                    gap: featured ? 24 : 0, flexWrap: "wrap",
                    background: featured ? "linear-gradient(135deg,var(--ink),#1c2030)" : "var(--paper)",
                    border: featured ? "none" : "1px solid var(--line)",
                    borderRadius: 20, padding: "22px 22px 24px",
                    boxShadow: featured ? "0 16px 36px rgba(18,20,30,.16)" : "0 6px 18px rgba(18,20,30,.04)",
                  }}>
                    <IconBadge icon={Icon} size={44} iconSize={20}
                      bg={featured ? "rgba(253,200,65,.14)" : "var(--cream-2)"}
                      color={featured ? "var(--gold)" : "var(--red)"}
                      style={{ marginBottom: featured ? 0 : 14 }} />
                    <div style={{ flex: featured ? "1 1 260px" : undefined, marginTop: featured ? 0 : 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: featured ? "var(--gold)" : "var(--red)", margin: featured ? "14px 0 6px" : "14px 0 8px" }}>{m.when}</div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: featured ? "clamp(22px,2.6vw,28px)" : 19, letterSpacing: "-.3px", color: featured ? "var(--cream)" : "var(--ink)", margin: "0 0 8px", lineHeight: 1.2 }}>{m.title}</h3>
                      <p style={{ fontSize: featured ? 14.5 : 13.5, color: featured ? "rgba(245,246,250,.72)" : "var(--ink-soft)", lineHeight: 1.6, margin: 0, maxWidth: featured ? 520 : undefined }}>{m.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Watch online CTA */}
      <section style={{ background: "var(--ink)", padding: "clamp(44px,5vw,70px) clamp(20px,5vw,64px)" }}>
        <Reveal style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,38px)", letterSpacing: "-.6px", color: "var(--cream)", margin: "0 0 8px" }}>Can&apos;t be there in person?</h2>
            <p style={{ fontSize: 15, color: "rgba(245,246,250,.6)", margin: 0 }}>The Annual Convention streams live — YouTube and Zoom. Never miss a message.</p>
          </div>
          <Link href="/online" className="press btn-sheen" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 15, padding: "15px 28px", borderRadius: 999, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, boxShadow: "0 10px 24px rgba(200,30,58,.35)" }}>
            Watch online →
          </Link>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
