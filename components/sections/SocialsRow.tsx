import type { ReactNode } from "react";
import { InstagramIcon, TikTokIcon, XIcon } from "@/components/ui/SocialIcons";
import { youthSocialLinks, type SocialLink, type SocialPlatform } from "@/lib/youthSocials";
import "./home-refresh.css";

/* X first: it is CACNA's main account; the other two belong to the youth ministry. */
const ORDER: SocialPlatform[] = ["x", "instagram", "tiktok"];

const PLATFORM: Partial<Record<SocialPlatform, { name: string; icon: ReactNode }>> = {
  x: { name: "X", icon: <XIcon size={18} /> },
  instagram: { name: "Instagram", icon: <InstagramIcon size={18} /> },
  tiktok: { name: "TikTok", icon: <TikTokIcon size={18} /> },
};

const OWNER_LABEL: Record<SocialLink["owner"], string> = {
  cacna: "CACNA's main account",
  youth: "Youth ministry",
};

/** CACNA's X account and the youth ministry's Instagram and TikTok, from lib/youthSocials.ts. */
export function SocialsRow() {
  const links = youthSocialLinks()
    .filter((l) => ORDER.includes(l.platform))
    .sort((a, b) => ORDER.indexOf(a.platform) - ORDER.indexOf(b.platform));
  if (links.length === 0) return null;

  return (
    <section aria-labelledby="socials-heading" style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px) clamp(64px,8vw,110px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 28, borderTop: "1px solid var(--line)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px 28px" }}>
        <h2 id="socials-heading" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: "-.3px", margin: 0 }}>
          Follow along
        </h2>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 10 }}>
          {links.map((l) => {
            const p = PLATFORM[l.platform];
            if (!p) return null;
            const owner = OWNER_LABEL[l.owner];
            return (
              <li key={l.platform}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hm-social"
                  aria-label={`${p.name} ${l.handle}, ${owner} (opens in a new tab)`}
                >
                  <span aria-hidden style={{ display: "inline-flex", color: "var(--ink)" }}>{p.icon}</span>
                  <span style={{ fontWeight: 700, color: "var(--ink)" }}>{l.handle}</span>
                  <span style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>{owner}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
