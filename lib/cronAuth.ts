import { createHash, timingSafeEqual } from "node:crypto";

/** Shortest CRON_SECRET accepted. Anything shorter is treated as unset, so a
 *  weak or placeholder value can never open the endpoint. */
export const CRON_SECRET_MIN_LENGTH = 16;

function digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

/**
 * True only when `authorization` is exactly `Bearer <secret>` and `secret`
 * is configured (at least CRON_SECRET_MIN_LENGTH characters). Vercel Cron
 * sends that header itself when the project has a CRON_SECRET env var.
 *
 * Fails closed: a missing or short secret rejects every request. Both sides
 * are hashed to a fixed length before timingSafeEqual, so the comparison
 * takes the same time whatever the header holds and leaks no length.
 */
export function isAuthorizedCronRequest(authorization: string | null | undefined, secret: string | undefined): boolean {
  if (typeof secret !== "string" || secret.length < CRON_SECRET_MIN_LENGTH) return false;
  if (typeof authorization !== "string") return false;
  return timingSafeEqual(digest(authorization), digest(`Bearer ${secret}`));
}
