// Google AdSense helpers shared by the ads.txt route and the ad script loader.
//
// NEXT_PUBLIC_ADSENSE_ID is the AdSense client ID, e.g. ca-pub-1234567890123456
// (set in Vercel; see docs/adsense-readiness.md). While it is unset, no ad
// script loads and /ads.txt is a 404.

// Google's certification-authority ID for AdSense in ads.txt; the same for
// every publisher.
const GOOGLE_CERT_AUTHORITY_ID = "f08c47fec0942fa0";

const CLIENT_ID = /^(?:ca-)?(pub-\d{16})$/;

/** The ads.txt body for an AdSense client ID, or null when the ID is unset or malformed. */
export function adsTxtBody(clientId: string | undefined): string | null {
  const match = CLIENT_ID.exec(clientId?.trim() ?? "");
  if (!match) return null;
  return `google.com, ${match[1]}, DIRECT, ${GOOGLE_CERT_AUTHORITY_ID}\n`;
}

// Pages that must never show ads: the admin area, post-payment receipts (they
// show a registrant's or donor's details), and the legal pages.
const AD_FREE: RegExp[] = [
  /^\/admin(?:\/|$)/,
  /^\/events\/[^/]+\/register\/confirmation$/,
  /^\/giving\/confirmation$/,
  /^\/store\/confirmation$/,
  /^\/(?:privacy|terms|refunds)$/,
];

/** True for a pathname on which the AdSense script must not load. */
export function isAdFreePath(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return AD_FREE.some((re) => re.test(path));
}
