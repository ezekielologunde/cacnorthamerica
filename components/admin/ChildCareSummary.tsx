import { ALLERGY_SEVERITY_LABEL, allergyFlagText, readAllergies, readPickups, type AllergySeverity } from "@/lib/childCare";

// A child's Children's Ministry care details (cacna.child_care_details) for
// the admin check-in card and the printed care sheet. Server component: the
// data is read with the service client after requireAdmin() and never sent to
// client-side JavaScript.

export const CHILD_CARE_COLUMNS =
  "ref, idx, has_allergies, allergies, max_allergy_severity, medical_notes, medications, dietary_needs, special_needs, photo_consent, emergency_name, emergency_phone, emergency_relationship, pickups, guardian_name, guardian_phone";

export type ChildCareRecord = {
  ref: string;
  idx: number;
  has_allergies: boolean;
  allergies: unknown;
  max_allergy_severity: string | null;
  medical_notes: string | null;
  medications: string | null;
  dietary_needs: string | null;
  special_needs: string | null;
  photo_consent: boolean;
  emergency_name: string;
  emergency_phone: string;
  emergency_relationship: string | null;
  pickups: unknown;
  guardian_name: string;
  guardian_phone: string;
};

export const careKey = (ref: string, idx: number) => `${ref}:${idx}`;

const RED = "var(--red)";
const AMBER = "#7a4b00";
const AMBER_BG = "#fff4dc";
const GREEN = "#1d6b3a";

export function AllergyFlag({ care }: { care: ChildCareRecord }) {
  const allergies = readAllergies(care.allergies);
  if (!care.has_allergies || allergies.length === 0) {
    return <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: GREEN }}>No known allergies</p>;
  }
  const severity = (care.max_allergy_severity ?? "mild") as AllergySeverity;
  const severe = severity === "severe";
  return (
    <p
      style={{
        margin: "0 0 10px", padding: "10px 14px", borderRadius: 8, fontSize: 16, fontWeight: 700, lineHeight: 1.4,
        color: severe ? "white" : RED, background: severe ? RED : "rgba(200,30,30,0.07)", border: `2px solid ${RED}`,
        // Keep the colour when printed: this is the flag the desk looks for.
        printColorAdjust: "exact", WebkitPrintColorAdjust: "exact",
      }}
    >
      {severe ? "SEVERE ALLERGY" : `Allergy (${ALLERGY_SEVERITY_LABEL[severity] ?? severity})`}: {allergyFlagText(allergies)}
    </p>
  );
}

export function ChildCareDetails({ care }: { care: ChildCareRecord }) {
  const pickups = readPickups(care.pickups);
  const lines: [label: string, value: string | null][] = [
    ["Medications", care.medications],
    ["Medical", care.medical_notes],
    ["Diet", care.dietary_needs],
    ["Special needs", care.special_needs],
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14, color: "rgba(0,0,0,0.75)" }}>
      {lines.filter(([, v]) => v).map(([label, v]) => (
        <span key={label}><strong>{label}:</strong> {v}</span>
      ))}
      {!care.photo_consent && (
        <span>
          <span style={{ display: "inline-block", borderRadius: 20, fontSize: 12, fontWeight: 700, padding: "2px 10px", background: AMBER_BG, color: AMBER, printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}>
            No photos
          </span>
        </span>
      )}
      <span>
        <strong>May pick up:</strong> {care.guardian_name} ({care.guardian_phone}, parent / guardian)
        {pickups.map((p) => `; ${p.name} (${p.phone})`).join("")}
      </span>
      <span>
        <strong>Emergency:</strong> {care.emergency_name}{care.emergency_relationship ? ` (${care.emergency_relationship})` : ""}, {care.emergency_phone}
      </span>
    </div>
  );
}
