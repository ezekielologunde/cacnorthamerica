import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { CAC_WORLDWIDE, CAC_ANOSIKE_EUROPE } from "@/lib/global";

export const metadata = {
  title: "Our Global Family — Christ Apostolic Church North America (CACNA)",
  description: "CACNA is one region within Christ Apostolic Church Worldwide — links to the global church and to CAC Anosike Region across the United Kingdom and Europe.",
  alternates: { canonical: "/global" },
};

export default function GlobalPage() {
  return (
    <main>
      <Nav heroDark />

      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -100, width: 640, height: 500, background: "radial-gradient(circle,rgba(253,200,65,.22),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>One Fold, One Shepherd</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6vw,76px)", letterSpacing: "-2px", color: "#fff", margin: "16px 0", lineHeight: .95 }}>
              Our Global Family
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(245,246,250,.72)", lineHeight: 1.65, maxWidth: 620 }}>
              CACNA is one region within Christ Apostolic Church Worldwide — here are the wider family and sister region we're part of.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>

          <Reveal>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 22, padding: "clamp(28px,4vw,40px)" }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)" }}>Worldwide</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,32px)", color: "var(--ink)", margin: "10px 0 16px" }}>
                {CAC_WORLDWIDE.name}
              </h2>
              <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 22 }}>{CAC_WORLDWIDE.description}</p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <a
                  href={CAC_WORLDWIDE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--red)", color: "#fff", fontWeight: 800, fontSize: 14, padding: "12px 24px", borderRadius: 999, textDecoration: "none" }}
                >
                  Visit cacworld.org →
                </a>
                <a
                  href={CAC_WORLDWIDE.newsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--cream-2)", color: "var(--ink)", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 999, textDecoration: "none", border: "1px solid var(--line)" }}
                >
                  CAC World News →
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 22, padding: "clamp(28px,4vw,40px)" }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)" }}>Sister Region</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,32px)", color: "var(--ink)", margin: "10px 0 16px" }}>
                {CAC_ANOSIKE_EUROPE.name}
              </h2>
              <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 10 }}>{CAC_ANOSIKE_EUROPE.description}</p>
              <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 22 }}>
                Regional Superintendent: <strong style={{ color: "var(--ink)" }}>{CAC_ANOSIKE_EUROPE.regionalSuperintendent}</strong>
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <a
                  href={CAC_ANOSIKE_EUROPE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--red)", color: "#fff", fontWeight: 800, fontSize: 14, padding: "12px 24px", borderRadius: 999, textDecoration: "none" }}
                >
                  Visit cacanosike.org →
                </a>
                <a
                  href={CAC_ANOSIKE_EUROPE.directoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--cream-2)", color: "var(--ink)", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 999, textDecoration: "none", border: "1px solid var(--line)" }}
                >
                  Find a church in the UK & Europe →
                </a>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
