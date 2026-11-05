// Checks for recurring gifts at checkout: lib/givingRecurring.ts (the switch,
// who may use it, the Stripe session, the amount split) and the shape of the
// route, form and pages that use it. Plain Node script:
//
//   node scripts/check-giving-recurring-checkout.mjs
//
// Node 24 strips TypeScript types natively; the hook below only maps the
// repo's "@/..." alias onto the .ts sources. Exits 1 if any check fails.
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("@/")) {
      const target = path.join(root, specifier.slice(2));
      if (!path.extname(target) && existsSync(`${target}.ts`)) return next(pathToFileURL(`${target}.ts`).href, context);
    }
    return next(specifier, context);
  },
});

const { recurringEnabled, recurringAllowedForKind, recurringCheckoutParams, splitRecurringCheckout, cadencePhrase } = await import("../lib/givingRecurring.ts");
const { recurringFeeCentsFor, setupFeeCentsFor } = await import("../lib/processingFee.ts");
const { GIVING_CAMPAIGNS } = await import("../lib/giving.ts");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

// ---- The switch ----
check("recurring is off by default", recurringEnabled({}) === false && recurringEnabled({ GIVING_RECURRING_ENABLED: "" }) === false);
check("only the exact value \"true\" turns it on", recurringEnabled({ GIVING_RECURRING_ENABLED: "true" }) === true && ["1", "TRUE", "yes", "false"].every((v) => !recurringEnabled({ GIVING_RECURRING_ENABLED: v })));

// ---- Who may give on a schedule ----
const byKind = (k) => GIVING_CAMPAIGNS.filter((c) => c.kind === k);
check("the tithe and every project may repeat", recurringAllowedForKind("tithe") && byKind("project").length > 0 && byKind("project").every((c) => recurringAllowedForKind(c.kind)));
check("a general offering (thanksgiving included) may not", !recurringAllowedForKind("offering") && byKind("offering").length > 0);
check("every campaign in the catalogue gets a definite answer", GIVING_CAMPAIGNS.every((c) => typeof recurringAllowedForKind(c.kind) === "boolean"));
check("cadence wording", cadencePhrase("monthly") === "every month" && cadencePhrase("biweekly") === "every 2 weeks");

// ---- The Stripe session ----
const base = {
  amountCents: 10_000, method: "card", frequency: "monthly", giftTitle: "Tithe", contactName: "Ada Okafor", contactEmail: " ada@example.com ",
  campaignSlug: "tithe", campaignTitle: "Tithe", embedded: false, returnUrl: "https://cacna.org/giving/confirmation?session_id={CHECKOUT_SESSION_ID}", cancelUrl: "https://cacna.org/giving",
};
{
  const p = recurringCheckoutParams(base);
  check("a recurring gift is a subscription Checkout Session", p.mode === "subscription");
  check("the gift line is exactly the chosen amount and repeats monthly", p.line_items[0].price_data.unit_amount === 10_000 && p.line_items[0].price_data.recurring.interval === "month" && p.line_items[0].price_data.recurring.interval_count === 1);
  check("the fee is its own repeating line (the donor pays it every cycle)", p.line_items.length === 2 && p.line_items[1].price_data.unit_amount === recurringFeeCentsFor(10_000, "card") && p.line_items[1].price_data.recurring.interval === "month");
  check("a card gift is pinned to card, with no bank options", JSON.stringify(p.payment_method_types) === JSON.stringify(["card"]) && !p.payment_method_options);
  check("the donor's address is trimmed", p.customer_email === "ada@example.com");
  check("hosted checkout gets success and cancel URLs", p.success_url === base.returnUrl && p.cancel_url === base.cancelUrl && !p.ui_mode && !p.return_url);
  const m = p.metadata;
  check("session metadata names the gift and its fee split", m.kind === "giving" && m.campaign_title === "Tithe" && m.contact_name === "Ada Okafor" && m.subtotal_cents === "10000" && m.processing_fee_cents === String(recurringFeeCentsFor(10_000, "card")) && m.setup_fee_cents === "0" && m.frequency === "monthly");
  check("the same metadata is on the subscription (Stripe does not copy it), so the webhook can split each invoice", JSON.stringify(p.subscription_data.metadata) === JSON.stringify(m));
}
{
  const p = recurringCheckoutParams({ ...base, frequency: "biweekly" });
  check("every 2 weeks is a 2-week interval, on the gift and the fee", ["0", "1"].every((i) => p.line_items[i].price_data.recurring.interval === "week" && p.line_items[i].price_data.recurring.interval_count === 2) && p.metadata.frequency === "biweekly");
}
{
  const p = recurringCheckoutParams({ ...base, method: "bank" });
  check("a bank gift is pinned to bank with instant verification", JSON.stringify(p.payment_method_types) === JSON.stringify(["us_bank_account"]) && p.payment_method_options.us_bank_account.verification_method === "instant");
  check("a bank gift adds a ONE-TIME setup line (no recurring), after the repeating fee", p.line_items.length === 3 && !p.line_items[2].price_data.recurring && p.line_items[2].price_data.unit_amount === setupFeeCentsFor(10_000, "bank") && p.line_items[2].price_data.unit_amount > 0);
  check("the repeating lines (gift and fee) all repeat", p.line_items[0].price_data.recurring && p.line_items[1].price_data.recurring);
  check("bank metadata records the setup fee separately from the renewal fee", p.metadata.setup_fee_cents === String(setupFeeCentsFor(10_000, "bank")) && p.metadata.processing_fee_cents === String(recurringFeeCentsFor(10_000, "bank")));
  const first = p.line_items.reduce((s, l) => s + l.price_data.unit_amount, 0);
  check("the first bank invoice is the gift plus the renewal fee plus the setup fee", first === 10_000 + recurringFeeCentsFor(10_000, "bank") + setupFeeCentsFor(10_000, "bank"));
}
{
  const p = recurringCheckoutParams({ ...base, embedded: true });
  check("embedded checkout gets a return URL instead", p.ui_mode === "embedded_page" && p.return_url === base.returnUrl && !p.success_url && !p.cancel_url);
}

