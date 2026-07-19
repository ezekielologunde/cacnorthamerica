import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RegisterFlow } from "@/components/convention/RegisterFlow";
import { createServiceClient } from "@/lib/supabase/server";
import { currentOrNextConvention, dateRangeLabel, CONVENTION_VENUE_SHORT } from "@/lib/conventions";
import { getActivePricingForYear } from "@/lib/registration";

export const metadata = {
  title: "Register — CACNA Annual Convention",
  description: "Register for the CACNA Annual Convention — individual or group/church registration, with pricing by category.",
  alternates: { canonical: "/convention/register" },
};

// Sourced verbatim from the real, printed convention registration
// guidelines (ported from the Convention project's lib/content/registration-guidelines.ts).
const GUIDELINES = [
  "All registrations must be done online.",
  "Couples can register together.",
  "All children and youth must be registered separately under Youth and Child registration.",
  "All registration fees include participation and needed conference items and package.",
  "Registration does not cover hotel accommodation — participants should book hotel accommodation personally online.",
];
const FREE_FOOD_NOTE = "Food during convention is free for all age groups.";

export default async function ConventionRegisterPage() {
  const cy = currentOrNextConvention();
  const supabase = createServiceClient();
  const tiers = await getActivePricingForYear(supabase, cy.year);

  return (
    <main>
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -100, width: 640, height: 500, background: "radial-gradient(circle,rgba(253,200,65,.22),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Register</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6vw,76px)", letterSpacing: "-2px", color: "#fff", margin: "16px 0", lineHeight: .95 }}>
              CACNA {cy.year} Convention
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(245,246,250,.72)", lineHeight: 1.65, maxWidth: 620 }}>
              {dateRangeLabel(cy)} · {CONVENTION_VENUE_SHORT}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pricing summary */}
      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px) 0" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          {tiers.length === 0 ? (
            <Reveal>
              <div style={{ background: "rgba(253,200,65,.14)", border: "1px solid rgba(253,200,65,.3)", borderRadius: 16, padding: "18px 22px", marginBottom: 32 }}>
                <p style={{ margin: 0, fontSize: 14.5, color: "var(--ink)", lineHeight: 1.6 }}>
                  <strong>Pricing hasn&apos;t been announced yet</strong> — you can still submit your registration details below and our team will follow up about payment, or check back closer to the convention for online pricing.
                </p>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 36 }}>
                {tiers.map((t) => (
                  <div key={t.id} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "18px 20px", textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 6 }}>
                      {t.category === "adult" ? "Adult" : t.category === "young_adult" ? "Young Adult" : "Child"}
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--ink)" }}>
                      ${(t.price_cents / 100).toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Registration form */}
      <section style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px) clamp(60px,8vw,100px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Reveal>
            <RegisterFlow />
          </Reveal>
        </div>
      </section>

      {/* Guidelines */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,32px)", color: "var(--ink)", margin: "0 0 20px" }}>
              Registration Guidelines
            </h2>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {GUIDELINES.map((item, i) => (
                <li key={item} style={{ display: "flex", gap: 12, fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 800, color: "var(--red)", flexShrink: 0 }}>{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
            <p style={{ marginTop: 18, fontSize: 14.5, fontWeight: 700, color: "var(--red)" }}>{FREE_FOOD_NOTE}</p>
          </Reveal>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
