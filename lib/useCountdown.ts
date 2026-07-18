"use client";
import { useState, useEffect } from "react";

interface Service {
  day: number; // 0 = Sunday … 6 = Saturday
  hour: number;
  min: number;
  label: string;
}

// Weekly gatherings (local time). Soonest upcoming one wins.
const SERVICES: Service[] = [
  { day: 0, hour: 10, min: 30, label: "Sunday Worship" },
  { day: 3, hour: 19, min: 0, label: "Bible Study" },
  { day: 5, hour: 19, min: 0, label: "Wakati Itusile" },
];

function nextService(): { label: string; target: Date } {
  const now = new Date();
  let best: { label: string; target: Date } | null = null;
  for (const s of SERVICES) {
    const t = new Date(now);
    t.setHours(s.hour, s.min, 0, 0);
    let diff = (s.day - t.getDay() + 7) % 7;
    if (diff === 0 && now >= t) diff = 7;
    t.setDate(t.getDate() + diff);
    if (!best || t < best.target) best = { label: s.label, target: t };
  }
  return best!;
}

export interface Countdown {
  label: string;
  countdown: string;
}

export function useCountdown(): Countdown {
  const [state, setState] = useState<Countdown>({ label: "Sunday Worship", countdown: "—" });

  useEffect(() => {
    const update = () => {
      const { label, target } = nextService();
      const ms = target.getTime() - Date.now();
      if (ms <= 0) { setState({ label, countdown: "Starting now!" }); return; }
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms % 86400000) / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setState({ label, countdown: `${d}d ${h}h ${m}m ${s}s` });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return state;
}
