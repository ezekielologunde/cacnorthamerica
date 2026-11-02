// The contact form's fixed vocabulary, shared by the form
// (app/(site)/[locale]/contact/ContactPageClient.tsx) and its route
// (./route.ts). The route only accepts these subjects and field names, so a
// caller can't invent new Sheets tabs or columns or pad the staff email
// with fields the form never sends.

export const CONTACT_SUBJECTS = [
  "General Enquiry",
  "Find a Member Church",
  "Zone / DCC Inquiry",
  "Annual Convention",
  "Prayer Request",
  "Pastoral Care",
  "Giving & Donations",
  "Media & Livestream",
  "Other",
] as const;

/** formName the form sends: "Contact — <subject>", or "Contact — General"
 *  when no subject was picked. */
export const CONTACT_FORM_NAMES: ReadonlySet<string> = new Set(
  ["General", ...CONTACT_SUBJECTS].map((s) => `Contact — ${s}`),
);

/** Every field the form can send, with its maximum length. */
export const CONTACT_FIELD_LIMITS: Readonly<Record<string, number>> = {
  "Name": 200,
  "Email": 254,
  "Phone": 50,
  "Country": 100,
  "Subject": 100,
  "Message": 10_000,
  "Visit Type": 100,
  "Address": 300,
  "City/Town": 100,
  "State/Province": 100,
  "Zip/Post Code": 20,
  "Groups": 1_000,
};
