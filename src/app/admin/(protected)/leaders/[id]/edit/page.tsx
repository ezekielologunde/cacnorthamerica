import { notFound } from "next/navigation";
import { getLeaderById } from "@/lib/data/queries";
import { Field, inputClass, SubmitButton } from "@/components/admin/fields";
import { saveLeader } from "../../actions";

export default async function EditLeaderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const leader = await getLeaderById(id);
  if (!leader) notFound();

  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">
        Edit Leader
      </h1>
      <form action={saveLeader} className="mt-6 space-y-5 max-w-xl">
        <input type="hidden" name="id" value={leader.id} />
        <Field label="Full Name">
          <input
            name="fullName"
            required
            defaultValue={leader.fullName}
            className={inputClass}
          />
        </Field>
        <Field label="Title">
          <input name="title" defaultValue={leader.title} className={inputClass} />
        </Field>
        <Field label="Category">
          <select
            name="category"
            required
            defaultValue={leader.category}
            className={inputClass}
          >
            <option value="cacna_regional">CACNA Regional</option>
            <option value="global_hq">CAC HQ (Nigeria/Overseas)</option>
            <option value="zonal_superintendent">Zonal Superintendent</option>
            <option value="past_president">Past President</option>
            <option value="past_superintendent">Past Superintendent</option>
            <option value="past_evangelist">Past Evangelist</option>
          </select>
        </Field>
        <Field label="Bio (leave blank to show &quot;bio coming soon&quot;)">
          <textarea
            name="bio"
            rows={4}
            defaultValue={leader.bio}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Zone Name (zonal superintendents only)">
            <input
              name="zoneName"
              defaultValue={leader.zoneName}
              className={inputClass}
            />
          </Field>
          <Field label="Sort Order">
            <input
              type="number"
              name="sortOrder"
              defaultValue={leader.sortOrder}
              className={inputClass}
            />
          </Field>
          <Field label="Phone">
            <input name="phone" defaultValue={leader.phone} className={inputClass} />
          </Field>
          <Field label="Email">
            <input name="email" defaultValue={leader.email} className={inputClass} />
          </Field>
          <Field label="Tenure Start (past leaders only)">
            <input
              name="tenureStart"
              defaultValue={leader.tenureStart}
              className={inputClass}
            />
          </Field>
          <Field label="Tenure End (past leaders only)">
            <input
              name="tenureEnd"
              defaultValue={leader.tenureEnd}
              className={inputClass}
            />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-navy-800">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={leader.isPublished}
          />
          Published
        </label>
        <SubmitButton label="Save Changes" />
      </form>
    </div>
  );
}
