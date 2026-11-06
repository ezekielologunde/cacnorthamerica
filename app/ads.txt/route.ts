import { adsTxtBody } from "@/lib/adsense";

// Built once per deploy: the publisher ID comes from NEXT_PUBLIC_ADSENSE_ID,
// so setting or changing it in Vercel needs a redeploy to show up here.
export const dynamic = "force-static";

export function GET() {
  const body = adsTxtBody(process.env.NEXT_PUBLIC_ADSENSE_ID);
  if (!body) {
    return new Response("Not found\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
