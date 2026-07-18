import { createServiceClient } from "@/lib/supabase/server";
import { archivePrayer, unarchivePrayer } from "./actions";
import ActionButton from "@/components/admin/ActionButton";
import ForwardToStaff from "@/components/admin/ForwardToStaff";

type PrayerRow = {
  id: string;
  name: string | null;
  email: string | null;
  request: string;
  urgent: boolean;
  created_at: string;
};

function PrayerCard({ item, archived }: { item: PrayerRow; archived: boolean }) {
  const date = new Date(item.created_at).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div style={{
      background: item.urgent && !archived ? "#fff5f5" : "white",
      borderRadius: 10,
      padding: "20px 24px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      opacity: archived ? 0.7 : 1,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>
              {item.name ?? "Anonymous"}
            </span>
            {item.urgent && (
              <span style={{ background: "#dc2626", color: "white", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, letterSpacing: "0.05em" }}>
                URGENT
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
            {item.email && (
              <a href={`mailto:${item.email}`} style={{ fontSize: 13, color: "var(--red)", textDecoration: "none" }}>
                {item.email}
              </a>
            )}
            <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{date}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <ForwardToStaff
            subject={`Fwd: Prayer request${item.urgent ? " (URGENT)" : ""}`}
            body={`Forwarding a prayer request from the CAC Salvation Center website.\n\nFrom: ${item.name ?? "Anonymous"}${item.email ? ` <${item.email}>` : ""}\nDate: ${date}${item.urgent ? "\nMarked URGENT" : ""}\n\n${item.request}`}
          />
          <form action={archived ? unarchivePrayer.bind(null, item.id) : archivePrayer.bind(null, item.id)}>
            <ActionButton style={{
              background: "transparent",
              color: "var(--ink-soft)",
              border: "1px solid rgba(27,19,14,0.15)",
              borderRadius: 6,
              padding: "5px 12px",
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}>
              {archived ? "Unarchive" : "Archive"}
            </ActionButton>
          </form>
        </div>
      </div>
      <p style={{ fontSize: 14, color: "rgba(0,0,0,0.7)", margin: 0, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
        {item.request}
      </p>
    </div>
  );
}

export default async function PrayerPage() {
  const supabase = createServiceClient();

  const [activeResult, archivedResult] = await Promise.all([
    supabase
      .from("prayer_requests")
      .select("id, name, email, request, urgent, created_at")
      .eq("archived", false)
      .order("urgent", { ascending: false })
      .order("created_at", { ascending: true }),
    supabase
      .from("prayer_requests")
      .select("id, name, email, request, urgent, created_at")
      .eq("archived", true)
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  const active = (activeResult.data ?? []) as PrayerRow[];
  const archived = (archivedResult.data ?? []) as PrayerRow[];
  const urgentCount = active.filter((r) => r.urgent).length;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 12 }}>
          Prayer Requests
          {active.length > 0 && (
            <span style={{ background: "var(--red)", color: "white", borderRadius: 20, fontSize: 13, fontWeight: 700, padding: "3px 11px" }}>
              {active.length}
            </span>
          )}
        </h1>
        {urgentCount > 0 && (
          <p style={{ fontSize: 14, color: "#dc2626", fontWeight: 600, margin: 0 }}>
            {urgentCount} urgent {urgentCount === 1 ? "request" : "requests"} need attention
          </p>
        )}
      </div>

      {active.length === 0 ? (
        <div style={{ background: "white", borderRadius: 12, padding: "48px 32px", textAlign: "center", color: "var(--ink-soft)", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <p style={{ fontSize: 16, margin: 0 }}>No active prayer requests.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
          {active.map((item) => <PrayerCard key={item.id} item={item} archived={false} />)}
        </div>
      )}

      {archived.length > 0 && (
        <section>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-soft)", margin: "0 0 14px" }}>
            Archived <span style={{ fontWeight: 400, fontSize: 13 }}>(most recent 30)</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {archived.map((item) => <PrayerCard key={item.id} item={item} archived={true} />)}
          </div>
        </section>
      )}
    </div>
  );
}
