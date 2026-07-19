import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";
import Link from "next/link";
import { getLeaders } from "@/lib/leaders";

export const revalidate = 3600;

export const metadata = {
  title: "Leadership — Christ Apostolic Church North America (CACNA)",
  description: "Meet CACNA's regional leadership — led by Regional Superintendent Pastor Dr. T.O. Agbeja — and the current leaders of Christ Apostolic Church Worldwide.",
  alternates: { canonical: "/leadership" },
};

// Fuller bio copy for leaders where we have it — the leaders table doesn't
// yet store long-form bios for everyone, so this fills in what's known
// without inventing anything for the rest (they fall back to title only).
const BIOS: Record<string, string> = {
  "Pastor Dr. T.O. Agbeja": "Pastor Dr. Timothy Omolayo Agbeja leads Christ Apostolic Church North America as Regional Superintendent, carrying the mandate to preach the whole Gospel in a clear and undiluted manner across every CACNA member church. He also serves as Superintendent of C.A.C. WADCC, guiding the regional Coordinating Council that oversees CACNA's 16 DCCs and Zones across the United States and Canada.",
  "Pastor David Adenodi, Ph.D.": "Chairman of the CACNA Convention and member of the CACNA Coordinating Council. Also serves as Provost of the CACNA Bible Institute and Superintendent of the V.O.C-USA DCC.",
  "Pastor Joseph Olawale Latunde": "Regional Secretary of CACNA and member of the CACNA Coordinating Council. Also serves as Registrar of the CACNA Bible Institute and Superintendent of the Texas DCC.",
  "Pastor Timothy Adelani Latunde": "Regional Treasurer of CACNA and member of the CACNA Coordinating Council, also serving as Superintendent of the Manhattan NY DCC.",
  "Pastor John Oluwatimilehin, Ph.D.": "Chairman of the CAC Village Management Council and member of the CACNA Coordinating Council, also serving as Superintendent of the Bethel DCC.",
};

function initials(name: string) {
  const parts = name.replace(/^(Pastor|Prophet|Evangelist|Apostle)\s+(Dr\.?\s+)?(\(Mrs\.?\)\s+)?/i, "").trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "")).toUpperCase();
}

const gradients = [
  "linear-gradient(135deg,#7A1128,#C81E3A)",
  "linear-gradient(135deg,#C81E3A,#2D42C9)",
  "linear-gradient(135deg,#2D42C9,#FDC841)",
  "linear-gradient(135deg,#12141E,#7A1128)",
];

