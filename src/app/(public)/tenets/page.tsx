import { getTenets } from "@/lib/data/queries";

export const metadata = { title: "Our Tenets" };

export default async function TenetsPage() {
  const tenets = await getTenets();

  return (
    <section className="section-shell py-20 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
        What We Believe
      </p>
      <h1 className="mt-2 font-serif-display text-4xl text-navy-900">
        Our Tenets
      </h1>
      <ol className="mt-10 space-y-6">
        {tenets.map((tenet, i) => (
          <li key={tenet.id} className="flex gap-4">
            <span className="font-serif-display text-2xl text-gold-500 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-serif-display text-lg text-navy-900">
                {tenet.title}
              </h2>
              <p className="mt-1 text-navy-800/70">{tenet.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
