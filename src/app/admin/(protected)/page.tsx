import Link from "next/link";
import {
  getAllEvents,
  getAllDepartments,
  getAllAnnouncements,
  getAllLiveStreams,
  getAllChurches,
  getMedia,
} from "@/lib/data/queries";

export default async function AdminDashboard() {
  const [events, departments, streams, announcements, churches, media] =
    await Promise.all([
      getAllEvents(),
      getAllDepartments(),
      getAllLiveStreams(),
      getAllAnnouncements(),
      getAllChurches(),
      getMedia(),
    ]);

  const cards = [
    { label: "Events", href: "/admin/events", count: events.length },
    {
      label: "Departments",
      href: "/admin/departments",
      count: departments.length,
    },
    {
      label: "Sermons & Live",
      href: "/admin/sermons",
      count: streams.length,
    },
    {
      label: "Announcements",
      href: "/admin/announcements",
      count: announcements.length,
    },
    {
      label: "Member Churches",
      href: "/admin/churches",
      count: churches.length,
    },
    { label: "Media", href: "/admin/media", count: media.length },
  ];

  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">Dashboard</h1>
      <p className="mt-2 text-navy-800/60">
        Manage CACNA&rsquo;s public site content from here.
      </p>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-navy-800/10 bg-white p-5 hover:border-gold-400 transition-colors"
          >
            <p className="text-3xl font-serif-display text-navy-900">
              {card.count}
            </p>
            <p className="mt-1 text-sm text-navy-800/60">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
