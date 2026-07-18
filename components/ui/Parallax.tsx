"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ParallaxProps {
  children: ReactNode;
  /** Drift distance in px across the full scroll-through. Positive = moves up as you scroll. */
  distance?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Translates its children vertically as the element scrolls through the
 * viewport. Place inside an `overflow: hidden` frame whose child is slightly
 * oversized so the drift never reveals an edge. Static when reduced motion.
 */
export function Parallax({ children, distance = 60, className, style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  if (reduce) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ ...style, y, willChange: "transform" }}>
      {children}
    </motion.div>
  );
}
