import { Field, inputClass, SubmitButton } from "@/components/admin/fields";
import { saveAnnouncement } from "../actions";

export default function NewAnnouncementPage() {
  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">
        New Announcement
      </h1>
      <form action={saveAnnouncement} className="mt-6 space-y-5 max-w-xl">
        <Field label="Title">
          <input name="title" required className={inputClass} />
        </Field>
        <Field label="Body">
          <textarea name="body" rows={4} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Starts At">
            <input type="date" name="startsAt" className={inputClass} />
          </Field>
          <Field label="Expires At (optional)">
            <input type="date" name="expiresAt" className={inputClass} />
          </Field>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input type="checkbox" name="isPublished" defaultChecked />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input type="checkbox" name="isPinned" />
            Pinned
          </label>
        </div>
        <SubmitButton label="Create Announcement" />
      </form>
    </div>
  );
}
