import Script from "next/script";

// Set these in Vercel → Project → Settings → Environment Variables:
//   NEXT_PUBLIC_GA_ID          Google Analytics 4 measurement ID  (e.g. G-XXXXXXXXXX)
//   NEXT_PUBLIC_GOOGLE_ADS_ID  Google Ads conversion ID           (e.g. AW-XXXXXXXXX)
//   NEXT_PUBLIC_ADSENSE_ID     Google AdSense publisher ID        (e.g. ca-pub-XXXXXXXXXXXXXXXX)

const GA_ID      = process.env.NEXT_PUBLIC_GA_ID ?? "G-8M8BEVEEWM";
const ADS_ID     = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

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
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${gtagIds
              .map((id) => `gtag('config','${id}');`)
              .join("")}`}
          </Script>
        </>
      )}

      {/* Google AdSense auto-ads — only loads when publisher ID is set */}
      {ADSENSE_ID && (
        <Script
          id="adsense-init"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
