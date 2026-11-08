import "server-only";
import { createHash } from "crypto";
import { socialCloudName } from "./cloud-name";
import { parseVideoResource, videoResourceUrl } from "./cloudinary-meta";
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
//
// The cloud name comes from lib/social/cloud-name.ts only (the same source
// as next.config.ts's /social-video rewrite); without it nothing here runs.

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
  const cloudName = socialCloudName();
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;

  const allowedFormats = UPLOAD_FORMATS.join(",");
  const params: Record<string, string> = {
    allowed_formats: allowedFormats,
    folder: UPLOAD_FOLDER,
    timestamp: String(nowSeconds),
  };
  const toSign = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  const signature = createHash("sha1").update(toSign + apiSecret).digest("hex");
  return {
    cloudName,
    apiKey,
    timestamp: nowSeconds,
    signature,
    folder: UPLOAD_FOLDER,
    allowedFormats,
    maxBytes: UPLOAD_MAX_BYTES,
  };
}

/** Reads an uploaded video's metadata, duration, frame rate and codec
 *  included (lib/social/cloudinary-meta.ts). Returns null for anything that
 *  isn't a real video of ours in the social folder. */
export async function fetchVideoMeta(publicId: string): Promise<VideoMeta | null> {
  if (!isSocialPublicId(publicId)) return null;
  const cloud = socialCloudName();
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !apiKey || !apiSecret) return null;

  let body: Record<string, unknown>;
  try {
    const res = await fetch(videoResourceUrl(cloud, publicId), {
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
  return parseVideoResource(body, publicId, cloud);
}
