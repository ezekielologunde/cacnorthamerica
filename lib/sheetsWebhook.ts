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
export function logToSheet(formName: string, fields: Record<string, string>): void {
  const hook = process.env.SHEETS_WEBHOOK;
  if (!hook) return;

  const secret = process.env.SHEETS_WEBHOOK_SECRET;
  fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formName, ...(secret ? { secret } : {}), ...fields }),
  }).catch((e) => console.error(`[${formName}] Sheets webhook failed:`, e));
}
