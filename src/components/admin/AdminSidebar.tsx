"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/departments", label: "Departments" },
  { href: "/admin/leaders", label: "Leaders" },
  { href: "/admin/tenets", label: "Tenets" },
  { href: "/admin/sermons", label: "Sermons & Live" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/churches", label: "Member Churches" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/users", label: "Admin Users" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-navy-800/10 bg-cream-200 min-h-screen">
      <div className="p-5">
        <p className="font-serif-display text-lg text-navy-900">CACNA Admin</p>
        <p className="text-xs text-navy-800/50 mt-1">Content console</p>
      </div>
      <nav className="px-3 space-y-1">
        {LINKS.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-navy-900 text-cream-100"
                  : "text-navy-800/80 hover:bg-navy-900/5",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 mt-6">
        <Link
          href="/"
          className="block rounded-lg px-3 py-2 text-sm font-medium text-navy-800/60 hover:bg-navy-900/5"
        >
          ← View public site
        </Link>
      </div>
    </aside>
  );
}
