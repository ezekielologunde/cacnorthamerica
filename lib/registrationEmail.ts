import { Resend } from "resend";
import QRCode from "qrcode";
import { escapeHtml } from "@/lib/html";
import { emailShell, emailCard, EMAIL_FROM } from "@/lib/email";
import { paymentOptions } from "@/lib/registrationInfo";
import type { RegistrationSummary } from "@/lib/checkoutSummary";
import type { RegistrantCategory } from "@/lib/conventions";

const CATEGORY_LABEL: Record<RegistrantCategory, string> = {
  adult: "Adult",
  young_adult: "Young Adult",
  child: "Child",
};

/** Same SVG-vs-PNG tradeoff noted in lib/qr.ts: the confirmation page embeds
 *  an inline SVG string, but most email clients (Outlook, Gmail) won't
 *  render inline SVG in an <img>, so the email needs its own PNG data URI
 *  generated from the same `qrcode` library instead. */
async function renderQrCodePngDataUri(data: string): Promise<string> {
  return QRCode.toDataURL(data, { margin: 1, width: 240 });
}

function buildHtml(summary: RegistrationSummary, confirmationUrl: string, isPaid: boolean, qrDataUri: string | null): string {
  const statusLabel = summary.isComplimentary ? "Complimentary" : isPaid ? "Paid" : "Pending";
  const totalLabel = `$${(summary.totalAmountCents / 100).toFixed(2)}`;

  const registrantRows = summary.registrants
    .map(
      (r) =>
        `<tr><td style="padding:9px 0;font-size:14.5px;color:#12141E;border-bottom:1px solid #ECE9E4">${escapeHtml(r.n)}</td><td style="padding:9px 0;font-size:14.5px;color:#5f5e5a;text-align:right;border-bottom:1px solid #ECE9E4">${CATEGORY_LABEL[r.c] ?? "Adult"}</td></tr>`
    )
    .join("");

  const paymentCards = paymentOptions.map((o) => emailCard(escapeHtml(o.name), escapeHtml(o.detail))).join("");

  const qrBlock = qrDataUri
    ? `<div style="text-align:center;margin:26px 0 4px">
        <img src="${qrDataUri}" width="180" height="180" alt="Check-in QR code" style="display:inline-block;border:8px solid #fff;border-radius:12px;box-shadow:0 2px 10px rgba(18,20,30,.12)" />
        <p style="font-size:12.5px;color:#8a8983;margin:10px 0 0">Show this at check-in</p>
      </div>`
    : "";

  const bodyHtml = `<div style="background:#fff;border:1px solid #ECE9E4;border-radius:16px;padding:24px 26px">
      ${summary.churchName ? `<p style="margin:0 0 4px;font-weight:700;font-size:16px;color:#12141E">${escapeHtml(summary.churchName)}</p>` : ""}
      <p style="margin:0 0 16px;font-size:13.5px;color:#8a8983">${escapeHtml(summary.contactEmail)}</p>
      <table style="width:100%;border-collapse:collapse">${registrantRows}</table>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;padding-top:14px;border-top:1px solid #ECE9E4">
        <tr>
          <td style="font-size:11.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#C81E3A">${statusLabel}</td>
          <td style="font-size:18px;font-weight:800;color:#12141E;text-align:right">${totalLabel}</td>
        </tr>
      </table>
      ${qrBlock}
    </div>
    <div style="padding-top:20px">
      <h2 style="font-size:14px;font-weight:800;color:#12141E;margin:0 0 12px;text-transform:uppercase;letter-spacing:1.2px">Payment Options</h2>
      ${paymentCards}
    </div>`;

  return emailShell({
    heading: `You're registered for CACNA ${summary.year}!`,
    subheading: `Hi ${escapeHtml(summary.contactName)}, we've received your registration. Details are below.`,
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
 *  lib/sheetsWebhook.ts's logToSheet already degrades silently. */
export async function sendRegistrationConfirmationEmail(
  summary: RegistrationSummary,
  confirmationUrl: string,
  isPaid: boolean
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  try {
    const qrDataUri = isPaid ? await renderQrCodePngDataUri(confirmationUrl) : null;
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: summary.contactEmail,
      subject: `You're registered for CACNA ${summary.year}!`,
      html: buildHtml(summary, confirmationUrl, isPaid, qrDataUri),
    });
    if (error) {
      console.error("[registration email] Resend error:", error);
    }
  } catch (err) {
    console.error("[registration email] send failed:", err);
  }
}
