import { ArrowRight, Headphones } from "lucide-react";
import { ILORIN_MESSAGES, ILORIN_SHOW_URL, ILORIN_MESSAGES_URL, messageHref } from "@/lib/ilorinMessages";

/** "Messages from Ilorin": Pastor R.T. Owoseni's latest Sunday messages, each
 *  linking to the full message on the Ilorin site, with a Spotify listen link.
 *  A link-out only; the content stays on the Ilorin site. */
export function IlorinMessagesWidget() {
  return (
    <aside aria-label="Messages from Ilorin" style={{
      background: "#fff", border: "1px solid rgba(15,23,42,.1)", borderRadius: 20,
      padding: "22px 24px", marginBottom: 24,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
        <Headphones size={13} strokeWidth={2.5} color="var(--blue)" aria-hidden />
        <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--blue)" }}>
          Messages from Ilorin
        </span>
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.5, margin: "0 0 14px", opacity: 0.75 }}>
        Sunday messages from Pastor R.T. Owoseni, CAC Salvation Centre, Ilorin.
      </p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 14 }}>
        {ILORIN_MESSAGES.map((m) => (
          <li key={m.slug}>
            <a href={messageHref(m)} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15.5, lineHeight: 1.3, textDecoration: "none", color: "inherit" }}>
              {m.topic}
            </a>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{m.date} · {m.texts}</div>
            <a href={m.spotifyUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, fontWeight: 700, color: "var(--blue)", textDecoration: "none" }}>
              Listen on Spotify
            </a>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 16 }}>
        <a href={ILORIN_SHOW_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 12.5, color: "var(--blue)", textDecoration: "none" }}>
          All on Spotify <ArrowRight size={12} strokeWidth={2.5} aria-hidden />
        </a>
        <a href={ILORIN_MESSAGES_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 12.5, color: "var(--blue)", textDecoration: "none" }}>
          Read the messages <ArrowRight size={12} strokeWidth={2.5} aria-hidden />
        </a>
      </div>
    </aside>
  );
}
