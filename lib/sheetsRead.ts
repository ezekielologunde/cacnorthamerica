/** Read-back counterpart to lib/sheetsWebhook.ts's write-only logToSheet().
 *  The same Apps Script Web App now also serves GET requests (added
 *  2026-09-06) -- doGet() checks the same WEBHOOK_SECRET script property
 *  this app already sends as SHEETS_WEBHOOK_SECRET, and returns every
 *  sheet tab (skipping the default blank "Sheet1") as { [tabName]: row[] },
 *  where each row is a plain object keyed by that tab's own header row.
 *  Tabs are created dynamically per formName by the write path, so this
 *  return shape isn't a fixed schema -- callers should treat unknown tabs
 *  and unknown columns as normal, not an error. */
export type SheetRow = Record<string, string | number>;
export type AllSheets = Record<string, SheetRow[]>;

export async function getAllSheets(): Promise<AllSheets | null> {
  const hook = process.env.SHEETS_WEBHOOK;
  const secret = process.env.SHEETS_WEBHOOK_SECRET;
  if (!hook) return null;

  try {
    const url = new URL(hook);
    if (secret) url.searchParams.set("secret", secret);
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json() as { ok: boolean; sheets?: AllSheets; error?: string };
    if (!data.ok || !data.sheets) {
      console.error("[sheetsRead] Apps Script returned an error:", data.error);
      return null;
    }
    return data.sheets;
  } catch (err) {
    console.error("[sheetsRead] fetch failed:", err);
    return null;
  }
}
