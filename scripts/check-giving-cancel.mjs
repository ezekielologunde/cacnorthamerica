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
const { requestCancelLink, viewGifts, cancelWithToken, summarizeGift, stripeGiftOps, parseEmail, DONOR_CANCEL_COMMENT } = await import("../lib/givingCancel.ts");
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
function world({ customers = ["cus_A1"], gifts = [{ subscriptionId: "sub_1", customerId: "cus_A1", campaignTitle: "Tithe", frequencyLabel: "Monthly", amountLabel: "$100.00" }], owner = { sub_1: "cus_A1" } } = {}) {
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
  // Twelve customers for one address (Checkout makes one per gift); only the
  // oldest, last in Stripe's newest-first order, owns a live gift.
  const many = Array.from({ length: 12 }, (_, i) => `cus_N${i}`);
  const w = world({ customers: many, gifts: [{ subscriptionId: "sub_old", customerId: "cus_N11", campaignTitle: "Tithe", frequencyLabel: "Monthly", amountLabel: "$50.00" }], owner: { sub_old: "cus_N11" } });
  const out = await requestCancelLink("ada@example.com", w.deps, NOW);
  check("an old gift behind many gift-less customers still gets a link", out === "sent");
  check("the token holds only the customer that owns a gift", JSON.stringify(openCancelToken(w.log.sent[0].token, NOW + 1)) === JSON.stringify(["cus_N11"]));
  const w2 = world({
    customers: ["cus_A", "cus_B"],
    gifts: [
      { subscriptionId: "sub_a1", customerId: "cus_A", campaignTitle: "Tithe", frequencyLabel: "Monthly", amountLabel: "$10.00" },
      { subscriptionId: "sub_a2", customerId: "cus_A", campaignTitle: "Tithe", frequencyLabel: "Monthly", amountLabel: "$20.00" },
    ],
    owner: { sub_a1: "cus_A", sub_a2: "cus_A" },
  });
  await requestCancelLink("ada@example.com", w2.deps, NOW);
  check("a customer with two gifts appears once, and one without any is left out", JSON.stringify(openCancelToken(w2.log.sent[0].token, NOW + 1)) === JSON.stringify(["cus_A"]));
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
  const g = summarizeGift("sub_9", "cus_9", { kind: "giving", campaign_title: "Tithe", frequency: "biweekly", subtotal_cents: "2500" });
  check("a giving subscription becomes a gift with readable labels", g.subscriptionId === "sub_9" && g.customerId === "cus_9" && g.frequencyLabel === "Every 2 weeks" && g.amountLabel === "$25.00" && g.campaignTitle === "Tithe");
  check("a registration or store subscription is not a gift", summarizeGift("sub_1", "cus_1", { kind: "registration" }) === null && summarizeGift("sub_1", "cus_1", {}) === null && summarizeGift("sub_1", "cus_1", undefined) === null);
  const odd = summarizeGift("sub_1", "cus_1", { kind: "giving", subtotal_cents: "", frequency: "yearly" });
  check("missing or odd metadata gives empty labels, not a crash or $0.00", odd.amountLabel === "" && odd.frequencyLabel === "" && odd.campaignTitle === "");
}

