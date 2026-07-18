import Stripe from "stripe";
import { Resend } from "resend";
import { headers } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Stripe(key, { apiVersion: "2024-06-20" as any });
}

const FROM = "CAC Salvation Center <noreply@cacsalvationcenter.org>";
const STAFF_EMAIL = "info@cacsalvationcenter.org";

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

// ─── Customer order confirmation ────────────────────────────────────────────

function buildOrderEmail(session: Stripe.Checkout.Session): string {
  const customerDetails = session.customer_details;
  const name = customerDetails?.name;
  const items = session.line_items?.data ?? [];
  const total = session.amount_total ?? 0;
  const address = customerDetails?.address;

  const greeting = name ? `Hi ${name.split(" ")[0]},` : "Hello,";

  const itemRows = items.length > 0
    ? items
        .map(
          (li) => `
          <tr>
            <td style="padding:10px 16px;font-size:14px;color:#1B130E;border-bottom:1px solid #ede9e4">${li.description ?? "Item"}</td>
            <td style="padding:10px 16px;font-size:14px;color:#5f5e5a;text-align:center;border-bottom:1px solid #ede9e4">${li.quantity ?? 1}</td>
            <td style="padding:10px 16px;font-size:14px;font-weight:700;color:#1B130E;text-align:right;border-bottom:1px solid #ede9e4">${fmt(li.amount_total ?? 0)}</td>
          </tr>`
        )
        .join("")
    : `<tr><td colspan="3" style="padding:10px 16px;font-size:14px;color:#5f5e5a;text-align:center">Order details unavailable</td></tr>`;

  const shippingBlock = address
    ? `<div style="margin-top:24px;background:#f9f8f6;border-radius:10px;padding:16px 20px">
        <div style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#E8A33D;margin-bottom:8px">Shipping to</div>
        <div style="font-size:14px;color:#1B130E;line-height:1.7">
          ${name ? `${name}<br>` : ""}
          ${address.line1 ?? ""}${address.line2 ? `, ${address.line2}` : ""}<br>
          ${address.city ?? ""}, ${address.state ?? ""} ${address.postal_code ?? ""}<br>
          ${address.country ?? ""}
        </div>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Georgia,serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(27,19,14,.1)">

        <!-- Header -->
        <tr>
          <td style="background:#1B130E;padding:28px 32px">
            <div style="font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#E8A33D;margin-bottom:6px">CAC Salvation Center</div>
            <div style="font-size:26px;font-weight:700;color:#fff;line-height:1.2">Your order is confirmed 🙏</div>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:28px 32px 0">
            <p style="margin:0;font-size:16px;color:#1B130E;line-height:1.7">${greeting}</p>
            <p style="margin:12px 0 0;font-size:15px;color:#5f5e5a;line-height:1.7">
              Thank you for your purchase — your support means everything to the ministry.
              Here's a summary of what you ordered.
            </p>
          </td>
        </tr>

        <!-- Items table -->
        <tr>
          <td style="padding:24px 32px 0">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #ede9e4;border-radius:10px;overflow:hidden">
              <thead>
                <tr style="background:#f9f8f6">
                  <th style="padding:10px 16px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#5f5e5a;text-align:left">Item</th>
                  <th style="padding:10px 16px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#5f5e5a;text-align:center">Qty</th>
                  <th style="padding:10px 16px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#5f5e5a;text-align:right">Price</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>
            <div style="margin-top:12px;text-align:right">
              <div style="background:#1B130E;display:inline-block;padding:12px 20px;border-radius:10px">
                <span style="font-size:12px;color:rgba(255,247,239,.6);letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:4px">Order total</span>
                <span style="font-size:24px;font-weight:700;color:#fff">${fmt(total)}</span>
              </div>
            </div>
          </td>
        </tr>

        <!-- Shipping -->
        <tr>
          <td style="padding:0 32px">${shippingBlock}</td>
        </tr>

        <!-- What happens next -->
        <tr>
          <td style="padding:28px 32px 0">
            <div style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#D62828;margin-bottom:16px">What happens next</div>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #ede9e4;vertical-align:top;width:28px">
                  <div style="width:24px;height:24px;background:#f9f8f6;border-radius:50%;font-size:12px;font-weight:700;color:#D62828;text-align:center;line-height:24px">1</div>
                </td>
                <td style="padding:12px 0 12px 12px;border-bottom:1px solid #ede9e4;font-size:14px;color:#1B130E;line-height:1.6">
                  <strong>Physical items</strong> ship within 5 business days to the address you provided.
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;vertical-align:top;width:28px">
                  <div style="width:24px;height:24px;background:#f9f8f6;border-radius:50%;font-size:12px;font-weight:700;color:#D62828;text-align:center;line-height:24px">2</div>
                </td>
                <td style="padding:12px 0 12px 12px;font-size:14px;color:#1B130E;line-height:1.6">
                  <strong>Questions?</strong> Reach us on WhatsApp at
                  <a href="https://wa.me/14432726794" style="color:#25D366;font-weight:700;text-decoration:none"> +1 (443) 272-6794</a>
                  with your order details.
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:28px 32px;border-top:1px solid #ede9e4;margin-top:28px">
            <p style="margin:0;font-size:13px;color:#888;line-height:1.7">
              Every purchase supports the building project, outreach, and the ministry of CAC Salvation Center.
              We are grateful for you. 🙏
            </p>
            <p style="margin:12px 0 0;font-size:12px;color:#aaa">
              <a href="https://cacsalvationcenter.org" style="color:#D62828;text-decoration:none;font-weight:700">cacsalvationcenter.org</a>
              &nbsp;·&nbsp; Randallstown, Maryland
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendOrderEmail(session: Stripe.Checkout.Session): Promise<void> {
  const email = session.customer_details?.email;
  if (!email || !process.env.RESEND_API_KEY) return;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const name = session.customer_details?.name;
    const subject = name
      ? `Order confirmed, ${name.split(" ")[0]} — CAC Salvation Center`
      : "Order confirmed — CAC Salvation Center";
    await resend.emails.send({
      from: FROM,
      to: email,
      subject,
      html: buildOrderEmail(session),
    });
    console.log("[webhook] Order email sent to:", email);
  } catch (err) {
    console.error("[webhook] Failed to send order email:", err);
  }
}

// ─── Staff notification on new order ────────────────────────────────────────

async function sendStaffOrderEmail(session: Stripe.Checkout.Session): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const name = session.customer_details?.name ?? null;
    const email = session.customer_details?.email ?? "";
    const phone = session.customer_details?.phone ?? null;
    const total = session.amount_total ?? 0;
    const items = session.line_items?.data ?? [];
    const shipping = session.collected_information?.shipping_details ?? null;

    const subject = `New order — ${name ?? email} · ${fmt(total)}`;

    const itemRows = items.length > 0
      ? items
          .map(
            (li) => `
            <tr>
              <td style="padding:8px 12px;font-size:13px;color:#1B130E;border-bottom:1px solid #ede9e4">${li.description ?? "Item"}</td>
              <td style="padding:8px 12px;font-size:13px;color:#5f5e5a;text-align:center;border-bottom:1px solid #ede9e4">${li.quantity ?? 1}</td>
              <td style="padding:8px 12px;font-size:13px;font-weight:700;color:#1B130E;text-align:right;border-bottom:1px solid #ede9e4">${fmt(li.amount_total ?? 0)}</td>
            </tr>`
          )
          .join("")
      : `<tr><td colspan="3" style="padding:8px 12px;font-size:13px;color:#5f5e5a;text-align:center">No items</td></tr>`;

    const shippingBlock = shipping?.address
      ? `<div style="margin-top:16px">
          <div style="font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#E8A33D;margin-bottom:6px">Ship to</div>
          <div style="font-size:13px;color:#1B130E;line-height:1.6">
            ${shipping.name ? `${shipping.name}<br>` : ""}
            ${shipping.address.line1 ?? ""}${shipping.address.line2 ? `, ${shipping.address.line2}` : ""}<br>
            ${shipping.address.city ?? ""}, ${shipping.address.state ?? ""} ${shipping.address.postal_code ?? ""}<br>
            ${shipping.address.country ?? ""}
          </div>
        </div>`
      : "";

    const testModeBanner = session.livemode === false
      ? `<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:6px;padding:8px 12px;margin-bottom:16px;font-size:12px;color:#856404">
          Stripe test mode — this is not a real order.
        </div>`
      : "";

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Georgia,serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:32px 16px"><tr><td align="center">
<table width="100%" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(27,19,14,.08)">
<tr><td style="background:#1B130E;padding:24px 28px">
  <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#E8A33D;margin-bottom:4px">CAC Salvation Center — Staff</div>
  <div style="font-size:22px;font-weight:700;color:#fff">New Store Order</div>
</td></tr>
<tr><td style="padding:24px 28px">
  ${testModeBanner}
  <div style="font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#E8A33D;margin-bottom:8px">Customer</div>
  <table cellpadding="0" cellspacing="0" style="font-size:13px;color:#1B130E;line-height:1.7">
    ${name ? `<tr><td style="padding-right:12px;color:#5f5e5a">Name</td><td>${name}</td></tr>` : ""}
    <tr><td style="padding-right:12px;color:#5f5e5a">Email</td><td><a href="mailto:${email}" style="color:#D62828">${email}</a></td></tr>
    ${phone ? `<tr><td style="padding-right:12px;color:#5f5e5a">Phone</td><td>${phone}</td></tr>` : ""}
  </table>
  <div style="margin-top:20px">
    <div style="font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#E8A33D;margin-bottom:8px">Items</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #ede9e4;border-radius:8px;overflow:hidden">
      <thead><tr style="background:#f9f8f6">
        <th style="padding:8px 12px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#5f5e5a;text-align:left">Item</th>
        <th style="padding:8px 12px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#5f5e5a;text-align:center">Qty</th>
        <th style="padding:8px 12px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#5f5e5a;text-align:right">Price</th>
      </tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div style="margin-top:10px;text-align:right;font-size:15px;font-weight:700;color:#1B130E">Total: ${fmt(total)}</div>
  </div>
  ${shippingBlock}
  <div style="margin-top:24px"><a href="https://www.cacsalvationcenter.org/admin/orders" style="display:inline-block;background:#D62828;color:#fff;font-size:13px;font-weight:700;text-decoration:none;padding:10px 20px;border-radius:8px">View in Admin</a></div>
</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #ede9e4">
  <p style="margin:0;font-size:12px;color:#aaa"><a href="https://cacsalvationcenter.org" style="color:#D62828;text-decoration:none;font-weight:700">cacsalvationcenter.org</a> &nbsp;·&nbsp; Randallstown, Maryland</p>
</td></tr>
</table></td></tr></table></body></html>`;

    await resend.emails.send({
      from: FROM,
      to: STAFF_EMAIL,
      subject,
      html,
    });
    console.log("[webhook] Staff order notification sent");
  } catch (err) {
    console.error("[webhook] Failed to send staff order email:", err);
  }
}

