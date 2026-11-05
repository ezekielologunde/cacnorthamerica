// Checks for the self-service cancel of a recurring gift: lib/cancelToken.ts
// (the sealed emailed link) and lib/givingCancel.ts (the flow). Plain Node
// script:
//
//   node scripts/check-giving-cancel.mjs
//
// Node 24 strips TypeScript types natively. Exits 1 if any check fails.
import { readFileSync } from "node:fs";

process.env.REGISTRATION_SIGNING_SECRET = "check-giving-cancel-secret";

const { sealCancelToken, openCancelToken, CANCEL_TOKEN_TTL_MS, MAX_CANCEL_CUSTOMERS } = await import("../lib/cancelToken.ts");
const { requestCancelLink, viewGifts, cancelWithToken, summarizeGift } = await import("../lib/givingCancel.ts");
const { sealRegistrationToken, openRegistrationToken } = await import("../lib/registrationToken.ts");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

const NOW = 1_800_000_000_000;

// ---- The token ----
{
  const t = sealCancelToken(["cus_A1", "cus_B2"], NOW);
  check("a token opens to the customers it was sealed for", JSON.stringify(openCancelToken(t, NOW + 1000)) === JSON.stringify(["cus_A1", "cus_B2"]));
  check("the token does not show a customer id in the URL", !t.includes("cus_") && !Buffer.from(t, "base64url").toString("latin1").includes("cus_A1"));
  check("a token works right up to its expiry", openCancelToken(t, NOW + CANCEL_TOKEN_TTL_MS) !== null);
  check("a token is dead one millisecond after its expiry", openCancelToken(t, NOW + CANCEL_TOKEN_TTL_MS + 1) === null);
  const flipped = t.slice(0, 20) + (t[20] === "A" ? "B" : "A") + t.slice(21);
  check("an edited token fails to open", openCancelToken(flipped, NOW) === null);
  check("a truncated token fails to open", openCancelToken(t.slice(0, 30), NOW) === null);
  check("garbage and non-strings fail to open", openCancelToken("", NOW) === null && openCancelToken("not a token", NOW) === null && openCancelToken(undefined, NOW) === null && openCancelToken("x".repeat(3000), NOW) === null);
  check("a token sealed for another purpose does not open here", openCancelToken(sealRegistrationToken({ c: ["cus_A1"], x: NOW + 5000 }), NOW) === null);
  check("and a cancel token does not open as a registration", openRegistrationToken(t) === null);
  check("a long customer list is capped", openCancelToken(sealCancelToken(Array.from({ length: 30 }, (_, i) => `cus_${i}`), NOW), NOW).length === MAX_CANCEL_CUSTOMERS);
  check("no customers cannot be sealed into a usable token", openCancelToken(sealCancelToken([], NOW), NOW) === null);
  check("a customer id of the wrong shape is rejected", openCancelToken(sealCancelToken(["cus_ok", "sub_not_a_customer"], NOW), NOW) === null);
  const other = (process.env.REGISTRATION_SIGNING_SECRET = "a-different-secret", openCancelToken(t, NOW));
  process.env.REGISTRATION_SIGNING_SECRET = "check-giving-cancel-secret";
  check("a token does not open under a different server secret", other === null);
}

// ---- Fake world ----
function world({ customers = ["cus_A1"], gifts = [{ subscriptionId: "sub_1", campaignTitle: "Tithe", frequencyLabel: "Monthly", amountLabel: "$100.00" }], owner = { sub_1: "cus_A1" } } = {}) {
  const log = { lookups: [], sent: [], cancelled: [], cancelCalls: [] };
  return {
    log,
    deps: {
      findCustomers: async (emails) => { log.lookups.push(emails); return customers; },
      listGifts: async (ids) => gifts.filter((g) => ids.includes(owner[g.subscriptionId])),
      cancelGift: async (subId, ids) => {
        log.cancelCalls.push({ subId, ids });
        if (!ids.includes(owner[subId])) return "not_found";
        log.cancelled.push(subId);
        return "cancelled";
      },
      sealToken: (ids, now) => sealCancelToken(ids, now),
      openToken: (token, now) => openCancelToken(token, now),
      sendLink: async (m) => { log.sent.push(m); return true; },
    },
  };
}

