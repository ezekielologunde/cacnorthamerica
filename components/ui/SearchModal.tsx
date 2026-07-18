'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Globe, ExternalLink } from 'lucide-react';
import { SEARCH_INDEX, type SearchItem } from '@/lib/search-index';
import { SITE, SITE_URL } from '@/lib/site';

const SITE_HOST = new URL(SITE_URL).host;

const TAG_COLOR: Record<string, string> = {
  Page: 'var(--ink-soft)',
  Blog: 'var(--gold)',
  Event: 'var(--flame)',
  Store: 'var(--red)',
};

const HINTS = ['Prayer', 'Giving', 'Events', 'CACNA', 'Salvation', 'Store'];

function runSearch(q: string): SearchItem[] {
  if (!q.trim()) return [];
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  return SEARCH_INDEX
    .map(item => {
      const title = item.title.toLowerCase();
      const desc = item.desc.toLowerCase();
      const keywords = (item.keywords ?? '').toLowerCase();
      const s = words.reduce((acc, w) => {
        if (title.includes(w)) return acc + 4;
        if (desc.includes(w)) return acc + 2;
        if (keywords.includes(w)) return acc + 1;
        return acc;
      }, 0);
      return { item, s };
    })
    .filter(r => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 8)
    .map(r => r.item);
}

function googleSiteUrl(q: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(`site:${SITE_HOST} ${q}`)}`;
}

function googleWebUrl(q: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(`${SITE.shortName} ${q}`)}`;
}

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const results = runSearch(query);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); return; }
      if (e.key === 'Enter' && results[active]) { router.push(results[active].href); onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, active, onClose, router]);

  useEffect(() => { setActive(0); }, [query]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        role="presentation"
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(27,19,14,.68)',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Site search"
        aria-modal="true"
        style={{
          position: 'fixed', top: '14vh', left: '50%', transform: 'translateX(-50%)',
          zIndex: 201,
          width: 'min(600px, calc(100vw - 32px))',
          background: 'var(--paper)',
          borderRadius: 20,
          boxShadow: '0 28px 80px rgba(27,19,14,.3)',
          border: '1px solid var(--line)',
          overflow: 'hidden',
        }}
      >
        {/* Input row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '15px 18px',
          borderBottom: results.length > 0 ? '1px solid var(--line)' : 'none',
        }}>
          <Search size={18} color="var(--ink-soft)" strokeWidth={2} aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, events, store…"
            aria-label="Search the site"
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 16, fontFamily: 'var(--font-body)',
              background: 'transparent', color: 'var(--ink)',
            }}
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--ink-soft)', display: 'flex' }}
            >
              <X size={16} strokeWidth={2} />
            </button>
          ) : (
            <kbd style={{
              fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)',
              background: 'var(--cream-2)', border: '1px solid var(--line)',
              borderRadius: 6, padding: '2px 7px', whiteSpace: 'nowrap',
            }}>Esc</kbd>
          )}
        </div>

        {/* Results list */}
        {results.length > 0 && (
          <ul role="listbox" style={{ listStyle: 'none', margin: 0, padding: '8px 8px', maxHeight: 400, overflowY: 'auto' }}>
            {results.map((item, i) => (
              <li key={item.href} role="option" aria-selected={i === active}>
                <a
                  href={item.href}
                  onClick={e => { e.preventDefault(); router.push(item.href); onClose(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '11px 14px', borderRadius: 12,
                    textDecoration: 'none',
                    background: i === active ? 'var(--cream-2)' : 'transparent',
                    transition: 'background .12s',
                  }}
                  onMouseEnter={() => setActive(i)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 800, letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        color: TAG_COLOR[item.tag] ?? 'var(--ink-soft)',
                        flexShrink: 0,
                      }}>{item.tag}</span>
                      <span style={{
                        fontWeight: 700, fontSize: 14.5, color: 'var(--ink)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{item.title}</span>
                    </div>
                    <p style={{
                      fontSize: 12.5, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.4,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{item.desc}</p>
                  </div>
                  <ArrowRight size={14} color="var(--ink-soft)" strokeWidth={2.5} aria-hidden style={{ flexShrink: 0 }} />
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* No results */}
        {query.length > 0 && results.length === 0 && (
          <div style={{ padding: '28px 20px 8px', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 14 }}>
            No results for &ldquo;{query}&rdquo; on the site
          </div>
        )}

        {/* Google — site-specific + web results for the same query */}
        {query.trim().length > 0 && (
          <div style={{ padding: '12px 18px 16px', borderTop: '1px solid var(--line)' }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '1.5px',
              textTransform: 'uppercase', color: 'var(--ink-soft)',
              display: 'block', marginBottom: 8,
            }}>Search Google</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <a
                href={googleSiteUrl(query)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 12,
                  textDecoration: 'none',
                  background: 'var(--cream-2)', border: '1px solid var(--line)',
                }}
              >
                <Globe size={15} color="var(--ink-soft)" strokeWidth={2} aria-hidden style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  On cacsalvationcenter.org — &ldquo;{query}&rdquo;
                </span>
                <ExternalLink size={13} color="var(--ink-soft)" strokeWidth={2.5} aria-hidden style={{ flexShrink: 0 }} />
              </a>
              <a
                href={googleWebUrl(query)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 12,
                  textDecoration: 'none',
                  background: 'var(--cream-2)', border: '1px solid var(--line)',
                }}
              >
                <Globe size={15} color="var(--ink-soft)" strokeWidth={2} aria-hidden style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Across the web — &ldquo;{SITE.shortName} {query}&rdquo;
                </span>
                <ExternalLink size={13} color="var(--ink-soft)" strokeWidth={2.5} aria-hidden style={{ flexShrink: 0 }} />
              </a>
            </div>
          </div>
        )}

        {/* Quick-link chips */}
        {!query && (
          <div style={{ padding: '14px 18px 18px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '1.5px',
              textTransform: 'uppercase', color: 'var(--ink-soft)',
              width: '100%', marginBottom: 4,
            }}>Quick links</span>
            {HINTS.map(hint => (
              <button
                key={hint}
                onClick={() => setQuery(hint)}
                style={{
                  fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)',
                  background: 'var(--cream-2)', border: '1px solid var(--line)',
                  borderRadius: 999, padding: '6px 14px', cursor: 'pointer',
                }}
              >
                {hint}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
