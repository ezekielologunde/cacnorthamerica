"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { isAdFreePath } from "@/lib/adsense";

/** AdSense auto-ads loader; renders nothing outside the blog. */
export function AdSenseScript({ clientId }: { clientId: string }) {
  const pathname = usePathname();
  if (isAdFreePath(pathname)) return null;
  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
