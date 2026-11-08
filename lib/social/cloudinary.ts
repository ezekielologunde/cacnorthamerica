import "server-only";
import { createHash } from "crypto";
import { UPLOAD_FOLDER, UPLOAD_FORMATS, UPLOAD_MAX_BYTES, isSocialPublicId } from "./limits";
import type { VideoMeta } from "./types";

// Cloudinary side of the social upload: the browser uploads the video
// straight to Cloudinary (it never passes through a Vercel function), signed
// here; the server then reads the video's metadata back from Cloudinary
// instead of trusting what the browser reports.
//
// Signing: https://cloudinary.com/documentation/authentication_signatures --
// the parameters, sorted and joined as k=v&k=v, with the API secret appended,
// SHA-1 (the same scheme as app/api/cloudinary/sign). Only fixed values are
// signed: the social folder, the allowed formats and the timestamp. No
// public_id, so Cloudinary generates a fresh one and an upload can never
// overwrite an existing asset.
//
// Chunked upload (X-Unique-Upload-Id + Content-Range, every chunk but the last
// over 5 MB): https://cloudinary.com/documentation/upload_images#chunked_asset_upload

export function cloudName(): string {
  return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dkmn2rtbc";
}

export type UploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  allowedFormats: string;
  maxBytes: number;
};

/** null when Cloudinary isn't configured. Never returns the secret. */
export function signVideoUploadParams(nowSeconds: number): UploadSignature | null {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) return null;

  const allowedFormats = UPLOAD_FORMATS.join(",");
  const params: Record<string, string> = {
    allowed_formats: allowedFormats,
    folder: UPLOAD_FOLDER,
    timestamp: String(nowSeconds),
  };
  const toSign = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  const signature = createHash("sha1").update(toSign + apiSecret).digest("hex");
  return {
    cloudName: cloudName(),
    apiKey,
    timestamp: nowSeconds,
    signature,
    folder: UPLOAD_FOLDER,
    allowedFormats,
    maxBytes: UPLOAD_MAX_BYTES,
  };
}

const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) && v > 0 ? v : null);

/** Reads an uploaded video's metadata with the Admin API
 *  (GET /resources/video/upload/<public_id>,
 *  https://cloudinary.com/documentation/admin_api#get_details_of_a_single_resource_by_public_id).
 *  bytes, format, width, height and secure_url are documented fields;
 *  duration isn't confirmed by the docs for this endpoint, so it is used when
 *  present and left unknown otherwise. Returns null for anything that isn't a
 *  real video of ours in the social folder. */
export async function fetchVideoMeta(publicId: string): Promise<VideoMeta | null> {
  if (!isSocialPublicId(publicId)) return null;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) return null;

  const cloud = cloudName();
  const url = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/resources/video/upload/${publicId}`;
  let body: Record<string, unknown>;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[social] Cloudinary metadata lookup failed:", res.status);
      return null;
    }
    body = (await res.json()) as Record<string, unknown>;
  } catch {
    console.error("[social] Cloudinary metadata lookup failed: network");
    return null;
  }

  const secureUrl = body.secure_url;
  const bytes = num(body.bytes);
  const format = typeof body.format === "string" ? body.format.toLowerCase() : "";
  if (
    body.public_id !== publicId ||
    body.resource_type !== "video" ||
    typeof secureUrl !== "string" ||
    !secureUrl.startsWith(`https://res.cloudinary.com/${cloud}/video/upload/`) ||
    bytes === null ||
    !/^[a-z0-9]{1,10}$/.test(format)
  ) {
    return null;
  }

  return {
    publicId,
    url: secureUrl,
    bytes,
    format,
    width: num(body.width),
    height: num(body.height),
    durationSec: num(body.duration),
  };
}
