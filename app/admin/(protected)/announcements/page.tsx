import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";
import { toggleActive } from "./actions";
import ActionButton from "@/components/admin/ActionButton";

export default async function AnnouncementsListPage() {
  const supabase = createServiceClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, bg_color, placement, active, expires_at, created_at")
    .order("active", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 }}>Announcements</h1>
        <Link
          href="/admin/announcements/new"
          style={{ background: "var(--red)", color: "white", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}
        >
          + New Announcement
        </Link>
      </div>

      {!announcements?.length ? (
        <div style={{ background: "white", borderRadius: 12, padding: "48px 32px", textAlign: "center", color: "var(--ink-soft)" }}>
          <p style={{ fontSize: 16, margin: "0 0 12px" }}>No announcements yet.</p>
          <Link href="/admin/announcements/new" style={{ color: "var(--red)", fontWeight: 600 }}>
            Add your first announcement →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {announcements.map((a) => {
            const isExpired = a.expires_at ? new Date(a.expires_at) < new Date() : false;

            return (
              <div
                key={a.id}
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: "16px 22px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                  flexWrap: "wrap",
                }}
              >
                {/* Color dot */}
                <span
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: a.bg_color ?? "#D62828",
                    flexShrink: 0,
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                />

                {/* Title */}
                <span style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)", flex: 1, minWidth: 120 }}>
                  {a.title}
                </span>

                {/* Placement badge */}
                <span style={{
                  background: "#f3f4f6",
                  color: "var(--ink-soft)",
                  borderRadius: 20,
                  padding: "3px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}>
                  {a.placement ?? "homepage"}
                </span>

                {/* Active / Inactive badge */}
                <span style={{
                  background: a.active && !isExpired ? "#dcfce7" : "#fef9c3",
                  color: a.active && !isExpired ? "#15803d" : "#854d0e",
                  borderRadius: 20,
                  padding: "3px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                  {a.active && !isExpired ? "Active" : isExpired ? "Expired" : "Inactive"}
                </span>

                {/* Expires */}
                {a.expires_at && (
                  <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                    Expires: {new Date(a.expires_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}

                {/* Edit link */}
                <Link
                  href={`/admin/announcements/${a.id}`}
                  style={{ color: "var(--red)", fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}
                >
                  Edit →
                </Link>

                {/* Toggle Active */}
                <form action={toggleActive.bind(null, a.id, !a.active)}>
                  <ActionButton
                    style={{
                      background: "transparent",
                      border: "1.5px solid rgba(0,0,0,0.15)",
                      borderRadius: 8,
                      padding: "5px 14px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--ink-soft)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.active ? "Deactivate" : "Activate"}
                  </ActionButton>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
