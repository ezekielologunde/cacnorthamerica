import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";

type LineItem = { description: string; quantity: number; amount_total: number };

type Order = {
  id: string;
  customer_name: string | null;
  customer_email: string;
  line_items: LineItem[];
  amount_total: number;
  currency: string;
  status: string;
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
    paid:      { bg: "#dcfce7", color: "#15803d" },
    refunded:  { bg: "#fee2e2", color: "#dc2626" },
    shipped:   { bg: "#dbeafe", color: "#1d4ed8" },
  };
  const style = map[status] ?? { bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{
      background: style.bg, color: style.color,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 12, fontWeight: 600, textTransform: "capitalize",
    }}>
      {status}
    </span>
  );
}

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export default async function OrdersPage() {
  const supabase = createServiceClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, customer_name, customer_email, line_items, amount_total, currency, status, created_at")
    .order("created_at", { ascending: false });

  const list = (orders ?? []) as unknown as Order[];

  const totalRevenue = list
    .filter((o) => o.status !== "refunded")
    .reduce((sum, o) => sum + (o.amount_total ?? 0), 0);

  return (
    <div>
      <style>{`.ord-row:hover { background: var(--cream); transition: background 0.1s; }`}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          Orders
        </h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 14, margin: 0 }}>
          All store purchases — Stripe notifies us automatically.
        </p>
      </div>

      {/* Summary bar */}
      {list.length > 0 && (
        <div style={{
          display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap",
        }}>
          <div style={{
            background: "white", borderRadius: 12, padding: "16px 22px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)", minWidth: 140,
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)", margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Total Orders</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", margin: 0, fontVariantNumeric: "tabular-nums" }}>{list.length}</p>
          </div>
          <div style={{
            background: "white", borderRadius: 12, padding: "16px 22px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)", minWidth: 140,
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)", margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Total Revenue</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", margin: 0, fontVariantNumeric: "tabular-nums" }}>
              {formatCents(totalRevenue, list[0]?.currency)}
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {list.length === 0 ? (
        <div style={{
          background: "white", borderRadius: 12, padding: "56px 32px",
          textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}>
          <div style={{ marginBottom: 16 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto" }}>
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", margin: "0 0 8px" }}>No orders yet.</p>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "0 0 20px" }}>
            Orders will appear here automatically after a successful checkout.
          </p>
          <Link href="/admin/store" style={{ color: "var(--red)", fontWeight: 600, textDecoration: "none", fontSize: 14 }}>
            View Store →
          </Link>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "#f9fafb" }}>
                  {["Date", "Customer", "Items", "Total", "Status", ""].map((h) => (
                    <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((order, i) => {
                  const items = (order.line_items ?? []) as LineItem[];
                  const itemSummary = truncate(
                    items.map((li) => li.description).join(", "),
                    60
                  );
                  return (
                    <tr key={order.id} className="ord-row" style={{ borderBottom: i < list.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                      <td style={{ padding: "14px 18px", fontSize: 13, color: "var(--ink-soft)", whiteSpace: "nowrap" }}>
                        {formatDate(order.created_at)}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", margin: "0 0 2px" }}>
                          {order.customer_name ?? "—"}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0 }}>
                          {order.customer_email}
                        </p>
                      </td>
                      <td style={{ padding: "14px 18px", fontSize: 13, color: "var(--ink-soft)", maxWidth: 220 }}>
                        {itemSummary || "—"}
                      </td>
                      <td style={{ padding: "14px 18px", fontSize: 13, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>
                        {formatCents(order.amount_total, order.currency)}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        {statusBadge(order.status)}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <Link href={`/admin/orders/${order.id}`} style={{ color: "var(--red)", fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
