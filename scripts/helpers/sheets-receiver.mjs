// In-process Apps Script fake. Loads the actual receiver; never calls Google.
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../../docs/google-apps-script/sheets-webhook.gs", import.meta.url), "utf8");

export function receiverWorld() {
  const state = { sheets: new Map(), secret: "test-secret", busy: false, releases: 0, failAfterAppend: false, failFlush: false };
  function makeSheet(name) {
    const rows = [];
    return {
      rows,
      getName: () => name,
      getLastColumn: () => Math.max(0, ...rows.map((r) => r.length)),
      getLastRow: () => rows.length,
      setFrozenRows: () => {},
      appendRow(row) {
        rows.push(Array.from(row));
        if (rows.length > 1 && state.failAfterAppend) {
          state.failAfterAppend = false;
          throw new Error("Injected response loss after append");
        }
      },
      insertColumnsBefore(column, count) { for (const row of rows) row.splice(column - 1, 0, ...Array(count).fill("")); },
      getRange(row, column, height, width) {
        return {
          getValues: () => Array.from({ length: height }, (_, i) => Array.from({ length: width }, (_, j) => rows[row - 1 + i]?.[column - 1 + j] ?? "")),
          setValues(values) {
            for (let i = 0; i < height; i++) {
              rows[row - 1 + i] ??= [];
              for (let j = 0; j < width; j++) rows[row - 1 + i][column - 1 + j] = values[i][j];
            }
          },
        };
      },
    };
  }
  const spreadsheet = {
    getSheetByName: (name) => state.sheets.get(name),
    insertSheet(name) { const sheet = makeSheet(name); state.sheets.set(name, sheet); return sheet; },
  };
  function newReceiver() {
    const context = vm.createContext({
      LockService: { getScriptLock: () => ({ tryLock: () => !state.busy, releaseLock: () => { state.releases++; } }) },
      PropertiesService: { getScriptProperties: () => ({ getProperty: () => state.secret }) },
      SpreadsheetApp: {
        getActiveSpreadsheet: () => spreadsheet,
        flush: () => { if (state.failFlush) { state.failFlush = false; throw new Error("Injected flush failure"); } },
      },
      ContentService: { MimeType: { JSON: "json" }, createTextOutput: (body) => ({ setMimeType: () => JSON.parse(body) }) },
    });
    vm.runInContext(source, context);
    return (data) => context.doPost({ postData: { contents: JSON.stringify(data) } });
  }
  return { state, newReceiver };
}
