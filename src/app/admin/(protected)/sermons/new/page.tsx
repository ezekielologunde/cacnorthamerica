import { Field, inputClass, SubmitButton } from "@/components/admin/fields";
import { saveLiveStream } from "../actions";

export default function NewLiveStreamPage() {
  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">
        New Sermon / Live Stream
      </h1>
      <form action={saveLiveStream} className="mt-6 space-y-5 max-w-xl">
        <Field label="Title">
          <input name="title" required className={inputClass} />
        </Field>
        <Field label="Speaker">
          <input name="speaker" className={inputClass} />
        </Field>
        <Field label="Stream URL">
          <input name="streamUrl" required className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Platform">
            <select name="platform" className={inputClass} defaultValue="youtube">
              <option value="youtube">YouTube</option>
              <option value="facebook">Facebook</option>
              <option value="zoom">Zoom</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Scheduled At">
            <input
              type="datetime-local"
              name="scheduledAt"
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Recording URL (optional)">
          <input name="recordingUrl" className={inputClass} />
        </Field>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input type="checkbox" name="isPublished" defaultChecked />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input type="checkbox" name="isLive" />
            Live Now
          </label>
        </div>
        <SubmitButton label="Create Stream" />
      </form>
    </div>
  );
}
