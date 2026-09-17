import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Give — Christ Apostolic Church North America (CACNA)",
    description:
      "Support CACNA's ministries and missions — contact us to learn about ways to give.",
    alternates: { canonical: `${SITE_URL}/giving` },
  };
}

export default function GivingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
