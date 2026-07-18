import { notFound } from "next/navigation";
import { getAnnouncementById } from "@/lib/data/queries";
import { Field, inputClass, SubmitButton } from "@/components/admin/fields";
import { saveAnnouncement } from "../../actions";

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const announcement = await getAnnouncementById(id);
  if (!announcement) notFound();

  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">
        Edit Announcement
      </h1>
      <form action={saveAnnouncement} className="mt-6 space-y-5 max-w-xl">
        <input type="hidden" name="id" value={announcement.id} />
        <Field label="Title">
          <input
            name="title"
            required
            defaultValue={announcement.title}
            className={inputClass}
          />
        </Field>
        <Field label="Body">
          <textarea
            name="body"
            rows={4}
            defaultValue={announcement.body}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Starts At">
            <input
              type="date"
              name="startsAt"
              defaultValue={announcement.startsAt}
              className={inputClass}
            />
          </Field>
          <Field label="Expires At (optional)">
            <input
              type="date"
              name="expiresAt"
              defaultValue={announcement.expiresAt}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={announcement.isPublished}
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input
              type="checkbox"
              name="isPinned"
              defaultChecked={announcement.isPinned}
            />
            Pinned
          </label>
        </div>
        <SubmitButton label="Save Changes" />
      </form>
    </div>
  );
}
