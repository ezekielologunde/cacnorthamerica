import Link from "next/link";
import { getSiteContent } from "@/lib/data/queries";

export const metadata = { title: "Who We Are" };

export default async function AboutPage() {
  const history = await getSiteContent("about", "history");

  return (
    <section className="section-shell py-20 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
        Who We Are
      </p>
      <h1 className="mt-2 font-serif-display text-4xl text-navy-900">
        CAC North America
      </h1>
      <div className="mt-8 space-y-4 text-navy-800/80 leading-relaxed">
        <h2 className="font-serif-display text-2xl text-navy-900">History</h2>
        <p>{history}</p>
      </div>
      <div className="mt-10 flex flex-wrap gap-4 text-sm font-semibold">
        <Link href="/tenets" className="text-gold-600 hover:text-gold-500">
          Read our tenets →
        </Link>
        <Link href="/leadership" className="text-gold-600 hover:text-gold-500">
          Meet our leadership →
        </Link>
        <Link href="/zones" className="text-gold-600 hover:text-gold-500">
          Find your zone →
        </Link>
      </div>
    </section>
  );
}
