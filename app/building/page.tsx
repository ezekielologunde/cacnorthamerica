import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { Building2, HandCoins, Hammer, HeartHandshake, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Building Project — CAC Salvation Center",
  description:
    "A multi-million dollar permanent home for the Salvation Center family — for worship, discipleship, youth, and missions. Partner with us as God builds.",
  alternates: { canonical: "/building" },
};

const phases = [
  {
    n: "01",
    title: "Land & Vision",
    desc: "Seeking and securing a permanent site that anchors decades of ministry in the Baltimore-Maryland region.",
  },
  {
    n: "02",
    title: "Design & Permits",
    desc: "A purpose-built sanctuary, fellowship hall, youth wing, and pastoral offices — designed for Spirit-filled gatherings and community service.",
  },
  {
    n: "03",
    title: "Build",
    desc: "Breaking ground and raising a house worthy of the Name above every name — debt-free, by the giving of God’s people.",
  },
  {
    n: "04",
    title: "Dedicate",
    desc: "Opening the doors to the next generation of worshippers, missionaries, and Kingdom ambassadors.",
  },
];

const partnerTiers = [
  { label: "Foundation Stone", amt: "$50", note: "Every brick counts." },
  { label: "Pillar", amt: "$500", note: "Lift a wall with us." },
  { label: "Cornerstone", amt: "$5,000+", note: "Stand with the family." },
];

