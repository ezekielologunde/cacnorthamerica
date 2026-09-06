import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}/contact`]));
  return {
    title: "Contact & Visit — Christ Apostolic Church North America (CACNA)",
    description:
      "Reach CACNA at (305) 469-0346 or info@cacnorthamerica.com, or find a CACNA member church near you across the United States, Canada, and South America. CAC Village: 14051 Stahley Road, Blue Ridge Summit, PA 17214.",
    alternates: { canonical: `${SITE_URL}/${locale}/contact`, languages },
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
