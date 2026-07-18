import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Link from "next/link";
import Image from "next/image";
import { CalendarPlus, Download, MapPin, Clock, BookOpen } from "lucide-react";
import { specialEvents, googleCalUrl, icsDataUri, isEventPast } from "@/lib/events";
import { SITE, SITE_URL, breadcrumbJsonLd } from "@/lib/site";

export const revalidate = 3600;

export const metadata = {
  title: "2026 Good Women Anniversary — CAC Salvation Center",
  description:
    "The Baltimore DCC Good Women 2026 Anniversary — “Who Are You: Mother or Murderer?” (1 Kings 3:16–27). Sunday, June 28, 2026 at 11:00 AM ET, with the Good Women leadership and guest ministers.",
  alternates: { canonical: "/events/good-women-anniversary" },
};

const ev = specialEvents.find((e) => e.id === "good-women-anniversary-2026")!;

const ministers: { name: string; role: string; photo?: string }[] = [
  { name: "Pastor Dr. H.O. Ilufoye", role: "Baltimore DCC Superintendent", photo: "/images/pastor-couple.jpg" },
  { name: "Pastor S.O. Oladele", role: "C.A.C. President" },
  { name: "Pastor Dr. T.O.A. Agbeja", role: "Latunde Regional Superintendent" },
];

const guestMinisters = [
  { name: "Evang. Mrs Bisi Benson", role: "Guest Minister" },
  { name: "Evang. Mrs Buky Awosanya", role: "Guest Minister" },
];

const goodWomen = [
  { name: "DCNS. Bola Ojuko", role: "Leader, BDCC Good Women" },
  { name: "Evang. Dr. Funmi Efuntoye", role: "Chaplain, BDCC Good Women" },
  { name: "DCNS. Fibisola Adewale", role: "Secretary, BDCC Good Women" },
  { name: "DCNS. Oluremi Adedapo", role: "Treasurer, BDCC Good Women" },
  { name: "Evang. Mrs Victoria Ilufoye", role: "First Lady, BDCC" },
  { name: "Evang. Mrs Bola Mustapha", role: "Latunde Region Women Leader" },
];

function initials(name: string) {
  const parts = name.replace(/^(Pastor|Dr\.|DCNS\.|Evang\.|Mrs|Mr)\s*/gi, "").trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

function PersonCard({ name, role, photo, dark = false, accent = false }: { name: string; role: string; photo?: string; dark?: boolean; accent?: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16, height: "100%",
      background: dark ? "rgba(255,247,239,.05)" : "var(--paper)",
      border: dark ? "1px solid rgba(255,247,239,.12)" : "1px solid var(--line)",
      borderRadius: 18, padding: "18px 20px",
      boxShadow: dark ? "none" : "0 8px 22px rgba(27,19,14,.05)",
    }}>
      {photo ? (
        <span style={{ flexShrink: 0, position: "relative", width: 52, height: 52, borderRadius: "50%", overflow: "hidden", boxShadow: "0 8px 18px rgba(214,40,40,.26)" }}>
          <Image src={photo} alt={name} fill style={{ objectFit: "cover", objectPosition: "center top" }} sizes="52px" />
        </span>
      ) : (
        <span style={{
          flexShrink: 0, width: 52, height: 52, borderRadius: "50%", display: "grid", placeItems: "center",
          fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "#fff",
          background: accent ? "linear-gradient(140deg,var(--gold),var(--flame))" : "linear-gradient(140deg,var(--flame),var(--red))",
          boxShadow: "0 8px 18px rgba(214,40,40,.26)",
        }}>{initials(name)}</span>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15.5, color: dark ? "var(--cream)" : "var(--ink)", lineHeight: 1.25 }}>{name}</div>
        <div style={{ fontSize: 13, color: dark ? "rgba(255,247,239,.6)" : "var(--ink-soft)", marginTop: 3 }}>{role}</div>
        {accent && <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)", marginTop: 6 }}>Guest Minister</div>}
      </div>
    </div>
  );
}

