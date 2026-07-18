import Link from "next/link";
import { getAllAnnouncements } from "@/lib/data/queries";
import { DeleteButton } from "@/components/admin/fields";
import { removeAnnouncement } from "./actions";

export default async function AdminAnnouncementsPage() {
  const announcements = await getAllAnnouncements();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif-display text-3xl text-navy-900">
          Announcements
        </h1>
        <Link
          href="/admin/announcements/new"
          className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-cream-100 hover:bg-navy-800"
        >
          + New Announcement
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-navy-800/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-cream-200 text-left text-xs uppercase tracking-wide text-navy-800/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Pinned</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => (
              <tr key={a.id} className="border-t border-navy-800/10">
                <td className="px-4 py-3 font-medium text-navy-900">
                  {a.title}
                </td>
                <td className="px-4 py-3 text-navy-800/70">
                  {a.isPinned ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      a.isPublished
                        ? "text-green-700 text-xs font-semibold"
                        : "text-navy-800/40 text-xs font-semibold"
                    }
                  >
                    {a.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link
                    href={`/admin/announcements/${a.id}/edit`}
                    className="text-sm font-medium text-navy-800 hover:text-gold-600"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={async (formData) => {
                      "use server";
                      formData.set("id", a.id);
                      await removeAnnouncement(formData);
                    }}
                  />
                </td>
              </tr>
            ))}
            {announcements.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-navy-800/50">
                  No announcements yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
