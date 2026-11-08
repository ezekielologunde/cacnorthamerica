import { NextResponse, after } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { FORM_HEADER } from "@/lib/spam";
import { TURNSTILE_ERROR, verifyTurnstile } from "@/lib/turnstile";
import { logToSheetChecked } from "@/lib/sheetsWebhook";
import { sender } from "@/lib/email";
import { currentOrNextConvention } from "@/lib/conventions";
import { serveTeamNames } from "@/lib/serveTeams";
import { SERVE_FORM_NAME, SERVE_INBOX, honeypotFilled, validateServeSignup, type ServeSignup } from "@/lib/serveSignup";
import { sendServeConfirmation, serveNoticeHtml } from "@/lib/serveEmail";

// "Serve at the Convention" sign-ups from /serve. Same guards, in the same
// order, as app/api/contact/route.ts: rate limit, form header, JSON, honeypot,
// Turnstile, validation (lib/serveSignup.ts), then the committee notice. The
// save, sheet row and volunteer confirmation run in after(), once the
// response is sent.

const DAY_MS = 24 * 60 * 60 * 1000;

/** cacna.serve_signups (supabase/migrations/0019_serve_signups.sql). Until
 *  0019 is applied the insert fails and is logged; the sheet row and the
 *  committee email still carry the sign-up. */
async function saveSignup(s: ServeSignup, year: number): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("serve_signups").insert({
    name: s.name,
    email: s.email,
    phone: s.phone || null,
    teams: s.teams,
    note: s.note || null,
    under_18: s.under18,
    guardian_consent: s.guardianConsent,
    convention_year: year,
  });
  if (error) console.error("[serve] Supabase insert error:", error.message);
}

/** One confirmation per address per day, like the contact auto-reply: a
 *  per-instance guard, then a check of the shared table. Must run before this
 *  sign-up is saved. If the lookup fails (or 0019 isn't applied), no reply. */
async function mayConfirm(email: string): Promise<boolean> {
  if (!rateLimit(`serve-reply:${email.toLowerCase()}`, 1, DAY_MS)) return false;
  try {
    const supabase = createServiceClient();
    const { count, error } = await supabase
      .from("serve_signups")
      .select("id", { count: "exact", head: true })
      .ilike("email", email.replace(/[\\%_]/g, "\\$&"))
      .gte("created_at", new Date(Date.now() - DAY_MS).toISOString());
    return !error && count === 0;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!rateLimit(`serve:${clientIp(req.headers)}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Direct API posts that skip our own form code are bots: fake success, drop.
  if (!req.headers.get(FORM_HEADER)) {
    return NextResponse.json({ success: true });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (honeypotFilled(body)) {
    return NextResponse.json({ success: true });
  }

  if (!(await verifyTurnstile(body.turnstileToken, clientIp(req.headers)))) {
    return NextResponse.json({ error: TURNSTILE_ERROR }, { status: 400 });
  }

  const result = validateServeSignup(body);
  if (!result.ok) {
    if (result.spam) return NextResponse.json({ success: true });
    return NextResponse.json({ error: result.error, field: result.field }, { status: 400 });
  }
  const s = result.signup;
  const cy = currentOrNextConvention();

  const fields: Record<string, string> = {
    "Name": s.name,
    "Email": s.email,
    "Phone": s.phone,
    "Teams": serveTeamNames(s.teams).join(", "),
    "Experience / Availability": s.note,
    "Under 18": s.under18 ? "Yes" : "No",
    ...(s.under18 ? { "Guardian Consent": s.guardianConsent ? "Yes" : "No" } : {}),
    "Convention": String(cy.year),
  };

  const key = process.env.RESEND_API_KEY;

  // Each step logs its own failure and none changes the response.
  after(async () => {
    // Before the save, so this sign-up doesn't count against itself.
    const confirm = key ? await mayConfirm(s.email) : false;
    await saveSignup(s, cy.year).catch((e) => console.error("[serve] Supabase save failed:", e));
    // Formula-escaped in lib/sheetsWebhook.ts.
    await logToSheetChecked(SERVE_FORM_NAME, fields);
    if (confirm) await sendServeConfirmation(s.email, s, cy.href);
  });

  if (!key) {
    return NextResponse.json({ method: "mailto" });
  }

  // The committee notice is the one step the response waits on: if it fails,
  // the form falls back to mailto so the committee still hears of the sign-up.
  try {
    const { error } = await new Resend(key).emails.send({
      from: sender("convention").from,
      to: SERVE_INBOX,
      replyTo: s.email,
      subject: `${SERVE_FORM_NAME} — CACNA`,
      html: serveNoticeHtml(Object.entries(fields).filter(([, v]) => v.trim())),
    });
    if (error) {
      console.error("[serve] Resend error:", error);
      return NextResponse.json({ method: "mailto" });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[serve] send failed:", err);
    return NextResponse.json({ method: "mailto" });
  }
}
