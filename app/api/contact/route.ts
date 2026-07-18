import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rateLimit";

const FROM = "CAC Salvation Center <noreply@cacsalvationcenter.org>";
const TO   = "info@cacsalvationcenter.org";

const ALLOWED_FORM_PREFIXES = ["Prayer request", "Testimony", "Contact —", "Contact Form"];
const MAX_FIELD_LENGTH = 10_000;
const MAX_FIELDS = 20;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function buildHtml(rows: [string, string][]): string {
  const trs = rows
    .map(([k, v]) => `<tr><td style="padding:8px 14px;font-weight:600;color:#5f5e5a;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td><td style="padding:8px 14px;color:#1B130E">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:640px;margin:40px auto;background:#f9f8f6;border-radius:12px;overflow:hidden">
<div style="background:#1B130E;padding:24px 32px"><p style="margin:0;font-size:18px;font-weight:700;color:#fff">CAC Salvation Center</p></div>
<table style="width:100%;border-collapse:collapse;background:#fff">${trs}</table>
<p style="padding:16px 32px;font-size:12px;color:#888;margin:0">Sent via cacsalvationcenter.org</p>
</body></html>`;
}

async function saveToSupabase(formName: string, fields: Record<string, string>): Promise<void> {
  const supabase = await createServiceClient();

  if (formName === "Prayer request") {
    await supabase.from("prayer_requests").insert({
      name: fields.name === "(anonymous)" ? null : (fields.name || null),
      email: fields.email === "(not provided)" ? null : (fields.email || null),
      request: fields.prayerRequest ?? "",
      urgent: fields.requestPastorCall?.startsWith("Yes") ?? false,
    });
  } else if (formName === "Testimony") {
    await supabase.from("testimonies").insert({
      name: fields.name === "(anonymous)" ? "Anonymous" : (fields.name || "Anonymous"),
      content: fields.testimony ?? "",
    });
  } else if (formName.startsWith("Contact —") || formName.startsWith("Contact Form")) {
    await supabase.from("contact_submissions").insert({
      name: fields["Name"] || fields.name || "Unknown",
      email: fields["Email"] || fields.email || "",
      subject: fields["Subject"] || fields.subject || null,
      message: fields["Message"] || fields.message || "",
    });
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { formName, ...rawFields } = body;

  // Validate formName
  if (typeof formName !== "string" || !ALLOWED_FORM_PREFIXES.some((p) => formName.startsWith(p))) {
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  }

  // Validate fields: all values must be strings within length limits
  if (Object.keys(rawFields).length > MAX_FIELDS) {
    return NextResponse.json({ error: "Too many fields" }, { status: 400 });
  }
  for (const [, v] of Object.entries(rawFields)) {
    if (typeof v !== "string" || v.length > MAX_FIELD_LENGTH) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }
  }
  const fields = rawFields as Record<string, string>;

  const subject = `${formName} — CAC Salvation Center`;
  const rows = Object.entries(fields).filter(([, v]) => v?.trim()) as [string, string][];

  // Save to Supabase — fire-and-forget
  saveToSupabase(formName, fields).catch((e) => console.error("[contact] Supabase save failed:", e));

  // Log to Google Sheets — fire-and-forget
  const hook = process.env.SHEETS_WEBHOOK;
  if (hook) {
    fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formName, ...fields }),
    }).catch((e) => console.error("[contact] Sheets webhook failed:", e));
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ method: "mailto" });
  }

  // Only use email as replyTo if it's a valid address
  const replyToRaw = fields.email || fields["Email"] || "";
  const replyTo = EMAIL_RE.test(replyToRaw.trim()) ? replyToRaw.trim() : undefined;

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
      return NextResponse.json({ method: "mailto" });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json({ method: "mailto" });
  }
}
