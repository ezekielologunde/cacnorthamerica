import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — CAC Salvation Center | Randallstown, MD",
  description:
    "Reach us by call or WhatsApp at +1 443-272-6794, or email info@cacsalvationcenter.org. 10710 Marriottsville Rd, Randallstown MD 21133. We'd love to connect.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
