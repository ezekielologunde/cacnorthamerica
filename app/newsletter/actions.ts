"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rateLimit";

export type SubscribeState = { ok: boolean; message: string } | null;

function welcomeHtml(name: string | null): string {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F9F8F6;font-family:Georgia,serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(27,19,14,.10)">
    <div style="background:#1B130E;padding:36px 40px;text-align:center">
      <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,247,239,.45)">CACNA</p>
      <h1 style="margin:0;font-size:34px;font-weight:800;color:#fff;letter-spacing:-0.5px;line-height:1.1">You're in the family.</h1>
    </div>
    <div style="padding:40px">
      <p style="font-size:17px;color:#1B130E;line-height:1.75;margin:0 0 18px">${greeting}</p>
      <p style="font-size:16px;color:#1B130E;line-height:1.75;margin:0 0 18px">
        Thank you for subscribing to <strong>CACNA</strong> updates.
        You'll hear from us about the Annual Convention, upcoming events, devotionals, and ways to get involved across CACNA's member churches.
      </p>
      <div style="text-align:center;margin-bottom:36px">
        <a href="https://www.cacnorthamerica.com/online" style="display:inline-block;background:#1F4D3D;color:#fff;font-weight:700;font-size:15px;padding:15px 36px;border-radius:999px;text-decoration:none;box-shadow:0 8px 20px rgba(31,77,61,.30)">
          Watch Online →
        </a>
      </div>
      <div style="background:#F9F8F6;border-radius:12px;padding:24px;margin-bottom:32px">
        <p style="font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#1F4D3D;margin:0 0 12px">How We Gather</p>
        <p style="font-size:14px;color:#1B130E;line-height:1.8;margin:0">
          📅 <strong>Annual Convention</strong> — July, CAC Village, PA<br>
          🙏 <strong>Morning Prayer Line</strong> — Daily 5:00 AM ET · (857) 216-6700
        </p>
      </div>
      <hr style="border:none;border-top:1px solid rgba(27,19,14,.08);margin:0 0 24px">
      <p style="font-size:12px;color:rgba(27,19,14,.4);line-height:1.7;margin:0">
        You're receiving this because you subscribed at
        <a href="https://www.cacnorthamerica.com" style="color:#1F4D3D;text-decoration:none">cacnorthamerica.com</a>.
        Questions? Email us at
        <a href="mailto:info@cacnorthamerica.com" style="color:#1F4D3D;text-decoration:none">info@cacnorthamerica.com</a>.
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
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (!rateLimit(ip, 5, 60_000)) {
    return { ok: false, message: "Too many requests. Please try again in a minute." };
  }

  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const name = (formData.get("name") as string | null)?.trim() || null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email, name, active: true, source: "website" }, { onConflict: "email" });

  if (error) {
    console.error("Newsletter subscribe error:", error.message);
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  // Send welcome email — fire-and-forget, never blocks the response
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    new Resend(apiKey).emails.send({
      from: "CACNA <noreply@cacnorthamerica.com>",
      to: email,
      subject: "Welcome to CACNA 🙏",
      html: welcomeHtml(name),
    }).catch((e) => console.error("[newsletter] Welcome email failed:", e));
  }

  return { ok: true, message: "You're in! Welcome to the family." };
}
