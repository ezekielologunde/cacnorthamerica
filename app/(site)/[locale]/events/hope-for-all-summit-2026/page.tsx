import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Link from "next/link";
import { HandHeart, Phone, ArrowLeft, CalendarPlus, Download, Video, Users } from "lucide-react";
import { specialEvents, googleCalUrl, icsDataUri, isEventPast } from "@/lib/events";
import { SITE, SITE_URL, breadcrumbJsonLd } from "@/lib/site";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}/events/hope-for-all-summit-2026`]));
  return {
    title: "Hope For All Initiative — Annual Summit | CAC North America",
    description:
      "Hope For All Initiative 2026 Summit — Church Growth Through Empowerment and Welfare. Saturday, September 12, 2026, 10:00 AM to 2:00 PM ET, on Zoom.",
    alternates: { canonical: `${SITE_URL}/${locale}/events/hope-for-all-summit-2026`, languages },
  };
}

const ev = specialEvents.find((e) => e.id === "hope-for-all-summit-2026")!;

const JOIN_URL = "https://us05web.zoom.us/j/89882749924?pwd=MUkPh5ejoZ4jsPQIHSLtc2QDsgYs61.1";
const MEETING_ID = "898 8274 9924";
const PASSCODE = "HOPE4ALL";

const leaders = [
  { name: "Pastor T.A.O. Agbeja, PhD", role: "Regional Superintendent, CAC Latunde Region" },
  { name: "Pastor S.O. Oladele", role: "President, CAC Nigeria & Overseas" },
  { name: "Pastor R.O. Adeagbo, PhD", role: "HFA Program Director" },
];

const guestSpeakers = [
  { name: "Pastor Olufemi Olaluwoye", role: "Guest Speaker" },
  { name: "Modupe Joseph Otusanya", role: "Guest Speaker" },
  { name: "Pastor (Dr.) Praise Agampa", role: "Guest Speaker" },
];

const dialIn = [
  { label: "US", number: "+1 309 205 3325,,89882749924#,,,,*14943045#" },
  { label: "US (Chicago)", number: "+1 312 626 6799,,89882749924#,,,,*14943045#" },
];

export default async function HopeForAllSummit2026Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isPast = isEventPast(ev);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    description: ev.desc,
    startDate: "2026-09-12T10:00:00-04:00",
    endDate: "2026-09-12T14:00:00-04:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: { "@type": "VirtualLocation", url: JOIN_URL },
    organizer: { "@type": "Church", name: SITE.name, url: SITE_URL },
    url: `${SITE_URL}/events/hope-for-all-summit-2026`,
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/calendar" }, { name: ev.navLabel ?? ev.title, path: "/events/hope-for-all-summit-2026" }])).replace(/</g, "\\u003c") }} />
      <Nav heroDark />
      {isPast && (
        <div role="status" style={{ background: "#2c2825", padding: "13px clamp(20px,5vw,64px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px 20px", fontSize: 14, fontWeight: 600, color: "rgba(245,246,250,.7)" }}>
          <span>This event has passed — page kept as an archive.</span>
          <Link href="/calendar" style={{ color: "var(--gold)", fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>See upcoming events →</Link>
        </div>
      )}

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) clamp(80px,10vw,120px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 640, height: 520, background: "radial-gradient(circle,rgba(45,66,201,.3),transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Link href="/calendar" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.6)", textDecoration: "none", marginBottom: 32 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> All events
            </Link>
          </Reveal>

          <Reveal>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>
              Hope For All Initiative
            </div>
          </Reveal>

          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24, background: "rgba(45,66,201,.18)", border: "1px solid rgba(45,66,201,.4)", borderRadius: 999, padding: "8px 18px" }}>
              <Video size={15} strokeWidth={2.5} color="var(--gold)" aria-hidden />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)" }}>On Zoom</span>
            </div>
          </Reveal>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6.5vw,86px)", letterSpacing: "-0.035em", color: "#fff", margin: "0 0 20px", lineHeight: 0.94, textWrap: "balance" }}>
            <RevealText immediate>Annual</RevealText>
            <br />
            <RevealText immediate delay={0.12} style={{ color: "var(--red)" }}>
              Summit
            </RevealText>
          </h1>

          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.9vw,20px)", color: "rgba(245,246,250,.72)", lineHeight: 1.72, maxWidth: 580, margin: "0 0 8px", textWrap: "pretty" }}>
              Theme: <strong style={{ color: "#fff" }}>Church Growth Through Empowerment and Welfare</strong>. Saturday, September 12, 2026 — 10:00 AM to 2:00 PM ET.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 36 }}>
              {!isPast && (
                <a href={JOIN_URL} target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 40px rgba(253,200,65,.35)" }}>
                  <Video size={17} strokeWidth={2} aria-hidden /> Join on Zoom →
                </a>
              )}
              <a href={googleCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "16px 28px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>
                <CalendarPlus size={17} strokeWidth={2} aria-hidden /> Add to Calendar
              </a>
              <a href={icsDataUri(ev)} download="hope-for-all-summit-2026.ics" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(245,246,250,.06)", color: "rgba(245,246,250,.7)", fontWeight: 700, fontSize: 14, padding: "16px 22px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.14)" }}>
                <Download size={16} strokeWidth={2} aria-hidden /> Apple / Outlook
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Speakers */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 14 }}>Ministering the Word</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,50px)", letterSpacing: "-.8px", color: "var(--ink)", margin: 0 }}>
              Leadership and guest speakers.
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18, marginBottom: 18 }}>
            {leaders.map((p, i) => (
              <Reveal key={p.name} delay={i * 70}>
                <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "26px 24px", height: "100%" }}>
                  <div style={{ display: "grid", placeItems: "center", width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg,var(--blue),var(--ink))", marginBottom: 16 }}>
                    <Users size={22} color="#fff" strokeWidth={1.9} aria-hidden />
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "var(--ink)", marginBottom: 6 }}>{p.name}</div>
                  <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5 }}>{p.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
            {guestSpeakers.map((p, i) => (
              <Reveal key={p.name} delay={(leaders.length + i) * 70}>
                <div style={{ background: "transparent", border: "1px dashed var(--line)", borderRadius: 20, padding: "22px 24px", height: "100%" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink)", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{p.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Zoom access details */}
      {!isPast && (
        <section style={{ background: "var(--paper)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)", borderTop: "1px solid var(--line)" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <Reveal style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 14 }}>Join details</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.6vw,40px)", letterSpacing: "-.6px", color: "var(--ink)", margin: 0 }}>
                Everything you need for Zoom.
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <div style={{ background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 20, padding: "clamp(24px,4vw,36px)" }}>
                <div style={{ display: "grid", gap: 14, fontSize: 15, color: "var(--ink)", lineHeight: 1.6 }}>
                  <div><strong>Meeting ID:</strong> {MEETING_ID}</div>
                  <div><strong>Passcode:</strong> {PASSCODE}</div>
                  <div><strong>Dial-in (one tap mobile):</strong></div>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {dialIn.map((d) => (
                      <li key={d.label} style={{ marginBottom: 4 }}>{d.number} — {d.label}</li>
                    ))}
                  </ul>
                  <div><strong>Join by SIP:</strong> 89882749924@zoomcrc.com</div>
                </div>
                <a href={JOIN_URL} target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ marginTop: 24, display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 15, padding: "15px 28px", borderRadius: 999, textDecoration: "none" }}>
                  <Video size={16} strokeWidth={2} aria-hidden /> Open Zoom link →
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      {!isPast && (
        <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <Reveal>
              <div style={{ display: "grid", placeItems: "center", width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,var(--blue),var(--ink))", margin: "0 auto 22px" }}>
                <HandHeart size={24} color="#fff" strokeWidth={1.9} aria-hidden />
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-1px", color: "#fff", margin: "0 0 18px", lineHeight: 1.04 }}>
                Questions before Saturday?
              </h2>
              <p style={{ fontSize: 16, color: "rgba(245,246,250,.65)", lineHeight: 1.72, marginBottom: 32 }}>
                For more information, contact Pastor Otun.
              </p>
              <a href="tel:+14842477194" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 15, padding: "15px 28px", borderRadius: 999, textDecoration: "none" }}>
                <Phone size={16} strokeWidth={2} aria-hidden /> 1-484-247-7194
              </a>
            </Reveal>
          </div>
        </section>
      )}

      <FooterExperience />
    </main>
  );
}
