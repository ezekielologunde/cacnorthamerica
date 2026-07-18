import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Give — Christ Apostolic Church North America (CACNA)",
  description:
    "Support CACNA's ministries and missions — contact us to learn about ways to give.",
  alternates: { canonical: "/giving" },
};

export default function GivingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
