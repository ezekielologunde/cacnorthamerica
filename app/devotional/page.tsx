import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { VerseOfDay } from "@/components/sections/VerseOfDay";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";

export const metadata = {
  title: "Devotional — Christ Apostolic Church North America (CACNA)",
  description:
    "Daily encouragement from God's Word — a verse of the day and written devotionals from CACNA.",
  alternates: { canonical: "/devotional" },
};

// The three "Reflections" and the "2026 Daily Confession" that used to sit
// here were generic devotional text inherited from the cac-salvation-center
// template with no way to verify they're actually CACNA's own words or
// practice — replaced with an honest "coming soon" placeholder below rather
// than presenting unverified content as CACNA's official voice.

const children = [
  {
    affirmation: "I am forgiven",
    ref: "Ephesians 1:6-8",
    text: "So we praise God for the glorious grace he has poured out on us who belong to his dear Son. He is so rich in kindness and grace that he purchased our freedom with the blood of his Son and forgave our sins. He has showered his kindness on us, along with all wisdom and understanding.",
    accent: "linear-gradient(140deg,#2D42C9,#C81E3A)",
  },
  {
    affirmation: "I am reconciled with God",
    ref: "2 Corinthians 5:18-19",
    text: "All this is from God, who reconciled us to himself through Christ and gave us the ministry of reconciliation: that God was reconciling the world to himself in Christ, not counting people's sins against them. And he has committed to us the message of reconciliation.",
    accent: "linear-gradient(140deg,#FDC841,#2D42C9)",
  },
];

const memoryVerse = {
  text: "“I am the Alpha and the Omega, the Beginning and the End,” says the Lord, “who is and who was and who is to come, the Almighty.”",
  ref: "Revelation 1:8",
};

export default function DevotionalPage() {
  return (
    <main>
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 90px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 740, height: 460, background: "radial-gradient(circle,rgba(253,200,65,.22),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 16s ease-in-out infinite" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal from="scale">
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Devotional</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(44px,6.5vw,92px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0", lineHeight: 0.95, textWrap: "balance" }}>
            <RevealText immediate>Daily bread</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ color: "var(--red)" }}>
              for the soul.
            </RevealText>
          </h1>
          <Reveal delay={360}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(245,246,250,.72)", lineHeight: 1.7, maxWidth: 540, margin: "0 auto", textWrap: "pretty" }}>
              A word of encouragement to carry into your day — straight from Scripture and from our family to yours.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2026 Watchword */}
      <section style={{ background: "linear-gradient(135deg,#7A1128,#C81E3A)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -80, width: 520, height: 420, background: "radial-gradient(circle,rgba(253,200,65,.28),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Our 2026 Watchword</span>
          </Reveal>
          <Reveal delay={90}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4.2vw,52px)", letterSpacing: "-0.02em", color: "#fff", margin: "18px 0 0", lineHeight: 1.12, textWrap: "balance" }}>
              “Open my eyes, that I may see wondrous things from Your law.”
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 26, fontSize: 12.5, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)" }}>
              <span style={{ width: 28, height: 1, background: "rgba(253,200,65,.55)" }} aria-hidden />
              Psalm 119:18
              <span style={{ width: 28, height: 1, background: "rgba(253,200,65,.55)" }} aria-hidden />
            </div>
          </Reveal>
          <Reveal delay={320}>
            <p style={{ fontStyle: "italic", fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(245,246,250,.7)", margin: "22px 0 0", lineHeight: 1.6 }}>
              “Là mí li ojú, kí èmi kí ó lè máa wò ohun ìyanu wọ̀nnì láti inú òfin rẹ.”
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(253,200,65,.75)", marginTop: 10 }}>
              Orin Dafidi 119:18 · Yorùbá
            </div>
          </Reveal>
        </div>
      </section>

      {/* Verse of the day */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <VerseOfDay />
      </section>

      {/* Written devotionals — real CACNA-written reflections coming soon */}
      <section style={{ background: "var(--cream)", padding: "clamp(40px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1px", color: "var(--ink)", margin: "0 0 16px" }}>Reflections</h2>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7 }}>
              Written devotionals from CACNA&apos;s own pastors and ministers are coming soon. In the meantime, this year&apos;s Watchword above carries the theme, and the{" "}
              <a href="/blog" style={{ color: "var(--red)", fontWeight: 700, textDecoration: "none" }}>blog</a> has reflections from the family.
            </p>
          </Reveal>
        </div>
      </section>

      {/* For the children */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--flame)" }}>For the children</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 0", lineHeight: 1 }}>I am His.</h2>
            <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: "12px auto 0", maxWidth: 520 }}>
              Truths for our little ones to say out loud and carry in their hearts.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {children.map((c, i) => (
              <Reveal key={c.affirmation} delay={i * 90}>
                <article style={{ height: "100%", background: "var(--paper)", borderRadius: 24, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "0 12px 30px rgba(18,20,30,.07)", display: "flex", flexDirection: "column" }}>
                  <div style={{ background: c.accent, padding: "26px 28px" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,.8)", marginBottom: 6 }}>Say it out loud</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,32px)", letterSpacing: "-.5px", color: "#fff", lineHeight: 1.05 }}>{c.affirmation}.</div>
                  </div>
                  <div style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.75, margin: "0 0 16px", flex: 1 }}>{c.text}</p>
                    <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)" }}>{c.ref}</div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={160} style={{ marginTop: 24 }}>
            <div style={{ background: "linear-gradient(140deg,#1C3A2A,#2E6040)", borderRadius: 24, padding: "clamp(28px,4vw,40px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div aria-hidden style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: "radial-gradient(circle,rgba(253,200,65,.22),transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>This week&apos;s memory verse</span>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(18px,2.4vw,26px)", color: "#fff", lineHeight: 1.5, letterSpacing: "-.3px", margin: "16px auto 0", maxWidth: 720, textWrap: "balance" }}>
                  &ldquo;{memoryVerse.text}&rdquo;
                </p>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".5px", color: "var(--gold)", marginTop: 16 }}>{memoryVerse.ref}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Daily Confession — coming soon, pending a verified CACNA-specific text */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Coming soon</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 16px" }}>Our Daily Confession</h2>
            <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>
              CACNA&apos;s own daily confession will be published here once confirmed with our regional leadership.
            </p>
          </Reveal>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
