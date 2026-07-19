"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import type { ChurchEvent } from "@/lib/events";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function parseYMD(local: string) {
  return { y: +local.slice(0, 4), m: +local.slice(4, 6), d: +local.slice(6, 8) };
}
function dayKey(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Builds a map of every calendar day (within a generous bound) an event
 *  touches, by walking its date range day-by-day — handles multi-day events
 *  (e.g. a 6-day Convention or a 10-day pilgrimage) so they appear on every
 *  day they span, not just the start date. */
function buildEventsByDay(events: ChurchEvent[]): Map<string, ChurchEvent[]> {
  const map = new Map<string, ChurchEvent[]>();
  for (const ev of events) {
    const start = parseYMD(ev.startLocal);
    const end = parseYMD(ev.endLocal || ev.startLocal);
    let cursor = new Date(Date.UTC(start.y, start.m - 1, start.d));
    const last = new Date(Date.UTC(end.y, end.m - 1, end.d));
    let guard = 0;
    while (cursor.getTime() <= last.getTime() && guard < 60) {
      const key = dayKey(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, cursor.getUTCDate());
      const list = map.get(key) ?? [];
      list.push(ev);
      map.set(key, list);
      cursor = new Date(cursor.getTime() + 86400000);
      guard++;
    }
  }
  return map;
}

export function MonthCalendar({ events }: { events: ChurchEvent[] }) {
  const now = useMemo(() => new Date(), []);
  const soonest = useMemo(() => {
    const sorted = [...events].sort((a, b) => a.startLocal.localeCompare(b.startLocal));
    const upcoming = sorted.find((e) => e.startLocal.slice(0, 8) >= `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`);
    return upcoming ?? sorted[sorted.length - 1] ?? null;
  }, [events, now]);

  const initial = soonest ? parseYMD(soonest.startLocal) : { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
  const [viewYear, setViewYear] = useState(initial.y);
  const [viewMonth, setViewMonth] = useState(initial.m); // 1-indexed
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const eventsByDay = useMemo(() => buildEventsByDay(events), [events]);

  const todayKey = dayKey(now.getFullYear(), now.getMonth() + 1, now.getDate());

  function goMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setViewMonth(m);
    setViewYear(y);
    setSelectedKey(null);
  }

  const grid = useMemo(() => {
    const firstOfMonth = new Date(Date.UTC(viewYear, viewMonth - 1, 1));
    const startOffset = firstOfMonth.getUTCDay(); // 0=Sun
    const daysInMonth = new Date(Date.UTC(viewYear, viewMonth, 0)).getUTCDate();
    const daysInPrevMonth = new Date(Date.UTC(viewYear, viewMonth - 1, 0)).getUTCDate();

    const cells: { y: number; m: number; d: number; inMonth: boolean }[] = [];
    for (let i = startOffset - 1; i >= 0; i--) {
      const m = viewMonth === 1 ? 12 : viewMonth - 1;
      const y = viewMonth === 1 ? viewYear - 1 : viewYear;
      cells.push({ y, m, d: daysInPrevMonth - i, inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) cells.push({ y: viewYear, m: viewMonth, d, inMonth: true });
    while (cells.length % 7 !== 0 || cells.length < 42) {
      const last = cells[cells.length - 1];
      const nextDate = new Date(Date.UTC(last.y, last.m - 1, last.d + 1));
      cells.push({ y: nextDate.getUTCFullYear(), m: nextDate.getUTCMonth() + 1, d: nextDate.getUTCDate(), inMonth: false });
      if (cells.length >= 42) break;
    }
    return cells;
  }, [viewYear, viewMonth]);

  const selectedEvents = selectedKey ? (eventsByDay.get(selectedKey) ?? []) : [];

  return (
    <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 28, padding: "clamp(20px,3vw,32px)", boxShadow: "0 20px 50px rgba(18,20,30,.08)" }}>
      {/* Month header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CalendarDays size={20} strokeWidth={2} color="var(--red)" aria-hidden />
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.4vw,26px)", letterSpacing: "-.4px", color: "var(--ink)", margin: 0 }}>
            {MONTH_NAMES[viewMonth - 1]} {viewYear}
          </h3>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => goMonth(-1)} aria-label="Previous month" className="press"
            style={{ width: 38, height: 38, borderRadius: 999, border: "1.5px solid var(--line)", background: "var(--cream)", display: "grid", placeItems: "center", cursor: "pointer" }}>
            <ChevronLeft size={17} strokeWidth={2.5} color="var(--ink)" aria-hidden />
          </button>
          <button type="button" onClick={() => { setViewYear(now.getFullYear()); setViewMonth(now.getMonth() + 1); setSelectedKey(null); }}
            className="press" style={{ padding: "0 16px", height: 38, borderRadius: 999, border: "1.5px solid var(--line)", background: "var(--cream)", fontSize: 13, fontWeight: 700, color: "var(--ink)", cursor: "pointer" }}>
            Today
          </button>
          <button type="button" onClick={() => goMonth(1)} aria-label="Next month" className="press"
            style={{ width: 38, height: 38, borderRadius: 999, border: "1.5px solid var(--line)", background: "var(--cream)", display: "grid", placeItems: "center", cursor: "pointer" }}>
            <ChevronRight size={17} strokeWidth={2.5} color="var(--ink)" aria-hidden />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 6 }}>
        {WEEKDAYS.map((w) => (
          <div key={w} style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--ink-soft)", textAlign: "center", padding: "4px 0" }}>
            {w}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
        {grid.map((c, i) => {
          const key = dayKey(c.y, c.m, c.d);
          const dayEvents = eventsByDay.get(key) ?? [];
          const hasEvents = dayEvents.length > 0;
          const isToday = key === todayKey;
          const isSelected = key === selectedKey;
          return (
            <button
              key={i}
              type="button"
              onClick={() => hasEvents && setSelectedKey(isSelected ? null : key)}
              disabled={!hasEvents}
              aria-label={hasEvents ? `${dayEvents.length} event(s) on ${MONTH_NAMES[c.m - 1]} ${c.d}` : undefined}
              style={{
                aspectRatio: "1 / 1", minHeight: 44,
                borderRadius: 12, border: isSelected ? "2px solid var(--red)" : "1px solid transparent",
                background: isSelected ? "rgba(200,30,58,.1)" : hasEvents ? "var(--cream-2)" : "transparent",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
                cursor: hasEvents ? "pointer" : "default",
                opacity: c.inMonth ? 1 : 0.32,
                padding: 0,
              }}
            >
              <span style={{
                fontSize: 13.5, fontWeight: isToday ? 800 : 600,
                color: isToday ? "var(--red)" : "var(--ink)",
              }}>
                {c.d}
              </span>
              {hasEvents && (
                <span style={{ display: "flex", gap: 2 }}>
                  {dayEvents.slice(0, 3).map((_, di) => (
                    <span key={di} aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--red)" }} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selectedKey && selectedEvents.length > 0 && (
        <div style={{ marginTop: 22, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 12 }}>
          {selectedEvents.map((ev) => (
            <div key={ev.id} style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "var(--cream)", borderRadius: 16, padding: "16px 18px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--ink)", marginBottom: 3 }}>{ev.title}</div>
                <div style={{ fontSize: 13, color: "var(--red)", fontWeight: 700, marginBottom: 6 }}>{ev.dateLabel} · {ev.timeLabel}</div>
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>{ev.desc}</p>
              </div>
              {ev.href && (
                <Link href={ev.href} className="press" style={{ flexShrink: 0, fontSize: 13, fontWeight: 700, color: "var(--red)", textDecoration: "none", whiteSpace: "nowrap" }}>
                  Details →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
      {!selectedKey && (
        <p style={{ marginTop: 18, fontSize: 13, color: "var(--ink-soft)", textAlign: "center" }}>
          Tap a highlighted day to see what&apos;s happening.
        </p>
      )}
    </div>
  );
}
