import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";

// Sealed token for the "cancel my recurring gift" link. It proves the person
// controls the inbox the link was emailed to: the link is only ever sent to
// the address on the gift. It carries the Stripe customer ids found for that
// address (never the address itself, so no email in browser history or logs)
// and an expiry, sealed with AES-256-GCM so it cannot be read, edited or
// forged. Same scheme and key source as lib/registrationToken.ts, with its own
// label and AAD so a token for one purpose never opens for the other.

const KEY_LABEL = "cacna-giving-cancel-token-v1";
const AAD = Buffer.from("giving-cancel-v1", "utf8");
const IV_BYTES = 12;
const TAG_BYTES = 16;

/** How long an emailed cancel link works. */
export const CANCEL_TOKEN_TTL_MS = 60 * 60 * 1000;
export const MAX_CANCEL_CUSTOMERS = 10;

function tokenKey(): Buffer {
  const base = process.env.REGISTRATION_SIGNING_SECRET || process.env.STRIPE_SECRET_KEY;
  if (!base) {
    throw new Error("Missing REGISTRATION_SIGNING_SECRET (or STRIPE_SECRET_KEY to derive it from)");
  }
  return createHmac("sha256", base).update(KEY_LABEL).digest();
}

export function sealCancelToken(customerIds: string[], now: number): string {
  const payload = { c: customerIds.slice(0, MAX_CANCEL_CUSTOMERS), x: now + CANCEL_TOKEN_TTL_MS };
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", tokenKey(), iv);
  cipher.setAAD(AAD);
  const body = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  return Buffer.concat([iv, body, cipher.getAuthTag()]).toString("base64url");
}

/** The customer ids a valid, unexpired token was sealed for, or null for
 *  anything else (forged, edited, truncated, expired, wrong shape). */
export function openCancelToken(token: string, now: number): string[] | null {
  try {
    if (typeof token !== "string" || token.length > 2048) return null;
    const raw = Buffer.from(token, "base64url");
    if (raw.length <= IV_BYTES + TAG_BYTES) return null;
    const iv = raw.subarray(0, IV_BYTES);
    const tag = raw.subarray(raw.length - TAG_BYTES);
    const body = raw.subarray(IV_BYTES, raw.length - TAG_BYTES);
    const decipher = createDecipheriv("aes-256-gcm", tokenKey(), iv);
    decipher.setAAD(AAD);
    decipher.setAuthTag(tag);
    const payload: unknown = JSON.parse(Buffer.concat([decipher.update(body), decipher.final()]).toString("utf8"));
    if (!payload || typeof payload !== "object") return null;
    const { c, x } = payload as { c?: unknown; x?: unknown };
    if (typeof x !== "number" || !Number.isFinite(x) || now > x) return null;
    if (!Array.isArray(c) || c.length === 0 || c.length > MAX_CANCEL_CUSTOMERS) return null;
    if (!c.every((id) => typeof id === "string" && /^cus_[A-Za-z0-9]+$/.test(id))) return null;
    return c as string[];
  } catch {
    return null;
  }
}
