import { notFound } from "next/navigation";
import { getDepartmentBySlug } from "@/lib/data/queries";

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const department = await getDepartmentBySlug(slug);
  if (!department) notFound();

  return (
    <section className="section-shell py-20 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
        Ministry
      </p>
      <h1 className="mt-2 font-serif-display text-4xl text-navy-900">
        {department.name}
      </h1>
      <p className="mt-6 text-navy-800/80 leading-relaxed">
        {department.description}
      </p>
      {(department.leaderName || department.contactEmail) && (
        <div className="mt-8 rounded-xl border border-navy-800/10 p-6 text-sm text-navy-800/70">
          {department.leaderName && <p>Leader: {department.leaderName}</p>}
          {department.contactEmail && <p>Email: {department.contactEmail}</p>}
          {department.contactPhone && <p>Phone: {department.contactPhone}</p>}
        </div>
      )}
    </section>
  );
}
