// The one HTTP helper the platform adapters use. It never throws and never
// hands back text from a failed request: callers see a status and the parsed
// JSON body (which they map to a fixed identifier), or "timeout" / "network".
// Error objects from fetch are dropped here because their messages can carry
// request details.

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export type HttpDeps = {
  fetch: FetchLike;
  /** Per-request timeout. */
  timeoutMs?: number;
};

export type HttpResult =
  | { kind: "response"; status: number; body: unknown }
  | { kind: "timeout" }
  | { kind: "network" };

export const DEFAULT_TIMEOUT_MS = 10_000;

/** `timeoutMs` overrides the deps' per-request timeout for one request that
 *  is known to take longer (Facebook's publish). */
export async function requestJson(deps: HttpDeps, url: string, init: RequestInit, timeoutMs?: number): Promise<HttpResult> {
  const signal = AbortSignal.timeout(timeoutMs ?? deps.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  let res: Response;
  try {
    // redirect: "error" so a token-bearing request is never replayed to
    // another host.
    res = await deps.fetch(url, { ...init, signal, redirect: "error", cache: "no-store" });
  } catch (err) {
    return isTimeout(err, signal) ? { kind: "timeout" } : { kind: "network" };
  }
  let body: unknown = null;
  try {
    body = await res.json();
  } catch (err) {
    // A body cut off by the timeout is a timeout: the outcome is unknown.
    if (isTimeout(err, signal)) return { kind: "timeout" };
    body = null;
  }
  return { kind: "response", status: res.status, body };
}

function isTimeout(err: unknown, signal: AbortSignal): boolean {
  if (signal.aborted) return true;
  const name = err instanceof Error ? err.name : "";
  return name === "TimeoutError" || name === "AbortError";
}

/** Reads a nested field without trusting the body's shape. */
export function field(body: unknown, ...path: string[]): unknown {
  let cur: unknown = body;
  for (const key of path) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur;
}

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
