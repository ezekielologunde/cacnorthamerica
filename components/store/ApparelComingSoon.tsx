import Link from "next/link";
import { Flower2, Shirt, Sparkles, type LucideIcon } from "lucide-react";

const LINES: { Icon: LucideIcon; name: string; blurb: string; tint: string }[] = [
  { Icon: Shirt, name: "Convention", blurb: "Tees and polos for the annual convention.", tint: "#C81E3A" },
  { Icon: Flower2, name: "Good Women", blurb: "Apparel and totes for the Good Women Association.", tint: "#6D1ED4" },
  { Icon: Sparkles, name: "Youth & Young Adults", blurb: "Tees and hoodies for the youth ministry.", tint: "#0F766E" },
];

// No apparel is listed here yet. Rather than show invented products, the
// three planned lines get an honest placeholder until real items and photos exist.
export function ApparelComingSoon() {
  return (
    <div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
        {LINES.map(({ Icon, name, blurb, tint }) => (
          <li key={name} style={{ background: "var(--paper)", border: "1px dashed var(--line)", borderRadius: 20, padding: "22px 22px 24px" }}>
            <span aria-hidden style={{ width: 46, height: 46, borderRadius: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", background: `color-mix(in srgb, ${tint} 12%, transparent)`, color: tint }}>
              <Icon size={23} strokeWidth={2.1} />
            </span>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", margin: "16px 0 6px" }}>{name}</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-soft)" }}>{blurb}</p>
            <p style={{ margin: "14px 0 0", fontSize: 13, fontWeight: 700, color: tint }}>Coming soon</p>
          </li>
        ))}
      </ul>
      <p style={{ margin: "22px 0 0", fontSize: 14.5, color: "var(--ink-soft)" }}>
        We list apparel here once real items and photos are ready.{" "}
        <Link href="/contact" style={{ color: "var(--red)", fontWeight: 700 }}>Ask about apparel</Link>
      </p>
    </div>
  );
}
