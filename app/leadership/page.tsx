import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Our Pastors — CAC Salvation Center | Randallstown, MD",
  description: "Meet the pastoral team at CAC Salvation Center in Randallstown, MD — led by Superintendent Pastor Dr. Hezekiah O. Ilufoye and our associate pastors.",
  alternates: { canonical: "/leadership" },
};

const featured = {
  name: "Pastor Dr. Hezekiah O. Ilufoye, PhD",
  partner: "Evang. Mrs Victoria Ilufoye",
  title: "Baltimore DCC Superintendent · First Lady",
  bio: "Pastor Dr. Hezekiah O. Ilufoye carries the vision of CAC Salvation Centre Ilorin — established in Nigeria on July 6, 1997 — into the Baltimore-Maryland District Coordinating Council, planted in 2002. Together with the First Lady, Evang. Mrs Victoria Ilufoye, he leads the family with a clear call to preach the whole Gospel, raise God's ambassadors, and steward the multi-generational mission of the Christ Apostolic Church.",
  image: "/images/pastor-couple.jpg",
};

const team: { name: string; title: string; bio: string; image?: string }[] = [
  {
    name: "Pastor Felix Osunkiyesi",
    title: "Curate",
    bio: "Serving alongside the Superintendent in the day-to-day pastoral oversight of the Salvation Center — preaching, discipleship, and caring for the flock with steadiness and grace.",
    image: "/images/pastor-osunkiyesi.webp",
  },
  {
    name: "Pastor Alfred Aremo",
    title: "Associate Pastor",
    bio: "An associate minister carrying the work of teaching, prayer, and shepherding — committed to seeing every member grow up in Christ and walk in their God-given purpose.",
    image: "/images/pastor-aremo.webp",
  },
  {
    name: "Pastor Oludapo Eludoyin",
    title: "Associate Pastor",
    bio: "An associate minister with a heart for evangelism and pastoral care, serving the congregation in worship, prayer ministry, and the equipping of saints for the work of the kingdom.",
    image: "/images/pastor-eludoyin.webp",
  },
  {
    name: "Pastor Enoch Ilufoye",
    title: "Assembly Pastor · CAC Kingdom Embassy",
    bio: "Leading the CAC Kingdom Embassy assembly within the Baltimore DCC family — a next-generation voice carrying the Gospel with clarity, conviction, and cultural intelligence.",
    image: "/images/pastor-enoch.webp",
  },
];

function initials(name: string) {
  const parts = name.replace(/^Pastor\s+(Dr\.?\s+)?(\(Mrs\.?\)\s+)?/i, "").trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "")).toUpperCase();
}

const gradients = [
  "linear-gradient(135deg,#9E1B1B,#D62828)",
  "linear-gradient(135deg,#D62828,#F15F22)",
  "linear-gradient(135deg,#F15F22,#E8A33D)",
  "linear-gradient(135deg,#1B130E,#9E1B1B)",
];

