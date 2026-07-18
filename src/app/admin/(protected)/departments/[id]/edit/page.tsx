import { notFound } from "next/navigation";
import { getDepartmentById } from "@/lib/data/queries";
import { Field, inputClass, SubmitButton } from "@/components/admin/fields";
import { saveDepartment } from "../../actions";

export default async function EditDepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dept = await getDepartmentById(id);
  if (!dept) notFound();

  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">
        Edit Department
      </h1>
      <form action={saveDepartment} className="mt-6 space-y-5 max-w-xl">
        <input type="hidden" name="id" value={dept.id} />
        <Field label="Name">
          <input
            name="name"
            required
            defaultValue={dept.name}
            className={inputClass}
          />
        </Field>
        <Field label="Description">
          <textarea
            name="description"
            rows={4}
            defaultValue={dept.description}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Leader Name">
            <input
              name="leaderName"
              defaultValue={dept.leaderName}
              className={inputClass}
            />
          </Field>
          <Field label="Sort Order">
            <input
              type="number"
              name="sortOrder"
              defaultValue={dept.sortOrder}
              className={inputClass}
            />
          </Field>
          <Field label="Contact Email">
            <input
              name="contactEmail"
              defaultValue={dept.contactEmail}
              className={inputClass}
            />
          </Field>
          <Field label="Contact Phone">
            <input
              name="contactPhone"
              defaultValue={dept.contactPhone}
              className={inputClass}
            />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-navy-800">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={dept.isPublished}
          />
          Published
        </label>
        <SubmitButton label="Save Changes" />
      </form>
    </div>
  );
}
