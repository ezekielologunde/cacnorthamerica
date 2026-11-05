import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight, Baby, Church, ClipboardList, Coffee, DoorOpen, Flame, HandHeart, HeartHandshake,
  Music, ShieldCheck, Share2, Sparkles, Stethoscope, Users, Utensils, Video, type LucideIcon,
} from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { ServeForm } from "@/components/serve/ServeForm";
import { SERVE_TEAMS, type ServeTeam } from "@/lib/serveTeams";
import { currentOrNextConvention } from "@/lib/conventions";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Serve at the Convention — Christ Apostolic Church North America (CACNA)",
    description:
      "Volunteer at the CACNA Annual Convention: ushers, protocol, care team, hospitality, food and welfare, sanctuary keepers, choir, registration, media, social media and more. Choose your teams and sign up.",
    alternates: { canonical: `${SITE_URL}/serve` },
  };
}

// Icons per team id. A team added to lib/serveTeams.ts without one here gets HandHeart.
const TEAM_ICONS: Record<string, LucideIcon> = {
  ushers: DoorOpen,
  protocol: Users,
  care: HeartHandshake,
  hospitality: Coffee,
  "food-welfare": Utensils,
  sanctuary: Church,
  choir: Music,
  registration: ClipboardList,
  media: Video,
  "social-media": Share2,
  children: Baby,
  security: ShieldCheck,
  medical: Stethoscope,
  prayer: Flame,
  youth: Sparkles,
};

const STEPS = [
  { title: "Choose your teams", body: "Pick one team or several, and tell us a little about your experience and when you can serve." },
  { title: "Hear from the Convention Committee", body: "The Convention Committee will be in touch with what comes next." },
  { title: "Serve at the convention", body: "Join your team on the grounds and help make the convention a blessing for everyone who comes." },
];

const SECTION_PAD = "clamp(56px,7vw,90px) clamp(20px,5vw,64px)";
const h2Style = { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.6vw,40px)", letterSpacing: "-1px", color: "var(--ink)", margin: 0, lineHeight: 1.05 } as const;

export default async function ServePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cy = currentOrNextConvention();
  const teams: readonly ServeTeam[] = SERVE_TEAMS;

  return (
    <main id="main-content">
      <Nav />

      {/* Hero */}
      <section style={{ background: "var(--cream)", padding: "calc(var(--bar-h, 0px) + 100px) clamp(20px,5vw,64px) clamp(40px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", bottom: -80, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,var(--blue),var(--red) 70%)", opacity: .1, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(34px,5.4vw,58px)", letterSpacing: "-1.5px", color: "var(--ink)", margin: "0 0 14px", lineHeight: 1.02, textWrap: "balance" }}>
              Serve at the <span style={{ color: "var(--red)" }}>Convention.</span>
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p style={{ fontSize: "clamp(16px,1.7vw,18px)", color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 540, margin: "0 auto" }}>
              The Annual Convention is carried by people who give their time: ushers at the doors, voices in the choir, hands at the food canopies. There is a place for you. Choose a team and the Convention Committee will be in touch.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 24 }}>
              <a href="#serve-form" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 48, padding: "0 24px", borderRadius: 999, background: "linear-gradient(100deg,var(--blue),var(--red))", color: "#fff", fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
                Sign up to serve <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
              </a>
              <Link href={cy.href} className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 48, padding: "0 22px", borderRadius: 999, border: "1.5px solid var(--line)", background: "var(--paper)", color: "var(--ink)", fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
                {`CACNA ${cy.year} Convention details`}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Teams */}
      <section aria-labelledby="teams-heading" style={{ background: "var(--paper)", padding: SECTION_PAD }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 32, maxWidth: 620 }}>
            <h2 id="teams-heading" style={h2Style}>Where you can serve</h2>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.65, margin: "12px 0 0" }}>
              Every team needs willing hearts more than experience. If you&apos;re not sure, pick a few and the Convention Committee will help you find the right fit.
            </p>
          </Reveal>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))", gap: 14 }}>
            {teams.map((team, i) => (
              <li key={team.id} style={{ display: "flex" }}>
              <Reveal delay={(i % 3) * 60} style={{ flex: 1, display: "flex" }}>
                <div style={{ flex: 1, background: team.note ? "var(--cream-2)" : "var(--cream)", border: "1px solid var(--line)", borderRadius: 18, padding: "22px 22px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <IconBadge icon={TEAM_ICONS[team.id] ?? HandHeart} size={44} iconSize={21} bg="var(--paper)" />
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", margin: 0, lineHeight: 1.2 }}>{team.name}</h3>
                  </div>
                  <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>{team.blurb}</p>
                  {team.note && (
                    <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.6, margin: "12px 0 0", paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                      {team.noteTitle && <strong>{team.noteTitle}</strong>} {team.note}
                    </p>
                  )}
                </div>
              </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="steps-heading" style={{ background: "var(--cream)", padding: SECTION_PAD }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 28 }}>
            <h2 id="steps-heading" style={h2Style}>How it works</h2>
          </Reveal>
          <ol className="r3" style={{ listStyle: "none", margin: 0, padding: 0, gap: 24 }}>
            {STEPS.map((s, i) => (
              <li key={s.title}>
              <Reveal delay={i * 80}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--red)", lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <h3 style={{ fontWeight: 700, fontSize: 17, color: "var(--ink)", margin: "10px 0 6px" }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>{s.body}</p>
              </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Form */}
      <section id="serve-form" style={{ background: "var(--cream-2)", padding: SECTION_PAD, scrollMarginTop: 72 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", background: "var(--paper)", borderRadius: 20, border: "1px solid var(--line)", padding: "clamp(20px,3.5vw,40px)", boxShadow: "0 16px 48px rgba(18,20,30,.06)", position: "relative" }}>
          <ServeForm />
        </div>
        <p style={{ maxWidth: 720, margin: "20px auto 0", textAlign: "center", fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>
          Questions about serving or the convention itself?{" "}
          <Link href="/contact#convention-committee" style={{ color: "var(--red)", fontWeight: 700, display: "inline-block", padding: "12px 0" }}>Contact the Convention Committee</Link>
        </p>
      </section>

      <FooterExperience />
    </main>
  );
}
