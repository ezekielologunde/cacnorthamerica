import { Field, inputClass, SubmitButton } from "@/components/admin/fields";
import { saveTenet } from "../actions";

export default function NewTenetPage() {
  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">New Tenet</h1>
      <form action={saveTenet} className="mt-6 space-y-5 max-w-xl">
        <Field label="Sort Order">
          <input type="number" name="sortOrder" defaultValue={0} className={inputClass} />
        </Field>
        <Field label="Title">
          <input name="title" required className={inputClass} />
        </Field>
        <Field label="Body">
          <textarea name="body" rows={4} className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-navy-800">
          <input type="checkbox" name="isPublished" defaultChecked />
          Published
        </label>
        <SubmitButton label="Create Tenet" />
      </form>
    </div>
  );
}
