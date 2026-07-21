import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import Link from "next/link";
import { Compass, Target, HandHeart, BookOpen, Users, Mic2, Sparkles } from "lucide-react";

export const metadata = {
  title: "Youth & Young Adult — Christ Apostolic Church North America (CACNA)",
  description:
    "CACNA's Youth & Young Adult Ministry — vision, mission, values, history, and major programs raising Christ-centered youth across North America.",
  alternates: { canonical: "/youth" },
};

// Real Instagram account for CACNA's Youth & Young Adult Ministry
// (verified 2026-07-21), distinct from the org-wide account used elsewhere
// on this site (FooterExperience, /online).
const YOUTH_INSTAGRAM = "https://instagram.com/cacnayyam";

// Sourced verbatim from cacnorthamerica.com/youth-young-adult/ (2026-07-21).
const pillars = [
  { icon: Compass, label: "Our Vision", body: "Christ-centered Youths for fulfilment in life and ministry." },
  { icon: Target, label: "Our Mission", body: "Raising Christ-centered and excellent Youths for all round fulfilment through teaching, discipleship, innovative evangelism and spiritual worship." },
  { icon: HandHeart, label: "Our Values", body: "Our values and priorities are expressed in prayer — an effective prayer life remains our core value." },
];

// Real program names from the source page -- no descriptions were given
// there beyond the titles themselves, so none are invented here.
const programs = [
  { name: "Academic Conference", icon: BookOpen },
  { name: "Leadership Retreat", icon: Users },
  { name: "Night of Divine Encounter", icon: Sparkles },
  { name: "Youth Conference", icon: Mic2 },
];

export default function YouthPage() {
  return (
    <main id="main-content">
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 90px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 760, height: 460, background: "radial-gradient(circle,rgba(200,30,58,.3),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 16s ease-in-out infinite" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal from="scale">
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Youth & Young Adult</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(44px,6.5vw,88px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0", lineHeight: 0.98, textWrap: "balance" }}>
            <RevealText immediate>Faithfully Connected.</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ color: "var(--red)" }}>
              Joyfully Serving.
            </RevealText>
          </h1>
          <Reveal delay={360}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(245,246,250,.72)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 32px", textWrap: "pretty" }}>
              Raising Christ-centered and excellent youths for all-round fulfilment through teaching, discipleship, innovative evangelism, and spiritual worship.
            </p>
          </Reveal>
          <Reveal delay={440}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
              <a
                href={YOUTH_INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sheen press"
                style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 15, padding: "15px 28px", borderRadius: 999, textDecoration: "none" }}
              >
                <InstagramIcon size={17} /> Follow @cacnayyam
              </a>
              <Link
                href="/contact"
                className="press"
                style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "15px 28px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}
              >
                Journey With Us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision / Mission / Values */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
          {pillars.map((p, i) => (
            <Reveal key={p.label} delay={i * 90}>
              <div style={{ height: "100%", borderRadius: 22, padding: "30px 26px", background: "var(--paper)", border: "1px solid var(--line)", boxShadow: "0 10px 26px rgba(18,20,30,.06)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: "linear-gradient(140deg,var(--red),var(--flame))", display: "grid", placeItems: "center", marginBottom: 18 }}>
                  <p.icon size={22} strokeWidth={2} color="#fff" aria-hidden />
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", margin: "0 0 8px" }}>{p.label}</h3>
                <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* History + photo */}
      <section style={{ background: "var(--paper)", padding: "clamp(56px,7vw,96px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "clamp(28px,4vw,48px)", alignItems: "start" }} className="youth-history-grid">
          <Reveal>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Where we come from</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,40px)", letterSpacing: "-.8px", color: "var(--ink)", margin: "14px 0 18px", lineHeight: 1.05 }}>
                Youth Department History
              </h2>
              <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.8, margin: 0 }}>
                Christ Apostolic Church allowed the togetherness and fellowship of her elites and youths right from her early days. As extra-constitutional organizations formed by young men and women with godly zeal, they operated within the Church under the strict supervision and control of the Church Authority.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div style={{ position: "relative", width: "100%", height: "clamp(240px,28vw,360px)", borderRadius: 22, overflow: "hidden", boxShadow: "0 20px 44px rgba(18,20,30,.15)" }}>
              <ImageLightbox src="/images/cac-youth-convention.jpg" alt="CACNA youth at a past Annual Convention" />
            </div>
          </Reveal>
        </div>
        <style>{`
          @media (max-width: 760px) {
            .youth-history-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* Major Programs */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Major Programs</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 0", lineHeight: 1 }}>
              Where we watch, learn, and pray.
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {programs.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <div style={{ height: "100%", borderRadius: 18, padding: "24px 20px", background: "var(--paper)", border: "1px solid var(--line)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(140deg,var(--flame),var(--gold))", display: "grid", placeItems: "center" }}>
                    <p.icon size={20} strokeWidth={2} color="#fff" aria-hidden />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15.5, color: "var(--ink)", margin: 0, lineHeight: 1.3 }}>{p.name}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,54px)", letterSpacing: "-1.2px", color: "var(--cream)", margin: "0 0 16px", lineHeight: 0.98 }}>
            Journey with us.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(245,246,250,.6)", margin: "0 0 32px" }}>
            Follow along for programs, prayer, and updates from CACNA's youth and young adults.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
            <a
              href={YOUTH_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sheen press-lg"
              style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "17px 34px", borderRadius: 999, textDecoration: "none" }}
            >
              <InstagramIcon size={18} /> @cacnayyam
            </a>
            <Link
              href="/contact"
              className="press-lg"
              style={{ display: "inline-block", background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 16, padding: "17px 34px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}
            >
              Contact Us →
            </Link>
          </div>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
