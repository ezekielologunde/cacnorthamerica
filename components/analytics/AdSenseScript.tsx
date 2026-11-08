"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { adsenseClientId, isAdFreePath } from "@/lib/adsense";

/** AdSense auto-ads loader; renders nothing outside the blog or for a malformed ID. */
export function AdSenseScript({ clientId }: { clientId: string }) {
  const pathname = usePathname();
  const id = adsenseClientId(clientId);
  if (!id || isAdFreePath(pathname)) return null;
  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${id}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
