import { Field, inputClass, SubmitButton } from "@/components/admin/fields";
import { saveDepartment } from "../actions";

export default function NewDepartmentPage() {
  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">
        New Department
      </h1>
      <form action={saveDepartment} className="mt-6 space-y-5 max-w-xl">
        <Field label="Name">
          <input name="name" required className={inputClass} />
        </Field>
        <Field label="Description">
          <textarea name="description" rows={4} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Leader Name">
            <input name="leaderName" className={inputClass} />
          </Field>
          <Field label="Sort Order">
            <input
              type="number"
              name="sortOrder"
              defaultValue={0}
              className={inputClass}
            />
          </Field>
          <Field label="Contact Email">
            <input name="contactEmail" className={inputClass} />
          </Field>
          <Field label="Contact Phone">
            <input name="contactPhone" className={inputClass} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-navy-800">
          <input type="checkbox" name="isPublished" defaultChecked />
          Published
        </label>
        <SubmitButton label="Create Department" />
      </form>
    </div>
  );
}
