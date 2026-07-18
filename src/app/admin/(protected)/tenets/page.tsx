import Link from "next/link";
import { getAllTenets } from "@/lib/data/queries";
import { DeleteButton } from "@/components/admin/fields";
import { removeTenet } from "./actions";

export default async function AdminTenetsPage() {
  const tenets = await getAllTenets();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif-display text-3xl text-navy-900">Tenets</h1>
        <Link
          href="/admin/tenets/new"
          className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-cream-100 hover:bg-navy-800"
        >
          + New Tenet
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-navy-800/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-cream-200 text-left text-xs uppercase tracking-wide text-navy-800/60">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {tenets.map((tenet) => (
              <tr key={tenet.id} className="border-t border-navy-800/10">
                <td className="px-4 py-3 text-navy-800/70">{tenet.sortOrder}</td>
                <td className="px-4 py-3 font-medium text-navy-900">
                  {tenet.title}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      tenet.isPublished
                        ? "text-green-700 text-xs font-semibold"
                        : "text-navy-800/40 text-xs font-semibold"
                    }
                  >
                    {tenet.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link
                    href={`/admin/tenets/${tenet.id}/edit`}
                    className="text-sm font-medium text-navy-800 hover:text-gold-600"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={async (formData) => {
                      "use server";
                      formData.set("id", tenet.id);
                      await removeTenet(formData);
                    }}
                  />
                </td>
              </tr>
            ))}
            {tenets.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-navy-800/50">
                  No tenets yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
