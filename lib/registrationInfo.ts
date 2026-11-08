// Ported from the Convention site's lib/content/{registration-guidelines,
// payment-options}.ts during the Phase G data merge (2026-09) -- purely
// informational copy shown alongside the register form. Zelle is listed
// first: it is the recommended way to pay (no card fee) and the forms'
// default paymentMethod (app/api/register/route.ts, confirmByZelle). The
// Zelle entry is the single source of the Zelle address for the forms, the
// confirmation page and the email.

export const registrationGuidelines = {
  items: [
    "All registrations must be done online.",
    "Couples can register together.",
    "All children and youth must be registered separately under Youth and Child registration.",
    "All registration fees include participation and needed conference items and package.",
    "Registration does not cover hotel accommodation — participants should book hotel accommodation personally online.",
  ],
  freeFoodNote: "Food during convention is free for all age groups.",
};

// Distinct from the "Village Pay Off" giving account on /giving -- these
// are the registration-specific accounts (verified against Convention's
// own payment-options.ts), for registrants paying by Zelle or check
// instead of card.
export const paymentOptions: {
  kind: "zelle" | "check" | "card";
  name: string;
  detail: string;
  /** Value worth one-tap copying (shown with copyLabel on the button). */
  copyValue?: string;
  copyLabel?: string;
}[] = [
  { kind: "zelle", name: "Zelle", detail: "Send to cacnaconvention@gmail.com.", copyValue: "cacnaconvention@gmail.com", copyLabel: "Copy Zelle email" },
  { kind: "card", name: "Credit / Debit Card", detail: "Pay by card during registration via Stripe." },
  { kind: "check", name: "Check / bank deposit", detail: "Deposit directly to Chase Bank under \"CACNA CONVENTION,\" Account Number 823936908.", copyValue: "823936908", copyLabel: "Copy account number" },
];
