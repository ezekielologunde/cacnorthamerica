import { getMedia } from "@/lib/data/queries";
import { Field, inputClass, SubmitButton, DeleteButton } from "@/components/admin/fields";
import { createMedia, removeMedia } from "./actions";

export default async function AdminMediaPage() {
  const media = await getMedia();

  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">Media</h1>
      <p className="mt-2 text-sm text-navy-800/60">
        Add media by image URL for now — direct upload to Supabase Storage
        lands in a later phase (see build plan).
      </p>

      <form
        action={createMedia}
        className="mt-6 grid gap-4 md:grid-cols-2 max-w-2xl rounded-xl border border-navy-800/10 bg-white p-6"
      >
        <Field label="Image URL">
          <input name="url" required className={inputClass} />
        </Field>
        <Field label="Alt Text">
          <input name="altText" required className={inputClass} />
        </Field>
        <Field label="Caption (optional)">
          <input name="caption" className={inputClass} />
        </Field>
        <Field label="Album">
          <input name="album" defaultValue="general" className={inputClass} />
        </Field>
        <div className="md:col-span-2">
          <SubmitButton label="Add Media" />
        </div>
      </form>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {media.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border border-navy-800/10 bg-white p-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.url}
              alt={m.altText}
              className="w-full h-32 object-cover rounded-lg bg-cream-200"
            />
            <p className="mt-2 text-xs text-navy-800/70 truncate">
              {m.altText}
            </p>
            <div className="mt-2">
              <DeleteButton
                action={async (formData) => {
                  "use server";
                  formData.set("id", m.id);
                  await removeMedia(formData);
                }}
              />
            </div>
          </div>
        ))}
        {media.length === 0 && (
          <p className="text-navy-800/50 text-sm">No media yet.</p>
        )}
      </div>
    </div>
  );
}
