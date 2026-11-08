import "server-only";
import { FakeAdapter } from "./fake-adapter";
import type { DispatcherDeps } from "./dispatcher";
import { supabaseSocialStore, type ServiceClient } from "./supabase-store";
import type { Platform, PlatformAdapter } from "./types";

/** The real adapter for a platform, or null while it isn't built or its
 *  credentials aren't set. None exist yet (task 2 adds Facebook, Instagram
 *  and TikTok, reading their tokens from server env only), so real posting
 *  records every enabled platform as skipped / not_configured. */
export function realAdapter(platform: Platform): PlatformAdapter | null {
  void platform;
  return null;
}

/** Dispatcher wiring for server actions; `db` must be the service-role client. */
export function dispatcherDeps(db: ServiceClient): DispatcherDeps {
  return {
    store: supabaseSocialStore(db),
    realAdapter,
    fakeAdapter: (platform) => new FakeAdapter(platform),
  };
}
