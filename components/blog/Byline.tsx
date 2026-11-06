import Image from "next/image";
import type { BlogAuthor } from "@/lib/blog-authors";
import { joinNames } from "@/lib/blog-authors";

function initials(name: string): string {
  const words = name
    .replace(/\b(Pastor|Prophet|Evang\.?|Mrs\.?|Rt\.?|Rev\.?|Prof\.?|Dr\.?|Apostle|Bishop|The)\b/gi, "")
    .replace(/[.,]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  return ((words[0]?.[0] ?? "?") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

function Avatar({ a, size }: { a: BlogAuthor; size: number }) {
  const box = { width: size, height: size, borderRadius: "50%", flexShrink: 0, overflow: "hidden", background: "var(--cream-2)", border: "2px solid var(--paper)", boxSizing: "border-box" as const };
  if (a.photo) {
    // Plain <img>: profile pictures may be uploaded to any approved host and are tiny.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={a.photo} alt="" width={size} height={size} style={{ ...box, objectFit: "cover", objectPosition: "center 20%", display: "block" }} />;
  }
  return (
    <span aria-hidden style={{ ...box, display: "grid", placeItems: "center", fontSize: size * 0.36, fontWeight: 800, color: "var(--ink-soft)" }}>
      {initials(a.name)}
    </span>
  );
}

/** Compact: overlapping avatars + names on one line, for story rows. */
export function BylineCompact({ authors }: { authors?: BlogAuthor[] }) {
  if (!authors || authors.length === 0) {
    return (
      <span className="ed-by-compact">
        <Image src="/images/logo.png" alt="" width={22} height={22} style={{ borderRadius: 6 }} />
        <span>CACNA</span>
      </span>
    );
  }
  return (
    <span className="ed-by-compact">
      <span className="ed-by-stack">
        {authors.map((a, i) => (
          <span key={a.name + i} style={{ marginLeft: i ? -8 : 0 }}>
            <Avatar a={a} size={24} />
          </span>
        ))}
      </span>
      <span>{joinNames(authors)}</span>
    </span>
  );
}

/** Full: one block per publisher with picture, name and role, for article headers. */
export function BylineFull({ authors }: { authors?: BlogAuthor[] }) {
  const list: BlogAuthor[] =
    authors && authors.length > 0
      ? authors
      : [{ name: "CACNA", role: "Christ Apostolic Church North America", photo: "/images/logo.png" }];
  return (
    <div className="ed-by-full" aria-label={`Published by ${joinNames(list)}`}>
      <span className="ed-by-label">Published by</span>
      <ul>
        {list.map((a, i) => (
          <li key={a.name + i}>
            <Avatar a={a} size={48} />
            <span>
              <strong>{a.name}</strong>
              {a.role && <small>{a.role}</small>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
