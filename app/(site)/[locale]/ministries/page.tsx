import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { DepartmentDirectory, type Department } from "@/components/ministries/DepartmentDirectory";
import Link from "next/link";
import Image from "next/image";
import { Music, Landmark, Sparkles, HandHeart, Video, Wrench, Globe, ShieldCheck, BookOpen, Users2, Smile } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}/ministries`]));
  return {
    title: "Ministries — Christ Apostolic Church North America (CACNA)",
    description:
      "The departments serving every CACNA zone — Administration, Christian Education, Evangelism, Missions, Music, Welfare & Outreach, ICT, and more.",
    alternates: { canonical: `${SITE_URL}/${locale}/ministries`, languages },
  };
}

type Ministry = {
  name: string;
  desc: string;
  icon: LucideIcon;
  href: string;
  cta: string;
  image?: string;
  alt?: string;
  gradient?: string;
};

const departments: Department[] = [
  {
    key: "christian-education",
    label: "Christian Education",
    heading: "A department rooted in Sunday School.",
    // First paragraph (the Sunday School movement's own origin) sourced from
    // cacnorthamerica.com's own Christian Education page (2026-07-21) --
    // condensed from a longer retelling while keeping every real name, date,
    // and place. Robert Raikes founding the first Sunday School in
    // Gloucester in 1780 is documented history, not CACNA-specific lore;
    // included because it's the origin the church's own department page
    // traces itself back to. The remaining two paragraphs (CACNA's own
    // institutional history) are unchanged.
    body: [
      "The Sunday School movement itself traces back to 1780s Gloucester, England, at the dawn of the industrial era. Factory children as young as eight worked six days a week in brutal conditions, with no free schooling — education was a family purchase, out of reach for the poor. On their one day off, many of these children turned to petty crime. Robert Raikes, editor of the Gloucester Journal, saw their lack of education and their dead-end path into poverty and started a school for them on Sundays, paying the first teacher himself and publishing printed sheets of the Ten Commandments and scripture as their curriculum — teaching them to read and write alongside moral instruction.",
      "Christ Apostolic Church's Christian Education Department grew out of the Sunday School movement — a founding vision laid on the Bible and on learning in Christian fellowship, in furtherance of Sunday School activities and how the church at large treats Sunday School lessons.",
      "The Annual Sunday School Rally was started in April 1978, continuing since then with the Holy Spirit-inspired additions and modifications that furthered Sunday School work across the Church. In 1982, the General Christian Education Committee (GCEC) was inaugurated to oversee the affairs of Christian Education in the church, including Sunday School's development. The Church later established its own Printing Press in 1987, at the Odubanjo Memorial Hall in Lagos, seeing the need to handle the production of its Sunday School materials and other publications by itself.",
    ],
    team: [
      { name: "Pastor Dr. Timothy A.O. Agbeja", title: "CACNA/Latunde Region Superintendent", photo: "/images/pastor-agbeja-portrait.jpg" },
      { name: "Pastor Dr. Timothy O. Famojuro", title: "Chairman, Christian Education Dept.", photo: "/images/pastor-timothy-famojuro-portrait.jpg" },
      { name: "Pastor Samuel Tunji Ayeni", title: "Secretary; CAC Agbala Itura Representative", photo: "/images/pastor-ayeni-portrait.jpg" },
      { name: "Pastor Stephen O. Aluko", title: "Director of Sunday School, CAC Worldwide", photo: "/images/pastor-aluko-portrait.jpg" },
      { name: "Pastor Sam. Olu. Falade", title: "Assistant Director, Sunday School, CAC Worldwide", photo: "/images/pastor-falade-portrait.jpg" },
      { name: "Pastor Femi Olaluwoye", title: "EDCC Superintendent", photo: "/images/pastor-olaluwoye-portrait.jpg" },
      { name: "Lady Evangelist Belinda Otusanya", title: "Philadelphia Zone Rep. / Treasurer", photo: "/images/evang-otusanya-portrait.jpg" },
      { name: "Pastor Samuel Opadele", title: "EDCC Representative", photo: "/images/pastor-opadele-portrait.jpg" },
      { name: "Lady Evangelist Linda Benson", title: "New England DCC Representative", photo: "/images/evang-benson-portrait.jpg" },
      { name: "Pastor Teniola", title: "Texas DCC Representative", photo: "/images/pastor-teniola-portrait.jpg" },
      { name: "Lady Evangelist Janet Olajide", title: "Washington DCC Representative", photo: "/images/evang-olajide-portrait.jpg" },
      { name: "Pastor Matthew Oladejo", title: "Cornerstone Zone Representative", photo: "/images/pastor-oladejo-portrait.jpg" },
    ],
  },
  {
    key: "cacma",
    label: "CACMA",
    heading: "Christ Apostolic Church Men's Association.",
    // Sourced from cacnorthamerica.com/cacma/ (2026-07-21). One omission:
    // the source's claim that the Akure bookshop "could not improve due to
    // staff mismanagement" is dropped -- an unverified internal criticism,
    // not appropriate to publish about the association without more
    // context. Everything else real is kept.
    body: [
      "CACMA's founding purpose was to \"raise up the hands of Moses\" (Exodus 17:8-13) in support of the church's ministers — the same spirit as the church at Antioch's own support for its workers (Acts 13:1-5). As the church spread rapidly after the revival at Oke Ooye, the need for trained ministers grew: early trainees (called tuule in Yoruba, roughly \"learners\") studied for three to six months under a senior pastor before being posted to a church.",
      "As the church grew, standardized Bible training became necessary: the School of Prophets and Evangelists was founded at Ilesa in 1949, followed by CAC Bible Training College at Ede in 1952 under Pastor D.O. Odubanjo, and eventually CAC Theological Seminary at Ile-Ife. CACMA formed to fund this training, mobilizing married men across the church to contribute one shilling per person each month — sent to the missionary headquarters at Ibadan to feed students and pay staff.",
      "CACMA's support continued as the schools consolidated at Ile-Ife: a student hostel was completed and dedicated in 2005, followed by four phases of fencing the seminary compound. The association also established the church's printing press at Agege, Lagos, and a bookshop in Akure.",
    ],
    photo: { src: "/images/cacma-fellowship.jpg", alt: "CACMA men fellowshipping at a CACNA gathering", objectPosition: "center 30%" },
  },
  {
    key: "music",
    label: "Music",
    heading: "Spirit-filled praise, since the earliest revivals.",
    // Sourced from cacnorthamerica.com/music-department/ (2026-07-21).
    // Condensed from a much longer list of named musicians across three
    // generations -- every name that appears here is real and drawn
    // directly from that source, not invented; trimmed to a representative
    // few per generation rather than reproducing the full roster of ~40.
    body: [
      "The Music Department is the formation of choir groups within Christ Apostolic Church, dating back to the church's earliest revivals. Its earliest music was accompanied only by drums, gongs, hand claps, and other percussion — instruments common to the traditional religious ceremonies of the Yoruba nation, among whom the church originated — with no formal notation. Spirit-inspired composers of that first generation, among them Apostle Joseph Ayo Babalola and Prophet D.O. Babajide, set lyrics to native airs during revivals and crusades: \"I will sing with the spirit, and I will sing with the understanding also\" (1 Corinthians 14:15).",
      "A second generation of musicians — including Elder James Babalola, Dr. J.O. Ogunranti, and Prophet Fesojaiye Adedeji, among others — carried the tradition forward, still built on hand claps and bells as the church's earliest instrumental accompaniment.",
      "A third generation of choir leaders introduced the church's first standard instruments, the harmonium and accordion, and later standard and a cappella choral singing — pioneered among choirs in Lagos and among educated youth choirs in Akure, Ondo State. This group, including Pastor Professor Femi Adedeji and Pastor Dr. Moses Awojobi among many others, brought central choir performances, training, and conferences to assemblies across every district, and formed the United Association of CAC Choirs — a landmark in the history of CAC's music.",
    ],
  },
  {
    key: "evangelical",
    label: "Evangelical",
    heading: "Five General Evangelists, one mandate.",
    // Sourced from cacnorthamerica.com's own Evangelical Department page
    // (2026-07-21), which adds real detail this entry didn't have before
    // (Babalola's 1928 start with the Faith Tabernacle Group, Babajide as
    // his "right-hand man," Abiara's 75-year retirement-age rule). One
    // correction: the source states Alokan "retired... in 2015" but also
    // says Abiara "was appointed to succeed him in December 2006" -- an
    // internal contradiction. Kept 2006 as the transition year since it
    // matches this entry's own already-verified 1993-2006/2006-2017 dates
    // and is the only reading consistent with Abiara's appointment date.
    body: [
      "The Evangelical Department's office is traditionally reserved for prophets and evangelists. Its occupant leads the evangelical efforts of the church as its chief prophet and evangelist, with every evangelist in the church operating under him — organizing crusades and evangelical outreaches, overseeing other prophets and evangelists, and authorizing the permits under which evangelists minister across the church's assemblies.",
      "Apostle Joseph Ayo Babalola was the first General Evangelist, functioning as a prophet and evangelist from 1928 (when he joined the Faith Tabernacle Group) and officially holding the office from the church's 1943 incorporation until his death in 1959. He was succeeded by his right-hand man, Prophet David Olulana Babajide, who held the office until his retirement in 1991. Evangelist Jacob Oluwatuberu Alokan succeeded him in 1993 and led until 2006, when Prophet Samuel Kayode Abiara was appointed — Abiara retired from the office in 2017 upon reaching the church's retirement age of 75. Prophet Hezekiah Oluboye Oladeji, the incumbent General Evangelist, has held the office since January 2018.",
    ],
  },
];

// Descriptions sourced verbatim from Christ Apostolic Church's own
// "Our Departments" listing (2026-07-21) -- real denominational copy
// rather than CACNA-specific paraphrase, matching this project's practice
// of preferring authentic source text over invented marketing language.
// Presidency is a genuine department that this list was previously missing;
// "Welfare & Outreach" (not part of the source's 10 departments) is removed.
const ministries: Ministry[] = [
  { name: "Presidency", desc: "The Presidency of Christ Apostolic Church administers and carries out policies formulated by the General Executive Council of the church.", icon: Landmark, gradient: "linear-gradient(140deg,var(--red-deep),var(--ink))", href: "/leadership", cta: "Meet our leadership" },
  { name: "Missions", desc: "The Missions Department of Christ Apostolic Church is responsible for taking the message of Jesus Christ to all nooks and crannies of the world.", icon: Globe, gradient: "linear-gradient(140deg,#1B4332,#2D6A4F)", href: "/contact", cta: "Get involved" },
  { name: "Evangelism, Prayer & Counselling", desc: "The principal occupant of the Evangelical Department of Christ Apostolic Church leads all evangelical efforts and prophecy of the church.", icon: HandHeart, gradient: "linear-gradient(140deg,var(--ember),var(--red-deep))", href: "#departments", cta: "Read our history" },
  { name: "Administration", desc: "Whether you need information regarding a specific department or you want to find out more information, dive into the departments of Christ Apostolic Church.", icon: Wrench, gradient: "linear-gradient(140deg,var(--red),var(--flame))", href: "#departments", cta: "Explore departments" },
  { name: "Christian Education", desc: "The Christian Education Department is an established concept in Christ Apostolic Church from inception and it was established by the progenitors of the church.", icon: BookOpen, gradient: "linear-gradient(140deg,var(--flame),var(--gold))", href: "/christian-education", cta: "Meet the department" },
  { name: "Music", desc: "The Music Department of Christ Apostolic Church is the formation of choir groups and dates back to the very foundations of the church.", icon: Music, gradient: "linear-gradient(140deg,var(--gold),var(--flame))", href: "#departments", cta: "Read our history" },
  { name: "ICT", desc: "The history of the ICT Department of Christ Apostolic Church dates back to 2003 and allows for the seamless liaison with Christ Apostolic Churches overseas.", icon: Video, gradient: "linear-gradient(140deg,var(--ink),var(--red-deep))", href: "/online", cta: "Watch online" },
  { name: "CAC Men Association", desc: "The history of CACMA at Christ Apostolic Church is narrated for the benefits of all men members of the church.", icon: ShieldCheck, gradient: "linear-gradient(140deg,var(--red-deep),var(--ink))", href: "/cacma", cta: "Meet CACMA" },
  { name: "CAC Good Women Association", desc: "The impact of the Good Women, either as members, ministers, or spouses of ministers has embellished the history of Christ Apostolic Church at all levels.", icon: Users2, gradient: "linear-gradient(140deg,var(--gold),var(--red))", href: "/good-women", cta: "Meet the department" },
  { name: "Ministers' Wives Conference", desc: "A fellowship for the wives of CACNA's ministers, gathered in prayer and mutual support for those who shepherd alongside their husbands.", icon: HandHeart, gradient: "linear-gradient(140deg,var(--red),var(--red-deep))", href: "/ministers-wives", cta: "Meet the fellowship" },
  { name: "Business Group Fellowship", desc: "A platform for interaction, mentorship, and support among CAC members who are business-inclined — supporting projects and programs of the Church.", icon: Wrench, gradient: "linear-gradient(140deg,#1B4332,#2D6A4F)", href: "/business-group", cta: "Meet the fellowship" },
  { name: "Youth & Young Adult", desc: "The history of the Youth Department dates back to the 1930s when Nigerian and white Apostolic from Britain were still in alliance.", icon: Sparkles, gradient: "linear-gradient(140deg,var(--red-deep),var(--red))", href: "/youth", cta: "Meet the ministry" },
  { name: "Children's Ministry", desc: "A dedicated program for children during the Annual Convention — worship, teaching, and fun, at every session.", icon: Smile, gradient: "linear-gradient(140deg,var(--gold),var(--red-deep))", href: "/children", cta: "Meet the ministry" },
];

export default async function MinistriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content">
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 90px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 760, height: 460, background: "radial-gradient(circle,rgba(200,30,58,.3),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 16s ease-in-out infinite" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal from="scale">
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Ministries</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(44px,6.5vw,92px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0", lineHeight: 0.95, textWrap: "balance" }}>
            <RevealText immediate>There&apos;s a place</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ color: "var(--red)" }}>
              for you here.
            </RevealText>
          </h1>
          <Reveal delay={360}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(245,246,250,.72)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto", textWrap: "pretty" }}>
              CACNA&apos;s departments serve every member church across the United States, Canada, and South America — a place to grow, to serve, and to belong.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,96px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22 }}>
          {ministries.map((m, i) => (
            <Reveal key={m.name} delay={(i % 3) * 90}>
              <div className="card-lift" style={{ height: "100%", borderRadius: 24, overflow: "hidden", background: "var(--paper)", border: "1px solid var(--line)", boxShadow: "0 14px 34px rgba(18,20,30,.08)", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", height: 200, background: m.image ? "#0F1F0F" : m.gradient }}>
                  <span style={{ position: "absolute", top: 16, left: 16, width: 44, height: 44, borderRadius: 13, background: "rgba(255,255,255,.18)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", border: "1px solid rgba(255,255,255,.25)", zIndex: 2 }}>
                    <m.icon size={22} strokeWidth={1.85} color="#fff" aria-hidden />
                  </span>
                  {m.image ? (
                    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", padding: "20px 28px" }}>
                      <Image src={m.image} alt={m.alt ?? m.name} width={960} height={720} style={{ maxHeight: 130, width: "auto", height: "auto", maxWidth: "100%", objectFit: "contain" }} />
                    </div>
                  ) : (
                    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                      <m.icon size={64} strokeWidth={1.4} color="rgba(255,255,255,.9)" aria-hidden />
                    </div>
                  )}
                </div>
                <div style={{ padding: "24px 26px 26px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, letterSpacing: "-.4px", color: "var(--ink)", margin: "0 0 10px" }}>{m.name}</h3>
                  <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.65, margin: "0 0 20px" }}>{m.desc}</p>
                  {m.href.startsWith("http") ? (
                    <a href={m.href} target="_blank" rel="noopener noreferrer" className="press" style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>
                      {m.cta} <span aria-hidden style={{ fontSize: 16 }}>→</span>
                    </a>
                  ) : (
                    <Link href={m.href} className="press" style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>
                      {m.cta} <span aria-hidden style={{ fontSize: 16 }}>→</span>
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Department directory — history + leadership, one department at a time */}
      <section id="departments" style={{ background: "var(--paper)", padding: "clamp(56px,7vw,96px) clamp(20px,5vw,64px)", scrollMarginTop: 90 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 40, textAlign: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Where we come from</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 0", lineHeight: 1 }}>
              Department histories.
            </h2>
          </Reveal>
          <DepartmentDirectory departments={departments} />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,58px)", letterSpacing: "-1.2px", color: "var(--cream)", margin: "0 0 16px", lineHeight: 0.96 }}>Not sure where you fit?</h2>
          <p style={{ fontSize: 17, color: "rgba(245,246,250,.6)", margin: "0 0 36px" }}>Reach out and we&apos;ll connect you with the right department or zone.</p>
          <Link href="/contact" className="btn-sheen press-lg" style={{ display: "inline-block", background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "17px 34px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 34px rgba(200,30,58,.4)" }}>
            Fill the serve form →
          </Link>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
