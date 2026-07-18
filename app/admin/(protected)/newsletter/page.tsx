import { createServiceClient } from "@/lib/supabase/server";
import NewsletterBroadcast from "@/components/admin/NewsletterBroadcast";

export default async function NewsletterPage() {
  const supabase = createServiceClient();
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, name, source, subscribed_at, active")
    .order("subscribed_at", { ascending: false });

  const active = subscribers?.filter((s) => s.active) ?? [];
  const total = subscribers?.length ?? 0;

  return (
    <div>
      <style>{`.adm-row:hover { background: var(--cream); transition: background 0.1s; }`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0, display: "flex", alignItems: "center" }}>
          Newsletter
          {total > 0 && (
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-soft)", marginLeft: 10 }}>
              {active.length} active · {total} total
            </span>
          )}
        </h1>
        {total > 0 && (
          <a
            href={`data:text/csv;charset=utf-8,${["Email,Name,Source,Subscribed", ...active.map((s) => [s.email, s.name ?? "", s.source ?? "", s.subscribed_at ?? ""].map((v) => { const s2 = String(v).replace(/^[=+\-@]/, "'$&"); return s2.includes(",") || s2.includes('"') || s2.includes("\n") ? `"${s2.replace(/"/g, '""')}"` : s2; }).join(","))].join("%0A")}`}
            download="newsletter-subscribers.csv"
            style={{ background: "var(--red)", color: "white", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}
          >
            Export CSV
          </a>
        )}
      </div>

      <NewsletterBroadcast subscriberCount={active.length} />

      {!subscribers?.length ? (
        <div style={{ background: "white", borderRadius: 12, padding: "48px 32px", textAlign: "center", color: "var(--ink-soft)" }}>
          <p style={{ fontSize: 16, margin: 0 }}>No subscribers yet. The form is live on the website.</p>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "#fafafa" }}>
                  {["Email", "Name", "Source", "Subscribed", "Status"].map((h) => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s, i) => (
                  <tr key={s.id} className="adm-row" style={{ borderBottom: i < subscribers.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                    <td style={{ padding: "14px 20px", fontSize: 14, color: "var(--ink)", fontWeight: 500 }}>{s.email}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--ink-soft)" }}>{s.name ?? "—"}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--ink-soft)", textTransform: "capitalize" }}>{s.source ?? "website"}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--ink-soft)" }}>
                      {s.subscribed_at
                        ? new Date(s.subscribed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ background: s.active ? "#dcfce7" : "#fef9c3", color: s.active ? "#15803d" : "#854d0e", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                        {s.active ? "Active" : "Unsubscribed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
