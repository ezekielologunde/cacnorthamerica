import { getStripeClient } from "@/lib/stripe";
import { getAllSheets, type AllSheets } from "@/lib/sheetsRead";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

const KIND_LABELS: Record<string, string> = {
  registration: "Registration",
  store_order: "Store Order",
  giving: "Giving",
};

function formatCents(cents: number | null): string {
  return `$${((cents ?? 0) / 100).toFixed(2)}`;
}

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });
}

async function getRecentStripeSessions(): Promise<{ sessions: Stripe.Checkout.Session[]; error: string | null }> {
  try {
    const stripe = getStripeClient();
    const list = await stripe.checkout.sessions.list({ limit: 50 });
    return { sessions: list.data, error: null };
  } catch (err) {
    console.error("[operations] Failed to list Stripe sessions:", err);
    return { sessions: [], error: "Couldn't load Stripe payments — check STRIPE_SECRET_KEY." };
  }
}

const cardStyle: React.CSSProperties = {
  background: "white", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
};
const thStyle: React.CSSProperties = {
  textAlign: "left", fontSize: 11.5, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase",
  color: "var(--ink-soft)", padding: "0 12px 10px", borderBottom: "1px solid rgba(18,20,30,.08)", whiteSpace: "nowrap",
};
const tdStyle: React.CSSProperties = {
  padding: "10px 12px", fontSize: 13.5, color: "var(--ink)", borderBottom: "1px solid rgba(18,20,30,.05)", whiteSpace: "nowrap",
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={cardStyle}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: "var(--ink-soft)", margin: "0 0 8px" }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color: "var(--ink)", margin: 0 }}>{value}</p>
    </div>
  );
}

function StripeTable({ sessions }: { sessions: Stripe.Checkout.Session[] }) {
  if (sessions.length === 0) {
    return <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>No Stripe checkout sessions yet.</p>;
  }
  return (
    <div style={{ ...cardStyle, padding: 0, overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, paddingLeft: 20 }}>Date</th>
            <th style={thStyle}>Kind</th>
            <th style={thStyle}>Contact</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Status</th>
            <th style={{ ...thStyle, paddingRight: 20 }}>Session</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id}>
              <td style={{ ...tdStyle, paddingLeft: 20 }}>{formatDate(s.created)}</td>
              <td style={tdStyle}>{KIND_LABELS[s.metadata?.kind ?? ""] ?? s.metadata?.kind ?? "—"}</td>
              <td style={tdStyle}>{s.customer_details?.email ?? s.customer_email ?? "—"}</td>
              <td style={tdStyle}>{formatCents(s.amount_total)}</td>
              <td style={tdStyle}>
                <span style={{
                  fontSize: 11.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999,
                  background: s.payment_status === "paid" ? "rgba(16,163,74,.12)" : "rgba(18,20,30,.08)",
                  color: s.payment_status === "paid" ? "#0f7a37" : "var(--ink-soft)",
                }}>
                  {s.payment_status}
                </span>
              </td>
              <td style={{ ...tdStyle, paddingRight: 20 }}>
                <a
                  href={`https://dashboard.stripe.com/payments/${s.payment_intent ?? s.id}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ color: "var(--red)", textDecoration: "none", fontFamily: "monospace", fontSize: 12 }}
                >
                  {s.id.slice(0, 20)}…
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Renders any sheet tab generically -- tabs are created dynamically by
 *  the Apps Script per formName, so this makes no assumption about which
 *  columns exist beyond what the first row actually has. */
function SheetTable({ name, rows }: { name: string; rows: AllSheets[string] }) {
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 10 }}>
        {name}
        <span style={{ background: "rgba(18,20,30,.08)", color: "var(--ink-soft)", borderRadius: 20, fontSize: 12, fontWeight: 700, padding: "2px 10px" }}>
          {rows.length}
        </span>
      </h2>
      {rows.length === 0 ? (
        <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>No rows yet.</p>
      ) : (
        <div style={{ ...cardStyle, padding: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {columns.map((c, i) => (
                  <th key={c} style={{ ...thStyle, ...(i === 0 ? { paddingLeft: 20 } : {}), ...(i === columns.length - 1 ? { paddingRight: 20 } : {}) }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...rows].reverse().map((row, ri) => (
                <tr key={ri}>
                  {columns.map((c, i) => (
                    <td key={c} style={{ ...tdStyle, ...(i === 0 ? { paddingLeft: 20 } : {}), ...(i === columns.length - 1 ? { paddingRight: 20 } : {}) }}>
                      {String(row[c] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default async function OperationsPage() {
  const [{ sessions, error: stripeError }, sheets] = await Promise.all([
    getRecentStripeSessions(),
    getAllSheets(),
  ]);

  const paidSessions = sessions.filter((s) => s.payment_status === "paid");
  const totalCollectedCents = paidSessions.reduce((sum, s) => sum + (s.amount_total ?? 0), 0);
  const byKind = paidSessions.reduce<Record<string, number>>((acc, s) => {
    const kind = s.metadata?.kind ?? "unknown";
    acc[kind] = (acc[kind] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px" }}>Operations</h1>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: 0 }}>
          Recent Stripe payments and Google Sheet submissions in one place — read-only, sourced live from both.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Collected (last 50)" value={formatCents(totalCollectedCents)} />
        <StatCard label="Registrations" value={String(byKind.registration ?? 0)} />
        <StatCard label="Store Orders" value={String(byKind.store_order ?? 0)} />
        <StatCard label="Gifts" value={String(byKind.giving ?? 0)} />
      </div>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", margin: "0 0 14px" }}>Stripe Payments</h2>
        {stripeError ? (
          <p style={{ fontSize: 14, color: "var(--red)" }}>{stripeError}</p>
        ) : (
          <StripeTable sessions={sessions} />
        )}
      </section>

      {sheets ? (
        Object.entries(sheets).map(([name, rows]) => <SheetTable key={name} name={name} rows={rows} />)
      ) : (
        <p style={{ fontSize: 14, color: "var(--red)" }}>
          Couldn&apos;t load Google Sheets data — check SHEETS_WEBHOOK / SHEETS_WEBHOOK_SECRET.
        </p>
      )}
    </div>
  );
}
