import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";
import { CalendarPlus, Download, Sun, Moon, Sparkles, Flame } from "lucide-react";
import { specialEvents, weeklyServices, monthlyServices, annualMoments, googleCalUrl, icsDataUri, splitByDate, type ChurchEvent } from "@/lib/events";

export const metadata = {
  title: "Calendar — CAC Salvation Center",
  description:
    "All gatherings of the Salvation Center family — weekly services, prayer lines, and special events. Save any of them to Google, Apple, or Outlook.",
  alternates: { canonical: "/calendar" },
};

const dayPrograms = [
  { icon: Sun, day: "Daily", title: "Prayer Line", time: "5:00 AM", desc: "Begin the day in agreement with the family — dial in from anywhere." },
  { icon: Sparkles, day: "Sunday", title: "Worship Service", time: "10:30 AM ET", desc: "Our main gathering — Spirit-led worship, biblical teaching, communion." },
  { icon: Moon, day: "Wednesday", title: "Bible Study", time: "7:00 PM ET", desc: "Mid-week scriptural teaching to ground the week in the Word. Online." },
  { icon: Flame, day: "Friday", title: "Wakati Itusile", time: "7:00 PM ET", desc: "High-energy Yoruba worship in our mother tongue. Online." },
];

function AddToCalendar({ ev, dark = false }: { ev: ChurchEvent; dark?: boolean }) {
  const ghost = dark
    ? { color: "var(--cream)", border: "1.5px solid rgba(255,247,239,.28)", background: "rgba(255,247,239,.06)" }
    : { color: "var(--ink)", border: "1.5px solid var(--line)", background: "var(--paper)" };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      <a href={googleCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 14, padding: "11px 18px", borderRadius: 999, textDecoration: "none", boxShadow: "0 8px 20px rgba(214,40,40,.3)" }}>
        <CalendarPlus size={16} strokeWidth={2} aria-hidden /> Google
      </a>
      <a href={icsDataUri(ev)} download={`${ev.id}.ics`} className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, padding: "11px 18px", borderRadius: 999, textDecoration: "none", ...ghost }}>
        <Download size={16} strokeWidth={2} aria-hidden /> Apple / Outlook
      </a>
    </div>
  );
}

