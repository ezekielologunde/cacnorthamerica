import { type CSSProperties } from "react";
import { type LucideIcon } from "lucide-react";

interface IconBadgeProps {
  icon: LucideIcon;
  /** Outer badge dimension in px. */
  size?: number;
  iconSize?: number;
  bg?: string;
  color?: string;
  radius?: number;
  style?: CSSProperties;
}

/**
 * Consistent icon badge: a lucide icon (uniform 1.75 stroke) inside a branded
 * rounded square. Replaces emoji "icons" with crisp, themeable vectors.
 */
export function IconBadge({
  icon: Icon,
  size = 52,
  iconSize = 24,
  bg = "var(--cream-2)",
  color = "var(--red)",
  radius = 14,
  style,
}: IconBadgeProps) {
  return (
    <span
      style={{
        width: size, height: size, borderRadius: radius,
        background: bg, display: "grid", placeItems: "center",
        flexShrink: 0, ...style,
      }}
    >
      <Icon size={iconSize} strokeWidth={1.75} color={color} aria-hidden />
    </span>
  );
}
