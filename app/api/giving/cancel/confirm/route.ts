import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { FORM_HEADER } from "@/lib/spam";
import { cancelWithToken } from "@/lib/givingCancel";
import { cancelDeps } from "@/lib/givingCancelStripe";

// Step 3: the donor pressed Cancel on one gift. POST only, never GET, because
// email scanners open every link in a message. The token (from the emailed
// link) says which customers' gifts this request may touch.
export async function POST(request: Request) {
  if (!request.headers.get(FORM_HEADER)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!rateLimit(`giving-cancel-confirm:${clientIp(request.headers)}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const fields = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  const outcome = await cancelWithToken(fields.token, fields.subscriptionId, cancelDeps(), Date.now());
  if (outcome === "cancelled") return NextResponse.json({ ok: true });
  if (outcome === "expired") {
    return NextResponse.json({ error: "This link has expired. Please ask for a new one." }, { status: 410 });
  }
  if (outcome === "not_found") {
    return NextResponse.json({ error: "We couldn't find that gift." }, { status: 404 });
  }
  return NextResponse.json({ error: "Something went wrong. Please try again, or write to info@cacna.org." }, { status: 500 });
}
