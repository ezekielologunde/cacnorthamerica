import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: "40px 24px",
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#dc2626", margin: "0 0 12px" }}>
        404
      </p>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1b130e", margin: "0 0 10px" }}>
        Page not found
      </h1>
      <p style={{ fontSize: 14, color: "var(--ink-soft)", maxWidth: 340, margin: "0 auto 28px", lineHeight: 1.6 }}>
        This admin page doesn&apos;t exist. It may have been moved or deleted.
      </p>
      <Link
        href="/admin"
        style={{
          padding: "9px 20px", borderRadius: 8,
          background: "#1b130e", color: "#fff",
          fontWeight: 600, fontSize: 13,
          textDecoration: "none", fontFamily: "inherit",
          display: "inline-block",
        }}
      >
        Back to dashboard
      </Link>
    </div>
  );
}
