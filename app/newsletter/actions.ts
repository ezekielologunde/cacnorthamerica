"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { headers } from "next/headers";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { HONEYPOT_FIELD } from "@/lib/spam";
import { SITE_URL } from "@/lib/site";
import { logToSheet } from "@/lib/sheetsWebhook";
import { sender, emailLogoHtml } from "@/lib/email";

export type SubscribeState = { ok: boolean; message: string } | null;

// Fixed text only: the form sends no name, so none is accepted (a submitted
// name would otherwise reach this HTML, sent to an unverified address).
function welcomeHtml(): string {
  const greeting = "Hi there,";
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F9F8F6;font-family:Georgia,serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(18,20,30,.10)">
    <div style="background:#12141E;padding:36px 40px;text-align:center">
      ${emailLogoHtml()}
      <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(245,246,250,.45)">CACNA</p>
      <h1 style="margin:0;font-size:34px;font-weight:800;color:#fff;letter-spacing:-0.5px;line-height:1.1">You're in the family.</h1>
    </div>
    <div style="padding:40px">
      <p style="font-size:17px;color:#12141E;line-height:1.75;margin:0 0 18px">${greeting}</p>
      <p style="font-size:16px;color:#12141E;line-height:1.75;margin:0 0 18px">
        Thank you for subscribing to <strong>CACNA</strong> updates.
        You'll hear from us about the Annual Convention, upcoming events, devotionals, and ways to get involved across CACNA's member churches.
      </p>
      <div style="text-align:center;margin-bottom:36px">
        <a href="${SITE_URL}/online" style="display:inline-block;background:#C81E3A;color:#fff;font-weight:700;font-size:15px;padding:15px 36px;border-radius:999px;text-decoration:none;box-shadow:0 8px 20px rgba(200,30,58,.30)">
          Watch Online →
        </a>
      </div>
      <div style="background:#F9F8F6;border-radius:12px;padding:24px;margin-bottom:32px">
        <p style="font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#C81E3A;margin:0 0 12px">How We Gather</p>
        <p style="font-size:14px;color:#12141E;line-height:1.8;margin:0">
          📅 <strong>Annual Convention</strong> — July, CAC Village, PA<br>
          🙏 <strong>Morning Prayer Line</strong> — Daily 5:00 AM ET · (857) 216-6700
        </p>
      </div>
      <hr style="border:none;border-top:1px solid rgba(18,20,30,.08);margin:0 0 24px">
      <p style="font-size:12px;color:rgba(18,20,30,.4);line-height:1.7;margin:0">
        You're receiving this because you subscribed at
        <a href="https://cacna.org" style="color:#C81E3A;text-decoration:none">cacna.org</a>.
        Questions? Email us at
        <a href="mailto:info@cacna.org" style="color:#C81E3A;text-decoration:none">info@cacna.org</a>.
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function subscribeAction(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  if (!rateLimit(clientIp(await headers()), 5, 60_000)) {
    return { ok: false, message: "Too many requests. Please try again in a minute." };
  }

  // Honeypot: bots fill every input, people never see this one.
  if (formData.get(HONEYPOT_FIELD)) {
    return { ok: true, message: "You're in! Welcome to the family." };
  }

  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  // Plain insert, not upsert, so an address that unsubscribed can never be
  // re-activated from this public form. Written with the service client so
  // direct anon inserts can be revoked (see the admin hardening migration).
  // An address that's already on the list (23505) counts as success, but gets
  // no second welcome email.
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, active: true, source: "website" });

  if (error?.code === "23505") {
    return { ok: true, message: "You're in! Welcome to the family." };
  }
  if (error) {
    console.error("Newsletter subscribe error:", error.message);
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  logToSheet("Newsletter Signup", { "Email": email });

  // Send welcome email — fire-and-forget, never blocks the response
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    new Resend(apiKey).emails.send({
      ...sender("general"),
      to: email,
      subject: "Welcome to CACNA 🙏",
      html: welcomeHtml(),
    }).catch((e) => console.error("[newsletter] Welcome email failed:", e));
  }

  return { ok: true, message: "You're in! Welcome to the family." };
}
