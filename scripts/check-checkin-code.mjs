// Checks for lib/checkinCode.ts (per-registrant check-in codes). No test
// framework is installed, so this is a plain Node script:
//
//   node scripts/check-checkin-code.mjs
//
// The module only imports node:crypto, so Node's type stripping loads the .ts
// directly. Exits 1 if any check fails.
process.env.REGISTRATION_SIGNING_SECRET = "check-script-only-secret";
delete process.env.STRIPE_SECRET_KEY;

const { checkinCodeFor, checkinCodesFor, checkinCodeSheetCell, normalizeCheckinCode, isWellFormedCheckinCode } = await import("../lib/checkinCode.ts");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

const FORMAT = /^[0-9A-HJKMNP-TV-Z]{4}$/;
const people = (n) => Array.from({ length: n }, (_, i) => ({ n: `Person ${i}` }));

// 1,000 registrations of 5 people each.
const perRegistration = [];
for (let r = 0; r < 1000; r++) perRegistration.push(checkinCodesFor({ ref: crypto.randomUUID(), year: 2027, registrants: people(5) }));
const codes = perRegistration.flat();
check("every code is four characters with no I, L, O or U", codes.length === 5000 && codes.every((c) => FORMAT.test(c) && !/[ILOU]/.test(c)));
check("every code is well formed", codes.every(isWellFormedCheckinCode));
check("codes inside each registration are distinct", perRegistration.every((cs) => new Set(cs).size === cs.length));
check("codes are spread across the code space (5,000 codes, under 1% repeats)", new Set(codes).size > 4950);

const ref = "3f2c5a1e-0000-4000-8000-000000000001";
const base = checkinCodeFor(ref, 2027, 0);
check("same inputs give the same code", checkinCodeFor(ref, 2027, 0) === base);
check("a different year changes the code", checkinCodeFor(ref, 2028, 0) !== base);
check("a different ref changes the code", checkinCodeFor(ref.replace(/1$/, "2"), 2027, 0) !== base);
check("a different index changes the code", checkinCodeFor(ref, 2027, 1) !== base);
check("a different counter changes the code", checkinCodeFor(ref, 2027, 0, 1) !== base);
check("checkinCodesFor gives one code per registrant in order",
  JSON.stringify(checkinCodesFor({ ref, year: 2027, registrants: [{}, {}] })) === JSON.stringify([base, checkinCodeFor(ref, 2027, 1)]));
check("checkinCodesFor is stable across calls (page, email and sheet agree)",
  JSON.stringify(checkinCodesFor({ ref, year: 2027, registrants: people(8) })) === JSON.stringify(checkinCodesFor({ ref, year: 2027, registrants: people(8) })));

// Collisions inside one registration: 5,000 people make raw (counter 0)
// candidates repeat for this fixed secret and ref, and checkinCodesFor
// re-derives each repeat with a higher counter until it is distinct.
const big = { ref: "collision-ref", year: 2027, registrants: people(5000) };
const raw = big.registrants.map((_, i) => checkinCodeFor(big.ref, big.year, i));
const shown = checkinCodesFor(big);
const bumped = shown.map((c, i) => i).filter((i) => shown[i] !== raw[i]);
check("raw counter-0 candidates do collide in this registration (the case under test)", new Set(raw).size < raw.length);
check("colliding registrants still get distinct codes", new Set(shown).size === shown.length && shown.every(isWellFormedCheckinCode));
check("a repeat is replaced by the same person's next counter candidate",
  bumped.length > 0 && bumped.every((i) => [1, 2, 3, 4].some((k) => shown[i] === checkinCodeFor(big.ref, big.year, i, k))));
check("non-colliding registrants keep their counter-0 code", shown.every((c, i) => bumped.includes(i) || c === raw[i]));
check("collision handling is deterministic", JSON.stringify(checkinCodesFor(big)) === JSON.stringify(shown));

const pair = { ref, year: 2027, registrants: [{ n: "Ada Young" }, { n: "Ben Kid" }] };
const pairCodes = checkinCodesFor(pair);
check("sheet cell pairs each code with its person's name, in order",
  checkinCodeSheetCell(pair) === `Ada Young: ${pairCodes[0]}; Ben Kid: ${pairCodes[1]}`);

const savedSecret = process.env.REGISTRATION_SIGNING_SECRET;
process.env.REGISTRATION_SIGNING_SECRET = "a-different-secret";
check("a different secret changes the code", checkinCodeFor(ref, 2027, 0) !== base);
delete process.env.REGISTRATION_SIGNING_SECRET;
let threw = false;
try { checkinCodeFor(ref, 2027, 0); } catch { threw = true; }
check("no secret configured: throws instead of using a fallback", threw);
process.env.REGISTRATION_SIGNING_SECRET = savedSecret;

// Normalisation of typed input.
check("canonical code normalises to itself", normalizeCheckinCode(base) === base);
check("lowercase accepted", normalizeCheckinCode(base.toLowerCase()) === base);
check("spaces and a hyphen accepted", normalizeCheckinCode(`  ${base.slice(0, 2).toLowerCase()} -${base.slice(2)} `) === base);
check("Crockford look-alikes read as digits (O as 0, I and L as 1)",
  normalizeCheckinCode("OIlo") === "0110" && normalizeCheckinCode("o l i 7") === "0117");
check("U, wrong length and junk are rejected",
  ["UUUU", "7K3", "7K3QX", "", "7K!Q", "7K3U"].every((s) => normalizeCheckinCode(s) === null));
check("isWellFormedCheckinCode rejects non-canonical forms",
  !isWellFormedCheckinCode("7k3q") && !isWellFormedCheckinCode("7K-3Q") && !isWellFormedCheckinCode("OOOO") && !isWellFormedCheckinCode("7K3QX"));

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
