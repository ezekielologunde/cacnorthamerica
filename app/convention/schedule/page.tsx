import { ConventionNav } from "@/components/convention/ConventionNav";
import { ConventionFooter } from "@/components/convention/ConventionFooter";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";
import { createServiceClient } from "@/lib/supabase/server";
import { currentOrNextConvention, dateRangeLabel, CONVENTION_VENUE_SHORT } from "@/lib/conventions";

export const metadata = {
  title: "Schedule — CACNA Annual Convention",
  description: "The day-by-day schedule for the CACNA Annual Convention — ministers' sessions, breakout tracks, and family programming.",
  alternates: { canonical: "/convention/schedule" },
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12}${period}` : `${hour12}:${String(m).padStart(2, "0")}${period}`;
}

function fmtDayLabel(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${DAY_NAMES[date.getUTCDay()]}, ${monthNames[m - 1]} ${d}`;
}

export default async function ConventionSchedulePage() {
  const cy = currentOrNextConvention();
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("convention_schedule_sessions")
    .select("*")
    .order("day_date", { ascending: true })
    .order("sort_order", { ascending: true });

  const rows = data ?? [];
  const years = Array.from(new Set(rows.map((r) => r.year))).sort((a, b) => b - a);
  const scheduleYear = years[0]; // most recent seeded schedule (real historical data)
  const isCurrentYear = scheduleYear === cy.year;

  const byDay = new Map<string, typeof rows>();
  for (const r of rows.filter((r) => r.year === scheduleYear)) {
    if (!byDay.has(r.day_date)) byDay.set(r.day_date, []);
    byDay.get(r.day_date)!.push(r);
  }
  const days = Array.from(byDay.entries()).sort(([a], [b]) => a.localeCompare(b));

  return (
    <main>
      <ConventionNav />
      <ConventionPageHero
        eyebrow="Schedule"
        title="Convention Schedule"
        subhead={`${dateRangeLabel(cy)} · ${CONVENTION_VENUE_SHORT}`}
      />

      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          {!isCurrentYear && scheduleYear ? (
            <Reveal>
              <div style={{ background: "rgba(253,200,65,.14)", border: "1px solid rgba(253,200,65,.3)", borderRadius: 16, padding: "18px 22px", marginBottom: 32 }}>
                <p style={{ margin: 0, fontSize: 14.5, color: "var(--ink)", lineHeight: 1.6 }}>
                  <strong>{cy.year} schedule details will be posted closer to the convention.</strong> Below is the real {scheduleYear} schedule as a reference for what to expect.
                </p>
              </div>
            </Reveal>
          ) : null}

          {days.length === 0 ? (
            <Reveal>
              <p style={{ fontSize: 15, color: "var(--ink-soft)" }}>Schedule details will be posted closer to the convention.</p>
            </Reveal>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {days.map(([date, sessions], di) => (
                <Reveal key={date} delay={di * 60}>
                  <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden" }}>
                    <div style={{ padding: "16px 22px", background: "var(--cream-2)", borderBottom: "1px solid var(--line)" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)" }}>
                        {fmtDayLabel(date)}
                      </div>
                    </div>
                    <div>
                      {sessions.map((s, i) => (
                        <div
                          key={s.id}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "112px 1fr",
                            gap: 14,
                            padding: "12px 22px",
                            borderTop: i === 0 ? "none" : "1px solid var(--line)",
                          }}
                        >
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--red-deep)", whiteSpace: "nowrap" }}>
                            {fmtTime(s.starts_at)}{s.ends_at ? `–${fmtTime(s.ends_at)}` : ""}
                          </div>
                          <div>
                            <div style={{ fontSize: 14.5, color: "var(--ink)", fontWeight: 600, lineHeight: 1.5 }}>{s.title}</div>
                            {s.minister_name ? (
                              <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>
                                {s.minister_name}{s.minister_title ? ` — ${s.minister_title}` : ""}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <ConventionFooter />
    </main>
  );
}
