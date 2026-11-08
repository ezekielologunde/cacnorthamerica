import { revalidatePath, revalidateTag } from "next/cache";
import { CAC_WORLD_NEWS_TAG } from "@/lib/cacWorldNews";

/**
 * Public pages, as route-file patterns rather than URLs. next-intl rewrites
 * every public URL to its locale route internally ("/blog" is served from
 * "/en/blog"), and revalidatePath matches the rewritten destination, so a
 * literal revalidatePath("/blog") or ("/") never matched a cached page: the
 * home page only caught up on its 60 s timer and /blog on its hourly one.
 * A pattern plus "page" matches the page file itself, whatever URL or locale
 * it was served under.
 */
const PUBLIC_PAGES = {
  home: "/(site)/[locale]",
  blog: "/(site)/[locale]/blog",
  blogPost: "/(site)/[locale]/blog/[slug]",
  calendar: "/(site)/[locale]/calendar",
  eventPage: "/(site)/[locale]/events/[slug]",
} as const;

export type PublicPage = keyof typeof PUBLIC_PAGES;

function revalidatePages(pages: readonly PublicPage[]): void {
  for (const page of pages) revalidatePath(PUBLIC_PAGES[page], "page");
}

/** Drops the cached Blogger feed so the next render fetches it again
 *  (blocking, rather than serving the stale copy once more). */
function expireCacWorldFeed(): void {
  revalidateTag(CAC_WORLD_NEWS_TAG, { expire: 0 });
}

/** A post was published, edited or deleted in /admin/blog. */
export function revalidateBlogContent(): void {
  revalidatePages(["home", "blog", "blogPost"]);
}

/** A CAC World story was approved, rejected or unpublished (the pages merge
 *  the live feed with those decisions). `refetchFeed` also drops the cached
 *  feed, for when an admin has just pulled the latest stories. */
export function revalidateCacWorldNewsContent({ refetchFeed = false } = {}): void {
  if (refetchFeed) expireCacWorldFeed();
  revalidatePages(["home", "blog"]);
}

/** An event was created, edited or deleted in /admin/events. */
export function revalidateEventContent(): void {
  revalidatePages(["home", "calendar"]);
}

/** An announcement changed. Homepage announcements render on the home page,
 *  but "banner" ones come from the root layout and show on every page, so
 *  this refreshes everything under it. */
export function revalidateAnnouncements(): void {
  revalidatePath("/", "layout");
}

const SCHEDULED_PAGES: readonly PublicPage[] = ["home", "blog", "blogPost", "calendar", "eventPage"];

/** Everything the scheduled refresh touches: the CAC World feed and every
 *  page that shows feed, blog or event content. */
export function refreshAllPublicContent(): { tags: number; pages: number } {
  expireCacWorldFeed();
  revalidatePages(SCHEDULED_PAGES);
  return { tags: 1, pages: SCHEDULED_PAGES.length };
}
