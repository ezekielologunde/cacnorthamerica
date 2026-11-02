import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { FORM_HEADER, HONEYPOT_FIELD, looksLikeSpam } from "@/lib/spam";
import { escapeHtml } from "@/lib/html";
import { sendContactAutoReply } from "@/lib/contactReplyEmail";
import { logToSheet } from "@/lib/sheetsWebhook";
import { EMAIL_FROM } from "@/lib/email";
import { CONTACT_FIELD_LIMITS, CONTACT_FORM_NAMES } from "./fields";

const FROM = EMAIL_FROM;
const TO   = "info@cacnorthamerica.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAY_MS = 24 * 60 * 60 * 1000;

function buildHtml(rows: [string, string][]): string {
  const trs = rows
    .map(([k, v]) => `<tr><td style="padding:8px 14px;font-weight:600;color:#5f5e5a;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td><td style="padding:8px 14px;color:#12141E">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:640px;margin:40px auto;background:#f9f8f6;border-radius:12px;overflow:hidden">
<div style="background:#12141E;padding:24px 32px"><p style="margin:0;font-size:18px;font-weight:700;color:#fff">CACNA</p></div>
<table style="width:100%;border-collapse:collapse;background:#fff">${trs}</table>
<p style="padding:16px 32px;font-size:12px;color:#888;margin:0">Sent via cacnorthamerica.com</p>
</body></html>`;
}

/** True only when the insert actually went through (supabase-js reports
 *  failures in `error` rather than throwing). */
async function saveToSupabase(fields: Record<string, string>): Promise<boolean> {
  const supabase = await createServiceClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name: fields["Name"],
    email: fields["Email"],
    subject: fields["Subject"] || null,
    message: fields["Message"],
  });
  if (error) console.error("[contact] Supabase insert error:", error.message);
  return !error;
}

/** The auto-reply goes to an address nobody has verified, so each address
 *  gets at most one a day: a per-instance burst guard, then a check against
 *  the shared contact_submissions table (which every instance writes to).
 *  Runs before this submission is saved. If the lookup fails, no reply. */
async function mayAutoReply(email: string): Promise<boolean> {
  if (!rateLimit(`contact-reply:${email.toLowerCase()}`, 1, DAY_MS)) return false;
  try {
    const supabase = await createServiceClient();
    const { count, error } = await supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      // ilike treats % and _ as wildcards; escape them so only this exact address matches.
      .ilike("email", email.replace(/[\\%_]/g, "\\$&"))
      .gte("created_at", new Date(Date.now() - DAY_MS).toISOString());
    return !error && count === 0;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!rateLimit(clientIp(req.headers), 5, 60_000)) {
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

  // Honeypot: bots fill every input, people never see this one.
  if (body[HONEYPOT_FIELD]) {
    return NextResponse.json({ success: true });
  }

  // Only the form's own formNames, so callers can't create new Sheets tabs.
  const { formName } = body;
  if (typeof formName !== "string" || !CONTACT_FORM_NAMES.has(formName)) {
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  }

  // Only the form's own field names (anything else is dropped before the
  // email, Supabase and Sheets), each a string within its length cap.
  const fields: Record<string, string> = {};
  for (const [name, max] of Object.entries(CONTACT_FIELD_LIMITS)) {
    const v = body[name];
    if (v === undefined) continue;
    if (typeof v !== "string" || v.length > max) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }
    fields[name] = v;
  }

  // Link-stuffed submissions are spam: drop them quietly with a normal-looking
  // success so bots learn nothing, and never save, log or email them.
  if (looksLikeSpam(Object.values(fields))) {
    return NextResponse.json({ success: true });
  }

  // The form always sends these three; refuse blank or malformed ones so an
  // empty post can't save a blank row or reach the inbox.
  const replyToRaw = (fields["Email"] || "").trim();
  if (!fields["Name"]?.trim() || !fields["Message"]?.trim() || !EMAIL_RE.test(replyToRaw)) {
    return NextResponse.json({ error: "Name, a valid email address and a message are required" }, { status: 400 });
  }

  const subject = `${formName} — CACNA`;
  const rows = Object.entries(fields).filter(([, v]) => v.trim());

  const replyTo = replyToRaw;
  const key = process.env.RESEND_API_KEY;
  const autoReply = key && replyTo ? await mayAutoReply(replyTo) : false;

  // Save to Supabase. Store the same trimmed address the auto-reply lookup
  // uses, or a padded Email value would never match its own earlier row and
  // dodge the daily cap. Awaited so a later email failure can tell whether
  // the message is already safely stored.
  const saved = await saveToSupabase({ ...fields, Email: replyToRaw }).catch((e) => {
    console.error("[contact] Supabase save failed:", e);
    return false;
  });

  // Log to Google Sheets — fire-and-forget (formula-escaped in logToSheet).
  logToSheet(formName, fields);

  if (!key) {
    return NextResponse.json({ method: "mailto" });
  }

  // Auto-reply to the submitter: a fixed courtesy confirmation that repeats
  // none of the submitted text, fire-and-forget so a failure here never
  // affects this route's response.
  if (autoReply && replyTo) {
    sendContactAutoReply(replyTo).catch((e) => console.error("[contact] auto-reply failed:", e));
  }

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo,
      subject,
      html: buildHtml(rows),
    });
    if (error) {
      console.error("[contact] Resend error:", error);
      // Already stored: opening the visitor's mail client too would send it twice.
      return NextResponse.json(saved ? { success: true } : { method: "mailto" });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(saved ? { success: true } : { method: "mailto" });
  }
}
