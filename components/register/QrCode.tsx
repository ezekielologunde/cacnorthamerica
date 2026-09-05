// Deliberately a plain (non-async) component -- an async Server Component
// nested inside a list breaks the client reconciler ("<QrCode> is an async
// Client Component"), the same issue Convention's own version of this
// component hit. The caller (an async Server Component itself) awaits
// lib/qr.ts's renderQrCodeSvg() up front and passes the plain string down
// instead.
export function QrCode({ svg, label }: { svg: string; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{
        display: "inline-block",
        flexShrink: 0,
        overflow: "hidden",
        borderRadius: 12,
        border: "1px solid var(--line)",
        background: "#fff",
        padding: 6,
      }}
      // qrcode's own SVG output, not user input -- see lib/qr.ts.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
