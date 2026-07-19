import { Reveal } from "@/components/ui/Reveal";
import type { ScheduleSession } from "@/lib/convention/types";

export function AgendaTable({ sessions }: { sessions: ScheduleSession[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {sessions.map((s, si) => (
        <Reveal key={`${s.dayLabel}-${s.timeRange}-${si}`} delay={si * 60}>
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", background: "var(--cream-2)", borderBottom: "1px solid var(--line)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)" }}>
                {s.dayLabel}
              </div>
              {s.timeRange ? <div style={{ fontSize: 14.5, color: "var(--ink-soft)", marginTop: 2 }}>{s.timeRange}</div> : null}
            </div>
            <div style={{ padding: "6px 0" }}>
              {s.agenda.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: item.time ? "112px 1fr" : "1fr",
                    gap: 14,
                    padding: "12px 22px",
                    borderTop: i === 0 ? "none" : "1px solid var(--line)",
                  }}
                >
                  {item.time ? (
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--red-deep)", whiteSpace: "nowrap" }}>{item.time}</div>
                  ) : null}
                  <div>
                    <div style={{ fontSize: 14.5, color: "var(--ink)", fontWeight: 600, lineHeight: 1.5 }}>{item.event}</div>
                    {item.speaker ? (
                      <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>{item.speaker}</div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
