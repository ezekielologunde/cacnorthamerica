import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/** Merges what were two back-to-back, overlapping "find a church" sections
 *  (GlobalChurches' zone-directory CTA, PlanVisit's come-visit + regional
 *  office panel) into one — same real content, no repeated appeal. */
export function FindAChurch() {
  return (
    <section style={{ background: "var(--ink)", color: "var(--cream)", padding: "clamp(70px,9vw,120px) clamp(20px,5vw,64px)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: "-20%", right: "-10%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,30,58,.16),transparent 70%)", pointerEvents: "none" }} />
      <div className="r2c" style={{ maxWidth: 1200, margin: "0 auto", gap: "clamp(48px,5vw,72px)", position: "relative", zIndex: 1, alignItems: "center" }}>

        <Reveal>
          <div style={{
            width: 56, height: 56, borderRadius: 16, marginBottom: 22,
            background: "linear-gradient(135deg,var(--red),var(--red-deep))",
            display: "grid", placeItems: "center", boxShadow: "0 12px 28px rgba(200,30,58,.32)",
          }}>
            <MapPin size={26} strokeWidth={2} color="#fff" aria-hidden />
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>
            24 Zones &amp; DCCs · U.S., Canada &amp; South America
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(34px,4.6vw,58px)", letterSpacing: "-1.4px", margin: "14px 0 0", lineHeight: 1.03 }}>
            There&apos;s a seat with your name on it.
          </h2>
          <p style={{ fontSize: 16.5, color: "rgba(245,246,250,.72)", lineHeight: 1.75, margin: "18px 0 0", maxWidth: 480 }}>
            CACNA is a family of member churches, not a single building — each shepherded by a Zonal Superintendent. Search or browse the full directory to find the one nearest you.
          </p>
          <Link href="/zones" className="btn-sheen press" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            marginTop: 30, background: "var(--red)", color: "#fff", fontWeight: 800, fontSize: 16,
            padding: "16px 30px", borderRadius: 999, textDecoration: "none",
            boxShadow: "0 14px 34px rgba(200,30,58,.3)",
          }}>
            Browse the Zone Directory <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
          </Link>
        </Reveal>

        <Reveal delay={120}>
          <div style={{ width: "100%", height: 340, borderRadius: 26, overflow: "hidden", boxShadow: "0 26px 54px rgba(0,0,0,.4)", position: "relative" }}>
            <iframe
              title="Map to CAC Village, 14051 Stahley Road, Blue Ridge Summit, PA"
              src="https://maps.google.com/maps?q=14051%20Stahley%20Road%20Blue%20Ridge%20Summit%20PA%2017214&z=13&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: "100%", height: "100%", border: 0, display: "block" }}
            />
          </div>
          <div style={{ marginTop: 22, borderRadius: 20, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", padding: "22px 24px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(245,246,250,.5)", marginBottom: 14 }}>
              CACNA Regional Office &amp; CAC Village
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14.5 }}>
              <a href="tel:+13054690346" style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(245,246,250,.75)", textDecoration: "none" }}>
                <Phone size={15} strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden /> (305) 469-0346
              </a>
              <a href="mailto:info@cacnorthamerica.com" style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(245,246,250,.75)", textDecoration: "none" }}>
                <Mail size={15} strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden /> info@cacnorthamerica.com
              </a>
              <a href="https://maps.google.com/?q=14051+Stahley+Road+Blue+Ridge+Summit+PA+17214" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "flex-start", gap: 10, color: "rgba(245,246,250,.75)", textDecoration: "none" }}>
                <MapPin size={15} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden /> 14051 Stahley Road, Blue Ridge Summit, PA 17214
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
