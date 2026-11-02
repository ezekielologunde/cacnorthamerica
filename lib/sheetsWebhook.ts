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

  fetch(hook, sheetRequest(formName, fields)).catch((e) => console.error(`[${formName}] Sheets webhook failed:`, e));
}

/** Awaited variant of logToSheet for a caller that must know whether the row
 *  landed (the Stripe webhook returns 500 so Stripe retries). Resolves true
 *  when the webhook accepted the row, or when SHEETS_WEBHOOK isn't configured
 *  (nothing to write); false on a network error, a non-2xx response, or a
 *  body other than {ok: true}. The Apps Script
 *  (docs/google-apps-script/sheets-webhook.gs) answers HTTP 200 with
 *  {ok: false, error} on a bad secret or a script error, so the status alone
 *  doesn't mean the row landed. Never throws. */
export async function logToSheetChecked(formName: string, fields: Record<string, string>): Promise<boolean> {
  const hook = process.env.SHEETS_WEBHOOK;
  if (!hook) return true;

  try {
    const res = await fetch(hook, sheetRequest(formName, fields));
    if (!res.ok) {
      console.error(`[${formName}] Sheets webhook returned ${res.status}`);
      return false;
    }
    let reply: unknown;
    try {
      reply = await res.json();
    } catch {
      console.error(`[${formName}] Sheets webhook returned a non-JSON body`);
      return false;
    }
    if ((reply as { ok?: unknown } | null)?.ok !== true) {
      console.error(`[${formName}] Sheets webhook rejected the row:`, (reply as { error?: unknown } | null)?.error);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`[${formName}] Sheets webhook failed:`, e);
    return false;
  }
}

function sheetRequest(formName: string, fields: Record<string, string>): RequestInit {
  const secret = process.env.SHEETS_WEBHOOK_SECRET;
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formName, ...(secret ? { secret } : {}), ...fields }),
  };
}
