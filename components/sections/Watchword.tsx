import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { WatchwordArchive } from "@/components/sections/WatchwordArchive";

export function Watchword() {
  return (
    <section style={{ position: "relative", background: "var(--cream-2)", padding: "clamp(48px,6vw,80px) clamp(20px,5vw,64px)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", overflow: "hidden" }}>
      <Reveal style={{ position: "relative", maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Our 2026 Watchword</span>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.6vw,46px)", letterSpacing: "-0.02em", color: "var(--ink)", margin: "16px auto 0", lineHeight: 1.18, maxWidth: 760, textWrap: "balance" }}>
          “Open my eyes, that I may see wondrous things from Your law.”
        </p>
        <p style={{ fontStyle: "italic", fontSize: "clamp(15px,1.6vw,18px)", color: "var(--ink-soft)", margin: "16px auto 0", lineHeight: 1.6, maxWidth: 700 }}>
          “Là mí li ojú, kí èmi kí ó lè máa wò ohun ìyanu wọ̀nnì láti inú òfin rẹ.”
        </p>
        <div style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 12, fontSize: 12.5, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)" }}>
          <span style={{ width: 26, height: 1, background: "var(--line)" }} aria-hidden />
          Psalm 119:18 · NKJV &amp; Yorùbá
          <span style={{ width: 26, height: 1, background: "var(--line)" }} aria-hidden />
        </div>
        <div style={{ marginTop: 22 }}>
          <Link href="/devotional" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>
            Read the daily devotional <span aria-hidden style={{ fontSize: 16 }}>→</span>
          </Link>
        </div>
        <WatchwordArchive />
      </Reveal>
    </section>
  );
}
