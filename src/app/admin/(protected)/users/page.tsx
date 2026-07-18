import { createClient } from "@/lib/supabase/server";
import RoleSelectForm from "@/components/admin/RoleSelectForm";
import { setUserActive, setUserRole } from "./actions";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">Admin Users</h1>
      <p className="mt-2 text-sm text-navy-800/60">
        Activate accounts created via /admin/login and manage their role.
        Only active accounts can sign in and manage content.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-navy-800/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-cream-200 text-left text-xs uppercase tracking-wide text-navy-800/60">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((p) => (
              <tr key={p.id} className="border-t border-navy-800/10">
                <td className="px-4 py-3 font-medium text-navy-900">
                  {p.email}
                </td>
                <td className="px-4 py-3">
                  <RoleSelectForm id={p.id} role={p.role} action={setUserRole} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.is_active
                        ? "text-green-700 text-xs font-semibold"
                        : "text-navy-800/40 text-xs font-semibold"
                    }
                  >
                    {p.is_active ? "Active" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={setUserActive}>
                    <input type="hidden" name="id" value={p.id} />
                    <input
                      type="hidden"
                      name="isActive"
                      value={(!p.is_active).toString()}
                    />
                    <button
                      type="submit"
                      className="text-sm font-medium text-navy-800 hover:text-gold-600"
                    >
                      {p.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(profiles ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-navy-800/50">
                  No accounts yet — sign up at /admin/login.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
