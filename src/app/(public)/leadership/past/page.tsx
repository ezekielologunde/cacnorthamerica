import { getLeadersByCategory } from "@/lib/data/queries";

export const metadata = { title: "Past Leaders" };

function Roll({
  title,
  leaders,
}: {
  title: string;
  leaders: Awaited<ReturnType<typeof getLeadersByCategory>>;
}) {
  if (leaders.length === 0) return null;
  return (
    <div className="mt-10">
      <h2 className="font-serif-display text-2xl text-navy-900">{title}</h2>
      <ul className="mt-4 space-y-3">
        {leaders.map((leader) => (
          <li
            key={leader.id}
            className="flex items-baseline justify-between border-b border-navy-800/10 pb-3"
          >
            <span className="font-medium text-navy-900">
              {leader.fullName}
            </span>
            <span className="text-sm text-navy-800/60">
              {leader.tenureEnd
                ? `${leader.tenureStart} – ${leader.tenureEnd}`
                : leader.tenureStart}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function PastLeadersPage() {
  const [presidents, superintendents, evangelists] = await Promise.all([
    getLeadersByCategory("past_president"),
    getLeadersByCategory("past_superintendent"),
    getLeadersByCategory("past_evangelist"),
  ]);

  return (
    <section className="section-shell py-20 max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
        Our History
      </p>
      <h1 className="mt-2 font-serif-display text-4xl text-navy-900">
        Past Leaders
      </h1>

      <Roll title="Presidents" leaders={presidents} />
      <Roll title="General Superintendents" leaders={superintendents} />
      <Roll title="General Evangelists" leaders={evangelists} />
    </section>
  );
}
