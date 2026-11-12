// Checks lib/network.json, the shared CAC web-family data, and (optionally)
// that other repos' copies are byte-identical:
//
//   node scripts/check-network.mjs [path/to/another/network.json ...]
//
// Exits 1 if any check fails. Plain Node script, no framework.
import { readFileSync } from "node:fs";

const norm = (s) => s.split("\r\n").join("\n"); // Git may convert line endings on Windows
const raw = norm(readFileSync(new URL("../lib/network.json", import.meta.url), "utf8"));
const net = JSON.parse(raw);

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}
const unique = (xs) => new Set(xs).size === xs.length;
const isHttps = (u) => { try { return new URL(u).protocol === "https:"; } catch { return false; } };

check("version is a positive integer", Number.isInteger(net.version) && net.version > 0);
check("site ids are unique", unique(net.sites.map((s) => s.id)));
check("all five network sites are present",
  ["cacna", "yyam", "salvation-center", "ilorin", "city"].every((id) => net.sites.some((s) => s.id === id)));
check("every URL is https", [...net.sites, ...net.media].every((x) => isHttps(x.url)));
check("no preview-host (vercel.app) URLs", ![...net.sites, ...net.media].some((x) => /vercel\.app/.test(x.url)));
check("site URLs have no trailing slash", net.sites.every((s) => !s.url.endsWith("/")));
check("cacna is on cacna.org and yyam under it",
  net.sites.find((s) => s.id === "cacna")?.url === "https://cacna.org" &&
  net.sites.find((s) => s.id === "yyam")?.url === "https://yyam.cacna.org");
check("every site has a name and a role", net.sites.every((s) => s.name && s.role));
const known = (id) => net.sites.some((s) => s.id === id);
check("every relationship joins two known sites", net.relationships.every((r) => known(r.from) && known(r.to) && r.from !== r.to));
check("every person works for a known site", net.people.every((p) => known(p.worksFor)));
check("every media host is a known person",
  net.media.every((m) => !m.host || net.people.some((p) => p.id === m.host)));
check("every media item belongs to a known site", net.media.every((m) => net.sites.some((s) => s.id === m.site)));
check("no placeholder text left in values", !/TODO|TBD|lorem/i.test(raw));

for (const other of process.argv.slice(2)) {
  let theirs = null;
  try { theirs = norm(readFileSync(other, "utf8")); } catch { /* reported below */ }
  check(`copy is identical (ignoring line endings): ${other}`, theirs !== null && theirs === raw);
}

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nAll checks passed");
