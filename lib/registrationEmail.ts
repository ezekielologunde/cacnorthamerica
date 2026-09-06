import { Resend } from "resend";
import QRCode from "qrcode";
import { escapeHtml } from "@/lib/html";
import { paymentOptions } from "@/lib/registrationInfo";
import type { RegistrationSummary } from "@/lib/checkoutSummary";
import type { RegistrantCategory } from "@/lib/conventions";

const FROM = "CACNA <noreply@cacnorthamerica.com>";

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

  const paymentCards = paymentOptions
    .map(
      (option) =>
        `<div style="background:#fff;border:1px solid #ECE9E4;border-radius:12px;padding:14px 16px;margin-bottom:10px">
          <div style="font-weight:700;font-size:14px;color:#12141E;margin-bottom:3px">${escapeHtml(option.name)}</div>
          <div style="font-size:13px;color:#5f5e5a;line-height:1.5">${escapeHtml(option.detail)}</div>
        </div>`
    )
    .join("");

  const qrBlock = qrDataUri
    ? `<div style="text-align:center;margin:26px 0 4px">
        <img src="${qrDataUri}" width="180" height="180" alt="Check-in QR code" style="display:inline-block;border:8px solid #fff;border-radius:12px;box-shadow:0 2px 10px rgba(18,20,30,.12)" />
        <p style="font-size:12.5px;color:#8a8983;margin:10px 0 0">Show this at check-in</p>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#ECE9E4;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#F5F6FA">
    <div style="height:5px;background:linear-gradient(90deg,#7A1128,#C81E3A,#FDC841)"></div>
    <div style="background:#12141E;padding:30px 32px;text-align:center">
      <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2.5px;color:#FDC841;text-transform:uppercase">Christ Apostolic Church</p>
      <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#fff">North America</p>
    </div>
    <div style="background:#12141E;padding:0 32px 40px;text-align:center">
      <h1 style="margin:0 0 10px;font-size:26px;font-weight:800;color:#fff;line-height:1.15">You're registered for CACNA ${summary.year}!</h1>
      <p style="margin:0;font-size:14.5px;color:rgba(245,246,250,.7);line-height:1.6">Hi ${escapeHtml(summary.contactName)}, we've received your registration. Details are below.</p>
    </div>
    <div style="padding:28px 32px 8px">
      <div style="background:#fff;border:1px solid #ECE9E4;border-radius:16px;padding:24px 26px">
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
    </div>
    <div style="padding:20px 32px 8px">
      <h2 style="font-size:14px;font-weight:800;color:#12141E;margin:0 0 12px;text-transform:uppercase;letter-spacing:1.2px">Payment Options</h2>
      ${paymentCards}
    </div>
    <div style="padding:8px 32px 32px">
      <a href="${confirmationUrl}" style="display:block;text-align:center;background:#FDC841;color:#12141E;font-weight:800;font-size:14.5px;padding:14px 20px;border-radius:999px;text-decoration:none">View Your Confirmation Online →</a>
    </div>
    <div style="padding:16px 32px 28px;border-top:1px solid #ECE9E4">
      <p style="font-size:12px;color:#8a8983;margin:0">Sent via cacnorthamerica.com · Questions? Reply to this email.</p>
    </div>
  </div>
</body>
</html>`;
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
      from: FROM,
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
