import Link from "next/link";
import Countdown from "@/components/public/Countdown";
import {
  getFeaturedEvent,
  getUpcomingEvents,
  getChurches,
  getSiteContent,
  getSiteSettings,
} from "@/lib/data/queries";

const SERVICES = [
  {
    day: "Sunday",
    name: "Sunday Worship",
    time: "10:30 AM ET",
    mode: "Onsite & Online",
    blurb: "Spirit-led worship, biblical teaching, and community across CACNA member churches.",
  },
  {
    day: "Wednesday",
    name: "Bible Study",
    time: "7:00 PM ET",
    mode: "Online",
    blurb: "Deep-dive scriptural teaching to ground your week in the Word.",
  },
  {
    day: "Friday",
    name: "Prayer Meeting",
    time: "7:00 PM ET",
    mode: "Online",
    blurb: "A Spirit-filled hour of corporate prayer and intercession.",
  },
];

export default async function HomePage() {
  const [featuredEvent, upcomingEventsAll, churches, settings, welcome, watchword, presidentsWord] =
    await Promise.all([
      getFeaturedEvent(),
      getUpcomingEvents(),
      getChurches(),
      getSiteSettings(),
      getSiteContent("home", "welcome"),
      getSiteContent("home", "watchword"),
      getSiteContent("home", "presidents_word"),
    ]);
  const upcomingEvents = upcomingEventsAll.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 text-cream-100">
        <div className="section-shell py-20 md:py-28 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              Welcome to
            </p>
            <h1 className="mt-3 font-serif-display text-4xl md:text-5xl leading-tight">
              Christ Apostolic Church North America
            </h1>
            <p className="mt-5 max-w-lg text-cream-100/80">{welcome}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/live"
                className="rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-navy-950 hover:bg-gold-400 transition-colors"
              >
                Join Us Online
              </Link>
              <Link
                href="/churches"
                className="rounded-full border border-cream-100/30 px-5 py-3 text-sm font-semibold hover:bg-cream-100/10 transition-colors"
              >
                Find a Church Near You
              </Link>
            </div>
          </div>

          {featuredEvent && (
            <div className="rounded-2xl border border-cream-100/15 bg-cream-100/5 p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-400">
                Mark Your Calendar
              </p>
              <h2 className="mt-2 font-serif-display text-2xl">
                {featuredEvent.title}
              </h2>
              {featuredEvent.themeText && (
                <p className="mt-1 text-sm italic text-cream-100/70">
                  Theme: &ldquo;{featuredEvent.themeText}&rdquo;
                </p>
              )}
              <p className="mt-3 text-sm text-cream-100/80">
                {featuredEvent.location}
              </p>
              <div className="mt-6">
                <Countdown target={`${featuredEvent.startDate}T00:00:00`} />
              </div>
              <Link
                href={`/events/${featuredEvent.slug}`}
                className="mt-6 inline-block text-sm font-semibold text-gold-400 hover:text-gold-300"
              >
                Full details →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Watchword */}
      {watchword && (
        <section className="bg-gold-100">
          <div className="section-shell py-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Our Watchword
            </p>
            <p className="mt-4 font-serif-display text-xl md:text-2xl text-navy-900 max-w-3xl mx-auto">
              {watchword}
            </p>
          </div>
        </section>
      )}

      {/* President's word */}
      {presidentsWord && (
        <section className="section-shell py-20 grid gap-10 md:grid-cols-3 md:items-start">
          <div className="md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              A Word From Our President
            </p>
            <p className="mt-3 font-serif-display text-lg text-navy-900">
              CACNA National Leadership
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="font-serif-display text-xl md:text-2xl leading-relaxed text-navy-900">
              &ldquo;{presidentsWord}&rdquo;
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-sm font-semibold text-gold-600 hover:text-gold-500"
            >
              Read our story →
            </Link>
          </div>
        </section>
      )}

      {/* Weekly services */}
      <section className="bg-navy-900 text-cream-100">
        <div className="section-shell py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            How We Gather
          </p>
          <h2 className="mt-2 font-serif-display text-3xl">Weekly Services</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.name}
                className="rounded-xl border border-cream-100/15 p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-400">
                  {s.day}
                </p>
                <h3 className="mt-2 font-serif-display text-lg">{s.name}</h3>
                <p className="mt-1 text-sm text-cream-100/70">{s.time}</p>
                <p className="mt-3 text-sm text-cream-100/80">{s.blurb}</p>
                <p className="mt-4 text-xs font-semibold text-gold-400">
                  {s.mode}
                </p>
              </div>
            ))}
          </div>

          {settings.prayerLineNumber && (
            <div className="mt-8 rounded-xl bg-cream-100/5 border border-cream-100/15 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-400">
                  Prayer Line
                </p>
                <p className="mt-1 text-cream-100/90">
                  Start every day in prayer — join our daily morning prayer line.
                </p>
              </div>
              <div className="text-sm">
                <p className="font-serif-display text-lg">
                  {settings.prayerLineTime}
                </p>
                <p className="text-cream-100/70">
                  {settings.prayerLineNumber} · Code {settings.prayerLineAccessCode}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming events */}
      <section className="section-shell py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
          Mark Your Calendar
        </p>
        <h2 className="mt-2 font-serif-display text-3xl text-navy-900">
          Upcoming Events
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {upcomingEvents.map((event) => {
            const date = new Date(`${event.startDate}T00:00:00`);
            return (
              <div
                key={event.id}
                className="rounded-xl border border-navy-800/10 p-6 flex gap-4"
              >
                <div className="shrink-0 text-center">
                  <p className="text-xs font-semibold uppercase text-gold-600">
                    {date.toLocaleString("en-US", { month: "short" })}
                  </p>
                  <p className="font-serif-display text-2xl text-navy-900">
                    {date.getDate()}
                  </p>
                </div>
                <div>
                  <h3 className="font-serif-display text-lg text-navy-900">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm text-navy-800/70 line-clamp-3">
                    {event.description}
                  </p>
                  <Link
                    href={`/events/${event.slug}`}
                    className="mt-3 inline-block text-sm font-semibold text-gold-600 hover:text-gold-500"
                  >
                    Full details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <Link
          href="/events"
          className="mt-8 inline-block text-sm font-semibold text-gold-600 hover:text-gold-500"
        >
          View all events →
        </Link>
      </section>

      {/* Church directory */}
      <section className="bg-cream-200">
        <div className="section-shell py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
            One Family, Many Homes
          </p>
          <h2 className="mt-2 font-serif-display text-3xl text-navy-900">
            Worship With Us Across North America
          </h2>
          <p className="mt-3 max-w-2xl text-navy-800/70">
            Find a seat at one of our member churches across the United States
            and Canada.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {churches.map((church) => (
              <div
                key={church.id}
                className="rounded-xl bg-cream-100 border border-navy-800/10 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                  {church.city}, {church.region}
                </p>
                <h3 className="mt-1 font-serif-display text-lg text-navy-900">
                  {church.name}
                </h3>
                <p className="mt-2 text-sm text-navy-800/70">{church.address}</p>
              </div>
            ))}
          </div>
          <Link
            href="/churches"
            className="mt-8 inline-block text-sm font-semibold text-gold-600 hover:text-gold-500"
          >
            View all member churches →
          </Link>
        </div>
      </section>

      {/* Visit CTA */}
      <section className="section-shell py-20 text-center">
        <h2 className="font-serif-display text-3xl text-navy-900">
          There&rsquo;s a seat with your name on it.
        </h2>
        <p className="mt-3 text-navy-800/70">
          {settings.address} · {settings.contactPhone} · {settings.contactEmail}
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-cream-100 hover:bg-navy-800 transition-colors"
        >
          Plan Your Visit →
        </Link>
      </section>
    </>
  );
}
