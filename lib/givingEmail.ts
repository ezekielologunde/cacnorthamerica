import { Resend } from "resend";
import { escapeHtml } from "@/lib/html";
import { emailCard, emailShell, sender } from "@/lib/email";
import { SITE } from "@/lib/site";

export type GivingConfirmationInput = {
  /** Resend idempotency key (24h window) so a redelivered webhook never
   *  sends the same confirmation twice. */
  idempotencyKey?: string;
  contactName: string;
  contactEmail: string;
  campaignTitle: string;
  /** The gift amount the donor chose. */
  totalLabel: string;
  /** Processing fee and amount actually charged; omitted when no fee. */
  feeLabel?: string;
  chargedLabel?: string;
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
      ${input.feeLabel ? `<tr>
        <td style="padding-top:8px;font-size:13.5px;color:#5f5e5a">Processing fee</td>
        <td style="padding-top:8px;font-size:13.5px;color:#5f5e5a;text-align:right">${input.feeLabel}</td>
      </tr>
      <tr>
        <td style="padding-top:4px;font-size:13.5px;color:#5f5e5a">Total charged</td>
        <td style="padding-top:4px;font-size:13.5px;color:#5f5e5a;text-align:right">${input.chargedLabel ?? input.totalLabel}</td>
      </tr>` : ""}
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
 *  caller (same contract as lib/registrationEmail.ts / lib/storeOrderEmail.ts).
 *  Resolves false when the send failed (true when sent or skipped), so the
 *  Stripe webhook can return 500 and be retried. */
export async function sendGivingConfirmationEmail(input: GivingConfirmationInput): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !input.contactEmail) return true;

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      ...sender("giving"),
      to: input.contactEmail,
      subject: "Thank you for your gift to CACNA",
      html: buildHtml(input),
    }, input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined);
    if (error) {
      console.error("[giving email] Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[giving email] send failed:", err);
    return false;
  }
}

export type ZelleGiftInput = {
  contactName: string;
  contactEmail: string;
  campaignTitle: string;
  /** Formatted for display, e.g. "$50.00". */
  amountLabel: string;
  recipient: string;
  zelleRef: string;
};

function zelleDonorHtml(input: ZelleGiftInput): string {
  const bodyHtml = [
    emailCard("Send", `${escapeHtml(input.amountLabel)} by Zelle to <strong>${escapeHtml(input.recipient)}</strong>`),
    emailCard(
      "Put this in the Zelle memo",
      `<strong style="font-family:Consolas,Menlo,monospace;font-size:18px;letter-spacing:2px;color:#12141E">${escapeHtml(input.zelleRef)}</strong><br/>We match each payment to its reference, so add it exactly as shown.`,
    ),
    emailCard("Gift to", escapeHtml(input.campaignTitle)),
    emailCard(
      "Before you send",
      "Zelle payments can&rsquo;t be reversed, so check that the address above matches what you type into your bank app. If you would like a receipt for your records, or have any question, reply to this email.",
    ),
  ].join("");

  return emailShell({
    heading: "Your Zelle gift details",
    subheading: `Hi ${escapeHtml(input.contactName)}, your gift isn&rsquo;t complete until you send the payment from your bank app.`,
    bodyHtml,
  });
}

function zelleCommitteeHtml(input: ZelleGiftInput): string {
  const bodyHtml = [
    emailCard("Donor", `${escapeHtml(input.contactName)} · ${escapeHtml(input.contactEmail)}`),
    emailCard("Campaign", escapeHtml(input.campaignTitle)),
    emailCard("Amount", escapeHtml(input.amountLabel)),
    emailCard("Zelle reference", `<strong style="font-family:Consolas,Menlo,monospace">${escapeHtml(input.zelleRef)}</strong>`),
    emailCard("Status", "Not received yet. Match it to the Zelle deposit by reference, name and amount, and reply to this email to reach the donor."),
  ].join("");

  return emailShell({
    heading: "A Zelle gift is on its way",
    subheading: "Someone asked how to give by Zelle on cacna.org.",
    bodyHtml,
  });
}

/** Tells the committee to expect the payment. Never throws; resolves true when
 *  the email was sent, which makes it one of the two records of the pledge. */
export async function sendZelleCommitteeEmail(input: ZelleGiftInput): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ");
  try {
    const { error } = await new Resend(key).emails.send({
      ...sender("giving"),
      to: SITE.email,
      replyTo: input.contactEmail,
      subject: oneLine(`Zelle gift coming: ${input.amountLabel} for ${input.campaignTitle} (${input.zelleRef})`),
      html: zelleCommitteeHtml(input),
    });
    if (error) console.error("[giving zelle] committee email failed:", error);
    return !error;
  } catch (err) {
    console.error("[giving zelle] committee email send failed:", err);
    return false;
  }
}

/** Emails the donor their Zelle instructions. Never throws; resolves true when
 *  sent, so the page can say whether to copy the details down now. Call it only
 *  after the pledge is recorded (see lib/zellePledge.ts). */
export async function sendZelleDonorEmail(input: ZelleGiftInput): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !input.contactEmail) return false;
  try {
    const { error } = await new Resend(key).emails.send({
      ...sender("giving"),
      to: input.contactEmail,
      subject: "Your Zelle gift details — CACNA",
      html: zelleDonorHtml(input),
    });
    if (error) console.error("[giving zelle] donor email failed:", error);
    return !error;
  } catch (err) {
    console.error("[giving zelle] donor email send failed:", err);
    return false;
  }
}
