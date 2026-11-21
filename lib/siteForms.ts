import { currentOrNextConvention } from "@/lib/conventions";

/**
 * Single source of truth for every form on the site. The public /forms
 * directory and the admin /admin/forms overview both read this list, so a new
 * form only needs adding here. (Not lib/forms.ts, which holds the submit helpers.)
 *
 * Keep it in step with the forms themselves (components/* and app/api/*).
 */

export type FormCategory = "Get in touch" | "Register & serve" | "Give & shop";

export const FORM_CATEGORIES: FormCategory[] = ["Get in touch", "Register & serve", "Give & shop"];

/** Where a form's submissions can be counted in the database. */
export interface FormCountSource {
  table: "contact_submissions" | "newsletter_subscribers" | "serve_signups" | "checkin_people" | "giving_invoices";
  /** Optional equality filter, e.g. the convention year for check-in rows. */
  eq?: { column: string; value: string | number | boolean };
  /** What one row is, for the admin table ("messages", "sign-ups", ...). */
  unit: string;
}

export interface SiteForm {
  id: string;
  name: string;
  category: FormCategory;
  /** One line for visitors: what the form is for. */
  purpose: string;
  /** Who it is meant for. */
  audience: string;
  /** Where visitors find it. Omitted when the form is not open right now. */
  href?: string;
  /** Link text shown on the public page. */
  cta: string;
  /** Plain description of where the form lives, for pages without a direct link. */
  foundAt?: string;
  /** Staff-facing: where the submissions end up. Admin page only. */
  staff: {
    destination: string;
    adminHref?: string;
    adminLabel?: string;
    count?: FormCountSource;
  };
}

export function getSiteForms(): SiteForm[] {
  const cy = currentOrNextConvention();
  const onSiteReg = cy.registrationUrl && !/^https?:\/\//.test(cy.registrationUrl) ? cy.registrationUrl : undefined;

  return [
    {
      id: "contact",
      name: "Contact us",
      category: "Get in touch",
      purpose: "Send a message, question or prayer need to the CACNA office.",
      audience: "Anyone",
      href: "/contact",
      cta: "Open the contact form",
      staff: {
        destination: "Saved to the contact inbox, emailed to staff, and logged to the Google Sheet.",
        adminHref: "/admin/contact",
        adminLabel: "Contact inbox",
        count: { table: "contact_submissions", eq: { column: "archived", value: false }, unit: "unarchived messages" },
      },
    },
    {
      id: "newsletter",
      name: "Newsletter sign-up",
      category: "Get in touch",
      purpose: "Get CACNA news, events and announcements by email.",
      audience: "Anyone",
      cta: "Find it in the footer",
      foundAt: "The footer of every page on the site.",
      staff: {
        destination: "Saved to the subscriber list, sends a welcome email, and logged to the Google Sheet.",
        adminHref: "/admin/newsletter",
        adminLabel: "Newsletter",
        count: { table: "newsletter_subscribers", unit: "subscribers" },
      },
    },
    {
      id: "registration",
      name: `Convention ${cy.year} registration`,
      category: "Register & serve",
      purpose: "Register adults and families for the Annual Convention and receive check-in codes.",
      audience: "Convention attendees (adults)",
      href: onSiteReg,
      cta: "Register for the convention",
      foundAt: onSiteReg ? undefined : "Registration for this year's convention is not open on the site yet.",
      staff: {
        destination: "Check-in codes are created for each attendee; payment and Zelle choices are logged to the Google Sheet.",
        adminHref: "/admin/check-in",
        adminLabel: "Check-in",
        count: { table: "checkin_people", eq: { column: "year", value: cy.year }, unit: `registered people for ${cy.year}` },
      },
    },
    {
      id: "youth-registration",
      name: `Youth registration ${cy.year}`,
      category: "Register & serve",
      purpose: "Register children and youth for the Annual Convention.",
      audience: "Parents and guardians of youth attendees",
      href: onSiteReg ? `${onSiteReg}/youth` : undefined,
      cta: "Register a young person",
      foundAt: onSiteReg ? undefined : "Youth registration opens together with convention registration.",
      staff: {
        destination: "Shares the registration pipeline: counted in the same check-in list as adult registrations.",
        adminHref: "/admin/check-in",
        adminLabel: "Check-in",
      },
    },
    {
      id: "serve",
      name: "Serve at the convention",
      category: "Register & serve",
      purpose: "Volunteer on a convention team: ushers, care, hospitality, choir, media and more.",
      audience: "Members who want to volunteer",
      href: "/serve",
      cta: "Sign up to serve",
      staff: {
        destination: "Saved as a volunteer sign-up, emailed to staff, and logged to the Google Sheet.",
        adminHref: "/admin/operations",
        adminLabel: "Operations",
        count: { table: "serve_signups", unit: "volunteer sign-ups" },
      },
    },
    {
      id: "giving",
      name: "Give",
      category: "Give & shop",
      purpose: "Give once or set up a recurring gift by card, or choose Zelle.",
      audience: "Anyone",
      href: "/giving",
      cta: "Give now",
      staff: {
        destination: "Card gifts go through Stripe; Zelle pledges are logged to the Google Sheet. Recurring gifts create invoices.",
        adminHref: "/admin/operations",
        adminLabel: "Operations",
        count: { table: "giving_invoices", unit: "giving invoices" },
      },
    },
    {
      id: "cancel-giving",
      name: "Cancel a recurring gift",
      category: "Give & shop",
      purpose: "Ask to stop a monthly or bi-weekly gift. We email a link to confirm it is you.",
      audience: "Givers with a recurring gift",
      href: "/giving/cancel",
      cta: "Cancel a recurring gift",
      staff: {
        destination: "Emails the giver a confirmation link; the subscription is cancelled in Stripe once they confirm.",
        adminHref: "/admin/operations",
        adminLabel: "Operations",
      },
    },
    {
      id: "store",
      name: "Convention store checkout",
      category: "Give & shop",
      purpose: "Order convention apparel and merchandise.",
      audience: "Anyone",
      href: "/store",
      cta: "Visit the store",
      staff: {
        destination: "Checkout runs through Stripe; orders appear under store orders in Operations.",
        adminHref: "/admin/operations",
        adminLabel: "Operations",
      },
    },
  ];
}
