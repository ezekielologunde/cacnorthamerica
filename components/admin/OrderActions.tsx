"use client";

import { useState, useTransition } from "react";
import { markShipped, updateNotes, resendDownloadLink } from "@/app/admin/(protected)/orders/actions";

interface Props {
  orderId: string;
  status: string;
  notes: string | null;
  trackingNumber: string | null;
  shippedAt: string | null;
  hasDigital: boolean;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
}

export default function OrderActions({ orderId, status, notes, trackingNumber, shippedAt, hasDigital }: Props) {
  const [localNotes, setLocalNotes] = useState(notes ?? "");
  const [notesFeedback, setNotesFeedback] = useState<"saved" | "error" | null>(null);
  const [notesError, setNotesError] = useState("");
  const [notesPending, startNotesTrans] = useTransition();

  const [tracking, setTracking] = useState("");
  const [shippedFeedback, setShippedFeedback] = useState("");
  const [shipPending, startShipTrans] = useTransition();

  const [downloadFeedback, setDownloadFeedback] = useState("");
  const [downloadPending, startDownloadTrans] = useTransition();

  function saveNotes() {
    startNotesTrans(async () => {
      const res = await updateNotes(orderId, localNotes);
      if (res.ok) {
        setNotesFeedback("saved");
        setNotesError("");
        setTimeout(() => setNotesFeedback(null), 2000);
      } else {
        setNotesFeedback("error");
        setNotesError(res.error ?? "Failed to save.");
      }
    });
  }

  function sendDownload() {
    startDownloadTrans(async () => {
      const res = await resendDownloadLink(orderId);
      setDownloadFeedback(res.ok ? "Download link sent!" : (res.error ?? "Something went wrong."));
    });
  }

  function ship() {
    startShipTrans(async () => {
      const res = await markShipped(orderId, tracking);
      if (res.ok) {
        setShippedFeedback("Order marked as shipped. Customer notified.");
      } else {
        setShippedFeedback(res.error ?? "Something went wrong.");
      }
    });
  }

  const cardStyle: React.CSSProperties = {
    background: "white",
    borderRadius: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    overflow: "hidden",
    marginBottom: 16,
  };

  const cardHeaderStyle: React.CSSProperties = {
    padding: "14px 20px",
    borderBottom: "1px solid rgba(0,0,0,0.07)",
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    color: "var(--ink-soft)",
    margin: 0,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  };

  const cardBodyStyle: React.CSSProperties = {
    padding: "16px 20px",
  };

  return (
    <>
      {/* Digital download */}
      {hasDigital && (
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <p style={cardTitleStyle}>Digital Download</p>
          </div>
          <div style={cardBodyStyle}>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "0 0 12px", lineHeight: 1.6 }}>
              This order contains digital items. The download link is emailed automatically after payment. Use the button below to resend it.
            </p>
            <button
              onClick={sendDownload}
              disabled={downloadPending}
              style={{
                padding: "8px 18px",
                background: "var(--ink)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: downloadPending ? "not-allowed" : "pointer",
                opacity: downloadPending ? 0.6 : 1,
              }}
            >
              {downloadPending ? "Sending…" : "Resend Download Link"}
            </button>
            {downloadFeedback && (
              <p style={{ fontSize: 13, margin: "10px 0 0", fontWeight: 600, color: downloadFeedback.includes("sent") ? "#15803d" : "#dc2626" }}>
                {downloadFeedback}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <p style={cardTitleStyle}>Notes</p>
        </div>
        <div style={cardBodyStyle}>
          <textarea
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            placeholder="Add internal notes..."
            style={{
              width: "100%",
              minHeight: 90,
              padding: "10px 12px",
              fontSize: 13,
              color: "var(--ink)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              resize: "vertical",
              fontFamily: "inherit",
              background: "#fafafa",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
            <button
              onClick={saveNotes}
              disabled={notesPending}
              style={{
                padding: "8px 18px",
                background: "var(--ink)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: notesPending ? "not-allowed" : "pointer",
                opacity: notesPending ? 0.6 : 1,
              }}
            >
              {notesPending ? "Saving…" : "Save Notes"}
            </button>
            {notesFeedback === "saved" && (
              <span style={{ fontSize: 13, color: "#15803d", fontWeight: 600 }}>Saved ✓</span>
            )}
            {notesFeedback === "error" && (
              <span style={{ fontSize: 13, color: "#dc2626" }}>{notesError}</span>
            )}
          </div>
        </div>
      </div>

      {/* Shipping — hidden for refunded orders */}
      {status !== "refunded" && (
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <p style={cardTitleStyle}>Shipping</p>
          </div>
          <div style={cardBodyStyle}>
            {status === "shipped" ? (
              <div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#dcfce7",
                    color: "#15803d",
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  ✓ Shipped
                </span>
                {trackingNumber && (
                  <p style={{ fontSize: 13, color: "var(--ink)", margin: "0 0 4px" }}>
                    <span style={{ color: "var(--ink-soft)", marginRight: 6 }}>Tracking:</span>
                    <strong>{trackingNumber}</strong>
                  </p>
                )}
                {shippedAt && (
                  <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0 }}>
                    {formatDate(shippedAt)}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder="Tracking number (optional)"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    fontSize: 13,
                    color: "var(--ink)",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    fontFamily: "inherit",
                    background: "#fafafa",
                    boxSizing: "border-box",
                    marginBottom: 10,
                  }}
                />
                <button
                  onClick={ship}
                  disabled={shipPending}
                  style={{
                    padding: "9px 20px",
                    background: "var(--ink)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: shipPending ? "not-allowed" : "pointer",
                    opacity: shipPending ? 0.6 : 1,
                  }}
                >
                  {shipPending ? "Marking…" : "Mark as Shipped"}
                </button>
                {shippedFeedback && (
                  <p style={{ fontSize: 13, color: "#15803d", margin: "10px 0 0", fontWeight: 600 }}>
                    {shippedFeedback}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
