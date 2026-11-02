const store = new Map<string, { count: number; resetAt: number }>();

// Expired entries are swept at most this often, so the Map can't grow
// without bound as new IPs and recipient addresses arrive.
const SWEEP_INTERVAL_MS = 60_000;
let lastSweep = 0;

function sweep(now: number): void {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

/**
 * Returns true if the request is allowed, false if it should be rejected.
 * In-memory only -- each server instance keeps its own counts and loses them
 * on cold start, so the effective cap grows with the number of instances.
 * Upgrade to a shared store (e.g. Upstash Redis) for a hard global limit.
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(now);
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

/**
 * The client IP as reported by the hosting platform. On Vercel,
 * x-vercel-forwarded-for and x-real-ip are set by the edge and can't be
 * supplied by the client; x-forwarded-for is deliberately not read, because
 * behind any proxy that appends to (rather than overwrites) it, its first
 * entry comes straight from the client and would let a caller pick a fresh
 * rate-limit key per request. Without either header (local dev) every
 * request shares one "anon" bucket.
 */
export function clientIp(headers: { get(name: string): string | null }): string {
  const ip =
    headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim();
  return ip || "anon";
}
