"use client";

import { useState } from "react";
import { STAFF_DIRECTORY } from "@/lib/staff-directory";

export default function ForwardToStaff({ subject, body }: { subject: string; body: string }) {
  const [email, setEmail] = useState(STAFF_DIRECTORY[0].email);
  const href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
      <select
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Forward to department"
        style={{
          fontFamily: "inherit",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--ink-soft)",
          border: "1px solid rgba(27,19,14,0.15)",
          borderRadius: 6,
          padding: "5px 8px",
          background: "white",
          cursor: "pointer",
          maxWidth: 150,
        }}
      >
        {STAFF_DIRECTORY.map((s) => (
          <option key={s.email} value={s.email}>{s.label}</option>
        ))}
      </select>
      <a
        href={href}
        style={{
          background: "transparent",
          color: "var(--ink-soft)",
          border: "1px solid rgba(27,19,14,0.15)",
          borderRadius: 6,
          padding: "5px 12px",
          fontSize: 12,
          fontWeight: 600,
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
      >
        Forward
      </a>
    </div>
  );
}
