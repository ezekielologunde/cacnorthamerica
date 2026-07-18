// Inline brand glyphs — lucide-react removed its brand icons, so we ship our own.
// Color follows `currentColor`; size via the `size` prop.

export function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.95c0-.9.25-1.5 1.55-1.5h1.65V3.65c-.3-.04-1.3-.13-2.45-.13-2.43 0-4.1 1.48-4.1 4.2v2.18H7.45V13h2.7v8h3.35z" />
    </svg>
  );
}

export function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function YoutubeIcon({ size = 19 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="5.5" width="20" height="13" rx="4" fill="currentColor" />
      <path d="M10 9.3 15 12l-5 2.7z" fill="#fff" />
    </svg>
  );
}

export function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.5 3c.3 1.9 1.4 3.4 3.2 4.1.6.2 1.2.4 1.8.4v3.1c-1.8 0-3.5-.6-4.9-1.6v6.6a6.2 6.2 0 1 1-6.2-6.2c.34 0 .67.03 1 .09v3.2c-.32-.1-.65-.16-1-.16a3.1 3.1 0 1 0 3.1 3.1V3h3z" />
    </svg>
  );
}
