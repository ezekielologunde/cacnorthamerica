"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render(el: HTMLElement, options: Record<string, unknown>): string;
  remove(widgetId: string): void;
  reset(widget?: string | HTMLElement): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let loading: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile missing")));
    script.onerror = () => {
      loading = null;
      reject(new Error("turnstile failed to load"));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/** Ask for a fresh token after a submission fails (each token works once).
 *  Resets only the widget inside `form`: a page can hold several, such as a
 *  page form plus the footer newsletter. */
export function resetTurnstile(form: HTMLFormElement | null): void {
  const box = form?.querySelector<HTMLElement>("[data-turnstile]");
  if (box) window.turnstile?.reset(box);
}

/** Cloudflare Turnstile for a form. Renders nothing unless
 *  NEXT_PUBLIC_TURNSTILE_WIDGET_ID is set. Cloudflare's script adds and refreshes
 *  a hidden `cf-turnstile-response` input inside the widget, so
 *  FormData(form) carries the token. "interaction-only" keeps it invisible
 *  unless Cloudflare wants a challenge. */
export function TurnstileField() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_WIDGET_ID;
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    let widgetId: string | undefined;
    loadTurnstile()
      .then((api) => {
        if (cancelled || !box.current) return;
        widgetId = api.render(box.current, {
          sitekey: siteKey,
          appearance: "interaction-only",
        });
      })
      .catch((e) => console.error("[turnstile]", e));
    return () => {
      cancelled = true;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [siteKey]);

  if (!siteKey) return null;
  return <div ref={box} data-turnstile="" />;
}
