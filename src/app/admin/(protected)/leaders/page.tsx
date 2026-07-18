import Link from "next/link";
import { getAllLeaders } from "@/lib/data/queries";
import { DeleteButton } from "@/components/admin/fields";
import { removeLeader } from "./actions";

const CATEGORY_LABELS: Record<string, string> = {
  cacna_regional: "CACNA Regional",
  global_hq: "CAC HQ",
  zonal_superintendent: "Zonal Superintendent",
  past_president: "Past President",
  past_superintendent: "Past Superintendent",
  past_evangelist: "Past Evangelist",
};

export default async function AdminLeadersPage() {
  const leaders = await getAllLeaders();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif-display text-3xl text-navy-900">Leaders</h1>
        <Link
          href="/admin/leaders/new"
          className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-cream-100 hover:bg-navy-800"
        >
          + New Leader
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-navy-800/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-cream-200 text-left text-xs uppercase tracking-wide text-navy-800/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader) => (
              <tr key={leader.id} className="border-t border-navy-800/10">
                <td className="px-4 py-3">
                  <p className="font-medium text-navy-900">{leader.fullName}</p>
                  <p className="text-xs text-navy-800/50">{leader.title}</p>
                </td>
                <td className="px-4 py-3 text-navy-800/70">
                  {CATEGORY_LABELS[leader.category] ?? leader.category}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      leader.isPublished
                        ? "text-green-700 text-xs font-semibold"
                        : "text-navy-800/40 text-xs font-semibold"
                    }
                  >
                    {leader.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link
                    href={`/admin/leaders/${leader.id}/edit`}
                    className="text-sm font-medium text-navy-800 hover:text-gold-600"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={async (formData) => {
                      "use server";
                      formData.set("id", leader.id);
                      await removeLeader(formData);
                    }}
                  />
                </td>
              </tr>
            ))}
            {leaders.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-navy-800/50">
                  No leaders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
