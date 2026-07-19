"use client";
import { useState, useEffect } from "react";
import { currentOrNextConvention } from "@/lib/conventions";

// CACNA is a regional body, not a single congregation with weekly service
// times — the hero countdown targets the next major CACNA-wide event
// instead (the Annual Convention) rather than a recurring Sunday service.
// Pulled from lib/conventions.ts so this rolls to the next confirmed year
// automatically once the current one passes, instead of going stale.
const cy = currentOrNextConvention();
const NEXT_EVENT = {
  label: `${cy.year} CACNA Annual Convention`,
  target: new Date(`${cy.startIso}T09:00:00-04:00`),
};

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
