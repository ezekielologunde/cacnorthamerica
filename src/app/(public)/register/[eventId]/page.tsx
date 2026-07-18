import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data/queries";
import { createRegistration } from "./actions";

const MAX_REGISTRANTS = 6;
const inputClass =
  "w-full rounded-lg border border-navy-800/15 bg-white px-3 py-2 text-sm text-navy-900 focus:border-gold-500 focus:outline-none";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wide text-navy-800/60 mb-1";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEventById(eventId);
  if (!event) notFound();

  return (
    <section className="section-shell py-20 max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
        Registration
      </p>
      <h1 className="mt-2 font-serif-display text-4xl text-navy-900">
        {event.title}
      </h1>
      <p className="mt-3 text-navy-800/70">
        This form saves your registration details. Payment is handled
        separately — via Zelle/credit card at check-in, or through{" "}
        <a
          href="https://cacnaconvention.org"
          target="_blank"
          rel="noreferrer"
          className="text-gold-600 hover:text-gold-500 font-medium"
        >
          cacnaconvention.org
        </a>
        .
      </p>

      <form action={createRegistration} className="mt-8 space-y-6">
        <input type="hidden" name="eventId" value={event.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Your Name</label>
            <input name="contactName" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Church Name (optional)</label>
            <input name="churchName" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="contactEmail" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input name="contactPhone" className={inputClass} />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-navy-900 mb-2">
            Registrants
          </p>
          <p className="text-xs text-navy-800/60 mb-3">
            List everyone attending, including yourself. Leave rows blank if
            not needed.
          </p>
          <div className="space-y-3">
            {Array.from({ length: MAX_REGISTRANTS }).map((_, i) => (
              <div key={i} className="grid grid-cols-3 gap-3">
                <input
                  name={`registrant_name_${i}`}
                  placeholder={`Registrant ${i + 1} full name`}
                  className={`${inputClass} col-span-2`}
                  {...(i === 0 ? { required: true } : {})}
                />
                <select
                  name={`registrant_category_${i}`}
                  defaultValue="adult"
                  className={inputClass}
                >
                  <option value="adult">Adult</option>
                  <option value="young_adult">Young Adult</option>
                  <option value="child">Child</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-cream-100 hover:bg-navy-800 transition-colors"
        >
          Submit Registration
        </button>
      </form>
    </section>
  );
}
