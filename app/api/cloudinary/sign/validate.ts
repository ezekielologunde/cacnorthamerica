// Validation for /api/cloudinary/sign (security finding admin-auth-3).
//
// The route used to sign whatever JSON it was sent, so any admin session could
// mint signatures to overwrite or destroy any asset on the account (public_id +
// overwrite/invalidate) or upload outside the blog folder. It now signs only the
// exact parameter set the PostForm upload widget sends, with fixed values.
//
// No public_id is allowed, so Cloudinary always generates a fresh unique id:
// an upload can never replace an existing asset, and a destroy request (which
// is signed over public_id) can never be authorised by this endpoint.

export const UPLOAD_FOLDER = "blog";

/** Image formats an admin may upload. Mirrored client-side in PostForm. */
export const IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp", "gif", "heic", "avif"] as const;

const MAX_SKEW_SECONDS = 10 * 60;

const ALLOWED_KEYS = new Set(["timestamp", "source", "folder", "overwrite", "allowed_formats"]);

export type SignParamsResult =
  | { ok: true; params: Record<string, string> }
  | { ok: false; error: string };

export function validateParamsToSign(body: unknown, nowSeconds: number): SignParamsResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, error: "Expected a JSON object." };
  }

  const params: Record<string, string> = {};
  for (const [key, raw] of Object.entries(body as Record<string, unknown>)) {
    if (!ALLOWED_KEYS.has(key)) return { ok: false, error: `Parameter not allowed: ${key}` };
    if (typeof raw !== "string" && typeof raw !== "number" && typeof raw !== "boolean") {
      return { ok: false, error: `Invalid value for ${key}` };
    }
    const value = String(raw);
    // '&' and '=' would let a value smuggle extra pairs into the signed string.
    if (/[&=]/.test(value)) return { ok: false, error: `Invalid value for ${key}` };
    params[key] = value;
  }

  if (!params.timestamp || !/^\d+$/.test(params.timestamp)) {
    return { ok: false, error: "timestamp is required." };
  }
  if (Math.abs(nowSeconds - Number(params.timestamp)) > MAX_SKEW_SECONDS) {
    return { ok: false, error: "timestamp is too far from the current time." };
  }
  if (params.folder !== UPLOAD_FOLDER) {
    return { ok: false, error: `folder must be "${UPLOAD_FOLDER}".` };
  }
  if ("source" in params && params.source !== "uw") {
    return { ok: false, error: "Invalid value for source" };
  }
  if ("overwrite" in params && params.overwrite !== "false") {
    return { ok: false, error: "overwrite is not allowed." };
  }
  if ("allowed_formats" in params) {
    const allowed: readonly string[] = IMAGE_FORMATS;
    const formats = params.allowed_formats.split(",");
    if (!formats.length || formats.some((f) => !allowed.includes(f))) {
      return { ok: false, error: "Invalid value for allowed_formats" };
    }
  }

  return { ok: true, params };
}
