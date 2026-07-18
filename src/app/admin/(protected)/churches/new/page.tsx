import { Field, inputClass, SubmitButton } from "@/components/admin/fields";
import { saveChurch } from "../actions";

export default function NewChurchPage() {
  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">
        New Member Church
      </h1>
      <form action={saveChurch} className="mt-6 space-y-5 max-w-xl">
        <Field label="Name">
          <input name="name" required className={inputClass} />
        </Field>
        <Field label="Address">
          <input name="address" className={inputClass} />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="City">
            <input name="city" className={inputClass} />
          </Field>
          <Field label="Region/State">
            <input name="region" className={inputClass} />
          </Field>
          <Field label="Country">
            <input name="country" defaultValue="USA" className={inputClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Contact Phone">
            <input name="contactPhone" className={inputClass} />
          </Field>
          <Field label="Website URL">
            <input name="websiteUrl" className={inputClass} />
          </Field>
        </div>
        <Field label="Category">
          <select name="category" className={inputClass} defaultValue="member">
            <option value="member">Member Church</option>
            <option value="partner">Partner Church</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 text-sm text-navy-800">
          <input type="checkbox" name="isPublished" defaultChecked />
          Published
        </label>
        <SubmitButton label="Create Church" />
      </form>
    </div>
  );
}
