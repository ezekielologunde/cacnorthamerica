"use client";

import { type CSSProperties } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface RevealTextProps {
  children: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  /** Animate immediately on mount (for above-the-fold hero) instead of on scroll. */
  immediate?: boolean;
}

/**
 * Word-by-word masked reveal for headlines. Each word rises from behind a clip
 * mask with a spring. Collapses to a simple fade when reduced motion is set.
 */
export function RevealText({ children, className, style, delay = 0, immediate = false }: RevealTextProps) {
  const reduce = useReducedMotion();
  const words = children.split(" ");

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: delay } },
  };

  const word: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { y: "115%" },
        show: { y: "0%", transition: { type: "spring", stiffness: 190, damping: 26, mass: 0.7 } },
      };

  const reveal = immediate ? "show" : undefined;

  return (
    <motion.span
      className={className}
      style={{ display: "inline-block", ...style }}
      variants={container}
      initial="hidden"
      {...(immediate ? { animate: reveal } : { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } })}
      aria-label={children}
    >
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          style={{ display: "inline-flex", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.08em", marginRight: "0.26em" }}
        >
          <motion.span variants={word} style={{ display: "inline-block" }}>
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
