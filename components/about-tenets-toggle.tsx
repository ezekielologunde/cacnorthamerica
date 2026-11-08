"use client";

import { useRef, useState } from "react";

/* Mobile-only expander for the thirteen tenets. Tenets 5-13 are hidden by CSS
   at phone width until the section carries data-open="true". */
export function TenetsToggle() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  function toggle() {
    const next = !open;
    setOpen(next);
    ref.current?.closest("section")?.setAttribute("data-open", String(next));
  }

  return (
    <button
      ref={ref}
      type="button"
      className="ap-tenet-toggle"
      aria-expanded={open}
      aria-controls="tenets-grid"
      onClick={toggle}
      style={{ alignItems: "center", justifyContent: "center", width: "100%", marginTop: 20, minHeight: 48, borderRadius: 999, background: "var(--ink)", color: "#fff", fontWeight: 700, fontSize: 16, border: 0, cursor: "pointer" }}
    >
      {open ? "Show fewer" : "Show all 13 tenets"}
    </button>
  );
}
