"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change (nav tap on mobile)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close sidebar when viewport grows past mobile breakpoint
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <style>{`
        /* ── Shell ────────────────────────────────────────── */
        .ash {
          display: flex;
          min-height: 100vh;
          background: #f4f4f0;
        }

        /* ── Sidebar wrapper ─────────────────────────────── */
        .ash-sidebar {
          width: 248px;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        /* ── Main ────────────────────────────────────────── */
        .ash-main {
          flex: 1;
          min-width: 0;
          padding: 40px 48px;
          overflow-y: auto;
        }

        /* ── Mobile header (hidden on desktop) ───────────── */
        .ash-mhdr {
          display: none;
        }

        /* ── Backdrop (hidden on desktop) ────────────────── */
        .ash-backdrop {
          display: none;
        }

        /* ── Mobile overrides ────────────────────────────── */
        @media (max-width: 767px) {
          .ash {
            flex-direction: column;
          }

          /* Mobile top header */
          .ash-mhdr {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            height: 56px;
            background: linear-gradient(180deg, #1a1a2e 0%, #12121c 100%);
            position: sticky;
            top: 0;
            z-index: 60;
            flex-shrink: 0;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }

          /* Sidebar becomes fixed overlay */
          .ash-sidebar {
            position: fixed;
            inset: 0 auto 0 0;
            width: 272px;
            height: 100dvh;
            z-index: 70;
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-y: auto;
            overscroll-behavior: contain;
          }
          .ash-sidebar.is-open {
            transform: translateX(0);
            box-shadow: 4px 0 32px rgba(0,0,0,0.35);
          }

          /* Tap-to-close backdrop */
          .ash-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0);
            z-index: 65;
            pointer-events: none;
            transition: background 0.28s;
          }
          .ash-backdrop.is-open {
            background: rgba(0,0,0,0.55);
            pointer-events: auto;
          }

          /* Main padding for mobile */
          .ash-main {
            padding: 24px 16px 48px;
          }
        }
      `}</style>

      <div className="ash">
        {/* ── Mobile top bar ── */}
        <div className="ash-mhdr">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7,
              background: "white", display: "flex", alignItems: "center",
              justifyContent: "center", overflow: "hidden",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}>
              <img
                src="/images/logo.png"
                alt=""
                style={{ width: 26, height: 26, objectFit: "contain" }}
              />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)", margin: 0, lineHeight: 1 }}>CAC Salvation</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: "2px 0 0", letterSpacing: "0.06em", textTransform: "uppercase" }}>Admin</p>
            </div>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.75)",
              width: 40, height: 40, borderRadius: 9,
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Backdrop ── */}
        <div
          className={`ash-backdrop${open ? " is-open" : ""}`}
          onClick={close}
          aria-hidden
        />

        {/* ── Sidebar ── */}
        <aside className={`ash-sidebar${open ? " is-open" : ""}`}>
          <AdminSidebar email={email} />
        </aside>

        {/* ── Page content ── */}
        <main className="ash-main">
          {children}
        </main>
      </div>
    </>
  );
}