// ─── Digital download delivery ──────────────────────────────────────────────

type DigitalItem = { description: string; quantity: number; product_id: string | null; is_digital: boolean; amount_total: number };

async function sendDownloadEmail(
  customerEmail: string,
  customerName: string | null,
  items: DigitalItem[],
  supabase: ReturnType<typeof createServiceClient>,
): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  const digitalItems = items.filter((li) => li.is_digital && li.product_id);
  if (digitalItems.length === 0) return;

  // Fetch download URLs from products table
  const ids = digitalItems.map((li) => li.product_id!);
  const { data: products } = await supabase
    .from("products")
    .select("id, name, digital_file_url")
    .in("id", ids);

  const productMap = new Map((products ?? []).map((p) => [p.id, p]));

  const downloadRows = digitalItems
    .map((li) => {
      const p = productMap.get(li.product_id!);
      const url = p?.digital_file_url ?? null;
      if (!url) return null;
      return `
        <div style="background:#F9F8F6;border-radius:12px;padding:18px 22px;margin-bottom:12px">
          <div style="font-size:14px;font-weight:700;color:#1B130E;margin-bottom:8px">${li.description}</div>
          <a href="${url}" style="display:inline-block;background:#1B130E;color:#fff;font-size:13px;font-weight:700;text-decoration:none;padding:9px 18px;border-radius:8px">
            Download file →
          </a>
        </div>`;
    })
    .filter(Boolean)
    .join("");

  if (!downloadRows) return;

  const greeting = customerName ? `Hi ${customerName.split(" ")[0]},` : "Hello,";
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Georgia,serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:40px 16px"><tr><td align="center">
<table width="100%" style="max-width:580px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(27,19,14,.1)">
<tr><td style="background:#1B130E;padding:28px 32px">
  <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#E8A33D;margin-bottom:6px">CAC Salvation Center</div>
  <div style="font-size:26px;font-weight:700;color:#fff;line-height:1.2">Your download is ready 🎵</div>
