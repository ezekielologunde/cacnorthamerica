import { Reveal } from "@/components/ui/Reveal";

interface ConventionPageHeroProps {
  eyebrow: string;
  title: string;
  subhead?: string;
}

export function ConventionPageHero({ eyebrow, title, subhead }: ConventionPageHeroProps) {
  return (
    <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 70px", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: -120, right: -100, width: 640, height: 500, background: "radial-gradient(circle,rgba(253,200,65,.22),transparent 65%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>{eyebrow}</span>
        </Reveal>
        <Reveal delay={80}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,5.5vw,64px)", letterSpacing: "-2px", color: "#fff", margin: "16px 0", lineHeight: .98 }}>
            {title}
          </h1>
        </Reveal>
        {subhead ? (
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(15px,1.7vw,18px)", color: "rgba(245,246,250,.72)", lineHeight: 1.65, maxWidth: 640 }}>
              {subhead}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
