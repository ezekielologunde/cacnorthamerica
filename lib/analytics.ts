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

/** The inline gtag bootstrap: loads dataLayer and configures every ID, passing a
 *  query-free page_location on secret-bearing pages. Returned as a string so a
 *  check can run exactly what the browser runs. */
export function gtagInitScript(ids: string[]): string {
  return (
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}" +
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
