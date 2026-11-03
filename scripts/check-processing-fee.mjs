// Checks for lib/processingFee.ts. No test framework is installed, so this
// is a plain Node script:
//
//   node scripts/check-processing-fee.mjs
//
// Node 24 strips TypeScript types natively. Exits 1 if any check fails.
const {
  feeCents, STRIPE_PERCENT_FEE, STRIPE_FIXED_FEE_CENTS, splitCheckoutAmount,
  bankFeeCents, feeCentsFor, feeLineItems, feeMetadataFor, BANK_FEE_CAP_CENTS, BANK_VERIFICATION_FEE_CENTS, BANK_MAX_CENTS,
} = await import("../lib/processingFee.ts");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

check("no fee on a $0 subtotal", feeCents(0) === 0);
check("no fee on a negative subtotal", feeCents(-500) === 0);

for (const subtotal of [500, 2500, 10000, 12345]) {
  const fee = feeCents(subtotal);
  const total = subtotal + fee;
  const stripeFee = Math.round(STRIPE_PERCENT_FEE * total) + STRIPE_FIXED_FEE_CENTS;
  const net = total - stripeFee;
  check(`fee for ${subtotal} is a non-negative integer (${fee})`, Number.isInteger(fee) && fee >= 0);
  check(`net after Stripe's fee on ${subtotal} is within 1 cent of the subtotal (net ${net})`, Math.abs(net - subtotal) <= 1);
}

const split = splitCheckoutAmount(10330, { processing_fee_cents: "330" });
check("a completed session splits back into subtotal and fee", split.subtotalCents === 10000 && split.processingFeeCents === 330);
const legacy = splitCheckoutAmount(5000, {});
check("a session without fee metadata reads as all subtotal", legacy.subtotalCents === 5000 && legacy.processingFeeCents === 0);
const bogus = splitCheckoutAmount(5000, { processing_fee_cents: "9999" });
check("fee metadata larger than the total is ignored", bogus.subtotalCents === 5000 && bogus.processingFeeCents === 0);

// Bank debit. These hold whatever the bank-fee policy is.
check("card is the default method", feeCentsFor(10000) === feeCents(10000) && feeCentsFor(10000, "card") === feeCents(10000));
check("no bank fee on a $0 or negative subtotal", bankFeeCents(0) === 0 && bankFeeCents(-500) === 0);
for (const subtotal of [100, 2500, 10000, 30000, 120000, BANK_MAX_CENTS]) {
  const fee = bankFeeCents(subtotal);
  check(`bank fee for ${subtotal} is a non-negative whole number (${fee})`, Number.isInteger(fee) && fee >= 0);
  check(`bank fee for ${subtotal} never exceeds the card fee`, fee <= feeCents(subtotal));
  check(`bank fee for ${subtotal} never exceeds Stripe's capped cost`, fee <= BANK_FEE_CAP_CENTS + BANK_VERIFICATION_FEE_CENTS);
}
check("a card fee line item matches feeCents", feeLineItems(10000, "card").length === 1 && feeLineItems(10000, "card")[0].price_data.unit_amount === feeCents(10000));
check("a zero bank fee adds no line item (Checkout rejects a zero line)", (bankFeeCents(10000) > 0) === (feeLineItems(10000, "bank").length === 1));
check("fee metadata records the method's fee", feeMetadataFor(10000, "bank").processing_fee_cents === String(bankFeeCents(10000)) && feeMetadataFor(10000, "card").processing_fee_cents === String(feeCents(10000)));
check("the bank gift ceiling is $10,000", BANK_MAX_CENTS === 1_000_000);

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
