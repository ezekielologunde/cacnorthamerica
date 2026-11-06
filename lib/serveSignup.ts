// The "Serve at the Convention" sign-up: its fixed vocabulary and the one
// validator both the form (components/serve/ServeForm.tsx) and the route
// (app/api/serve/route.ts) use. Pure, with no server or browser imports, so
// scripts/check-serve.mjs can drive it directly.

import { SERVE_TEAMS, type ServeTeamId } from "@/lib/serveTeams";
import { HONEYPOT_FIELD, looksLikeSpam } from "@/lib/spam";

/** Sheets tab (the Apps Script makes one per formName) and email subject. */
export const SERVE_FORM_NAME = "Serve — Convention Volunteers";

/** Where sign-up notices go, and the mailto fallback when Resend is not set
 *  up. REVIEW: the site owner should confirm this mailbox. */
export const SERVE_INBOX = "convention@cacna.org";

export const SERVE_LIMITS = { name: 200, email: 254, phone: 50, note: 2000 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEAM_IDS: ReadonlySet<string> = new Set(SERVE_TEAMS.map((t) => t.id));

export interface ServeSignup {
  name: string;
  email: string;
  phone: string;
  teams: ServeTeamId[];
  note: string;
  under18: boolean;
  /** Only meaningful when under18: a parent or guardian has agreed. */
  guardianConsent: boolean;
}

export type ServeField = keyof typeof SERVE_LIMITS | "teams" | "guardianConsent" | "consent";

export type ServeResult =
  | { ok: true; signup: ServeSignup }
  /** Honeypot filled or link-stuffed: answer with a normal success, store nothing. */
  | { ok: false; spam: true }
  | { ok: false; spam: false; error: string; field?: ServeField };

const fail = (error: string, field?: ServeField): ServeResult => ({ ok: false, spam: false, error, field });

export function honeypotFilled(body: Record<string, unknown>): boolean {
  return !!body[HONEYPOT_FIELD];
}

/** Validates the JSON body the form sends:
 *  { name, email, phone?, teams: string[], note?, under18?, guardianConsent?, consent }.
 *  Unknown keys are ignored (never stored, logged or emailed). */
export function validateServeSignup(input: unknown): ServeResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) return fail("Invalid request");
  const body = input as Record<string, unknown>;
  if (honeypotFilled(body)) return { ok: false, spam: true };

  const text: Record<keyof typeof SERVE_LIMITS, string> = { name: "", email: "", phone: "", note: "" };
  for (const [key, max] of Object.entries(SERVE_LIMITS) as [keyof typeof SERVE_LIMITS, number][]) {
    const v = body[key];
    if (v === undefined || v === null) continue;
    if (typeof v !== "string") return fail("Invalid request", key);
    if (v.length > max) return fail(`Please keep this to ${max} characters or fewer.`, key);
    text[key] = v.trim();
  }

  const flags: Record<"under18" | "guardianConsent" | "consent", boolean> = { under18: false, guardianConsent: false, consent: false };
  for (const key of Object.keys(flags) as (keyof typeof flags)[]) {
    const v = body[key];
    if (v === undefined || v === null) continue;
    if (typeof v !== "boolean") return fail("Invalid request", key === "under18" ? "guardianConsent" : key);
    flags[key] = v;
  }

  const rawTeams = body.teams;
  if (rawTeams !== undefined && (!Array.isArray(rawTeams) || rawTeams.length > TEAM_IDS.size * 2)) {
    return fail("Invalid request", "teams");
  }
  const teams: ServeTeamId[] = [];
  for (const id of (rawTeams as unknown[] | undefined) ?? []) {
    if (typeof id !== "string" || !TEAM_IDS.has(id)) return fail("Please choose teams from the list.", "teams");
    if (!teams.includes(id as ServeTeamId)) teams.push(id as ServeTeamId);
  }

  // Link-stuffed submissions are spam, whatever else is wrong with them.
  if (looksLikeSpam([text.name, text.phone, text.note])) return { ok: false, spam: true };

  if (!text.name) return fail("Please enter your name.", "name");
  if (!text.email) return fail("Please enter your email address.", "email");
  if (!EMAIL_RE.test(text.email)) return fail("Please enter a valid email address.", "email");
  if (teams.length === 0) return fail("Please choose at least one team.", "teams");
  if (flags.under18 && !flags.guardianConsent) {
    return fail("Volunteers under 18 need a parent or guardian's agreement. Please tick the box to confirm it.", "guardianConsent");
  }
  if (!flags.consent) return fail("Please tick the box to agree to be contacted about serving.", "consent");

  return {
    ok: true,
    signup: {
      name: text.name,
      email: text.email,
      phone: text.phone,
      teams,
      note: text.note,
      under18: flags.under18,
      guardianConsent: flags.under18 && flags.guardianConsent,
    },
  };
}
