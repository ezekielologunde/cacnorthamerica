"use client";

import { useState, useTransition } from "react";
import { setRegistrationStatus } from "@/app/admin/(protected)/convention-registrations/actions";

const STATUSES = ["pending", "paid", "failed", "refunded"] as const;

export default function ConventionStatusSelect({ id, status }: { id: string; status: string }) {
  const [value, setValue] = useState(status);
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={value}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        setValue(next);
        startTransition(() => {
          setRegistrationStatus(id, next).catch(() => setValue(status));
        });
      }}
      style={{
        padding: "5px 10px", borderRadius: 8, border: "1px solid var(--line)",
        fontSize: 13, fontWeight: 600, color: "var(--ink)", background: "white",
        cursor: isPending ? "not-allowed" : "pointer", textTransform: "capitalize",
      }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
