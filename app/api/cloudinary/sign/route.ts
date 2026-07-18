import { createHash } from "crypto";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Must be an admin — not merely an authenticated Supabase user
  const service = createServiceClient();
  const { data: profile } = await service
    .from("admin_profiles").select("id").eq("id", user.id).single();
  if (!profile) return Response.json({ error: "Forbidden" }, { status: 403 });

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  if (!apiSecret || !apiKey) {
    return Response.json({ error: "Cloudinary not configured" }, { status: 503 });
  }

  const paramsToSign: Record<string, string | number> = await req.json();

  const sorted = Object.keys(paramsToSign)
    .sort()
    .map((k) => `${k}=${paramsToSign[k]}`)
    .join("&");

  const signature = createHash("sha1").update(sorted + apiSecret).digest("hex");

  return Response.json({ signature, api_key: apiKey });
}
