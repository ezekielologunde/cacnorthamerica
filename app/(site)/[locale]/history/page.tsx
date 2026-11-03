import "@/components/about-people-mobile.css";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { FeaturedStories } from "@/components/sections/FeaturedStories";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";
import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

const SOURCE_URL = "https://cacworld.org/about/history";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our History — Christ Apostolic Church North America (CACNA)",
    description:
      "The history of Christ Apostolic Church: a 1918 prayer group in Ijebu-Ode, Faith Tabernacle, Apostle Babalola's call, the 1930 revival at Oke Ooye, registration in May 1943, and the 1972 Supreme Court judgment.",
    alternates: { canonical: `${SITE_URL}/history` },
  };
}

/** Compact timeline at the top of the page; each entry jumps to its section. */
const milestones: { year: string; text: string; anchor: string }[] = [
  { year: "1918", text: "A prayer group forms in Ijebu-Ode", anchor: "beginnings" },
  { year: "1928", text: "Joseph Ayo Babalola's call", anchor: "babalola" },
  { year: "1930", text: "The Great Revival at Oke Ooye, Ilesa", anchor: "revival" },
  { year: "1931", text: "Affiliation with the British Apostolic Church", anchor: "apostolic-church" },
  { year: "1939–40", text: "The split over divine healing", anchor: "apostolic-church" },
  { year: "1943", text: "Registered as Christ Apostolic Church", anchor: "name" },
  { year: "1972", text: "The Supreme Court judgment", anchor: "judgment" },
  { year: "2006", text: "Joseph Ayo Babalola University", anchor: "institutions" },
];

const institutions: { year: string; text: string }[] = [
  { year: "1946", text: "Pastoral Training College, Ibadan" },
  { year: "1949", text: "School of Prophets and Evangelists, Ilesa" },
  { year: "1952", text: "Bible Training College, Ede — later moved to Erio Ekiti (1954), Efon Alaye (1958) and Akure (1969), then merged into the CAC Theological Seminary, Ile-Ife (1979)" },
  { year: "1955", text: "Teachers Training College, Efon Alaye" },
  { year: "1959", text: "Faith Home, Ede" },
  { year: "1960s", text: "Grammar and primary schools" },
  { year: "1966–67", text: "CAC Printing Press" },
  { year: "2006", text: "Joseph Ayo Babalola University" },
];

const pStyle = { fontSize: 16.5, color: "var(--ink-soft)", lineHeight: 1.8, margin: 0 } as const;
const strong = { color: "var(--ink)" } as const;

/**
 * A chapter is a timeline jump target, so it is deliberately not wrapped in
 * <Reveal>: Reveal server-renders at opacity 0 and only fades in once JS has
 * hydrated and the block has scrolled into view, which would leave a chapter
 * blank after a #anchor jump on a slow load, or for good without JS.
 */
function Chapter({ id, year, title, children }: { id: string; year?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} style={{ padding: "30px 0", borderBottom: "1px solid var(--line)", scrollMarginTop: 96 }}>
      <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", columnGap: 14, rowGap: 4, marginBottom: 14 }}>
        {year && <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "var(--red)", letterSpacing: ".5px", flexShrink: 0 }}>{year}</span>}
        <h2 id={`${id}-heading`} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,2.6vw,28px)", letterSpacing: "-.4px", color: "var(--ink)", margin: 0, lineHeight: 1.2, textWrap: "balance" }}>
          {title}
        </h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
    </section>
  );
}

