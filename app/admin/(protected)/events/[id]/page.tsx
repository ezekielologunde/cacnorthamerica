import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import EventForm from "@/components/admin/EventForm";

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  event_url: string | null;
  published: boolean;
};

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const result = await supabase
    .from("events")
    .select("id, title, description, event_date, end_date, location, event_url, published")
    .eq("id", id)
    .single();

  const event = result.data as EventRow | null;
  if (!event) notFound();

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Link href="/admin/events" style={{ color: "var(--ink-soft)", fontSize: 13, textDecoration: "none" }}>
          ← Events
        </Link>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "8px 0 0" }}>Edit Event</h1>
          {event.published && (
            <Link
              href="/events"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, fontWeight: 600, color: "var(--red)", textDecoration: "none", whiteSpace: "nowrap" }}
            >
              View on site ↗
            </Link>
          )}
        </div>
      </div>
      <div style={{ background: "white", borderRadius: 12, padding: "32px 36px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <EventForm event={event} />
      </div>
    </div>
  );
}
