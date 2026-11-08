import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { CURRENT_WATCHWORD } from "@/lib/watchwords";
import { CONVENTION_VENUE_SHORT, currentOrNextConvention } from "@/lib/conventions";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Golden Jubilee: 50 Years of CAC North America (CACNA)",
    description:
      "On October 10, 2026, Christ Apostolic Church North & South America (Latunde Region) celebrated its Golden Jubilee, 50 years in the Americas, at CAC Village, Blue Ridge Summit, PA.",
    alternates: { canonical: `${SITE_URL}/golden-jubilee` },
  };
}

/*
 * Every fact on this page comes from the printed programme, "CAC North
 * America Golden Jubilee, Oct 10 2026". Where it differs from what the site
 * already says (the venue's town, the 1943 registration), the site's wording
 * is used. Nothing here is from the programme's adverts or giving panels.
 */

const milestones: { year: string; text: string }[] = [
  { year: "1918", text: "Christ Apostolic Church begins in Nigeria as a prayer group, the Precious Stone Society" },
  { year: "1930", text: "The Great Revival at Oke Ooye under Apostle Joseph Ayo Babalola" },
  { year: "1943", text: "The church is registered as Christ Apostolic Church" },
  { year: "1979", text: "Apostle T. O. Obadare establishes Christ Apostolic Church in London" },
  { year: "1981", text: "Apostle T. O. Obadare establishes Christ Apostolic Church in the United States" },
  { year: "2026", text: "October 10: the Golden Jubilee at CAC Village" },
];

/** Names and titles as printed on the programme's honorees page. */
const pioneers: { name: string; title: string; note?: string; photo?: string }[] = [
  {
    name: "Pastor (Professor) Abraham Adegoke Oyedeji, Ph.D.",
    title: "Pioneer of CAC North America",
    photo: "/images/leaders/oyedeji-2026.jpg",
    note: "Remembered in the Chairman's address as the one who planted the church in the Americas. Senior Pastor and DCC Superintendent, CAC First in the Americas.",
  },
  {
    name: "Apostle (Dr.) Timothy Obadare",
    title: "Retired General Evangelist, Planter of WOSEM",
    photo: "/images/leaders/obadare-2026.jpg",
    note: "Established Christ Apostolic Church in London in 1979 and in the United States in 1981. Founder of the World Soul-Winning Evangelistic Ministry (WOSEM). 1925–2013.",
  },
  { name: "Pastor Abraham Adetunji Ojo", title: "First Pastor in North America" },
  {
    name: "Pastor Joshua O. Owoeye, Ph.D.",
    title: "Coordinator of CAC North America and Member, CAC General Executive Council",
    photo: "/images/leaders/owoeye-2026.jpg",
    note: "Honoured in the programme as the first CAC North America Superintendent (Retired).",
  },
  { name: "Evangelist Mary Olukemi Makinde", title: "Pioneer Women Leader" },
  { name: "Late Pastor J. O. Adeyanju, JP", title: "First Chairman, CAC EDCC" },
  { name: "Prophet (Dr.) Samuel Kayode Abiara", title: "Planter of CAC Vineyard of Comfort (Agbala Itura), Retired General Evangelist", photo: "/images/leaders/abiara-2026.jpg" },
];

/** Honoured on the day, names as printed in the programme. */
const mothersOfTheDay = [
  "Evangelist Mrs. Funmi Efuntoye", "Evangelist (Dr.) Mrs. Funmi Oni", "Evangelist Mrs. Bukola Williams", "Evangelist Mrs. Bolanle Mustapha",
  "Deaconess Mrs. Wuraola Akindileni", "Evangelist Mrs. Jumoke Famojuro", "Evangelist Mrs. Toyin Ajibolade", "Evangelist Mrs. Abiola Oyetunde",
];
const fathersOfTheDay = ["Pastor (Dr.) Teniola", "Elder Rufus Fashakin", "Pastor Bolaji Oladunni", "Dr. Olasunkanmi Oyetunde"];