export default function LeadershipPage() {
  return (
    <main>
      <Nav />

      {/* Hero */}
      <section style={{ background: "var(--cream)", padding: "140px clamp(20px,5vw,64px) 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,#F15F22,#D62828 70%)", opacity: .1, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Leadership</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(46px,6.5vw,90px)", letterSpacing: "-2px", color: "var(--ink)", margin: "16px 0", lineHeight: .92 }}>
              Meet Our<br />
              <span style={{ background: "linear-gradient(100deg,#F15F22,#D62828)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pastors.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: 580, margin: "0 auto" }}>
              Servant leaders of the Baltimore-Maryland District Coordinating Council, committed to preaching the whole Gospel and shepherding every soul home.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured pastor */}
      <section style={{ background: "var(--cream-2)", padding: "80px clamp(20px,5vw,64px) 56px" }}>
        <style>{`
          .ldr-card { display: grid; grid-template-columns: 1fr clamp(220px,34%,400px); min-height: 460px; }
          @media (max-width: 680px) { .ldr-card { grid-template-columns: 1fr; } .ldr-photo { min-height: 320px; } }
        `}</style>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal>
            <div className="ldr-card" style={{ background: "var(--ink)", borderRadius: 28, overflow: "hidden", boxShadow: "0 30px 60px rgba(27,19,14,.22)" }}>
              <div style={{ padding: "clamp(36px,5vw,60px)", display: "flex", flexDirection: "column", justifyContent: "center", color: "var(--cream)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>{featured.title}</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3vw,42px)", letterSpacing: "-1px", margin: "0 0 6px", lineHeight: 1.04 }}>{featured.name}</h2>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(18px,2vw,26px)", color: "rgba(255,247,239,.8)", letterSpacing: "-.4px", margin: "0 0 22px" }}>&amp; {featured.partner}</div>
                <p style={{ fontSize: 16.5, lineHeight: 1.75, color: "rgba(255,247,239,.78)", margin: 0 }}>{featured.bio}</p>
              </div>
              <div className="ldr-photo" style={{ position: "relative" }}>
                <Image
                  src={featured.image}
                  alt={`${featured.name} & ${featured.partner}`}
                  fill
                  style={{ objectFit: "contain", objectPosition: "center bottom" }}
                  sizes="(max-width: 680px) 100vw, 400px"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

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
              <Reveal key={p.name} delay={i * 70}>
                <div style={{
                  background: "var(--paper)", borderRadius: 22, padding: "28px 28px 30px",
                  border: "1px solid var(--line)", boxShadow: "0 10px 28px rgba(27,19,14,.07)",
                  height: "100%", display: "flex", flexDirection: "column", gap: 18,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {p.image ? (
                      <div style={{ position: "relative", width: 64, height: 64, borderRadius: 18, overflow: "hidden", flexShrink: 0, boxShadow: "0 10px 22px rgba(27,19,14,.2)" }}>
                        <Image src={p.image} alt={p.name} fill style={{ objectFit: "cover", objectPosition: "center top" }} sizes="64px" />
                      </div>
                    ) : (
                      <div aria-hidden style={{
                        width: 64, height: 64, borderRadius: 18,
                        background: gradients[i % gradients.length],
                        display: "grid", placeItems: "center",
                        color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22,
                        letterSpacing: "-0.5px", boxShadow: "0 10px 22px rgba(214,40,40,.28)",
                        flexShrink: 0,
                      }}>{initials(p.name)}</div>
                    )}
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 4 }}>{p.title}</div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, letterSpacing: "-0.4px", color: "var(--ink)", margin: 0, lineHeight: 1.15 }}>{p.name}</h3>
                    </div>
                  </div>
                  <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: 0 }}>{p.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Choir / Worship Team */}
      <section style={{ background: "var(--cream)", padding: "80px clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 44 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Worship Team</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4vw,52px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 0", lineHeight: .95 }}>The Choir</h2>
          </Reveal>
          <Reveal delay={80}>
            <div style={{ borderRadius: 24, overflow: "hidden", position: "relative", height: "clamp(280px,36vw,440px)", boxShadow: "0 24px 50px rgba(27,19,14,.16)" }}>
              <Image src="/images/choir.jpg" alt="CAC Salvation Center choir" fill style={{ objectFit: "cover", objectPosition: "center 30%" }} sizes="100vw" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.6),transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: 32, left: 36, color: "#fff" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28 }}>Salvation Center Choir</div>
                <div style={{ fontSize: 14, opacity: .75, marginTop: 4 }}>Leading the congregation in Spirit-filled worship every Sunday</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--ink)", padding: "80px clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,60px)", letterSpacing: "-1.2px", color: "var(--cream)", margin: "0 0 16px", lineHeight: .96 }}>Come worship with us.</h2>
          <p style={{ fontSize: 17, color: "rgba(255,247,239,.6)", margin: "0 0 36px" }}>Sundays at 10:30 AM — 10710 Marriottsville Rd, Randallstown MD.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link href="/visit" style={{ background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 14px 30px rgba(214,40,40,.4)" }}>Plan a Visit →</Link>
            <Link href="/about" style={{ background: "rgba(255,247,239,.1)", color: "var(--cream)", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(255,247,239,.2)" }}>Our Story</Link>
          </div>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
