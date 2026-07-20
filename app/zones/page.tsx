import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { Phone, Mail, MapPin } from "lucide-react";
import { getLeaders } from "@/lib/leaders";

export const revalidate = 3600;

export const metadata = {
  title: "Our Zones — Christ Apostolic Church North America (CACNA)",
  description: "Find your CACNA zone and its superintendent — the DCC/Zonal leaders shepherding member churches across the United States, Canada, and South America.",
  alternates: { canonical: "/zones" },
};

export default async function ZonesPage() {
  const superintendents = await getLeaders(["zonal_superintendent"]);

  return (
    <main>
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -100, width: 640, height: 500, background: "radial-gradient(circle,rgba(200,30,58,.25),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Our Zones</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(42px,6vw,80px)", letterSpacing: "-2px", color: "#fff", margin: "16px 0", lineHeight: .95 }}>
              Find your zone.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(245,246,250,.72)", lineHeight: 1.65, maxWidth: 620, margin: "0 auto" }}>
              CACNA's member churches across the United States, Canada, and South America are organized into DCCs and Zones, each shepherded by a Zonal Superintendent. Reach out directly to the one nearest you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Directory */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          {superintendents.length === 0 ? (
            <Reveal>
              <p style={{ fontSize: 16, color: "var(--ink-soft)", textAlign: "center" }}>Zone directory coming soon.</p>
            </Reveal>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
              {superintendents.map((z, i) => (
                <Reveal key={z.id} delay={i * 50}>
                  <div className="card-lift" style={{ height: "100%", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "26px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <MapPin size={15} strokeWidth={2.5} color="var(--red)" aria-hidden />
                      <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--red)" }}>{z.zone_name}</span>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, letterSpacing: "-.3px", color: "var(--ink)", margin: "0 0 3px", lineHeight: 1.2 }}>{z.full_name}</h3>
                      <div style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>Zonal Superintendent</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto", paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                      {z.phone && (
                        <a href={`tel:${z.phone.replace(/[^\d+]/g, "")}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}>
                          <Phone size={14} strokeWidth={2} color="var(--ink-soft)" aria-hidden /> {z.phone}
                        </a>
                      )}
                      {z.email && (
                        <a href={`mailto:${z.email}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--ink)", textDecoration: "none", wordBreak: "break-all" }}>
                          <Mail size={14} strokeWidth={2} color="var(--ink-soft)" aria-hidden /> {z.email}
                        </a>
                      )}
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
