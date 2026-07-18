import { notFound } from "next/navigation";
import { getLiveStreamById } from "@/lib/data/queries";
import { Field, inputClass, SubmitButton } from "@/components/admin/fields";
import { saveLiveStream } from "../../actions";

export default async function EditLiveStreamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stream = await getLiveStreamById(id);
  if (!stream) notFound();

  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">
        Edit Sermon / Live Stream
      </h1>
      <form action={saveLiveStream} className="mt-6 space-y-5 max-w-xl">
        <input type="hidden" name="id" value={stream.id} />
        <Field label="Title">
          <input
            name="title"
            required
            defaultValue={stream.title}
            className={inputClass}
          />
        </Field>
        <Field label="Speaker">
          <input
            name="speaker"
            defaultValue={stream.speaker}
            className={inputClass}
          />
        </Field>
        <Field label="Stream URL">
          <input
            name="streamUrl"
            required
            defaultValue={stream.streamUrl}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Platform">
            <select
              name="platform"
              className={inputClass}
              defaultValue={stream.platform}
            >
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
              defaultValue={stream.scheduledAt?.slice(0, 16)}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Recording URL (optional)">
          <input
            name="recordingUrl"
            defaultValue={stream.recordingUrl}
            className={inputClass}
          />
        </Field>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={stream.isPublished}
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input
              type="checkbox"
              name="isLive"
              defaultChecked={stream.isLive}
            />
            Live Now
          </label>
        </div>
        <SubmitButton label="Save Changes" />
      </form>
    </div>
  );
}
