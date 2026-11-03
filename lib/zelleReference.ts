import { createHmac } from "node:crypto";

// Short human reference a registrant puts in the Zelle memo, so the
// treasurer can match an incoming Zelle payment to its registration.
// Format: "ZEL-" plus eight Crockford base32 characters, e.g. "ZEL-7K3Q9XPD"
// (no I, L, O or U), shown on the confirmation page, the sheet rows and the
// check-in page.
//
// Deterministic, no database: HMAC-SHA256 over the registration's
// summary.ref, truncated to 40 bits. Unlike the 4-character check-in codes it
// identifies a whole registration and is long enough to be effectively
// unique; staff still confirm the name and amount before marking it paid.
//
// Key: same secret as lib/registrationToken.ts and lib/checkinCode.ts
// (REGISTRATION_SIGNING_SECRET, else STRIPE_SECRET_KEY), with its own
// derivation label. Missing both is a misconfiguration and throws, never a
// hard-coded fallback. Changing the secret changes every reference.

const KEY_LABEL = "cacna-zelle-reference-v1";
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford base32
const ZELLE_REFERENCE_RE = /^ZEL-[0-9A-HJKMNP-TV-Z]{8}$/;

function referenceKey(): Buffer {
  const base = process.env.REGISTRATION_SIGNING_SECRET || process.env.STRIPE_SECRET_KEY;
  if (!base) {
    throw new Error("Missing REGISTRATION_SIGNING_SECRET (or STRIPE_SECRET_KEY to derive it from)");
  }
  return createHmac("sha256", base).update(KEY_LABEL).digest();
}

/** The Zelle reference for registration `ref` (summary.ref), formatted
 *  "ZEL-XXXXXXXX". */
export function zelleReferenceFor(ref: string): string {
  const digest = createHmac("sha256", referenceKey()).update(ref).digest();
  // First 40 bits (five bytes), read as eight 5-bit groups.
  let code = "";
  let acc = 0;
  let accBits = 0;
  for (let i = 0; i < 5; i++) {
    acc = (acc << 8) | digest[i];
    accBits += 8;
    while (accBits >= 5) {
      accBits -= 5;
      code += ALPHABET[(acc >> accBits) & 31];
    }
    acc &= (1 << accBits) - 1;
  }
  return `ZEL-${code}`;
}

/** Whether `value` is a Zelle reference in canonical form (as printed). */
export function isWellFormedZelleReference(value: unknown): value is string {
  return typeof value === "string" && ZELLE_REFERENCE_RE.test(value);
}
