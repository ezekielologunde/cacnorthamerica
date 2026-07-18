"use client";

import Link from "next/link";

const STAT_CARDS = [
  { key: "posts",              label: "Blog Posts",          color: "#2563eb", bg: "#eff6ff", href: "/admin/blog",        icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
  { key: "events",             label: "Events",              color: "#16a34a", bg: "#f0fdf4", href: "/admin/events",       icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { key: "pendingTestimonies", label: "Testimonies Pending", color: "#d97706", bg: "#fffbeb", href: "/admin/testimonies", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  { key: "prayers",            label: "Prayer Requests",     color: "#dc2626", bg: "#fef2f2", href: "/admin/prayer",       icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  { key: "contacts",           label: "Contact Messages",    color: "#7c3aed", bg: "#f5f3ff", href: "/admin/contact",      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { key: "products",      label: "Products Live",       color: "#0891b2", bg: "#ecfeff", href: "/admin/store",         icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
  { key: "gallery",       label: "Gallery Images",       color: "#7c3aed", bg: "#f5f3ff", href: "/admin/gallery",       icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { key: "orders",        label: "Total Orders",         color: "#d97706", bg: "#fffbeb", href: "/admin/orders",        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { key: "announcements", label: "Active Announcements", color: "#d97706", bg: "#fffbeb", href: "/admin/announcements", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
];

const QUICK_ACTIONS = [
  { href: "/admin/blog/new",          label: "Write a Blog Post",  icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { href: "/admin/events/new",        label: "Add an Event",       icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { href: "/admin/testimonies",       label: "Review Testimonies", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  { href: "/admin/store/new",         label: "Add Product",        icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
  { href: "/admin/gallery",           label: "Upload to Gallery",  icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { href: "/admin/announcements/new", label: "New Announcement",   icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
];

type Stats = { posts: number; events: number; pendingTestimonies: number; prayers: number; contacts: number; products: number; gallery: number; announcements: number; orders: number };

export default function DashboardCards({ stats }: { stats: Stats }) {
  return (
    <>
      <style>{`
        .stat-card { transition: box-shadow 0.18s, transform 0.18s; }
        .stat-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.09) !important; transform: translateY(-2px); }
        .quick-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 16px; border-radius: 8px;
          border: 1.5px solid rgba(27,19,14,0.12);
          background: white; color: var(--ink);
          text-decoration: none; font-size: 13.5px; font-weight: 500;
          font-family: inherit; cursor: pointer;
          transition: border-color 0.15s, color 0.15s, box-shadow 0.15s, transform 0.15s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }
        .quick-btn:hover {
          border-color: var(--red);
          color: var(--red);
          box-shadow: 0 2px 8px rgba(214,40,40,0.1);
          transform: translateY(-1px);
        }
      `}</style>

      {/* Stat grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))", gap: 14, marginBottom: 44 }}>
        {STAT_CARDS.map(({ key, label, color, bg, href, icon }) => {
          const count = stats[key as keyof Stats];
          const hasAlert = (key === "pendingTestimonies" || key === "prayers" || key === "contacts") && count > 0;
          return (
            <Link
              key={key}
              href={href}
              className="stat-card"
              style={{
                background: "white",
                borderRadius: 12,
                padding: "20px 18px",
                textDecoration: "none",
                display: "block",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                border: `1px solid ${hasAlert ? color + "30" : "rgba(0,0,0,0.07)"}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: color,
              }} />
              <div style={{
                width: 36, height: 36, borderRadius: 9, background: bg,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
              }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
              </div>
              <p style={{ fontSize: 28, fontWeight: 700, color: "var(--ink)", margin: "0 0 3px", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {count}
              </p>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0, fontWeight: 500 }}>{label}</p>
              {hasAlert && (
                <span style={{
                  position: "absolute", top: 14, right: 14,
                  width: 7, height: 7, borderRadius: "50%", background: color,
                  boxShadow: `0 0 0 2.5px ${bg}`,
                }} />
              )}
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-soft)", margin: "0 0 12px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Quick Actions
        </h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {QUICK_ACTIONS.map(({ href, label, icon }) => (
            <Link key={href} href={href} className="quick-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d={icon} />
              </svg>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
