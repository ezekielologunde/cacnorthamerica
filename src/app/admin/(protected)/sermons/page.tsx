import Link from "next/link";
import { getAllLiveStreams } from "@/lib/data/queries";
import { DeleteButton } from "@/components/admin/fields";
import { removeLiveStream } from "./actions";

export default async function AdminSermonsPage() {
  const streams = await getAllLiveStreams();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif-display text-3xl text-navy-900">
          Sermons & Live Streams
        </h1>
        <Link
          href="/admin/sermons/new"
          className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-cream-100 hover:bg-navy-800"
        >
          + New Stream
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-navy-800/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-cream-200 text-left text-xs uppercase tracking-wide text-navy-800/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Live</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {streams.map((s) => (
              <tr key={s.id} className="border-t border-navy-800/10">
                <td className="px-4 py-3">
                  <p className="font-medium text-navy-900">{s.title}</p>
                  <p className="text-xs text-navy-800/50">{s.speaker}</p>
                </td>
                <td className="px-4 py-3 capitalize text-navy-800/70">
                  {s.platform}
                </td>
                <td className="px-4 py-3">
                  {s.isLive ? (
                    <span className="text-xs font-semibold text-red-700">
                      Live Now
                    </span>
                  ) : (
                    <span className="text-xs text-navy-800/50">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      s.isPublished
                        ? "text-green-700 text-xs font-semibold"
                        : "text-navy-800/40 text-xs font-semibold"
                    }
                  >
                    {s.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link
                    href={`/admin/sermons/${s.id}/edit`}
                    className="text-sm font-medium text-navy-800 hover:text-gold-600"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={async (formData) => {
                      "use server";
                      formData.set("id", s.id);
                      await removeLiveStream(formData);
                    }}
                  />
                </td>
              </tr>
            ))}
            {streams.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-navy-800/50">
                  No streams yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
