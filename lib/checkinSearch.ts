import { normalizeCheckinCode } from "@/lib/checkinCode";
import { conventionYears, currentOrNextConvention } from "@/lib/conventions";
import { AGE_GROUP_LABEL, ageGroupFor } from "@/lib/youthRegistration";

// Pure helpers for the staff check-in page (app/admin/(protected)/check-in):
// how a typed query becomes a code and/or a name search, and how the result
// lists are merged. No database access here, so
// scripts/check-checkin-admin.mjs can drive it directly.

export const MAX_CHECKIN_QUERY_LENGTH = 60;
export const CHECKIN_RESULT_LIMIT = 50;

export type CheckinQuery = {
  /** Trimmed, length-capped query, as echoed back in the search box. */
  q: string;
  /** Canonical check-in code when q is 4 characters that can be one. */
  code: string | null;
  /** ilike pattern (%q%, with %, _ and \ escaped) for the name search, or
   *  null when q is empty. */
  pattern: string | null;
};

/** Trimmed and capped at MAX_CHECKIN_QUERY_LENGTH; "" for anything else. */
export function cleanCheckinQuery(raw: unknown): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return typeof value === "string" ? value.trim().slice(0, MAX_CHECKIN_QUERY_LENGTH).trim() : "";
}

/** Escapes LIKE's metacharacters so user input is always matched literally.
 *  `*` is dropped: PostgREST reads it as a `%` wildcard in like patterns, and
 *  no name contains one. */
export function escapeLikePattern(input: string): string {
  return input.replace(/\*/g, "").replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

/** A 4-character query that normalises to a valid code searches that code
 *  AND names: plenty of 4-letter names (John, Mary, Emma) are valid codes
 *  once O reads as 0. Anything else searches names only. */
export function parseCheckinQuery(raw: unknown): CheckinQuery {
  const q = cleanCheckinQuery(raw);
  if (!q) return { q, code: null, pattern: null };
  const code = q.length === 4 ? normalizeCheckinCode(q) : null;
  const escaped = escapeLikePattern(q);
  return { q, code, pattern: escaped ? `%${escaped}%` : null };
}

/** The ?year= param when it names a listed convention year, else the
 *  convention registrations are currently for (as app/api/register uses). */
export function resolveCheckinYear(raw: unknown): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const listed = conventionYears.find((cy) => String(cy.year) === value);
  return listed ? listed.year : currentOrNextConvention().year;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isCheckinId(id: unknown): id is string {
  return typeof id === "string" && UUID_RE.test(id);
}

/** Merges the code and name result lists: one entry per id, ordered by
 *  full_name, capped at `limit`. `truncated` when more than `limit` matched
 *  (each list is fetched with limit + 1 rows, so this is exact). */
export function mergeCheckinResults<T extends { id: string; full_name: string }>(
  lists: readonly (readonly T[])[],
  limit = CHECKIN_RESULT_LIMIT
): { rows: T[]; truncated: boolean } {
  const byId = new Map<string, T>();
  for (const list of lists) for (const row of list) if (!byId.has(row.id)) byId.set(row.id, row);
  const all = [...byId.values()].sort(
    (a, b) => a.full_name.localeCompare(b.full_name, "en", { sensitivity: "base" }) || a.id.localeCompare(b.id)
  );
  return { rows: all.slice(0, limit), truncated: all.length > limit };
}

/** Codes that appear on more than one of `rows`. */
export function sharedCodes(rows: readonly { code: string }[]): Set<string> {
  const seen = new Set<string>();
  const shared = new Set<string>();
  for (const { code } of rows) (seen.has(code) ? shared : seen).add(code);
  return shared;
}

/** The page URL for a search, so an action can bring the volunteer back to
 *  the same results. Only q and a non-default year are carried. */
export function checkinPageHref(q: unknown, year: unknown): string {
  const params = new URLSearchParams();
  const query = cleanCheckinQuery(q);
  if (query) params.set("q", query);
  const value = Array.isArray(year) ? year[0] : year;
  if (typeof value === "string" && conventionYears.some((cy) => String(cy.year) === value) &&
      Number(value) !== currentOrNextConvention().year) {
    params.set("year", value);
  }
  const search = params.toString();
  return search ? `/admin/check-in?${search}` : "/admin/check-in";
}

const CATEGORY_LABEL: Record<string, string> = { adult: "Adult", young_adult: "Young Adult", child: "Child" };

/** "Youth (11–19) · age 14" for a youth registrant with a known age, else
 *  the fee category ("Adult"). */
export function checkinCategoryLabel(category: string, age: number | null): string {
  if (category !== "adult" && typeof age === "number" && Number.isInteger(age) && age > 0) return `${AGE_GROUP_LABEL[ageGroupFor(age)]} · age ${age}`;
  return CATEGORY_LABEL[category] ?? category;
}
