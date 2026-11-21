// Which page / section of the site navigation the visitor is on. Kept free of
// imports so node's test runner can load it directly (lib/navMatch.test.mjs);
// the nav data itself lives in lib/nav.ts.

/** The minimum a nav section needs for active-section matching. */
export interface MatchableGroup {
  id: string;
  href?: string;
  links: readonly { href: string }[];
  /** Extra pages that belong to this section without being listed in it
   *  (e.g. any blog post, or a past year's convention page). */
  match?: (pathname: string) => boolean;
}

const isExternal = (href: string) => /^[a-z]+:/i.test(href);
const trimSlash = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

/** True only on the exact page a link points at. External links and in-page
 *  anchors (/about#convention) are never "the current page". */
export function isCurrentPage(pathname: string, href: string): boolean {
  if (isExternal(href) || href.includes("#")) return false;
  return trimSlash(pathname) === trimSlash(href);
}

/** True on the link's page or anything under it (/leadership/past is inside
 *  /leadership). The home page "/" only ever matches itself. */
export function isWithin(pathname: string, href: string): boolean {
  if (isExternal(href)) return false;
  const base = trimSlash(href.split("#")[0]);
  const path = trimSlash(pathname);
  if (!base) return false;
  if (base === "/") return path === "/";
  return path === base || path.startsWith(`${base}/`);
}

/** The id of the section the visitor is in, or null. A section that lists the
 *  page (or a parent of it) wins over one that only claims it by `match`, so
 *  /events/cacna-2027/register belongs to the Convention section even though
 *  every other /events/* page sits under Events & Media. In-page anchors
 *  (/youth#register) never claim a page for their section. */
export function activeGroupId(pathname: string, groups: readonly MatchableGroup[]): string | null {
  const claims = (href: string) => !href.includes("#") && isWithin(pathname, href);
  const listed = groups.find(
    (g) => (g.href !== undefined && claims(g.href)) || g.links.some((l) => claims(l.href)),
  );
  if (listed) return listed.id;
  return groups.find((g) => g.match?.(pathname))?.id ?? null;
}
