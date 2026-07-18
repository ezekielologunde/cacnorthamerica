"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const VERSES = [
  { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", ref: "Jeremiah 29:11" },
  { text: "I can do all this through Him who gives me strength.", ref: "Philippians 4:13" },
  { text: "Trust in the Lord with all your heart and lean not on your own understanding.", ref: "Proverbs 3:5" },
  { text: "Be still, and know that I am God.", ref: "Psalm 46:10" },
  { text: "Cast all your anxiety on Him because He cares for you.", ref: "1 Peter 5:7" },
  { text: "The joy of the Lord is your strength.", ref: "Nehemiah 8:10" },
  { text: "Come to me, all you who are weary and burdened, and I will give you rest.", ref: "Matthew 11:28" },
  { text: "The Lord is my shepherd, I lack nothing.", ref: "Psalm 23:1" },
];

export function VerseOfDay() {
  const reduce = useReducedMotion();
  const [verse, setVerse] = useState(VERSES[0]);

  useEffect(() => {
    // Deterministic per calendar day, computed client-side so it changes daily.
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    setVerse(VERSES[dayOfYear % VERSES.length]);
  }, []);

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative", overflow: "hidden",
        maxWidth: 820, margin: "0 auto",
        background: "linear-gradient(135deg,var(--red-deep),var(--red))",
        borderRadius: 28, padding: "clamp(36px,5vw,60px)",
        boxShadow: "0 30px 70px rgba(214,40,40,.28)",
        textAlign: "center",
      }}
    >
      <div style={{ position: "absolute", inset: "-20%", background: "radial-gradient(circle at 75% 20%,rgba(241,95,34,.4),transparent 60%)", pointerEvents: "none", animation: "gradient-drift 14s ease-in-out infinite" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,.7)" }}>Verse of the Day</span>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(24px,3.2vw,40px)", lineHeight: 1.3, letterSpacing: "-.5px", color: "#fff", margin: "20px 0 18px", textWrap: "balance" }}>
          &ldquo;{verse.text}&rdquo;
        </p>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#FFD9A8", letterSpacing: ".5px" }}>{verse.ref}</div>
      </div>
    </motion.div>
  );
}
