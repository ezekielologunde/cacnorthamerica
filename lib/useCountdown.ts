"use client";
import { useState, useEffect } from "react";

// CACNA is a regional body, not a single congregation with weekly service
// times — the hero countdown targets the next major CACNA-wide event
// instead (the Annual Convention) rather than a recurring Sunday service.
const NEXT_EVENT = { label: "2026 CACNA Annual Convention", target: new Date(2026, 6, 13, 9, 0, 0) };

export interface Countdown {
  label: string;
  countdown: string;
}

export function useCountdown(): Countdown {
  const [state, setState] = useState<Countdown>({ label: NEXT_EVENT.label, countdown: "—" });

  useEffect(() => {
    const update = () => {
      const ms = NEXT_EVENT.target.getTime() - Date.now();
      if (ms <= 0) { setState({ label: NEXT_EVENT.label, countdown: "Happening now!" }); return; }
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms % 86400000) / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setState({ label: NEXT_EVENT.label, countdown: `${d}d ${h}h ${m}m ${s}s` });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return state;
}
