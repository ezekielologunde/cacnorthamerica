"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled error:", error.digest ?? error.name);
  }, [error]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", textAlign: "center",
      background: "var(--cream)", padding: "40px 24px",
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "linear-gradient(140deg,var(--flame),var(--red))",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32, marginBottom: 28,
        boxShadow: "0 12px 32px rgba(214,40,40,.30)",
      }}>
        ✕
      </div>
      <h1 style={{
        fontFamily: "var(--font-display)", fontWeight: 800,
        fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-1px",
        color: "var(--ink)", margin: "0 0 12px",
      }}>
        Something went wrong
      </h1>
      <p style={{
        fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7,
        maxWidth: 420, margin: "0 auto 32px",
      }}>
        We&apos;re sorry — an unexpected error occurred. Please try again, or contact us if the problem continues.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{
            padding: "13px 28px", borderRadius: 999,
            background: "var(--red)", color: "#fff",
            fontWeight: 700, fontSize: 15, border: "none",
            cursor: "pointer", fontFamily: "var(--font-body)",
            boxShadow: "0 8px 24px rgba(214,40,40,.35)",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            padding: "13px 28px", borderRadius: 999,
            background: "transparent", color: "var(--ink)",
            fontWeight: 700, fontSize: 15,
            border: "1.5px solid var(--line)",
            textDecoration: "none", fontFamily: "var(--font-body)",
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
