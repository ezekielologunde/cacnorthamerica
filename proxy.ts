import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// Unauthenticated users cannot access any /admin route except /admin/login.
// This predates (and is unrelated to) the locale routing below -- scoped to
// /admin specifically, which stays outside next-intl's [locale] segment
// entirely, so it never runs through intlMiddleware.
async function adminAuthGuard(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (pairs) => {
          pairs.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          pairs.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  if (pathname !== "/admin/login" && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return adminAuthGuard(request);
  }

  // The `blog.cacnorthamerica.com` subdomain's root path is rewritten to
  // `/en/blog` by next.config.ts's `beforeFiles` rewrite -- that rewrite
  // only matches the literal path "/", so let it through untouched here
  // rather than having next-intl redirect "/" -> "/en" first (which would
  // change the path before the config-level rewrite ever gets to match it,
  // silently breaking the subdomain). Proxy/middleware runs before
  // next.config redirects/rewrites, so this check has to happen here.
  const host = request.headers.get("host") ?? "";
  if (host === "blog.cacnorthamerica.com" && pathname === "/") {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
