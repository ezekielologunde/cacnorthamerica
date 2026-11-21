// The one place the social feature reads the Cloudinary cloud name. Used by
// next.config.ts (the /social-video rewrite TikTok pulls from), by
// lib/social/cloudinary.ts (upload signing and metadata) and by
// lib/social/adapters.ts (TikTok is only configured when the rewrite exists).
// No fallback: when the variable is unset or malformed, the rewrite isn't
// created, uploads aren't offered and TikTok reports not_configured, rather
// than the pieces quietly pointing at different clouds.
//
// Pure (no imports), so next.config.ts and `node --test` can load it.

type Env = Record<string, string | undefined>;

const CLOUD_NAME = /^[A-Za-z0-9_-]{1,64}$/;

export function socialCloudName(env: Env = process.env): string | null {
  const value = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  return value && CLOUD_NAME.test(value) ? value : null;
}

/** The external rewrite serving social uploads from this site's own domain
 *  (see next.config.ts), or null when there is no cloud name. Only the
 *  `social` folder, one path segment, mp4/mov. */
export function socialVideoRewrite(env: Env = process.env): { source: string; destination: string } | null {
  const cloud = socialCloudName(env);
  if (!cloud) return null;
  return {
    source: "/social-video/:file([A-Za-z0-9_-]+\\.mp4|[A-Za-z0-9_-]+\\.mov)",
    destination: `https://res.cloudinary.com/${cloud}/video/upload/social/:file`,
  };
}