/** The thanksgiving service, in the order printed. Hymn numbers refer to the CAC hymnal. */
const orderOfService = [
  "Praise & Worship", "Opening hymn: Praise Him, Praise Him (Hymn 66)", "Prayer", "Scripture reading", "Recognition of guests",
  "Joint choir ministration", "Second hymn: O God, Our Help in Ages Past (Hymn 176)", "Joint choir ministration", "Brief exhortation",
  "Prayer after exhortation", "Awards", "Jubilee celebration thanksgiving", "Vote of thanks",
  "Closing hymn: I'm Pressing on the Upward Way (Hymn 26)", "Prayer", "Watchword", "Benediction",
];

const leaders: { name: string; role: string }[] = [
  { name: "Pastor Samuel Olusegun Oladele", role: "President, Christ Apostolic Church" },
  { name: "Pastor E. O. Odejobi", role: "General Superintendent" },
  { name: "Prophet Hezekiah Oladeji", role: "General Evangelist" },
  { name: "Pastor T. A. O. Omolayo Agbeja, Ph.D.", role: "Regional Superintendent, C.A.C. North America (Latunde Region)" },
  { name: "Pastor David Adenodi, Ph.D.", role: "Chairman, 50th Anniversary Planning Committee" },
];

/** The planning committee, names and roles as printed. */
const committeeWithRoles: { name: string; role: string }[] = [
  { name: "Pastor David Adenodi, Ph.D.", role: "Committee Chairman" },
  { name: "Pastor Oluwagbemiga Famojuro, D.Min.", role: "Convention Chairman" },
  { name: "Pastor Zaccheaus Oloba", role: "Superintendent, VOC Atlanta DCC" },
  { name: "Pastor Amos Adetobi", role: "Superintendent, Cornerstone Zone" },
  { name: "Pastor Abayomi Ademuwagun", role: "President, Protocol" },
  { name: "Pastor Ogbeide Oniha, Ph.D.", role: "Logistics & Assistant to the Chairman" },
  { name: "Evangelist Belinda Otusanya", role: "Publication and Finance" },
  { name: "Pastor Femi Adegoke", role: "Choir" },
];

const committeeMembers = [
  "Pastor Akintayo Busayo, Ph.D.", "Evangelist Bisi Benson", "Pastor Adekunmi Browne", "Elder Ayoola Odeyemi (Protocol)",
  "Lady Evang. Mrs Eunice Alabi-Oni", "Deaconess Kimberly Omotade", "Evangelist Mary Babalola-Omotunde", "Pastor Henry Okonofua, Ph.D.",
  "Pastor Osajele Ekikhamenor, Ph.D.", "Pastor Omotayo Wilhelm", "Deacon Ayodeji Ajibolade", "Evangelist Debbie Aina Solomon",
  "Evangelist Oluwatoyin Oni", "Evangelist (Dr) Funmilayo Oni", "Pastor Philip Ekoma", "Evangelist (Dr) Mojisola Bafunso",
  "Evangelist Onatokunboh Browne (Hospitality)", "Evangelist Ebunoluwa Oke", "Elder Babatunde Mojeed", "Evangelist (Dr) Janet Olajide",
  "Evangelist (Dr) Patrick Awosogba", "Pastor Joseph Opadele", "Elder Tunji Ojekunle", "Elder Olusegun Fashusi",
  "Evangelist Adebisi Abikoye", "Evangelist Bolanle Mustapha",
];

const pStyle = { fontSize: 16.5, color: "var(--ink-soft)", lineHeight: 1.8, margin: 0 } as const;
const strong = { color: "var(--ink)" } as const;
const linkStyle = { color: "var(--red)", fontWeight: 700, textDecoration: "none" } as const;

/** Same chapter treatment as /history; not wrapped in <Reveal> so content shows without JS. */
function Chapter({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} style={{ padding: "30px 0", borderBottom: "1px solid var(--line)", scrollMarginTop: 96 }}>
      <h2 id={`${id}-heading`} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,2.6vw,28px)", letterSpacing: "-.4px", color: "var(--ink)", margin: "0 0 14px", lineHeight: 1.2, textWrap: "balance" }}>
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
    </section>
  );
}

