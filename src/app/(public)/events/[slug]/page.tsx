import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug, getSiteContent } from "@/lib/data/queries";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const contentKey = `event-${slug}`;
  const [registrationGuidelines, zoomUrl] = await Promise.all([
    getSiteContent(contentKey, "registration_guidelines"),
    getSiteContent(contentKey, "zoom_url"),
  ]);

  const start = new Date(`${event.startDate}T00:00:00`);
  const end = new Date(`${event.endDate}T00:00:00`);

  return (
    <section className="section-shell py-20 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
        {event.eventType}
      </p>
      <h1 className="mt-2 font-serif-display text-4xl text-navy-900">
        {event.title}
      </h1>
      {event.themeText && (
        <p className="mt-2 italic text-navy-800/70">
          Theme: &ldquo;{event.themeText}&rdquo;
        </p>
      )}
      {event.bannerImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.bannerImageUrl}
          alt={event.title}
          className="mt-6 h-72 w-full rounded-xl object-cover object-top"
        />
      )}
      <p className="mt-4 text-sm font-semibold text-gold-600">
        {start.toDateString() === end.toDateString()
          ? start.toLocaleDateString()
          : `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`}
      </p>
      <p className="mt-1 text-sm text-navy-800/60">{event.location}</p>
      <p className="mt-8 text-navy-800/80 leading-relaxed">
        {event.description}
      </p>

      {event.eventType === "convention" && (
        <div className="mt-10 rounded-xl border border-navy-800/10 p-6">
          <h2 className="font-serif-display text-xl text-navy-900">
            Registration
          </h2>
          {registrationGuidelines && (
            <p className="mt-3 text-sm text-navy-800/70 leading-relaxed">
              {registrationGuidelines}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/register/${event.id}`}
              className="rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-cream-100 hover:bg-navy-800 transition-colors"
            >
              Register Now
            </Link>
            {zoomUrl && (
              <a
                href={zoomUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-navy-800/20 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-navy-900/5 transition-colors"
              >
                Join Zoom Conference
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
