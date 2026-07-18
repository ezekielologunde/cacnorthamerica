import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { VerseOfDay } from "@/components/sections/VerseOfDay";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";

export const metadata = {
  title: "Devotional — CAC Salvation Center",
  description:
    "Daily encouragement from God's Word — a verse of the day, written devotionals, and the Hope for Today podcast from CAC Salvation Center.",
  alternates: { canonical: "/devotional" },
};

const devotionals = [
  {
    title: "More than a greeting",
    ref: "Romans 1:16",
    body: "“Welcome home” isn't just something we say — it's the heart of the Gospel. God runs toward us. Whatever you carried in today, His welcome is bigger. Receive it, and let it become the way you welcome others.",
  },
  {
    title: "Start the day in His presence",
    ref: "Mark 1:35",
    body: "Before the noise, Jesus found a quiet place to pray. Mornings set the tone. Five minutes with God before the world gets loud will steady everything that follows. Join the 5 AM prayer line and begin there.",
  },
  {
    title: "The undiluted Word",
    ref: "2 Timothy 4:2",
    body: "We're called to preach the whole Gospel, clearly and without compromise. The same Word that comforts also corrects — and both are love. Let Scripture read you today, not just the other way around.",
  },
];

const confession: { kind: "verse" | "say"; ref?: string; text: string }[] = [
  { kind: "verse", ref: "Psalm 23:1–3", text: "The LORD is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. He leads me in paths of righteousness for His name’s sake." },
  { kind: "say", text: "As I go through the day, I’m covered by the blood of Jesus Christ, and I stand on the promise of the Word of God in —" },
  { kind: "verse", ref: "Isaiah 41:10", text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness." },
  { kind: "verse", ref: "Isaiah 41:11", text: "Behold, all they that were incensed against thee shall be ashamed and confounded: they shall be as nothing; and they that strive with thee shall perish." },
  { kind: "verse", ref: "Isaiah 41:12", text: "Thou shalt seek them, and shalt not find them, even them that contended with thee: they that war against thee shall be as nothing, and as a thing of nought." },
  { kind: "say", text: "Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the LORD forever." },
];

const children = [
  {
    affirmation: "I am forgiven",
    ref: "Ephesians 1:6-8",
    text: "So we praise God for the glorious grace he has poured out on us who belong to his dear Son. He is so rich in kindness and grace that he purchased our freedom with the blood of his Son and forgave our sins. He has showered his kindness on us, along with all wisdom and understanding.",
    accent: "linear-gradient(140deg,#F15F22,#D62828)",
  },
  {
    affirmation: "I am reconciled with God",
    ref: "2 Corinthians 5:18-19",
    text: "All this is from God, who reconciled us to himself through Christ and gave us the ministry of reconciliation: that God was reconciling the world to himself in Christ, not counting people's sins against them. And he has committed to us the message of reconciliation.",
    accent: "linear-gradient(140deg,#E8A33D,#F15F22)",
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
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 740, height: 460, background: "radial-gradient(circle,rgba(232,163,61,.22),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 16s ease-in-out infinite" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal from="scale">
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Devotional</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(44px,6.5vw,92px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0", lineHeight: 0.95, textWrap: "balance" }}>
            <RevealText immediate>Daily bread</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ background: "linear-gradient(100deg,#F15F22,#D62828,#E8A33D)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              for the soul.
            </RevealText>
          </h1>
          <Reveal delay={360}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(255,247,239,.72)", lineHeight: 1.7, maxWidth: 540, margin: "0 auto", textWrap: "pretty" }}>
              A word of encouragement to carry into your day — straight from Scripture and from our family to yours.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2026 Watchword */}
      <section style={{ background: "linear-gradient(135deg,#9E1B1B,#D62828)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -80, width: 520, height: 420, background: "radial-gradient(circle,rgba(232,163,61,.28),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Our 2026 Watchword</span>
          </Reveal>
          <Reveal delay={90}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4.2vw,52px)", letterSpacing: "-0.02em", color: "#fff", margin: "18px 0 0", lineHeight: 1.12, textWrap: "balance" }}>
              “Open my eyes, that I may see wondrous things from Your law.”
            </p>
          </Reveal>
          <Reveal delay={170}>
            <p lang="yo" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(18px,2.4vw,28px)", color: "rgba(255,247,239,.92)", margin: "20px 0 0", lineHeight: 1.3, textWrap: "balance" }}>
              “Là mí li ojú, kí èmi kí ó lè máa wò ohun ìyanu wọ̀nnì láti inú òfin rẹ.”
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 26, fontSize: 12.5, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)" }}>
              <span style={{ width: 28, height: 1, background: "rgba(232,163,61,.55)" }} aria-hidden />
              Psalm 119:18 · NKJV &amp; Yorùbá
              <span style={{ width: 28, height: 1, background: "rgba(232,163,61,.55)" }} aria-hidden />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Verse of the day */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <VerseOfDay />
      </section>

      {/* Written devotionals */}
      <section style={{ background: "var(--cream)", padding: "clamp(40px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1px", color: "var(--ink)", margin: 0 }}>Reflections</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {devotionals.map((d, i) => (
              <Reveal key={d.title} delay={i * 90}>
                <article className="card-lift" style={{ height: "100%", background: "var(--paper)", borderRadius: 22, padding: "30px 28px", border: "1px solid var(--line)", boxShadow: "0 12px 30px rgba(27,19,14,.07)", display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 12 }}>{d.ref}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, letterSpacing: "-.4px", color: "var(--ink)", margin: "0 0 12px" }}>{d.title}</h3>
                  <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.75, margin: 0 }}>{d.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
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
                <article style={{ height: "100%", background: "var(--paper)", borderRadius: 24, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "0 12px 30px rgba(27,19,14,.07)", display: "flex", flexDirection: "column" }}>
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
              <div aria-hidden style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: "radial-gradient(circle,rgba(232,163,61,.22),transparent 70%)", pointerEvents: "none" }} />
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

      {/* 2026 Daily Confession */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 36 }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Confess it daily · 2026</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 0" }}>Our Daily Confession</h2>
            <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: "12px auto 0", maxWidth: 540 }}>
              The declaration the Salvation Center family speaks over each day this year. Say it aloud, and walk in it.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 24, padding: "clamp(28px,4vw,46px)", boxShadow: "0 16px 40px rgba(27,19,14,.08)" }}>
              {confession.map((seg, i) =>
                seg.kind === "verse" ? (
                  <div key={i} style={{ marginBottom: i === confession.length - 1 ? 0 : 26 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>{seg.ref}</div>
                    <p style={{ fontSize: "clamp(16px,1.9vw,19px)", color: "var(--ink)", lineHeight: 1.75, margin: 0 }}>{seg.text}</p>
                  </div>
                ) : (
                  <p key={i} style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(18px,2.2vw,24px)", color: "var(--red-deep)", lineHeight: 1.5, letterSpacing: "-.3px", margin: i === confession.length - 1 ? 0 : "0 0 26px" }}>
                    {seg.text}
                  </p>
                )
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Hope for Today podcast */}
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 36 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Listen anywhere</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1px", color: "var(--cream)", margin: "12px 0 0" }}>Hope for Today</h2>
            <p style={{ fontSize: 16, color: "rgba(255,247,239,.6)", maxWidth: 480, margin: "14px auto 0", lineHeight: 1.6 }}>Our weekly podcast — inspired messages to strengthen your faith, wherever you are.</p>
          </Reveal>
          <Reveal delay={100}>
            <iframe
              style={{ borderRadius: 14, border: "none", display: "block" }}
              src="https://open.spotify.com/embed/show/0wFUgSZq4CuVuM0M9gRFUw?utm_source=generator"
              width="100%" height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Hope for Today podcast on Spotify"
            />
          </Reveal>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
