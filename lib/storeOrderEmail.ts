import { Resend } from "resend";
import { escapeHtml } from "@/lib/html";
import { emailShell, EMAIL_FROM } from "@/lib/email";

export type StoreOrderConfirmationInput = {
  contactName: string;
  contactEmail: string;
  /** Stripe line-item descriptions, e.g. "CACNA 2027 T-Shirt — L × 2". */
  items: string[];
  totalLabel: string;
};

function buildHtml(input: StoreOrderConfirmationInput): string {
  const itemRows = input.items
    .map((item) => `<li style="padding:8px 0;font-size:14.5px;color:#12141E;border-bottom:1px solid #ECE9E4">${escapeHtml(item)}</li>`)
    .join("");

  const bodyHtml = `<div style="background:#fff;border:1px solid #ECE9E4;border-radius:16px;padding:24px 26px">
    <ul style="margin:0 0 16px;padding:0;list-style:none">${itemRows}</ul>
    <table style="width:100%;border-collapse:collapse;padding-top:14px;border-top:1px solid #ECE9E4">
      <tr>
        <td style="font-size:11.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#C81E3A">Paid</td>
        <td style="font-size:18px;font-weight:800;color:#12141E;text-align:right">${input.totalLabel}</td>
      </tr>
    </table>
  </div>`;

  return emailShell({
    heading: "Order confirmed!",
    subheading: `Hi ${escapeHtml(input.contactName)}, thank you for your order from the CACNA Store.`,
    bodyHtml,
  });
}

/** Never throws -- mirrors lib/registrationEmail.ts's contract; the payment
 *  already succeeded on Stripe's side, so a failed confirmation email
 *  shouldn't surface as an error to the webhook caller. */
export async function sendStoreOrderConfirmationEmail(input: StoreOrderConfirmationInput): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !input.contactEmail) return;

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: input.contactEmail,
      subject: "Your CACNA Store order",
      html: buildHtml(input),
    });
    if (error) {
      console.error("[store order email] Resend error:", error);
    }
  } catch (err) {
    console.error("[store order email] send failed:", err);
  }
}
