import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { FORM_CATEGORIES, getSiteForms, type FormCountSource } from "@/lib/siteForms";

export const dynamic = "force-dynamic";

type AdminClient = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

/** Row count for one form's table, or null when the query fails (shown as a dash). */
async function countRows(supabase: AdminClient, source: FormCountSource): Promise<number | null> {
  let query = supabase.from(source.table).select("*", { count: "exact", head: true });
  if (source.eq) query = query.eq(source.eq.column, source.eq.value);
  const { count, error } = await query;
  if (error) {
    console.error(`[admin/forms] count failed for ${source.table}:`, error.message);
    return null;
  }
  return count ?? 0;
}

const cardStyle: React.CSSProperties = {
  background: "white", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
};
const thStyle: React.CSSProperties = {
  textAlign: "left", fontSize: 11.5, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase",
  color: "var(--ink-soft)", padding: "0 12px 10px", borderBottom: "1px solid rgba(18,20,30,.08)", whiteSpace: "nowrap",
};
const tdStyle: React.CSSProperties = {
  padding: "14px 12px", borderBottom: "1px solid rgba(18,20,30,.06)", fontSize: 14, color: "var(--ink)", verticalAlign: "top",
};
const linkStyle: React.CSSProperties = { color: "var(--red)", fontWeight: 600, textDecoration: "none", fontSize: 13 };

export default async function AdminFormsPage() {
  const { supabase } = await requireAdmin();
  const forms = getSiteForms();
  const counts = await Promise.all(forms.map((f) => (f.staff.count ? countRows(supabase, f.staff.count) : Promise.resolve(undefined))));

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Forms</h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          Every form on the website, where visitors find it, and where its submissions end up.{" "}
          <Link href="/forms" style={linkStyle}>View the public Forms page</Link>
        </p>
      </div>

      {FORM_CATEGORIES.map((category) => {
        const rows = forms.map((form, i) => ({ form, count: counts[i] })).filter((r) => r.form.category === category);
        if (rows.length === 0) return null;
        return (
          <section key={category} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", margin: "0 0 10px" }}>{category}</h2>
            <div style={{ ...cardStyle, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Form</th>
                    <th style={thStyle}>Where submissions go</th>
                    <th style={thStyle}>On record</th>
                    <th style={thStyle}>Open</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ form, count }) => (
                    <tr key={form.id}>
                      <td style={tdStyle}>
                        <strong>{form.name}</strong>
                        <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>{form.audience}</div>
                      </td>
                      <td style={{ ...tdStyle, color: "var(--ink-soft)", maxWidth: 360 }}>{form.staff.destination}</td>
                      <td style={tdStyle}>
                        {form.staff.count ? (
                          <>
                            <strong>{count === null ? "—" : count}</strong>
                            <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>{form.staff.count.unit}</div>
                          </>
                        ) : (
                          <span style={{ color: "var(--ink-soft)" }}>Not counted here</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {form.href && <Link href={form.href} style={linkStyle}>Live form →</Link>}
                          {!form.href && form.foundAt && <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{form.foundAt}</span>}
                          {form.staff.adminHref && <Link href={form.staff.adminHref} style={linkStyle}>{form.staff.adminLabel ?? "Manage"} →</Link>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: 0, lineHeight: 1.6 }}>
        Counts are totals in the database. Card gifts, recurring gifts and store orders are also in Stripe, and several forms are logged to the Google Sheet. Both are covered under Operations.
      </p>
    </div>
  );
}
