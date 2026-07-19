import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { Church, HeartHandshake, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";

const values = [
  { icon: Church, title: "Sound doctrine", desc: "Preaching the whole counsel of God, faithfully and without compromise." },
  { icon: HeartHandshake, title: "Real community", desc: "A family that worships, prays and grows together — onsite and online." },
  { icon: Globe, title: "Ambassadors", desc: "Equipping every believer to carry the Kingdom into everyday life." },
];

type Home = { tag: string; name: string; place: string; href: string; cta: string; external?: boolean };

const homes: Home[] = [
  { tag: "Explore", name: "Our Leadership", place: "Regional officers and 16 zonal superintendents", href: "/leadership", cta: "Meet the team" },
  { tag: "Explore", name: "Our Ministries", place: "Departments serving every CACNA zone", href: "/ministries", cta: "See ministries" },
  { tag: "Explore", name: "Annual Convention", place: "CAC Village, Blue Ridge Summit, PA", href: "/events", cta: "Upcoming events" },
  { tag: "Explore", name: "Find a Church", place: "Member churches across the U.S. and Canada", href: "/visit", cta: "Locate a zone" },
];

const homeCardStyle: CSSProperties = {
  height: "100%", display: "flex", flexDirection: "column",
  background: "rgba(245,246,250,.05)", border: "1px solid rgba(245,246,250,.12)",
  borderRadius: 16, padding: "16px 18px", textDecoration: "none",
};

function HomeCard({ h }: { h: Home }) {
  const content = (
    <>
      <span style={{ alignSelf: "flex-start", fontSize: 10, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)", background: "rgba(253,200,65,.12)", border: "1px solid rgba(253,200,65,.28)", padding: "3px 10px", borderRadius: 999, marginBottom: 10 }}>{h.tag}</span>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "-.3px", color: "var(--cream)", margin: "0 0 4px", lineHeight: 1.2 }}>{h.name}</h3>
      <p style={{ fontSize: 13, color: "rgba(245,246,250,.55)", lineHeight: 1.5, margin: "0 0 12px", flex: 1 }}>{h.place}</p>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--gold)" }}>{h.cta} <span aria-hidden>→</span></span>
    </>
  );
  return h.external
    ? <a href={h.href} target="_blank" rel="noopener noreferrer" className="card-lift" style={homeCardStyle}>{content}</a>
    : <Link href={h.href} className="card-lift" style={homeCardStyle}>{content}</Link>;
}

export const metadata = {
  title: "About Us — Christ Apostolic Church North America (CACNA)",
  description: "CACNA unites Christ Apostolic Church member churches across the United States and Canada under 16 DCCs/Zones — one family, many homes, one Gospel.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main>
      <Nav />

      {/* Hero */}
      <section style={{
        background: "var(--cream)", padding: "140px clamp(20px,5vw,64px) 80px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,#2D42C9,#C81E3A 70%)", opacity: .12, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Who We Are</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(48px,7vw,96px)", letterSpacing: "-2px", color: "var(--ink)", margin: "18px 0", lineHeight: .92 }}>
              More than a greeting.<br />
              <span style={{ color: "var(--red)" }}>A lifestyle.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: 640, margin: "0 auto 36px" }}>
              Christ Apostolic Church North America unites CAC member churches across the United States and Canada to preach the whole Gospel — in a clear and undiluted manner — and to build God&apos;s ambassadors here on earth.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <Link href="/visit" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 14px 30px rgba(200,30,58,.34)" }}>
              Plan a Visit →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Family, not a building */}
      <section style={{ background: "var(--paper)", padding: "100px clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>The Family</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(34px,4.5vw,56px)", letterSpacing: "-1.2px", color: "var(--ink)", margin: "14px 0 26px", lineHeight: .98 }}>
              The Church is more than a building.<br />
              <span style={{ color: "var(--red)" }}>It’s a family.</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p style={{ fontSize: 17.5, color: "var(--ink-soft)", lineHeight: 1.8, margin: "0 0 20px" }}>
              Walls don’t make a church — people do. The day you said <em style={{ fontStyle: "italic", color: "var(--ink)" }}>yes</em> to Jesus, you were grafted into a great family of believers. That family has a name and a face in every CACNA zone, from coast to coast.
            </p>
            <p style={{ fontSize: 17.5, color: "var(--ink-soft)", lineHeight: 1.8, margin: 0 }}>
              Whether it’s your first gathering or your hundredth, our prayer is the same: that you’d find a home with us — a people who know you, and a place to grow in Christ alongside the family.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div style={{ marginTop: 36 }}>
              <Link href="/visit" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--ink)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "16px 28px", borderRadius: 999, textDecoration: "none", boxShadow: "0 12px 28px rgba(18,20,30,.18)" }}>
                Get plugged in →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission split */}
      <section style={{ background: "var(--cream-2)", padding: "100px clamp(20px,5vw,64px)" }}>
        <div className="r2" style={{ maxWidth: 1100, margin: "0 auto", gap: 60, alignItems: "start" }}>
          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,4vw,54px)", letterSpacing: "-1.2px", color: "var(--ink)", margin: "0 0 24px", lineHeight: .96 }}>
              Our Mandate
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "Our Mandate", text: "Preach the whole Gospel — in a clear and undiluted manner." },
                { label: "Our Purpose", text: "Build God's ambassadors here on earth." },
                { label: "Our Promise", text: "Everyone who walks through our doors finds a home." },
              ].map((m, i) => (
                <div key={i} style={{ padding: "22px 24px", background: "var(--paper)", borderRadius: 18, border: "1px solid var(--line)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>{m.label}</div>
                  <p style={{ fontSize: 17, color: "var(--ink)", fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{m.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={140}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,4vw,54px)", letterSpacing: "-1.2px", color: "var(--ink)", margin: "0 0 24px", lineHeight: .96 }}>
              Our Story
            </h2>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.75, marginBottom: 20 }}>
              As Christ Apostolic Church member churches took root across the United States and Canada, CACNA was formed to unite them under one regional body — organized today into 16 DCCs (District Church Councils) and Zones, each led by a Zonal Superintendent.
            </p>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.75 }}>
              Part of the Christ Apostolic Church — one of Africa&apos;s largest Pentecostal denominations — our mission is raising generations of believers liberated through the light of God&apos;s Word and prayer, across North America and beyond.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: "var(--cream)", padding: "100px clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>What We Value</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,5vw,64px)", letterSpacing: "-1.5px", color: "var(--ink)", margin: "14px 0 0", lineHeight: .95 }}>
              Core Values
            </h2>
          </Reveal>
          <div className="r3" style={{ gap: 18 }}>
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div style={{ background: "var(--paper)", borderRadius: 20, padding: "28px 24px", border: "1px solid var(--line)", boxShadow: "0 8px 22px rgba(18,20,30,.05)" }}>
                  <IconBadge icon={v.icon} style={{ marginBottom: 16 }} />
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--ink)", margin: "0 0 10px" }}>{v.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage */}
      <section style={{ background: "var(--cream-2)", padding: "100px clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Heritage</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,5vw,64px)", letterSpacing: "-1.5px", color: "var(--ink)", margin: "14px 0 0", lineHeight: .95 }}>
              One movement, 16 zones.
            </h2>
          </Reveal>
          <div className="r2" style={{ gap: 44, alignItems: "center" }}>
            <Reveal>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 12 }}>Christ Apostolic Church across North America</div>
              <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.75, margin: "0 0 18px" }}>
                As CAC member churches were planted across the United States and Canada, CACNA emerged to give this growing family a shared structure — <strong style={{ color: "var(--ink)" }}>16 DCCs (District Church Councils) and Zones</strong>, each shepherded by a Zonal Superintendent, all under one regional leadership.
              </p>
              <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.75, margin: 0 }}>
                Every July, the family gathers as one at the Annual Convention — CAC Village, Blue Ridge Summit, Pennsylvania — for six days of worship, teaching, and fellowship, onsite and online.
              </p>
              <Link href="/leadership" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24, color: "var(--red)", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                Meet our leadership →
              </Link>
            </Reveal>
            <Reveal delay={120}>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 24, padding: "30px 28px", boxShadow: "0 14px 32px rgba(18,20,30,.06)" }}>
                {[
                  { year: "16", text: "DCCs (District Church Councils) and Zones across the U.S. and Canada." },
                  { year: "1", text: "Regional leadership uniting every member church under one mandate." },
                  { year: "July", text: "The whole family gathers each year at the CACNA Annual Convention." },
                ].map((t, i) => (
                  <div key={t.year} style={{ paddingTop: i ? 18 : 0, paddingBottom: i < 2 ? 18 : 0, borderBottom: i < 2 ? "1px solid var(--line)" : "none", display: "flex", alignItems: "baseline", gap: 18 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--red)", letterSpacing: "-.5px", minWidth: 70 }}>{t.year}</div>
                    <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>{t.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* One family, many homes */}
      <section style={{ background: "var(--ink)", padding: "60px clamp(20px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 600, height: 320, background: "radial-gradient(circle,rgba(253,200,65,.14),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Our Homes</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-1.2px", color: "var(--cream)", margin: "10px 0 0", lineHeight: .97 }}>
              One family, many homes.
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
            {homes.map((h, i) => (
              <Reveal key={h.name} delay={(i % 3) * 70}>
                <HomeCard h={h} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What We Believe — 13 Tenets */}
      <section style={{ background: "var(--cream)", padding: "100px clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>What We Believe</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,5vw,64px)", letterSpacing: "-1.5px", color: "var(--ink)", margin: "14px 0 0", lineHeight: .95 }}>
              The Thirteen Tenets of Faith.
            </h2>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 640, margin: "20px auto 0" }}>
              The doctrinal foundation of the Christ Apostolic Church — what every CACNA pulpit preaches and what we live by.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              { n: "01", t: "The Holy Scriptures", d: "The Bible is the inspired, infallible Word of God." },
              { n: "02", t: "The Trinity", d: "One God in three Persons — Father, Son, and Holy Spirit." },
              { n: "03", t: "The Person of Christ", d: "The deity, virgin birth, sinless life, atoning death, bodily resurrection, and ascension of Jesus Christ." },
              { n: "04", t: "The Fall of Man", d: "All have sinned and fall short of the glory of God." },
              { n: "05", t: "Salvation by Grace", d: "Through faith in the finished work of Christ — not by works." },
              { n: "06", t: "Repentance & Restitution", d: "A turning from sin that bears fruit in changed lives." },
              { n: "07", t: "Water Baptism", d: "By immersion, in the Name of the Father, Son, and Holy Spirit." },
              { n: "08", t: "The Lord’s Supper", d: "Bread and the cup, in remembrance of Him until He comes." },
              { n: "09", t: "Sanctification", d: "A progressive work of the Holy Spirit, setting us apart unto God." },
              { n: "10", t: "Baptism of the Holy Ghost", d: "With the evidence of speaking in other tongues, as the Spirit gives utterance." },
              { n: "11", t: "Divine Healing", d: "Through the atoning work of Christ — for the body as well as the soul." },
              { n: "12", t: "Tithes & Offerings", d: "Honoring God with the firstfruits and supporting His work." },
              { n: "13", t: "The Second Coming", d: "The bodily return of Christ, the resurrection, and the eternal state." },
            ].map((t, i) => (
              <Reveal key={t.n} delay={(i % 3) * 60}>
                <div style={{ height: "100%", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "22px 22px 24px", boxShadow: "0 6px 18px rgba(18,20,30,.04)" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: "var(--red)", letterSpacing: "1.5px", marginBottom: 8 }}>{t.n}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, letterSpacing: "-.3px", color: "var(--ink)", margin: "0 0 8px", lineHeight: 1.2 }}>{t.t}</h3>
                  <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>{t.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section style={{ background: "var(--cream-2)", padding: "100px clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Leadership</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,5vw,64px)", letterSpacing: "-1.5px", color: "var(--ink)", margin: "14px 0 0", lineHeight: .95 }}>
              Meet Our President
            </h2>
          </Reveal>
          <div className="r2" style={{ gap: 22, alignItems: "stretch" }}>
            <Reveal style={{ background: "var(--ink)", color: "var(--cream)", borderRadius: 26, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: 340, position: "relative" }}>
                <Image src="https://cacnorthamerica.com/wp-content/uploads/2024/03/Pastor-Dr.-T.A.O-Agbeja-1-240x300.jpg" alt="Pastor Dr. T.O. Agbeja" fill style={{ objectFit: "cover", objectPosition: "center 28%" }} unoptimized />
              </div>
              <div style={{ padding: 28 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, lineHeight: 1.1 }}>Pastor Dr. T.O. Agbeja</div>
                <div style={{ color: "var(--gold)", fontWeight: 700, fontSize: 13, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 8 }}>Regional Superintendent, CACNA</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, opacity: .82, margin: "16px 0 0" }}>Leading the CACNA family — building God’s ambassadors and welcoming every soul home.</p>
              </div>
            </Reveal>
            <Reveal delay={120} style={{ background: "linear-gradient(155deg, var(--red), var(--red-deep))", color: "var(--cream)", borderRadius: 26, padding: "clamp(32px,4vw,48px) clamp(28px,3.5vw,40px)", display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "0 18px 36px rgba(200,30,58,.26)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,246,250,.72)", marginBottom: 16 }}>The Regional Team</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.6vw,40px)", letterSpacing: "-.8px", margin: "0 0 18px", lineHeight: 1 }}>
                16 zones.<br />One family.<br />One Gospel.
              </h3>
              <p style={{ fontSize: 15.5, lineHeight: 1.7, opacity: .92, margin: "0 0 26px" }}>
                Alongside CACNA&apos;s national officers, 16 Zonal Superintendents shepherd member churches across the United States and Canada — one regional leadership, one mandate.
              </p>
              <Link href="/leadership" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, alignSelf: "flex-start", background: "var(--cream)", color: "var(--ink)", fontWeight: 700, fontSize: 15, padding: "14px 24px", borderRadius: 999, textDecoration: "none" }}>
                Meet the full team →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--ink)", padding: "80px clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,5vw,64px)", letterSpacing: "-1.5px", color: "var(--cream)", margin: "0 0 16px", lineHeight: .95 }}>Ready to connect?</h2>
          <p style={{ fontSize: 17, color: "rgba(245,246,250,.6)", margin: "0 0 36px" }}>Find a CACNA member church near you — onsite or online.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link href="/visit" style={{ background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 14px 30px rgba(200,30,58,.4)" }}>Plan a Visit →</Link>
            <Link href="/online" style={{ background: "rgba(245,246,250,.1)", color: "var(--cream)", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>Watch Online</Link>
          </div>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
