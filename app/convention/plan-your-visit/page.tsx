import { ConventionNav } from "@/components/convention/ConventionNav";
import { ConventionFooter } from "@/components/convention/ConventionFooter";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";
import {
  hotels, hotelGroupCode, venueAddress, recommendedAirport, nearbyAirports,
  drivingRoute, budgetLodgingNote, rules,
} from "@/lib/convention/plan-your-visit";

export const metadata = {
  title: "Plan Your Visit — CACNA Convention",
  description: "Hotels, travel directions, and etiquette guidelines for attending the CACNA Annual Convention at CAC Village.",
  alternates: { canonical: "/convention/plan-your-visit" },
};

export default function PlanYourVisitPage() {
  return (
    <main>
      <ConventionNav />
      <ConventionPageHero
        eyebrow="Plan Your Visit"
        title="Getting to CAC Village"
        subhead={venueAddress}
      />

      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 48 }}>

          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.6vw,28px)", color: "var(--ink)", margin: "0 0 8px" }}>Travel</h2>
            <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 18 }}>
              Recommended airport: <strong style={{ color: "var(--ink)" }}>{recommendedAirport.name}</strong> ({recommendedAirport.distanceMiles} mi from CAC Village)
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, marginBottom: 18 }}>
              {nearbyAirports.map((a) => (
                <div key={a.name} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: "12px 16px" }}>
                  <div style={{ fontSize: 14, color: "var(--ink)", fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>{a.distanceMiles} mi away</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>Driving route: {drivingRoute}</p>
          </Reveal>

          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.6vw,28px)", color: "var(--ink)", margin: "0 0 8px" }}>Hotels</h2>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 18 }}>
              Group booking code: <strong style={{ color: "var(--ink)" }}>{hotelGroupCode}</strong>. {budgetLodgingNote}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
              {hotels.map((h) => (
                <div key={`${h.name}-${h.city}`} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "16px 18px" }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink)" }}>{h.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>{h.city}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 13 }}>
                    <span style={{ color: "var(--ink-soft)" }}>{h.phone}</span>
                    <span style={{ fontWeight: 700, color: "var(--red)" }}>${h.ratePerNight}/night</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>{h.bookingNote}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.6vw,28px)", color: "var(--ink)", margin: "0 0 18px" }}>Convention Etiquette — Please Remember</h2>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {rules.remember.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 12, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                  <span style={{ fontWeight: 800, color: "var(--red)", flexShrink: 0 }}>{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.6vw,28px)", color: "var(--ink)", margin: "0 0 18px" }}>Rules</h2>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {rules.rules.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 12, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                  <span style={{ fontWeight: 800, color: "var(--red)", flexShrink: 0 }}>{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
            <p style={{ marginTop: 20, fontSize: 13, color: "var(--ink-soft)", fontStyle: "italic" }}>
              — {rules.attribution.name}, {rules.attribution.title}
            </p>
          </Reveal>

        </div>
      </section>

      <ConventionFooter />
    </main>
  );
}
