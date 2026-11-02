import Link from "next/link";

export default function NotFound() {
  return (
    <div role="alert" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", textAlign: "center",
      background: "var(--cream)", padding: "40px 24px",
    }}>
      <div className="err-404 err-rise" role="img" aria-label="Error 404">
        <span aria-hidden>4</span>
        <span className="err-compass" aria-hidden />
        <span aria-hidden>4</span>
      </div>
      <h1 className="err-rise err-d1" style={{
        fontFamily: "var(--font-display)", fontWeight: 800,
        fontSize: "clamp(36px,5vw,72px)", letterSpacing: "-2px",
        color: "var(--ink)", margin: "0 0 16px", lineHeight: 0.95,
      }}>
        Page not found
      </h1>
      <p className="err-rise err-d2" style={{
        fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7,
        maxWidth: 420, margin: "0 auto 36px",
      }}>
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="err-rise err-d3 press"
        style={{
          padding: "13px 32px", borderRadius: 999,
          background: "var(--red)", color: "#fff",
          fontWeight: 700, fontSize: 15, textDecoration: "none",
          fontFamily: "var(--font-body)",
          boxShadow: "0 8px 24px rgba(200,30,58,.35)",
          display: "inline-block",
        }}
      >
        Back to home
      </Link>
    </div>
  );
}
