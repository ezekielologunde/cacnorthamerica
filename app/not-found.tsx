import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", textAlign: "center",
      background: "var(--cream)", padding: "40px 24px",
    }}>
      <p style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "3px",
        textTransform: "uppercase", color: "var(--red)", marginBottom: 16,
      }}>
        404
      </p>
      <h1 style={{
        fontFamily: "var(--font-display)", fontWeight: 800,
        fontSize: "clamp(36px,5vw,72px)", letterSpacing: "-2px",
        color: "var(--ink)", margin: "0 0 16px", lineHeight: 0.95,
      }}>
        Page not found
      </h1>
      <p style={{
        fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7,
        maxWidth: 420, margin: "0 auto 36px",
      }}>
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        style={{
          padding: "13px 32px", borderRadius: 999,
          background: "var(--red)", color: "#fff",
          fontWeight: 700, fontSize: 15, textDecoration: "none",
          fontFamily: "var(--font-body)",
          boxShadow: "0 8px 24px rgba(214,40,40,.35)",
          display: "inline-block",
        }}
      >
        Back to home
      </Link>
    </div>
  );
}
