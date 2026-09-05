import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Visit — Christ Apostolic Church North America (CACNA)",
  description:
    "Reach CACNA at (305) 469-0346 or info@cacnorthamerica.com, or find a CACNA member church near you across the United States, Canada, and South America. CAC Village: 14051 Stahley Road, Blue Ridge Summit, PA 17214.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
