// Checks for lib/checkinCode.ts (per-registrant check-in codes). No test
// framework is installed, so this is a plain Node script:
//
//   node scripts/check-checkin-code.mjs
//
// The module only imports node:crypto, so Node's type stripping loads the .ts
// directly. Exits 1 if any check fails.
process.env.REGISTRATION_SIGNING_SECRET = "check-script-only-secret";
delete process.env.STRIPE_SECRET_KEY;

const { checkinCodeFor, checkinCodesFor, normalizeCheckinCode, isWellFormedCheckinCode } = await import("../lib/checkinCode.ts");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

const FORMAT = /^CAC27-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/;

// 5,000 (ref, index) pairs: 1,000 registrations of 5 people each.
const codes = [];
for (let r = 0; r < 1000; r++) {
  const ref = crypto.randomUUID();
  for (let i = 0; i < 5; i++) codes.push(checkinCodeFor(ref, 2027, i));
}
check("5,000 codes, no duplicates", codes.length === 5000 && new Set(codes).size === 5000);
check("every code matches CAC27-XXXX-XXXX with no I, L, O or U", codes.every((c) => FORMAT.test(c) && !/[ILOU]/.test(c.slice(5))));
check("every code is well formed", codes.every(isWellFormedCheckinCode));

const ref = "3f2c5a1e-0000-4000-8000-000000000001";
const base = checkinCodeFor(ref, 2027, 0);
check("same inputs give the same code", checkinCodeFor(ref, 2027, 0) === base);
check("a different year changes the code (and its prefix)", checkinCodeFor(ref, 2028, 0) !== base && checkinCodeFor(ref, 2028, 0).startsWith("CAC28-"));
check("a different ref changes the code", checkinCodeFor(ref.replace(/1$/, "2"), 2027, 0) !== base);
check("a different index changes the code", checkinCodeFor(ref, 2027, 1) !== base);
check("checkinCodesFor gives one code per registrant in order",
  JSON.stringify(checkinCodesFor({ ref, year: 2027, registrants: [{}, {}] })) === JSON.stringify([base, checkinCodeFor(ref, 2027, 1)]));

const process2 = process.env.REGISTRATION_SIGNING_SECRET;
process.env.REGISTRATION_SIGNING_SECRET = "a-different-secret";
check("a different secret changes the code", checkinCodeFor(ref, 2027, 0) !== base);
delete process.env.REGISTRATION_SIGNING_SECRET;
let threw = false;
try { checkinCodeFor(ref, 2027, 0); } catch { threw = true; }
check("no secret configured: throws instead of using a fallback", threw);
process.env.REGISTRATION_SIGNING_SECRET = process2;

// Normalisation of typed input.
const body = base.slice(6).replace("-", "");
check("canonical code normalises to itself", normalizeCheckinCode(base) === base);
check("lowercase accepted", normalizeCheckinCode(base.toLowerCase()) === base);
check("missing hyphens accepted", normalizeCheckinCode(`CAC27${body}`) === base);
check("spaces accepted", normalizeCheckinCode(`  cac 27 ${body.slice(0, 4)} ${body.slice(4)} `) === base);
check("Crockford look-alikes read as digits (O as 0, I and L as 1)",
  normalizeCheckinCode("CAC27-OOOO-ILil") === "CAC27-0000-1111");
check("U, wrong length, wrong prefix and junk are rejected",
  [ "CAC27-UUUU-0000", "CAC27-0000-000", "CAC27-0000-00000", "XYZ27-0000-0000", "CAC2X-0000-0000", "", "CAC27-00!0-0000"]
    .every((s) => normalizeCheckinCode(s) === null));
check("isWellFormedCheckinCode rejects non-canonical forms",
  !isWellFormedCheckinCode(base.toLowerCase()) && !isWellFormedCheckinCode(`CAC27${body}`) && !isWellFormedCheckinCode("CAC27-OOOO-0000"));

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