// ---- The Stripe ops, run against a fake Stripe ----
function fakeStripe({ customers = [], subs = {}, listBy = {} } = {}) {
  const log = { cancel: [], retrieve: [], searches: [] };
  const iter = (items) => ({ async *[Symbol.asyncIterator]() { for (const i of items) yield i; } });
  const stripe = {
    customers: {
      // Exact, case-sensitive, like Stripe's list(email).
      list: ({ email }) => iter(customers.filter((c) => c.email === email)),
      // Case-insensitive, like Stripe's search.
      search: ({ query }) => { log.searches.push(query); const m = /^email:"(.*)"$/.exec(query); const e = m[1].replace(/\\(.)/g, "$1").toLowerCase(); return iter(customers.filter((c) => c.email.toLowerCase() === e)); },
    },
    subscriptions: {
      list: async ({ customer }) => ({ data: listBy[customer] ?? [] }),
      retrieve: async (id) => { log.retrieve.push(id); if (!subs[id]) throw Object.assign(new Error("no such"), { code: "resource_missing" }); return subs[id]; },
      cancel: async (id, params) => { log.cancel.push({ id, params }); if (subs[id]?.boom) throw new Error("stripe down"); },
    },
  };
  return { stripe, log };
}
const sub = (id, customer, status = "active", metadata = { kind: "giving", frequency: "monthly", subtotal_cents: "1000", campaign_title: "Tithe" }) => ({ id, customer, status, metadata });
{
  const { stripe } = fakeStripe({ customers: [{ id: "cus_1", email: "Ada@Example.com" }, { id: "cus_2", email: "ada@example.com" }, { id: "cus_3", email: "other@example.com" }] });
  const ops = stripeGiftOps(stripe);
  const ids = await ops.findCustomers(["ada@example.com"]);
  check("a customer stored with different casing is found, alongside the exact match, once each", ids.length === 2 && ids.includes("cus_1") && ids.includes("cus_2"));
  check("a stranger's customer is not returned", !ids.includes("cus_3"));
  const many = fakeStripe({ customers: Array.from({ length: 80 }, (_, i) => ({ id: `cus_${i}`, email: "ada@example.com" })) });
  check("the lookup is bounded", (await stripeGiftOps(many.stripe).findCustomers(["ada@example.com"])).length === 50);
  const q = fakeStripe({ customers: [] });
  await stripeGiftOps(q.stripe).findCustomers(['a"b\\c@x.co']);
  check("quotes and backslashes in the address cannot break out of the search query", q.log.searches[0] === 'email:"a\\"b\\\\c@x.co"');
}
{
  const { stripe } = fakeStripe({
    listBy: {
      cus_1: [sub("sub_a", "cus_1"), sub("sub_c", "cus_1", "canceled"), sub("sub_s", "cus_1", "active", { kind: "registration" }), sub("sub_i", "cus_1", "incomplete"), sub("sub_x", "cus_1", "incomplete_expired")],
      cus_2: [sub("sub_p", "cus_2", "past_due")],
    },
  });
  const gifts = await stripeGiftOps(stripe).listGifts(["cus_1", "cus_2"]);
  check("live recurring gifts are listed with their owner (active, bank-processing, past due)", gifts.map((g) => g.subscriptionId).sort().join() === "sub_a,sub_i,sub_p" && gifts.find((g) => g.subscriptionId === "sub_p").customerId === "cus_2");
  check("cancelled, expired and non-giving subscriptions are not listed", !gifts.some((g) => ["sub_c", "sub_x", "sub_s"].includes(g.subscriptionId)));
}
{
  const mk = () => fakeStripe({ subs: { sub_mine: sub("sub_mine", "cus_1"), sub_theirs: sub("sub_theirs", "cus_9"), sub_reg: sub("sub_reg", "cus_1", "active", { kind: "registration" }), sub_done: sub("sub_done", "cus_1", "canceled"), sub_boom: { ...sub("sub_boom", "cus_1"), boom: true } } });
  const a = mk();
  const ops = stripeGiftOps(a.stripe);
  check("an owned giving subscription is cancelled with the donor's comment", (await ops.cancelGift("sub_mine", ["cus_1"])) === "cancelled" && a.log.cancel.length === 1 && a.log.cancel[0].params.cancellation_details.comment === DONOR_CANCEL_COMMENT);
  check("a subscription owned by someone else is not found and never cancelled", (await ops.cancelGift("sub_theirs", ["cus_1"])) === "not_found" && a.log.cancel.length === 1);
  check("a non-giving subscription of the donor's own customer is not cancelled", (await ops.cancelGift("sub_reg", ["cus_1"])) === "not_found" && a.log.cancel.length === 1);
  check("an already-cancelled gift is reported cancelled without another cancel call", (await ops.cancelGift("sub_done", ["cus_1"])) === "cancelled" && a.log.cancel.length === 1);
  check("a subscription that does not exist is not found", (await ops.cancelGift("sub_gone", ["cus_1"])) === "not_found");
  let threw = false;
  try { await ops.cancelGift("sub_boom", ["cus_1"]); } catch { threw = true; }
  check("any other Stripe error propagates (so the route answers 500)", threw);
}
check("parseEmail trims, lowercases and refuses junk", parseEmail("  Ada@Example.com ")?.lower === "ada@example.com" && parseEmail("  Ada@Example.com ")?.typed === "Ada@Example.com" && parseEmail("nope") === null && parseEmail(7) === null);

// ---- Shape of the routes and the stripe wiring ----
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
{
  const confirm = read("app/api/giving/cancel/confirm/route.ts");
  const request = read("app/api/giving/cancel/request/route.ts");
  check("the cancel route accepts POST only (a GET, such as a mail scanner's, cannot cancel)", /export async function POST/.test(confirm) && !/export (async )?function GET/.test(confirm) && !/export (async )?function GET/.test(request));
  check("both routes need the site's form header and are rate limited", [confirm, request].every((s) => s.includes("FORM_HEADER") && s.includes("rateLimit(")));
  check("the link request is Turnstile-checked and limited per inbox", request.includes("verifyTurnstile") && request.includes("emailLimitKey"));
  check("the request route answers before any Stripe work (lookup and email run in after())", request.includes("after(async") && /after\(async[\s\S]*requestCancelLink[\s\S]*\}\);\s*return NextResponse\.json\(\{ ok: true \}\)/.test(request) && !request.includes("const outcome"));
  check("a donor's cancel is not tagged as the code's own (so the ended-gift handler confirms it)", DONOR_CANCEL_COMMENT === "donor:self-service" && !DONOR_CANCEL_COMMENT.startsWith("auto:"));
  const page = read("app/(site)/[locale]/giving/cancel/page.tsx");
  check("opening the page never cancels (no cancel call on the server render)", !page.includes("cancelWithToken") && !page.includes("cancelGift"));
  check("the page is kept out of search and sends no referrer when a token is in the URL", page.includes("index: false") && page.includes('referrer: "no-referrer"') && page.includes("t ? {"));
}

if (failures > 0) {
  console.log(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll checks passed.");
