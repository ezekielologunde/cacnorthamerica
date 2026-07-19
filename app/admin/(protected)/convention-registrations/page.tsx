import { createServiceClient } from "@/lib/supabase/server";
import ConventionStatusSelect from "@/components/admin/ConventionStatusSelect";

type Registration = {
  id: string;
  year: number;
  registration_type: string;
  church_name: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  status: string;
  total_amount_cents: number;
  created_at: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default async function ConventionRegistrationsPage() {
  const supabase = createServiceClient();
  const { data: registrations } = await supabase
    .from("convention_registrations")
    .select("id, year, registration_type, church_name, contact_name, contact_email, contact_phone, status, total_amount_cents, created_at")
    .order("created_at", { ascending: false });

  const list = (registrations ?? []) as Registration[];

  const { data: registrantRows } = await supabase
    .from("convention_registrants")
    .select("registration_id, full_name, category");
  const countsByRegistration = new Map<string, number>();
  for (const r of registrantRows ?? []) {
    countsByRegistration.set(r.registration_id, (countsByRegistration.get(r.registration_id) ?? 0) + 1);
  }

  const totalRevenue = list.filter((r) => r.status === "paid").reduce((sum, r) => sum + r.total_amount_cents, 0);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          Convention Registrations
        </h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 14, margin: 0 }}>
          Registrations submitted through /convention/register, across all years.
        </p>
      </div>

      {list.length > 0 && (
        <div style={{ display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ background: "white", borderRadius: 12, padding: "16px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", minWidth: 140 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)", margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Registrations</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", margin: 0, fontVariantNumeric: "tabular-nums" }}>{list.length}</p>
          </div>
          <div style={{ background: "white", borderRadius: 12, padding: "16px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", minWidth: 140 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)", margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Paid Revenue</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", margin: 0, fontVariantNumeric: "tabular-nums" }}>{formatCents(totalRevenue)}</p>
          </div>
        </div>
      )}

      {list.length === 0 ? (
        <div style={{ background: "white", borderRadius: 12, padding: "56px 32px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", margin: "0 0 8px" }}>No registrations yet.</p>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: 0 }}>
            Registrations will appear here as people register for the convention.
          </p>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "#f9fafb" }}>
                  {["Date", "Year", "Contact", "Type", "Registrants", "Total", "Status"].map((h) => (
                    <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < list.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                    <td style={{ padding: "14px 18px", fontSize: 13, color: "var(--ink-soft)", whiteSpace: "nowrap" }}>
                      {formatDate(r.created_at)}
                    </td>
                    <td style={{ padding: "14px 18px", fontSize: 13, color: "var(--ink)", fontWeight: 600 }}>{r.year}</td>
                    <td style={{ padding: "14px 18px" }}>
                      {r.church_name && (
                        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "0 0 2px" }}>{r.church_name}</p>
                      )}
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", margin: "0 0 2px" }}>{r.contact_name}</p>
                      <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0 }}>{r.contact_email}</p>
                    </td>
                    <td style={{ padding: "14px 18px", fontSize: 13, color: "var(--ink-soft)", textTransform: "capitalize" }}>{r.registration_type}</td>
                    <td style={{ padding: "14px 18px", fontSize: 13, color: "var(--ink-soft)" }}>{countsByRegistration.get(r.id) ?? 0}</td>
                    <td style={{ padding: "14px 18px", fontSize: 13, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>
                      {formatCents(r.total_amount_cents)}
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <ConventionStatusSelect id={r.id} status={r.status} />
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
