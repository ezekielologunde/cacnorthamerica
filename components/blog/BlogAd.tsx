"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// Both values come from AdSense and are set in Vercel (see the privacy page for
// the visitor-facing wording). While either is unset or malformed this renders
// nothing and no Google script loads, so the site is ad-free by default.
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_ID?.trim() ?? "";
const SLOT = process.env.NEXT_PUBLIC_ADSENSE_BLOG_SLOT?.trim() ?? "";
const ENABLED = /^ca-pub-\d{16}$/.test(CLIENT) && /^\d{6,}$/.test(SLOT);

/** One responsive AdSense display unit, shown only on blog posts. */
export function BlogAd() {
  const requested = useRef(false);

  useEffect(() => {
    if (!ENABLED || requested.current) return;
    requested.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // An ad blocker or a late script must never break the article.
    }
  }, []);

  if (!ENABLED) return null;

  return (
    <aside aria-label="Advertisement" style={{ margin: "36px 0 8px", textAlign: "center" }}>
      <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 8 }}>
        Advertisement
      </div>
      <Script
        id="adsbygoogle-loader"
        async
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`}
      />
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT}
        data-ad-slot={SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
