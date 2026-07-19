import { STAFF_EMAIL } from "@/lib/staff-directory";

export default function ForwardToStaff({ subject, body }: { subject: string; body: string }) {
  const href = `mailto:${STAFF_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <a
      href={href}
      style={{
        background: "transparent",
        color: "var(--ink-soft)",
        border: "1px solid rgba(18,20,30,0.15)",
        borderRadius: 6,
        padding: "5px 12px",
        fontSize: 12,
        fontWeight: 600,
        textDecoration: "none",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      Forward
    </a>
  );
}