// ---- Asking for a link ----
{
  const w = world();
  check("an invalid email is refused, with nothing looked up", (await requestCancelLink("nope", w.deps, NOW)) === "invalid" && w.log.lookups.length === 0);
  check("blank, non-string and oversized emails are refused", (await requestCancelLink("", w.deps, NOW)) === "invalid" && (await requestCancelLink(undefined, w.deps, NOW)) === "invalid" && (await requestCancelLink(`${"a".repeat(250)}@b.co`, w.deps, NOW)) === "invalid" && w.log.lookups.length === 0);
  const out = await requestCancelLink("  Ada@Example.com ", w.deps, NOW);
  check("a donor with a recurring gift is sent a link", out === "sent" && w.log.sent.length === 1);
  check("the email goes to the lowercased address, with the gifts listed", w.log.sent[0].email === "ada@example.com" && w.log.sent[0].gifts.length === 1);
  check("both spellings of the address are looked up in Stripe", JSON.stringify(w.log.lookups[0]) === JSON.stringify(["Ada@Example.com", "ada@example.com"]));
  check("the emailed token opens to that donor's customers", JSON.stringify(openCancelToken(w.log.sent[0].token, NOW + 1)) === JSON.stringify(["cus_A1"]));
  const w2 = world();
  await requestCancelLink("ada@example.com", w2.deps, NOW);
  check("an already-lowercase address is looked up once", w2.log.lookups[0].length === 1);
}
{
  const w = world({ customers: [] });
  check("an address with no Stripe customer sends nothing", (await requestCancelLink("who@example.com", w.deps, NOW)) === "none" && w.log.sent.length === 0);
  const w2 = world({ gifts: [] });
  check("customers with no recurring gift send nothing", (await requestCancelLink("who@example.com", w2.deps, NOW)) === "none" && w2.log.sent.length === 0);
}
{
  const w = world();
  w.deps.sendLink = async () => false;
  check("a failed send is reported as failed", (await requestCancelLink("ada@example.com", w.deps, NOW)) === "failed");
  const w2 = world();
  w2.deps.findCustomers = async () => { throw new Error("stripe down"); };
  check("a Stripe error is reported as failed, not thrown", (await requestCancelLink("ada@example.com", w2.deps, NOW)) === "failed");
}

// ---- Opening the link ----
{
  const w = world();
  const token = sealCancelToken(["cus_A1"], NOW);
  const v = await viewGifts(token, w.deps, NOW + 1000);
  check("opening the link lists the donor's gifts and cancels nothing", v.state === "ok" && v.gifts.length === 1 && w.log.cancelCalls.length === 0);
  check("an expired link says so", (await viewGifts(token, w.deps, NOW + CANCEL_TOKEN_TTL_MS + 1)).state === "expired");
  check("a forged or missing link says expired", (await viewGifts("junk", w.deps, NOW)).state === "expired" && (await viewGifts(undefined, w.deps, NOW)).state === "expired");
  const w2 = world();
  w2.deps.listGifts = async () => { throw new Error("stripe down"); };
  check("a Stripe error on the page is a failed state", (await viewGifts(token, w2.deps, NOW)).state === "failed");
}

