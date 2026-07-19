import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { CURRENT_WATCHWORD, PAST_WATCHWORDS } from "@/lib/watchwords";

export const metadata = {
  title: "Watchwords Since 1989 — Christ Apostolic Church North America (CACNA)",
  description:
    "Every CACNA annual Watchword on record, from 1989 to today — a scripture verse the church carries as its theme each year.",
  alternates: { canonical: "/watchwords" },
};

export default function WatchwordsPage() {
  return (
    <main>
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 90px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 740, height: 460, background: "radial-gradient(circle,rgba(253,200,65,.22),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 16s ease-in-out infinite" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal from="scale">
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Watchwords</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(44px,6.5vw,92px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0", lineHeight: 0.95, textWrap: "balance" }}>
            <RevealText immediate>A word for</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ color: "var(--red)" }}>
              every year.
            </RevealText>
          </h1>
          <Reveal delay={360}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(245,246,250,.72)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto", textWrap: "pretty" }}>
              Every year, CACNA carries a single scripture as its Watchword — a verse the whole family holds onto together. Here is every one on record, from 1989 to today.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Current year, spotlighted */}
      <section style={{ background: "linear-gradient(135deg,#7A1128,#C81E3A)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -80, width: 520, height: 420, background: "radial-gradient(circle,rgba(253,200,65,.28),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>{`Our ${CURRENT_WATCHWORD.year} Watchword`}</span>
          </Reveal>
          <Reveal delay={90}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4.2vw,52px)", letterSpacing: "-0.02em", color: "#fff", margin: "18px 0 0", lineHeight: 1.12, textWrap: "balance" }}>
              &ldquo;{CURRENT_WATCHWORD.verseText}&rdquo;
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 26, fontSize: 12.5, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)" }}>
              <span style={{ width: 28, height: 1, background: "rgba(253,200,65,.55)" }} aria-hidden />
              {CURRENT_WATCHWORD.verseRef}
              <span style={{ width: 28, height: 1, background: "rgba(253,200,65,.55)" }} aria-hidden />
            </div>
          </Reveal>
          {CURRENT_WATCHWORD.verseTextYoruba && (
            <Reveal delay={320}>
              <p style={{ fontStyle: "italic", fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(245,246,250,.7)", margin: "22px 0 0", lineHeight: 1.6 }}>
                &ldquo;{CURRENT_WATCHWORD.verseTextYoruba}&rdquo;
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* Full archive */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1px", color: "var(--ink)", margin: 0, lineHeight: 1 }}>
              The full archive
            </h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", margin: "14px auto 0", maxWidth: 520, lineHeight: 1.65 }}>
              {`${PAST_WATCHWORDS[0]?.year}–${PAST_WATCHWORDS[PAST_WATCHWORDS.length - 1]?.year}, transcribed from CACNA's own program records.`}
            </p>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {PAST_WATCHWORDS.map((w, i) => (
              <Reveal key={w.year} delay={Math.min(i, 10) * 40}>
                <div style={{
                  display: "flex", gap: "clamp(16px,3vw,32px)", alignItems: "baseline",
                  padding: "22px 4px", borderTop: "1px solid var(--line)",
                }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.6vw,28px)", color: "var(--red)", flexShrink: 0, minWidth: 68 }}>
                    {w.year}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "clamp(15px,1.7vw,17.5px)", fontStyle: "italic", color: "var(--ink)", margin: 0, lineHeight: 1.6, textWrap: "pretty" }}>
                      &ldquo;{w.verseText}&rdquo;
                    </p>
                    <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: ".5px", color: "var(--ink-soft)", marginTop: 6 }}>
                      {w.verseRef}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