export default async function LeadershipPage() {
  const leaders = await getLeaders(["cacna_regional", "global_hq"]);
  const regional = leaders.filter((l) => l.category === "cacna_regional");
  const globalHq = leaders.filter((l) => l.category === "global_hq");

  const featured = regional[0];
  const team = regional.slice(1);

  return (
    <main>
      <Nav />

      {/* Hero */}
      <section style={{ background: "var(--cream)", padding: "140px clamp(20px,5vw,64px) 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,#2D42C9,#C81E3A 70%)", opacity: .1, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Leadership</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(46px,6.5vw,90px)", letterSpacing: "-2px", color: "var(--ink)", margin: "16px 0", lineHeight: .92 }}>
              Meet Our<br />
              <span style={{ color: "var(--red)" }}>Leadership.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: 580, margin: "0 auto" }}>
              The CACNA Coordinating Council, committed to preaching the whole Gospel and shepherding every member church across the United States and Canada.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured pastor */}
      {featured && (
        <section style={{ background: "var(--cream-2)", padding: "80px clamp(20px,5vw,64px) 56px" }}>
          <style>{`
            .ldr-card { display: grid; grid-template-columns: 1fr clamp(220px,34%,400px); min-height: 460px; }
            @media (max-width: 680px) { .ldr-card { grid-template-columns: 1fr; } .ldr-photo { min-height: 320px; } }
          `}</style>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <Reveal>
              <div className="ldr-card" style={{ background: "var(--ink)", borderRadius: 28, overflow: "hidden", boxShadow: "0 30px 60px rgba(18,20,30,.22)" }}>
                <div style={{ padding: "clamp(36px,5vw,60px)", display: "flex", flexDirection: "column", justifyContent: "center", color: "var(--cream)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>{featured.title}</div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3vw,42px)", letterSpacing: "-1px", margin: "0 0 22px", lineHeight: 1.04 }}>{featured.full_name}</h2>
                  <p style={{ fontSize: 16.5, lineHeight: 1.75, color: "rgba(245,246,250,.78)", margin: 0 }}>{BIOS[featured.full_name] ?? featured.bio}</p>
                </div>
                {featured.photo_url && (
                  <div className="ldr-photo" style={{ position: "relative" }}>
                    <Image
                      src={featured.photo_url}
                      alt={featured.full_name}
                      fill
                      style={{ objectFit: "contain", objectPosition: "center bottom" }}
                      sizes="(max-width: 680px) 100vw, 400px"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Associate team */}
      <section style={{ background: "var(--cream-2)", padding: "0 clamp(20px,5vw,64px) 90px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 36 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Pastoral Team</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.5vw,44px)", letterSpacing: "-1px", color: "var(--ink)", margin: "10px 0 0", lineHeight: 1 }}>
              Serving alongside.
            </h2>
          </Reveal>
          <div className="r2" style={{ gap: 22 }}>
            {team.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <div style={{
                  background: "var(--paper)", borderRadius: 22, padding: "28px 28px 30px",
                  border: "1px solid var(--line)", boxShadow: "0 10px 28px rgba(18,20,30,.07)",
                  height: "100%", display: "flex", flexDirection: "column", gap: 18,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {p.photo_url ? (
                      <div style={{ position: "relative", width: 64, height: 64, borderRadius: 18, overflow: "hidden", flexShrink: 0, boxShadow: "0 10px 22px rgba(18,20,30,.2)" }}>
                        <Image src={p.photo_url} alt={p.full_name} fill style={{ objectFit: "cover", objectPosition: "center top" }} sizes="64px" unoptimized />
                      </div>
                    ) : (
                      <div aria-hidden style={{
                        width: 64, height: 64, borderRadius: 18,
                        background: gradients[i % gradients.length],
                        display: "grid", placeItems: "center",
                        color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22,
                        letterSpacing: "-0.5px", boxShadow: "0 10px 22px rgba(200,30,58,.28)",
                        flexShrink: 0,
                      }}>{initials(p.full_name)}</div>
                    )}
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 4 }}>{p.title}</div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, letterSpacing: "-0.4px", color: "var(--ink)", margin: 0, lineHeight: 1.15 }}>{p.full_name}</h3>
                    </div>
                  </div>
                  {(BIOS[p.full_name] ?? p.bio) && (
                    <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: 0 }}>{BIOS[p.full_name] ?? p.bio}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CAC Global Leadership */}
      {globalHq.length > 0 && (
        <section style={{ background: "var(--ink)", padding: "clamp(64px,7vw,96px) clamp(20px,5vw,64px)" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <Reveal style={{ marginBottom: 36 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Christ Apostolic Church Worldwide</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.5vw,44px)", letterSpacing: "-1px", color: "var(--cream)", margin: "10px 0 0", lineHeight: 1 }}>
                Global leadership.
              </h2>
              <p style={{ fontSize: 15.5, color: "rgba(245,246,250,.6)", lineHeight: 1.7, maxWidth: 620, margin: "16px 0 0" }}>
                CACNA is one region of Christ Apostolic Church Worldwide, headquartered in Nigeria — currently led by:
              </p>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
              {globalHq.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <div style={{ background: "rgba(245,246,250,.05)", border: "1px solid rgba(245,246,250,.1)", borderRadius: 18, padding: "22px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div aria-hidden style={{
                      width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                      background: gradients[i % gradients.length],
                      display: "grid", placeItems: "center",
                      color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16,
                    }}>{initials(p.full_name)}</div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 3 }}>{p.title}</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--cream)", lineHeight: 1.3 }}>{p.full_name}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: "var(--paper)", padding: "80px clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,60px)", letterSpacing: "-1.2px", color: "var(--ink)", margin: "0 0 16px", lineHeight: .96 }}>Explore further.</h2>
          <p style={{ fontSize: 17, color: "var(--ink-soft)", margin: "0 0 36px" }}>Find your zone's superintendent, or read about the leaders who came before.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link href="/zones" style={{ background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 14px 30px rgba(200,30,58,.4)" }}>Find Your Zone →</Link>
            <Link href="/leadership/past" style={{ background: "var(--cream-2)", color: "var(--ink)", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", border: "1px solid var(--line)" }}>Past Leaders</Link>
            <Link href="/visit" style={{ background: "var(--cream-2)", color: "var(--ink)", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", border: "1px solid var(--line)" }}>Find a Church</Link>
          </div>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
