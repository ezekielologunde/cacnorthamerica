/** Fire-and-forget POST to the shared Google Sheets webhook (same
 *  SHEETS_WEBHOOK env var and {formName, ...fields} shape app/api/contact
 *  already uses) — the Apps Script behind it routes to a sheet/tab by
 *  formName. No-ops silently if the env var isn't configured, matching this
 *  app's existing convention of every optional integration degrading
 *  gracefully rather than failing the request. */
export function logToSheet(formName: string, fields: Record<string, string>): void {
  const hook = process.env.SHEETS_WEBHOOK;
  if (!hook) return;

  fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formName, ...fields }),
  }).catch((e) => console.error(`[${formName}] Sheets webhook failed:`, e));
}
