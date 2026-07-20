import { requireAdmin } from "@/lib/supabase/require-admin";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <AdminShell email={user.email ?? ""}>
      {children}
    </AdminShell>
  );
}
