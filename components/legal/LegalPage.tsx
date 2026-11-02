import type { ReactNode } from "react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";

export type LegalSection = { heading: string; body: ReactNode };

/** Shared layout for the plain-language policy pages (/privacy, /terms,
 *  /refunds): the same cream hero as the other content pages, then a single
 *  readable column of headed sections. */
export function LegalPage({
  title,
  intro,
  lastUpdated,
  sections,
}: {
  title: string;
  intro: ReactNode;
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <main id="main-content">
      <Nav />

      <section style={{ background: "var(--cream)", padding: "calc(var(--bar-h, 0px) + 104px) clamp(20px,5vw,64px) clamp(32px,4vw,48px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,var(--blue),var(--red) 70%)", opacity: 0.1, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,6vw,72px)", letterSpacing: "-0.03em", color: "var(--ink)", margin: "0 0 14px", lineHeight: 0.98, textWrap: "balance" }}>
              {title}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--red)", margin: "0 0 14px" }}>Last updated: {lastUpdated}</p>
            <div style={{ fontSize: "clamp(16px,1.8vw,18px)", color: "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>{intro}</div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--paper)", padding: "clamp(32px,5vw,64px) clamp(20px,5vw,64px) clamp(64px,8vw,100px)" }}>
        <div className="legal-body" style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column" }}>
          {sections.map((s, i) => (
            <div key={s.heading} style={{ padding: "22px 0", borderBottom: i < sections.length - 1 ? "1px solid var(--line)" : "none" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(19px,2.2vw,22px)", letterSpacing: "-.3px", color: "var(--ink)", margin: "0 0 10px", lineHeight: 1.25 }}>
                {s.heading}
              </h2>
              <div style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.75 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}

/** Inline mailto link styled for the legal pages. */
export function MailLink({ address }: { address: string }) {
  return (
    <a href={`mailto:${address}`} style={{ color: "var(--red)", fontWeight: 700, textDecoration: "none", wordBreak: "break-word" }}>
      {address}
    </a>
  );
}
