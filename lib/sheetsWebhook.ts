/** Fire-and-forget POST to the shared Google Sheets webhook (same
 *  SHEETS_WEBHOOK env var and {formName, ...fields} shape app/api/contact
 *  already uses) — the Apps Script behind it routes to a sheet/tab by
 *  formName. No-ops silently if the env var isn't configured, matching this
 *  app's existing convention of every optional integration degrading
 *  gracefully rather than failing the request.
 *
 *  SHEETS_WEBHOOK_SECRET must match the Apps Script WEBHOOK_SECRET before
 *  writing any row. The receiver fails closed when the secret is missing. The
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

  fetch(hook, sheetRequest(formName, fields)).catch((e) => console.error(`[${formName}] Sheets webhook failed:`, e));
}

/** Awaited variant of logToSheet for a caller that must know whether the row
 *  landed (the Stripe webhook returns 500 so Stripe retries). Resolves true
 *  when the webhook accepted the row; false when the URL or secret is missing,
 *  on a network error, a non-2xx response, or a
 *  body other than {ok: true}. The Apps Script
 *  (docs/google-apps-script/sheets-webhook.gs) answers HTTP 200 with
 *  {ok: false, error} on a bad secret or a script error, so the status alone
 *  doesn't mean the row landed. Never throws. */
export async function logToSheetChecked(formName: string, fields: Record<string, string>, idempotencyKey?: string): Promise<boolean> {
  const hook = process.env.SHEETS_WEBHOOK;
  if (!hook || !process.env.SHEETS_WEBHOOK_SECRET) {
    console.error(`[${formName}] Sheets webhook URL or secret is not configured`);
    return false;
  }

  try {
    const res = await fetch(hook, sheetRequest(formName, fields, idempotencyKey));
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
    // An old receiver answers {ok:true} without enforcing dedupe. Do not
    // acknowledge a paid row until the receiver confirms the persisted key.
    if (idempotencyKey && (reply as { idempotencyKey?: unknown }).idempotencyKey !== idempotencyKey) {
      console.error(`[${formName}] Sheets webhook did not confirm the idempotency key`);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`[${formName}] Sheets webhook failed:`, e);
    return false;
  }
}

function sheetRequest(formName: string, fields: Record<string, string>, idempotencyKey?: string): RequestInit {
  const safeFields: Record<string, string> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (["secret", "formName", "idempotencyKey", "Idempotency Key"].includes(k)) continue;
    safeFields[sheetSafe(k)] = sheetSafe(String(v));
  }

  // Transport fields go last and cannot be supplied through form fields.
  const secret = process.env.SHEETS_WEBHOOK_SECRET;
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...safeFields, formName, ...(secret ? { secret } : {}), ...(idempotencyKey ? { idempotencyKey } : {}) }),
    signal: AbortSignal.timeout(10_000),
  };
}
