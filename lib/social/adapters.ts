import "server-only";
import { FacebookAdapter } from "./adapters/facebook";
import { InstagramAdapter } from "./adapters/instagram";
import { socialVideoRewrite } from "./cloud-name";
import { TikTokAdapter } from "./adapters/tiktok";
import { supabaseCredentialStore } from "./credential-store";
import { FakeAdapter } from "./fake-adapter";
import type { DispatcherDeps } from "./dispatcher";
import type { HttpDeps } from "./http";
import { supabaseSocialStore, type ServiceClient } from "./supabase-store";
import { offeredPrivacy, type TikTokComposer } from "./tiktok-choices";
import { parseKey } from "./token-crypto";
import type { Platform, PlatformAdapter, SocialSettings } from "./types";

// Real adapters, configured from server env vars only (names and lifetimes in
// .env.example). A platform whose variables are missing or malformed has no
// adapter, and the dispatcher records it as skipped / not_configured. Nothing
// here is ever sent to the browser or logged.

const http: HttpDeps = { fetch: (url, init) => fetch(url, init) };

function env(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function build(platform: Platform, db: ServiceClient): PlatformAdapter | null {
  if (platform === "facebook") {
    const pageId = env("FACEBOOK_PAGE_ID");
    const pageAccessToken = env("FACEBOOK_PAGE_ACCESS_TOKEN");
    return pageId && pageAccessToken ? new FacebookAdapter({ pageId, pageAccessToken }, http) : null;
  }
  if (platform === "instagram") {
    const igUserId = env("INSTAGRAM_USER_ID");
    // Instagram publishing with Facebook Login takes a Page access token, so
    // the Facebook one is the default.
    const accessToken = env("INSTAGRAM_ACCESS_TOKEN") ?? env("FACEBOOK_PAGE_ACCESS_TOKEN");
    return igUserId && accessToken ? new InstagramAdapter({ igUserId, accessToken }, http) : null;
  }
  return buildTikTok(db);
}

function buildTikTok(db: ServiceClient): TikTokAdapter | null {
  const clientKey = env("TIKTOK_CLIENT_KEY");
  const clientSecret = env("TIKTOK_CLIENT_SECRET");
  const pullUrlPrefix = env("TIKTOK_PULL_URL_PREFIX");
  const key = parseKey(env("SOCIAL_TOKEN_ENCRYPTION_KEY") ?? undefined);
  if (!clientKey || !clientSecret || !pullUrlPrefix || !key) return null;
  // TikTok pulls through next.config.ts's /social-video rewrite; without a
  // cloud name that rewrite doesn't exist, so TikTok isn't configured.
  if (!socialVideoRewrite()) return null;
  return new TikTokAdapter(
    {
      clientKey,
      clientSecret,
      bootstrapRefreshToken: env("TIKTOK_REFRESH_TOKEN"),
      pullUrlPrefix,
      audited: env("TIKTOK_APP_AUDITED") === "true",
      credentials: supabaseCredentialStore(db, key),
    },
    http,
  );
}

/** The real adapter for a platform, or null while its env vars aren't set. */
export function realAdapterFor(db: ServiceClient): (platform: Platform) => PlatformAdapter | null {
  return (platform) => {
    try {
      return build(platform, db);
    } catch {
      // A constructor refused a malformed id or URL prefix.
      return null;
    }
  };
}

/** The TikTok section of the upload form, or null when TikTok isn't in play
 *  (switched off, or a real post with TikTok not connected: it is skipped
 *  either way). With a connection, creator info is read fresh on every
 *  render, as TikTok's guidelines require; a dry run without one gets the
 *  unaudited default (SELF_ONLY only) so the form can still be tried. */
export async function tiktokComposer(db: ServiceClient, settings: SocialSettings): Promise<TikTokComposer | null> {
  if (!settings.platforms.tiktok) return null;
  let adapter: TikTokAdapter | null = null;
  try {
    adapter = buildTikTok(db);
  } catch {
    adapter = null;
  }
  if (!adapter) {
    if (!settings.dryRun) return null;
    return {
      state: "ready", standIn: true, nickname: "", privacyOptions: ["SELF_ONLY"],
      commentDisabled: false, duetDisabled: false, stitchDisabled: false, maxDurationSec: null,
    };
  }
  const res = await adapter.creatorInfo();
  if ("error" in res) return { state: "unavailable", code: res.error };
  return { state: "ready", standIn: false, ...res.info, privacyOptions: offeredPrivacy(res.info, adapter.audited) };
}

/** Dispatcher wiring for server actions; `db` must be the service-role client. */
export function dispatcherDeps(db: ServiceClient): DispatcherDeps {
  return {
    store: supabaseSocialStore(db),
    realAdapter: realAdapterFor(db),
    fakeAdapter: (platform) => new FakeAdapter(platform),
  };
}
