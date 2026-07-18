import { notFound } from "next/navigation";
import { getChurchById } from "@/lib/data/queries";
import { Field, inputClass, SubmitButton } from "@/components/admin/fields";
import { saveChurch } from "../../actions";

export default async function EditChurchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const church = await getChurchById(id);
  if (!church) notFound();

  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">
        Edit Member Church
      </h1>
      <form action={saveChurch} className="mt-6 space-y-5 max-w-xl">
        <input type="hidden" name="id" value={church.id} />
        <Field label="Name">
          <input
            name="name"
            required
            defaultValue={church.name}
            className={inputClass}
          />
        </Field>
        <Field label="Address">
          <input
            name="address"
            defaultValue={church.address}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="City">
            <input
              name="city"
              defaultValue={church.city}
              className={inputClass}
            />
          </Field>
          <Field label="Region/State">
            <input
              name="region"
              defaultValue={church.region}
              className={inputClass}
            />
          </Field>
          <Field label="Country">
            <input
              name="country"
              defaultValue={church.country}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Contact Phone">
            <input
              name="contactPhone"
              defaultValue={church.contactPhone}
              className={inputClass}
            />
          </Field>
          <Field label="Website URL">
            <input
              name="websiteUrl"
              defaultValue={church.websiteUrl}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Category">
          <select
            name="category"
            className={inputClass}
            defaultValue={church.category}
          >
            <option value="member">Member Church</option>
            <option value="partner">Partner Church</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 text-sm text-navy-800">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={church.isPublished}
          />
          Published
        </label>
        <SubmitButton label="Save Changes" />
      </form>
    </div>
  );
}
