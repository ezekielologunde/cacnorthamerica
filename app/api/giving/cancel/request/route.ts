import { after, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { FORM_HEADER } from "@/lib/spam";
import { emailLimitKey } from "@/lib/givingRequest";
import { TURNSTILE_ERROR, verifyTurnstile } from "@/lib/turnstile";
import { parseEmail, requestCancelLink } from "@/lib/givingCancel";
import { cancelDeps } from "@/lib/givingCancelStripe";

const HOUR_MS = 60 * 60 * 1000;

// Step 1 of cancelling a recurring gift: the donor types their email and, if a
// recurring gift exists for it, a link is emailed there. The answer goes back
// as soon as the address is validated and the limits pass, and the Stripe
// lookup and the email happen after the response, so neither the content nor
// the timing of the reply says whether the address gives. Each lookup is a
// Stripe call and each hit an email from the church's own address, so the
// limits below are the defence: per IP and per inbox (normalised), behind
// Turnstile.
export async function POST(request: Request) {
  if (!request.headers.get(FORM_HEADER)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!rateLimit(clientIp(request.headers), 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const fields = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  if (!(await verifyTurnstile(fields.turnstileToken, clientIp(request.headers)))) {
    return NextResponse.json({ error: TURNSTILE_ERROR }, { status: 400 });
  }

  const email = parseEmail(fields.email);
  if (!email) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!rateLimit(`giving-cancel:${emailLimitKey(email.typed)}`, 3, HOUR_MS)) {
    return NextResponse.json({ error: "Too many requests for this email. Please try again in an hour, or write to info@cacna.org." }, { status: 429 });
  }

  // A failed lookup or send is logged inside; the page tells the donor to write
  // to the church if no email arrives.
  after(async () => {
    await requestCancelLink(email.typed, cancelDeps(), Date.now());
  });
  return NextResponse.json({ ok: true });
}
