import Script from "next/script";
import { AdSenseScript } from "./AdSenseScript";

// Set these in Vercel → Project → Settings → Environment Variables:
//   NEXT_PUBLIC_GA_ID          Google Analytics 4 measurement ID  (e.g. G-XXXXXXXXXX)
//   NEXT_PUBLIC_GOOGLE_ADS_ID  Google Ads conversion ID           (e.g. AW-XXXXXXXXX)
//   NEXT_PUBLIC_ADSENSE_ID     Google AdSense publisher ID        (e.g. ca-pub-XXXXXXXXXXXXXXXX)

const GA_ID      = process.env.NEXT_PUBLIC_GA_ID ?? "G-8M8BEVEEWM";
const ADS_ID     = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

// All payment confirmation URLs carry a session ID or sealed token. Strip
// query strings and fragments from the initial page_location and from a
// confirmation page's referrer before configuring either Google destination.
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
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());
var receiptPath=/\\/(?:register|giving|store)\\/confirmation\\/?$/;
var gc=receiptPath.test(location.pathname)?{page_location:location.origin+location.pathname}:{};
try{var gr=new URL(document.referrer);if(receiptPath.test(gr.pathname))gc.page_referrer=gr.origin+gr.pathname;}catch{}
${gtagIds.map((id) => `gtag('config',${JSON.stringify(id)},gc);`).join("")}`}
          </Script>
        </>
      )}

      {/* Google AdSense auto-ads — valid publisher IDs only, on blog pages
          (see lib/adsense.ts) */}
      {ADSENSE_ID && <AdSenseScript clientId={ADSENSE_ID} />}
    </>
  );
}
