"use client";
import { useMemo, useState } from "react";
import { LocateFixed, MapPin, Navigation, Phone, Mail, Loader2 } from "lucide-react";
import { MEMBER_CHURCHES, distanceMiles } from "@/lib/churches";
import type { Leader } from "@/lib/leaders";

type Status = "idle" | "locating" | "denied" | "unsupported" | "error" | "done";

const RESULT_COUNT = 6;

export function NearbyChurchFinder({ leaders }: { leaders: Leader[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const leaderByZone = useMemo(() => {
    const map = new Map<string, Leader>();
    for (const l of leaders) if (l.zone_name) map.set(l.zone_name, l);
    return map;
  }, [leaders]);

  const results = useMemo(() => {
    if (!coords) return [];
    return MEMBER_CHURCHES
      .map((c) => ({ church: c, miles: distanceMiles(coords.lat, coords.lng, c.lat, c.lng) }))
      .sort((a, b) => a.miles - b.miles)
      .slice(0, RESULT_COUNT);
  }, [coords]);

  function findNearby() {
    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("done");
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }

  return (
    <div
      style={{
        background: "var(--ink)",
        borderRadius: 24,
        padding: "clamp(28px,4vw,44px)",
        marginBottom: 40,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div aria-hidden style={{ position: "absolute", top: -90, left: -70, width: 380, height: 320, background: "radial-gradient(circle,rgba(200,30,58,.28),transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div style={{ maxWidth: 480 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)" }}>Find a Church Near You</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,32px)", letterSpacing: "-.5px", color: "#fff", margin: "10px 0 0", lineHeight: 1.15 }}>
              Share your location — we'll show the closest member churches.
            </h2>
            <p style={{ fontSize: 14.5, color: "rgba(245,246,250,.68)", margin: "10px 0 0", lineHeight: 1.55 }}>
              Only churches with a verified, sourced address are included — not every zone has one yet.
            </p>
          </div>
          <button
            type="button"
            onClick={findNearby}
            disabled={status === "locating"}
            className="press"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              padding: "13px 24px",
              borderRadius: 999,
              border: "none",
              background: "var(--red)",
              color: "#fff",
              fontSize: 14.5,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: status === "locating" ? "default" : "pointer",
              flexShrink: 0,
              opacity: status === "locating" ? 0.75 : 1,
            }}
          >
            {status === "locating" ? (
              <Loader2 size={17} aria-hidden style={{ animation: "spin-slow .8s linear infinite" }} />
            ) : (
              <LocateFixed size={17} aria-hidden />
            )}
            {status === "locating" ? "Locating…" : "Use my location"}
          </button>
        </div>

        {status === "denied" && (
          <p style={{ marginTop: 20, fontSize: 14, color: "rgba(245,246,250,.75)" }}>
            Location access was denied. You can still browse every zone by scrolling down, or search by name/zone in the directory below.
          </p>
        )}
        {(status === "unsupported" || status === "error") && (
          <p style={{ marginTop: 20, fontSize: 14, color: "rgba(245,246,250,.75)" }}>
            We couldn't get your location just now. Browse every zone below instead.
          </p>
        )}

        {status === "done" && (
          <div style={{ marginTop: 28 }}>
            <p role="status" style={{
              position: "absolute", width: 1, height: 1, padding: 0, margin: -1,
              overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0,
            }}>
              {results.length === 0 ? "No churches found." : `${results.length} church${results.length === 1 ? "" : "es"} found near you.`}
            </p>
            {results.length > 0 && results[0].miles > 150 && (
              <p style={{ fontSize: 13.5, color: "rgba(245,246,250,.65)", marginBottom: 16, lineHeight: 1.5 }}>
                Coverage is still growing — the closest verified church we have is {Math.round(results[0].miles)} miles away. Browse the full directory below in case your zone's Superintendent knows of a closer assembly not yet listed here.
              </p>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
            {results.length === 0 ? (
              <p style={{ fontSize: 14.5, color: "rgba(245,246,250,.75)" }}>No churches found — try the full directory below.</p>
            ) : (
              results.map(({ church, miles }, i) => {
                const leader = leaderByZone.get(church.zoneName);
                return (
                  <div
                    key={church.name + i}
                    style={{
                      background: "rgba(245,246,250,.06)",
                      border: "1px solid rgba(245,246,250,.12)",
                      borderRadius: 16,
                      padding: "18px 18px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".8px", textTransform: "uppercase", color: "var(--gold)" }}>{church.zoneName}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 700, color: "#fff" }}>
                        <Navigation size={12} strokeWidth={2.5} aria-hidden />
                        {miles < 1 ? "< 1 mi" : `${Math.round(miles)} mi`}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{church.name}</div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 5 }}>
                        <MapPin size={13} strokeWidth={2} color="rgba(245,246,250,.55)" aria-hidden style={{ marginTop: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: "rgba(245,246,250,.68)", lineHeight: 1.4 }}>
                          {church.address}
                          {church.approxLocation && " (approximate)"}
                        </span>
                      </div>
                    </div>
                    {leader && (leader.phone || leader.email) && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4, paddingTop: 10, borderTop: "1px solid rgba(245,246,250,.1)" }}>
                        <span style={{ fontSize: 12, color: "rgba(245,246,250,.55)" }}>{leader.full_name} — {leader.title}</span>
                        {leader.phone && (
                          <a href={`tel:${leader.phone.replace(/[^\d+]/g, "")}`} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "#fff", textDecoration: "none" }}>
                            <Phone size={12} strokeWidth={2} aria-hidden /> {leader.phone}
                          </a>
                        )}
                        {leader.email && (
                          <a href={`mailto:${leader.email}`} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "#fff", textDecoration: "none", wordBreak: "break-all" }}>
                            <Mail size={12} strokeWidth={2} aria-hidden /> {leader.email}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
