"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { scrubTelemetryUrl } from "@/lib/analytics";

/** Vercel Analytics + Speed Insights, with query strings scrubbed from secret-bearing and admin URLs. */
export function VercelTelemetry() {
  return (
    <>
      <Analytics beforeSend={scrubTelemetryUrl} />
      <SpeedInsights beforeSend={scrubTelemetryUrl} />
    </>
  );
}
