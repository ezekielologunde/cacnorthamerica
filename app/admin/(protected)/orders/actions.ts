"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";

type LineItem = { description: string; quantity: number; amount_total: number };

function formatCents(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function shippingHtml(opts: {
  customerName: string | null;
  trackingNumber: string | null;
  lineItems: LineItem[];
  amountTotal: number;
  currency: string;
}): string {
  const { customerName, trackingNumber, lineItems, amountTotal, currency } = opts;
  const greeting = customerName ? `Hi ${customerName},` : "Hi there,";

  const trackingBlock = trackingNumber
    ? `<div style="background:#EEF4FF;border-radius:12px;padding:24px;margin-bottom:28px;text-align:center">
        <p style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#1d4ed8;margin:0 0 8px">Tracking Number</p>
        <p style="font-size:22px;font-weight:800;color:#1B130E;margin:0;letter-spacing:0.5px">${trackingNumber}</p>
      </div>`
    : `<div style="background:#F9F8F6;border-radius:12px;padding:18px 24px;margin-bottom:28px">
        <p style="font-size:14px;color:#1B130E;margin:0">No tracking number was provided for this shipment. Your order ships within <strong>5–7 business days</strong>.</p>
      </div>`;

  const itemRows = lineItems
    .map(
      (li) =>
        `<tr>
          <td style="padding:10px 0;font-size:14px;color:#1B130E;border-bottom:1px solid rgba(27,19,14,.07)">${li.description}</td>
          <td style="padding:10px 0;font-size:14px;color:#1B130E;text-align:center;border-bottom:1px solid rgba(27,19,14,.07)">${li.quantity}</td>
          <td style="padding:10px 0;font-size:14px;color:#1B130E;text-align:right;font-weight:600;border-bottom:1px solid rgba(27,19,14,.07)">${formatCents(li.amount_total, currency)}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F9F8F6;font-family:Georgia,serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(27,19,14,.10)">
    <div style="background:#1B130E;padding:36px 40px;text-align:center">
      <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,247,239,.45)">CAC SALVATION CENTER</p>
      <h1 style="margin:0;font-size:30px;font-weight:800;color:#fff;letter-spacing:-0.5px;line-height:1.2">Your order is on the way 📦</h1>
    </div>
    <div style="padding:40px">
      <p style="font-size:17px;color:#1B130E;line-height:1.75;margin:0 0 18px">${greeting}</p>
      <p style="font-size:16px;color:#1B130E;line-height:1.75;margin:0 0 28px">
        Great news — your order has been shipped! ${trackingNumber ? "You can track your package using the number below." : ""}
      </p>

      ${trackingBlock}

      ${
        lineItems.length > 0
          ? `<table style="width:100%;border-collapse:collapse;margin-bottom:28px">
          <thead>
            <tr>
              <th style="font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:rgba(27,19,14,.4);text-align:left;padding-bottom:8px">Item</th>
              <th style="font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:rgba(27,19,14,.4);text-align:center;padding-bottom:8px">Qty</th>
              <th style="font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:rgba(27,19,14,.4);text-align:right;padding-bottom:8px">Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:14px 0 0;font-size:14px;font-weight:700;color:#1B130E">Order Total</td>
              <td style="padding:14px 0 0;font-size:16px;font-weight:800;color:#1B130E;text-align:right">${formatCents(amountTotal, currency)}</td>
            </tr>
          </tfoot>
        </table>`
          : ""
      }

      <div style="background:#F9F8F6;border-radius:12px;padding:20px 24px;margin-bottom:32px">
        <p style="font-size:14px;color:#1B130E;line-height:1.75;margin:0">
          📦 <strong>Ships within 5–7 business days</strong><br>
          Questions about your order? Reach us on WhatsApp or email
          <a href="mailto:info@cacsalvationcenter.org" style="color:#D62828;text-decoration:none">info@cacsalvationcenter.org</a>.
        </p>
      </div>

      <hr style="border:none;border-top:1px solid rgba(27,19,14,.08);margin:0 0 24px">
      <p style="font-size:12px;color:rgba(27,19,14,.4);line-height:1.7;margin:0;text-align:center">
        <a href="https://www.cacsalvationcenter.org" style="color:#D62828;text-decoration:none">cacsalvationcenter.org</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function markShipped(
  orderId: string,
  trackingNumber: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const supabase = createServiceClient();

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "shipped",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tracking_number: (trackingNumber || null) as any,
      shipped_at: new Date().toISOString(),
    } as any)
    .eq("id", orderId);

  if (updateError) return { ok: false, error: updateError.message };

  const { data: order } = await supabase
    .from("orders")
    .select("customer_email,customer_name,line_items,amount_total,currency")
    .eq("id", orderId)
    .single();

  if (order) {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      new Resend(apiKey)
        .emails.send({
          from: "CAC Salvation Center <noreply@cacsalvationcenter.org>",
          to: order.customer_email,
          subject: "Your order has shipped — CAC Salvation Center",
          html: shippingHtml({
            customerName: order.customer_name,
            trackingNumber: trackingNumber || null,
            lineItems: (order.line_items ?? []) as LineItem[],
            amountTotal: order.amount_total,
            currency: order.currency ?? "usd",
          }),
        })
        .catch((e) => console.error("[markShipped] Email failed:", e));
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}

export async function resendDownloadLink(
  orderId: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const supabase = createServiceClient();

  const { data: order } = await supabase
    .from("orders")
    .select("customer_email, customer_name, line_items")
    .eq("id", orderId)
    .single();

  if (!order) return { ok: false, error: "Order not found" };

  type RichLineItem = { description: string; quantity: number; amount_total: number; product_id?: string | null; is_digital?: boolean };
  const lineItems: RichLineItem[] = (order.line_items ?? []) as RichLineItem[];
  const digitalItems = lineItems.filter((li) => li.is_digital && li.product_id);

  if (digitalItems.length === 0) return { ok: false, error: "No digital items found on this order" };

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

  if (!downloadRows) return { ok: false, error: "No download URLs configured for these products" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "Email service not configured" };

  const greeting = order.customer_name ? `Hi ${(order.customer_name as string).split(" ")[0]},` : "Hello,";
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
  <p style="margin:0 0 24px;font-size:15px;color:#5f5e5a;line-height:1.7">Here is your download link from CAC Salvation Center.</p>
  ${downloadRows}
  <div style="margin-top:24px;background:#f9f8f6;border-radius:10px;padding:16px 20px">
    <p style="font-size:13px;color:#5f5e5a;margin:0;line-height:1.7">
      Questions? WhatsApp us at <a href="https://wa.me/14432726794" style="color:#25D366;font-weight:700;text-decoration:none">+1 (443) 272-6794</a>.
    </p>
  </div>
</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #ede9e4">
  <p style="margin:0;font-size:12px;color:#aaa"><a href="https://cacsalvationcenter.org" style="color:#D62828;text-decoration:none;font-weight:700">cacsalvationcenter.org</a> &nbsp;·&nbsp; Randallstown, Maryland</p>
</td></tr>
</table></td></tr></table></body></html>`;

  try {
    await new Resend(apiKey).emails.send({
      from: "CAC Salvation Center <noreply@cacsalvationcenter.org>",
      to: order.customer_email as string,
      subject: "Your digital download — CAC Salvation Center",
      html,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to send email" };
  }
}

export async function updateNotes(
  orderId: string,
  notes: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("orders")
    .update({ notes })
    .eq("id", orderId);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}
