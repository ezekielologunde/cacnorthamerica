import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { resolveCheckinYear } from "@/lib/checkinSearch";
import { currentOrNextConvention } from "@/lib/conventions";
import { ALLERGY_SEVERITIES, CHILD_CARE_MAX_AGE } from "@/lib/childCare";
import { AllergyFlag, CHILD_CARE_COLUMNS, ChildCareDetails, careKey, type ChildCareRecord } from "@/components/admin/ChildCareSummary";
import PrintButton from "@/components/admin/PrintButton";

// The check-in desk's printable Children's Ministry care sheet: every
// registered child 12 and under for the year, allergy-flagged children first.
// Only children with a check-in row are listed, so a care row left behind by
// an abandoned card checkout never appears. Children's medical data: read with
// the service client after requireAdmin(), rendered on the server only.

type ChildRow = {
  ref: string;
  idx: number;
  full_name: string;
  code: string;
  age: number | null;
  checked_in_at: string | null;
};

const LIMIT = 1000;
// Refs per care lookup: a registration has at most 30 people, so 30 refs
// return at most 900 care rows, under PostgREST's 1000-row cap.
const REF_CHUNK = 30;

export default async function ChildCareSheetPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const year = resolveCheckinYear(params.year);
  const yearParam = year === currentOrNextConvention().year ? "" : String(year);

  const people = await supabase
    .from("checkin_people")
    .select("ref, idx, full_name, code, age, checked_in_at")
    .eq("year", year)
    .gte("age", 1)
    .lte("age", CHILD_CARE_MAX_AGE)
    .order("full_name")
    .limit(LIMIT);
  // Care rows are looked up only for the children listed, by their refs in
  // chunks, so no listed child's details can fall outside a row limit.
  const refs = [...new Set(((people.data ?? []) as ChildRow[]).map((p) => p.ref))];
  const careRecords: ChildCareRecord[] = [];
  let careError: typeof people.error = null;
  for (let i = 0; i < refs.length && !careError; i += REF_CHUNK) {
    const chunk = await supabase
      .from("child_care_details")
      .select(CHILD_CARE_COLUMNS)
      .eq("year", year)
      .in("ref", refs.slice(i, i + REF_CHUNK));
    if (chunk.error) careError = chunk.error;
    else careRecords.push(...((chunk.data ?? []) as ChildCareRecord[]));
  }
  const failed = people.error ?? careError;
  if (failed) console.error("[care-sheet] load failed:", failed.code);

  const byKey = new Map<string, ChildCareRecord>();
  for (const c of careRecords) byKey.set(careKey(c.ref, c.idx), c);
  const rank = (c?: ChildCareRecord) =>
    c?.has_allergies ? 1 + ALLERGY_SEVERITIES.indexOf((c.max_allergy_severity ?? "mild") as (typeof ALLERGY_SEVERITIES)[number]) : 0;
  const rows = ((people.data ?? []) as ChildRow[])
    .map((p) => ({ person: p, care: byKey.get(careKey(p.ref, p.idx)) }))
    .sort((a, b) => rank(b.care) - rank(a.care) || a.person.full_name.localeCompare(b.person.full_name));
  const flagged = rows.filter((r) => r.care?.has_allergies).length;

  return (
    <div style={{ maxWidth: 860 }}>
      <style>{`
        @media print {
          .ash-sidebar, .ash-mhdr, .ash-backdrop, .no-print { display: none !important; }
          .ash, .ash-main { display: block !important; padding: 0 !important; background: white !important; }
          .care-card { break-inside: avoid; box-shadow: none !important; border: 1px solid #999 !important; }
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px" }}>Children&apos;s care sheet · {year}</h1>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: 0 }}>
            {rows.length} {rows.length === 1 ? "child" : "children"} aged {CHILD_CARE_MAX_AGE} and under · {flagged} with allergies (listed first)
          </p>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", margin: "6px 0 0" }}>
            Confidential: children&apos;s medical information. Do not leave unattended; shred after the Convention.
          </p>
        </div>
        <div className="no-print" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href={yearParam ? `/admin/check-in?year=${yearParam}` : "/admin/check-in"} style={{ color: "var(--red)", fontWeight: 600, textDecoration: "none", padding: "12px 0" }}>
            ← Check-in
          </Link>
          <PrintButton />
        </div>
      </div>

      {failed ? (
        <div role="alert" style={{ background: "#fff4dc", color: "#7a4b00", border: "1px solid #f0c36d", borderRadius: 10, padding: "16px 20px", fontSize: 15, fontWeight: 600 }}>
          {failed.code === "42P01" || failed.code === "PGRST205"
            ? "The care details database isn't set up yet. Ask the site owner to apply migration 0026."
            : "Couldn't load the care sheet. Check your connection and try again."}
        </div>
      ) : rows.length === 0 ? (
        <div style={{ background: "white", borderRadius: 12, padding: 32, textAlign: "center", color: "var(--ink-soft)" }}>
          No children {CHILD_CARE_MAX_AGE} and under registered for {year} yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.length >= LIMIT && (
            <p className="no-print" style={{ fontSize: 14, color: "#7a4b00", margin: 0 }}>Showing the first {LIMIT}.</p>
          )}
          {rows.map(({ person, care: c }) => (
            <div key={careKey(person.ref, person.idx)} className="care-card" style={{ background: "white", borderRadius: 10, padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 17, color: "var(--ink)" }}>
                  {person.full_name} <span style={{ fontWeight: 500, fontSize: 14, color: "var(--ink-soft)" }}>· age {person.age}</span>
                </span>
                <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 18, fontWeight: 700, letterSpacing: "0.1em" }}>
                  {person.code}
                </span>
              </div>
              {c ? (
                <>
                  <AllergyFlag care={c} />
                  <ChildCareDetails care={c} />
                </>
              ) : (
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#7a4b00" }}>No care details on file. Ask the parent.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
