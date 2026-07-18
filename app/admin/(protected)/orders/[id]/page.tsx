import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrderActions from "@/components/admin/OrderActions";

type LineItem = { description: string; quantity: number; amount_total: number };

type Order = {
  id: string;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  customer_name: string | null;
  customer_email: string;
  customer_phone: string | null;
  shipping_name: string | null;
  shipping_line1: string | null;
  shipping_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  line_items: LineItem[];
  amount_total: number;
  currency: string;
  status: string;
  refunded_amount: number | null;
  notes: string | null;
  tracking_number: string | null;
  shipped_at: string | null;
  created_at: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatCents(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

function statusBadge(status: string) {
  const map: Record<string, { bg: string; color: string }> = {
    paid:     { bg: "#dcfce7", color: "#15803d" },
    refunded: { bg: "#fee2e2", color: "#dc2626" },
    shipped:  { bg: "#dbeafe", color: "#1d4ed8" },
  };
  const s = map[status] ?? { bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{ background: s.bg, color: s.color, padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>
      {status}
    </span>
  );
}

function trunc(str: string | null, max: number) {
  if (!str) return "—";
  return str.length > max ? str.slice(0, max) + "…" : str;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", margin: 0, letterSpacing: "0.06em", textTransform: "uppercase" }}>{title}</p>
      </div>
      <div style={{ padding: "16px 20px" }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
      <span style={{ fontSize: 13, color: "var(--ink-soft)", minWidth: 110, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500, wordBreak: "break-all" }}>{value ?? "—"}</span>
    </div>
  );
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data } = await supabase.from("orders").select("*").eq("id", id).single();

  if (!data) notFound();
  const order = data as unknown as Order;
  const items = (order.line_items ?? []) as LineItem[];
  const hasShipping = order.shipping_line1 || order.shipping_city;
  const hasDigital = items.some((li) => (li as { is_digital?: boolean }).is_digital);

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Back */}
      <Link href="/admin/orders" style={{ color: "var(--ink-soft)", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 20 }}>
        ← Orders
      </Link>

      {/* Order header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", margin: 0, letterSpacing: "-0.02em" }}>
            {order.customer_name ?? order.customer_email}
          </h1>
          {statusBadge(order.status)}
        </div>
        <p style={{ color: "var(--ink-soft)", fontSize: 14, margin: "6px 0 0" }}>
          {formatDate(order.created_at)}
        </p>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

        {/* LEFT — Items */}
        <div>
          <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", margin: 0, letterSpacing: "0.06em", textTransform: "uppercase" }}>Items</p>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                  {["Description", "Qty", "Unit Price", "Subtotal"].map((h) => (
                    <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--ink-soft)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "20px", fontSize: 13, color: "var(--ink-soft)", textAlign: "center" }}>No line items recorded.</td>
                  </tr>
                ) : items.map((li, i) => {
                  const unitPrice = li.quantity > 0 ? li.amount_total / li.quantity : li.amount_total;
                  return (
                    <tr key={i} style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                      <td style={{ padding: "13px 20px", fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>{li.description}</td>
                      <td style={{ padding: "13px 20px", fontSize: 13, color: "var(--ink-soft)" }}>{li.quantity}</td>
                      <td style={{ padding: "13px 20px", fontSize: 13, color: "var(--ink-soft)" }}>{formatCents(unitPrice, order.currency)}</td>
                      <td style={{ padding: "13px 20px", fontSize: 13, color: "var(--ink)", fontWeight: 600 }}>{formatCents(li.amount_total, order.currency)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ borderTop: "2px solid rgba(0,0,0,0.08)", padding: "14px 20px", display: "flex", justifyContent: "flex-end", gap: 24, alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-soft)" }}>Order Total</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>{formatCents(order.amount_total, order.currency)}</span>
            </div>
          </div>

          {/* Notes + Shipping actions */}
          <OrderActions
            orderId={order.id}
            status={order.status}
            notes={order.notes ?? null}
            trackingNumber={order.tracking_number ?? null}
            shippedAt={order.shipped_at ?? null}
            hasDigital={hasDigital}
          />

          {/* Status timeline */}
          <Card title="Timeline">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#15803d", marginTop: 4, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", margin: "0 0 2px" }}>Order placed</p>
                  <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0 }}>{formatDate(order.created_at)}</p>
                </div>
              </div>
              {order.status === "shipped" && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1d4ed8", marginTop: 4, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", margin: "0 0 2px" }}>Shipped</p>
                    <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0 }}>
                      {order.shipped_at ? formatDate(order.shipped_at) : "Status marked as shipped"}
                    </p>
                    {order.tracking_number && (
                      <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "2px 0 0" }}>
                        Tracking: {order.tracking_number}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {order.status === "refunded" && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626", marginTop: 4, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", margin: "0 0 2px" }}>Refund processed</p>
                    {order.refunded_amount != null && (
                      <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0 }}>
                        {formatCents(order.refunded_amount, order.currency)} refunded
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT — Customer / Shipping / Details */}
        <div>
          <Card title="Customer">
            <InfoRow label="Name" value={order.customer_name} />
            <InfoRow label="Email" value={order.customer_email} />
            <InfoRow label="Phone" value={order.customer_phone} />
          </Card>

          {hasShipping && (
            <Card title="Shipping Address">
              <p style={{ fontSize: 13, color: "var(--ink)", margin: 0, lineHeight: 1.7 }}>
                {order.shipping_name && <><strong>{order.shipping_name}</strong><br /></>}
                {order.shipping_line1}<br />
                {order.shipping_line2 && <>{order.shipping_line2}<br /></>}
                {[order.shipping_city, order.shipping_state, order.shipping_postal_code].filter(Boolean).join(", ")}<br />
                {order.shipping_country}
              </p>
            </Card>
          )}

          <Card title="Order Details">
            <InfoRow label="Order ID" value={trunc(order.id, 16)} />
            <InfoRow label="Stripe Session" value={trunc(order.stripe_session_id, 20)} />
            <InfoRow label="Payment Intent" value={trunc(order.stripe_payment_intent, 20)} />
            <InfoRow label="Currency" value={order.currency?.toUpperCase()} />
          </Card>
        </div>
      </div>
    </div>
  );
}
