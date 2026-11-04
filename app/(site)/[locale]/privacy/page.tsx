import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE, SITE_URL } from "@/lib/site";
import { LegalPage, MailLink, type LegalSection } from "@/components/legal/LegalPage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Privacy Policy — Christ Apostolic Church North America (CACNA)",
    description:
      "What information CACNA collects through cacna.org — registration, contact, meal requests, the newsletter, the store and giving — how it is used, and who helps us process it.",
    alternates: { canonical: `${SITE_URL}/privacy` },
  };
}

const list = { margin: "10px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 } as const;
const p = { margin: "0 0 10px" } as const;

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    body: (
      <p style={{ margin: 0 }}>
        This website, cacna.org, is run by {SITE.name} ({SITE.shortName}). When this policy says
        &ldquo;we&rdquo; or &ldquo;us&rdquo;, it means CACNA.
      </p>
    ),
  },
  {
    heading: "What we collect",
    body: (
      <>
        <p style={p}>We only collect what you type into our forms, plus basic analytics about how the site is used:</p>
        <ul style={list}>
          <li><strong>Convention registration:</strong> each registrant&apos;s first and last name and category (adult, young adult or child), your church name for group registrations, and the contact person&apos;s name, email and phone number.</li>
          <li><strong>Contact form:</strong> your name, email, subject and message.</li>
          <li><strong>Meal requests:</strong> your name, email, phone, age range, church, youth leader, DCC or zone, the names of any children traveling with you, the meals you need and any allergies you tell us about.</li>
          <li><strong>Newsletter:</strong> your email address and, if you give it, your name.</li>
          <li><strong>Store orders:</strong> your name, email, the items you order and your shipping address.</li>
          <li><strong>Giving:</strong> your name, email, the amount and the campaign you give to.</li>
        </ul>
      </>
    ),
  },
  {
    heading: "Payments",
    body: (
      <p style={{ margin: 0 }}>
        Registration fees, store orders and online gifts are paid through Stripe. You enter your card details on
        Stripe&apos;s secure checkout page, not on our site. We never see or store your full card number. Stripe
        shares with us the details we need to confirm the payment, such as your name, email, the amount and, for
        store orders, your shipping address. If you give from a bank account, Stripe may ask you to log in to your
        bank to confirm the account; we never see your bank login or your full account number. If you choose to give
        by Zelle, we keep the name, email, amount and campaign you enter, along with the reference we show you, so we
        can match your payment; the payment itself happens in your own bank, and we never see your bank login.
      </p>
    ),
  },
  {
    heading: "How we use it",
    body: (
      <ul style={{ ...list, margin: 0 }}>
        <li>To process your registration, order, meal request or gift, and send you a confirmation email.</li>
        <li>To answer your questions and messages.</li>
        <li>To send newsletter updates if you subscribed.</li>
        <li>To plan the Annual Convention and keep church records.</li>
        <li>To understand, in aggregate, how people use the site so we can improve it.</li>
      </ul>
    ),
  },
  {
    heading: "Services that help us",
    body: (
      <>
        <p style={p}>We do not sell your information. We share it only with the services that run this site for us:</p>
        <ul style={list}>
          <li><strong>Stripe</strong> processes payments.</li>
          <li><strong>Supabase</strong> stores contact messages and newsletter sign-ups.</li>
          <li><strong>Resend</strong> sends our confirmation and newsletter emails.</li>
          <li><strong>Google Sheets</strong> (through a Google Apps Script) keeps a copy of form submissions and completed payments for the committee&apos;s records.</li>
          <li><strong>Cloudinary</strong> hosts the photos shown on the site.</li>
          <li><strong>Google Analytics</strong> measures site visits. Blog posts may also show ads from Google AdSense; Google and its partners use cookies to serve and measure those ads.</li>
          <li><strong>Vercel</strong> hosts the site. Our zone finder can use Vercel&apos;s rough, city-level estimate of your location from your IP address; we do not store it. Vercel also gives us page-view and speed statistics that do not use cookies.</li>
        </ul>
      </>
    ),
  },
  {
    heading: "Cookies",
    body: (
      <p style={{ margin: 0 }}>
        We keep cookies to a minimum. Google Analytics uses cookies to count visits; you can stop that by blocking cookies in your browser or by installing Google&apos;s{" "}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "var(--red)", fontWeight: 700 }}>opt-out browser add-on</a>. Videos are embedded through
        YouTube&apos;s privacy-enhanced mode, which does not set tracking cookies until you press play. Our admin
        area uses a sign-in cookie for staff only. Blog posts may show ads from Google AdSense, which use cookies to show and measure ads; you can manage ad personalization in{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--red)", fontWeight: 700 }}>Google&apos;s ad settings</a>{" "}
        or read{" "}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={{ color: "var(--red)", fontWeight: 700 }}>how Google uses information from sites that use its services</a>. We show no ads outside blog posts. You can block or delete cookies in your browser settings.
      </p>
    ),
  },
  {
    heading: "Children",
    body: (
      <p style={{ margin: 0 }}>
        Registrations and meal requests can include children. Their details should be entered by a parent or
        guardian, and we use them only for the convention.
      </p>
    ),
  },
  {
    heading: "How long we keep it",
    body: (
      <p style={{ margin: 0 }}>
        We keep your information as long as it is needed for the convention and for church record keeping. You can
        ask us to stop sending you the newsletter at any time.
      </p>
    ),
  },
  {
    heading: "Your choices and questions",
    body: (
      <p style={{ margin: 0 }}>
        This is a general policy. To ask what we hold about you, correct it, ask us to delete it, or ask any other
        question, contact the committee at <MailLink address={SITE.email} />.
      </p>
    ),
  },
];

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="2 November 2026"
      intro={<p style={{ margin: 0 }}>How CACNA collects, uses and protects the information you share through this website.</p>}
      sections={sections}
    />
  );
}
