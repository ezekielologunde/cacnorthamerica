// Security checks for the registration / store / giving confirmation logic.
// No test framework is installed, so this is a plain Node script:
//
//   node scripts/check-payment-confirmation.mjs
//
// Node 24 strips TypeScript types natively; the hook below only maps the
// repo's "@/..." alias and extensionless imports onto the .ts sources.
// Exits 1 if any check fails. Uses fake Stripe sessions; never calls Stripe.
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
registerHooks({
  resolve(specifier, context, next) {
    let target = null;
    if (specifier.startsWith("@/")) target = path.join(root, specifier.slice(2));
    else if (specifier.startsWith(".") && context.parentURL?.startsWith("file:") && !path.extname(specifier)) {
      target = path.join(path.dirname(new URL(context.parentURL).pathname.replace(/^\/(\w:)/, "$1")), specifier);
    }
    if (target && !path.extname(target) && existsSync(`${target}.ts`)) {
      return next(pathToFileURL(`${target}.ts`).href, context);
    }
    return next(specifier, context);
  },
});

process.env.REGISTRATION_SIGNING_SECRET = "check-script-only-secret";
delete process.env.STRIPE_SECRET_KEY;

const { resolveRegistrationConfirmation, isPaidCheckout } = await import("../lib/registrationConfirmation.ts");
const { sealRegistrationToken } = await import("../lib/registrationToken.ts");
const { encodeSummary, chunkForMetadata } = await import("../lib/checkoutSummary.ts");

const YEAR = 2027;
let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

const forgedPaid = {
  ref: "x", year: YEAR, registrationType: "group", churchName: "Any Church",
  contactName: "A", contactEmail: "a@b.c", contactPhone: "",
  registrants: Array.from({ length: 20 }, (_, i) => ({ n: `Adult ${i + 1}`, c: "adult" })),
  totalAmountCents: 400000, isComplimentary: false,
};
const forgedD = encodeSummary(forgedPaid);
const childOnly = {
  ref: "y", year: YEAR, registrationType: "individual", churchName: null,
  contactName: "Parent", contactEmail: "parent@example.com", contactPhone: "",
  registrants: [{ n: "Kid One", c: "child" }], totalAmountCents: 0, isComplimentary: false,
};
const sessions = {
  // Carries a `d` too, so only the metadata.kind check can reject it.
  cs_test_giving1: { payment_status: "paid", metadata: { kind: "giving", campaign_title: "Building Fund", ...chunkForMetadata("d", forgedD) } },
  cs_test_regpaid: { payment_status: "paid", metadata: { kind: "registration", convention_year: String(YEAR), ...chunkForMetadata("d", encodeSummary({ ...childOnly, ref: "z", registrants: [{ n: "Real Adult", c: "adult" }], totalAmountCents: 20000 })) } },
  cs_test_regunpaid: { payment_status: "unpaid", metadata: { kind: "registration", ...chunkForMetadata("d", encodeSummary({ ...childOnly, registrants: [{ n: "Real Adult", c: "adult" }], totalAmountCents: 20000 })) } },
  cs_test_regextras: { payment_status: "paid", metadata: { kind: "registration", convention_year: String(YEAR), ...chunkForMetadata("d", encodeSummary({ ...childOnly, ref: "w", dcc: "Zone 3", registrants: [{ n: "Real Adult", c: "adult", m: 3 }], totalAmountCents: 20000 })) } },
  cs_test_regother: { payment_status: "paid", metadata: { kind: "registration", ...chunkForMetadata("d", encodeSummary({ ...childOnly, year: 2026 })) } },
};
const retrieveSession = async (id) => {
  if (!sessions[id]) throw new Error("No such checkout session");
  return sessions[id];
};
const resolve = (q) => resolveRegistrationConfirmation({ year: YEAR, retrieveSession, ...q });
const rendersPaid = (r) => !!r && r.isPaid; // the page shows "Paid" only when isPaid

// payments-1: the attack from the audit.
check("forged d + status=free does not render Paid",
  !rendersPaid(await resolve({ status: "free", d: forgedD })));
check("forged plain-JSON token (?t=<base64url JSON>) does not render Paid",
  !rendersPaid(await resolve({ token: forgedD })));
const good = sealRegistrationToken(childOnly);
const tampered = Buffer.from(good, "base64url"); tampered[20] ^= 1;
check("tampered sealed token does not render Paid",
  !rendersPaid(await resolve({ token: tampered.toString("base64url") })));
check("sealed token for a non-$0 / adult summary does not render Paid",
  !rendersPaid(await resolve({ token: sealRegistrationToken(forgedPaid) })));
check("sealed token for another year does not render",
  (await resolve({ token: sealRegistrationToken({ ...childOnly, year: 2026 }) })) === null);
check("giving session_id + forged d does not render Paid",
  !rendersPaid(await resolve({ sessionId: "cs_test_giving1", d: forgedD })));
check("registration session from another year does not render",
  (await resolve({ sessionId: "cs_test_regother" })) === null);
check("malformed session_id is rejected without a Stripe call",
  (await resolve({ sessionId: "../../v1/customers" })) === null);

// Legitimate flows still work.
const free = await resolve({ token: good });
check("genuine child-only sealed token renders Paid with a re-openable confirmation path",
  rendersPaid(free) && free.isFree && free.confirmationPath === `/events/cacna-${YEAR}/register/confirmation?t=${good}`);
const paid = await resolve({ sessionId: "cs_test_regpaid", d: forgedD });
check("paid registration session renders Paid from Stripe metadata, ignoring URL d",
  rendersPaid(paid) && paid.summary.registrants[0].n === "Real Adult" && paid.confirmationPath === `/events/cacna-${YEAR}/register/confirmation?session_id=cs_test_regpaid`);
const extras = await resolve({ sessionId: "cs_test_regextras" });
check("paid adult session keeps DCC / Zone and meals for the confirmation page",
  rendersPaid(extras) && extras.summary.dcc === "Zone 3" && extras.summary.registrants[0].m === 3);
const unpaid = await resolve({ sessionId: "cs_test_regunpaid" });
check("unpaid registration session renders Pending (not Paid)", !!unpaid && !unpaid.isPaid);
check("no confirmation path contains readable PII",
  !free.confirmationPath.includes("Kid") && !free.confirmationPath.includes(Buffer.from("parent@").toString("base64url").slice(0, 8)));

// payments-7: store / giving receipts.
check("unpaid giving session is not a receipt", !isPaidCheckout({ payment_status: "unpaid", metadata: { kind: "giving" } }, "giving"));
check("store session is not a giving receipt", !isPaidCheckout({ payment_status: "paid", metadata: { kind: "store_order" } }, "giving"));
check("registration session is not a store receipt", !isPaidCheckout(sessions.cs_test_regpaid, "store_order"));
check("paid giving session is a giving receipt", isPaidCheckout(sessions.cs_test_giving1, "giving"));

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
