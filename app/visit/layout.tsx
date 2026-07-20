import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find a Church — Christ Apostolic Church North America (CACNA)",
  description:
    "Find a CACNA member church near you across the United States, Canada, and South America — 16 DCCs/Zones, each led by a Zonal Superintendent. CAC Village Convention: 14051 Stahley Road, Blue Ridge Summit, PA 17214.",
  alternates: { canonical: "/visit" },
};

export default function VisitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
