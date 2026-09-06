import { Resend } from "resend";
import { escapeHtml } from "@/lib/html";
import { emailShell, EMAIL_FROM } from "@/lib/email";

export type GivingConfirmationInput = {
  contactName: string;
  contactEmail: string;
  campaignTitle: string;
  totalLabel: string;
};

function buildHtml(input: GivingConfirmationInput): string {
  const bodyHtml = `<div style="background:#fff;border:1px solid #ECE9E4;border-radius:16px;padding:24px 26px">
    <div style="font-size:11.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#C81E3A;margin-bottom:6px">Campaign</div>
    <div style="font-size:16px;font-weight:700;color:#12141E;margin-bottom:18px">${escapeHtml(input.campaignTitle)}</div>
    <table style="width:100%;border-collapse:collapse;padding-top:14px;border-top:1px solid #ECE9E4">
      <tr>
        <td style="font-size:11.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#C81E3A">Given</td>
        <td style="font-size:18px;font-weight:800;color:#12141E;text-align:right">${input.totalLabel}</td>
      </tr>
    </table>
  </div>`;

  return emailShell({
    heading: "Thank you for your gift!",
    subheading: `Hi ${escapeHtml(input.contactName)}, your generosity fuels CACNA's ministries and the Annual Convention.`,
    bodyHtml,
  });
}

/** Never throws -- the payment already succeeded on Stripe's side, so a
 *  failed confirmation email shouldn't surface as an error to the webhook
 *  caller (same contract as lib/registrationEmail.ts / lib/storeOrderEmail.ts). */
export async function sendGivingConfirmationEmail(input: GivingConfirmationInput): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !input.contactEmail) return;

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: input.contactEmail,
      subject: "Thank you for your gift to CACNA",
      html: buildHtml(input),
    });
    if (error) {
      console.error("[giving email] Resend error:", error);
    }
  } catch (err) {
    console.error("[giving email] send failed:", err);
  }
}
