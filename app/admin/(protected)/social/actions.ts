"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { rateLimit } from "@/lib/rateLimit";
import { dispatcherDeps } from "@/lib/social/adapters";
import { fetchVideoMeta, signVideoUploadParams, type UploadSignature } from "@/lib/social/cloudinary";
import { markNotPosted, retryTarget, submitPost } from "@/lib/social/dispatcher";
import { isSocialPublicId, TITLE_MAX, UPLOAD_MAX_BYTES } from "@/lib/social/limits";
import { describeCode } from "@/lib/social/messages";
import { PLATFORM_LABELS } from "@/lib/social/types";

// Every action here is an entry point anyone could POST to: each runs
// requireAdmin() itself, is rate-limited per admin, and takes ids or text only
// (never a URL or file metadata, which are read from Cloudinary). Next.js
// rejects cross-origin action calls (Origin vs Host), which is the CSRF guard.

const MINUTE = 60_000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLOW_DOWN = "Too many requests. Please wait a few minutes and try again.";

export type SignResult = { ok: true; upload: UploadSignature } | { ok: false; error: string };

export async function signVideoUpload(): Promise<SignResult> {
  const { user } = await requireAdmin();
  if (!rateLimit(`social-sign:${user.id}`, 20, 60 * MINUTE)) return { ok: false, error: SLOW_DOWN };
  const upload = signVideoUploadParams(Math.floor(Date.now() / 1000));
  if (!upload) return { ok: false, error: "Video uploads aren't configured (Cloudinary keys missing)." };
  return { ok: true, upload };
}

export type SubmitVideoResult = { ok: true; duplicate: boolean } | { ok: false; error: string };

export async function submitVideo(input: { publicId: unknown; title: unknown; caption: unknown }): Promise<SubmitVideoResult> {
  const { supabase, user } = await requireAdmin();
  if (!rateLimit(`social-submit:${user.id}`, 10, 60 * MINUTE)) return { ok: false, error: SLOW_DOWN };

  const { publicId, title, caption } = input ?? {};
  if (!isSocialPublicId(publicId)) return { ok: false, error: "Upload the video first." };
  if (typeof title !== "string" || typeof caption !== "string" || title.length > TITLE_MAX * 2 || caption.length > 10_000) {
    return { ok: false, error: "Check the title and caption." };
  }

  const video = await fetchVideoMeta(publicId);
  if (!video) return { ok: false, error: "Couldn't find that upload on Cloudinary. Please upload it again." };
  if (video.bytes > UPLOAD_MAX_BYTES) return { ok: false, error: "The video is larger than uploads allow." };

  let result;
  try {
    result = await submitPost(dispatcherDeps(supabase), { video, title, caption, submittedBy: user.id });
  } catch (err) {
    console.error("[social] submit failed:", err instanceof Error ? err.message : "unknown");
    return { ok: false, error: "Something went wrong saving the post. Check the post log before trying again." };
  } finally {
    revalidatePath("/admin/social");
  }
  if (!result.ok) {
    const where = result.platform ? ` (${PLATFORM_LABELS[result.platform]})` : "";
    return { ok: false, error: describeCode(result.code) + where };
  }
  return { ok: true, duplicate: result.duplicate };
}

export async function retrySocialTarget(targetId: string): Promise<void> {
  const { supabase, user } = await requireAdmin();
  if (!UUID.test(targetId) || !rateLimit(`social-retry:${user.id}`, 20, 10 * MINUTE)) return;
  try {
    await retryTarget(dispatcherDeps(supabase), targetId);
  } catch (err) {
    console.error("[social] retry failed:", err instanceof Error ? err.message : "unknown");
  }
  revalidatePath("/admin/social");
}

export async function markSocialTargetNotPosted(targetId: string): Promise<void> {
  const { supabase, user } = await requireAdmin();
  if (!UUID.test(targetId) || !rateLimit(`social-retry:${user.id}`, 20, 10 * MINUTE)) return;
  try {
    await markNotPosted(dispatcherDeps(supabase), targetId);
  } catch (err) {
    console.error("[social] mark-not-posted failed:", err instanceof Error ? err.message : "unknown");
  }
  revalidatePath("/admin/social");
}

export async function saveSocialSettings(formData: FormData): Promise<void> {
  const { supabase, user } = await requireAdmin();
  if (!rateLimit(`social-settings:${user.id}`, 30, 10 * MINUTE)) throw new Error(SLOW_DOWN);
  const on = (name: string) => formData.get(name) === "on";
  const { error } = await supabase.from("social_settings").upsert({
    id: 1,
    posting_enabled: on("posting_enabled"),
    dry_run: on("dry_run"),
    facebook_enabled: on("facebook_enabled"),
    instagram_enabled: on("instagram_enabled"),
    tiktok_enabled: on("tiktok_enabled"),
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  });
  if (error) {
    console.error("[social] settings save failed:", error.code);
    throw new Error("Could not save the settings. Please try again.");
  }
  revalidatePath("/admin/social");
  revalidatePath("/admin/social/settings");
}
