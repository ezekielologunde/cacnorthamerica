"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ILORIN_WORDS } from "@/lib/ilorinWords";

// A different blessing from Pastor R.T. Owoseni each day. Seeded with index 0 for SSR
// (no hydration mismatch), then advanced client-side to today's word — which also keeps
// it correct on the statically-prerendered Ilorin page. Indexed by absolute day count so
// it cycles through ALL messages (length > 366) and flips at the viewer's local midnight.
export function DailyWord() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    const now = new Date();
    const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayNumber = Math.floor(localMidnight.getTime() / 86_400_000);
    const L = ILORIN_WORDS.length;
    setI(((dayNumber % L) + L) % L);
  }, []);

  return (
    <section
      style={{
        background: "linear-gradient(180deg,#06311F 0%,#094a2d 100%)",
        color: "#fff",
        padding: "clamp(60px,8vw,108px) clamp(20px,5vw,64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute", top: -160, left: "50%", transform: "translateX(-50%)",
          width: 620, height: 480,
          background: "radial-gradient(circle,rgba(43,182,115,.22),transparent 62%)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}
      >
        <span
          style={{
            display: "inline-flex", alignItems: "center", gap: 9,
            fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase",
            color: "#E8A33D", background: "rgba(232,163,61,.1)", border: "1px solid rgba(232,163,61,.3)",
            padding: "7px 16px", borderRadius: 999,
          }}
        >
          Today&apos;s Word
        </span>
        <p
          style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "clamp(23px,3.3vw,40px)", lineHeight: 1.34, letterSpacing: "-.4px",
            color: "#fff", margin: "26px auto 22px", maxWidth: 780, textWrap: "balance",
          }}
        >
          &ldquo;{ILORIN_WORDS[i]}&rdquo;
        </p>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#2BB673", letterSpacing: ".3px" }}>
          Pastor R.T. Owoseni
        </div>
        <div style={{ fontSize: 12.5, color: "rgba(238,245,238,.6)", marginTop: 4 }}>
          District Superintendent · A fresh word of blessing every day
        </div>
      </motion.div>
    </section>
  );
}
