"use client";

import { useFormStatus } from "react-dom";

export default function ActionButton({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{ fontFamily: "inherit", ...style, opacity: pending ? 0.65 : 1, cursor: pending ? "not-allowed" : "pointer" }}
    >
      {children}
    </button>
  );
}
