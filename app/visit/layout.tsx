import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Your Visit — CAC Salvation Center | Randallstown, MD",
  description:
    "Planning your first visit to CAC Salvation Center? Join us Sundays at 10:30 AM ET, 10710 Marriottsville Rd, Randallstown MD 21133 — kids ministry, parking, and a warm welcome await.",
  alternates: { canonical: "/visit" },
};

export default function VisitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
