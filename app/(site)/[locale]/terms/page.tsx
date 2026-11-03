import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE, SITE_URL } from "@/lib/site";
import { LegalPage, MailLink, type LegalSection } from "@/components/legal/LegalPage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Terms of Service — Christ Apostolic Church North America (CACNA)",
    description:
      "The terms for using cacnorthamerica.com — convention registration, store orders, online giving, and how we expect everyone to treat each other.",
    alternates: { canonical: `${SITE_URL}/terms` },
  };
}

const link = { color: "var(--red)", fontWeight: 700, textDecoration: "none" } as const;
const p = { margin: "0 0 10px" } as const;

const sections: LegalSection[] = [
  {
    heading: "Using this site",
    body: (
      <p style={{ margin: 0 }}>
        cacnorthamerica.com is run by {SITE.name} ({SITE.shortName}). By using the site, registering, ordering
        or giving, you agree to these terms. Please give accurate information in any form you fill in.
      </p>
    ),
  },
  {
    heading: "Convention registration",
    body: (
      <>
        <p style={p}>
          Registration fees are set by registrant category and are shown on the registration page before you pay.
          You can pay by Zelle or by card through Stripe&apos;s secure checkout. A processing fee is added to card
          payments at checkout and shown before you pay; there is no processing fee on Zelle.
        </p>
        <p style={{ margin: 0 }}>
          Registration is free for children and youth ages 1&ndash;19, who register on the Youth &amp; Child form.
          No other free or complimentary registrations are available through the website. If you believe you
          qualify for one, contact the committee at <MailLink address={SITE.email} />.
        </p>
      </>
    ),
  },
  {
    heading: "Store orders",
    body: (
      <p style={{ margin: 0 }}>
        Store prices are shown before you check out, and payment is taken through Stripe. A payment processing fee is added at checkout and shown before you pay. We ship to the addresses
        you give us at checkout. Items and availability may change without notice.
      </p>
    ),
  },
  {
    heading: "Giving",
    body: (
      <p style={{ margin: 0 }}>
        Gifts and donations are voluntary. Online gifts are processed by Stripe; a payment processing fee is added at checkout, shown before you pay, and kept separate from your gift. You will receive an email
        confirmation of your gift. For other ways to give, see the <Link href="/giving" style={link}>Giving page</Link>.
      </p>
    ),
  },
  {
    heading: "Refunds",
    body: (
      <p style={{ margin: 0 }}>
        Payments are not refunded automatically. See our{" "}
        <Link href="/refunds" style={link}>Refund &amp; Cancellation Policy</Link> for how to make a request.
      </p>
    ),
  },
  {
    heading: "Code of conduct",
    body: (
      <p style={{ margin: 0 }}>
        We ask everyone, online and at our events, to treat others with kindness and respect. Do not misuse the
        site, submit false information, send spam or try to interfere with how it works. We may decline or cancel
        a registration or order that breaks these terms.
      </p>
    ),
  },
  {
    heading: "Content",
    body: (
      <p style={{ margin: 0 }}>
        Sermons, photos, text and logos on this site belong to CACNA or are used with permission. Please ask us
        before reusing them.
      </p>
    ),
  },
  {
    heading: "Limitation of liability",
    body: (
      <p style={{ margin: 0 }}>
        We work to keep the site accurate and available, but we provide it as it is and cannot promise it will
        always be error-free. Event details can change. To the extent the law allows, CACNA is not liable for
        losses that come from using the site.
      </p>
    ),
  },
  {
    heading: "Changes and questions",
    body: (
      <p style={{ margin: 0 }}>
        We may update these terms; the date above shows the latest version. Questions? Contact the committee at{" "}
        <MailLink address={SITE.email} />.
      </p>
    ),
  },
];

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="2 November 2026"
      intro={<p style={{ margin: 0 }}>The ground rules for registering, ordering and giving through this website. This is a general summary; if anything is unclear, please ask us.</p>}
      sections={sections}
    />
  );
}
