import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import AnnouncementForm from "@/components/admin/AnnouncementForm";

type AnnouncementRow = {
  id: string;
  title: string;
  body: string | null;
  cta_text: string | null;
  cta_url: string | null;
  bg_color: string;
  text_color: string;
  placement: string;
  active: boolean;
  expires_at: string | null;
};

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const result = await supabase
    .from("announcements")
    .select("id, title, body, cta_text, cta_url, bg_color, text_color, placement, active, expires_at")
    .eq("id", id)
    .single();

  const announcement = result.data as AnnouncementRow | null;
  if (!announcement) notFound();

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Link href="/admin/announcements" style={{ color: "var(--ink-soft)", fontSize: 13, textDecoration: "none" }}>
          ← Announcements
        </Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "8px 0 0" }}>Edit Announcement</h1>
      </div>
      <div style={{ background: "white", borderRadius: 12, padding: "32px 36px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <AnnouncementForm announcement={announcement} />
      </div>
    </div>
  );
}
