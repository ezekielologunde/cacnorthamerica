import { getAllSiteContent, getSiteSettings } from "@/lib/data/queries";
import { Field, inputClass, SubmitButton } from "@/components/admin/fields";
import { saveSiteSettings, saveSiteContent } from "./actions";

export default async function AdminSettingsPage() {
  const [settings, content] = await Promise.all([
    getSiteSettings(),
    getAllSiteContent(),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-serif-display text-3xl text-navy-900">
          Site Settings
        </h1>
        <form
          action={saveSiteSettings}
          className="mt-6 grid gap-4 md:grid-cols-2 max-w-2xl"
        >
          <Field label="Church Name">
            <input
              name="churchName"
              defaultValue={settings.churchName}
              className={inputClass}
            />
          </Field>
          <Field label="Contact Email">
            <input
              name="contactEmail"
              defaultValue={settings.contactEmail}
              className={inputClass}
            />
          </Field>
          <Field label="Contact Phone">
            <input
              name="contactPhone"
              defaultValue={settings.contactPhone}
              className={inputClass}
            />
          </Field>
          <Field label="Address">
            <input
              name="address"
              defaultValue={settings.address}
              className={inputClass}
            />
          </Field>
          <Field label="Prayer Line Number">
            <input
              name="prayerLineNumber"
              defaultValue={settings.prayerLineNumber}
              className={inputClass}
            />
          </Field>
          <Field label="Prayer Line Access Code">
            <input
              name="prayerLineAccessCode"
              defaultValue={settings.prayerLineAccessCode}
              className={inputClass}
            />
          </Field>
          <Field label="Prayer Line Time">
            <input
              name="prayerLineTime"
              defaultValue={settings.prayerLineTime}
              className={inputClass}
            />
          </Field>
          <Field label="Facebook URL">
            <input
              name="facebookUrl"
              defaultValue={settings.facebookUrl}
              className={inputClass}
            />
          </Field>
          <Field label="Instagram URL">
            <input
              name="instagramUrl"
              defaultValue={settings.instagramUrl}
              className={inputClass}
            />
          </Field>
          <Field label="YouTube URL">
            <input
              name="youtubeUrl"
              defaultValue={settings.youtubeUrl}
              className={inputClass}
            />
          </Field>
          <div className="md:col-span-2">
            <SubmitButton label="Save Settings" />
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-serif-display text-2xl text-navy-900">
          Page Content
        </h2>
        <p className="mt-1 text-sm text-navy-800/60">
          Edit the flexible copy blocks used across the public site (hero
          welcome text, watchword, president&rsquo;s message, About/History).
        </p>
        <div className="mt-6 space-y-4 max-w-2xl">
          {content.map((c) => (
            <form
              key={`${c.page_key}-${c.section_key}`}
              action={saveSiteContent}
              className="rounded-xl border border-navy-800/10 bg-white p-5"
            >
              <input type="hidden" name="pageKey" value={c.page_key} />
              <input type="hidden" name="sectionKey" value={c.section_key} />
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                {c.page_key} · {c.section_key}
              </p>
              <textarea
                name="content"
                rows={3}
                defaultValue={c.content}
                className={`${inputClass} mt-2`}
              />
              <div className="mt-3">
                <SubmitButton label="Save" />
              </div>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
