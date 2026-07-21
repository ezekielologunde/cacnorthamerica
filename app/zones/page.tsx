import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { ZoneDirectory } from "@/components/zones/ZoneDirectory";
import { NearbyChurchFinder } from "@/components/zones/NearbyChurchFinder";
import { getLeaders } from "@/lib/leaders";

export const revalidate = 3600;

export const metadata = {
  title: "Zones & DCCs — Christ Apostolic Church North America (CACNA)",
  description: "Find your CACNA Zone or DCC and its Superintendent — filter or search the full directory of leaders shepherding member churches across the United States, Canada, and South America.",
  alternates: { canonical: "/zones" },
};

export default async function ZonesPage() {
  const leaders = await getLeaders(["zonal_superintendent", "dcc_superintendent"]);

  return (
    <main id="main-content">
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -100, width: 640, height: 500, background: "radial-gradient(circle,rgba(200,30,58,.25),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Zones &amp; DCCs</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(42px,6vw,80px)", letterSpacing: "-2px", color: "#fff", margin: "16px 0", lineHeight: .95 }}>
              Find your zone.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(245,246,250,.72)", lineHeight: 1.65, maxWidth: 620, margin: "0 auto" }}>
              CACNA's member churches across the United States, Canada, and South America are organized into Zones and DCCs (District Church Councils), each shepherded by a Superintendent. Filter or search below, or reach out directly to the one nearest you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Directory */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal>
            <NearbyChurchFinder leaders={leaders} />
          </Reveal>
          {leaders.length === 0 ? (
            <Reveal>
              <p style={{ fontSize: 16, color: "var(--ink-soft)", textAlign: "center" }}>Zone directory coming soon.</p>
            </Reveal>
          ) : (
            <Reveal>
              <ZoneDirectory leaders={leaders} />
            </Reveal>
          )}
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
