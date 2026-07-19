import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { annualMoments } from "@/lib/events";
import { currentOrNextConvention } from "@/lib/conventions";

export function WhatToExpect() {
  const cy = currentOrNextConvention();

  return (
    <section style={{ background: "var(--cream)", padding: "100px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>
            How We Gather
          </span>
        </Reveal>
        <Reveal delay={80} style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,5vw,68px)", letterSpacing: "-1.5px", color: "var(--ink)", margin: 0, lineHeight: .95 }}>
            Our Annual Rhythm
          </h2>
        </Reveal>

        <div className="r3" style={{ gap: 20 }}>
          {annualMoments.map((m, i) => {
            const isConvention = m.id === "cacna-convention";
            const dark = isConvention;
            return (
              <Reveal key={m.id} delay={i * 100}>
                <div style={{
                  borderRadius: 24, padding: "36px 32px",
                  background: dark ? "var(--ink)" : "var(--paper)",
                  boxShadow: dark ? "0 24px 50px rgba(18,20,30,.28)" : "0 10px 26px rgba(18,20,30,.06)",
                  border: dark ? "none" : "1px solid var(--line)",
                  height: "100%", display: "flex", flexDirection: "column",
                }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, alignSelf: "flex-start",
                    background: dark ? "rgba(245,246,250,.1)" : "var(--cream-2)",
                    padding: "6px 14px", borderRadius: 999,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: dark ? "var(--gold)" : "var(--red)", letterSpacing: "1px", textTransform: "uppercase" }}>{m.when}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: dark ? "var(--cream)" : "var(--ink)", letterSpacing: "-.4px", margin: "0 0 14px" }}>
                    {m.title}
                  </h3>
                  <p style={{ fontSize: 15, color: dark ? "rgba(245,246,250,.65)" : "var(--ink-soft)", lineHeight: 1.65, margin: 0, flex: 1 }}>
                    {m.desc}
                  </p>
                  {isConvention && (
                    cy.registrationUrl ? (
                      <a
                        href={cy.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="press"
                        style={{ marginTop: 24, display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start", background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 14, padding: "11px 20px", borderRadius: 999, textDecoration: "none" }}
                      >
                        Register Now →
                      </a>
                    ) : (
                      <Link
                        href={cy.href}
                        className="press"
                        style={{ marginTop: 24, display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start", background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 14, padding: "11px 20px", borderRadius: 999, textDecoration: "none" }}
                      >
                        Save the Date →
                      </Link>
                    )
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
