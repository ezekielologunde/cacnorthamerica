// Checks for the Zelle-first giving flow (lib/givingRequest.ts, lib/giving.ts
// zelleRecipientFor, lib/zelleReference.ts giftZelleReference, and the shape of
// the route and form). No test framework is installed, so this is a plain
// Node script:
//
//   node scripts/check-giving-zelle.mjs
//
// Node 24 strips TypeScript types natively. Exits 1 if any check fails.
import { readFileSync } from "node:fs";

process.env.REGISTRATION_SIGNING_SECRET = "check-giving-zelle-secret";

const { GIVING_CAMPAIGNS, zelleRecipientFor, purposeValuesBySlug, withPurpose } = await import("../lib/giving.ts");
const { validateGiftBasics, emailLimitKey, MIN_CENTS, MAX_CENTS } = await import("../lib/givingRequest.ts");
const { giftZelleReference, isWellFormedZelleReference, zelleReferenceFor } = await import("../lib/zelleReference.ts");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

// Which campaigns take Zelle.
const bySlug = Object.fromEntries(GIVING_CAMPAIGNS.map((c) => [c.slug, c]));
check("Village Pay Off takes Zelle", zelleRecipientFor(bySlug["village-payoff"]) === "cacna@hotmail.com");
check("Hope For All takes Zelle", zelleRecipientFor(bySlug["hope-for-all"]) === "charityfinancial8@gmail.com");
check("the Centenary project has no Zelle", zelleRecipientFor(bySlug["centenary"]) === null);

// Shared field validation.
const slugs = GIVING_CAMPAIGNS.map((c) => c.slug);
const good = { contactName: "Ada Obi", contactEmail: "ada@example.com", campaignSlug: "hope-for-all", amountCents: 5000 };
check("a valid gift passes", validateGiftBasics(good, slugs) === null);
check("a non-object body fails", validateGiftBasics(null, slugs) !== null && validateGiftBasics("x", slugs) !== null);
check("a missing name fails", validateGiftBasics({ ...good, contactName: "  " }, slugs) !== null);
check("a bad email fails", validateGiftBasics({ ...good, contactEmail: "nope" }, slugs) !== null);
check("an unknown campaign fails", validateGiftBasics({ ...good, campaignSlug: "other" }, slugs) !== null);
check("an amount below the minimum fails", validateGiftBasics({ ...good, amountCents: MIN_CENTS - 1 }, slugs) !== null);
check("an amount above the maximum fails", validateGiftBasics({ ...good, amountCents: MAX_CENTS + 1 }, slugs) !== null);
check("a fractional amount fails", validateGiftBasics({ ...good, amountCents: 1000.5 }, slugs) !== null);
check("a string amount fails", validateGiftBasics({ ...good, amountCents: "5000" }, slugs) !== null);

// Convention offering and its gift purposes.
const purposes = purposeValuesBySlug();
const conv = { ...good, campaignSlug: "convention-offering" };
check("the convention offering takes Zelle", zelleRecipientFor(bySlug["convention-offering"]) === "cacnaconvention@gmail.com");
check("offering purposes are regular and thanksgiving", JSON.stringify(purposes["convention-offering"]) === JSON.stringify(["regular", "thanksgiving"]));
check("a gift with no purpose still passes", validateGiftBasics(conv, slugs, purposes) === null);
check("a known purpose passes", validateGiftBasics({ ...conv, purpose: "thanksgiving" }, slugs, purposes) === null);
check("an unknown purpose fails", validateGiftBasics({ ...conv, purpose: "tithe" }, slugs, purposes) !== null);
check("a purpose on a campaign without any fails", validateGiftBasics({ ...good, purpose: "offering" }, slugs, purposes) !== null);
check("a non-string purpose fails", validateGiftBasics({ ...conv, purpose: 5 }, slugs, purposes) !== null);
check("the purpose label is appended to the campaign name", withPurpose(bySlug["convention-offering"].name, bySlug["convention-offering"], "thanksgiving") === "CACNA Offering — Thanksgiving");
check("campaign kinds are tithe, offering and project", GIVING_CAMPAIGNS.map((c) => c.kind).sort().join() === "offering,project,project,project,tithe");
check("the tithe has no Zelle, so it is given by card or bank", zelleRecipientFor(bySlug["tithe"]) === null && bySlug["tithe"].accounts.length === 0);
check("a tithe passes validation", validateGiftBasics({ ...good, campaignSlug: "tithe" }, slugs, purposes) === null);
check("the tithe takes no purpose", validateGiftBasics({ ...good, campaignSlug: "tithe", purpose: "regular" }, slugs, purposes) !== null);
check("no purpose leaves the name unchanged", withPurpose("X", bySlug["convention-offering"], undefined) === "X");

// Gift references.
const refA = giftZelleReference("11111111-1111-1111-1111-111111111111");
const refB = giftZelleReference("22222222-2222-2222-2222-222222222222");
check("a gift reference is a well-formed ZEL- code", isWellFormedZelleReference(refA));
check("a gift reference is stable for the same id", refA === giftZelleReference("11111111-1111-1111-1111-111111111111"));
check("different gifts get different references", refA !== refB);
check("a gift reference never equals a registration reference for the same text", refA !== zelleReferenceFor("11111111-1111-1111-1111-111111111111"));

