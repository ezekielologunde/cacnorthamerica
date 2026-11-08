import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";

// Sealed token for free (all-children) registrations. Those never reach
// Stripe, so there's no session id to look the registration up by, and this
// repo has no registrations table. Instead the summary itself is sealed with
// AES-256-GCM under a server-only key and carried in the confirmation URL
// (`?t=`). GCM authenticates the ciphertext, so a hand-built or edited token
// fails to open, and the encryption keeps contact details and children's
// names out of the readable URL (browser history, request logs, analytics).
//
// Key: REGISTRATION_SIGNING_SECRET when set; otherwise derived from
// STRIPE_SECRET_KEY so the free path keeps working without a new env var.
// Changing whichever secret is in use (including setting
// REGISTRATION_SIGNING_SECRET for the first time) invalidates every free
// confirmation link issued before the change.

const KEY_LABEL = "cacna-free-registration-token-v1";
const AAD = Buffer.from("free-registration-v1", "utf8");
const IV_BYTES = 12;
const TAG_BYTES = 16;

function tokenKey(): Buffer {
  const base = process.env.REGISTRATION_SIGNING_SECRET || process.env.STRIPE_SECRET_KEY;
  if (!base) {
    throw new Error("Missing REGISTRATION_SIGNING_SECRET (or STRIPE_SECRET_KEY to derive it from)");
  }
  return createHmac("sha256", base).update(KEY_LABEL).digest();
}

export function sealRegistrationToken(payload: unknown): string {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", tokenKey(), iv);
  cipher.setAAD(AAD);
  const body = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  return Buffer.concat([iv, body, cipher.getAuthTag()]).toString("base64url");
}

/** Returns the sealed payload, or null for anything that wasn't sealed by
 *  this server with the current key (forged, edited, truncated, garbage). */
export function openRegistrationToken(token: string): unknown {
  try {
    const raw = Buffer.from(token, "base64url");
    if (raw.length <= IV_BYTES + TAG_BYTES) return null;
    const iv = raw.subarray(0, IV_BYTES);
    const tag = raw.subarray(raw.length - TAG_BYTES);
    const body = raw.subarray(IV_BYTES, raw.length - TAG_BYTES);
    const decipher = createDecipheriv("aes-256-gcm", tokenKey(), iv);
    decipher.setAAD(AAD);
    decipher.setAuthTag(tag);
    const json = Buffer.concat([decipher.update(body), decipher.final()]).toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}
