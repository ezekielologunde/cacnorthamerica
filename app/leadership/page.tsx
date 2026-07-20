import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import Image from "next/image";
import Link from "next/link";
import { getLeaders, getLeaderRoles, slugifyLeaderName, type Leader } from "@/lib/leaders";
import { CAC_WORLDWIDE, CAC_ANOSIKE_EUROPE } from "@/lib/global";

export const revalidate = 3600;

export const metadata = {
  title: "Leadership — Christ Apostolic Church North America (CACNA)",
  description: "Meet CACNA's regional leadership — led by Regional Superintendent Pastor Dr. T.O. Agbeja — and the current leaders of Christ Apostolic Church Worldwide.",
  alternates: { canonical: "/leadership" },
};

/** Prose `bio` text (migrated from the old hardcoded BIOS map) stays primary.
 *  Only leaders with no bio text at all fall back to their combined role list
 *  across every linked person_key row — e.g. Olowomeye's plain "Superintendent,
 *  CAC Bethel DCC" title would otherwise show nothing if he's ever linked to
 *  additional rows without prose to go with them. */
async function combinedBio(leader: Leader): Promise<string | null> {
  if (leader.bio) return leader.bio;
  if (!leader.person_key) return null;
  const roles = await getLeaderRoles(leader.person_key);
  if (roles.length <= 1) return null;
  return roles.map((r) => r.title).join(" · ");
}

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
  const bios = new Map<string, string | null>(
    await Promise.all(regional.map(async (l) => [l.id, await combinedBio(l)] as const))
  );

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
              The CACNA Coordinating Council, committed to preaching the whole Gospel and shepherding every member church across the United States, Canada, and South America.
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
              <div className="ldr-card" style={{ display: "grid", background: "var(--ink)", borderRadius: 28, overflow: "hidden", boxShadow: "0 30px 60px rgba(18,20,30,.22)" }}>
                <Link href={`/leadership/${slugifyLeaderName(featured.full_name)}`} style={{ padding: "clamp(36px,5vw,60px)", display: "flex", flexDirection: "column", justifyContent: "center", color: "var(--cream)", textDecoration: "none" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>{featured.title}</div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3vw,42px)", letterSpacing: "-1px", margin: "0 0 22px", lineHeight: 1.04 }}>{featured.full_name}</h2>
                  <p style={{ fontSize: 16.5, lineHeight: 1.75, color: "rgba(245,246,250,.78)", margin: 0 }}>{bios.get(featured.id)}</p>
                </Link>
                {featured.photo_url && (
                  <div className="ldr-photo" style={{ position: "relative" }}>
                    <ImageLightbox src={featured.photo_url} alt={featured.full_name} objectFit="contain" objectPosition="center bottom" />
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
            {team.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <Link href={`/leadership/${slugifyLeaderName(p.full_name)}`} className="card-lift" style={{
                  background: "var(--paper)", borderRadius: 24, overflow: "hidden",
                  border: "1px solid var(--line)", boxShadow: "0 10px 28px rgba(18,20,30,.07)",
                  height: "100%", display: "flex", flexDirection: "column",
                  textDecoration: "none", color: "inherit",
                }}>
                  <div style={{ position: "relative", width: "100%", height: "clamp(200px,22vw,260px)", flexShrink: 0, background: "var(--ink)" }}>
                    {p.photo_url ? (
                      <Image src={p.photo_url} alt={p.full_name} fill style={{ objectFit: "cover", objectPosition: "center top" }} sizes="(max-width: 680px) 100vw, 340px" unoptimized />
                    ) : (
                      <div aria-hidden style={{
                        position: "absolute", inset: 0, display: "grid", placeItems: "center",
                        background: gradients[i % gradients.length],
                      }}>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 56, color: "#fff" }}>{initials(p.full_name)}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "22px 26px 28px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 4 }}>{p.title}</div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, letterSpacing: "-0.4px", color: "var(--ink)", margin: 0, lineHeight: 1.15 }}>{p.full_name}</h3>
                    </div>
                    {bios.get(p.id) && (
                      <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: 0 }}>{bios.get(p.id)}</p>
                    )}
                  </div>
                </Link>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
              {globalHq.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <Link href={`/leadership/${slugifyLeaderName(p.full_name)}`} className="card-lift" style={{ background: "rgba(245,246,250,.05)", border: "1px solid rgba(245,246,250,.1)", borderRadius: 20, padding: "22px 22px", display: "flex", alignItems: "center", gap: 18, textDecoration: "none" }}>
                    {p.photo_url ? (
                      <div style={{ position: "relative", width: 84, height: 84, borderRadius: 18, overflow: "hidden", flexShrink: 0, boxShadow: "0 10px 24px rgba(0,0,0,.3)" }}>
                        <Image src={p.photo_url} alt={p.full_name} fill style={{ objectFit: "cover", objectPosition: "center top" }} sizes="84px" unoptimized />
                      </div>
                    ) : (
                      <div aria-hidden style={{
                        width: 84, height: 84, borderRadius: 18, flexShrink: 0,
                        background: gradients[i % gradients.length],
                        display: "grid", placeItems: "center",
                        color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28,
                      }}>{initials(p.full_name)}</div>
                    )}
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 4 }}>{p.title}</div>
                      <div style={{ fontWeight: 800, fontSize: 17, color: "var(--cream)", lineHeight: 1.3 }}>{p.full_name}</div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Our Global Family */}
      <section id="global-family" style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px) 56px", scrollMarginTop: 90 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 28 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)" }}>One Fold, One Shepherd</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,38px)", letterSpacing: "-.7px", color: "var(--ink)", margin: "10px 0 0" }}>Our Global Family</h2>
          </Reveal>
          <div className="r2" style={{ gap: 18 }}>
            <Reveal>
              <div style={{ height: "100%", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "26px 24px" }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)" }}>Worldwide</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, color: "var(--ink)", margin: "8px 0 10px" }}>{CAC_WORLDWIDE.name}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 18 }}>{CAC_WORLDWIDE.description}</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a href={CAC_WORLDWIDE.url} target="_blank" rel="noopener noreferrer" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--red)", color: "#fff", fontWeight: 800, fontSize: 13.5, padding: "10px 20px", borderRadius: 999, textDecoration: "none" }}>
                    Visit cacworld.org →
                  </a>
                  <a href={CAC_WORLDWIDE.newsUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--cream-2)", color: "var(--ink)", fontWeight: 700, fontSize: 13.5, padding: "10px 20px", borderRadius: 999, textDecoration: "none", border: "1px solid var(--line)" }}>
                    CAC World News →
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div style={{ height: "100%", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "26px 24px" }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)" }}>Sister Region</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, color: "var(--ink)", margin: "8px 0 10px" }}>{CAC_ANOSIKE_EUROPE.name}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 8 }}>{CAC_ANOSIKE_EUROPE.description}</p>
                <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 18 }}>
                  Regional Superintendent: <strong style={{ color: "var(--ink)" }}>{CAC_ANOSIKE_EUROPE.regionalSuperintendent}</strong>
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a href={CAC_ANOSIKE_EUROPE.url} target="_blank" rel="noopener noreferrer" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--red)", color: "#fff", fontWeight: 800, fontSize: 13.5, padding: "10px 20px", borderRadius: 999, textDecoration: "none" }}>
                    Visit cacanosike.org →
                  </a>
                  <a href={CAC_ANOSIKE_EUROPE.directoryUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--cream-2)", color: "var(--ink)", fontWeight: 700, fontSize: 13.5, padding: "10px 20px", borderRadius: 999, textDecoration: "none", border: "1px solid var(--line)" }}>
                    Find a church in the UK & Europe →
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Bible Institute teaser */}
      <section style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px) 90px" }}>
        <Reveal>
          <div style={{
            maxWidth: 1080, margin: "0 auto",
            background: "linear-gradient(135deg,#12141E,#2D42C9)",
            borderRadius: 28, padding: "clamp(32px,4.5vw,52px)",
            display: "flex", flexWrap: "wrap", alignItems: "center",
            justifyContent: "space-between", gap: 24,
            boxShadow: "0 24px 60px rgba(18,20,30,.25)",
            position: "relative", overflow: "hidden",
          }}>
            <div aria-hidden style={{ position: "absolute", top: -80, right: -60, width: 320, height: 280, background: "radial-gradient(circle,rgba(253,200,65,.25),transparent 65%)", pointerEvents: "none" }} />
            <div style={{ flex: "1 1 420px", position: "relative", zIndex: 2 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 10 }}>
                Training the next generation
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,38px)", letterSpacing: "-.7px", color: "#fff", margin: "0 0 10px", lineHeight: 1.05 }}>
                The CACNA Bible Institute.
              </h2>
              <p style={{ fontSize: 15.5, color: "rgba(245,246,250,.78)", margin: 0, lineHeight: 1.65, maxWidth: 520 }}>
                CACNA's ministerial training arm, led by a Chancellor, Provost, Dean, Registrar, and Lecturer drawn from our regional leadership.
              </p>
            </div>
            <Link href="/bible-institute" className="press" style={{
              position: "relative", zIndex: 2, flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 9,
              background: "#fff", color: "var(--ink)", fontWeight: 800, fontSize: 15, padding: "14px 28px", borderRadius: 999, textDecoration: "none",
            }}>
              Visit the Bible Institute →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--paper)", padding: "80px clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,60px)", letterSpacing: "-1.2px", color: "var(--ink)", margin: "0 0 16px", lineHeight: .96 }}>Explore further.</h2>
          <p style={{ fontSize: 17, color: "var(--ink-soft)", margin: "0 0 36px" }}>Find your zone's superintendent, or read about the leaders who came before.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link href="/zones" style={{ background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 14px 30px rgba(200,30,58,.4)" }}>Find Your Zone →</Link>
            <Link href="/leadership/past" style={{ background: "var(--cream-2)", color: "var(--ink)", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", border: "1px solid var(--line)" }}>Past Leaders</Link>
            <Link href="/contact" style={{ background: "var(--cream-2)", color: "var(--ink)", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", border: "1px solid var(--line)" }}>Find a Church</Link>
          </div>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
