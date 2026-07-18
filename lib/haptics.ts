/**
 * Lightweight haptic feedback via the Web Vibration API.
 *
 * Platform note: `navigator.vibrate` is supported on Android (Chrome/Firefox/Edge).
 * iOS Safari does NOT expose vibration to the web, so this no-ops there — the
 * accompanying motion/press animations carry the tactile feel on those devices.
 * Always paired with a visual press state so feedback never depends on vibration.
 */
export type HapticPattern =
  | "selection"
  | "tap"
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  selection: 6,
  tap: 9,
  light: 12,
  medium: 20,
  heavy: 32,
  success: [12, 40, 24],
  warning: [22, 60, 22],
  error: [30, 45, 30, 45, 30],
};

let lastFire = 0;

export function haptic(pattern: HapticPattern = "tap"): void {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;
  if (!("vibrate" in navigator)) return;
  try {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    // Throttle so rapid interactions don't buzz continuously.
    const now = window.performance?.now?.() ?? Date.now();
    if (now - lastFire < 40) return;
    lastFire = now;
    navigator.vibrate(PATTERNS[pattern]);
  } catch {
    /* vibration not permitted — ignore */
  }
}
