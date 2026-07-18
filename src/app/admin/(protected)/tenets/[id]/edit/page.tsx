import { notFound } from "next/navigation";
import { getTenetById } from "@/lib/data/queries";
import { Field, inputClass, SubmitButton } from "@/components/admin/fields";
import { saveTenet } from "../../actions";

export default async function EditTenetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenet = await getTenetById(id);
  if (!tenet) notFound();

  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">Edit Tenet</h1>
      <form action={saveTenet} className="mt-6 space-y-5 max-w-xl">
        <input type="hidden" name="id" value={tenet.id} />
        <Field label="Sort Order">
          <input
            type="number"
            name="sortOrder"
            defaultValue={tenet.sortOrder}
            className={inputClass}
          />
        </Field>
        <Field label="Title">
          <input
            name="title"
            required
            defaultValue={tenet.title}
            className={inputClass}
          />
        </Field>
        <Field label="Body">
          <textarea
            name="body"
            rows={4}
            defaultValue={tenet.body}
            className={inputClass}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-navy-800">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={tenet.isPublished}
          />
          Published
        </label>
        <SubmitButton label="Save Changes" />
      </form>
    </div>
  );
}
