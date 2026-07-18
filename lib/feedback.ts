let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!_ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      _ctx = new AC();
    }
    if (_ctx.state === "suspended") void _ctx.resume();
    return _ctx;
  } catch {
    return null;
  }
}

function tone(
  ac: AudioContext,
  freq: number,
  type: OscillatorType,
  start: number,
  dur: number,
  vol: number
) {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(vol, start);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

/** Ascending two-note chime — add to cart */
export function playAdd() {
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime;
  tone(ac, 523.25, "sine", t, 0.15, 0.22);       // C5
  tone(ac, 659.25, "sine", t + 0.1, 0.2, 0.18);  // E5
}

/** Soft descending note — remove item */
export function playRemove() {
  const ac = getCtx();
  if (!ac) return;
  tone(ac, 392, "sine", ac.currentTime, 0.12, 0.13); // G4
}

/** Three-note rising chord — checkout initiation */
export function playCheckout() {
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime;
  tone(ac, 523.25, "sine", t,        0.18, 0.22); // C5
  tone(ac, 659.25, "sine", t + 0.14, 0.18, 0.20); // E5
  tone(ac, 783.99, "sine", t + 0.28, 0.30, 0.22); // G5
}

/** Soft single tick — cart open */
export function playOpen() {
  const ac = getCtx();
  if (!ac) return;
  tone(ac, 880, "sine", ac.currentTime, 0.06, 0.07); // A5
}

/** Web Vibration API — safe on all platforms */
export function haptic(ms: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try { navigator.vibrate(ms); } catch { /* unsupported */ }
  }
}
