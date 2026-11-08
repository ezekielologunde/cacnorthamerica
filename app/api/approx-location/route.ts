import { NextResponse } from "next/server";

// Coarse, permission-free location for the zone finder. Vercel adds these
// headers from the visitor's IP at the edge; nothing is stored or logged
// here. City-level accuracy at best (VPNs and mobile carriers can be off by
// a state), so the UI labels it approximate.
export const dynamic = "force-dynamic";

function num(v: string | null): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function decode(v: string | null): string {
  if (!v) return "";
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

export async function GET(req: Request) {
  const lat = num(req.headers.get("x-vercel-ip-latitude"));
  const lng = num(req.headers.get("x-vercel-ip-longitude"));
  const headers = { "Cache-Control": "private, no-store" };
  if (lat === null || lng === null) return NextResponse.json({}, { headers });
  return NextResponse.json(
    {
      lat,
      lng,
      city: decode(req.headers.get("x-vercel-ip-city")),
      region: decode(req.headers.get("x-vercel-ip-country-region")),
    },
    { headers },
  );
}
