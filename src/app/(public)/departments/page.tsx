import Link from "next/link";
import { getDepartments } from "@/lib/data/queries";

export const metadata = { title: "Ministries" };

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <section className="section-shell py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
        Our Ministries
      </p>
      <h1 className="mt-2 font-serif-display text-4xl text-navy-900">
        Departments
      </h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {departments.map((dept) => (
          <Link
            key={dept.id}
            href={`/departments/${dept.slug}`}
            className="overflow-hidden rounded-xl border border-navy-800/10 hover:border-gold-400 transition-colors"
          >
            {dept.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dept.imageUrl}
                alt={dept.name}
                className="h-40 w-full object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="font-serif-display text-xl text-navy-900">
                {dept.name}
              </h2>
              <p className="mt-2 text-sm text-navy-800/70 line-clamp-3">
                {dept.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
