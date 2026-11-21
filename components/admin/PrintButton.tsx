"use client";

export default function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print"
      style={{
        minHeight: 44, padding: "0 18px", fontSize: 15, fontWeight: 700, fontFamily: "inherit",
        background: "var(--ink)", color: "white", border: "none", borderRadius: 8, cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