export default function BuildingPage() {
  return (
    <main>
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 100px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -120, width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle,rgba(232,163,61,.24),transparent 65%)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -150, left: -100, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(214,40,40,.22),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 920, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 22 }}>
              <Building2 size={14} strokeWidth={2.5} aria-hidden /> Building Project
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(48px,7.4vw,104px)", letterSpacing: "-2.5px", color: "#fff", margin: "0 0 24px", lineHeight: 0.92 }}>
              A multi-million dollar<br />
              <span style={{ background: "linear-gradient(100deg,#F15F22,#D62828,#E8A33D)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>house for His name.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(17px,1.9vw,21px)", color: "rgba(255,247,239,.78)", lineHeight: 1.7, maxWidth: 640, margin: "0 auto 40px" }}>
              God has placed before us a permanent home for the Salvation Center family — a sanctuary for worship, a hall for discipleship, a wing for youth, and a base for missions across Maryland and beyond.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
              <Link href="/giving" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--red)", color: "#fff", fontWeight: 800, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 36px rgba(214,40,40,.45)" }}>
                Give to the Building Fund <ArrowRight size={17} strokeWidth={2.5} aria-hidden />
              </Link>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(255,247,239,.1)", color: "var(--cream)", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(255,247,239,.22)" }}>
                Talk to a pastor
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Verse anchor */}
      <section style={{ background: "var(--cream)", padding: "clamp(60px,8vw,100px) clamp(20px,5vw,64px)", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px,3.8vw,42px)", letterSpacing: "-1px", color: "var(--ink)", margin: 0, lineHeight: 1.25, fontStyle: "italic" }}>
              &ldquo;Unless the Lord builds the house, the builders labor in vain.&rdquo;
            </p>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginTop: 22 }}>Psalm 127:1</p>
          </Reveal>
        </div>
      </section>

      {/* The vision — render, walkthrough video & floor plan */}
      <section style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px) clamp(60px,8vw,100px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 34, textAlign: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>The Vision</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,4.5vw,56px)", letterSpacing: "-1.2px", color: "var(--ink)", margin: "12px 0 0", lineHeight: 1 }}>
              See the house God is building.
            </h2>
            <p style={{ fontSize: "clamp(15px,1.7vw,18px)", color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 620, margin: "16px auto 0" }}>
              The architect&apos;s rendering and walkthrough of the new Christ Apostolic Church &mdash; a 357-seat sanctuary and a 450-seat banquet hall in Baltimore County, Maryland.
            </p>
          </Reveal>

          {/* Exterior rendering */}
          <Reveal>
            <div style={{ position: "relative", aspectRatio: "2560 / 1099", borderRadius: 24, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "0 24px 60px rgba(27,19,14,.14)", marginBottom: 20 }}>
              <Image
                src="/images/building-render.jpg"
                alt="Architect's 3D rendering of the new Christ Apostolic Church — gold roofs, glass frontage and a standing cross"
                fill priority
                sizes="(max-width: 1140px) 100vw, 1100px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </Reveal>

          {/* Walkthrough video + floor plan */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            <Reveal>
              <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: 20, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "0 16px 40px rgba(27,19,14,.12)", background: "var(--ink)" }}>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/YwI_LqP1zpo?rel=0"
                  title="Walkthrough of the new Christ Apostolic Church building"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                />
              </div>
            </Reveal>
            <Reveal delay={90}>
              <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: 20, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "0 16px 40px rgba(27,19,14,.12)", background: "var(--paper)" }}>
                <Image
                  src="/images/building-floorplan.jpg"
                  alt="Architect's first-floor plan showing a 357-seat sanctuary and a 450-seat banquet hall"
                  fill
                  sizes="(max-width: 1140px) 100vw, 540px"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(48px,5vw,72px) clamp(20px,5vw,64px) 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Reveal>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 22, padding: "clamp(24px,3vw,36px)", boxShadow: "0 12px 30px rgba(27,19,14,.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Project Progress</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-soft)" }}>Phase 1 of 4 &mdash; Land &amp; Vision</span>
              </div>
              <div style={{ height: 10, borderRadius: 99, background: "var(--line)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "25%", borderRadius: 99, background: "linear-gradient(90deg,var(--flame),var(--red))" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, marginTop: 10 }}>
                {["Land & Vision","Design & Permits","Build","Dedicate"].map((label, i) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? "var(--red)" : "var(--line)", margin: "0 auto 5px", boxShadow: i === 0 ? "0 0 0 3px rgba(214,40,40,.2)" : "none" }} />
                    <span style={{ fontSize: 11, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? "var(--ink)" : "var(--ink-soft)", lineHeight: 1.3, display: "block" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Phases */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(60px,7vw,96px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 44, textAlign: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>The Journey</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,4.5vw,56px)", letterSpacing: "-1.2px", color: "var(--ink)", margin: "12px 0 0", lineHeight: 1 }}>
              From vision to dedication.
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {phases.map((p, i) => (
              <Reveal key={p.n} delay={i * 80}>
                <div style={{ height: "100%", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 22, padding: "30px 26px", boxShadow: "0 12px 30px rgba(27,19,14,.06)" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, color: "var(--red)", letterSpacing: "-1px", marginBottom: 14, lineHeight: 1 }}>{p.n}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, letterSpacing: "-.4px", color: "var(--ink)", margin: "0 0 10px" }}>{p.title}</h3>
                  <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What it funds */}
      <section style={{ background: "var(--ink)", padding: "clamp(60px,7vw,100px) clamp(20px,5vw,64px)", color: "var(--cream)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 44, textAlign: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>What it funds</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,4.5vw,56px)", letterSpacing: "-1.2px", color: "#fff", margin: "12px 0 0", lineHeight: 1 }}>
              Every gift becomes a room.
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {[
              { icon: Hammer, title: "Sanctuary", desc: "A worship hall worthy of Spirit-filled gatherings." },
              { icon: HeartHandshake, title: "Fellowship Hall", desc: "A home for community meals, discipleship, and weddings." },
              { icon: HandCoins, title: "Youth & Mission Wing", desc: "Equipping the next generation of ambassadors." },
            ].map((b, i) => (
              <Reveal key={b.title} delay={i * 90}>
                <div style={{ height: "100%", background: "rgba(255,247,239,.05)", border: "1px solid rgba(255,247,239,.12)", borderRadius: 22, padding: "30px 28px" }}>
                  <div style={{ display: "grid", placeItems: "center", width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,var(--flame),var(--red))", marginBottom: 18, boxShadow: "0 10px 22px rgba(214,40,40,.35)" }}>
                    <b.icon size={24} strokeWidth={2} color="#fff" aria-hidden />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: "-.4px", margin: "0 0 8px" }}>{b.title}</h3>
                  <p style={{ fontSize: 14.5, color: "rgba(255,247,239,.7)", lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partner tiers */}
      <section style={{ background: "var(--cream)", padding: "clamp(60px,7vw,96px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 38, textAlign: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Partner with us</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4vw,50px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 0", lineHeight: 1 }}>
              Choose a stone.
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginBottom: 32 }}>
            {partnerTiers.map((t, i) => (
              <Reveal key={t.label} delay={i * 80}>
                <div style={{ height: "100%", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 22, padding: "30px 28px", textAlign: "center", boxShadow: "0 12px 28px rgba(27,19,14,.06)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 12 }}>{t.label}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 46, letterSpacing: "-1.5px", color: "var(--ink)", lineHeight: 1 }}>{t.amt}</div>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "14px 0 0" }}>{t.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <Link href="/giving" className="press-lg" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--red)", color: "#fff", fontWeight: 800, fontSize: 16, padding: "18px 34px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 36px rgba(214,40,40,.42)" }}>
                Give to the Building Fund <ArrowRight size={17} strokeWidth={2.5} aria-hidden />
              </Link>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 16 }}>
                Mark your gift &ldquo;<strong style={{ color: "var(--ink)" }}>Building Fund</strong>&rdquo; on Zelle, Tithe.ly, or Givelify.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pastoral contact */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <Reveal>
          <div style={{ maxWidth: 760, margin: "0 auto", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 24, padding: "clamp(28px,4vw,40px)", display: "flex", flexWrap: "wrap", gap: 22, alignItems: "center", justifyContent: "space-between", boxShadow: "0 18px 40px rgba(27,19,14,.08)" }}>
            <div style={{ flex: "1 1 280px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,2.6vw,30px)", letterSpacing: "-.5px", color: "var(--ink)", margin: "0 0 8px" }}>Want to give a large pledge?</h3>
              <p style={{ fontSize: 15, color: "var(--ink-soft)", margin: 0, lineHeight: 1.65 }}>
                Speak with a pastor directly — we&apos;d love to pray with you and walk through the vision in person.
              </p>
            </div>
            <a href="tel:+14432726794" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--ink)", color: "#fff", fontWeight: 700, fontSize: 15, padding: "15px 26px", borderRadius: 999, textDecoration: "none" }}>
              <Phone size={16} strokeWidth={2} aria-hidden /> (443) 272-6794
            </a>
          </div>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
