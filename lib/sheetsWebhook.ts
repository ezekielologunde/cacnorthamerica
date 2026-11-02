/** Fire-and-forget POST to the shared Google Sheets webhook (same
 *  SHEETS_WEBHOOK env var and {formName, ...fields} shape app/api/contact
 *  already uses) — the Apps Script behind it routes to a sheet/tab by
 *  formName. No-ops silently if the env var isn't configured, matching this
 *  app's existing convention of every optional integration degrading
 *  gracefully rather than failing the request.
 *
 *  SHEETS_WEBHOOK_SECRET is optional too -- when set, it's sent alongside
 *  every payload and the Apps Script checks it before writing a row. The
 *  Web App URL itself has no other access control (Apps Script web apps
 *  can't require Google auth and still accept unauthenticated POSTs from a
 *  server), so this is what stops someone who finds the URL from writing
 *  arbitrary rows into the sheet directly. */

/** Google Sheets runs a cell that starts with =, +, - or @ as a formula (tab
 *  and CR are used to smuggle them past naive checks), so a form value like
 *  =HYPERLINK(...) built from other tabs would run next to every
 *  registrant's details. A leading apostrophe makes Sheets keep it as plain
 *  text and is itself hidden in the cell. The Apps Script
 *  (docs/google-apps-script/sheets-webhook.gs) applies the same rule; this
 *  is the server-side half. */
const FORMULA_START = /^[=+\-@\t\r]/;

export function sheetSafe(value: string): string {
  return FORMULA_START.test(value) ? `'${value}` : value;
}

export function logToSheet(formName: string, fields: Record<string, string>): void {
  const hook = process.env.SHEETS_WEBHOOK;
  if (!hook) return;

  const safeFields: Record<string, string> = {};
  for (const [k, v] of Object.entries(fields)) safeFields[sheetSafe(k)] = sheetSafe(String(v));

  // formName and secret go last so no field can override them.
  const secret = process.env.SHEETS_WEBHOOK_SECRET;
  fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...safeFields, formName, ...(secret ? { secret } : {}) }),
  }).catch((e) => console.error(`[${formName}] Sheets webhook failed:`, e));
}
