import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { MealRequestForm } from "@/components/youth/MealRequestForm";
import { PhotoStrip } from "@/components/ministries/PhotoStrip";
import { mainGalleryPhotos } from "@/lib/mainGalleryPhotos";
import Link from "next/link";
import { Compass, Target, HandHeart, BookOpen, Users, Mic2, Sparkles } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Youth & Young Adult — Christ Apostolic Church North America (CACNA)",
  description:
    "CACNA's Youth & Young Adult Ministry — vision, mission, values, history, and major programs raising Christ-centered youth across North America.",
  alternates: { canonical: "/youth" },
};

// Real Instagram account for CACNA's Youth & Young Adult Ministry
// (verified 2026-07-21), distinct from the org-wide account used elsewhere
// on this site (FooterExperience, /online).
const YOUTH_INSTAGRAM = "https://instagram.com/cacnayyam";

// Sourced verbatim from cacnorthamerica.com/youth-young-adult/ (2026-07-21) --
// label/body text comes from the Youth i18n namespace (see the component
// body below), icons are the only thing fixed at module scope.
const pillarIcons = [Compass, Target, HandHeart];

// 2026 Annual Convention theme + coordinator, sourced from the Convention
// site's own lib/content/youth-program.ts.
const CONVENTION_THEME = "Did God Really Say...? Knowing God's Word for Yourself";
const REGIONAL_COORDINATOR = "Pastor Adekunmi Browne";

// Real program names from the source page -- no descriptions were given
// there beyond the titles themselves, so none are invented here. Photos are
// each program's own real thumbnail from cacnorthamerica.com/youth-young-adult/.
const programs = [
  { name: "Academic Conference", icon: BookOpen, photo: "/images/cac-youth-program-academic.jpg" },
  { name: "Leadership Retreat", icon: Users, photo: "/images/cac-youth-program-retreat.jpg" },
  { name: "Night of Divine Encounter", icon: Sparkles, photo: "/images/cac-youth-program-divine-encounter.jpg" },
  { name: "Youth Conference", icon: Mic2, photo: "/images/cac-youth-program-conference.jpg" },
];

// Transcribed from the 2026 convention program book's "CAC North America
// Youth and Young Ministry 2026 Convention Schedule" (ported from the
// Convention site's lib/content/youth-program.ts during the Phase D
// content merge, 2026-09). Speakers are embedded in the event text itself
// where the source flyer printed them that way, rather than as a separate
// field.
const schedule2026 = [
  {
    day: "Wednesday, July 15",
    agenda: [
      "10:00–11:00am — Praise & Worship and Opening Prayer",
      "11:30am–1:30pm — Session One: \"Did God Really Say...? How to Read the Bible for Yourself\"",
      "3:00–4:00pm — Session Two: Real Men, Real Talk / Real Women, Real Talk (Becoming Him/Her: Identity)",
      "4:00–5:00pm — Session Three: Panel Discussion — Unmasking and Healing Sexual Brokenness",
      "7:00–9:00pm — Youth Explosion Impartation Service",
    ],
  },
  {
    day: "Thursday, July 16",
    agenda: [
      "10:45–11:15am — Opening Address: \"Did God Really Say...? Knowing God's Word for Yourself\" — Pastor Adekunmi Browne",
      "11:30am–1:00pm — Session Four: Workshops (Calling All Creatives · iWorship for Psalmists & Levites · Marketplace Ministry)",
      "1:00–2:30pm — Lunch | Annual CACNA Picnic",
      "5:00–8:00pm — CACNA Praise Night!",
    ],
  },
  {
    day: "Friday, July 17",
    agenda: [
      "11:00am–1:00pm — Session Five: Breakout — Teen Talk · Singles Ministry · Marriage Ministry",
      "2:30–3:30pm — Session Six: Owning Your Health",
      "3:30–4:30pm — Session Seven: Bible Jeopardy & Prize Giveaway!",
      "4:30–5:00pm — Testimonies · Reflection · Prayer",
    ],
  },
];

