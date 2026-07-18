import { Field, inputClass, SubmitButton } from "@/components/admin/fields";
import { saveEvent } from "../actions";

export default function NewEventPage() {
  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">New Event</h1>
      <form action={saveEvent} className="mt-6 space-y-5 max-w-xl">
        <Field label="Title">
          <input name="title" required className={inputClass} />
        </Field>
        <Field label="Description">
          <textarea name="description" rows={4} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Date">
            <input type="date" name="startDate" required className={inputClass} />
          </Field>
          <Field label="End Date">
            <input type="date" name="endDate" required className={inputClass} />
          </Field>
        </div>
        <Field label="Event Type">
          <select name="eventType" className={inputClass} defaultValue="service">
            <option value="convention">Convention</option>
            <option value="service">Service</option>
            <option value="special">Special</option>
          </select>
        </Field>
        <Field label="Location">
          <input name="location" className={inputClass} />
        </Field>
        <Field label="Theme (optional)">
          <input name="themeText" className={inputClass} />
        </Field>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input type="checkbox" name="isPublished" defaultChecked />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input type="checkbox" name="isFeatured" />
            Featured on homepage
          </label>
        </div>
        <SubmitButton label="Create Event" />
      </form>
    </div>
  );
}