export default async function GoldenJubileePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nextConvention = currentOrNextConvention();

  return (
    <main id="main-content" className="ap-main">
      <Nav />

      {/* Hero */}
      <section style={{ background: "var(--cream)", padding: "140px clamp(20px,5vw,64px) 64px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -60, right: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,var(--gold),var(--red) 70%)", opacity: 0.12, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6vw,78px)", letterSpacing: "-0.03em", color: "var(--ink)", margin: "16px 0", lineHeight: 0.96, textWrap: "balance" }}>
              Golden Jubilee: fifty years in the Americas.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: 600, margin: "0 auto" }}>
              On <strong style={strong}><time dateTime="2026-10-10">October 10, 2026</time></strong>, Christ Apostolic Church North &amp; South America, Latunde Region, gathered at <strong style={strong}>{CONVENTION_VENUE_SHORT}</strong> to celebrate its 50th anniversary.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--paper)", padding: "clamp(24px,4vw,40px) clamp(20px,5vw,64px) clamp(64px,8vw,100px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Chapter id="story" title="Fifty years in North America">
            <p style={pStyle}>
              We celebrated the Golden Jubilee of Christ Apostolic Church in America with thanksgiving. According to the Golden Jubilee programme, the faith was planted in the Americas fifty years ago by the late <strong style={strong}>Pastor A. A. Oyedeji</strong> and others, and in his welcome address Regional Superintendent Pastor T. A. O. Omolayo Agbeja likened that small beginning to a mustard seed.
            </p>
            <p style={pStyle}>
              The programme recalls that Christ Apostolic Church began in Nigeria in 1918 as a prayer group, the Precious Stone Society, which came into contact with Faith Tabernacle in Philadelphia. The Great Revival of 1930 at Oke Ooye followed under Apostle Joseph Ayo Babalola. Today, the President&apos;s letter notes, the church has more than <strong style={strong}>1.3 million members in 24 nations</strong>, seventeen theological seminaries, and Joseph Ayo Babalola University at Ikeji-Arakeji.
            </p>
            <p style={pStyle}>
              The Chairman&apos;s address remembered the pastors who have gone before us, among them A. A. Adeojo, J. O. Adeyanju, A. S. Shasanmi, Ogunjeminiyi and J. T. F. Brown, and prayed for the next fifty years.
            </p>
          </Chapter>

          <Chapter id="timeline" title="Milestones">
            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {milestones.map((m, i) => (
                <li key={`${m.year}-${m.text}`} style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "12px 0 12px 14px", borderLeft: "2px solid var(--red)", borderTop: i ? "1px solid var(--line)" : "none" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "var(--red)", minWidth: 52, flexShrink: 0 }}>{m.year}</span>
                  <span style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>{m.text}</span>
                </li>
              ))}
            </ol>
            <p style={{ ...pStyle, fontSize: 14.5 }}>
              <Link href="/history" style={linkStyle}>Read the full history of Christ Apostolic Church →</Link>
            </p>
          </Chapter>

          <Chapter id="pioneers" title="Pioneers we honour">
            <p style={pStyle}>The programme honoured these servants of God, named here as it printed them.</p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 16 }}>
              {pioneers.map((p) => (
                <li key={p.name} style={{ background: "var(--cream)", border: "1px solid var(--line)", borderTop: "3px solid var(--gold)", borderRadius: 14, padding: "18px 18px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {p.photo && (
                    <Image src={p.photo} alt={p.name} width={400} height={400} sizes="220px" style={{ width: "100%", height: 200, objectFit: "cover", objectPosition: "center 20%", borderRadius: 10, background: "var(--paper)" }} />
                  )}
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "var(--ink)", margin: 0, lineHeight: 1.3 }}>{p.name}</h3>
                  <p style={{ fontSize: 14.5, fontWeight: 700, color: "var(--red)", margin: 0, lineHeight: 1.45 }}>{p.title}</p>
                  {p.note && <p style={{ fontSize: 14.5, color: "var(--ink-soft)", margin: 0, lineHeight: 1.6 }}>{p.note}</p>}
                </li>
              ))}
            </ul>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, color: "var(--ink)", margin: "10px 0 0" }}>Mothers and Fathers of the Day</h3>
            <p style={{ ...pStyle, fontSize: 15.5 }}><strong style={strong}>Mothers:</strong> {mothersOfTheDay.join("; ")}.</p>
            <p style={{ ...pStyle, fontSize: 15.5 }}><strong style={strong}>Fathers:</strong> {fathersOfTheDay.join("; ")}.</p>
          </Chapter>

          <Chapter id="service" title="Order of service">
            <p style={pStyle}>The Golden Jubilee thanksgiving service followed this order.</p>
            <ol style={{ margin: 0, paddingLeft: 24, display: "grid", gap: 6, fontSize: 16, color: "var(--ink)", lineHeight: 1.5 }}>
              {orderOfService.map((item, i) => <li key={i}>{item}</li>)}
            </ol>
          </Chapter>

          <Chapter id="leaders" title="Our leaders today">
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {leaders.map((l, i) => (
                <li key={l.name} style={{ padding: "12px 0", borderTop: i ? "1px solid var(--line)" : "none", display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>{l.name}</span>
                  <span style={{ fontSize: 14.5, color: "var(--ink-soft)" }}>{l.role}</span>
                </li>
              ))}
            </ul>
          </Chapter>

          <Chapter id="watchword" title={`The ${CURRENT_WATCHWORD.year} Watchword`}>
            <figure style={{ margin: 0, padding: "22px 24px", background: "var(--cream)", borderLeft: "3px solid var(--red)", borderRadius: 12 }}>
              <blockquote style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(19px,2.2vw,23px)", color: "var(--ink)", lineHeight: 1.4 }}>
                &ldquo;{CURRENT_WATCHWORD.verseText}&rdquo;
              </blockquote>
              {CURRENT_WATCHWORD.verseTextYoruba && (
                <p lang="yo" style={{ ...pStyle, fontSize: 15.5, marginTop: 10 }}>{CURRENT_WATCHWORD.verseTextYoruba}</p>
              )}
              <figcaption style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: "var(--red)" }}>{CURRENT_WATCHWORD.verseRef} (NKJV &amp; Yorùbá)</figcaption>
            </figure>
            <p style={{ ...pStyle, fontSize: 14.5 }}>
              <Link href="/watchwords" style={linkStyle}>Every Watchword since 1989 →</Link>
            </p>
          </Chapter>

          <Chapter id="thanks" title="Thank you">
            <p style={pStyle}>
              We thank the 50th Anniversary Planning Committee for their prayer, service and sacrifice, and everyone who worked and worshipped with us.
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: "10px 24px" }}>
              {committeeWithRoles.map((c) => (
                <li key={c.name} style={{ fontSize: 15, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 700, color: "var(--ink)" }}>{c.name}</span>
                  <br />
                  <span style={{ color: "var(--ink-soft)", fontSize: 14 }}>{c.role}</span>
                </li>
              ))}
            </ul>
            <p style={{ ...pStyle, fontSize: 15 }}>
              <strong style={strong}>Committee members:</strong> {committeeMembers.join(", ")}.
            </p>
          </Chapter>

          <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, margin: "28px 0 0" }}>
            Drawn from the printed programme, <em>CAC North America Golden Jubilee, October 10, 2026</em>.
          </p>
        </div>
      </section>

      {/* Next: Convention */}
      <section aria-labelledby="next-heading" style={{ background: "var(--ink)", padding: "80px clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal>
          <h2 id="next-heading" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,4.5vw,52px)", letterSpacing: "-1.2px", color: "var(--cream)", margin: "0 0 16px", lineHeight: 0.98 }}>
            Next: the Annual Convention.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(245,246,250,.8)", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 32px" }}>
            The next fifty years begin with gathering again.
          </p>
          <Link href={nextConvention.href} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 14px 30px rgba(200,30,58,.4)" }}>
            CACNA {nextConvention.year} Annual Convention →
          </Link>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
