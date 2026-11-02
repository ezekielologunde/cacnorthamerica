import Link from "next/link";

/** Strip shown under the nav on an event page whose date has passed. */
export function PastEventBanner({
  message = "This event has passed — page kept as an archive.",
  link = { href: "/calendar", label: "See upcoming events →" },
}: {
  message?: string;
  link?: { href: string; label: string } | null;
}) {
  return (
    <div role="status" style={{ background: "#2c2825", padding: "13px clamp(20px,5vw,64px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px 20px", fontSize: 14, fontWeight: 600, color: "rgba(245,246,250,.7)" }}>
      <span>{message}</span>
      {link && (
        <Link href={link.href} style={{ color: "var(--gold)", fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>{link.label}</Link>
      )}
    </div>
  );
}
