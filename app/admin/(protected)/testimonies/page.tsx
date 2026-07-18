import { createServiceClient } from "@/lib/supabase/server";
import { approveTestimony, deleteTestimony } from "./actions";
import ActionButton from "@/components/admin/ActionButton";

export default async function TestimoniesPage() {
  const supabase = createServiceClient();
  const { data: pending } = await supabase
    .from("testimonies")
    .select("id, name, content, created_at")
    .eq("approved", false)
    .order("created_at", { ascending: true });

  const { data: approved } = await supabase
    .from("testimonies")
    .select("id, name, content, created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(20);

  function Card({ testimony, isPending }: { testimony: { id: string; name: string; content: string; created_at: string }; isPending: boolean }) {
    const date = new Date(testimony.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    return (
      <div style={{
        background: isPending ? "#fffaf5" : "white",
        borderRadius: 10,
        padding: "20px 24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", margin: 0 }}>{testimony.name}</p>
            <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "2px 0 0" }}>{date}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {isPending && (
              <form action={approveTestimony.bind(null, testimony.id)}>
                <ActionButton style={{ background: "#16a34a", color: "white", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600 }}>
                  Approve
                </ActionButton>
              </form>
            )}
            <form action={deleteTestimony.bind(null, testimony.id)}>
              <ActionButton style={{ background: "transparent", color: "#dc2626", border: "1.5px solid #dc2626", borderRadius: 6, padding: "5px 14px", fontSize: 13, fontWeight: 600 }}>
                {isPending ? "Reject" : "Delete"}
              </ActionButton>
            </form>
          </div>
        </div>
        <p style={{ fontSize: 14, color: "rgba(0,0,0,0.65)", margin: 0, lineHeight: 1.6 }}>
          {testimony.content.length > 280 ? testimony.content.slice(0, 280) + "…" : testimony.content}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 28px" }}>Testimonies</h1>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 10 }}>
          Pending Approval
          {!!pending?.length && (
            <span style={{ background: "#d97706", color: "white", borderRadius: 20, fontSize: 12, fontWeight: 700, padding: "2px 9px" }}>
              {pending.length}
            </span>
          )}
        </h2>
        {!pending?.length ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>No testimonies awaiting approval.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pending.map((t) => <Card key={t.id} testimony={t} isPending={true} />)}
          </div>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", margin: "0 0 14px" }}>
          Approved <span style={{ fontWeight: 400, color: "var(--ink-soft)", fontSize: 14 }}>(most recent 20)</span>
        </h2>
        {!approved?.length ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>No approved testimonies yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {approved.map((t) => <Card key={t.id} testimony={t} isPending={false} />)}
          </div>
        )}
      </section>
    </div>
  );
}
