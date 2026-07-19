import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { currentOrNextConvention, dateRangeLabel, CONVENTION_VENUE_SHORT } from "@/lib/conventions";

/** Cross-promotes CACNA's own Annual Convention using this site's own real
 *  convention data (lib/conventions.ts) — never a live fetch to the separate
 *  Convention project, which is an independent Next.js app/Supabase instance
 *  with no shared backend. */
export function ConventionAdWidget() {
  const cy = currentOrNextConvention();
  const hasReg = !!cy.registrationUrl;

  return (
    <aside style={{
      background: "linear-gradient(140deg,#7A1128,#FDC841)",
      borderRadius: 20, padding: "24px 26px", position: "relative", overflow: "hidden",
      marginBottom: 24,
    }}>
      <div aria-hidden style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, background: "radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
          <Sparkles size={12} strokeWidth={2.5} color="#fff" aria-hidden />
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,.8)" }}>
            CACNA Convention
          </span>
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "#fff", lineHeight: 1.1, marginBottom: 10 }}>
          CACNA {cy.year} National Convention
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.85)", lineHeight: 1.6, marginBottom: 18 }}>
          {cy.theme ? `Theme: "${cy.theme}." ` : "Registration details announced soon. "}
          {dateRangeLabel(cy)} · {CONVENTION_VENUE_SHORT}
        </p>
        {hasReg ? (
          <a href={cy.registrationUrl} target="_blank" rel="noopener noreferrer" className="press" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "#fff", color: "var(--ink)", fontWeight: 800,
            fontSize: 13, padding: "10px 20px", borderRadius: 999, textDecoration: "none",
          }}>
            Register Now <ArrowRight size={13} strokeWidth={2.5} aria-hidden />
          </a>
        ) : (
          <Link href={cy.href} className="press" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "#fff", color: "var(--ink)", fontWeight: 800,
            fontSize: 13, padding: "10px 20px", borderRadius: 999, textDecoration: "none",
          }}>
            Event Details <ArrowRight size={13} strokeWidth={2.5} aria-hidden />
          </Link>
        )}
      </div>
    </aside>
  );
}
