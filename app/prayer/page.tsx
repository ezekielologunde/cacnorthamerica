import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { PrayerForm } from "@/components/sections/PrayerForm";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Link from "next/link";

export const metadata = {
  title: "Prayer Requests — CAC Salvation Center",
  description:
    "Share a prayer request with the pastoral team at CAC Salvation Center, Randallstown MD. Confidential, personal, and covered in prayer. Join our daily 5 AM prayer line.",
  alternates: { canonical: "/prayer" },
};

const scriptures = [
  { ref: "Philippians 4:6", text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." },
  { ref: "Matthew 18:20", text: "For where two or three gather in my name, there am I with them." },
  { ref: "James 5:16", text: "The prayer of a righteous person is powerful and effective." },
];

export default function PrayerPage() {
  return (
    <main>
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 90px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 720, height: 480, background: "radial-gradient(circle,rgba(214,40,40,.32),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 16s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: -80, right: -60, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(232,163,61,.18),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal from="scale">
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Prayer</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(44px,6.5vw,92px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0", lineHeight: 0.95, textWrap: "balance" }}>
            <RevealText immediate>Let us carry</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ background: "linear-gradient(100deg,#F15F22,#D62828,#E8A33D)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              it with you.
            </RevealText>
          </h1>
          <Reveal delay={360}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(255,247,239,.72)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto", textWrap: "pretty" }}>
              Whatever you&apos;re facing, you don&apos;t have to face it alone. Share your request and our pastoral team will lift it up in prayer — quietly, personally, and with love.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Form */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <Reveal>
          <PrayerForm />
        </Reveal>
      </section>

      {/* Daily prayer line band */}
      <section style={{ background: "linear-gradient(135deg,var(--red-deep),var(--red))", padding: "clamp(56px,7vw,84px) clamp(20px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: "-15%", background: "radial-gradient(circle at 75% 50%,rgba(241,95,34,.32),transparent 60%)", pointerEvents: "none", animation: "gradient-drift 14s ease-in-out infinite" }} />
        <Reveal style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,.7)" }}>Daily Prayer Line</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1px", color: "#fff", margin: "14px 0 18px", lineHeight: 0.98 }}>
            Pray with us every morning at 5:00 AM ET
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.8)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 30px" }}>
            Start your day in the presence of God. Dial in from anywhere — five minutes or fifty.
          </p>
          <a href="tel:+18572166700" className="btn-sheen press-lg" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", color: "var(--red)", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none" }}>
            (857) 216-6700
          </a>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,.75)", marginTop: 16 }}>Access code: <strong style={{ color: "#fff" }}>531312</strong></div>
        </Reveal>
      </section>

      {/* Scripture */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.5vw,48px)", letterSpacing: "-1px", color: "var(--ink)", margin: 0 }}>His promises over your prayers</h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {scriptures.map((s, i) => (
              <Reveal key={s.ref} delay={i * 70}>
                <div style={{ background: "var(--paper)", borderRadius: 18, padding: "26px 30px", border: "1px solid var(--line)", display: "flex", gap: 24, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", flexShrink: 0, minWidth: 104, paddingTop: 3 }}>{s.ref}</div>
                  <p style={{ fontSize: 17, color: "var(--ink)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>&ldquo;{s.text}&rdquo;</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Salvation CTA for seekers */}
      <section style={{ background: "var(--ink)", padding: "clamp(44px,5vw,70px) clamp(20px,5vw,64px)" }}>
        <Reveal style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,38px)", letterSpacing: "-.6px", color: "var(--cream)", margin: "0 0 8px" }}>Ready to give your life to Christ?</h2>
            <p style={{ fontSize: 15, color: "rgba(255,247,239,.6)", margin: 0 }}>Salvation is the beginning — and the door is always open. Take the first step today.</p>
          </div>
          <Link href="/salvation" className="press btn-sheen" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 15, padding: "15px 28px", borderRadius: 999, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, boxShadow: "0 10px 24px rgba(214,40,40,.35)" }}>
            Accept Christ today →
          </Link>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
