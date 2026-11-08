import "@/components/about-people-mobile.css";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { CONVENTION_VENUE } from "@/lib/conventions";
import {
  hotels, HOTEL_GROUP_CODE, airports, drivingRoute, drivingRouteAltNote,
  groundTransportNote, budgetLodgingNote, remotenessNote, weather, packingChecklist, conventionDay, onTheGrounds,
  nearbyEssentials, remember, rules, rulesAttribution, type NearbyEssential,
} from "@/lib/planYourVisit";
import { Navigation } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { YORUBA_PHRASES } from "@/lib/yoruba";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Plan Your Visit — Christ Apostolic Church North America (CACNA)",
    description:
      "Everything you need to plan your trip to the CACNA Annual Convention at CAC Village — travel, hotels, weather, what to pack, nearby essentials, convention etiquette, and common Yoruba greetings you will hear.",
    alternates: { canonical: `${SITE_URL}/plan-your-visit` },
  };
}

const DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent("14051 Stahley Road, Blue Ridge Summit, PA 17214");

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
  const t = await getTranslations("PlanYourVisit");

  const essentialsByArea = groupByArea(nearbyEssentials);
  const categoryLabel: Record<NearbyEssential["category"], string> = {
    food: t("categoryFood"),
    groceriesPharmacy: t("categoryGroceriesPharmacy"),
    gas: t("categoryGas"),
  };

  return (
    <main id="main-content" className="ap-main ap-has-bar">
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 640, height: 520, background: "radial-gradient(circle,rgba(253,200,65,.28),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6vw,76px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0", lineHeight: 1.02, textWrap: "balance" }}>
            <RevealText immediate>{t("title")}</RevealText>
          </h1>
          <Reveal delay={200}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(245,246,250,.72)", lineHeight: 1.7, maxWidth: 620, margin: "0 auto" }}>
              Getting to {CONVENTION_VENUE}, where to stay, and what to bring.
            </p>
          </Reveal>
          <nav aria-label="On this page" className="ap-chips">
            <a className="ap-chip" href="#travel">Travel</a>
            <a className="ap-chip" href="#hotels">Hotels</a>
            <a className="ap-chip" href="#packing">Packing</a>
            <a className="ap-chip" href="#grounds">On the grounds</a>
            <a className="ap-chip" href="#nearby">Nearby</a>
            <a className="ap-chip" href="#words">Yoruba words</a>
          </nav>
        </div>
      </section>

      {/* Travel */}
      <section id="travel" style={{ background: "var(--paper)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,40px)", color: "var(--ink)", margin: "10px 0 0" }}>Travel</h2>
          </Reveal>
          <div className="r2" style={{ gap: 20 }}>
            <Reveal>
              <div style={{ background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 18, padding: "22px 24px", height: "100%" }}>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 12 }}>By Air</div>
                {airports.map((a) => (
                  <div key={a.name} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                    <span style={{ fontSize: 15, fontWeight: a.recommended ? 700 : 500, color: "var(--ink)" }}>
                      {a.name}{a.code ? ` (${a.code})` : ""}{a.recommended ? " — recommended" : ""}
                    </span>
                    <span style={{ fontSize: 14, color: "var(--ink-soft)", whiteSpace: "nowrap" }}>{a.distanceMiles} mi</span>
                  </div>
                ))}
                <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6, margin: "14px 0 0" }}>
                  <strong style={{ color: "var(--ink)" }}>Driving route:</strong> {drivingRoute}
                </p>
                <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6, margin: "10px 0 0" }}>{drivingRouteAltNote}</p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
                <div style={{ background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 22px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>Ground Transport</div>
                  <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>{groundTransportNote}</p>
                </div>
                <div style={{ background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 22px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>The Venue</div>
                  <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>{remotenessNote}</p>
                </div>
                <div className="ap-map" style={{ height: 180, borderRadius: 18, overflow: "hidden", border: "1px solid var(--line)" }}>
                  <iframe title="Map to CAC Village" src="https://maps.google.com/maps?q=14051%20Stahley%20Road%20Blue%20Ridge%20Summit%20PA%2017214&z=11&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: "100%", height: "100%", border: 0, display: "block" }} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Hotels */}
      <section id="hotels" style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,40px)", color: "var(--ink)", margin: "10px 0 8px" }}>{t("hotelsHeading")}</h2>
            <p style={{ fontSize: 14.5, color: "var(--ink-soft)" }}>
              Mention the group code <strong style={{ color: "var(--ink)" }}>&ldquo;{HOTEL_GROUP_CODE}&rdquo;</strong> for the rates below. {budgetLodgingNote}
            </p>
          </Reveal>
          <div style={{ borderRadius: 18, border: "1px solid var(--line)", overflow: "hidden" }}>
            <div className="ap-hotel-head" style={{ background: "var(--ink)", color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", padding: "12px 18px" }}>
              <span>Hotel</span><span>City</span><span>Rate/night</span><span>Book</span>
            </div>
            {hotels.map((h, i) => (
              <div key={`${h.name}-${h.city}`} className="ap-hotel-row" style={{ padding: "13px 18px", background: i % 2 ? "var(--cream)" : "var(--paper)", fontSize: 15, alignItems: "center" }}>
                <span className="ap-hotel-name" style={{ fontWeight: 700, color: "var(--ink)" }}>{h.name}</span>
                <span className="ap-hotel-city" style={{ color: "var(--ink-soft)" }}>{h.city}</span>
                <span className="ap-hotel-rate" style={{ color: "var(--ink-soft)" }}>${h.ratePerNight}</span>
                <a className="ap-hotel-call" href={`tel:${h.phone.replace(/[^0-9]/g, "")}`} style={{ color: "var(--red)", fontWeight: 700, textDecoration: "none" }}>{h.phone}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather + Packing */}
      <section id="packing" style={{ background: "var(--paper)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div className="r2" style={{ maxWidth: 900, margin: "0 auto", gap: 40 }}>
          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--ink)", margin: 0 }}>July Weather</h2>
            <div style={{ display: "flex", gap: 24, margin: "14px 0 16px" }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, color: "var(--ink)", lineHeight: 1 }}>{weather.averageHighF}°</div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>Average high</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, color: "var(--ink-soft)", lineHeight: 1 }}>{weather.averageLowF}°</div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>Average low</div>
              </div>
            </div>
            <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>{weather.note}</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--ink)", margin: 0 }}>{t("packingHeading")}</h2>
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

      {/* Daily rhythm + on the grounds */}
      <section id="grounds" style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div className="r2" style={{ maxWidth: 900, margin: "0 auto", gap: 40 }}>
          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--ink)", margin: 0 }}>A convention day</h2>
            <ul style={{ margin: "16px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {conventionDay.map((item) => (
                <li key={item.time} style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                  <strong style={{ color: "var(--ink)" }}>{item.time}.</strong> {item.text}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--ink)", margin: 0 }}>On the grounds</h2>
            <ul style={{ margin: "16px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {onTheGrounds.map((item) => (
                <li key={item} style={{ display: "flex", gap: 10, fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                  <span aria-hidden style={{ color: "var(--red)", fontWeight: 800 }}>•</span> {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Nearby Essentials */}
      <section id="nearby" style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 32 }}>
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
                        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{item.name}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--ink-soft)", whiteSpace: "nowrap" }}>{categoryLabel[item.category]}</span>
                      </div>
                      <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>{item.address}</div>
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
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--ink)", margin: 0 }}>{t("rememberHeading")}</h2>
            <ol style={{ margin: "16px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {remember.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 10, fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                  <span style={{ color: "var(--red)", fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span> {item}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={80}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--ink)", margin: 0 }}>{t("rulesListHeading")}</h2>
            <ol style={{ margin: "16px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {rules.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 10, fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                  <span style={{ color: "var(--red)", fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span> {item}
                </li>
              ))}
            </ol>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", fontStyle: "italic", marginTop: 16 }}>— {rulesAttribution}</p>
          </Reveal>
        </div>
      </section>

      {/* Yoruba words a visitor will hear. Every Yoruba string carries
          lang="yo" so screen readers switch voice. */}
      <section id="words" style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,40px)", color: "var(--ink)", margin: "10px 0 8px" }}>Yoruba words you will hear</h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: 640, margin: 0 }}>
              Christ Apostolic Church began in Yorubaland, Nigeria, and many CAC gatherings mix English and Yoruba. A few words you will hear often:
            </p>
          </Reveal>
          <Reveal>
            <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, margin: 0 }}>
              {YORUBA_PHRASES.map((p) => (
                <div key={p.yo} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 14px" }}>
                  <dt lang="yo" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink)" }}>{p.yo}</dt>
                  <dd style={{ fontSize: 14, color: "var(--ink-soft)", margin: "4px 0 0" }}>{p.en}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 680, margin: "20px 0 0" }}>
              <strong style={{ color: "var(--ink)" }}>Reading the marks:</strong>{" "}
              <span lang="yo">ẹ</span> sounds like the e in &ldquo;bet&rdquo;, <span lang="yo">ọ</span> like the o in &ldquo;or&rdquo;, and <span lang="yo">ṣ</span> like &ldquo;sh&rdquo;.
              {" "}The accents mark tone: an acute (´) is high, a grave (`) is low, and no mark is mid.
              {" "}The <span lang="yo">Ẹ</span> that opens a greeting is the respectful &ldquo;you&rdquo;, used for elders and for a group.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="ap-dir-bar">
        <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
          <Navigation size={18} aria-hidden /> Get directions
        </a>
      </div>

      <FooterExperience />
    </main>
  );
}
