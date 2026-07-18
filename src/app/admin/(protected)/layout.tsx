import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { signOut } from "./actions";

export const metadata = { title: "Admin" };

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4">
        <div className="max-w-sm rounded-xl border border-navy-800/10 bg-white p-8 text-center">
          <p className="font-serif-display text-xl text-navy-900">
            Account Pending Activation
          </p>
          <p className="mt-3 text-sm text-navy-800/60">
            Signed in as {user.email}. A super admin needs to activate this
            account in Site Settings → Admin Users before you can manage
            content.
          </p>
          <form action={signOut} className="mt-6">
            <button
              type="submit"
              className="text-sm font-semibold text-gold-600 hover:text-gold-500"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream-100">
      <AdminSidebar />
      <div className="flex-1">
        <div className="border-b border-navy-800/10 bg-gold-100 px-8 py-2 text-xs text-navy-800/70 flex items-center justify-between">
          <span>
            Signed in as {user.email} ({profile.role})
          </span>
          <form action={signOut}>
            <button type="submit" className="font-semibold hover:text-navy-900">
              Sign out
            </button>
          </form>
        </div>
        <main className="p-8 max-w-5xl">{children}</main>
      </div>
    </div>
  );
}
