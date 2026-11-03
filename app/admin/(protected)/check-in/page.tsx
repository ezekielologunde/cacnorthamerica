import { requireAdmin } from "@/lib/supabase/require-admin";
import { checkInPerson, markZellePaid, undoCheckIn } from "./actions";
import Link from "next/link";
import ActionButton from "@/components/admin/ActionButton";
import {
  CHECKIN_RESULT_LIMIT,
  MAX_CHECKIN_QUERY_LENGTH,
  checkinCategoryLabel,
  mergeCheckinResults,
  parseCheckinQuery,
  resolveCheckinYear,
  sharedCodes,
} from "@/lib/checkinSearch";
import { currentOrNextConvention } from "@/lib/conventions";

// Door check-in: volunteers look a person up by name or 4-character code
// (lib/checkinSearch.ts) in cacna.checkin_people
// (supabase/migrations/0015_checkin_people.sql) and mark them checked in.
// A plain GET form, so it works on any phone without JavaScript.

const COLUMNS =
  "id, full_name, code, category, age, church_name, dcc, contact_name, meals, allergies, payment_status, zelle_ref, checked_in_at, checked_in_by";

type PersonRow = {
  id: string;
  full_name: string;
  code: string;
  category: string;
  age: number | null;
  church_name: string | null;
  dcc: string | null;
  contact_name: string;
  meals: string | null;
  allergies: string | null;
  payment_status: string;
  zelle_ref: string | null;
  checked_in_at: string | null;
  checked_in_by: string | null;
};

const GREEN = "#1d6b3a";
const GREEN_BG = "#e7f4ec";
const AMBER = "#7a4b00";
const AMBER_BG = "#fff4dc";

function checkedInTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function HiddenSearch({ q, year }: { q: string; year: string }) {
  return (
    <>
      <input type="hidden" name="q" value={q} />
      <input type="hidden" name="year" value={year} />
    </>
  );
}

function PersonCard({ person, q, year, codeShared }: { person: PersonRow; q: string; year: string; codeShared: boolean }) {
  const paid = person.payment_status === "paid";
  const awaitingZelle = person.payment_status === "awaiting_zelle";
  const church = [person.church_name, person.dcc && `DCC: ${person.dcc}`].filter(Boolean).join(" · ");

  return (
    <div style={{ background: "white", borderRadius: 10, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: 19, color: "var(--ink)", margin: "0 0 4px" }}>{person.full_name}</p>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: 0 }}>{checkinCategoryLabel(person.category, person.age)}</p>
        </div>
        <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 30, fontWeight: 700, letterSpacing: "0.12em", color: "var(--ink)" }}>
          {person.code}
        </span>
      </div>

      {codeShared && (
        <p style={{ fontSize: 14, fontWeight: 600, color: AMBER, background: AMBER_BG, borderRadius: 6, padding: "8px 12px", margin: "0 0 10px" }}>
          Another person in these results has the same code {person.code}. Check the name.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14, color: "rgba(0,0,0,0.7)", marginBottom: 12 }}>
        {church && <span>{church}</span>}
        <span>Registered by {person.contact_name}</span>
        {person.meals && <span>Meals: {person.meals}</span>}
        <span>
          <span style={{
            display: "inline-block", borderRadius: 20, fontSize: 12, fontWeight: 700, padding: "2px 10px",
            background: paid ? GREEN_BG : awaitingZelle ? AMBER_BG : "rgba(18,20,30,0.07)",
            color: paid ? GREEN : awaitingZelle ? AMBER : "var(--ink-soft)",
          }}>
            {paid ? "Paid" : awaitingZelle ? "Awaiting Zelle payment" : "Free (email unverified)"}
          </span>
        </span>
        {person.zelle_ref && <span>Zelle reference: <strong>{person.zelle_ref}</strong></span>}
      </div>

      {awaitingZelle && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", background: AMBER_BG, borderRadius: 8, padding: "10px 14px", margin: "0 0 14px" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: AMBER }}>Payment not received yet</span>
          <form action={markZellePaid.bind(null, person.id)}>
            <HiddenSearch q={q} year={year} />
            <ActionButton style={{
              background: "white", color: AMBER, border: "1px solid #f0c36d",
              borderRadius: 6, padding: "10px 18px", minHeight: 44, fontSize: 14, fontWeight: 700,
            }}>
              Mark registration paid
            </ActionButton>
          </form>
        </div>
      )}

      {person.allergies && (
        <p style={{ fontSize: 16, fontWeight: 700, color: "var(--red)", background: "rgba(200,30,30,0.07)", border: "2px solid var(--red)", borderRadius: 8, padding: "10px 14px", margin: "0 0 14px" }}>
          Allergies: {person.allergies}
        </p>
      )}

      {person.checked_in_at ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", background: GREEN_BG, borderRadius: 8, padding: "10px 14px" }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: GREEN }}>
            Checked in {checkedInTime(person.checked_in_at)}{person.checked_in_by ? ` by ${person.checked_in_by}` : ""}
          </span>
          <form action={undoCheckIn.bind(null, person.id)}>
            <HiddenSearch q={q} year={year} />
            <ActionButton style={{
              background: "white", color: "var(--ink-soft)", border: "1px solid rgba(18,20,30,0.2)",
              borderRadius: 6, padding: "10px 18px", minHeight: 44, fontSize: 14, fontWeight: 600,
            }}>
              Undo
            </ActionButton>
          </form>
        </div>
      ) : (
        <form action={checkInPerson.bind(null, person.id)}>
          <HiddenSearch q={q} year={year} />
          <ActionButton style={{
            width: "100%", minHeight: 52, background: "var(--red)", color: "white", border: "none",
            borderRadius: 8, fontSize: 17, fontWeight: 700,
          }}>
            Check in
          </ActionButton>
        </form>
      )}
    </div>
  );
}

