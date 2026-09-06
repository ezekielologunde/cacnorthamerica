import { Resend } from "resend";
import { escapeHtml } from "@/lib/html";
import { emailShell, EMAIL_FROM } from "@/lib/email";

export type ContactReplyInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function buildHtml(input: ContactReplyInput): string {
  const bodyHtml = `<div style="background:#fff;border:1px solid #ECE9E4;border-radius:16px;padding:24px 26px">
    <p style="margin:0 0 4px;font-weight:700;font-size:14px;color:#12141E">Your message</p>
    <p style="margin:0;font-size:14px;color:#5f5e5a;line-height:1.7;white-space:pre-wrap">${escapeHtml(input.message)}</p>
  </div>`;

  return emailShell({
    heading: "We've got your message!",
    subheading: `Hi ${escapeHtml(input.name)}, thank you for reaching out about "${escapeHtml(input.subject)}." Someone from our team will get back to you soon.`,
    bodyHtml,
  });
}

/** Never throws -- this is a courtesy auto-reply on top of the internal
 *  staff notification app/api/contact/route.ts already sends, so a failure
 *  here shouldn't affect that route's response. */
export async function sendContactAutoReply(input: ContactReplyInput): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: input.email,
      subject: `We've received your message — CACNA`,
      html: buildHtml(input),
    });
    if (error) {
      console.error("[contact auto-reply] Resend error:", error);
    }
  } catch (err) {
    console.error("[contact auto-reply] send failed:", err);
  }
}