// ---- Cancelling ----
{
  const w = world({ owner: { sub_1: "cus_A1", sub_2: "cus_OTHER" } });
  const token = sealCancelToken(["cus_A1"], NOW);
  check("the donor's own gift is cancelled", (await cancelWithToken(token, "sub_1", w.deps, NOW + 1)) === "cancelled" && w.log.cancelled[0] === "sub_1");
  check("the cancel is scoped to the customers in the token", JSON.stringify(w.log.cancelCalls[0].ids) === JSON.stringify(["cus_A1"]));
  check("another donor's gift is not found, and not cancelled", (await cancelWithToken(token, "sub_2", w.deps, NOW + 1)) === "not_found" && !w.log.cancelled.includes("sub_2"));
  check("an expired link cancels nothing", (await cancelWithToken(token, "sub_1", w.deps, NOW + CANCEL_TOKEN_TTL_MS + 1)) === "expired" && w.log.cancelCalls.length === 2);
  check("a forged link cancels nothing", (await cancelWithToken("junk", "sub_1", w.deps, NOW)) === "expired" && w.log.cancelCalls.length === 2);
  for (const bad of [undefined, "", "cus_A1", "sub_", "sub_1/../x", "sub_1 ", 5, null, "sub_1\n"]) {
    check(`a malformed subscription id (${JSON.stringify(bad)}) never reaches Stripe`, (await cancelWithToken(token, bad, w.deps, NOW)) === "not_found");
  }
  check("no malformed id produced a Stripe call", w.log.cancelCalls.length === 2);
  const w2 = world();
  w2.deps.cancelGift = async () => { throw new Error("stripe down"); };
  check("a Stripe error while cancelling is reported as failed", (await cancelWithToken(token, "sub_1", w2.deps, NOW)) === "failed");
}

// ---- Which subscriptions count as gifts ----
{
  const g = summarizeGift("sub_9", { kind: "giving", campaign_title: "Tithe", frequency: "biweekly", subtotal_cents: "2500" });
  check("a giving subscription becomes a gift with readable labels", g.subscriptionId === "sub_9" && g.frequencyLabel === "Every 2 weeks" && g.amountLabel === "$25.00" && g.campaignTitle === "Tithe");
  check("a registration or store subscription is not a gift", summarizeGift("sub_1", { kind: "registration" }) === null && summarizeGift("sub_1", {}) === null && summarizeGift("sub_1", undefined) === null);
  const odd = summarizeGift("sub_1", { kind: "giving", subtotal_cents: "", frequency: "yearly" });
  check("missing or odd metadata gives empty labels, not a crash or $0.00", odd.amountLabel === "" && odd.frequencyLabel === "" && odd.campaignTitle === "");
}

// ---- Shape of the routes and the stripe wiring ----
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
{
  const confirm = read("app/api/giving/cancel/confirm/route.ts");
  const request = read("app/api/giving/cancel/request/route.ts");
  check("the cancel route accepts POST only (a GET, such as a mail scanner's, cannot cancel)", /export async function POST/.test(confirm) && !/export (async )?function GET/.test(confirm) && !/export (async )?function GET/.test(request));
  check("both routes need the site's form header and are rate limited", [confirm, request].every((s) => s.includes("FORM_HEADER") && s.includes("rateLimit(")));
  check("the link request is Turnstile-checked and limited per inbox", request.includes("verifyTurnstile") && request.includes("emailLimitKey"));
  check("the request route answers every well-formed request the same way", request.includes('if (outcome === "invalid")') && request.split("return NextResponse.json({ ok: true })").length === 2);
  const stripe = read("lib/givingCancelStripe.ts");
  check("a donor's cancel is not tagged as the code's own (so the ended-gift handler confirms it)", stripe.includes('DONOR_CANCEL_COMMENT = "donor:self-service"') && !/DONOR_CANCEL_COMMENT = "auto:/.test(stripe));
  check("the cancel checks the gift is a giving subscription owned by a token customer", stripe.includes("customerIds.includes(owner)") && stripe.includes('metadata?.kind !== "giving"'));
  const page = read("app/(site)/[locale]/giving/cancel/page.tsx");
  check("opening the page never cancels (no cancel call on the server render)", !page.includes("cancelWithToken") && !page.includes("cancelGift"));
  check("the page is kept out of search and sends no referrer", page.includes("index: false") && page.includes('referrer: "no-referrer"'));
}

if (failures > 0) {
  console.log(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll checks passed.");
