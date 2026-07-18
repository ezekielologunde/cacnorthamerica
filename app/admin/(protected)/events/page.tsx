import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function EventsListPage() {
  const supabase = createServiceClient();
  const { data: events } = await supabase
    .from("events")
    .select("id, title, event_date, location, published")
    .order("event_date", { ascending: false });

  return (
    <div>
      <style>{`.adm-row:hover { background: var(--cream); transition: background 0.1s; }`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0, display: "flex", alignItems: "center" }}>
          Events
          {!!events?.length && <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-soft)", marginLeft: 10 }}>{events.length}</span>}
        </h1>
        <Link
          href="/admin/events/new"
          style={{ background: "var(--red)", color: "white", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}
        >
          + New Event
        </Link>
      </div>

      {!events?.length ? (
        <div style={{ background: "white", borderRadius: 12, padding: "48px 32px", textAlign: "center", color: "var(--ink-soft)" }}>
          <p style={{ fontSize: 16, margin: "0 0 12px" }}>No events yet.</p>
          <Link href="/admin/events/new" style={{ color: "var(--red)", fontWeight: 600 }}>Add your first event →</Link>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "#fafafa" }}>
                {["Title", "Date", "Location", "Status", ""].map((h) => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((ev, i) => (
                <tr key={ev.id} className="adm-row" style={{ borderBottom: i < events.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <Link href={`/admin/events/${ev.id}`} style={{ color: "var(--ink)", fontWeight: 600, textDecoration: "none", fontSize: 14 }}>
                      {ev.title}
                    </Link>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--ink-soft)" }}>
                    {new Date(ev.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--ink-soft)" }}>
                    {ev.location ?? "—"}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{
                      background: ev.published ? "#dcfce7" : "#fef9c3",
                      color: ev.published ? "#15803d" : "#854d0e",
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                      {ev.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <Link href={`/admin/events/${ev.id}`} style={{ color: "var(--red)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
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
