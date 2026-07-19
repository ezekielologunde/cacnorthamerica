import Link from "next/link";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { currentOrNextConvention, dateRangeLabel, CONVENTION_VENUE_SHORT, hasExternalRegistrationUrl } from "@/lib/conventions";

// The single highest-priority CTA on the site — CACNA's Annual Convention
// registration. This section auto-rotates to whichever year is current/next
// (see lib/conventions.ts), so it never needs a manual update.
export function ConventionSpotlight() {
  const cy = currentOrNextConvention();
  const hasReg = !!cy.registrationUrl;

  return (
    <section style={{ background: "var(--ink)", padding: "clamp(48px,6vw,80px) clamp(20px,5vw,64px)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 900, height: 500, background: "radial-gradient(circle,rgba(253,200,65,.16),transparent 65%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <Reveal>
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 32,
            background: "linear-gradient(120deg,rgba(253,200,65,.08),rgba(200,30,58,.1))",
            border: "1px solid rgba(253,200,65,.25)", borderRadius: 28,
            padding: "clamp(32px,4vw,52px)",
          }}>
            <div style={{ maxWidth: 560 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)" }}>
                <Sparkles size={14} strokeWidth={2.5} aria-hidden /> CACNA&apos;s Flagship Gathering
              </span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4vw,52px)", letterSpacing: "-1.2px", color: "#fff", margin: "14px 0 16px", lineHeight: 1.02 }}>
                CACNA {cy.year} National Convention
              </h2>
              {cy.theme && (
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(17px,2vw,22px)", color: "rgba(255,247,239,.9)", margin: "0 0 18px", lineHeight: 1.35, textWrap: "balance" }}>
                  &ldquo;{cy.theme}&rdquo;
                </p>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 22px", marginBottom: 20 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14.5, color: "rgba(245,246,250,.75)" }}>
                  <CalendarDays size={16} strokeWidth={2} color="var(--gold)" aria-hidden /> {dateRangeLabel(cy)}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14.5, color: "rgba(245,246,250,.75)" }}>
                  <MapPin size={16} strokeWidth={2} color="var(--gold)" aria-hidden /> {CONVENTION_VENUE_SHORT}
                </span>
              </div>
              <p style={{ fontSize: 15, color: "rgba(245,246,250,.6)", lineHeight: 1.7, margin: 0 }}>
                {hasReg
                  ? "Six days of worship, teaching, and family — the whole CAC fold gathering as one, onsite and online. Rates rise as the date nears."
                  : "The dates and venue are confirmed today — full schedule, theme, and registration will be announced as the date approaches."}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 220 }}>
              {hasReg ? (
                hasExternalRegistrationUrl(cy) ? (
                  <a href={cy.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 17, padding: "18px 34px", borderRadius: 999, textDecoration: "none", boxShadow: "0 18px 40px rgba(253,200,65,.4)", whiteSpace: "nowrap" }}>
                    {`Convention ${cy.year}`} →
                  </a>
                ) : (
                  <Link href={cy.registrationUrl!} className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 17, padding: "18px 34px", borderRadius: 999, textDecoration: "none", boxShadow: "0 18px 40px rgba(253,200,65,.4)", whiteSpace: "nowrap" }}>
                    {`Convention ${cy.year}`} →
                  </Link>
                )
              ) : (
                <Link href={cy.href} className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 17, padding: "18px 34px", borderRadius: 999, textDecoration: "none", boxShadow: "0 18px 40px rgba(253,200,65,.4)", whiteSpace: "nowrap" }}>
                  Save the Date →
                </Link>
              )}
              <Link href={cy.href} className="press" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 700, fontSize: 14.5, color: "rgba(245,246,250,.75)", textDecoration: "none", padding: "10px 12px" }}>
                Full convention details →
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
