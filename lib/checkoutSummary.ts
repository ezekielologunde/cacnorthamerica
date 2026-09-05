import type { RegistrantCategory } from "@/lib/conventions";

// Ported from the Convention site's lib/checkoutSummary.ts (see
// docs/obsidian/Decisions.md) -- this repo also has no database backing
// registrations, so a registration's details have to travel with the
// checkout flow itself rather than living in a row some later page looks up
// by id. Every summary below is built once, server-side, right before
// redirecting -- never re-derived from anything the client sends back --
// and travels two ways:
//   1. Base64url-encoded into the confirmation page's own URL (`d` query
//      param) so that page can render without a second Stripe line-items
//      fetch for display data.
//   2. The same encoded string, chunked to fit Stripe's 500-char-per-value
//      metadata limit, attached to the Checkout Session as a record of what
//      was actually charged.
//
// Unlike Convention (one edition at a time), CACNA's register flow is
// per-year (`/events/cacna-YYYY/register`), so `year` travels in the
// summary too -- the confirmation page needs it to find the right
// ConventionYear without re-parsing the URL slug.

export type RegistrationSummary = {
  ref: string;
  year: number;
  registrationType: "individual" | "group";
  churchName: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  registrants: { n: string; c: RegistrantCategory }[];
  totalAmountCents: number;
  isComplimentary: boolean;
};

export function encodeSummary(summary: RegistrationSummary): string {
  return Buffer.from(JSON.stringify(summary), "utf8").toString("base64url");
}

export function decodeSummary(encoded: string): RegistrationSummary | null {
  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as RegistrationSummary;
  } catch {
    return null;
  }
}

// Stripe rejects any single metadata value over 500 characters, so a
// summary that doesn't fit (a large group registration) is split across
// `${key}0`, `${key}1`, ... and reassembled by whoever reads it back.
const METADATA_CHUNK_SIZE = 450;

export function chunkForMetadata(key: string, value: string): Record<string, string> {
  const chunks: Record<string, string> = {};
  for (let i = 0; i * METADATA_CHUNK_SIZE < value.length; i++) {
    chunks[`${key}${i}`] = value.slice(i * METADATA_CHUNK_SIZE, (i + 1) * METADATA_CHUNK_SIZE);
  }
  return chunks;
}

export function unchunkFromMetadata(
  metadata: Record<string, string | null | undefined> | undefined,
  key: string
): string {
  if (!metadata) return "";
  let result = "";
  for (let i = 0; metadata[`${key}${i}`] != null; i++) {
    result += metadata[`${key}${i}`];
  }
  return result;
}
