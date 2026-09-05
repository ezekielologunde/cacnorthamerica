import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { CONVENTION_VENUE } from "@/lib/conventions";
import {
  hotels, HOTEL_GROUP_CODE, airports, drivingRoute, drivingRouteAltNote,
  groundTransportNote, budgetLodgingNote, remotenessNote, weather, packingChecklist,
  nearbyEssentials, remember, rules, rulesAttribution, type NearbyEssential,
} from "@/lib/planYourVisit";
import { setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Plan Your Visit — Christ Apostolic Church North America (CACNA)",
  description:
    "Everything you need to plan your trip to the CACNA Annual Convention at CAC Village — travel, hotels, weather, what to pack, nearby essentials, and convention etiquette.",
  alternates: { canonical: "/plan-your-visit" },
};

const CATEGORY_LABEL: Record<NearbyEssential["category"], string> = {
  food: "Food",
  groceriesPharmacy: "Groceries & Pharmacy",
  gas: "Gas",
};

function groupByArea(items: NearbyEssential[]) {
  const areas: string[] = [];
  const byArea = new Map<string, NearbyEssential[]>();
  for (const item of items) {
    if (!byArea.has(item.area)) {
      areas.push(item.area);
      byArea.set(item.area, []);
    }
    byArea.get(item.area)!.push(item);
  }
  return areas.map((area) => ({ area, items: byArea.get(area)! }));
}

export default async function PlanYourVisitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const essentialsByArea = groupByArea(nearbyEssentials);

  return (
    <main id="main-content">
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 640, height: 520, background: "radial-gradient(circle,rgba(253,200,65,.28),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal from="scale">
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Annual Convention</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6vw,76px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0", lineHeight: 1.02, textWrap: "balance" }}>
            <RevealText immediate>Plan Your Visit</RevealText>
          </h1>
          <Reveal delay={200}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(245,246,250,.72)", lineHeight: 1.7, maxWidth: 620, margin: "0 auto" }}>
              Everything you need to get to {CONVENTION_VENUE} and make the most of your week.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Travel */}
      <section style={{ background: "var(--paper)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Getting There</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,40px)", color: "var(--ink)", margin: "10px 0 0" }}>Travel</h2>
          </Reveal>
          <div className="r2" style={{ gap: 20 }}>
            <Reveal>
              <div style={{ background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 18, padding: "22px 24px", height: "100%" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 12 }}>By Air</div>
                {airports.map((a) => (
                  <div key={a.name} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                    <span style={{ fontSize: 14, fontWeight: a.recommended ? 700 : 500, color: "var(--ink)" }}>
                      {a.name}{a.code ? ` (${a.code})` : ""}{a.recommended ? " — recommended" : ""}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--ink-soft)", whiteSpace: "nowrap" }}>{a.distanceMiles} mi</span>
                  </div>
                ))}
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: "14px 0 0" }}>
                  <strong style={{ color: "var(--ink)" }}>Driving route:</strong> {drivingRoute}
                </p>
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: "10px 0 0" }}>{drivingRouteAltNote}</p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
                <div style={{ background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 22px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>Ground Transport</div>
                  <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>{groundTransportNote}</p>
                </div>
                <div style={{ background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 22px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>The Venue</div>
                  <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>{remotenessNote}</p>
                </div>
                <div style={{ height: 180, borderRadius: 18, overflow: "hidden", border: "1px solid var(--line)" }}>
                  <iframe title="Map to CAC Village" src="https://maps.google.com/maps?q=14051%20Stahley%20Road%20Blue%20Ridge%20Summit%20PA%2017214&z=11&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: "100%", height: "100%", border: 0, display: "block" }} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Hotels */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 28 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Stay Nearby</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,40px)", color: "var(--ink)", margin: "10px 0 8px" }}>Hotels</h2>
            <p style={{ fontSize: 14.5, color: "var(--ink-soft)" }}>
              Mention the group code <strong style={{ color: "var(--ink)" }}>&ldquo;{HOTEL_GROUP_CODE}&rdquo;</strong> for the rates below. {budgetLodgingNote}
            </p>
          </Reveal>
          <div style={{ borderRadius: 18, border: "1px solid var(--line)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr", background: "var(--ink)", color: "#fff", fontSize: 11.5, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", padding: "12px 18px" }}>
              <span>Hotel</span><span>City</span><span>Rate/night</span><span>Book</span>
            </div>
            {hotels.map((h, i) => (
              <div key={`${h.name}-${h.city}`} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr", padding: "13px 18px", background: i % 2 ? "var(--cream)" : "var(--paper)", fontSize: 13.5, alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: "var(--ink)" }}>{h.name}</span>
                <span style={{ color: "var(--ink-soft)" }}>{h.city}</span>
                <span style={{ color: "var(--ink-soft)" }}>${h.ratePerNight}</span>
                <a href={`tel:${h.phone.replace(/[^0-9]/g, "")}`} style={{ color: "var(--red)", fontWeight: 700, textDecoration: "none" }}>{h.phone}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather + Packing */}
      <section style={{ background: "var(--paper)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div className="r2" style={{ maxWidth: 900, margin: "0 auto", gap: 40 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>July Weather</span>
            <div style={{ display: "flex", gap: 24, margin: "14px 0 16px" }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, color: "var(--ink)", lineHeight: 1 }}>{weather.averageHighF}°</div>
                <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>Average high</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, color: "var(--ink-soft)", lineHeight: 1 }}>{weather.averageLowF}°</div>
                <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>Average low</div>
              </div>
            </div>
            <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>{weather.note}</p>
          </Reveal>
          <Reveal delay={80}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Packing Checklist</span>
            <ul style={{ margin: "16px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {packingChecklist.map((item) => (
                <li key={item} style={{ display: "flex", gap: 10, fontSize: 14.5, color: "var(--ink-soft)" }}>
                  <span aria-hidden style={{ color: "var(--red)", fontWeight: 800 }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Nearby Essentials */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Nearby Essentials</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,40px)", color: "var(--ink)", margin: "10px 0 0" }}>Food, groceries & gas.</h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {essentialsByArea.map((group) => (
              <Reveal key={group.area}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--red)", margin: "0 0 12px" }}>{group.area}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
                  {group.items.map((item) => (
                    <div key={item.name} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>{item.name}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--ink-soft)", whiteSpace: "nowrap" }}>{CATEGORY_LABEL[item.category]}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>{item.address}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Rules & Etiquette */}
      <section style={{ background: "var(--paper)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div className="r2" style={{ maxWidth: 1000, margin: "0 auto", gap: 40 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Please Remember</span>
            <ol style={{ margin: "16px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {remember.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                  <span style={{ color: "var(--red)", fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span> {item}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={80}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Rules</span>
            <ol style={{ margin: "16px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {rules.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                  <span style={{ color: "var(--red)", fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span> {item}
                </li>
              ))}
            </ol>
            <p style={{ fontSize: 12.5, color: "var(--ink-soft)", fontStyle: "italic", marginTop: 16 }}>— {rulesAttribution}</p>
          </Reveal>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
