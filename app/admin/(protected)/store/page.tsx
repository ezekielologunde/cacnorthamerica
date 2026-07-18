import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function StoreListPage() {
  const supabase = createServiceClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, category, price_display, published, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <div>
      <style>{`.adm-row:hover { background: var(--cream); transition: background 0.1s; }`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0, display: "flex", alignItems: "center" }}>
          Store
          {!!products?.length && <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-soft)", marginLeft: 10 }}>{products.length}</span>}
        </h1>
        <Link
          href="/admin/store/new"
          style={{ background: "var(--red)", color: "white", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}
        >
          + New Product
        </Link>
      </div>

      {!products?.length ? (
        <div style={{ background: "white", borderRadius: 12, padding: "48px 32px", textAlign: "center", color: "var(--ink-soft)" }}>
          <p style={{ fontSize: 16, margin: "0 0 12px" }}>No products yet.</p>
          <Link href="/admin/store/new" style={{ color: "var(--red)", fontWeight: 600 }}>Add your first product →</Link>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "#fafafa" }}>
                {["Name", "Category", "Price", "Status", "Sort", ""].map((h) => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} className="adm-row" style={{ borderBottom: i < products.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <Link href={`/admin/store/${p.id}`} style={{ color: "var(--ink)", fontWeight: 600, textDecoration: "none", fontSize: 14 }}>
                      {p.name}
                    </Link>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--ink-soft)", textTransform: "capitalize" }}>
                    {p.category}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--ink-soft)" }}>
                    {p.price_display}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{
                      background: p.published ? "#dcfce7" : "#fef9c3",
                      color: p.published ? "#15803d" : "#854d0e",
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--ink-soft)" }}>
                    {p.sort_order}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <Link href={`/admin/store/${p.id}`} style={{ color: "var(--red)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                      Edit →
                    </Link>
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
