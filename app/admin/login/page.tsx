"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loginAction } from "./actions";

const orbs = [
  { cx: "10%",  cy: "20%", r: 320, delay: 0 },
  { cx: "85%",  cy: "70%", r: 260, delay: 1.4 },
  { cx: "60%",  cy: "10%", r: 180, delay: 0.7 },
  { cx: "25%",  cy: "80%", r: 200, delay: 2.1 },
];

export default function AdminLogin() {
  const router = useRouter();
  const [state, action, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state && "success" in state && state.success) {
      router.push("/admin");
    }
  }, [state, router]);

  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const unauthorized = urlParams?.get("error") === "unauthorized";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--ink)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Animated ambient orbs */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} aria-hidden>
        {orbs.map((o, i) => (
          <motion.circle
            key={i}
            cx={o.cx} cy={o.cy} r={o.r}
            fill={i % 2 === 0 ? "var(--red)" : "#7c1d1d"}
            opacity={0}
            style={{ filter: "blur(80px)" }}
            animate={{ opacity: [0, 0.12, 0.07, 0.14, 0], scale: [1, 1.15, 0.95, 1.1, 1] }}
            transition={{ duration: 8 + i * 1.5, delay: o.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>

      {/* Cross watermark */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.03, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <svg width="600" height="600" viewBox="0 0 100 100" fill="white">
          <rect x="44" y="10" width="12" height="80" rx="2" />
          <rect x="20" y="30" width="60" height="12" rx="2" />
        </svg>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "var(--cream)",
          borderRadius: 20,
          padding: "52px 44px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          <div style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "var(--red)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 24px rgba(185,28,28,0.4)",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", margin: 0 }}
          >
            Admin Login
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            style={{ color: "var(--ink)", fontSize: 13, marginTop: 6 }}
          >
            CAC Salvation Center
          </motion.p>
        </motion.div>

        {/* Unauthorized banner */}
        <AnimatePresence>
          {unauthorized && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                borderRadius: 10,
                padding: "12px 16px",
                color: "#dc2626",
                fontSize: 14,
                overflow: "hidden",
              }}
            >
              Access denied. You are not an authorized admin.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form action={action} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { label: "Email", name: "email", type: "email", autoComplete: "email", delay: 0.3 },
            { label: "Password", name: "password", type: "password", autoComplete: "current-password", delay: 0.38 },
          ].map((field) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: field.delay, duration: 0.4, ease: "easeOut" }}
              style={{ marginBottom: 20 }}
            >
              <label style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: 7,
                letterSpacing: "0.01em",
              }}>
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                required
                autoComplete={field.autoComplete}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1.5px solid rgba(0,0,0,0.13)",
                  borderRadius: 10,
                  fontSize: 15,
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  background: "white",
                  color: "var(--ink)",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--red)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.13)"; }}
              />
            </motion.div>
          ))}

          <AnimatePresence>
            {state?.error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ color: "#dc2626", fontSize: 14, margin: "-4px 0 16px" }}
              >
                {state.error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46, duration: 0.4 }}
          >
            <motion.button
              type="submit"
              disabled={isPending}
              whileHover={{ scale: isPending ? 1 : 1.02 }}
              whileTap={{ scale: isPending ? 1 : 0.97 }}
              style={{
                width: "100%",
                background: isPending ? "#999" : "var(--red)",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "13px 24px",
                fontSize: 15,
                fontWeight: 600,
                cursor: isPending ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                boxShadow: isPending ? "none" : "0 4px 16px rgba(185,28,28,0.35)",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
            >
              {isPending ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    style={{ display: "inline-block", width: 14, height: 14, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%" }}
                  />
                  Signing in…
                </span>
              ) : "Sign In"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
