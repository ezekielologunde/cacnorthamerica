import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data/queries";
import { Field, inputClass, SubmitButton } from "@/components/admin/fields";
import { saveEvent } from "../../actions";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">Edit Event</h1>
      <form action={saveEvent} className="mt-6 space-y-5 max-w-xl">
        <input type="hidden" name="id" value={event.id} />
        <Field label="Title">
          <input
            name="title"
            required
            defaultValue={event.title}
            className={inputClass}
          />
        </Field>
        <Field label="Description">
          <textarea
            name="description"
            rows={4}
            defaultValue={event.description}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Date">
            <input
              type="date"
              name="startDate"
              required
              defaultValue={event.startDate}
              className={inputClass}
            />
          </Field>
          <Field label="End Date">
            <input
              type="date"
              name="endDate"
              required
              defaultValue={event.endDate}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Event Type">
          <select
            name="eventType"
            className={inputClass}
            defaultValue={event.eventType}
          >
            <option value="convention">Convention</option>
            <option value="service">Service</option>
            <option value="special">Special</option>
          </select>
        </Field>
        <Field label="Location">
          <input
            name="location"
            defaultValue={event.location}
            className={inputClass}
          />
        </Field>
        <Field label="Theme (optional)">
          <input
            name="themeText"
            defaultValue={event.themeText}
            className={inputClass}
          />
        </Field>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={event.isPublished}
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={event.isFeatured}
            />
            Featured on homepage
          </label>
        </div>
        <SubmitButton label="Save Changes" />
      </form>
    </div>
  );
}
