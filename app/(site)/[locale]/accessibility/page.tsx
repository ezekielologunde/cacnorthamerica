import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { SITE, SITE_URL } from "@/lib/site";
import { LegalPage, MailLink, type LegalSection } from "@/components/legal/LegalPage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Accessibility & Feedback — Christ Apostolic Church North America (CACNA)",
    description:
      "How CACNA works to keep cacna.org usable for everyone, how to ask for an accommodation at the Annual Convention or a service, and how to send us feedback.",
    alternates: { canonical: `${SITE_URL}/accessibility` },
  };
}

const list = { margin: "10px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 } as const;
const p = { margin: "0 0 10px" } as const;

const sections: LegalSection[] = [
  {
    heading: "Our commitment",
    body: (
      <p style={{ margin: 0 }}>
        Everyone is welcome at {SITE.shortName}, and that includes the people who use this website. We aim to meet
        the Web Content Accessibility Guidelines (WCAG) 2.1 level AA. We have not had a formal accessibility audit
        yet, so we cannot say we fully meet that standard, and we would rather tell you that than overstate it.
      </p>
    ),
  },
  {
    heading: "What we have in place",
    body: (
      <ul style={{ ...list, margin: 0 }}>
        <li>A &ldquo;skip to content&rdquo; link at the top of every page, for keyboard and screen reader users.</li>
        <li>A visible focus outline on links, buttons and form fields, so you can see where you are when using the keyboard.</li>
        <li>Animation that is reduced or switched off when your device is set to reduce motion.</li>
        <li>Descriptions (alt text) for the photos we publish in the gallery.</li>
        <li>Frequently asked questions that open and close without needing JavaScript.</li>
        <li>Forms with visible labels and error messages that say what to fix.</li>
      </ul>
    ),
  },
  {
    heading: "Known limits",
    body: (
      <>
        <p style={p}>We know of some places where we may fall short, and we are working on them:</p>
        <ul style={list}>
          <li>Some older photos and flyers may not have a full text description.</li>
          <li>Videos and livestreams are provided through YouTube, and captions depend on what YouTube generates or what the speaker&apos;s team uploads.</li>
          <li>Documents we link to, such as PDFs or Word files, may not be fully accessible to screen readers.</li>
          <li>We have not yet tested every page with every screen reader or assistive technology.</li>
        </ul>
      </>
    ),
  },
  {
    heading: "Asking for an accommodation",
    body: (
      <>
        <p style={p}>
          If you would like to attend the Annual Convention or another CACNA gathering and need something to make that
          possible, such as step-free access, seating, a mobility aid, large-print or text copies of materials, help
          with hearing or sight, or a particular meal because of a medical need, please tell us before you travel.
        </p>
        <p style={{ margin: 0 }}>
          The registration forms ask about meal allergies, but they do not have a place for other needs yet, so please
          write to the committee at <MailLink address={SITE.email} /> or use the <Link href="/contact" style={{ color: "var(--red)", fontWeight: 700 }}>contact form</Link> and
          choose &ldquo;Other&rdquo;. The more notice you give us, the better we can prepare. We cannot promise to meet
          every request, but we will read each one and work with you in good faith. If you are asking about CAC Village
          itself (parking, lodging, walking distances), ask us first so you are not surprised on arrival.
        </p>
      </>
    ),
  },
  {
    heading: "Feedback and reporting a problem",
    body: (
      <>
        <p style={p}>
          If something on this website is hard to use, or you cannot get to information or a service, tell us. Please
          include the page address, what you were trying to do, and, if you are happy to share it, the device,
          browser or assistive technology you were using. If you cannot use the website for something you need,
          tell us that too and we will give you the information another way.
        </p>
        <p style={{ margin: 0 }}>
          Feedback of any other kind is just as welcome: a mistake in our content, a question the FAQs should answer,
          or an idea for the site. Write to <MailLink address={SITE.email} /> or use the{" "}
          <Link href="/contact" style={{ color: "var(--red)", fontWeight: 700 }}>contact form</Link>. We will reply as soon as we can.
        </p>
      </>
    ),
  },
];

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage
      title="Accessibility & Feedback"
      lastUpdated="2 November 2026"
      intro={<p style={{ margin: 0 }}>How we work to keep this website usable for everyone, how to ask for an accommodation, and how to tell us what we can do better.</p>}
      sections={sections}
    />
  );
}
