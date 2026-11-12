/** Who published a post. A post can have more than one publisher (a speaker and
 *  the department that ran the session, a husband and wife, two co-authors). */
export interface BlogAuthor {
  name: string;
  /** Short line under the name, e.g. "Regional Superintendent, CACNA". */
  role?: string;
  /** Profile picture: a site path ("/images/…") or an https URL. Omit for initials. */
  photo?: string;
}

const MAX_AUTHORS = 4;

/** Accepts untrusted JSON (the database column) and keeps only well-formed entries. */
export function parseAuthors(raw: unknown): BlogAuthor[] {
  if (!Array.isArray(raw)) return [];
  const out: BlogAuthor[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const r = item as Record<string, unknown>;
    const name = typeof r.name === "string" ? r.name.trim().slice(0, 80) : "";
    if (!name) continue;
    const role = typeof r.role === "string" && r.role.trim() ? r.role.trim().slice(0, 120) : undefined;
    const p = typeof r.photo === "string" ? r.photo.trim() : "";
    const photo = (p.startsWith("/") && !p.startsWith("//")) || p.startsWith("https://") ? p.slice(0, 500) : undefined;
    out.push({ name, role, photo });
    if (out.length === MAX_AUTHORS) break;
  }
  return out;
}

/** "A", "A and B", "A, B and C". */
export function joinNames(authors: BlogAuthor[]): string {
  const n = authors.map((a) => a.name);
  if (n.length <= 1) return n[0] ?? "";
  return `${n.slice(0, -1).join(", ")} and ${n[n.length - 1]}`;
}

const OLADELE: BlogAuthor = { name: "Pastor Samuel Olusegun Oladele", role: "President, Christ Apostolic Church Nigeria and Overseas", photo: "/images/pastor-oladele-portrait.jpg" };
const AGBEJA: BlogAuthor = { name: "Pastor Dr. T.A.O. Agbeja", role: "Regional Superintendent, CACNA (Latunde Region)", photo: "/images/pastor-agbeja-portrait.jpg" };
const ADENODI: BlogAuthor = { name: "Pastor David Olusegun Adenodi, Ph.D.", role: "Chairman, Convention & Conference Planning Committee", photo: "/images/pastor-adenodi-portrait.jpg" };

/** Publishers for the posts written in code, by slug. Only people the post itself
 *  names as its speaker or signatory; anything else falls back to "CACNA". */
export const POST_AUTHORS: Record<string, BlogAuthor[]> = {
  "dealing-with-anger-pastor-owoseni": [{ name: "Pastor R.T. Owoseni", role: "District Superintendent, CAC Salvation Centre, Ilorin" }],
  "tribute-to-late-pastor-abraham-adegoke-oyedeji": [{ name: "The Oyedeji Family", role: "With CAC First in the Americas" }],
  "golden-jubilee-message-from-the-president": [OLADELE],
  "cacna-2026-presidents-message": [OLADELE],
  "golden-jubilee-welcome-address-regional-superintendent": [AGBEJA],
  "cacna-2026-welcome-address": [AGBEJA],
  "from-burnout-to-balance-agbeja": [AGBEJA],
  "golden-jubilee-convention-chairmans-address": [ADENODI],
  "cacna-2026-chairmans-address": [ADENODI],
  "cacna-2026-closing-appreciation": [ADENODI],
  "cacna-2026-bible-as-encourager": [{ name: "Rt. Rev. Prof. Dapo F. Asaju", role: "Bishop, Ilesa Anglican Diocese" }],
  "cacna-2026-dynamic-force-asaju": [{ name: "Rt. Rev. Prof. Dapo F. Asaju", role: "Bishop, Ilesa Anglican Diocese" }],
  "cacna-2026-divine-word-daily-living": [{ name: "Pastor Simeon Oladokun", role: "Regional Superintendent, CAC Anosike (Europe)" }],
  "cacna-2026-ultimate-authority-olajide": [{ name: "Evang. Mrs. Janet Olajide", role: "Sunday School Rally speaker, Latunde Region", photo: "/images/evang-olajide-portrait.jpg" }],
  "cacna-2026-authority-victory-brown": [{ name: "Pastor Adekunmi Browne", role: "Director, Youth & Young Adults, CACNA" }],
};
