import Link from "next/link";

const NAV_LINKS = [
  { href: "/about", label: "Who We Are" },
  { href: "/tenets", label: "Tenets" },
  { href: "/leadership", label: "Leadership" },
  { href: "/zones", label: "Zones" },
  { href: "/departments", label: "Ministries" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-800/10 bg-cream-100/90 backdrop-blur">
      <div className="section-shell flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-serif-display text-lg font-semibold tracking-tight text-navy-900">
            CAC North America
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-navy-800">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-gold-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/live"
          className="shrink-0 rounded-full bg-gradient-to-r from-coral-500 via-gold-500 to-rose-500 px-4 py-2 text-sm font-semibold text-cream-100 shadow-md hover:scale-105 transition-transform"
        >
          Watch Live
        </Link>
      </div>
    </header>
  );
}