function Timeline() {
  return (
    <nav aria-label="Timeline">
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: "4px 24px" }}>
        {milestones.map((m) => (
          <li key={`${m.year}-${m.text}`}>
            <a href={`#${m.anchor}`} style={{ display: "flex", alignItems: "baseline", gap: 12, minHeight: 48, padding: "10px 0 10px 14px", borderLeft: "2px solid var(--red)", textDecoration: "none" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "var(--red)", minWidth: 72, flexShrink: 0 }}>{m.year}</span>
              <span style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.45 }}>{m.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content" className="ap-main">
      <Nav />

      {/* Hero */}
      <section style={{ background: "var(--cream)", padding: "140px clamp(20px,5vw,64px) 64px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,var(--blue),var(--red) 70%)", opacity: 0.1, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6vw,78px)", letterSpacing: "-0.03em", color: "var(--ink)", margin: "16px 0", lineHeight: 0.96, textWrap: "balance" }}>
              The story of Christ Apostolic Church.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: 580, margin: "0 auto" }}>
              From a small prayer group in Ijebu-Ode in 1918 to congregations around the world — how the movement CACNA belongs to came to be.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ background: "var(--paper)", padding: "clamp(40px,5vw,64px) clamp(20px,5vw,64px) 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Timeline />
        </div>
      </section>

      {/* The history, chapter by chapter */}
      <section style={{ background: "var(--paper)", padding: "clamp(24px,4vw,40px) clamp(20px,5vw,64px) clamp(64px,8vw,100px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Chapter id="beginnings" year="1918" title="A prayer group in Ijebu-Ode">
            <p style={pStyle}>
              The story begins with a dream. Daddy Ali, the sexton of the Anglican church in Ijebu-Ode, shared what he had seen with Joseph Sadare (also known as Esinsinade), D. C. Oduga, E. O. Onabanjo and E. O. W. Olukoya, and the men began meeting to pray together.
            </p>
            <p style={pStyle}>
              By 1918 the circle, meeting at St. Saviour&apos;s Anglican Church, had drawn in others, among them <strong style={strong}>David Ogunleye Odubanjo</strong> and <strong style={strong}>Sophia Odunlami</strong>. They came to be called the <strong style={strong}>Precious Stone</strong>, or Diamond, Society. The influenza epidemic that followed the First World War deepened their trust in God to heal.
            </p>
          </Chapter>

          <Chapter id="faith-tabernacle" title="Faith Tabernacle">
            <p style={pStyle}>
              Staying inside the Anglican fold grew harder. These believers shunned idol worship, drink, betting and riotous celebration; they looked for guidance in visions and dreams; they would not baptise babies; and they trusted God for healing. Church authorities objected, and the members were made to suffer for their stand.
            </p>
            <p style={pStyle}>
              Help came by post from America. Odubanjo exchanged letters with Pastor A. Clark of <strong style={strong}>Faith Tabernacle</strong>, a Philadelphia congregation linked with the tract <em>The Sword of the Spirit</em>, and the Ijebu-Ode believers joined that fellowship. Under the Faith Tabernacle name, new branches opened in Nigeria and further afield in West Africa.
            </p>
          </Chapter>

          <Chapter id="babalola" year="1928" title="Joseph Ayo Babalola's call">
            <p style={pStyle}>
              Over three days in October 1928, the 9th to the 11th, a voice spoke to <strong style={strong}>Joseph Ayo Babalola</strong>, then employed to drive a road roller on the route between Akure and Ilesa. Answering it cost him that job: he resigned, gave a week to fasting, and saw Christ in a vision.
            </p>
            <p style={pStyle}>
              It was Pastor Babatope who brought him into contact with the Faith Tabernacle believers, and in 1929 he went through baptism at the hands of Pastor Esinsinade.
            </p>
          </Chapter>

          <Chapter id="revival" year="1930" title="The Great Revival at Oke Ooye, Ilesa">
            <p style={pStyle}>
              In July 1930, at a meeting at Oke Ooye in Ilesa, revival broke out. The church&apos;s traditional account tells of a twelve-year-old boy, Bamiji Ogundipe, being raised from the dead. Word spread across West Africa.
            </p>
            <p style={pStyle}>
              The movement embraced the baptism of the Holy Spirit, visions, prophecy and speaking in tongues. A further revival, led by Prophet Daniel Orekoya, took place at Oke Bola.
            </p>
          </Chapter>

          <Chapter id="apostolic-church" year="1931–40" title="The Apostolic Church years">
            <p style={pStyle}>
              The group next affiliated with the British Apostolic Church, based in Bradford. Visitors from that church arrived on 23 September 1931, and that November seven Nigerians were re-ordained. Pastor George Perfect and Prophet I. Vaughan followed in 1932.
            </p>
            <p style={pStyle}>
              In 1939–40 the partnership broke over divine healing and the use of medicine. The Nigerian leaders — Babalola, D. O. Odubanjo and I. B. Akinyele — kept the main body of the church together.
            </p>
          </Chapter>

          <Chapter id="name" year="1943" title="The name Christ Apostolic Church">
            <p style={pStyle}>
              For a time the church was known as the Nigerian Apostolic Church, and then the United Apostolic Church. In 1942 Babalola was shown the name it carries today, <strong style={strong}>Christ Apostolic Church</strong>.
            </p>
            <p style={pStyle}>
              In May 1943 the church was registered under the Land Perpetual Succession Ordinance as <strong style={strong}>No. 147</strong>. The Apostolic Church was registered later, as No. 186.
            </p>
          </Chapter>

          <Chapter id="judgment" year="1972" title="The Supreme Court judgment">
            <p style={pStyle}>
              Which church was the original, and which had broken away, was finally settled in Nigeria&apos;s highest court. Three justices heard Suit No. SC.223/70: Chief Justice Ademola, with Madarikan and Sowemimo. Their ruling, handed down on 27 April 1972, found that The Apostolic Church was the body that had left, and that Christ Apostolic Church remained the main body.
            </p>
            <p style={pStyle}>
              Having won the case, CAC did not insist on keeping everything; it let go of a large share of the property. Relations between the two churches healed in time: by 1985 they were meeting on brotherly terms, and the history also notes that the Christian Pentecostal Fellowship of Nigeria was founded.
            </p>
          </Chapter>

          <Chapter id="beliefs" title="What the church holds to">
            <p style={pStyle}>
              CAC takes the Bible, together with divine guidance, as its rule. Prophecy, visions, divine healing, holy living, prayer and fasting, and prayer on the church&apos;s prayer mountains are all part of its life. Its motto is <strong style={strong}>&ldquo;One Fold, One Shepherd&rdquo;</strong> (John 10:16).
            </p>
            <p style={pStyle}>
              <Link href="/about#tenets" style={{ color: "var(--red)", fontWeight: 700, textDecoration: "none" }}>Read the Thirteen Tenets of Faith →</Link>
            </p>
          </Chapter>

          <Chapter id="institutions" year="1946–2006" title="Building institutions">
            <p style={pStyle}>
              As it grew, the church founded colleges, schools and a press to train its ministers and serve its communities.
            </p>
            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {institutions.map((item, i) => (
                <li key={`${item.year}-${item.text}`} style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "12px 0", borderTop: i ? "1px solid var(--line)" : "none" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "var(--red)", minWidth: 72, flexShrink: 0 }}>{item.year}</span>
                  <span style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>{item.text}</span>
                </li>
              ))}
            </ol>
          </Chapter>

          <Chapter id="vision" title="Vision and mission">
            <p style={pStyle}>
              <strong style={strong}>Vision:</strong> Soul winning and spiritual re-awakening of the world.
            </p>
            <p style={pStyle}>
              <strong style={strong}>Mission:</strong> Leading people into the knowledge of God through an in-depth study of the Word of God, prevailing prayers, and spiritual worship.
            </p>
            <p style={pStyle}>
              CACNA carries that work across the United States, Canada and South America. <Link href="/about" style={{ color: "var(--red)", fontWeight: 700, textDecoration: "none" }}>Read CACNA&apos;s own story →</Link>
            </p>
          </Chapter>

          <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, margin: "28px 0 0" }}>
            Adapted from the history published by the Directorate of Publicity, CAC Nigeria and Overseas (
            <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--red)", fontWeight: 700 }}>cacworld.org/about/history</a>
            ).
          </p>
        </div>
      </section>

      <FeaturedStories />

      {/* CTA */}
      <section style={{ background: "var(--ink)", padding: "80px clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,4.5vw,52px)", letterSpacing: "-1.2px", color: "var(--cream)", margin: "0 0 32px", lineHeight: 0.98 }}>
            Be part of the next chapter.
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link href="/zones" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 14px 30px rgba(200,30,58,.4)" }}>Find a church near you →</Link>
            <Link href="/about" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(245,246,250,.1)", color: "var(--cream)", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>About CACNA</Link>
          </div>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
