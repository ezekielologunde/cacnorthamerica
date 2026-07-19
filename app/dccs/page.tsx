import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { Landmark } from "lucide-react";
import { getLeaders } from "@/lib/leaders";

export const revalidate = 3600;

export const metadata = {
  title: "Our DCCs — Christ Apostolic Church North America (CACNA)",
  description: "CACNA's District Church Councils (DCCs) and their Superintendents across the United States and Canada.",
  alternates: { canonical: "/dccs" },
};

export default async function DCCsPage() {
  const superintendents = await getLeaders(["dcc_superintendent"]);

  return (
    <main>
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -100, width: 640, height: 500, background: "radial-gradient(circle,rgba(45,66,201,.25),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Our DCCs</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(42px,6vw,80px)", letterSpacing: "-2px", color: "#fff", margin: "16px 0", lineHeight: .95 }}>
              District Church Councils.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(245,246,250,.72)", lineHeight: 1.65, maxWidth: 620, margin: "0 auto" }}>
              CACNA's DCCs (District Church Councils) are a separate tier from our Zones — each shepherded by its own Superintendent across the United States and Canada.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Directory */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          {superintendents.length === 0 ? (
            <Reveal>
              <p style={{ fontSize: 16, color: "var(--ink-soft)", textAlign: "center" }}>DCC directory coming soon.</p>
            </Reveal>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
              {superintendents.map((d, i) => (
                <Reveal key={d.id} delay={i * 50}>
                  <div className="card-lift" style={{ height: "100%", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "24px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Landmark size={15} strokeWidth={2.5} color="var(--red)" aria-hidden />
                      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--red)" }}>{d.zone_name}</span>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, letterSpacing: "-.3px", color: "var(--ink)", margin: "0 0 3px", lineHeight: 1.2 }}>{d.full_name}</h3>
                      <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>DCC Superintendent</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
