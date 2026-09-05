import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

// Nested under the root `app/layout.tsx`, which already provides
// <html>/<body>, fonts, analytics, and the live announcement banner fetch --
// this layout only adds the locale boundary (NextIntlClientProvider) on top.
// Nav/Footer are rendered per-page (matching this site's existing pattern,
// unchanged by the locale migration), not here.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for this locale segment -- without this,
  // next-intl's requestLocale resolution reads a dynamic request API and
  // Next.js falls back to on-demand rendering instead of prerendering
  // /en and /yo at build time.
  setRequestLocale(locale);

  return (
    <NextIntlClientProvider locale={locale}>{children}</NextIntlClientProvider>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
