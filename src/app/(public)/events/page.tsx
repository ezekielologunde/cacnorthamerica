import Link from "next/link";
import { getUpcomingEvents } from "@/lib/data/queries";

export const metadata = { title: "Upcoming Events" };

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <section className="section-shell py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
        Mark Your Calendar
      </p>
      <h1 className="mt-2 font-serif-display text-4xl text-navy-900">
        Upcoming Events
      </h1>
      <div className="mt-10 space-y-4">
        {events.map((event) => {
          const start = new Date(`${event.startDate}T00:00:00`);
          const end = new Date(`${event.endDate}T00:00:00`);
          return (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="flex gap-5 rounded-xl border border-navy-800/10 p-6 hover:border-gold-400 transition-colors"
            >
              <div className="shrink-0 text-center w-16">
                <p className="text-xs font-semibold uppercase text-gold-600">
                  {start.toLocaleString("en-US", { month: "short" })}
                </p>
                <p className="font-serif-display text-2xl text-navy-900">
                  {start.getDate()}
                </p>
              </div>
              <div>
                <h2 className="font-serif-display text-xl text-navy-900">
                  {event.title}
                </h2>
                <p className="mt-1 text-xs uppercase tracking-wide text-gold-600">
                  {start.toDateString() === end.toDateString()
                    ? start.toLocaleDateString()
                    : `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`}
                </p>
                <p className="mt-2 text-sm text-navy-800/70">
                  {event.description}
                </p>
                <p className="mt-2 text-sm text-navy-800/60">{event.location}</p>
              </div>
            </Link>
          );
        })}
        {events.length === 0 && (
          <p className="text-navy-800/60">No upcoming events at this time.</p>
        )}
      </div>
    </section>
  );
}
