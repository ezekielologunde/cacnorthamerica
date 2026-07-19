import Link from "next/link";

export function WatchwordArchive({ dark = false }: { dark?: boolean }) {
  const line = dark ? "rgba(253,200,65,.4)" : "var(--line)";
  const link = dark ? "var(--gold)" : "var(--red)";

  return (
    <div style={{ marginTop: 26 }}>
      <Link
        href="/watchwords"
        className="press"
        style={{
          background: "transparent", border: `1px solid ${line}`, borderRadius: 999,
          padding: "9px 20px", fontSize: 13, fontWeight: 700, letterSpacing: ".3px",
          color: link, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
          textDecoration: "none",
        }}
      >
        Watchwords since 1989
        <span aria-hidden style={{ fontSize: 15 }}>→</span>
      </Link>
    </div>
  );
}
