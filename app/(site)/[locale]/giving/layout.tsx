import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}/giving`]));
  return {
    title: "Give — Christ Apostolic Church North America (CACNA)",
    description:
      "Support CACNA's ministries and missions — contact us to learn about ways to give.",
    alternates: { canonical: `${SITE_URL}/${locale}/giving`, languages },
  };
}

export default function GivingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
