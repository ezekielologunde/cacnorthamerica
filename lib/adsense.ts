// Google AdSense helpers shared by the ads.txt route and the ad script loader.
//
// NEXT_PUBLIC_ADSENSE_ID is the AdSense client ID, e.g. ca-pub-1234567890123456
// (set in Vercel; see docs/adsense-readiness.md). While it is unset, no ad
// script loads and /ads.txt is a 404.

// Google's certification-authority ID for AdSense in ads.txt; the same for
// every publisher.
const GOOGLE_CERT_AUTHORITY_ID = "f08c47fec0942fa0";

const CLIENT_ID = /^(?:ca-)?(pub-\d{16})$/;

/**
 * The canonical AdSense client ID ("ca-pub-" + 16 digits) for a raw env value,
 * or null when it is unset or malformed. Whitespace is trimmed and a bare
 * "pub-" ID gets its "ca-" prefix. Everything that uses the ID (the ad script
 * URL and ads.txt) goes through this, so the two can never disagree.
 */
export function adsenseClientId(raw: string | undefined): string | null {
  const match = CLIENT_ID.exec(raw?.trim() ?? "");
  return match ? `ca-${match[1]}` : null;
}

/** The ads.txt body for an AdSense client ID, or null when the ID is unset or malformed. */
export function adsTxtBody(clientId: string | undefined): string | null {
  const id = adsenseClientId(clientId);
  if (!id) return null;
  return `google.com, ${id.slice(3)}, DIRECT, ${GOOGLE_CERT_AUTHORITY_ID}\n`;
}

// Ads run on the blog only (owner decision, 2026-11-06): the index and the
// posts. Everything else, including admin, post-payment receipts, giving,
// registration, the store and the legal pages, never loads the script.
const AD_PAGES = /^\/blog(?:\/|$)/;

/** True when the AdSense script may load on this pathname (blog pages only). */
export function adsAllowedOnPath(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return AD_PAGES.test(path);
}

/** True for a pathname on which the AdSense script must not load. */
export function isAdFreePath(pathname: string): boolean {
  return !adsAllowedOnPath(pathname);
}
