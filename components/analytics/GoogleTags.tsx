import Script from "next/script";
import { adsenseClientId } from "@/lib/adsense";
import { gtagInitScript } from "@/lib/analytics";
import { AdSenseScript } from "./AdSenseScript";

// Set these in Vercel → Project → Settings → Environment Variables:
//   NEXT_PUBLIC_GA_ID          Google Analytics 4 measurement ID  (e.g. G-XXXXXXXXXX)
//   NEXT_PUBLIC_GOOGLE_ADS_ID  Google Ads conversion ID           (e.g. AW-XXXXXXXXX)
//   NEXT_PUBLIC_ADSENSE_ID     Google AdSense publisher ID        (e.g. ca-pub-XXXXXXXXXXXXXXXX)

const GA_ID      = process.env.NEXT_PUBLIC_GA_ID ?? "G-8M8BEVEEWM";
const ADS_ID     = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const ADSENSE_ID = adsenseClientId(process.env.NEXT_PUBLIC_ADSENSE_ID);

// Pages whose query string carries a secret (confirmations, the emailed
// giving-cancel link) have it stripped from page_location; see lib/analytics.ts.
export function GoogleTags() {
  const gtagIds = [GA_ID, ADS_ID].filter(Boolean) as string[];

  return (
    <>
      {/* Google Analytics + Google Ads */}
      {gtagIds.length > 0 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagIds[0]}`}
            strategy="lazyOnload"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {gtagInitScript(gtagIds)}
          </Script>
        </>
      )}

      {/* Google AdSense auto-ads — only loads when publisher ID is set, and
          never on admin, receipt or legal pages (see lib/adsense.ts) */}
      {ADSENSE_ID && <AdSenseScript clientId={ADSENSE_ID} />}
    </>
  );
}
