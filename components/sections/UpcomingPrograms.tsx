import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { specialEvents, splitByDate } from "@/lib/events";

export function UpcomingPrograms() {
  const { upcoming } = splitByDate(specialEvents);
  const events = upcoming.slice(0, 4);

  if (events.length === 0) return null;

  return (
    <section style={{ background: "var(--paper)", padding: "clamp(70px,9vw,120px) clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal style={{ marginBottom: 46, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>What&apos;s Next</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,5vw,68px)", letterSpacing: "-1.5px", margin: "12px 0 0", lineHeight: 1 }}>Upcoming Programs</h2>
          </div>
          <Link href="/calendar" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, color: "var(--red)", textDecoration: "none" }}>
            Full calendar <span aria-hidden style={{ fontSize: 17 }}>→</span>
          </Link>
        </Reveal>

        <div className="r2c" style={{ gap: 20 }}>
          {events.map((ev, i) => (
            <Reveal key={ev.id} delay={i * 90}>
              <Link href={ev.href ?? "/calendar"} className="card-lift" style={{
                textDecoration: "none", color: "inherit", background: "var(--cream)",
                borderRadius: 22, padding: 26, display: "flex", gap: 20, alignItems: "flex-start",
                boxShadow: "0 10px 26px rgba(18,20,30,.06)", height: "100%",
              }}>
                <div style={{
                  flexShrink: 0, width: 64, height: 64, borderRadius: 16,
                  background: "linear-gradient(150deg,var(--flame),var(--red))",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  color: "#fff", boxShadow: "0 10px 22px rgba(200,30,58,.3)",
                }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "1px" }}>{ev.month}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, lineHeight: 1 }}>{ev.day}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, letterSpacing: "-.2px", lineHeight: 1.25, margin: "0 0 6px" }}>{ev.title}</h3>
                  <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5, margin: "0 0 8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ev.desc}</p>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--red)" }}>{ev.dateLabel}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