export default async function CheckInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const search = parseCheckinQuery(params.q);
  const year = resolveCheckinYear(params.year);
  const yearParam = year === currentOrNextConvention().year ? "" : String(year);

  const base = () => supabase.from("checkin_people").select(COLUMNS).eq("year", year);
  let rows: PersonRow[] = [];
  let truncated = false;
  let counts: { checkedIn: number; total: number } | null = null;
  let loadError: "missing-table" | "other" | null = null;

  if (search.q) {
    const lookups = [];
    if (search.code) lookups.push(base().eq("code", search.code).order("full_name").limit(CHECKIN_RESULT_LIMIT + 1));
    if (search.pattern) {
      lookups.push(base().ilike("full_name", search.pattern).order("full_name").limit(CHECKIN_RESULT_LIMIT + 1));
      lookups.push(base().ilike("contact_name", search.pattern).order("full_name").limit(CHECKIN_RESULT_LIMIT + 1));
    }
    const results = await Promise.all(lookups);
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      console.error("[check-in] lookup failed:", failed.error.code);
      loadError = failed.error.code === "42P01" || failed.error.code === "PGRST205" ? "missing-table" : "other";
    } else {
      ({ rows, truncated } = mergeCheckinResults(results.map((r) => (r.data ?? []) as PersonRow[])));
    }
  } else {
    const [total, checkedIn] = await Promise.all([
      supabase.from("checkin_people").select("id", { count: "exact", head: true }).eq("year", year),
      supabase.from("checkin_people").select("id", { count: "exact", head: true }).eq("year", year).not("checked_in_at", "is", null),
    ]);
    const failed = total.error ?? checkedIn.error;
    if (failed) {
      console.error("[check-in] count failed:", failed.code);
      loadError = failed.code === "42P01" || failed.code === "PGRST205" ? "missing-table" : "other";
    } else {
      counts = { checkedIn: checkedIn.count ?? 0, total: total.count ?? 0 };
    }
  }

  const shared = sharedCodes(rows);

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px" }}>Check-in · {year}</h1>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: 0 }}>
          Codes are not unique. Always confirm the name before checking someone in.
        </p>
      </div>

      <form method="get" action="/admin/check-in" role="search" style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {yearParam && <input type="hidden" name="year" value={yearParam} />}
        <input
          type="search"
          name="q"
          defaultValue={search.q}
          aria-label="Name or check-in code"
          placeholder="Name or 4-character code"
          maxLength={MAX_CHECKIN_QUERY_LENGTH}
          autoFocus={!search.q}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          style={{
            flex: 1, minWidth: 0, minHeight: 52, fontSize: 18, fontFamily: "inherit", padding: "0 14px",
            border: "1px solid rgba(18,20,30,0.2)", borderRadius: 8, background: "white", color: "var(--ink)",
          }}
        />
        <button type="submit" style={{
          minHeight: 52, padding: "0 20px", fontSize: 16, fontWeight: 700, fontFamily: "inherit",
          background: "var(--ink)", color: "white", border: "none", borderRadius: 8, cursor: "pointer",
        }}>
          Search
        </button>
      </form>

      {loadError === "missing-table" ? (
        <div role="alert" style={{ background: AMBER_BG, color: AMBER, border: "1px solid #f0c36d", borderRadius: 10, padding: "16px 20px", fontSize: 15, fontWeight: 600 }}>
          Check-in database isn&apos;t set up yet. Ask the site owner to apply migration 0015.
        </div>
      ) : loadError ? (
        <div role="alert" style={{ background: AMBER_BG, color: AMBER, border: "1px solid #f0c36d", borderRadius: 10, padding: "16px 20px", fontSize: 15, fontWeight: 600 }}>
          Couldn&apos;t load the check-in list. Check your connection and try again; the Google Sheet has the same list.
        </div>
      ) : !search.q ? (
        <div style={{ background: "white", borderRadius: 12, padding: "32px", textAlign: "center", color: "var(--ink-soft)", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <p style={{ fontSize: 16, margin: "0 0 8px" }}>Type a name or a 4-character check-in code.</p>
          {counts && (
            <p style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
              {counts.checkedIn} of {counts.total} checked in
            </p>
          )}
        </div>
      ) : rows.length === 0 ? (
        <div style={{ background: "white", borderRadius: 12, padding: "32px", textAlign: "center", color: "var(--ink-soft)", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <p style={{ fontSize: 16, margin: 0 }}>No one found for &ldquo;{search.q}&rdquo; in {year}.</p>
          <p style={{ fontSize: 14, margin: "8px 0 0" }}>Registered recently? Check the Google Sheet, which lists everyone the moment they register.</p>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "0 0 12px", display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "space-between" }}>
            <span>
              {truncated ? "Showing the first 50, refine your search" : `${rows.length} ${rows.length === 1 ? "match" : "matches"}`}
            </span>
            <Link href={yearParam ? `/admin/check-in?year=${yearParam}` : "/admin/check-in"} style={{ color: "var(--red)", fontWeight: 600, textDecoration: "none" }}>
              New search
            </Link>
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {rows.map((person) => (
              <PersonCard key={person.id} person={person} q={search.q} year={yearParam} codeShared={shared.has(person.code)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
