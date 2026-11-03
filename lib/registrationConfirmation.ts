import { decodeSummary, unchunkFromMetadata, type RegistrationSummary } from "./checkoutSummary";
import { openRegistrationToken } from "./registrationToken";
import { splitCheckoutAmount } from "./processingFee";
import { isWellFormedZelleReference } from "./zelleReference";

// Decides what the registration confirmation page may show. The URL is never
// trusted as proof of anything:
//   - Paid registrations render from the Stripe Checkout Session itself
//     (`?session_id=`): it must be a "registration" session for this year,
//     and the summary comes from the session's own server-written `d`
//     metadata. Any `d` in the URL is ignored.
//   - Free registrations render from a server-sealed token (`?t=`, see
//     lib/registrationToken.ts) that must open, belong to this year, total
//     $0 and contain only children.
//   - Zelle registrations (total > 0, no Stripe) render from the same kind
//     of sealed token, marked pay: "zelle" with the registration's Zelle
//     reference; they show as awaiting payment, never as paid.

export type SessionLike = {
  metadata?: Record<string, string | null | undefined> | null;
  payment_status?: string | null;
  amount_total?: number | null;
};

export type RegistrationConfirmation = {
  summary: RegistrationSummary;
  isPaid: boolean;
  isFree: boolean;
  /** Processing fee charged on top of summary.totalAmountCents; 0 when none. */
  processingFeeCents: number;
  /** Path (no origin) that re-opens this confirmation. */
  confirmationPath: string;
  /** How this registration is (or will be) paid: a Stripe Checkout Session
   *  (see isPaid for whether it has settled), nothing owed, or a Zelle
   *  transfer staff have not confirmed yet. */
  payment: "card" | "free" | "awaiting_zelle";
  /** The memo reference to send with the Zelle payment ("ZEL-XXXXXXXX");
   *  set only when payment is "awaiting_zelle". */
  zelleRef?: string;
};

const SESSION_ID_RE = /^cs_(live|test)_[A-Za-z0-9]{1,255}$/;
const CATEGORIES = ["adult", "young_adult", "child"];

function isRegistrationSummary(x: unknown): x is RegistrationSummary {
  if (!x || typeof x !== "object") return false;
  const s = x as Record<string, unknown>;
  return (
    typeof s.year === "number" &&
    typeof s.contactName === "string" &&
    typeof s.contactEmail === "string" &&
    typeof s.totalAmountCents === "number" &&
    typeof s.isComplimentary === "boolean" &&
    (s.churchName === null || typeof s.churchName === "string") &&
    Array.isArray(s.registrants) &&
    s.registrants.length > 0 &&
    s.registrants.every(
      (r) => !!r && typeof r === "object" && typeof (r as { n?: unknown }).n === "string" && CATEGORIES.includes((r as { c?: unknown }).c as string)
    )
  );
}

export function isFreeChildOnlySummary(summary: RegistrationSummary, year: number): boolean {
  return (
    summary.year === year &&
    summary.totalAmountCents === 0 &&
    !summary.isComplimentary &&
    summary.registrants.length > 0 &&
    summary.registrants.every((r) => r.c === "child")
  );
}

export async function resolveRegistrationConfirmation(input: {
  year: number;
  sessionId?: unknown;
  token?: unknown;
  retrieveSession: (id: string) => Promise<SessionLike>;
}): Promise<RegistrationConfirmation | null> {
  const basePath = `/events/cacna-${input.year}/register/confirmation`;

  if (typeof input.sessionId === "string" && input.sessionId !== "") {
    if (!SESSION_ID_RE.test(input.sessionId)) return null;
    let session: SessionLike;
    try {
      session = await input.retrieveSession(input.sessionId);
    } catch {
      return null;
    }
    if (session.metadata?.kind !== "registration") return null;
    const encoded = unchunkFromMetadata(session.metadata ?? undefined, "d");
    const summary = encoded ? decodeSummary(encoded) : null;
    if (!isRegistrationSummary(summary) || summary.year !== input.year) return null;
    return {
      summary,
      isPaid: session.payment_status === "paid",
      isFree: false,
      processingFeeCents: splitCheckoutAmount(session.amount_total ?? 0, session.metadata).processingFeeCents,
      confirmationPath: `${basePath}?session_id=${input.sessionId}`,
      payment: "card",
    };
  }

  if (typeof input.token === "string" && input.token !== "") {
    const summary = openRegistrationToken(input.token);
    if (!isRegistrationSummary(summary)) return null;
    const confirmationPath = `${basePath}?t=${input.token}`;
    const sealed = summary as RegistrationSummary & { pay?: unknown; zelleRef?: unknown };
    if (sealed.pay === "zelle") {
      if (
        summary.year !== input.year ||
        summary.isComplimentary ||
        !(summary.totalAmountCents > 0) ||
        !isWellFormedZelleReference(sealed.zelleRef)
      ) {
        return null;
      }
      return { summary, isPaid: false, isFree: false, processingFeeCents: 0, confirmationPath, payment: "awaiting_zelle", zelleRef: sealed.zelleRef };
    }
    if (!isFreeChildOnlySummary(summary, input.year)) return null;
    return { summary, isPaid: true, isFree: true, processingFeeCents: 0, confirmationPath, payment: "free" };
  }

  return null;
}

/** For the store and giving confirmation pages: only a paid session of the
 *  page's own kind counts as a completed checkout. */
export function isPaidCheckout(session: SessionLike, kind: "store_order" | "giving"): boolean {
  return session.payment_status === "paid" && session.metadata?.kind === kind;
}
