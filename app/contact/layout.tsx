import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Christ Apostolic Church North America (CACNA)",
  description:
    "Reach CACNA at (305) 469-0346 or info@cacnorthamerica.com. 14051 Stahley Road, Blue Ridge Summit, PA 17214. We'd love to connect.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
