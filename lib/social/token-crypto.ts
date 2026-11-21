// Encryption for platform credentials stored in cacna.social_credentials.
// AES-256-GCM with a random 96-bit IV; the platform name is bound in as
// additional authenticated data, so a row copied to another platform won't
// decrypt. The key is SOCIAL_TOKEN_ENCRYPTION_KEY (32 random bytes, base64),
// a server env var only: the database never holds anything it could decrypt
// with on its own.
//
// Format: "v1:<iv>:<tag>:<ciphertext>", each part base64.

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const VERSION = "v1";

/** The key from its env value, or null when unset or not exactly 32 bytes. */
export function parseKey(value: string | undefined): Buffer | null {
  if (!value) return null;
  const key = Buffer.from(value.trim(), "base64");
  return key.length === 32 ? key : null;
}

export function encryptSecret(key: Buffer, aad: string, plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(aad, "utf8"));
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return [VERSION, iv.toString("base64"), cipher.getAuthTag().toString("base64"), ct.toString("base64")].join(":");
}

/** The plaintext, or null when the value is malformed, tampered with, or was
 *  sealed with another key or for another platform. */
export function decryptSecret(key: Buffer, aad: string, sealed: string): string | null {
  const parts = sealed.split(":");
  if (parts.length !== 4 || parts[0] !== VERSION) return null;
  try {
    const [, iv, tag, ct] = parts.map((p) => Buffer.from(p, "base64"));
    if (iv.length !== 12 || tag.length !== 16) return null;
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAAD(Buffer.from(aad, "utf8"));
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}
