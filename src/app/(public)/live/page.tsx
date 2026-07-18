import { getLiveStreams, getSiteSettings } from "@/lib/data/queries";

export const metadata = { title: "Watch & Grow" };

export default async function LivePage() {
  const [streams, settings] = await Promise.all([
    getLiveStreams(),
    getSiteSettings(),
  ]);
  const current = streams.find((s) => s.isLive);
  const upcoming = streams.filter((s) => !s.isLive);

  return (
    <section className="section-shell py-20 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
        Watch & Grow
      </p>
      <h1 className="mt-2 font-serif-display text-4xl text-navy-900">
        Live Streaming
      </h1>

      {current ? (
        <div className="mt-8 rounded-xl bg-navy-950 text-cream-100 p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-400">
            Live Now
          </p>
          <h2 className="mt-2 font-serif-display text-2xl">{current.title}</h2>
          <p className="mt-1 text-cream-100/70">{current.speaker}</p>
          <a
            href={current.streamUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-navy-950 hover:bg-gold-400"
          >
            Watch Now →
          </a>
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-navy-800/10 p-8">
          <p className="text-navy-800/70">
            We&rsquo;re not live right now — join us for the next service.
          </p>
          {settings.prayerLineNumber && (
            <p className="mt-2 text-sm text-navy-800/60">
              Daily prayer line: {settings.prayerLineNumber} at{" "}
              {settings.prayerLineTime} (code {settings.prayerLineAccessCode})
            </p>
          )}
        </div>
      )}

      <div className="mt-10">
        <h2 className="font-serif-display text-2xl text-navy-900">
          Upcoming Services
        </h2>
        <div className="mt-4 space-y-3">
          {upcoming.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-navy-800/10 p-5 flex items-center justify-between"
            >
              <div>
                <p className="font-serif-display text-lg text-navy-900">
                  {s.title}
                </p>
                <p className="text-sm text-navy-800/60">{s.speaker}</p>
              </div>
              <a
                href={s.streamUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-gold-600 hover:text-gold-500"
              >
                View channel →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
