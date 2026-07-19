import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { Phone } from "lucide-react";
import { PRAYER_LINE } from "@/lib/prayerLine";

const DIAL_TEL = `tel:+1${PRAYER_LINE.dialIn.replace(/\s/g, "")}`;

export function Impact() {
  return (
    <section style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg,#C81E3A 0%,#7A1128 50%,#6B1010 100%)",
      padding: "80px clamp(20px,5vw,64px)",
    }}>
      {/* Decorative drifting glow */}
      <div style={{ position: "absolute", inset: "-15%", background: "radial-gradient(circle at 70% 50%,rgba(45,66,201,.35),transparent 60%)", pointerEvents: "none", animation: "gradient-drift 14s ease-in-out infinite", willChange: "transform" }} />
      <div style={{ position: "absolute", top: -40, right: -40, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,.04)", pointerEvents: "none" }} />

      <div className="r2c" style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", gap: 60 }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,.65)" }}>
            {PRAYER_LINE.org}
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(34px,4.5vw,58px)", letterSpacing: "-1.5px", color: "#fff", margin: "14px 0 20px", lineHeight: .96 }}>
            {PRAYER_LINE.name}
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.75)", lineHeight: 1.7, maxWidth: 420 }}>
            {PRAYER_LINE.tagline} — come as you are, wherever you are.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div style={{ background: "rgba(255,255,255,.1)", borderRadius: 24, padding: "36px 32px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.15)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.6)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>Dial in daily at</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3.2vw,38px)", color: "#fff", letterSpacing: "-.5px", marginBottom: 6, display: "flex", flexWrap: "wrap", gap: "0 10px" }}>
              {PRAYER_LINE.times.map((t, i) => (
                <span key={t.zone}>{t.label} {t.zone}{i < PRAYER_LINE.times.length - 1 && " ·"}</span>
              ))}
            </div>
            <a href={DIAL_TEL} style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,36px)", color: "#FFD9A8", textDecoration: "none", marginBottom: 18 }}>
              {PRAYER_LINE.dialIn}
            </a>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,.65)", marginBottom: 24 }}>
              Access Code: <strong style={{ color: "#fff" }}>{PRAYER_LINE.code}</strong>
            </div>
            <Magnetic strength={0.45}>
              <a href={DIAL_TEL} className="btn-sheen" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "#fff", color: "var(--red)",
                fontWeight: 800, fontSize: 15,
                padding: "14px 28px", borderRadius: 999,
                textDecoration: "none",
              }}>
                <Phone size={17} strokeWidth={2} aria-hidden />
                Dial In Now
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
