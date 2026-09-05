import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
  // The `blog.cacnorthamerica.com` subdomain's root path is rewritten to
  // `/en/blog` by next.config.ts's `beforeFiles` rewrite -- that rewrite
  // only matches the literal path "/", so let it through untouched here
  // rather than having next-intl redirect "/" -> "/en" first (which would
  // change the path before the config-level rewrite ever gets to match it,
  // silently breaking the subdomain). Middleware runs before next.config
  // redirects/rewrites, so this check has to happen here, not there.
  const host = request.headers.get("host") ?? "";
  if (host === "blog.cacnorthamerica.com" && request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
