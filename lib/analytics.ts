// Pages whose URL carries a secret in the query string: the Stripe session id
// or sealed token on event-registration, giving and store confirmations, and
// the sealed token in the emailed /giving/cancel?t= link (it lists and cancels
// a donor's recurring gifts). On these the query is stripped from
// page_location before anything reaches Google. Keep this the single
// definition. It must stay flag-free: the inline gtag script embeds only its
// `.source`.
//
// Limit: this runs at page load. A client-side (SPA) jump onto one of these
// pages would not be re-stripped for GA4's automatic history-change page
// views, so every link to them is absolute and loads the page fresh. Also
// turn off "Page changes based on browser history events" under Enhanced
// measurement in the GA4 property.
export const SECRET_URL_PATH =
  /\/(?:register\/confirmation|giving\/confirmation|store\/confirmation|giving\/cancel)\/?$/;

export function isSecretUrlPath(pathname: string): boolean {
  return SECRET_URL_PATH.test(pathname);
}

// Google Consent Mode v2. Visitors in the EEA, the UK and Switzerland start with
// every Google storage signal denied, so Analytics and ads set no cookies and
// send only cookieless pings until consent is granted. Google's certified
// consent message (AdSense, Privacy and messaging) updates these signals
// itself, but only where the AdSense script loads: the blog. Elsewhere in
// those regions Analytics stays cookieless. Everyone else keeps Google's
// default (granted). Keep this ISO 3166-1 list in step with Google's docs.
export const CONSENT_DENIED_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "NL", "NO", "PL", "PT", "RO",
  "SK", "SI", "ES", "SE", "GB", "CH",
] as const;

/** The inline gtag bootstrap: loads dataLayer, sets the consent defaults, and
 *  configures every ID, passing a query-free page_location on secret-bearing
 *  pages. Returned as a string so a check can run exactly what the browser
 *  runs. The consent default must run before any config call. */
export function gtagInitScript(ids: string[]): string {
  const regions = JSON.stringify([...CONSENT_DENIED_REGIONS]);
  return (
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}" +
    "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied'," +
    "ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500," +
    `region:${regions}});` +
    "gtag('js',new Date());" +
    `var gc=/${SECRET_URL_PATH.source}/.test(location.pathname)` +
    "?{page_location:location.origin+location.pathname}:{};" +
    ids.map((id) => `gtag('config','${id}',gc);`).join("")
  );
}

/** For Vercel Analytics / Speed Insights `beforeSend`: drops the query string
 *  and hash from the event URL on secret-bearing pages and on /admin (where
 *  check-in search puts registrant names and codes in `?q=`). */
export function scrubTelemetryUrl<T extends { url: string }>(event: T): T {
  let u: URL;
  try {
    u = new URL(event.url);
  } catch {
    return event;
  }
  if (!isSecretUrlPath(u.pathname) && !/^\/admin(?:\/|$)/.test(u.pathname)) return event;
  return { ...event, url: u.origin + u.pathname };
}
