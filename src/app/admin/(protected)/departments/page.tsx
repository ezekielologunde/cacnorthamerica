import Link from "next/link";
import { getAllDepartments } from "@/lib/data/queries";
import { DeleteButton } from "@/components/admin/fields";
import { removeDepartment } from "./actions";

export default async function AdminDepartmentsPage() {
  const allDepartments = await getAllDepartments();
  const departments = allDepartments.sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif-display text-3xl text-navy-900">
          Departments
        </h1>
        <Link
          href="/admin/departments/new"
          className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-cream-100 hover:bg-navy-800"
        >
          + New Department
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-navy-800/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-cream-200 text-left text-xs uppercase tracking-wide text-navy-800/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="border-t border-navy-800/10">
                <td className="px-4 py-3 font-medium text-navy-900">
                  {dept.name}
                </td>
                <td className="px-4 py-3 text-navy-800/70">
                  {dept.sortOrder}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      dept.isPublished
                        ? "text-green-700 text-xs font-semibold"
                        : "text-navy-800/40 text-xs font-semibold"
                    }
                  >
                    {dept.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link
                    href={`/admin/departments/${dept.id}/edit`}
                    className="text-sm font-medium text-navy-800 hover:text-gold-600"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={async (formData) => {
                      "use server";
                      formData.set("id", dept.id);
                      await removeDepartment(formData);
                    }}
                  />
                </td>
              </tr>
            ))}
            {departments.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-navy-800/50">
                  No departments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
