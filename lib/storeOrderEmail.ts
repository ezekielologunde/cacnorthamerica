import { Resend } from "resend";
import { escapeHtml } from "@/lib/html";
import { emailShell, sender } from "@/lib/email";

export type StoreOrderConfirmationInput = {
  /** Resend idempotency key (24h window) so a redelivered webhook never
   *  sends the same confirmation twice. */
  idempotencyKey?: string;
  contactName: string;
  contactEmail: string;
  /** Stripe line-item descriptions, e.g. "CACNA 2027 T-Shirt — L × 2". */
  items: string[];
  /** The order subtotal (items only). */
  totalLabel: string;
  /** Processing fee and amount actually charged; omitted when no fee. */
  feeLabel?: string;
  chargedLabel?: string;
  /** One-line shipping address collected at checkout; empty when none. */
  shippingAddress?: string;
};

function buildHtml(input: StoreOrderConfirmationInput): string {
  const itemRows = input.items
    .map((item) => `<li style="padding:8px 0;font-size:14.5px;color:#12141E;border-bottom:1px solid #ECE9E4">${escapeHtml(item)}</li>`)
    .join("");

  const bodyHtml = `<div style="background:#fff;border:1px solid #ECE9E4;border-radius:16px;padding:24px 26px">
    <ul style="margin:0 0 16px;padding:0;list-style:none">${itemRows}</ul>
    <table style="width:100%;border-collapse:collapse;padding-top:14px;border-top:1px solid #ECE9E4">
      ${input.feeLabel ? `<tr>
        <td style="padding:0 0 6px;font-size:13.5px;color:#5f5e5a">Subtotal</td>
        <td style="padding:0 0 6px;font-size:13.5px;color:#5f5e5a;text-align:right">${input.totalLabel}</td>
      </tr>
      <tr>
        <td style="padding:0 0 10px;font-size:13.5px;color:#5f5e5a">Processing fee</td>
        <td style="padding:0 0 10px;font-size:13.5px;color:#5f5e5a;text-align:right">${input.feeLabel}</td>
      </tr>` : ""}
      <tr>
        <td style="font-size:11.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#C81E3A">Paid</td>
        <td style="font-size:18px;font-weight:800;color:#12141E;text-align:right">${input.chargedLabel ?? input.totalLabel}</td>
      </tr>
    </table>
    ${input.shippingAddress ? `<p style="margin:16px 0 0;font-size:13.5px;color:#12141E"><strong>Shipping to:</strong> ${escapeHtml(input.shippingAddress)}</p>` : ""}
  </div>`;

  return emailShell({
    heading: "Order confirmed!",
    subheading: `Hi ${escapeHtml(input.contactName)}, thank you for your order from the CACNA Store.`,
    bodyHtml,
  });
}

/** Never throws -- mirrors lib/registrationEmail.ts's contract; the payment
 *  already succeeded on Stripe's side, so a failed confirmation email
 *  shouldn't surface as an error to the webhook caller.
 *  Resolves false when the send failed (true when sent or skipped), so the
 *  Stripe webhook can return 500 and be retried. */
export async function sendStoreOrderConfirmationEmail(input: StoreOrderConfirmationInput): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !input.contactEmail) return true;

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      ...sender("store"),
      to: input.contactEmail,
      subject: "Your CACNA Store order",
      html: buildHtml(input),
    }, input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined);
    if (error) {
      console.error("[store order email] Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[store order email] send failed:", err);
    return false;
  }
}