// The per-address limit must not be dodgeable with aliases of one inbox.
check("a +tag does not change the limit key", emailLimitKey("Ada+1@Example.com") === emailLimitKey("ada@example.com"));
check("Gmail dots do not change the limit key", emailLimitKey("a.d.a@gmail.com") === emailLimitKey("ada@gmail.com"));
check("googlemail.com is the same inbox as gmail.com", emailLimitKey("ada@googlemail.com") === emailLimitKey("ada@gmail.com"));
check("dots still matter outside Gmail", emailLimitKey("a.da@example.com") !== emailLimitKey("ada@example.com"));
check("different people get different keys", emailLimitKey("ada@example.com") !== emailLimitKey("bola@example.com"));

// The campaign name used in emails and the ledger is a plain name, not a tagline.
check("every campaign has a plain name", GIVING_CAMPAIGNS.every((c) => typeof c.name === "string" && c.name.length > 0));
check("Hope For All is named as such, not by its tagline", bySlug["hope-for-all"].name === "Hope For All Initiative");

// The route, the form and the email, read as text.
const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");
const route = read("../app/api/giving/zelle/route.ts");
check("the Zelle route rejects a request without the site's form header", route.includes("if (!request.headers.get(FORM_HEADER))"));
check("the Zelle route limits by IP, by normalised inbox per day, and overall", route.includes("rateLimit(clientIp(request.headers)") && route.includes("emailLimitKey(contactEmail)") && route.includes("DAY_MS") && route.includes('"giving-zelle:all"'));
check("the Zelle route takes the recipient from the campaign, never the body", route.includes("const recipient = zelleRecipientFor(campaign);") && (route.match(/\brecipient\s*=/g) ?? []).length === 1 && !/\bbody\.recipient\b/.test(route));
check("the Zelle route refuses a campaign with no Zelle", route.includes("if (!recipient)") && route.includes("Zelle isn't available"));
check("the Zelle route rejects a web address in the name", route.includes("countLinks([body.contactName]) > 0"));
check("the Zelle route sends the donor email only through the record-first helper", route.includes("recordPledgeThenNotifyDonor(") && route.includes("if (!outcome.recorded)") && !route.includes("sendZelleGiftEmails"));
check("the Zelle route does not email the donor outside the helper", (route.match(/sendZelleDonorEmail\(/g) ?? []).length === 1 && route.includes("emailDonor: () => sendZelleDonorEmail(mail)"));
check("the Zelle route awaits the sheet write", route.includes("logToSheetChecked(") && !route.includes("logToSheet("));

const email = read("../lib/givingEmail.ts");
for (const field of ["contactName", "campaignTitle", "recipient", "zelleRef", "contactEmail"]) {
  check(`the Zelle emails escape ${field}`, email.includes(`escapeHtml(input.${field})`));
}
check("the committee subject is kept to one line", email.includes("oneLine("));

const form = read("../components/giving/GivingForm.tsx");
const order = (needle) => form.indexOf(needle);
check("the giving form lists Zelle before card and bank", order('["zelle"') !== -1 && order('["zelle"') < order('["card"') && order('["card"') < order('["bank"'));
check("the giving form defaults to Zelle", form.includes('useState<GiveMethod>("zelle")'));
check("the giving form falls back to card when a campaign has no Zelle", form.includes('method === "zelle" && (!zelleRecipient || repeating) ? "card" : method'));
check("the giving form sends card and bank the fallback-aware method", form.includes("paymentMethod: activeMethod"));
check("the giving form only lists Zelle for a campaign that has it", form.includes('value !== "zelle" || (zelleRecipient && !repeating)'));
check("the giving form moves focus to the Zelle result", form.includes("resultHeadingRef.current?.focus()"));
check("the giving form never claims the gift is complete before payment", !form.includes("is complete once"));

// Record first, then tell the donor: every failure combination, against fakes.
const { recordPledgeThenNotifyDonor } = await import("../lib/zellePledge.ts");
const TF = [true, false];
for (const sheet of TF) for (const committee of TF) for (const donor of TF) {
  const calls = [];
  const step = (name, ok) => async () => { calls.push(name); return ok; };
  const out = await recordPledgeThenNotifyDonor({
    recordInSheet: step("sheet", sheet),
    emailCommittee: step("committee", committee),
    emailDonor: step("donor", donor),
  });
  const recorded = sheet || committee;
  const label = `sheet=${sheet} committee=${committee} donor=${donor}`;
  check(`pledge outcome matches the records (${label})`, out.recorded === recorded);
  check(`donor is emailed only when the pledge is recorded (${label})`, calls.includes("donor") === recorded);
  if (recorded) check(`donor email goes out last (${label})`, calls[calls.length - 1] === "donor" && out.donorSent === donor);
}
{
  const out = await recordPledgeThenNotifyDonor({ recordInSheet: async () => { throw new Error("x"); }, emailCommittee: async () => false, emailDonor: async () => { throw new Error("donor must not run"); } });
  check("a throwing record step counts as failed and the donor is not emailed", out.recorded === false);
  const out2 = await recordPledgeThenNotifyDonor({ recordInSheet: async () => true, emailCommittee: async () => { throw new Error("x"); }, emailDonor: async () => { throw new Error("y"); } });
  check("a throwing donor email is reported as not sent, not as a failure", out2.recorded === true && out2.donorSent === false);
}

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed");
process.exitCode = failures ? 1 : 0;
