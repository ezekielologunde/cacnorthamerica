import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { FacebookIcon } from "@/components/ui/SocialIcons";
import { MapPin, Phone, Mail, Navigation, ArrowUpRight, Video } from "lucide-react";

export const metadata = {
  title: "CAC Salvation City — Rosedale, MD",
  description:
    "Spirit-filled worship in Rosedale, MD. Sunday services at 8330 Pulaski Hwy Suite F, Rosedale MD 21237. Part of the Christ Apostolic Church family — all are welcome.",
  alternates: { canonical: "https://city.cacsalvationcenter.org" },
};

const c = {
  deep: "#1A0C04",
  brown: "#4A2208",
  brownMid: "#7A4820",
  brownSoft: "#A0622E",
  yellow: "#F5D347",
  yellowLight: "#FFF9C8",
  yellowMid: "#FAE97A",
  paper: "#FFFDF0",
  cream: "#FFF8DB",
  cream2: "#FFF3C0",
  ink: "#1A0C04",
  inkSoft: "#6B4020",
  line: "rgba(74,34,8,.12)",
  onDeep: "rgba(255,249,200,.82)",
  onDeepLine: "rgba(255,249,200,.15)",
};

const ZOOM    = "https://us02web.zoom.us/my/cacsalvationcenter?pwd=lyeF5MqjRvAUyCLfieAaf8Ij0NJfnN.1&omn=84863890827";
const ADDRESS = "8330 Pulaski Hwy Suite F, Rosedale, MD 21237";
const MAPS_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent("8330 Pulaski Hwy, Rosedale, MD 21237")}&z=15&output=embed`;
const MAPS_LINK  = `https://maps.google.com/?q=${encodeURIComponent("8330 Pulaski Hwy Suite F, Rosedale, MD 21237")}`;
const PHONE      = "+1 443-985-3738";
const EMAIL      = "cacsalvationcity@outlook.com";
const FB         = "https://www.facebook.com/profile.php?id=100083423624157";

const connect = [
  { label: "Join on Zoom", desc: "Worship with us online — every Sunday", href: ZOOM, icon: <Video size={22} strokeWidth={2} /> },
  { label: "Facebook", desc: "Christ Apostolic Church - Salvation City", href: FB, icon: <FacebookIcon /> },
  { label: "Email",    desc: EMAIL,    href: `mailto:${EMAIL}`,    icon: <Mail size={22} strokeWidth={2} /> },
  { label: "Call",     desc: PHONE,    href: `tel:${PHONE.replace(/\s/g,"")}`, icon: <Phone size={22} strokeWidth={2} /> },
  { label: "Main Site", desc: "cacsalvationcenter.org", href: "https://www.cacsalvationcenter.org", icon: <ArrowUpRight size={22} strokeWidth={2} /> },
];

