// Pages whose URL carries a secret in the query string: the Stripe session id
// on event-registration, giving and store confirmations, and the sealed
// token in the emailed /giving/cancel?t= link (it lists and cancels a
// donor's recurring gifts). On these the query is stripped from page_location
// before anything reaches Google. Keep this the single definition.
export const SECRET_URL_PATH = /\/(?:confirmation|giving\/cancel)\/?$/;

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
