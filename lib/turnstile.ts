// Server side of Cloudflare Turnstile. Verification is on only when
// TURNSTILE_SECRET_KEY is set, so forms keep working until the keys exist.
// The widget (components/TurnstileField.tsx) is on only when the public
// NEXT_PUBLIC_TURNSTILE_SITE_KEY is set; set the two together.

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const TURNSTILE_ERROR = "We couldn't confirm you're not a robot. Please wait a moment and try again.";

/** True when a submission carrying `token` should be accepted. Fails closed on
 *  a missing or rejected token; fails open if Cloudflare itself can't be
 *  reached, so an outage never blocks registrations or gifts (the per-IP rate
 *  limits and honeypots still apply). */
export async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || token === "" || token.length > 2048) return false;
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, ...(ip && ip !== "unknown" ? { remoteip: ip } : {}) }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`siteverify ${res.status}`);
    const data: { success?: boolean } = await res.json();
    return data.success === true;
  } catch (e) {
    console.error("[turnstile] verification unavailable, allowing:", e);
    return true;
  }
}
