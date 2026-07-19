import { createServiceClient } from "@/lib/supabase/server";
import { fetchLatestCandidates, approveNews, rejectNews, unpublishNews } from "./actions";
import ActionButton from "@/components/admin/ActionButton";

type Row = {
  id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  source_url: string;
  published_at: string | null;
  fetched_at: string;
};

function Card({ item, status }: { item: Row; status: "pending" | "approved" | "rejected" }) {
  const date = item.published_at
    ? new Date(item.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <div style={{
      background: status === "pending" ? "#fffaf5" : "white",
      borderRadius: 10,
      padding: "18px 22px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      display: "flex",
      gap: 16,
    }}>
      {item.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image_url} alt="" width={96} height={72}
          style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0, background: "#eee" }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", margin: 0 }}>{item.title}</p>
            <a href={item.source_url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: "var(--ink-soft)" }}>
              {item.source_url} ↗
            </a>
            {date && <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "2px 0 0" }}>{date}</p>}
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {status === "pending" && (
              <>
                <form action={approveNews.bind(null, item.id)}>
                  <ActionButton style={{ background: "#16a34a", color: "white", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600 }}>
                    Approve
                  </ActionButton>
                </form>
                <form action={rejectNews.bind(null, item.id)}>
                  <ActionButton style={{ background: "transparent", color: "#dc2626", border: "1.5px solid #dc2626", borderRadius: 6, padding: "5px 14px", fontSize: 13, fontWeight: 600 }}>
                    Reject
                  </ActionButton>
                </form>
              </>
            )}
            {status === "approved" && (
              <form action={unpublishNews.bind(null, item.id)}>
                <ActionButton style={{ background: "transparent", color: "#dc2626", border: "1.5px solid #dc2626", borderRadius: 6, padding: "5px 14px", fontSize: 13, fontWeight: 600 }}>
                  Unpublish
                </ActionButton>
              </form>
            )}
            {status === "rejected" && (
              <form action={approveNews.bind(null, item.id)}>
                <ActionButton style={{ background: "#16a34a", color: "white", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600 }}>
                  Approve anyway
                </ActionButton>
              </form>
            )}
          </div>
        </div>
        {item.excerpt && (
          <p style={{ fontSize: 13.5, color: "rgba(0,0,0,0.65)", margin: "8px 0 0", lineHeight: 1.6 }}>
            {item.excerpt}
          </p>
        )}
      </div>
    </div>
  );
}

export default async function CacWorldNewsPage() {
  const supabase = createServiceClient();
  const { data: rows } = await supabase
    .from("cac_world_news")
    .select("id, title, excerpt, image_url, source_url, published_at, fetched_at, status")
    .order("fetched_at", { ascending: false });

  const all = rows ?? [];
  const pending = all.filter((r) => r.status === "pending");
  const approved = all.filter((r) => r.status === "approved");
  const rejected = all.filter((r) => r.status === "rejected");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 }}>CAC World News</h1>
        <form action={async () => { "use server"; await fetchLatestCandidates(); }}>
          <ActionButton style={{ background: "var(--red)", color: "white", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13.5, fontWeight: 700 }}>
            Fetch latest from CAC World News
          </ActionButton>
        </form>
      </div>
      <p style={{ fontSize: 13.5, color: "var(--ink-soft)", margin: "0 0 28px" }}>
        Pulls recent articles from cacworldnews.com. Review each one and approve only what&apos;s relevant to CACNA
        or North America — approved articles show as summary cards on{" "}
        <a href="/blog" target="_blank" rel="noopener noreferrer" style={{ color: "var(--red)" }}>the public blog</a>,
        linking back to the original on CAC World News.
      </p>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 10 }}>
          Pending Review
          {!!pending.length && (
            <span style={{ background: "#d97706", color: "white", borderRadius: 20, fontSize: 12, fontWeight: 700, padding: "2px 9px" }}>
              {pending.length}
            </span>
          )}
        </h2>
        {!pending.length ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>Nothing pending. Fetch the latest to check for new articles.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pending.map((r) => <Card key={r.id} item={r} status="pending" />)}
          </div>
        )}
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", margin: "0 0 14px" }}>
          Approved <span style={{ fontWeight: 400, color: "var(--ink-soft)", fontSize: 14 }}>(live on /blog)</span>
        </h2>
        {!approved.length ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>No approved articles yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {approved.map((r) => <Card key={r.id} item={r} status="approved" />)}
          </div>
        )}
      </section>

      {!!rejected.length && (
        <section>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", margin: "0 0 14px" }}>Rejected</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {rejected.map((r) => <Card key={r.id} item={r} status="rejected" />)}
          </div>
        </section>
      )}
    </div>
  );
}
