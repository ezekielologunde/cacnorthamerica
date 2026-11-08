import "server-only";
import type { ServiceClient } from "./supabase-store";
import { decryptSecret, encryptSecret } from "./token-crypto";
import type { CredentialStore, Platform, StoredCredential } from "./types";

// CredentialStore over cacna.social_credentials (migration 0028). The token
// pair is sealed with AES-256-GCM (token-crypto.ts) before it leaves the
// server; only the expiry instants are stored in clear. Service-role client
// only: the table has RLS forced with no policies.

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
      const { data, error } = await db.from("social_credentials").select("secret")
        .eq("platform", platform).maybeSingle();
      if (error) throw new Error(`social credentials read failed: ${error.code}`);
      // A row sealed with another key (or tampered with) reads as absent: the
      // adapter then reports that a reconnect is needed.
      return data ? parse(decryptSecret(key, platform, data.secret)) : null;
    },

    async put(platform: Platform, credential: StoredCredential) {
      const { error } = await db.from("social_credentials").upsert({
        platform,
        secret: encryptSecret(key, platform, JSON.stringify(credential)),
        access_expires_at: new Date(credential.accessExpiresAt).toISOString(),
        refresh_expires_at: new Date(credential.refreshExpiresAt).toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(`social credentials write failed: ${error.code}`);
    },
  };
}