export default function SalvationCityPage() {
  return (
    <main style={{ background: c.paper, color: c.ink, fontFamily: "var(--font-body)" }}>

      {/* ── Sticky header ────────────────────────────────── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: `rgba(26,12,4,.93)`, backdropFilter: "blur(10px)", borderBottom: `1px solid ${c.onDeepLine}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "13px clamp(18px,4vw,40px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <a href="#top" style={{ display: "flex", flexDirection: "column", lineHeight: 1.05, textDecoration: "none" }}>
            <span style={{ fontSize: 9.5, letterSpacing: "2.5px", textTransform: "uppercase", color: c.yellow, fontWeight: 800 }}>Christ Apostolic Church</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: "-.2px" }}>Salvation City · Rosedale</span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="#visit" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 700, color: c.ink, background: c.yellow, padding: "9px 16px", borderRadius: 999, textDecoration: "none" }}>
              <Navigation size={14} strokeWidth={2.4} aria-hidden /> Visit
            </a>
            <a href="https://www.cacsalvationcenter.org" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: c.onDeep, textDecoration: "none", whiteSpace: "nowrap" }}>
              CAC Baltimore <ArrowUpRight size={14} strokeWidth={2.4} aria-hidden />
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section id="top" style={{ background: `linear-gradient(165deg, ${c.deep} 0%, #2E1106 100%)`, color: "#fff", padding: "clamp(72px,10vw,128px) clamp(20px,5vw,64px) clamp(80px,11vw,140px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -180, right: -140, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,211,71,.22), transparent 62%)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -200, left: -160, width: 580, height: 580, borderRadius: "50%", background: "radial-gradient(circle, rgba(122,72,32,.35), transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 940, margin: "0 auto", position: "relative", zIndex: 2, textAlign: "center" }}>
          <Reveal>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: c.yellow, background: "rgba(245,211,71,.10)", border: "1px solid rgba(245,211,71,.30)", padding: "7px 16px", borderRadius: 999 }}>
              <MapPin size={14} strokeWidth={2.5} aria-hidden /> Baltimore, MD · Rosedale, MD
            </span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(52px,9vw,112px)", letterSpacing: "-0.03em", lineHeight: 0.9, margin: "26px 0 0" }}>
            <RevealText immediate>Salvation</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ color: c.yellow }}>City.</RevealText>
          </h1>
          <Reveal delay={320}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 24, fontSize: 12.5, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: c.yellowMid, flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ width: 30, height: 1, background: "rgba(245,211,71,.4)" }} aria-hidden />
              Christ Apostolic Church
              <span style={{ width: 30, height: 1, background: "rgba(245,211,71,.4)" }} aria-hidden />
            </div>
          </Reveal>
          <Reveal delay={380}>
            <p style={{ fontSize: "clamp(17px,2vw,22px)", color: c.onDeep, lineHeight: 1.7, maxWidth: 640, margin: "22px auto 0" }}>
              A Bible believing church in Rosedale, Maryland.<br />Come experience the joy of the Lord with us.
            </p>
          </Reveal>
          <Reveal delay={460}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 13, marginTop: 38 }}>
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: c.yellow, color: c.deep, fontWeight: 800, fontSize: 16, padding: "16px 28px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 36px rgba(245,211,71,.30)" }}>
                <Navigation size={18} strokeWidth={2.3} aria-hidden /> Get Directions
              </a>
              <a href={ZOOM} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "#fff", border: `1.5px solid ${c.onDeepLine}`, background: "rgba(255,255,255,.06)", fontWeight: 700, fontSize: 16, padding: "16px 26px", borderRadius: 999, textDecoration: "none" }}>
                <Video size={18} strokeWidth={2} aria-hidden /> Join on Zoom
              </a>
              <a href={FB} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "#fff", border: `1.5px solid ${c.onDeepLine}`, background: "rgba(255,255,255,.06)", fontWeight: 700, fontSize: 16, padding: "16px 26px", borderRadius: 999, textDecoration: "none" }}>
                <FacebookIcon /> Facebook
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Scripture quote ───────────────────────────────── */}
      <section style={{ background: c.cream, padding: "clamp(60px,8vw,108px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div aria-hidden style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 100, lineHeight: 0.5, color: c.yellow, marginBottom: 4 }}>&ldquo;</div>
          </Reveal>
          <Reveal delay={80}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(22px,3vw,38px)", letterSpacing: "-0.02em", color: c.ink, lineHeight: 1.32, margin: "0 0 20px" }}>
              New life brings renewal, it brings new strength and gives a fresh spirit.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: c.brownSoft }}>2 Corinthians 5:17</span>
          </Reveal>
          <Reveal delay={220}>
            <p style={{ fontSize: 17, color: c.inkSoft, marginTop: 24, lineHeight: 1.8 }}>
              Welcome to CAC Salvation City. #FirstSundayOfTheMonth #CACSalvation #WelcomeHome
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Location & Contact ───────────────────────────── */}
      <section id="visit" style={{ background: c.paper, padding: "clamp(56px,7vw,100px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 48, alignItems: "start" }}>

          {/* Details column */}
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: c.brownMid }}>Come worship with us</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.8vw,48px)", letterSpacing: "-1.2px", color: c.ink, margin: "12px 0 24px", lineHeight: 0.98 }}>Visit us in Rosedale.</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, background: c.cream, border: `1px solid ${c.line}`, borderRadius: 18, padding: "20px 22px" }}>
                <MapPin size={22} strokeWidth={2.2} color={c.brownMid} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "1.5px", color: c.brownSoft, marginBottom: 4 }}>Address</div>
                  <p style={{ fontSize: 16.5, color: c.ink, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>{ADDRESS}</p>
                  <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 14, fontWeight: 700, color: c.brownMid, textDecoration: "none" }}>
                    Open in Maps <ArrowUpRight size={14} aria-hidden />
                  </a>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14, background: c.cream, border: `1px solid ${c.line}`, borderRadius: 18, padding: "18px 22px" }}>
                <Phone size={20} strokeWidth={2.2} color={c.brownMid} style={{ flexShrink: 0 }} aria-hidden />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "1.5px", color: c.brownSoft, marginBottom: 3 }}>Phone</div>
                  <a href={`tel:${PHONE.replace(/\s/g,"")}`} style={{ fontSize: 16, fontWeight: 700, color: c.ink, textDecoration: "none" }}>{PHONE}</a>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14, background: c.cream, border: `1px solid ${c.line}`, borderRadius: 18, padding: "18px 22px" }}>
                <Mail size={20} strokeWidth={2.2} color={c.brownMid} style={{ flexShrink: 0 }} aria-hidden />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "1.5px", color: c.brownSoft, marginBottom: 3 }}>Email</div>
                  <a href={`mailto:${EMAIL}`} style={{ fontSize: 15.5, fontWeight: 700, color: c.ink, textDecoration: "none", wordBreak: "break-word" }}>{EMAIL}</a>
                </div>
              </div>
            </div>

            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: c.brown, color: "#fff", fontWeight: 700, fontSize: 15.5, padding: "14px 28px", borderRadius: 999, textDecoration: "none", boxShadow: "0 14px 30px rgba(74,34,8,.24)", marginTop: 26 }}>
              <Navigation size={17} strokeWidth={2.3} aria-hidden /> Get Directions
            </a>
          </Reveal>

          {/* Map */}
          <Reveal delay={120}>
            <div style={{ height: "clamp(300px,38vw,420px)", borderRadius: 24, overflow: "hidden", border: `1px solid ${c.line}`, boxShadow: "0 18px 40px rgba(26,12,4,.12)" }}>
              <iframe title="Map to CAC Salvation City, Rosedale MD" src={MAPS_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: "100%", height: "100%", border: 0, display: "block" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Connect ──────────────────────────────────────── */}
      <section id="connect" style={{ background: `linear-gradient(165deg, ${c.brown} 0%, #2E1106 100%)`, color: "#fff", padding: "clamp(56px,7vw,100px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 44 }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: c.yellow }}>Follow · Call · Write</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1.2px", color: "#fff", margin: "12px 0 0", lineHeight: 1 }}>Stay with the family.</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {connect.map((x, i) => (
              <Reveal key={x.label} delay={i * 70}>
                <a
                  href={x.href}
                  {...(x.href.startsWith("mailto") || x.href.startsWith("tel") || x.href.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className="card-lift"
                  style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%", background: "rgba(255,255,255,.07)", border: `1px solid ${c.onDeepLine}`, borderRadius: 20, padding: "24px 22px", textDecoration: "none" }}
                >
                  <span style={{ display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: 13, background: "rgba(245,211,71,.18)", color: c.yellow, flexShrink: 0 }}>{x.icon}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, color: "#fff", marginBottom: 4 }}>{x.label}</div>
                    <div style={{ fontSize: 13.5, color: c.onDeep, lineHeight: 1.5, wordBreak: "break-word" }}>{x.desc}</div>
                  </div>
                  <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: c.yellow }}>Open <ArrowUpRight size={14} strokeWidth={2.4} aria-hidden /></span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer style={{ background: c.deep, color: "#fff", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px) 36px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 36, paddingBottom: 32, borderBottom: `1px solid ${c.onDeepLine}` }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "2.5px", textTransform: "uppercase", color: c.yellow, fontWeight: 800 }}>Christ Apostolic Church</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, marginTop: 4 }}>Salvation City</div>
              <p style={{ fontSize: 14, color: c.onDeep, lineHeight: 1.65, margin: "14px 0 0", maxWidth: 300 }}>A Bible believing church in Rosedale, MD. Come experience the joy of the Lord with us.</p>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14, color: c.yellow }}>Visit</div>
              <p style={{ fontSize: 14, color: c.onDeep, lineHeight: 1.7, margin: 0 }}>{ADDRESS}</p>
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 13.5, fontWeight: 700, color: c.yellowMid, textDecoration: "none" }}>Directions <ArrowUpRight size={14} aria-hidden /></a>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14, color: c.yellow }}>Connect</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
                <a href={ZOOM} target="_blank" rel="noopener noreferrer" style={{ color: c.yellowMid, textDecoration: "none", fontWeight: 700 }}>Join on Zoom</a>
                <a href={FB} target="_blank" rel="noopener noreferrer" style={{ color: c.onDeep, textDecoration: "none" }}>Facebook</a>
                <a href={`tel:${PHONE.replace(/\s/g,"")}`} style={{ color: c.onDeep, textDecoration: "none" }}>{PHONE}</a>
                <a href={`mailto:${EMAIL}`} style={{ color: c.onDeep, textDecoration: "none", wordBreak: "break-word" }}>{EMAIL}</a>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14, color: c.yellow }}>The wider family</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
                <a href="https://www.cacsalvationcenter.org" style={{ color: c.onDeep, textDecoration: "none" }}>CAC Salvation Center · Baltimore</a>
                <a href="https://ilorin.cacsalvationcenter.org" style={{ color: c.onDeep, textDecoration: "none" }}>CAC Salvation Centre · Ilorin</a>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: c.onDeep, marginTop: 22 }}>© 2026 Christ Apostolic Church — Salvation City · Rosedale, MD</div>
        </div>
      </footer>

    </main>
  );
}
