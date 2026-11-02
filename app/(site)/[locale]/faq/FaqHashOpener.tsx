"use client";

import { useEffect } from "react";

/* Opens the <details> named by the URL hash, so /faq#<id> deep links land on
   an expanded answer. Renders nothing; the accordion itself stays
   server-rendered and works without JS. */
export function FaqHashOpener() {
  useEffect(() => {
    function openFromHash() {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) el.open = true;
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return null;
}
