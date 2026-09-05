import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Children's Ministry — Christ Apostolic Church North America (CACNA)",
  description:
    "CACNA's Children's Ministry at the Annual Convention — daily schedule, teachers, and God's Message to Children (Mark 10:14).",
  alternates: { canonical: "/children" },
};

// Ported from the Convention site's lib/content/children-convention.ts
// during the Phase D content merge (2026-09) -- this is a genuine net-new
// page, CACNA had no children's-ministry page before this.
const CHILDREN_CONVENTION = {
  theme: "God's Message to Children",
  themeVerse: "Mark 10:14",
  coordinator: "Evangelist Mrs. Oluwatoyin Oni",
  safetyNote: "The children's safety is our priority.",
  closingNote: "Have a wonderful summer!",
};

const dailyStructure = [
  { label: "Sign In", morning: "11:30–11:45am", afternoon: "3:30–3:45pm" },
  { label: "Praise and Worship", morning: "11:45am–12:00pm", afternoon: "3:45–4:00pm" },
  { label: "Prayers", morning: "12:00–12:15pm", afternoon: "4:00–4:15pm" },
];

const teachers5to8 = [
  "Evang. Mrs. Juliana Adewunmi", "Mrs. Adeola Bankole", "Evang. Mrs. Iyabo Bolanle Ajisafe",
  "Evang. Mrs. Michelle Okusanya", "Mrs. Gloria Omowole", "Mrs. Christiana Odetoye", "Mrs. Olajumoke Alaba",
];
const teachers9to12 = ["Mrs. Adeola Babs Mala", "Evang. Mrs. Sumbo Oni", "Evang. Mrs. Folasade Olorunfemi"];
const teachersUnassigned = ["Mrs. Esan", "Mr. Ijaola"];

type ChildrenSession = { time: string; message?: string; activity?: string };
type ChildrenScheduleDay = { dayLabel: string; morning?: ChildrenSession; afternoon?: ChildrenSession };

const schedule2026: ChildrenScheduleDay[] = [
  {
    dayLabel: "Wednesday, July 15",
    morning: { time: "11:30am–1:30pm", message: "God's love, wisdom, and guidance for children" },
    afternoon: { time: "3:30–5:00pm", message: "God's love in helping children navigate life challenges" },
  },
  {
    dayLabel: "Thursday, July 16",
    morning: { time: "11:30am–1:30pm", message: "Message Review and Trivia" },
    afternoon: { time: "1:30–5:00pm", activity: "Outdoor Games and Water Splash Activities" },
  },
  {
    dayLabel: "Friday, July 17",
    morning: { time: "10:00am–2:00pm", activity: "Question & Answer Session with Prizes" },
  },
];

export default async function ChildrenPage({
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
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 760, height: 460, background: "radial-gradient(circle,rgba(200,30,58,.3),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal from="scale">
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Children&apos;s Ministry</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6vw,76px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0", lineHeight: 1.02, textWrap: "balance" }}>
            <RevealText immediate>{CHILDREN_CONVENTION.theme}</RevealText>
          </h1>
          <Reveal delay={200}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1px", color: "rgba(245,246,250,.5)" }}>{CHILDREN_CONVENTION.themeVerse}</p>
          </Reveal>
          <Reveal delay={280}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(245,246,250,.72)", lineHeight: 1.7, maxWidth: 560, margin: "20px auto 0", textWrap: "pretty" }}>
              A dedicated program for children during the Annual Convention — worship, teaching, and fun, at every session.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Coordinator */}
      <section style={{ background: "var(--cream)", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px) 0" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <Reveal>
            <div style={{ borderRadius: 18, padding: "22px 24px", background: "var(--paper)", border: "1px solid var(--line)", textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>Program Coordinator</div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink)", margin: 0 }}>{CHILDREN_CONVENTION.coordinator}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Daily structure */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Every Day</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,36px)", color: "var(--ink)", margin: "12px 0 0" }}>The daily rhythm.</h2>
          </Reveal>
          <div style={{ borderRadius: 18, border: "1px solid var(--line)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", background: "var(--ink)", color: "#fff", fontSize: 12, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", padding: "12px 18px" }}>
              <span>Activity</span><span>Morning</span><span>Afternoon</span>
            </div>
            {dailyStructure.map((row, i) => (
              <div key={row.label} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", padding: "14px 18px", background: i % 2 ? "var(--cream-2)" : "var(--paper)", fontSize: 14 }}>
                <span style={{ fontWeight: 700, color: "var(--ink)" }}>{row.label}</span>
                <span style={{ color: "var(--ink-soft)" }}>{row.morning}</span>
                <span style={{ color: "var(--ink-soft)" }}>{row.afternoon}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section style={{ background: "var(--paper)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>2026 Convention Schedule</span>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {schedule2026.map((day, i) => (
              <Reveal key={day.dayLabel} delay={i * 70}>
                <div style={{ borderRadius: 18, border: "1px solid var(--line)", background: "var(--cream)", padding: "20px 24px" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "var(--ink)", margin: "0 0 12px" }}>{day.dayLabel}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {day.morning && (
                      <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                        <strong style={{ color: "var(--ink)" }}>Morning ({day.morning.time})</strong> — {day.morning.message ?? day.morning.activity}
                      </div>
                    )}
                    {day.afternoon && (
                      <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                        <strong style={{ color: "var(--ink)" }}>Afternoon ({day.afternoon.time})</strong> — {day.afternoon.message ?? day.afternoon.activity}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 36 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>2026 Teachers</span>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
            {[
              { label: "Ages 5–8", names: teachers5to8 },
              { label: "Ages 9–12", names: teachers9to12 },
              { label: "Additional Teachers", names: teachersUnassigned },
            ].map((group) => (
              <div key={group.label} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "18px 20px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 10 }}>{group.label}</div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                  {group.names.map((n) => (
                    <li key={n} style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{n}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety + closing note */}
      <section style={{ background: "var(--paper)", padding: "0 clamp(20px,5vw,64px) clamp(56px,7vw,90px)" }}>
        <Reveal>
          <p style={{ maxWidth: 620, margin: "0 auto", textAlign: "center", fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.7, fontStyle: "italic" }}>
            {CHILDREN_CONVENTION.safetyNote} {CHILDREN_CONVENTION.closingNote}
          </p>
        </Reveal>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,54px)", letterSpacing: "-1.2px", color: "var(--cream)", margin: "0 0 16px", lineHeight: 0.98 }}>
            Bring the whole family.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(245,246,250,.6)", margin: "0 0 32px" }}>
            Questions about the children&apos;s program? Reach out to us.
          </p>
          <Link
            href="/contact"
            className="press-lg"
            style={{ display: "inline-block", background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "17px 34px", borderRadius: 999, textDecoration: "none", boxShadow: "0 14px 30px rgba(200,30,58,.4)" }}
          >
            Contact Us →
          </Link>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
