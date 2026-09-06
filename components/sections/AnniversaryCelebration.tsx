import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Magnetic } from "@/components/ui/Magnetic";
import { PartyPopper } from "lucide-react";
import { specialEvents, isEventPast } from "@/lib/events";

// Same facts as the dedicated event page (app/events/cacna-50th-anniversary-2026)
// and the Hero carousel's rotating slide -- this is the third, most
// permanent surface for it, since a carousel slide only shows part of the
// time as it rotates.
const ev = specialEvents.find((e) => e.id === "cacna-50th-anniversary-2026")!;

export function AnniversaryCelebration() {
  if (isEventPast(ev)) return null;

  return (
    <section style={{ position: "relative", overflow: "hidden", background: "var(--gradient-band)", padding: "clamp(72px,9vw,120px) clamp(20px,5vw,64px)" }}>
      {/* This used to be a per-slide hero background (the anniversary slide,
          before the hero moved to one persistent video for every slide) --
          featured here full-bleed instead of shrunk into the photo marquee. */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(/images/cac-gathering-crowd.jpg)", backgroundSize: "cover", backgroundPosition: "center",
      }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(10,11,18,.92) 0%,rgba(28,30,46,.85) 55%,rgba(10,11,18,.92) 100%)" }} />
      <div aria-hidden style={{ position: "absolute", top: -120, right: -100, width: 640, height: 560, background: "radial-gradient(circle,rgba(253,200,65,.22),transparent 65%)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: -140, left: -100, width: 420, height: 420, borderRadius: "50%", background: "rgba(255,255,255,.03)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28, background: "rgba(253,200,65,.14)", border: "1px solid rgba(253,200,65,.4)", borderRadius: 999, padding: "8px 18px" }}>
            <PartyPopper size={15} strokeWidth={2.5} color="var(--gold)" aria-hidden />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)" }}>{ev.dateLabel} · {ev.timeLabel}</span>
          </div>
        </Reveal>

        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(72px,12vw,140px)", lineHeight: 0.9, letterSpacing: "-0.03em", color: "var(--gold)" }}>
          50
        </div>

        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,5vw,58px)", letterSpacing: "-0.03em", color: "#fff", margin: "8px 0 20px", lineHeight: 1.02, textWrap: "balance" }}>
          <RevealText immediate>50 Years. One Family.</RevealText>
        </h2>

        <Reveal delay={140}>
          <p style={{ fontSize: "clamp(16px,1.9vw,19px)", color: "rgba(245,246,250,.75)", lineHeight: 1.72, maxWidth: 560, margin: "0 auto 36px", textWrap: "pretty" }}>
            {ev.desc}
          </p>
          <Magnetic strength={0.35}>
            <a
              href={ev.href}
              className="btn-sheen press"
              style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                background: "var(--gold)", color: "var(--ink)",
                fontWeight: 800, fontSize: 16,
                padding: "17px 34px", borderRadius: 999,
                textDecoration: "none",
                boxShadow: "0 16px 40px rgba(253,200,65,.35)",
              }}
            >
              <PartyPopper size={17} strokeWidth={2} aria-hidden />
              Celebrate With Us
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
