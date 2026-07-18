"use client";

import { useActionState, useTransition } from "react";
import { inviteAdmin, removeAdmin, type InviteState } from "./actions";

type Admin = { id: string; email: string; created_at: string };

const INIT: InviteState = { error: "", success: false, email: "" };

export default function AdminsClient({
  admins,
  currentUserId,
}: {
  admins: Admin[];
  currentUserId: string;
}) {
  const [state, formAction, pending] = useActionState(inviteAdmin, INIT);
  const [removing, startRemoving] = useTransition();

  function handleRemove(id: string) {
    startRemoving(() => removeAdmin(id));
  }

  return (
    <>
      <style>{`
        .admin-row:hover { background: rgba(0,0,0,0.025) !important; }
        .remove-btn:hover { background: #fef2f2 !important; color: #dc2626 !important; }
        .invite-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
      `}</style>

      {/* Invite form */}
      <div style={{
        background: "white",
        borderRadius: 14,
        padding: "28px 28px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.07)",
        marginBottom: 32,
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", margin: "0 0 16px" }}>
          Invite a new admin
        </h2>
        <form action={formAction} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            name="email"
            type="email"
            required
            placeholder="pastor@church.org"
            style={{
              flex: 1,
              minWidth: 220,
              padding: "10px 14px",
              borderRadius: 9,
              border: "1.5px solid rgba(0,0,0,0.14)",
              fontSize: 14,
              fontFamily: "inherit",
              color: "var(--ink)",
              outline: "none",
              background: "#fafafa",
            }}
          />
          <button
            type="submit"
            disabled={pending}
            className="invite-btn"
            style={{
              background: "var(--red)",
              color: "white",
              border: "none",
              borderRadius: 9,
              padding: "10px 22px",
              fontSize: 14,
              fontWeight: 600,
              cursor: pending ? "not-allowed" : "pointer",
              opacity: pending ? 0.6 : 1,
              transition: "opacity 0.15s, transform 0.15s",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            {pending ? "Sending…" : "Send Invite"}
          </button>
        </form>

        {/* Feedback */}
        {state.error ? (
          <p style={{ marginTop: 12, fontSize: 13, color: "#dc2626", margin: "10px 0 0" }}>
            {state.error}
          </p>
        ) : null}
        {state.success && (
          <p style={{ marginTop: 12, fontSize: 13, color: "#16a34a", margin: "10px 0 0" }}>
            Invite sent to <strong>{state.email}</strong>. They will receive an email with a sign-in link.
          </p>
        )}
      </div>

      {/* Admin list */}
      <div style={{
        background: "white",
        borderRadius: 14,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.07)",
        overflow: "hidden",
      }}>
        <div style={{ padding: "18px 24px 14px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", margin: 0 }}>
            Current admins <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)", fontFamily: "inherit" }}>({admins.length})</span>
          </h2>
        </div>
        {admins.length === 0 ? (
          <p style={{ padding: "24px", color: "var(--ink-soft)", fontSize: 14, margin: 0 }}>No admins found.</p>
        ) : (
          admins.map((admin, i) => {
            const isSelf = admin.id === currentUserId;
            const joined = new Date(admin.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            return (
              <div
                key={admin.id}
                className="admin-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 24px",
                  borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.05)",
                  transition: "background 0.15s",
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: isSelf ? "rgba(185,28,28,0.12)" : "rgba(0,0,0,0.07)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: isSelf ? "var(--red)" : "rgba(0,0,0,0.45)",
                  flexShrink: 0,
                }}>
                  {admin.email[0].toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 500, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {admin.email}
                    {isSelf && (
                      <span style={{ marginLeft: 8, fontSize: 11, background: "rgba(185,28,28,0.1)", color: "var(--red)", padding: "1px 7px", borderRadius: 10, fontWeight: 600 }}>
                        You
                      </span>
                    )}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--ink-soft)" }}>
                    Added {joined}
                  </p>
                </div>

                {/* Remove */}
                {!isSelf && (
                  <button
                    onClick={() => handleRemove(admin.id)}
                    disabled={removing}
                    className="remove-btn"
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(0,0,0,0.1)",
                      color: "var(--ink-soft)",
                      borderRadius: 8,
                      padding: "6px 14px",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: removing ? "not-allowed" : "pointer",
                      transition: "background 0.15s, color 0.15s",
                      fontFamily: "inherit",
                      opacity: removing ? 0.5 : 1,
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
