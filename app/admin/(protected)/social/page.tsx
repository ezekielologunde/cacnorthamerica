import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/require-admin";
import ActionButton from "@/components/admin/ActionButton";
import { STALE_POSTING_MS } from "@/lib/social/dispatcher";
import { describeCode } from "@/lib/social/messages";
import { readSocialSettings, toTarget, type ServiceClient } from "@/lib/social/supabase-store";
import { PLATFORM_LABELS, PLATFORMS, type SocialSettings, type TargetRecord, type TargetStatus } from "@/lib/social/types";
import { markSocialTargetNotPosted, retrySocialTarget } from "./actions";
import UploadForm from "./UploadForm";

// Server actions on this page publish to up to three platforms in one call;
// give them the plan's maximum (Vercel Hobby: 60 s).
export const maxDuration = 60;

const STATUS_COLORS: Record<TargetStatus, string> = {
  queued: "#6b7280",
  posting: "#d97706",
  posted: "#16a34a",
  failed: "#dc2626",
  skipped: "#6b7280",
};

type LogTarget = TargetRecord & { stale: boolean };
type LogPost = {
  id: string;
  title: string;
  dryRun: boolean;
  createdAt: string;
  videoUrl: string;
  targets: LogTarget[];
};

async function loadLog(db: ServiceClient): Promise<LogPost[]> {
  const { data, error } = await db
    .from("social_posts")
    .select("id, title, dry_run, created_at, video_url, social_post_targets(*)")
    .order("created_at", { ascending: false })
    .limit(25);
  if (error) {
    console.error("[social] log read failed:", error.code);
    return [];
  }
  const staleBefore = Date.now() - STALE_POSTING_MS;
  return (data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    dryRun: p.dry_run,
    createdAt: p.created_at,
    videoUrl: p.video_url,
    targets: p.social_post_targets
      .map(toTarget)
      .sort((a, b) => PLATFORMS.indexOf(a.platform) - PLATFORMS.indexOf(b.platform))
      .map((t) => ({ ...t, stale: t.status === "posting" && !!t.claimedAt && Date.parse(t.claimedAt) <= staleBefore })),
  }));
}

function modeNote(s: SocialSettings): string {
  const on = PLATFORMS.filter((p) => s.platforms[p]).map((p) => PLATFORM_LABELS[p]);
  if (on.length === 0) return "Every platform is switched off in Settings: submissions are logged as skipped.";
  if (s.dryRun) return `Dry run: nothing is really posted. The log shows what would go to ${on.join(", ")}.`;
  if (!s.postingEnabled) return "Real posting is switched off (master switch): submissions are logged as skipped.";
  return `LIVE: submitting posts this video publicly to ${on.join(", ")} straight away.`;
}

const smallBtn: React.CSSProperties = {
  background: "transparent", border: "1.5px solid var(--ink-soft)", color: "var(--ink)",
  borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600,
};

function TargetRow({ t }: { t: LogTarget }) {
  const canRetry = t.status === "failed" && t.retryable;
  const canRelease = (t.status === "failed" && !t.retryable) || t.stale;
  return (
    <tr style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
      <td style={{ padding: "8px 10px 8px 0", fontSize: 13, fontWeight: 600 }}>{PLATFORM_LABELS[t.platform]}</td>
      <td style={{ padding: "8px 10px", fontSize: 12.5 }}>
        <span style={{ color: STATUS_COLORS[t.status], fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3 }}>{t.status}</span>
        {t.attempts > 1 && <span style={{ color: "var(--ink-soft)" }}> ({t.attempts} attempts)</span>}
      </td>
      <td style={{ padding: "8px 10px", fontSize: 12.5, color: "var(--ink-soft)", wordBreak: "break-all" }}>
        {t.platformPostId ?? ""}
        {t.stale ? "Outcome unknown: this has been posting for over 15 minutes. Check the platform." : describeCode(t.errorCode)}
      </td>
      <td style={{ padding: "8px 0 8px 10px", whiteSpace: "nowrap", textAlign: "right" }}>
        {canRetry && (
          <form action={retrySocialTarget.bind(null, t.id)} style={{ display: "inline" }}>
            <ActionButton style={smallBtn}>Retry</ActionButton>
          </form>
        )}
        {canRelease && (
          <form action={markSocialTargetNotPosted.bind(null, t.id)} style={{ display: "inline" }}>
            <ActionButton style={smallBtn}>Not posted, allow retry</ActionButton>
          </form>
        )}
      </td>
    </tr>
  );
}

export default async function SocialPage() {
  const { supabase } = await requireAdmin();
  const settings = await readSocialSettings(supabase).catch(() => null);
  const log = await loadLog(supabase);

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 }}>Social video</h1>
        <Link href="/admin/social/settings" style={{ fontSize: 13.5, fontWeight: 600, color: "var(--red)" }}>Settings</Link>
      </div>
      <p style={{ fontSize: 13.5, color: "var(--ink-soft)", margin: "0 0 24px" }}>
        Upload one video with a title and caption; it posts to the Facebook Page, Instagram Reels and TikTok
        according to Settings. Each video posts at most once per platform.
      </p>

      {settings ? (
        <UploadForm modeNote={modeNote(settings)} />
      ) : (
        <p style={{ color: "#dc2626", fontSize: 13.5 }}>Social posting isn&apos;t set up yet (database migration 0026 not applied).</p>
      )}

      <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", margin: "36px 0 14px" }}>Post log</h2>
      {log.length === 0 && <p style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>Nothing submitted yet.</p>}
      <div style={{ display: "grid", gap: 14 }}>
        {log.map((p) => (
          <section key={p.id} style={{ background: "white", borderRadius: 10, padding: "14px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14.5, color: "var(--ink)" }}>
                {p.dryRun && <span style={{ background: "#e5e7eb", borderRadius: 4, padding: "1px 6px", fontSize: 11, marginRight: 8 }}>DRY RUN</span>}
                {p.title}
              </p>
              <span style={{ fontSize: 12, color: "var(--ink-soft)", whiteSpace: "nowrap" }}>
                {new Date(p.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York" })}
                {" · "}
                <a href={p.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink-soft)" }}>video</a>
              </span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
              <tbody>{p.targets.map((t) => <TargetRow key={t.id} t={t} />)}</tbody>
            </table>
            {p.dryRun && p.targets.some((t) => t.captionSent) && (
              <details style={{ marginTop: 8, fontSize: 12.5 }}>
                <summary style={{ cursor: "pointer", color: "var(--ink-soft)" }}>What would have been sent</summary>
                {p.targets.filter((t) => t.status !== "skipped").map((t) => (
                  <div key={t.id} style={{ marginTop: 8 }}>
                    <strong>{PLATFORM_LABELS[t.platform]}</strong>
                    {t.captionTitle && <div>Title: {t.captionTitle}</div>}
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "4px 0 0", background: "#f9fafb", padding: 8, borderRadius: 6 }}>{t.captionSent}</pre>
                  </div>
                ))}
              </details>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
