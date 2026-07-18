"use client";

import { useState, useTransition } from "react";
import { createEvent, updateEvent, deleteEvent } from "@/app/admin/(protected)/events/actions";

type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  event_url: string | null;
  published: boolean;
};

const inp: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid rgba(0,0,0,0.12)",
  borderRadius: 8,
  fontSize: 15,
  fontFamily: "inherit",
  background: "white",
  boxSizing: "border-box",
  outline: "none",
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--ink)",
  marginBottom: 6,
};

const muted: React.CSSProperties = { fontWeight: 400, opacity: 0.5 };

export default function EventForm({ event }: { event?: Event }) {
  const isEdit = !!event;
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [eventDate, setEventDate] = useState(event?.event_date ? event.event_date.slice(0, 16) : "");
  const [endDate, setEndDate] = useState(event?.end_date ? event.end_date.slice(0, 16) : "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [eventUrl, setEventUrl] = useState(event?.event_url ?? "");
  const [published, setPublished] = useState(event?.published ?? false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (isEdit) {
          await updateEvent(event.id, formData);
          setSaved(true);
        } else {
          await createEvent(formData);
        }
      } catch (err) {
        if (typeof err === 'object' && err !== null && 'digest' in err) throw err;
        setError(err instanceof Error ? err.message : "Failed to save");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteEvent(event!.id);
      } catch (err) {
        if (typeof err === 'object' && err !== null && 'digest' in err) throw err;
        setError(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 720 }}>
      <style>{`
        .adm-inp { transition: border-color 0.15s, box-shadow 0.15s; }
        .adm-inp:focus-visible { border-color: var(--red); box-shadow: 0 0 0 3px rgba(214,40,40,0.12); }
        .adm-inp:hover:not(:focus-visible) { border-color: rgba(27,19,14,0.24); }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        <div>
          <label style={label}>Title *</label>
          <input name="title" value={title} onChange={(e) => { setTitle(e.target.value); setSaved(false); }} required className="adm-inp" style={inp} />
        </div>

        <div>
          <label style={label}>Description <span style={muted}>— optional</span></label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => { setDescription(e.target.value); setSaved(false); }}
            rows={5}
            className="adm-inp"
            style={{ ...inp, resize: "vertical" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div>
            <label style={label}>Start Date & Time *</label>
            <input
              type="datetime-local"
              name="event_date"
              value={eventDate}
              onChange={(e) => { setEventDate(e.target.value); setSaved(false); }}
              required
              className="adm-inp"
              style={inp}
            />
          </div>
          <div>
            <label style={label}>End Date & Time <span style={muted}>— optional</span></label>
            <input
              type="datetime-local"
              name="end_date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setSaved(false); }}
              className="adm-inp"
              style={inp}
            />
          </div>
        </div>

        <div>
          <label style={label}>Location <span style={muted}>— optional</span></label>
          <input name="location" value={location} onChange={(e) => { setLocation(e.target.value); setSaved(false); }} className="adm-inp" style={inp} placeholder="e.g. CAC Salvation Center, Lagos" />
        </div>

        <div>
          <label style={label}>Registration / Info URL <span style={muted}>— optional</span></label>
          <input type="url" name="event_url" value={eventUrl} onChange={(e) => { setEventUrl(e.target.value); setSaved(false); }} className="adm-inp" style={inp} placeholder="https://…" />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input type="hidden" name="published" value={published ? "true" : "false"} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "var(--ink)" }}>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => { setPublished(e.target.checked); setSaved(false); }}
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            Publish (visible on site)
          </label>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", paddingTop: 8 }}>
          <button
            type="submit"
            disabled={isPending}
            style={{
              background: "var(--red)",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 600,
              cursor: isPending ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: isPending ? 0.65 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Event"}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              style={{
                background: "transparent",
                color: "#dc2626",
                border: "1.5px solid #dc2626",
                borderRadius: 8,
                padding: "9px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: isPending ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              Delete
            </button>
          )}

          {error && <p style={{ color: "#dc2626", fontSize: 14, margin: 0 }}>{error}</p>}
          {saved && <p style={{ color: "#16a34a", fontSize: 14, margin: 0 }}>Saved!</p>}
        </div>

      </div>
    </form>
  );
}