export default function GoodWomenAnniversaryPage() {
  const addressLine = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`;
  const isPast = isEventPast(ev);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    description: ev.desc,
    startDate: "2026-06-28T11:00:00-04:00",
    endDate: "2026-06-28T13:30:00-04:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: `${SITE_URL}/images/congregation.jpg`,
    url: `${SITE_URL}/events/good-women-anniversary`,
    location: { "@type": "Place", name: SITE.name, address: { "@type": "PostalAddress", streetAddress: SITE.address.street, addressLocality: SITE.address.city, addressRegion: SITE.address.region, postalCode: SITE.address.postalCode, addressCountry: SITE.address.country } },
    organizer: { "@type": "Church", name: SITE.name, url: SITE_URL },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/events" }, { name: ev.navLabel ?? ev.title, path: "/events/good-women-anniversary" }])).replace(/</g, "\\u003c") }} />
      <Nav heroDark />
      {isPast && (
        <div role="status" style={{ background: '#2c2825', padding: '13px clamp(20px,5vw,64px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px 20px', fontSize: 14, fontWeight: 600, color: 'rgba(255,247,239,.7)' }}>
          <span>This event has passed — page kept as an archive.</span>
          <Link href="/events" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap' }}>See upcoming events →</Link>
        </div>
      )}

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) clamp(64px,8vw,100px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -80, width: 620, height: 480, background: "radial-gradient(circle,rgba(232,163,61,.22),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 16s ease-in-out infinite" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Link href="/events" style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(255,247,239,.6)", textDecoration: "none" }}>← All events</Link>
          </Reveal>
          <Reveal delay={60} style={{ marginTop: 18 }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>2026 Good Women Anniversary · Baltimore DCC</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6.4vw,90px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0 0", lineHeight: 0.95, textWrap: "balance" }}>
            <RevealText immediate>Who Are You:</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ color: "var(--flame)" }}>Mother or Murderer?</RevealText>
          </h1>
          <Reveal delay={320}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 9, marginTop: 22, padding: "8px 16px", borderRadius: 999, background: "rgba(232,163,61,.12)", border: "1px solid rgba(232,163,61,.3)", fontSize: 13.5, fontWeight: 700, color: "var(--gold)" }}>
              <BookOpen size={15} strokeWidth={2} aria-hidden /> 1 Kings 3:16–27
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 28px", margin: "26px 0 30px", color: "rgba(255,247,239,.82)", fontSize: 15.5, fontWeight: 600 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Clock size={16} strokeWidth={2} aria-hidden color="var(--gold)" /> Sunday, June 28, 2026 · 11:00 AM ET</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><MapPin size={16} strokeWidth={2} aria-hidden color="var(--gold)" /> {addressLine}</span>
            </div>
          </Reveal>
          {!isPast && (
          <Reveal delay={480}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
              <a href={googleCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 26px", borderRadius: 999, textDecoration: "none", boxShadow: "0 14px 30px rgba(214,40,40,.4)" }}>
                <CalendarPlus size={17} strokeWidth={2} aria-hidden /> Add to Google Calendar
              </a>
              <a href={icsDataUri(ev)} download="good-women-anniversary-2026.ics" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--cream)", border: "1.5px solid rgba(255,247,239,.28)", background: "rgba(255,247,239,.06)", fontWeight: 700, fontSize: 15, padding: "14px 26px", borderRadius: 999, textDecoration: "none" }}>
                <Download size={17} strokeWidth={2} aria-hidden /> Apple / Outlook
              </a>
            </div>
          </Reveal>
          )}
        </div>
      </section>

      {/* Official flyer */}
      <section style={{ background: "var(--ink)", padding: "0 clamp(20px,5vw,64px) clamp(50px,6vw,80px)" }}>
        <Reveal style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.5)", border: "1px solid rgba(255,247,239,.08)" }}>
            <Image
              src="/images/good-women-anniversary-2026.jpg"
              alt="2026 Good Women Anniversary official flyer — Who Are You: Mother or Murderer? June 28, 2026"
              width={1280} height={720}
              style={{ width: "100%", height: "auto", display: "block" }}
              priority
            />
          </div>
        </Reveal>
      </section>

      {/* Theme intro */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)", borderBottom: "1px solid var(--line)" }}>
        <Reveal style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "clamp(17px,2vw,21px)", color: "var(--ink)", lineHeight: 1.7, margin: 0, fontWeight: 500, textWrap: "pretty" }}>
            One Sunday set apart to celebrate the Good Women of the Baltimore DCC — drawing from Solomon&apos;s judgment in <strong>1 Kings 3</strong> to ask what a true mother&apos;s heart looks like. A morning of worship, the Word, and honor.
          </p>
        </Reveal>
      </section>

      {/* Ministering */}
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Ministering</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.6vw,46px)", letterSpacing: "-1px", color: "var(--cream)", margin: "12px 0 0" }}>Our fathers in the faith</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginBottom: 28 }}>
            {ministers.map((p, i) => (
              <Reveal key={p.name} delay={i * 70}><PersonCard {...p} dark /></Reveal>
            ))}
          </div>
          <Reveal style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)" }}>Guest Ministers</span>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
            {guestMinisters.map((p, i) => (
              <Reveal key={p.name} delay={i * 70}><PersonCard {...p} dark accent /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Good Women leadership */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>The Good Women</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.6vw,46px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 0" }}>BDCC Good Women leadership</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
            {goodWomen.map((p, i) => (
              <Reveal key={p.name} delay={(i % 3) * 70}><PersonCard {...p} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      {!isPast && (
      <section style={{ background: "linear-gradient(135deg,#9E1B1B,#D62828)", padding: "clamp(60px,8vw,100px) clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,56px)", letterSpacing: "-1.2px", color: "#fff", margin: "0 0 16px", lineHeight: 0.98 }}>Come celebrate with us.</h2>
          <p style={{ fontSize: 17, color: "rgba(255,247,239,.82)", margin: "0 0 32px", lineHeight: 1.6 }}>
            Sunday, June 28 at 11:00 AM ET — onsite in Randallstown and live online. All are welcome to honor the women of the house.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            <Link href="/visit" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "var(--red-deep)", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none" }}>
              Plan your visit →
            </Link>
            <Link href="/online" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#fff", border: "1.5px solid rgba(255,255,255,.5)", fontWeight: 700, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none" }}>
              Watch online
            </Link>
          </div>
        </Reveal>
      </section>
      )}

      <FooterExperience />
    </main>
  );
}
