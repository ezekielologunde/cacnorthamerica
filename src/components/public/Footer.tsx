import Link from "next/link";
import { getSiteSettings } from "@/lib/data/queries";

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="mt-24 border-t border-navy-800/10 bg-navy-950 text-cream-200">
      <div className="section-shell py-14 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-serif-display text-lg text-cream-100">
            {settings.churchName}
          </p>
          <p className="mt-3 text-sm text-cream-200/70 max-w-xs">
            One family, many homes — member churches worshiping together across
            North America.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-400">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cream-200/80">
            <li><Link href="/about" className="hover:text-gold-300">Who We Are</Link></li>
            <li><Link href="/tenets" className="hover:text-gold-300">Tenets</Link></li>
            <li><Link href="/leadership" className="hover:text-gold-300">Leadership</Link></li>
            <li><Link href="/zones" className="hover:text-gold-300">Zones</Link></li>
            <li><Link href="/departments" className="hover:text-gold-300">Ministries</Link></li>
            <li><Link href="/events" className="hover:text-gold-300">Events</Link></li>
            <li><Link href="/live" className="hover:text-gold-300">Watch & Grow</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-400">
            Stay Connected
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cream-200/80">
            <li>{settings.contactEmail}</li>
            <li>{settings.contactPhone}</li>
            <li>{settings.address}</li>
            {settings.prayerLineNumber && (
              <li>
                Prayer line · {settings.prayerLineTime}
                <br />
                {settings.prayerLineNumber} (code {settings.prayerLineAccessCode})
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream-100/10">
        <div className="section-shell py-4 text-xs text-cream-200/60">
          © {new Date().getFullYear()} {settings.churchName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
