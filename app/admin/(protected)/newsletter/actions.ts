"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type BroadcastState = {
  ok: boolean;
  sent: number;
  failed: number;
  message: string;
} | null;

function buildBroadcastHtml(subject: string, body: string): string {
  const bodyHtml = body
    .split("\n")
    .map((line) => `<p style="margin:0 0 14px">${line}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Georgia,serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden">
    <div style="background:#1B130E;padding:28px 32px">
      <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#E8A33D;margin-bottom:6px">CAC Salvation Center</div>
      <div style="font-size:22px;font-weight:700;color:#fff">${subject}</div>
    </div>
    <div style="padding:28px 32px">
      <div style="font-size:15px;color:#1B130E;line-height:1.8">${bodyHtml}</div>
    </div>
    <div style="padding:20px 32px;border-top:1px solid #ede9e4;font-size:12px;color:#999">
      You're receiving this because you subscribed at
      <a href="https://www.cacsalvationcenter.org" style="color:#D62828">cacsalvationcenter.org</a>.
    </div>
  </div>
</body>
</html>`;
}

export async function broadcastAction(
  _prev: BroadcastState,
  formData: FormData,
): Promise<BroadcastState> {
  await requireAdmin();

  const subject = (formData.get("subject") as string | null)?.trim() ?? "";
  const body = (formData.get("body") as string | null)?.trim() ?? "";

  if (!subject) return { ok: false, sent: 0, failed: 0, message: "Subject is required." };
  if (!body) return { ok: false, sent: 0, failed: 0, message: "Message body is required." };
  if (subject.length > 200)
    return { ok: false, sent: 0, failed: 0, message: "Subject must be 200 characters or fewer." };
  if (body.length > 10000)
    return { ok: false, sent: 0, failed: 0, message: "Body must be 10,000 characters or fewer." };

  const supabase = createServiceClient();
  const { data: subscribers, error: fetchError } = await supabase
    .from("newsletter_subscribers")
    .select("email, name")
    .eq("active", true);

  if (fetchError) {
    console.error("[broadcast] Fetch error:", fetchError.message);
    return { ok: false, sent: 0, failed: 0, message: "Failed to fetch subscribers." };
  }

  if (!subscribers || subscribers.length === 0) {
    return { ok: false, sent: 0, failed: 0, message: "No active subscribers." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, sent: 0, failed: 0, message: "Email service is not configured." };
  }

  const resend = new Resend(apiKey);
  const html = buildBroadcastHtml(subject, body);

  let sent = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    try {
      await resend.emails.send({
        from: "CAC Salvation Center <noreply@cacsalvationcenter.org>",
        to: subscriber.email,
        subject,
        html,
      });
      sent++;
    } catch (err) {
      console.error("[broadcast] Failed to send to", subscriber.email, err);
      failed++;
    }
  }

  return {
    ok: true,
    sent,
    failed,
    message: `Sent to ${sent} subscriber${sent !== 1 ? "s" : ""}.${failed > 0 ? ` ${failed} failed.` : ""}`,
  };
}
