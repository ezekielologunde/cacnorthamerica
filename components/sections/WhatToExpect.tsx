import { Reveal } from "@/components/ui/Reveal";

const services = [
  {
    day: "Sunday",
    name: "Sunday Worship",
    time: "10:30 AM ET",
    desc: "Spirit-led worship, biblical teaching, and community. Our flagship gathering — onsite and online.",
    mode: "Onsite & Online",
    dark: true,
  },
  {
    day: "Wednesday",
    name: "Bible Study",
    time: "7:00 PM ET",
    desc: "Deep-dive scriptural teaching to ground your week in the Word. Join online from anywhere.",
    mode: "Online",
    dark: false,
  },
  {
    day: "Friday",
    name: "Wakati Itusile",
    time: "7:00 PM ET",
    desc: "High-energy Yoruba worship service — a Spirit-filled hour in our mother tongue.",
    mode: "Online",
    dark: false,
  },
];

export function WhatToExpect() {
  return (
    <section style={{ background: "var(--cream)", padding: "100px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>
            How We Gather
          </span>
        </Reveal>
        <Reveal delay={80} style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,5vw,68px)", letterSpacing: "-1.5px", color: "var(--ink)", margin: 0, lineHeight: .95 }}>
            Weekly Services
          </h2>
        </Reveal>

        <div className="r3" style={{ gap: 20 }}>
          {services.map((s, i) => (
            <Reveal key={s.name} delay={i * 100}>
              <div style={{
                borderRadius: 24, padding: "36px 32px",
                background: s.dark ? "var(--ink)" : "var(--paper)",
                boxShadow: s.dark ? "0 24px 50px rgba(27,19,14,.28)" : "0 10px 26px rgba(27,19,14,.06)",
                border: s.dark ? "none" : "1px solid var(--line)",
                height: "100%",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24,
                  background: s.dark ? "rgba(255,247,239,.1)" : "var(--cream-2)",
                  padding: "6px 14px", borderRadius: 999,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.dark ? "var(--gold)" : "var(--red)", letterSpacing: "1px", textTransform: "uppercase" }}>{s.day}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: s.dark ? "var(--cream)" : "var(--ink)", letterSpacing: "-.4px", margin: "0 0 6px" }}>
                  {s.name}
                </h3>
                <div style={{ fontWeight: 700, fontSize: 15, color: s.dark ? "var(--gold)" : "var(--red)", marginBottom: 18 }}>{s.time}</div>
                <p style={{ fontSize: 15, color: s.dark ? "rgba(255,247,239,.65)" : "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>
                  {s.desc}
                </p>
                <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dark ? "var(--gold)" : "var(--red)", display: "inline-block" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: s.dark ? "rgba(255,247,239,.5)" : "var(--ink-soft)" }}>
                    {s.mode}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