export default function CalendarPage() {
  const { upcoming: upcomingSpecial } = splitByDate(specialEvents);
  return (
    <main>
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 90px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 620, height: 460, background: "radial-gradient(circle,rgba(232,163,61,.22),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Calendar</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(46px,7vw,98px)", letterSpacing: "-2.2px", color: "#fff", margin: "16px 0", lineHeight: 0.93 }}>
              Every gathering,<br />
              <span style={{ background: "linear-gradient(100deg,#F15F22,#D62828,#E8A33D)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>one calendar.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(255,247,239,.72)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto" }}>
              Weekly services, daily prayer, and the special moments — save any of them to your phone in one tap.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Weekly rhythm */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 40 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Every week</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 0" }}>Our weekly rhythm</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {dayPrograms.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div style={{ height: "100%", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 22, padding: "26px 24px", display: "flex", flexDirection: "column", boxShadow: "0 10px 26px rgba(27,19,14,.06)" }}>
                  <div style={{ display: "grid", placeItems: "center", width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,var(--flame),var(--red))", marginBottom: 16, boxShadow: "0 8px 20px rgba(214,40,40,.28)" }}>
                    <p.icon size={22} strokeWidth={2} color="#fff" aria-hidden />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 6 }}>{p.day}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: "-.3px", color: "var(--ink)", margin: "0 0 4px" }}>{p.title}</h3>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 12 }}>{p.time}</div>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0, flex: 1 }}>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Special events */}
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 40 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Coming Up</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1px", color: "var(--cream)", margin: "12px 0 0" }}>Special gatherings</h2>
          </Reveal>
          {upcomingSpecial.length === 0 ? (
            <Reveal>
              <p style={{ fontSize: 16, color: "rgba(255,247,239,.6)", lineHeight: 1.7 }}>
                No special events on the calendar right now — check back soon, or <Link href="/events" style={{ color: "var(--gold)", fontWeight: 700, textDecoration: "none" }}>browse past gatherings</Link>.
              </p>
            </Reveal>
          ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {upcomingSpecial.map((ev, i) => (
              <Reveal key={ev.id} delay={i * 90}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,36px)", alignItems: "center", background: "rgba(255,247,239,.05)", borderRadius: 24, padding: "clamp(22px,3vw,32px)", border: "1px solid rgba(255,247,239,.1)" }}>
                  <div style={{ flexShrink: 0, width: 104, height: 104, borderRadius: 20, background: "linear-gradient(150deg,var(--flame),var(--red))", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: 1, boxShadow: "0 14px 30px rgba(214,40,40,.3)" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "1.5px" }}>{ev.month}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 44 }}>{ev.day}</span>
                  </div>
                  <div style={{ flex: "1 1 280px", minWidth: 0 }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,2.6vw,30px)", letterSpacing: "-.5px", color: "var(--cream)", margin: "0 0 6px" }}>{ev.title}</h3>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", marginBottom: 10 }}>{ev.dateLabel} · {ev.timeLabel}</div>
                    <p style={{ fontSize: 15.5, color: "rgba(255,247,239,.7)", lineHeight: 1.65, margin: "0 0 18px" }}>{ev.desc}</p>
                    <AddToCalendar ev={ev} dark />
                    {ev.href && (
                      <Link href={ev.href} className="press" style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 16, fontSize: 14, fontWeight: 700, color: "var(--gold)", textDecoration: "none" }}>
                        See full details <span aria-hidden style={{ fontSize: 16 }}>→</span>
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Weekly services raw list */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 36 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Save the rhythm</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 0" }}>Subscribe to weekly services</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {weeklyServices.map((ev, i) => (
              <Reveal key={ev.id} delay={i * 80}>
                <div style={{ height: "100%", background: "var(--paper)", borderRadius: 22, padding: "26px 24px", border: "1px solid var(--line)", display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>{ev.dateLabel}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: "-.3px", color: "var(--ink)", margin: "0 0 4px" }}>{ev.title}</h3>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-soft)", marginBottom: 14 }}>{ev.timeLabel}</div>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, margin: "0 0 18px", flex: 1 }}>{ev.desc}</p>
                  <AddToCalendar ev={ev} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly rhythm */}
      <section style={{ background: "var(--paper)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 36 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Every month</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 0" }}>The monthly rhythm</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {monthlyServices.map((ev, i) => (
              <Reveal key={ev.id} delay={i * 80}>
                <div style={{ height: "100%", background: "var(--cream-2)", borderRadius: 22, padding: "26px 24px", border: "1px solid var(--line)", display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>{ev.dateLabel}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: "-.3px", color: "var(--ink)", margin: "0 0 4px" }}>{ev.title}</h3>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-soft)", marginBottom: 14 }}>{ev.timeLabel}</div>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, margin: "0 0 18px", flex: 1 }}>{ev.desc}</p>
                  <AddToCalendar ev={ev} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Annual moments */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px) clamp(70px,9vw,110px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 36 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Mark your year</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 10px" }}>Annual moments</h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, margin: 0, maxWidth: 620 }}>The yearly celebrations that mark the life of the family. Firm dates are announced from the pulpit and on the homepage as they approach.</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {annualMoments.map((m, i) => (
              <Reveal key={m.id} delay={(i % 3) * 70}>
                <div style={{ height: "100%", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "22px 22px 24px", boxShadow: "0 6px 18px rgba(27,19,14,.04)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>{m.when}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, letterSpacing: "-.3px", color: "var(--ink)", margin: "0 0 8px", lineHeight: 1.2 }}>{m.title}</h3>
                  <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
