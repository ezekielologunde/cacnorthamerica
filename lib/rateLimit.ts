const store = new Map<string, { count: number; resetAt: number }>();

/**
 * Returns true if the request is allowed, false if it should be rejected.
 * In-memory only — resets on cold start. Sufficient for low-traffic sites;
 * upgrade to Upstash Redis for multi-instance rate limiting.
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) return false;
  entry.count++;
  return true;
}
