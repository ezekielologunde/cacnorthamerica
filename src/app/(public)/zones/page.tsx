import { getLeadersByCategory } from "@/lib/data/queries";

export const metadata = { title: "Zones & DCC Directory" };

export default async function ZonesPage() {
  const superintendents = await getLeadersByCategory("zonal_superintendent");

  return (
    <section className="section-shell py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
        District Church Councils
      </p>
      <h1 className="mt-2 font-serif-display text-4xl text-navy-900">
        Zones &amp; Superintendents
      </h1>
      <p className="mt-3 max-w-2xl text-navy-800/70">
        CAC North America is organized into DCCs (District Church Councils) /
        zones across the United States and Canada, each led by a Zonal
        Superintendent.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {superintendents.map((leader) => (
          <div
            key={leader.id}
            className="rounded-xl border border-navy-800/10 p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
              {leader.zoneName}
            </p>
            <h2 className="mt-1 font-serif-display text-lg text-navy-900">
              {leader.fullName}
            </h2>
            <p className="mt-2 text-sm text-navy-800/70">{leader.title}</p>
            <div className="mt-3 text-sm text-navy-800/60 space-y-1">
              {leader.phone && <p>{leader.phone}</p>}
              {leader.email && <p>{leader.email}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
