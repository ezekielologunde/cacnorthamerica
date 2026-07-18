"use client";

import { useEffect, useState } from "react";

function getParts(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function Countdown({ target }: { target: string }) {
  const [parts, setParts] = useState(() => getParts(target));

  useEffect(() => {
    const id = setInterval(() => setParts(getParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!parts) return null;

  return (
    <div className="flex gap-3 text-cream-100">
      {[
        { label: "Days", value: parts.days },
        { label: "Hrs", value: parts.hours },
        { label: "Min", value: parts.minutes },
        { label: "Sec", value: parts.seconds },
      ].map((p) => (
        <div
          key={p.label}
          className="flex flex-col items-center rounded-lg bg-cream-100/10 px-3 py-2 min-w-16"
        >
          <span className="font-serif-display text-xl tabular-nums">
            {String(p.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-cream-100/70">
            {p.label}
          </span>
        </div>
      ))}
    </div>
  );
}
