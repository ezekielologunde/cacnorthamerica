import { createHmac } from "node:crypto";

// Human-readable check-in code for every registrant of a convention year, so
// check-in never depends on the QR code alone. Format: CAC27-XXXX-XXXX
// ("CAC" + two-digit year + 8 Crockford base32 characters, no I/L/O/U).
//
// Deterministic, no database: HMAC-SHA256 over `${year}|${ref}|${index}`
// truncated to 40 bits, where ref is the registration's summary.ref and index
// the registrant's position in summary.registrants (that order is fixed in
// the Stripe metadata / sealed token, so the page, email and sheet rows all
// derive the same code). Without the server secret nobody can produce or
// predict a valid code.
//
// Key: same secret as lib/registrationToken.ts (REGISTRATION_SIGNING_SECRET,
// else STRIPE_SECRET_KEY), with its own derivation label. Missing both is a
// misconfiguration and throws, never a hard-coded fallback. Changing the
// secret changes every code.

const KEY_LABEL = "cacna-checkin-code-v1";
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford base32
const CODE_RE = /^CAC\d{2}-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/;

function codeKey(): Buffer {
  const base = process.env.REGISTRATION_SIGNING_SECRET || process.env.STRIPE_SECRET_KEY;
  if (!base) {
    throw new Error("Missing REGISTRATION_SIGNING_SECRET (or STRIPE_SECRET_KEY to derive it from)");
  }
  return createHmac("sha256", base).update(KEY_LABEL).digest();
}

/** The check-in code for registrant `index` of registration `ref` in `year`. */
export function checkinCodeFor(ref: string, year: number, index: number): string {
  const digest = createHmac("sha256", codeKey()).update(`${year}|${ref}|${index}`).digest();
  // First 40 bits (exact in a double), read as eight 5-bit groups.
  const bits = digest[0] * 2 ** 32 + digest.readUInt32BE(1);
  let body = "";
  for (let shift = 35; shift >= 0; shift -= 5) body += ALPHABET[Math.floor(bits / 2 ** shift) % 32];
  const yy = String(year % 100).padStart(2, "0");
  return `CAC${yy}-${body.slice(0, 4)}-${body.slice(4)}`;
}

/** One code per registrant, in summary.registrants order. */
export function checkinCodesFor(summary: { ref: string; year: number; registrants: readonly unknown[] }): string[] {
  return summary.registrants.map((_, i) => checkinCodeFor(summary.ref, summary.year, i));
}

/** Whether `code` is a code in canonical form (as printed). */
export function isWellFormedCheckinCode(code: string): boolean {
  return CODE_RE.test(code);
}

/** Canonical form of a typed code (any case, spaces or missing hyphens; the
 *  Crockford look-alikes I/L read as 1 and O as 0), or null if it cannot be
 *  one. Only checks the shape: it says nothing about whether the code exists. */
export function normalizeCheckinCode(input: string): string | null {
  const compact = input.toUpperCase().replace(/[\s-]+/g, "");
  const m = /^CAC(\d{2})([0-9A-Z]{8})$/.exec(compact);
  if (!m) return null;
  const body = m[2].replace(/[IL]/g, "1").replace(/O/g, "0");
  const code = `CAC${m[1]}-${body.slice(0, 4)}-${body.slice(4)}`;
  return isWellFormedCheckinCode(code) ? code : null;
}
