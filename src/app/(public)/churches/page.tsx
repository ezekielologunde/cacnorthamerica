import { getChurches } from "@/lib/data/queries";

export const metadata = { title: "Member Churches" };

export default async function ChurchesPage() {
  const churches = await getChurches();

  return (
    <section className="section-shell py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
        One Family, Many Homes
      </p>
      <h1 className="mt-2 font-serif-display text-4xl text-navy-900">
        Member Churches
      </h1>
      <p className="mt-3 max-w-2xl text-navy-800/70">
        Find a CACNA member church near you across the United States and
        Canada.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {churches.map((church) => (
          <div
            key={church.id}
            className="rounded-xl border border-navy-800/10 p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
              {church.city}, {church.region}
            </p>
            <h2 className="mt-1 font-serif-display text-lg text-navy-900">
              {church.name}
            </h2>
            <p className="mt-2 text-sm text-navy-800/70">{church.address}</p>
            {church.contactPhone && (
              <p className="mt-1 text-sm text-navy-800/60">
                {church.contactPhone}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
