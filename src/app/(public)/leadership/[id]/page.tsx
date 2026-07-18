import { notFound } from "next/navigation";
import { getLeaderById } from "@/lib/data/queries";

export default async function LeaderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const leader = await getLeaderById(id);
  if (!leader || !leader.isPublished) notFound();

  return (
    <section className="section-shell py-20 max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
        {leader.zoneName ? `${leader.zoneName} Zone` : "Leadership"}
      </p>
      <h1 className="mt-2 font-serif-display text-4xl text-navy-900">
        {leader.fullName}
      </h1>
      <p className="mt-2 text-gold-600 font-medium">{leader.title}</p>

      <p className="mt-8 text-navy-800/80 leading-relaxed">
        {leader.bio ?? "Bio coming soon."}
      </p>

      {(leader.phone || leader.email) && (
        <div className="mt-8 rounded-xl border border-navy-800/10 p-6 text-sm text-navy-800/70">
          {leader.phone && <p>Phone: {leader.phone}</p>}
          {leader.email && <p>Email: {leader.email}</p>}
        </div>
      )}
    </section>
  );
}