// ---- The first invoice's split, for the confirmation page ----
{
  const bank = recurringCheckoutParams({ ...base, method: "bank" });
  const total = bank.line_items.reduce((s, l) => s + l.price_data.unit_amount, 0);
  const s = splitRecurringCheckout(total, bank.metadata);
  check("the gift is the chosen amount; renewal and setup fees count as fees", s.subtotalCents === 10_000 && s.processingFeeCents === total - 10_000 && s.totalCents === total);
  check("missing, blank or oversized metadata falls back to showing the total as given", splitRecurringCheckout(5000, {}).subtotalCents === 5000 && splitRecurringCheckout(5000, { subtotal_cents: "" }).processingFeeCents === 0 && splitRecurringCheckout(5000, { subtotal_cents: "99999" }).subtotalCents === 5000 && splitRecurringCheckout(5000, undefined).processingFeeCents === 0);
}

// ---- Shape of the route, form and pages ----
const read = (p) => readFileSync(path.join(root, p), "utf8");
{
  const route = read("app/api/giving/checkout/route.ts");
  check("the route refuses recurring while the switch is off", route.includes("isRecurring(asked) && !recurringEnabled()") && route.includes("allowRecurring: recurringEnabled()"));
  check("a recurring gift needs the tithe or a project, the amount caps, and the consent box", route.includes("recurringAllowedForKind(campaign.kind)") && route.includes("validateRecurringAmount(") && route.includes("b.recurringConsent !== true"));
  check("a recurring gift needs the form header, a Turnstile pass and a per-inbox limit", route.includes("FORM_HEADER") && route.includes("verifyTurnstile(body.turnstileToken") && route.includes("giving-recurring:"));
  check("the one-time path is still a payment-mode session", route.includes('mode: "payment"') && route.includes("feeLineItems(body.amountCents, method)"));
  check("the server decides the fee (the form never sends one)", !/processing_fee_cents|feeCents:/.test(read("components/giving/GivingForm.tsx")));
}
{
  const form = read("components/giving/GivingForm.tsx");
  check("the form asks for the authorization and sends it, with the frequency", form.includes("recurringConsent") && form.includes("frequency: effectiveFrequency"));
  check("the form offers repeating only when the server switch is on, and only for the tithe and projects", form.includes("recurringOn") && form.includes("recurringAllowedForKind"));
  check("Zelle is not offered for a repeating gift", /repeating/.test(form) && form.includes("value !== \"zelle\" || (zelleRecipient && !repeating)"));
  const page = read("app/(site)/[locale]/giving/page.tsx");
  check("the page reads the switch on the server and passes it down", page.includes("recurringEnabled()") && page.includes("recurringOn="));
  const confirm = read("app/(site)/[locale]/giving/confirmation/page.tsx");
  check("the confirmation page handles a subscription session (no payment intent)", confirm.includes('session.mode === "subscription"') && confirm.includes("splitRecurringCheckout"));
  const mail = read("lib/givingEmail.ts");
  check("a recurring receipt tells the donor how to stop the gift", mail.includes("/giving/cancel"));
}

if (failures > 0) {
  console.log(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll checks passed.");
