import { createServiceClient } from "@/lib/supabase/server";
import { archiveContact, unarchiveContact } from "./actions";
import ActionButton from "@/components/admin/ActionButton";
import ForwardToStaff from "@/components/admin/ForwardToStaff";

type ContactRow = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
};

function ContactCard({ item, archived }: { item: ContactRow; archived: boolean }) {
  const date = new Date(item.created_at).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div style={{
      background: "white",
      borderRadius: 10,
      padding: "20px 24px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      opacity: archived ? 0.7 : 1,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", margin: "0 0 2px" }}>
            {item.name}
            {item.subject && (
              <span style={{ fontWeight: 400, color: "var(--ink-soft)", marginLeft: 8, fontSize: 14 }}>
                — {item.subject}
              </span>
            )}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <a
              href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject ?? "Your message to CAC Salvation Center")}`}
              style={{ fontSize: 13, color: "var(--red)", textDecoration: "none", fontWeight: 500 }}
            >
              {item.email}
            </a>
            <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{date}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <a
            href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject ?? "Your message to CAC Salvation Center")}`}
            style={{
              background: "var(--red)",
              color: "white",
              border: "none",
              borderRadius: 6,
              padding: "5px 12px",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Reply
          </a>
          <ForwardToStaff
            subject={`Fwd: ${item.subject ?? "Contact form message"} — from ${item.name}`}
            body={`Forwarding a message from the CAC Salvation Center contact form.\n\nFrom: ${item.name} <${item.email}>\nDate: ${date}\nSubject: ${item.subject ?? "(no subject)"}\n\n${item.message}`}
          />
          <form action={archived ? unarchiveContact.bind(null, item.id) : archiveContact.bind(null, item.id)}>
            <ActionButton style={{
              background: "transparent",
              color: "var(--ink-soft)",
              border: "1px solid rgba(27,19,14,0.15)",
              borderRadius: 6,
              padding: "5px 12px",
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}>
              {archived ? "Unarchive" : "Archive"}
            </ActionButton>
          </form>
        </div>
      </div>
      <p style={{ fontSize: 14, color: "rgba(0,0,0,0.7)", margin: 0, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
        {item.message}
      </p>
    </div>
  );
}

export default async function ContactPage() {
  const supabase = createServiceClient();

  const [activeResult, archivedResult] = await Promise.all([
    supabase
      .from("contact_submissions")
      .select("id, name, email, subject, message, created_at")
      .eq("archived", false)
      .order("created_at", { ascending: true }),
    supabase
      .from("contact_submissions")
      .select("id, name, email, subject, message, created_at")
      .eq("archived", true)
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  const active = (activeResult.data ?? []) as ContactRow[];
  const archived = (archivedResult.data ?? []) as ContactRow[];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 12 }}>
          Contact Inbox
          {active.length > 0 && (
            <span style={{ background: "var(--red)", color: "white", borderRadius: 20, fontSize: 13, fontWeight: 700, padding: "3px 11px" }}>
              {active.length}
            </span>
          )}
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: 0 }}>
          Click Reply or the email address to respond in your mail client.
        </p>
      </div>

      {active.length === 0 ? (
        <div style={{ background: "white", borderRadius: 12, padding: "48px 32px", textAlign: "center", color: "var(--ink-soft)", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <p style={{ fontSize: 16, margin: 0 }}>No unread messages.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
          {active.map((item) => <ContactCard key={item.id} item={item} archived={false} />)}
        </div>
      )}

      {archived.length > 0 && (
        <section>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-soft)", margin: "0 0 14px" }}>
            Archived <span style={{ fontWeight: 400, fontSize: 13 }}>(most recent 30)</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {archived.map((item) => <ContactCard key={item.id} item={item} archived={true} />)}
          </div>
        </section>
      )}
    </div>
  );
}
