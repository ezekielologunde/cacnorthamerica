import Link from "next/link";
import { getAllChurches } from "@/lib/data/queries";
import { DeleteButton } from "@/components/admin/fields";
import { removeChurch } from "./actions";

export default async function AdminChurchesPage() {
  const churches = await getAllChurches();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif-display text-3xl text-navy-900">
          Member Churches
        </h1>
        <Link
          href="/admin/churches/new"
          className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-cream-100 hover:bg-navy-800"
        >
          + New Church
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-navy-800/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-cream-200 text-left text-xs uppercase tracking-wide text-navy-800/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {churches.map((c) => (
              <tr key={c.id} className="border-t border-navy-800/10">
                <td className="px-4 py-3 font-medium text-navy-900">
                  {c.name}
                </td>
                <td className="px-4 py-3 text-navy-800/70">
                  {c.city}, {c.region}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      c.isPublished
                        ? "text-green-700 text-xs font-semibold"
                        : "text-navy-800/40 text-xs font-semibold"
                    }
                  >
                    {c.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link
                    href={`/admin/churches/${c.id}/edit`}
                    className="text-sm font-medium text-navy-800 hover:text-gold-600"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={async (formData) => {
                      "use server";
                      formData.set("id", c.id);
                      await removeChurch(formData);
                    }}
                  />
                </td>
              </tr>
            ))}
            {churches.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-navy-800/50">
                  No churches yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