</td></tr>
<tr><td style="padding:28px 32px">
  <p style="margin:0 0 8px;font-size:16px;color:#1B130E;line-height:1.7">${greeting}</p>
  <p style="margin:0 0 24px;font-size:15px;color:#5f5e5a;line-height:1.7">Thank you for your purchase. Click the button below to download your file.</p>
  ${downloadRows}
  <div style="margin-top:24px;background:#f9f8f6;border-radius:10px;padding:16px 20px">
    <p style="font-size:13px;color:#5f5e5a;margin:0;line-height:1.7">
      Questions? Reach us on WhatsApp at
      <a href="https://wa.me/14432726794" style="color:#25D366;font-weight:700;text-decoration:none">+1 (443) 272-6794</a>
      or email <a href="mailto:info@cacsalvationcenter.org" style="color:#D62828;text-decoration:none">info@cacsalvationcenter.org</a>.
    </p>
  </div>
</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #ede9e4">
  <p style="margin:0;font-size:12px;color:#aaa">
    <a href="https://cacsalvationcenter.org" style="color:#D62828;text-decoration:none;font-weight:700">cacsalvationcenter.org</a>
    &nbsp;·&nbsp; Randallstown, Maryland
  </p>
</td></tr>
</table></td></tr></table></body></html>`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM,
      to: customerEmail,
      subject: "Your digital download — CAC Salvation Center",
      html,
    });
    console.log("[webhook] Download email sent to:", customerEmail);
  } catch (err) {
    console.error("[webhook] Failed to send download email:", err);
  }
}

// ─── Refund emails ───────────────────────────────────────────────────────────

async function sendRefundEmails(charge: Stripe.Charge): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const customerEmail = charge.billing_details?.email ?? null;
  const customerName = charge.billing_details?.name ?? null;
  const refundedAmt = charge.amount_refunded ?? 0;
  const originalAmt = charge.amount ?? 0;

  // Customer refund email
  if (customerEmail) {
    const greeting = customerName ? `Hi ${customerName.split(" ")[0]},` : "Hello,";
    const customerHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Georgia,serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(27,19,14,.1)">
        <tr>
          <td style="background:#1B130E;padding:28px 32px">
            <div style="font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#E8A33D;margin-bottom:6px">CAC Salvation Center</div>
            <div style="font-size:26px;font-weight:700;color:#fff;line-height:1.2">Your refund has been processed</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px">
            <p style="margin:0;font-size:16px;color:#1B130E;line-height:1.7">${greeting}</p>
            <p style="margin:12px 0 0;font-size:15px;color:#5f5e5a;line-height:1.7">
              We've processed a refund of <strong>${fmt(refundedAmt)}</strong>
              ${refundedAmt < originalAmt ? ` (partial refund; original charge was ${fmt(originalAmt)})` : ""}.
            </p>
            <div style="margin:24px 0;background:#f9f8f6;border-radius:10px;padding:20px 24px">
              <div style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#E8A33D;margin-bottom:8px">Refund amount</div>
              <div style="font-size:28px;font-weight:700;color:#1B130E">${fmt(refundedAmt)}</div>
            </div>
            <p style="margin:0;font-size:14px;color:#5f5e5a;line-height:1.7">
              Refunds typically appear on your statement within <strong>5–7 business days</strong>,
              depending on your bank or card issuer.
            </p>
            <p style="margin:16px 0 0;font-size:14px;color:#5f5e5a;line-height:1.7">
              If you have any questions, reach us on WhatsApp at
              <a href="https://wa.me/14432726794" style="color:#25D366;font-weight:700;text-decoration:none">+1 (443) 272-6794</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #ede9e4">
            <p style="margin:0;font-size:12px;color:#aaa">
              <a href="https://cacsalvationcenter.org" style="color:#D62828;text-decoration:none;font-weight:700">cacsalvationcenter.org</a>
              &nbsp;·&nbsp; Randallstown, Maryland
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    resend.emails.send({
      from: FROM,
      to: customerEmail,
      subject: "Your refund has been processed — CAC Salvation Center",
      html: customerHtml,
    }).catch(() => {});
    console.log("[webhook] Refund email sent to customer:", customerEmail);
  }

  // Staff refund notification
  const piId = typeof charge.payment_intent === "string"
    ? charge.payment_intent
    : (charge.payment_intent as Stripe.PaymentIntent | null)?.id ?? "—";

  const staffHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Georgia,serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:32px 16px"><tr><td align="center">
<table width="100%" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(27,19,14,.08)">
<tr><td style="background:#1B130E;padding:24px 28px">
  <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#E8A33D;margin-bottom:4px">CAC Salvation Center — Staff</div>
  <div style="font-size:22px;font-weight:700;color:#fff">Refund Issued</div>
</td></tr>
<tr><td style="padding:24px 28px;font-size:13px;color:#1B130E;line-height:1.8">
  <table cellpadding="0" cellspacing="0">
    ${customerName ? `<tr><td style="padding-right:12px;color:#5f5e5a">Customer</td><td>${customerName}</td></tr>` : ""}
    ${customerEmail ? `<tr><td style="padding-right:12px;color:#5f5e5a">Email</td><td><a href="mailto:${customerEmail}" style="color:#D62828">${customerEmail}</a></td></tr>` : ""}
    <tr><td style="padding-right:12px;color:#5f5e5a">Refunded</td><td style="font-weight:700">${fmt(refundedAmt)}</td></tr>
    <tr><td style="padding-right:12px;color:#5f5e5a">Original</td><td>${fmt(originalAmt)}</td></tr>
    <tr><td style="padding-right:12px;color:#5f5e5a">Charge ID</td><td style="font-family:monospace;font-size:12px">${charge.id}</td></tr>
    <tr><td style="padding-right:12px;color:#5f5e5a">Payment Intent</td><td style="font-family:monospace;font-size:12px">${piId}</td></tr>
  </table>
  <div style="margin-top:20px"><a href="https://www.cacsalvationcenter.org/admin/orders" style="display:inline-block;background:#D62828;color:#fff;font-size:13px;font-weight:700;text-decoration:none;padding:10px 20px;border-radius:8px">View in Admin</a></div>
</td></tr>
</table></td></tr></table></body></html>`;

  resend.emails.send({
    from: FROM,
    to: STAFF_EMAIL,
    subject: `Refund issued — ${customerName ?? customerEmail ?? charge.id} · ${fmt(refundedAmt)}`,
    html: staffHtml,
  }).catch(() => {});
  console.log("[webhook] Refund notification sent to staff");
}

