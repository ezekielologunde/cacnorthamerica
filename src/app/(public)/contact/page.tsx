import { getSiteSettings } from "@/lib/data/queries";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <section className="section-shell py-20 max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
        Come Visit
      </p>
      <h1 className="mt-2 font-serif-display text-4xl text-navy-900">
        Plan Your Visit
      </h1>
      <p className="mt-4 text-navy-800/70">
        There&rsquo;s a seat with your name on it. Reach out and we&rsquo;ll
        help you find a CACNA member church near you.
      </p>

      <dl className="mt-10 space-y-4 text-navy-800/80">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gold-600">
            Address
          </dt>
          <dd className="mt-1">{settings.address}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gold-600">
            Phone
          </dt>
          <dd className="mt-1">{settings.contactPhone}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gold-600">
            Email
          </dt>
          <dd className="mt-1">{settings.contactEmail}</dd>
        </div>
      </dl>
    </section>
  );
}
