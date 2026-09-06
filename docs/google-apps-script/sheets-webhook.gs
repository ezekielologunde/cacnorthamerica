/**
 * CACNA form -> Google Sheets webhook.
 *
 * This is a Google Apps Script, NOT part of the Next.js app -- it runs
 * inside a Google Sheet you own, under your own Google account, and has
 * nothing to do with Vercel or this repo's build. Deployed as a Web App, it
 * gives you a URL that the site's server-side routes POST form submissions
 * to (see lib/sheetsWebhook.ts and app/api/contact/route.ts) -- registration
 * details, store orders, meal requests, and general contact-form messages
 * all land here, fire-and-forget, in whatever sheet/tab matches their
 * `formName`.
 *
 * Setup (see docs/obsidian/Tasks.md and the chat that generated this file
 * for the full walkthrough):
 *   1. Create a Google Sheet, open Extensions -> Apps Script.
 *   2. Replace the boilerplate with this file's contents.
 *   3. (Optional but recommended) Project Settings -> Script Properties ->
 *      add WEBHOOK_SECRET with a random value. Set the same value as
 *      SHEETS_WEBHOOK_SECRET in Vercel's environment variables.
 *   4. Deploy -> New deployment -> Web app -> Execute as "Me", access
 *      "Anyone". Copy the resulting URL into Vercel as SHEETS_WEBHOOK.
 *   5. Re-deploy (Deploy -> Manage deployments -> Edit -> New version)
 *      any time you edit this script -- the URL stays the same across
 *      versions once created.
 *
 * A tab is created automatically the first time a given `formName` arrives
 * (e.g. "Registration — CACNA 2027", "Contact — General", "Store Order",
 * "YYAM Meal Request") -- no manual sheet setup needed per form. Columns
 * are also created automatically from whatever fields a submission sends,
 * and grow if a later submission includes a field the tab hasn't seen
 * before (the Contact form does this: membership inquiries send a few
 * extra fields general inquiries don't).
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var data = JSON.parse(e.postData.contents);

    var expectedSecret = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
    if (expectedSecret && data.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Invalid secret" });
    }
    delete data.secret;

    var formName = String(data.formName || "Unknown").slice(0, 90);
    delete data.formName;

    var sheet = getOrCreateSheet(formName);
    appendRow(sheet, data);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet(formName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(formName);
  if (!sheet) {
    sheet = ss.insertSheet(formName);
    sheet.appendRow(["Timestamp"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function appendRow(sheet, data) {
  var lastCol = sheet.getLastColumn();
  var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : ["Timestamp"];

  var newKeys = Object.keys(data).filter(function (k) {
    return headers.indexOf(k) === -1;
  });
  if (newKeys.length > 0) {
    sheet.getRange(1, headers.length + 1, 1, newKeys.length).setValues([newKeys]);
    headers = headers.concat(newKeys);
  }

  var row = headers.map(function (h) {
    if (h === "Timestamp") return new Date();
    return data[h] !== undefined ? String(data[h]) : "";
  });
  sheet.appendRow(row);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
