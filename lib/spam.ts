// Cheap, dependency-free guards for public forms. Callers should answer a
// flagged submission with the normal success response so bots get no signal.

const URL_RE = /(https?:\/\/|www\.)\S+/gi;

/** More than this many links in one submission is treated as spam. */
export const MAX_LINKS = 2;

/** Header the site's own forms send (see lib/forms.ts). Bots that POST to the
 *  API directly, without loading a page, usually omit it. */
export const FORM_HEADER = "x-cacna-form";

/** Name of the hidden honeypot input; real visitors never see or fill it. */
export const HONEYPOT_FIELD = "company_website";

export function countLinks(values: Iterable<string>): number {
  let n = 0;
  for (const v of values) n += v.match(URL_RE)?.length ?? 0;
  return n;
}

export function looksLikeSpam(values: Iterable<string>): boolean {
  return countLinks(values) > MAX_LINKS;
}
