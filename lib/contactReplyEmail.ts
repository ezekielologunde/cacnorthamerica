import { Resend } from "resend";
import { emailShell, sender } from "@/lib/email";

// A fixed message that repeats none of the submitted text. The address it
// goes to is whatever the form was given and has never been verified, so
// echoing the visitor's name, subject or message would let anyone send their
// own words to any inbox from info@cacnorthamerica.com.
function buildHtml(): string {
  const bodyHtml = `<div style="background:#fff;border:1px solid #ECE9E4;border-radius:16px;padding:24px 26px">
    <p style="margin:0;font-size:14px;color:#5f5e5a;line-height:1.7">If you didn't contact CACNA through our website, you can safely ignore this email.</p>
  </div>`;

  return emailShell({
    heading: "We've got your message!",
    subheading: "Thank you for reaching out to CACNA. Someone from our team will get back to you soon.",
    bodyHtml,
  });
}

/** Never throws -- this is a courtesy auto-reply on top of the internal
 *  staff notification app/api/contact/route.ts already sends, so a failure
 *  here shouldn't affect that route's response. */
export async function sendContactAutoReply(email: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      ...sender("general"),
      to: email,
      subject: `We've received your message — CACNA`,
      html: buildHtml(),
    });
    if (error) {
      console.error("[contact auto-reply] Resend error:", error);
    }
  } catch (err) {
    console.error("[contact auto-reply] send failed:", err);
  }
}
