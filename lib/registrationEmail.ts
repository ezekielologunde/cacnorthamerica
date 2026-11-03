import { Resend } from "resend";
import { escapeHtml } from "@/lib/html";
import { emailShell, emailCard, sender } from "@/lib/email";
import { paymentOptions } from "@/lib/registrationInfo";
import type { RegistrationSummary } from "@/lib/checkoutSummary";
import { conventionYears, type RegistrantCategory } from "@/lib/conventions";
import { describeMeals, describeYouthRegistrant } from "@/lib/youthRegistration";
import { checkinCodesFor } from "@/lib/checkinCode";

const CATEGORY_LABEL: Record<RegistrantCategory, string> = {
  adult: "Adult",
  young_adult: "Young Adult",
  child: "Child",
};

function buildHtml(summary: RegistrationSummary, confirmationUrl: string, isPaid: boolean, processingFeeCents: number, zelleRef?: string): string {
  const statusLabel = zelleRef ? "Awaiting payment" : summary.isComplimentary ? "Complimentary" : isPaid ? "Paid" : "Pending";
  const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const totalLabel = dollars(summary.totalAmountCents + processingFeeCents);
  const feeRows = processingFeeCents > 0
    ? `<tr><td style="padding:0 0 6px;font-size:13.5px;color:#5f5e5a">Subtotal</td><td style="padding:0 0 6px;font-size:13.5px;color:#5f5e5a;text-align:right">${dollars(summary.totalAmountCents)}</td></tr>
        <tr><td style="padding:0 0 10px;font-size:13.5px;color:#5f5e5a">Processing fee</td><td style="padding:0 0 10px;font-size:13.5px;color:#5f5e5a;text-align:right">${dollars(processingFeeCents)}</td></tr>`
    : "";

  const startIso = conventionYears.find((cy) => cy.year === summary.year)?.startIso;
  const codes = checkinCodesFor(summary);
  const registrantRows = summary.registrants
    .map((r, i) => {
      // Youth & Child registrants, and adult individual-mode registrants,
      // also list their meals and allergy notes under their name.
      const youth = describeYouthRegistrant(r, startIso);
      const meals = youth ? youth.meals : describeMeals(r.m, startIso);
      const details = meals
        ? `<div style="font-size:12.5px;color:#8a8983;margin-top:3px;line-height:1.5">Meals: ${escapeHtml(meals.length > 0 ? meals.join(", ") : "None")}${r.l ? `<br>Allergies: ${escapeHtml(r.l)}` : ""}</div>`
        : "";
      const label = youth ? youth.ageGroup : (CATEGORY_LABEL[r.c] ?? "Adult");
      // The check-in code is the only check-in method, so it gets its own
      // row straight under the name, large and monospaced.
      const nameRow = `<tr><td style="padding:12px 0 0;font-size:14.5px;font-weight:700;color:#12141E">${escapeHtml(r.n)}</td><td style="padding:12px 0 0;font-size:14.5px;color:#5f5e5a;text-align:right;vertical-align:top">${escapeHtml(label)}</td></tr>`;
      const codeRow = `<tr><td colspan="2" style="padding:6px 0 12px;border-bottom:1px solid #ECE9E4"><div style="font-size:10.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#5f5e5a;margin:0 0 4px">Check-in code</div><div style="display:inline-block;font-family:Consolas,Menlo,'Courier New',monospace;font-size:28px;line-height:1.2;font-weight:700;color:#12141E;letter-spacing:6px;padding:4px 8px 4px 14px;background:#F6F4F0;border:1px solid #E2DED7;border-radius:8px;word-break:break-all">${escapeHtml(codes[i])}</div>${details}</td></tr>`;
      return nameRow + codeRow;
    })
    .join("");

  // Registered by Zelle: what to send, where (paymentOptions' Zelle entry,
  // never a second copy of the address) and the memo reference, instead of
  // the generic options. No processing fee on Zelle, so the amount due is
  // the subtotal.
  const zelle = paymentOptions.find((o) => o.kind === "zelle");
  const label = (text: string) => `<p style="margin:0 0 4px;font-size:10.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#5f5e5a">${text}</p>`;
  const zelleBlock = zelleRef && zelle
    ? `<div style="padding-top:20px">
      <h2 style="font-size:14px;font-weight:800;color:#12141E;margin:0 0 12px;text-transform:uppercase;letter-spacing:1.2px">Send your payment by Zelle</h2>
      <div style="background:#fff;border:1px solid #ECE9E4;border-radius:16px;padding:20px 22px">
        ${label("Amount due")}
        <p style="margin:0 0 14px;font-size:22px;font-weight:800;color:#12141E">${dollars(summary.totalAmountCents)}</p>
        ${label("Send to")}
        <p style="margin:0 0 14px;font-size:15px;font-weight:700;color:#12141E;word-break:break-all">${escapeHtml(zelle.copyValue ?? zelle.detail)}</p>
        ${label("Put this in the Zelle memo")}
        <div style="display:inline-block;font-family:Consolas,Menlo,'Courier New',monospace;font-size:24px;line-height:1.2;font-weight:700;color:#12141E;letter-spacing:3px;padding:4px 10px;background:#FFF4DC;border:1px solid #F2D9A6;border-radius:8px;word-break:break-all">${escapeHtml(zelleRef)}</div>
        <p style="margin:12px 0 0;font-size:13.5px;line-height:1.55;color:#5f5e5a">Put this reference in the Zelle memo exactly as shown: we match payments to the reference. Your spot is held and your check-in codes above work now; staff confirm your payment when the Zelle arrives.</p>
      </div>
    </div>`
    : "";

  // Nothing to pay on a $0 registration, so no payment options.
  const paymentBlock = zelleBlock ? zelleBlock : summary.totalAmountCents > 0
    ? `<div style="padding-top:20px">
      <h2 style="font-size:14px;font-weight:800;color:#12141E;margin:0 0 12px;text-transform:uppercase;letter-spacing:1.2px">Payment Options</h2>
      ${paymentOptions.map((o) => emailCard(escapeHtml(o.name), escapeHtml(o.detail))).join("")}
    </div>`
    : "";

  const bodyHtml = `<div style="background:#fff;border:1px solid #ECE9E4;border-radius:16px;padding:24px 26px">
      ${summary.churchName ? `<p style="margin:0 0 4px;font-weight:700;font-size:16px;color:#12141E">${escapeHtml(summary.churchName)}</p>` : ""}
      ${summary.dcc ? `<p style="margin:0 0 4px;font-size:13.5px;color:#5f5e5a">DCC / Zone: ${escapeHtml(summary.dcc)}</p>` : ""}
      <p style="margin:0 0 16px;font-size:13.5px;color:#8a8983">${escapeHtml(summary.contactEmail)}</p>
      <p style="margin:0 0 4px;font-size:13.5px;color:#12141E">Show your check-in code at check-in. Each person has their own.</p>
      <table style="width:100%;border-collapse:collapse">${registrantRows}</table>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;padding-top:14px;border-top:1px solid #ECE9E4">
        ${feeRows}
        <tr>
          <td style="font-size:11.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#C81E3A">${statusLabel}</td>
          <td style="font-size:18px;font-weight:800;color:#12141E;text-align:right">${totalLabel}</td>
        </tr>
      </table>
    </div>
    ${paymentBlock}`;

  return emailShell({
    heading: zelleRef ? `Registration received for CACNA ${summary.year}` : `You're registered for CACNA ${summary.year}!`,
    subheading: zelleRef
      ? `Hi ${escapeHtml(summary.contactName)}, your spot is held. Now send your payment by Zelle with the reference below.`
      : `Hi ${escapeHtml(summary.contactName)}, we've received your registration. Details are below.`,
    bodyHtml,
    ctaHref: confirmationUrl,
    ctaLabel: "View Your Confirmation Online →",
  });
}

