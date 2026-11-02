import { createHmac } from "node:crypto";

// Human-readable check-in code for every registrant of a convention year:
// the only check-in method. Format: four Crockford base32
// characters, e.g. "7K3Q" (no I, L, O or U).
//
// Four characters is only about 1M combinations, so a code is unique-ish, not
// unique: two registrations can share one. Staff verify a code together with
// the person's name (and the registration ref when in doubt), never on its
// own; that is why the confirmation page, the email and the sheet always show
// each code next to its person's name.
//
// Deterministic, no database: HMAC-SHA256 over
// `${year}|${ref}|${index}|${counter}` truncated to 20 bits, where ref is the
// registration's summary.ref and index the registrant's position in
// summary.registrants (that order is fixed in the Stripe metadata / sealed
// token, so the page, email and sheet rows all derive the same code). counter
// starts at 0 and is only raised when the candidate repeats an earlier code in
// the same registration, so codes inside one registration are always distinct.
// Without the server secret nobody can produce or predict a valid code.
//
// Key: same secret as lib/registrationToken.ts (REGISTRATION_SIGNING_SECRET,
// else STRIPE_SECRET_KEY), with its own derivation label. Missing both is a
// misconfiguration and throws, never a hard-coded fallback. Changing the
// secret changes every code.

const KEY_LABEL = "cacna-checkin-code-v1";
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford base32
const CODE_RE = /^[0-9A-HJKMNP-TV-Z]{4}$/;

function codeKey(): Buffer {
  const base = process.env.REGISTRATION_SIGNING_SECRET || process.env.STRIPE_SECRET_KEY;
  if (!base) {
    throw new Error("Missing REGISTRATION_SIGNING_SECRET (or STRIPE_SECRET_KEY to derive it from)");
  }
  return createHmac("sha256", base).update(KEY_LABEL).digest();
}

/** Candidate `counter` of the code for registrant `index` of registration
 *  `ref` in `year`. Use checkinCodesFor for the code actually shown: it picks
 *  the counter that keeps codes distinct within the registration. */
export function checkinCodeFor(ref: string, year: number, index: number, counter = 0): string {
  const digest = createHmac("sha256", codeKey()).update(`${year}|${ref}|${index}|${counter}`).digest();
  // First 20 bits, read as four 5-bit groups.
  const bits = (digest[0] << 12) | (digest[1] << 4) | (digest[2] >> 4);
  let code = "";
  for (let shift = 15; shift >= 0; shift -= 5) code += ALPHABET[(bits >> shift) & 31];
  return code;
}

/** One code per registrant, in summary.registrants order, all distinct. */
export function checkinCodesFor(summary: { ref: string; year: number; registrants: readonly unknown[] }): string[] {
  const used = new Set<string>();
  return summary.registrants.map((_, i) => {
    let counter = 0;
    let code = checkinCodeFor(summary.ref, summary.year, i, counter);
    while (used.has(code)) code = checkinCodeFor(summary.ref, summary.year, i, ++counter);
    used.add(code);
    return code;
  });
}

/** The adult sheet's "Check-in Code" cell: "Name: CODE; Name: CODE" in
 *  Registrants order, so each code sits next to its person's name. */
export function checkinCodeSheetCell(summary: { ref: string; year: number; registrants: readonly { n: string }[] }): string {
  const codes = checkinCodesFor(summary);
  return summary.registrants.map((r, i) => `${r.n}: ${codes[i]}`).join("; ");
}

/** Whether `code` is a code in canonical form (as printed). */
export function isWellFormedCheckinCode(code: string): boolean {
  return CODE_RE.test(code);
}

/** Canonical form of a typed code (any case, spaces or hyphens; the Crockford
 *  look-alikes I/L read as 1 and O as 0), or null if it cannot be one. Only
 *  checks the shape: it says nothing about whether the code exists. */
export function normalizeCheckinCode(input: string): string | null {
  const code = input.toUpperCase().replace(/[\s-]+/g, "").replace(/[IL]/g, "1").replace(/O/g, "0");
  return isWellFormedCheckinCode(code) ? code : null;
}
