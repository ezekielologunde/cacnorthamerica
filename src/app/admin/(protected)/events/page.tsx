import Link from "next/link";
import { getAllEvents } from "@/lib/data/queries";
import { DeleteButton } from "@/components/admin/fields";
import { removeEvent } from "./actions";

export default async function AdminEventsPage() {
  const events = await getAllEvents();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif-display text-3xl text-navy-900">Events</h1>
        <Link
          href="/admin/events/new"
          className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-cream-100 hover:bg-navy-800"
        >
          + New Event
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-navy-800/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-cream-200 text-left text-xs uppercase tracking-wide text-navy-800/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t border-navy-800/10">
                <td className="px-4 py-3">
                  <p className="font-medium text-navy-900">{event.title}</p>
                  {event.isFeatured && (
                    <span className="text-xs text-gold-600">Featured</span>
                  )}
                </td>
                <td className="px-4 py-3 capitalize text-navy-800/70">
                  {event.eventType}
                </td>
                <td className="px-4 py-3 text-navy-800/70">
                  {event.startDate} – {event.endDate}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      event.isPublished
                        ? "text-green-700 text-xs font-semibold"
                        : "text-navy-800/40 text-xs font-semibold"
                    }
                  >
                    {event.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="text-sm font-medium text-navy-800 hover:text-gold-600"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={async (formData) => {
                      "use server";
                      formData.set("id", event.id);
                      await removeEvent(formData);
                    }}
                  />
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-navy-800/50"
                >
                  No events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
