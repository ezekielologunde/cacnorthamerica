import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Give — CAC Salvation Center | Tithes, Offerings & Building Fund",
  description:
    "Support the ministry of CAC Salvation Center — give securely toward tithes & offerings, missions, and the building fund, online or by Zelle. Thank you for your generosity.",
  alternates: { canonical: "/giving" },
};

export default function GivingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
