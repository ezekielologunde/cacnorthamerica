import Link from "next/link";
import { getLeadersByCategory } from "@/lib/data/queries";
import type { Leader } from "@/lib/data/types";

export const metadata = { title: "Leadership" };

function LeaderGrid({ leaders }: { leaders: Leader[] }) {
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {leaders.map((leader) => (
        <Link
          key={leader.id}
          href={`/leadership/${leader.id}`}
          className="rounded-xl border border-navy-800/10 p-6 hover:border-gold-400 transition-colors"
        >
          <h3 className="font-serif-display text-lg text-navy-900">
            {leader.fullName}
          </h3>
          <p className="mt-1 text-sm text-gold-600">{leader.title}</p>
        </Link>
      ))}
    </div>
  );
}

export default async function LeadershipPage() {
  const [regional, hq] = await Promise.all([
    getLeadersByCategory("cacna_regional"),
    getLeadersByCategory("global_hq"),
  ]);

  return (
    <section className="section-shell py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
        Our Leaders
      </p>
      <h1 className="mt-2 font-serif-display text-4xl text-navy-900">
        Leadership
      </h1>

      <h2 className="mt-12 font-serif-display text-2xl text-navy-900">
        CACNA Regional Leadership
      </h2>
      <LeaderGrid leaders={regional} />

      <h2 className="mt-16 font-serif-display text-2xl text-navy-900">
        CAC Nigeria &amp; Overseas — Current Leaders
      </h2>
      <LeaderGrid leaders={hq} />

      <Link
        href="/leadership/past"
        className="mt-12 inline-block text-sm font-semibold text-gold-600 hover:text-gold-500"
      >
        View past leaders →
      </Link>
    </section>
  );
}
