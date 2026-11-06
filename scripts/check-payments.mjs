// Offline payment regression gate. Each child has mocked or pure dependencies.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const checks = [
  "check-processing-fee", "check-register-route", "check-payment-confirmation",
  "check-webhook-dedupe", "check-giving-recurring", "check-giving-recurring-checkout",
  "check-giving-recurring-route", "check-giving-invoice", "check-giving-problem",
  "check-giving-cancel", "check-giving-zelle", "check-zelle-registration",
];
for (const check of checks) {
  console.log(`\n=== ${check} ===`);
  const run = spawnSync(process.execPath, [fileURLToPath(new URL(`./${check}.mjs`, import.meta.url))], { stdio: "inherit" });
  if (run.status !== 0) process.exit(run.status ?? 1);
}
console.log("\nAll offline payment checks passed.");
