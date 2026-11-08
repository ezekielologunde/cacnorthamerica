import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE, SITE_URL } from "@/lib/site";
import { LegalPage, MailLink, type LegalSection } from "@/components/legal/LegalPage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Refund & Cancellation Policy — Christ Apostolic Church North America (CACNA)",
    description:
      "How refund and cancellation requests for convention registration, store orders and online gifts are handled at CACNA.",
    alternates: { canonical: `${SITE_URL}/refunds` },
  };
}

const sections: LegalSection[] = [
  {
    heading: "No automatic refunds",
    body: (
      <p style={{ margin: 0 }}>
        Payments made through this website, including convention registration fees, store orders and online gifts,
        are not refunded automatically.
      </p>
    ),
  },
  {
    heading: "How to ask for a refund or cancellation",
    body: (
      <p style={{ margin: 0 }}>
        Email <MailLink address={SITE.email} /> with your name, the email you used, what you paid for, and the
        reason for your request. Including the details from your confirmation email helps us find your payment.
      </p>
    ),
  },
  {
    heading: "How requests are decided",
    body: (
      <p style={{ margin: 0 }}>
        The committee looks at each request individually and will reply to you by email with its decision.
      </p>
    ),
  },
  {
    heading: "Questions",
    body: (
      <p style={{ margin: 0 }}>
        This is a general policy. If you have any questions, contact the committee at{" "}
        <MailLink address={SITE.email} />.
      </p>
    ),
  },
];

export default async function RefundsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      lastUpdated="2 November 2026"
      intro={<p style={{ margin: 0 }}>Refunds and cancellations are handled case by case. Here is how to ask.</p>}
      sections={sections}
    />
  );
}
