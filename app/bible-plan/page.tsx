import Link from "next/link";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { bibleReadingPlan, FRIDAY_REFLECTION } from "@/lib/biblePlan";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Weekly Bible Reading Plan — Hope for Today | CAC Salvation Center",
  description:
    "Hope for Today — a weekly Bible reading plan from CAC Salvation Center. Sunday through Thursday readings, with Friday set aside to reflect on how God's Word has spoken to you this week.",
  alternates: { canonical: "/bible-plan" },
};

const DAYS: { key: keyof (typeof bibleReadingPlan)[number]; label: string }[] = [
  { key: "sun", label: "Sunday" },
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function BiblePlanPage() {
  const addressLine = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`;

  return (
    <main>
      <Nav heroDark />

      {/* Hero — flyer-style branding strip + big title */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 90px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 820, height: 480, background: "radial-gradient(circle,rgba(232,163,61,.22),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 16s ease-in-out infinite" }} />
        <div style={{ maxWidth: 920, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal from="scale">
            <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 22px", border: "1px solid rgba(232,163,61,.35)", borderRadius: 14, background: "rgba(232,163,61,.05)" }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "3.5px", textTransform: "uppercase", color: "var(--gold)" }}>Salvation Center</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,247,239,.7)" }}>One Fold, One Shepherd</span>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".5px", color: "rgba(255,247,239,.55)" }}>{addressLine}</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--flame)" }}>John 10:16</span>
            </div>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6.2vw,86px)", letterSpacing: "-0.03em", color: "#fff", margin: "24px 0 0", lineHeight: 0.95, textWrap: "balance" }}>
            <RevealText immediate>Weekly Bible</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ background: "linear-gradient(100deg,#F15F22,#D62828,#E8A33D)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Reading Plan.
            </RevealText>
          </h1>
          <Reveal delay={360}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(255,247,239,.72)", lineHeight: 1.7, maxWidth: 620, margin: "20px auto 0", textWrap: "pretty" }}>
              Hope for Today — Sunday through Thursday in Scripture, with every Friday set aside to listen to what God has been saying to you this week.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Intro band */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(40px,5vw,68px) clamp(20px,5vw,64px)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 28, alignItems: "center" }}>
          <Reveal>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>How it works</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,38px)", letterSpacing: "-0.02em", color: "var(--ink)", margin: "10px 0 0", lineHeight: 1.1 }}>
                Five days of Scripture. One day of stillness.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.75, margin: 0 }}>
              Each week takes you through a paired Old and New Testament reading from Sunday to Thursday. On Friday, the page goes quiet — that's the invitation to sit with what you've read and let God speak.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Week cards */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,96px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.6vw,46px)", letterSpacing: "-0.02em", color: "var(--ink)", margin: 0 }}>
                The weeks
              </h2>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-soft)" }}>
                {bibleReadingPlan.length} of 52 released
              </span>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 22 }}>
            {[...bibleReadingPlan].sort((a, b) => b.week - a.week).map((w, i) => (
              <Reveal key={w.week} delay={i * 70}>
                <article className="card-lift" style={{ height: "100%", background: "var(--paper)", borderRadius: 22, border: "1px solid var(--line)", boxShadow: "0 14px 34px rgba(27,19,14,.08)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  {/* Header strip */}
                  <header style={{ padding: "22px 26px 18px", borderBottom: "1px solid var(--line)", background: "linear-gradient(180deg,rgba(232,163,61,.06),transparent)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>
                        Week {pad(w.week)}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase", color: "var(--ink-soft)" }}>
                        Sun · Thu
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: "-.3px", color: "var(--ink)", margin: "10px 0 0", lineHeight: 1.2 }}>
                      {w.theme}
                    </h3>
                  </header>

                  {/* Day list */}
                  <ol style={{ listStyle: "none", padding: "8px 0", margin: 0, flex: 1 }}>
                    {DAYS.map(({ key, label }) => (
                      <li key={key} style={{ display: "grid", gridTemplateColumns: "82px 1fr", gap: 12, padding: "12px 26px", borderBottom: "1px solid rgba(27,19,14,.05)" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.8px", textTransform: "uppercase", color: "var(--flame)", paddingTop: 2 }}>{label}</span>
                        <span style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.6 }}>{w[key]}</span>
                      </li>
                    ))}
                  </ol>

                  {/* Friday band */}
                  <footer style={{ padding: "18px 26px 22px", background: "var(--cream-2)", borderTop: "1px solid var(--line)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "82px 1fr", gap: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.8px", textTransform: "uppercase", color: "var(--red-deep)", paddingTop: 2 }}>Friday</span>
                      <span style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65, fontStyle: "italic" }}>{FRIDAY_REFLECTION}</span>
                    </div>
                  </footer>
                </article>
              </Reveal>
            ))}
          </div>

          {/* More coming */}
          <Reveal delay={bibleReadingPlan.length * 70 + 60} style={{ marginTop: 44 }}>
            <div style={{ textAlign: "center", padding: "30px 24px", border: "1.5px dashed var(--line)", borderRadius: 22, background: "var(--paper)" }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Still to come</span>
              <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: "10px auto 0", maxWidth: 520 }}>
                The rest of the year's readings are released as we walk through them as a family. New weeks land here as they come from the pulpit.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pair with the podcast */}
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,96px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Walk the week together</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-0.02em", color: "var(--cream)", margin: "14px 0 0", lineHeight: 1.05 }}>
              Pair it with the Hope for Today podcast.
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,247,239,.7)", maxWidth: 520, margin: "16px auto 0", lineHeight: 1.7 }}>
              Sermons and reflections from our pastors that line up with the readings — listen on your commute, in the kitchen, or in your stillness on Fridays.
            </p>
          </Reveal>
          <Reveal delay={140} style={{ marginTop: 28 }}>
            <Link
              href="/devotional"
              className="btn-sheen press"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "linear-gradient(120deg,#F15F22,#D62828,#9E1B1B)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "16px 28px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 36px rgba(214,40,40,.34)" }}
            >
              Open the devotional →
            </Link>
          </Reveal>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
