import { createClient } from "@supabase/supabase-js";
import type { ChurchEvent } from "@/lib/events";

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

type DbEventRow = {
  id: string; title: string; description: string | null;
  event_date: string; end_date: string | null;
  location: string | null; event_url: string | null;
};

function dbEventToChurchEvent(e: DbEventRow): ChurchEvent {
  const start = new Date(e.event_date);
  const end = e.end_date ? new Date(e.end_date) : start;
  const pad = (n: number) => n.toString().padStart(2, "0");
  const toLocal = (dt: Date) =>
    `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00`;
  return {
    id: e.id,
    title: e.title,
    desc: e.description ?? "",
    dateLabel: start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }),
    timeLabel: start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }) + " ET",
    month: MONTHS[start.getUTCMonth()],
    day: pad(start.getUTCDate()),
    startLocal: toLocal(start),
    endLocal: toLocal(end),
    href: e.event_url ?? undefined,
  };
}

/**
 * Events published from /admin/events, shaped like the static ones in
 * lib/events.ts so callers can list both together. Never throws -- returns
 * [] when the database is unreachable.
 */
export async function getPublishedDbEvents(): Promise<ChurchEvent[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    // db.schema: "cacna" -- see lib/supabase/server.ts's comment; without it
    // this silently hits cac-salvation-center's own project instead.
    const { data, error } = await createClient(url, key, { db: { schema: "cacna" } })
      .from("events")
      .select("id, title, description, event_date, end_date, location, event_url")
      .eq("published", true)
      .order("event_date");
    if (error) throw new Error(error.message);
    return (data ?? []).map(dbEventToChurchEvent);
  } catch (err) {
    console.error("[events] published events lookup failed:", err instanceof Error ? err.message : err);
    return [];
  }
}
