import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data/queries";

export default async function RegistrationConfirmationPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEventById(eventId);
  if (!event) notFound();

  return (
    <section className="section-shell py-24 max-w-xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
        Registration Received
      </p>
      <h1 className="mt-2 font-serif-display text-3xl text-navy-900">
        Thank you for registering for {event.title}!
      </h1>
      <p className="mt-4 text-navy-800/70">
        We&rsquo;ve saved your registration. Payment is handled separately —
        via Zelle/credit card at check-in, or through{" "}
        <a
          href="https://cacnaconvention.org"
          target="_blank"
          rel="noreferrer"
          className="text-gold-600 hover:text-gold-500 font-medium"
        >
          cacnaconvention.org
        </a>
        . We look forward to seeing you there.
      </p>
      <Link
        href={`/events/${event.slug}`}
        className="mt-8 inline-block text-sm font-semibold text-gold-600 hover:text-gold-500"
      >
        ← Back to event details
      </Link>
    </section>
  );
}