/** Sends the registration confirmation email via Resend, following the same
 *  hand-rolled-HTML pattern as app/api/contact/route.ts (no templating
 *  engine is installed). Never throws -- a failed email shouldn't block a
 *  registration that already succeeded (payment captured / row logged), so
 *  every caller can just call this without its own try/catch, matching how
 *  lib/sheetsWebhook.ts's logToSheet already degrades silently. Resolves
 *  false when the send failed (true when sent, or skipped because Resend
 *  isn't configured), so the Stripe webhook can return 500 and be retried. */
export async function sendRegistrationConfirmationEmail(
  summary: RegistrationSummary,
  confirmationUrl: string,
  isPaid: boolean,
  /** Resend idempotency key (24h window) so a redelivered webhook never
   *  sends the same confirmation twice. */
  idempotencyKey?: string,
  /** Processing fee charged on top of summary.totalAmountCents (the subtotal). */
  processingFeeCents = 0,
  /** Set for a Zelle registration (POST /api/register, confirmByZelle):
   *  status "Awaiting payment", amount due, the Zelle recipient and the memo
   *  reference. Absent, the email is exactly as before. */
  zelle?: { zelleRef: string }
): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return true;

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      ...sender("convention"),
      to: summary.contactEmail,
      subject: zelle ? `Registration received for CACNA ${summary.year}: send your Zelle payment` : `You're registered for CACNA ${summary.year}!`,
      html: buildHtml(summary, confirmationUrl, isPaid, processingFeeCents, zelle?.zelleRef),
    }, idempotencyKey ? { idempotencyKey } : undefined);
    if (error) {
      console.error("[registration email] Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[registration email] send failed:", err);
    return false;
  }
}
