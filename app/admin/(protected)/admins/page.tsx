import { requireAdmin } from "@/lib/supabase/require-admin";
import AdminsClient from "./AdminsClient";

export default async function AdminsPage() {
  const { supabase: service, user } = await requireAdmin();
  const { data: admins } = await service
    .from("admin_profiles").select("id, email, created_at").order("created_at");

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          Manage Admins
        </h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 15, margin: 0 }}>
          Invite new admins or remove existing ones. Invitations are sent by email.
        </p>
      </div>
      <AdminsClient admins={admins ?? []} currentUserId={user.id} />
    </div>
  );
}