// Real event photos from cacnorthamerica.com/youth-young-adult/ (2026-07-21) --
// no per-photo captions exist upstream, so alt text describes what's shown.
const moments = [
  { src: "/images/cac-youth-unity-1.jpg", alt: "CACNA youth and pastors together in matching Unity t-shirts at a past gathering" },
  { src: "/images/cac-youth-unity-2.jpg", alt: "CACNA youth from DCCs across North America gathered in Unity t-shirts" },
  { src: "/images/cac-youth-worship.jpg", alt: "A CACNA youth leader in worship at a past gathering" },
  { src: "/images/cac-youth-conference-group.jpg", alt: "CACNA youth and young adults gathered outdoors at a past conference" },
];

export default async function YouthPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Youth");

  const pillars = [
    { icon: pillarIcons[0], label: t("visionLabel"), body: t("visionBody") },
    { icon: pillarIcons[1], label: t("missionLabel"), body: t("heroBody") },
    { icon: pillarIcons[2], label: t("valuesLabel"), body: t("valuesBody") },
  ];

  return (
    <main id="main-content">
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 90px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 760, height: 460, background: "radial-gradient(circle,rgba(200,30,58,.3),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 16s ease-in-out infinite" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal from="scale">
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>{t("kicker")}</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(44px,6.5vw,88px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0", lineHeight: 0.98, textWrap: "balance" }}>
            <RevealText immediate>{t("heroHeading1")}</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ color: "var(--red)" }}>
              {t("heroHeading2")}
            </RevealText>
          </h1>
          <Reveal delay={360}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(245,246,250,.72)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 32px", textWrap: "pretty" }}>
              {t("heroBody")}
            </p>
          </Reveal>
          <Reveal delay={440}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
              <a
                href={YOUTH_INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sheen press"
                style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 15, padding: "15px 28px", borderRadius: 999, textDecoration: "none" }}
              >
                <InstagramIcon size={17} /> {t("followCta")}
              </a>
              <Link
                href="/contact"
                className="press"
                style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "15px 28px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}
              >
                {t("journeyWithUsCta")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--cream)", paddingBottom: 10 }}>
        <PhotoStrip photos={mainGalleryPhotos.slice(0, 3)} caption="From the 2025 convention" />
      </section>

      {/* Convention identity: theme + coordinator */}
      <section style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px) clamp(48px,6vw,72px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
          <Reveal>
            <div style={{ borderRadius: 18, padding: "22px 24px", background: "var(--paper)", border: "1px solid var(--line)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>{t("conventionThemeLabel")}</div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink)", margin: 0, lineHeight: 1.4 }}>&ldquo;{CONVENTION_THEME}&rdquo;</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div style={{ borderRadius: 18, padding: "22px 24px", background: "var(--paper)", border: "1px solid var(--line)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>{t("coordinatorLabel")}</div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink)", margin: 0, lineHeight: 1.4 }}>{REGIONAL_COORDINATOR}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision / Mission / Values */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
          {pillars.map((p, i) => (
            <Reveal key={p.label} delay={i * 90}>
              <div style={{ height: "100%", borderRadius: 22, padding: "30px 26px", background: "var(--paper)", border: "1px solid var(--line)", boxShadow: "0 10px 26px rgba(18,20,30,.06)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: "linear-gradient(140deg,var(--red),var(--flame))", display: "grid", placeItems: "center", marginBottom: 18 }}>
                  <p.icon size={22} strokeWidth={2} color="#fff" aria-hidden />
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", margin: "0 0 8px" }}>{p.label}</h3>
                <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* History + photo */}
      <section style={{ background: "var(--paper)", padding: "clamp(56px,7vw,96px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "clamp(28px,4vw,48px)", alignItems: "start" }} className="youth-history-grid">
          <Reveal>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>{t("historyKicker")}</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,40px)", letterSpacing: "-.8px", color: "var(--ink)", margin: "14px 0 18px", lineHeight: 1.05 }}>
                {t("historyHeading")}
              </h2>
              <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.8, margin: 0 }}>
                {t("historyBody")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div style={{ position: "relative", width: "100%", height: "clamp(240px,28vw,360px)", borderRadius: 22, overflow: "hidden", boxShadow: "0 20px 44px rgba(18,20,30,.15)" }}>
              <ImageLightbox src="/images/cac-youth-convention.jpg" alt="CACNA youth at a past Annual Convention" />
            </div>
          </Reveal>
        </div>
        <style>{`
          @media (max-width: 760px) {
            .youth-history-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* Major Programs */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>{t("programsKicker")}</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 0", lineHeight: 1 }}>
              {t("programsHeading")}
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {programs.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <div style={{ height: "100%", borderRadius: 18, overflow: "hidden", background: "var(--paper)", border: "1px solid var(--line)" }}>
                  <div style={{ position: "relative", width: "100%", height: 150 }}>
                    <ImageLightbox src={p.photo} alt={`CACNA youth at a past ${p.name}`} />
                  </div>
                  <div style={{ padding: "18px 18px 22px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(140deg,var(--flame),var(--gold))", display: "grid", placeItems: "center", marginTop: -40, boxShadow: "0 6px 16px rgba(18,20,30,.2)" }}>
                      <p.icon size={18} strokeWidth={2} color="#fff" aria-hidden />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15.5, color: "var(--ink)", margin: 0, lineHeight: 1.3 }}>{p.name}</h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 2026 Convention Schedule */}
      <section style={{ background: "var(--paper)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>2026 Convention Schedule</span>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {schedule2026.map((block, i) => (
              <Reveal key={block.day} delay={i * 60}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", margin: "0 0 14px" }}>{block.day}</h3>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, borderLeft: "2px solid var(--line)" }}>
                    {block.agenda.map((item, j) => (
                      <li key={j} style={{ position: "relative", padding: "0 0 0 22px", fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                        <span aria-hidden style={{ position: "absolute", left: -5, top: 6, width: 8, height: 8, borderRadius: "50%", background: "var(--red)" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Moments */}
      <section style={{ background: "var(--paper)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>{t("momentsKicker")}</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 0", lineHeight: 1 }}>
              {t("momentsHeading")}
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
            {moments.map((m, i) => (
              <Reveal key={m.src} delay={i * 80}>
                <div style={{ position: "relative", width: "100%", height: 230, borderRadius: 18, overflow: "hidden", boxShadow: "0 12px 28px rgba(18,20,30,.1)" }}>
                  <ImageLightbox src={m.src} alt={m.alt} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 2026 CACNA YYAM Convention meal RSVP -- a separate, address-and-dates
          distinct youth event from the main Annual Convention. */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>{t("mealHeading")}</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,4vw,42px)", letterSpacing: "-.8px", color: "var(--ink)", margin: "12px 0 14px", lineHeight: 1.05 }}>
              {t("mealSubheading")}
            </h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7 }}>
              {t("mealBody")} {t("mealQuestionsLead")} <a href="mailto:cacnayyam@outlook.com" style={{ color: "var(--red)" }}>cacnayyam@outlook.com</a>.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <MealRequestForm />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,54px)", letterSpacing: "-1.2px", color: "var(--cream)", margin: "0 0 16px", lineHeight: 0.98 }}>
            {t("ctaHeading")}
          </h2>
          <p style={{ fontSize: 16, color: "rgba(245,246,250,.6)", margin: "0 0 32px" }}>
            {t("ctaBody")}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
            <a
              href={YOUTH_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sheen press-lg"
              style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "17px 34px", borderRadius: 999, textDecoration: "none" }}
            >
              <InstagramIcon size={18} /> @cacnayyam
            </a>
            <Link
              href="/contact"
              className="press-lg"
              style={{ display: "inline-block", background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 16, padding: "17px 34px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}
            >
              Kàn Sí Wa →
            </Link>
          </div>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
