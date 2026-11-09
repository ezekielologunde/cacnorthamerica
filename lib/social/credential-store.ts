import "server-only";
import type { ServiceClient } from "./supabase-store";
import { decryptSecret, encryptSecret } from "./token-crypto.ts";
import type { CredentialStore, Platform, StoredCredential } from "./types";

// CredentialStore over cacna.social_credentials (migration 0028). The token
// pair is sealed with AES-256-GCM (token-crypto.ts) before it leaves the
// server; only the expiry instants are stored in clear. Service-role client
// only: the table has RLS forced with no policies. Every write is a single
// conditional statement on `version` (UPDATE ... WHERE version = $v, or an
// insert that ignores an existing row), so of two racing writers exactly one
// gets a row back.

function parse(json: string | null): StoredCredential | null {
  if (!json) return null;
  try {
    const v = JSON.parse(json) as Record<string, unknown>;
    if (
      typeof v.accessToken === "string" && typeof v.refreshToken === "string" &&
      typeof v.accessExpiresAt === "number" && typeof v.refreshExpiresAt === "number"
    ) {
      return {
        accessToken: v.accessToken,
        accessExpiresAt: v.accessExpiresAt,
        refreshToken: v.refreshToken,
        refreshExpiresAt: v.refreshExpiresAt,
        seed: typeof v.seed === "string" ? v.seed : undefined,
      };
    }
  } catch {
    // fall through
  }
  return null;
}

export function supabaseCredentialStore(db: ServiceClient, key: Buffer): CredentialStore {
  return {
    async get(platform: Platform) {
      const { data, error } = await db.from("social_credentials").select("secret, version, refresh_lease_until")
        .eq("platform", platform).maybeSingle();
      if (error) throw new Error(`social credentials read failed: ${error.code}`);
      if (!data) return null;
      return {
        // A row sealed with another key (or tampered with) reads as having
        // no pair: the adapter then reports that a reconnect is needed.
        credential: data.secret ? parse(decryptSecret(key, platform, data.secret)) : null,
        version: data.version,
        leaseUntil: data.refresh_lease_until ? Date.parse(data.refresh_lease_until) : null,
      };
    },

    async lease(platform: Platform, version: number | null, until: number) {
      const leaseUntil = new Date(until).toISOString();
      const now = new Date().toISOString();
      if (version === null) {
        // No row yet: whoever inserts it holds the lease; a second insert is
        // ignored and returns no row.
        const { data, error } = await db.from("social_credentials")
          .upsert({ platform, version: 1, refresh_lease_until: leaseUntil, updated_at: now },
            { onConflict: "platform", ignoreDuplicates: true })
          .select("version");
        if (error) throw new Error(`social credentials lease failed: ${error.code}`);
        return (data ?? []).length === 1 ? 1 : null;
      }
      const { data, error } = await db.from("social_credentials")
        .update({ version: version + 1, refresh_lease_until: leaseUntil, updated_at: now })
        .eq("platform", platform).eq("version", version).select("version");
      if (error) throw new Error(`social credentials lease failed: ${error.code}`);
      return (data ?? []).length === 1 ? version + 1 : null;
    },

    async put(platform: Platform, credential: StoredCredential, version: number) {
      const { data, error } = await db.from("social_credentials").update({
        secret: encryptSecret(key, platform, JSON.stringify(credential)),
        access_expires_at: new Date(credential.accessExpiresAt).toISOString(),
        refresh_expires_at: new Date(credential.refreshExpiresAt).toISOString(),
        version: version + 1,
        refresh_lease_until: null,
        updated_at: new Date().toISOString(),
      }).eq("platform", platform).eq("version", version).select("version");
      if (error) throw new Error(`social credentials write failed: ${error.code}`);
      return (data ?? []).length === 1;
    },
  };
}