// ─── POST handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return Response.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const sessionId = (event.data.object as Stripe.Checkout.Session).id;
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["line_items", "line_items.data.price.product"],
        });
        console.log("[webhook] Payment completed:", session.id, "amount:", session.amount_total, "email:", session.customer_details?.email);

        // Save order to Supabase
        const enrichedLineItems = (session.line_items?.data ?? []).map((li) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const prod = li.price?.product as any;
          return {
            description: li.description ?? "Item",
            quantity: li.quantity ?? 1,
            amount_total: li.amount_total ?? 0,
            product_id: prod?.metadata?.product_id ?? null,
            is_digital: prod?.metadata?.is_digital === "true",
          };
        });

        try {
          const supabase = createServiceClient();
          const paymentIntent = typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent as Stripe.PaymentIntent | null)?.id ?? null;
          const sd = session.collected_information?.shipping_details ?? null;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from as any)("orders").upsert({
            stripe_session_id: session.id,
            stripe_payment_intent: paymentIntent,
            customer_name: session.customer_details?.name ?? null,
            customer_email: session.customer_details?.email ?? "",
            customer_phone: session.customer_details?.phone ?? null,
            shipping_name: sd?.name ?? session.customer_details?.name ?? null,
            shipping_line1: sd?.address?.line1 ?? null,
            shipping_line2: sd?.address?.line2 ?? null,
            shipping_city: sd?.address?.city ?? null,
            shipping_state: sd?.address?.state ?? null,
            shipping_postal_code: sd?.address?.postal_code ?? null,
            shipping_country: sd?.address?.country ?? null,
            line_items: enrichedLineItems,
            amount_total: session.amount_total ?? 0,
            currency: session.currency ?? "usd",
            status: "paid",
          }, { onConflict: "stripe_session_id" });
          console.log("[webhook] Order saved to Supabase:", session.id);
        } catch (err) {
          console.error("[webhook] Failed to save order to Supabase:", err);
        }

        // Fire-and-forget emails
        sendOrderEmail(session).catch(() => {});
        sendStaffOrderEmail(session).catch(() => {});

        // Send download links if any digital items
        if (session.metadata?.has_digital === "true") {
          const customerEmail = session.customer_details?.email;
          if (customerEmail) {
            sendDownloadEmail(
              customerEmail,
              session.customer_details?.name ?? null,
              enrichedLineItems,
              createServiceClient(),
            ).catch(() => {});
          }
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log("[webhook] Refund issued:", charge.id, "amount:", charge.amount_refunded, "email:", charge.billing_details?.email);

        // Update order status in Supabase
        try {
          const supabase = createServiceClient();
          const piId = typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : (charge.payment_intent as Stripe.PaymentIntent | null)?.id ?? null;

          if (piId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase.from as any)("orders")
              .update({ status: "refunded", refunded_amount: charge.amount_refunded })
              .eq("stripe_payment_intent", piId);
            console.log("[webhook] Order marked refunded in Supabase:", piId);
          }
        } catch (err) {
          console.error("[webhook] Failed to update refund in Supabase:", err);
        }

        // Fire-and-forget refund emails
        sendRefundEmails(charge).catch(() => {});
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log("[webhook] Payment failed:", intent.id, "reason:", intent.last_payment_error?.message);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("[webhook] Handler error for", event.type, err);
    return Response.json({ error: "Handler error" }, { status: 500 });
  }

  return Response.json({ received: true });
}
