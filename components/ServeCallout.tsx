import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, HandHeart } from "lucide-react";
import { IconBadge } from "@/components/ui/IconBadge";

/** Set to false to hide every ServeCallout at once. To remove it for good,
 *  delete this file and its one-line uses (blog/[slug]/page.tsx and the two
 *  convention register pages). */
export const SERVE_CALLOUT_ENABLED = true;

/** A quiet in-site card inviting readers to serve at the convention; links
 *  to /serve. Server component, no client JS. */
export function ServeCallout({ style }: { style?: CSSProperties }) {
  if (!SERVE_CALLOUT_ENABLED) return null;
  return (
    <aside
      aria-label="Serve at the Convention"
      style={{
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 18,
        padding: "20px 22px", ...style,
      }}
    >
      <IconBadge icon={HandHeart} size={48} iconSize={22} bg="var(--paper)" />
      <div style={{ flex: "1 1 220px", minWidth: 0 }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", margin: "0 0 4px", lineHeight: 1.2 }}>
          Serve at the Convention
        </p>
        <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.55, margin: 0 }}>
          Ushers, choir, hospitality, care and more. Find a team that fits you and sign up in a minute.
        </p>
      </div>
      <Link href="/serve" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44, padding: "0 18px", borderRadius: 999, border: "1.5px solid var(--line)", background: "var(--paper)", color: "var(--ink)", fontWeight: 700, fontSize: 14.5, textDecoration: "none", whiteSpace: "nowrap" }}>
        See the teams <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
      </Link>
    </aside>
  );
}
