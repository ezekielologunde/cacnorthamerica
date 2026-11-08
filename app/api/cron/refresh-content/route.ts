import type { NextRequest } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cronAuth";
import { refreshAllPublicContent } from "@/lib/contentRevalidation";

/**
 * Scheduled content refresh (vercel.json runs it every 15 minutes). Drops
 * the cached CAC World News feed and marks the home, blog, calendar and
 * event pages stale, so each is rebuilt with current data on its next visit.
 *
 * Requires `Authorization: Bearer ${CRON_SECRET}`; Vercel Cron sends that
 * header itself once CRON_SECRET is set on the project. Without the env var
 * every request is refused. See docs/cron-refresh-content.md.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!isAuthorizedCronRequest(request.headers.get("authorization"), secret)) {
    if (!secret) console.error("[cron] refresh-content refused: CRON_SECRET is not set");
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const revalidated = refreshAllPublicContent();
  return Response.json(
    { ok: true, revalidated, at: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
