"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Style-agnostic magnetic wrapper: the child carries its own styling, this
 * only nudges it toward the cursor with a spring. Renders a plain span when
 * the user prefers reduced motion or on touch devices (no hover).
 */
export function Magnetic({ children, strength = 0.3, className, style }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <span className={className} style={{ display: "inline-flex", ...style }}>
        {children}
      </span>
    );
  }

  function onMove(e: React.MouseEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    setPos({ x: (e.clientX - cx) * strength, y: (e.clientY - cy) * strength });
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: "inline-flex", ...style }}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.5 }}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
    >
      {children}
    </motion.span>
  );
}
