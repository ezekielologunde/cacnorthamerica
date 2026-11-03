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

const { GIVING_CAMPAIGNS, zelleRecipientFor } = await import("../lib/giving.ts");
const { validateGiftBasics, MIN_CENTS, MAX_CENTS } = await import("../lib/givingRequest.ts");
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

// Gift references.
const refA = giftZelleReference("11111111-1111-1111-1111-111111111111");
const refB = giftZelleReference("22222222-2222-2222-2222-222222222222");
check("a gift reference is a well-formed ZEL- code", isWellFormedZelleReference(refA));
check("a gift reference is stable for the same id", refA === giftZelleReference("11111111-1111-1111-1111-111111111111"));
check("different gifts get different references", refA !== refB);
check("a gift reference never equals a registration reference for the same text", refA !== zelleReferenceFor("11111111-1111-1111-1111-111111111111"));

// The route and the form, read as text.
const route = readFileSync(new URL("../app/api/giving/zelle/route.ts", import.meta.url), "utf8");
check("the Zelle route requires the site's form header", route.includes("FORM_HEADER"));
check("the Zelle route rate-limits by IP and by email", (route.match(/rateLimit\(/g) ?? []).length >= 2);
check("the Zelle route takes the recipient from the campaign, not the request", route.includes("zelleRecipientFor(campaign)") && !/rawBody[^;]*recipient/.test(route));
const form = readFileSync(new URL("../components/giving/GivingForm.tsx", import.meta.url), "utf8");
check("the giving form lists Zelle before card and bank", form.indexOf('["zelle"') !== -1 && form.indexOf('["zelle"') < form.indexOf('["card"') && form.indexOf('["card"') < form.indexOf('["bank"'));
check("the giving form defaults to Zelle", form.includes('useState<GiveMethod>("zelle")'));
check("the giving form falls back to card where Zelle isn't offered", form.includes("zelleRecipient") && form.includes('"card"'));

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
