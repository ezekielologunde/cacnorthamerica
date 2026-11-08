import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/require-admin";
import ActionButton from "@/components/admin/ActionButton";
import { realAdapterFor } from "@/lib/social/adapters";
import { readSocialSettings, type ServiceClient } from "@/lib/social/supabase-store";
import { PLATFORM_LABELS, PLATFORMS, type Platform } from "@/lib/social/types";
import { saveSocialSettings } from "../actions";

const row: React.CSSProperties = { display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.06)" };
const title: React.CSSProperties = { display: "block", fontSize: 14, fontWeight: 700, color: "var(--ink)", margin: 0 };
const note: React.CSSProperties = { display: "block", fontSize: 12.5, color: "var(--ink-soft)", margin: "2px 0 0" };

/** When the stored TikTok refresh token lapses. Only the expiry instant is
 *  read (it is stored in clear); the tokens never are. Null before migration
 *  0027 or the first TikTok post. */
async function readTikTokAuth(db: ServiceClient): Promise<{ when: string; expired: boolean } | null> {
  const { data } = await db.from("social_credentials")
    .select("refresh_expires_at").eq("platform", "tiktok").maybeSingle();
  if (!data) return null;
  const until = new Date(data.refresh_expires_at);
  return {
    when: until.toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "America/New_York" }),
    expired: until.getTime() <= Date.now(),
  };
}

export default async function SocialSettingsPage() {
  const { supabase } = await requireAdmin();
  const settings = await readSocialSettings(supabase).catch(() => null);
  const configured = realAdapterFor(supabase);
  const tiktokAuth = await readTikTokAuth(supabase);

  function connection(p: Platform): string {
    if (!configured(p)) return "Not connected yet: real posts to this platform are logged as skipped.";
    if (p !== "tiktok") return "Connected.";
    const privateNote = process.env.TIKTOK_APP_AUDITED === "true" ? "" : " Posts are PRIVATE until TikTok audits the app.";
    if (!tiktokAuth) return `Connected; TikTok is authorised on the first post.${privateNote}`;
    return tiktokAuth.expired
      ? `Reconnect needed: the TikTok authorisation expired on ${tiktokAuth.when}. Put a new TIKTOK_REFRESH_TOKEN in Vercel.`
      : `Connected; authorisation valid until ${tiktokAuth.when}.${privateNote}`;
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <Link href="/admin/social" style={{ fontSize: 13, color: "var(--ink-soft)" }}>← Social video</Link>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "8px 0 8px" }}>Social posting settings</h1>
      <p style={{ fontSize: 13.5, color: "var(--ink-soft)", margin: "0 0 24px" }}>
        Videos post automatically when submitted, so these switches decide what happens. They are checked again
        right before each platform is posted to: switching something off stops it even mid-run.
      </p>

      {!settings ? (
        <p style={{ color: "#dc2626", fontSize: 13.5 }}>Social posting isn&apos;t set up yet (database migration 0026 not applied).</p>
      ) : (
        <form action={saveSocialSettings} style={{ background: "white", borderRadius: 10, padding: "8px 24px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <label style={row}>
            <input type="checkbox" name="posting_enabled" defaultChecked={settings.postingEnabled} style={{ marginTop: 3 }} />
            <span>
              <span style={title}>Real posting (master switch)</span>
              <span style={note}>Off: nothing is ever posted for real; submissions are logged as skipped. Dry runs still work.</span>
            </span>
          </label>
          <label style={row}>
            <input type="checkbox" name="dry_run" defaultChecked={settings.dryRun} style={{ marginTop: 3 }} />
            <span>
              <span style={title}>Dry run</span>
              <span style={note}>On: the whole process runs with a stand-in, nothing reaches any platform, and the log shows exactly what would have been sent.</span>
            </span>
          </label>
          {PLATFORMS.map((p) => (
            <label key={p} style={row}>
              <input type="checkbox" name={`${p}_enabled`} defaultChecked={settings.platforms[p]} style={{ marginTop: 3 }} />
              <span>
                <span style={title}>{PLATFORM_LABELS[p]}</span>
                <span style={note}>{connection(p)}</span>
              </span>
            </label>
          ))}
          <div style={{ paddingTop: 14 }}>
            <ActionButton style={{ background: "var(--red)", color: "white", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13.5, fontWeight: 700 }}>
              Save settings
            </ActionButton>
          </div>
        </form>
      )}
    </div>
  );
}
