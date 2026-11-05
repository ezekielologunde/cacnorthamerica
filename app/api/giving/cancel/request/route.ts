import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { FORM_HEADER } from "@/lib/spam";
import { emailLimitKey } from "@/lib/givingRequest";
import { TURNSTILE_ERROR, verifyTurnstile } from "@/lib/turnstile";
import { requestCancelLink } from "@/lib/givingCancel";
import { cancelDeps } from "@/lib/givingCancelStripe";

const HOUR_MS = 60 * 60 * 1000;

// Step 1 of cancelling a recurring gift: the donor types their email and, if a
// recurring gift exists for it, a link is emailed there. Every well-formed
// request gets the same answer, so this cannot be used to learn who gives.
// Each lookup is a Stripe call and each hit an email from the church's own
// address, so the limits below are the real defence: per IP, per inbox
// (normalised) and for the route as a whole.
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

  const email = typeof fields.email === "string" ? fields.email : "";
  if (!rateLimit(`giving-cancel:${emailLimitKey(email)}`, 3, HOUR_MS)) {
    return NextResponse.json({ error: "Too many requests for this email. Please try again in an hour, or write to info@cacna.org." }, { status: 429 });
  }
  if (!rateLimit("giving-cancel:all", 60, HOUR_MS)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const outcome = await requestCancelLink(email, cancelDeps(), Date.now());
  if (outcome === "invalid") {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  // "sent", "none" and "failed" look identical from outside: a failure is
  // logged for us, and the page tells the donor to write to the church if no
  // email arrives.
  return NextResponse.json({ ok: true });
}
