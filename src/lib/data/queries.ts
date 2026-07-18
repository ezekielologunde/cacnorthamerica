import { createClient } from "@/lib/supabase/server";
import { slugify } from "./slug";
import {
  mapAnnouncement,
  mapChurch,
  mapDepartment,
  mapEvent,
  mapEventPricingTier,
  mapEventRegistrant,
  mapEventRegistration,
  mapLeader,
  mapMedia,
  mapSermonLivestream,
  mapSiteSettings,
  mapTenet,
} from "./mappers";
import type {
  Announcement,
  ChurchDirectoryEntry,
  Department,
  EventItem,
  EventPricingTier,
  EventRegistrant,
  EventRegistration,
  Leader,
  LeaderCategory,
  MediaItem,
  RegistrationStatus,
  SermonLivestream,
  SiteSettings,
  Tenet,
} from "./types";

// ---------- Public reads ----------

export async function getFeaturedEvent(): Promise<EventItem | undefined> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .limit(1)
    .maybeSingle();
  return data ? mapEvent(data) : undefined;
}

export async function getUpcomingEvents(): Promise<EventItem[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("end_date", today)
    .order("start_date", { ascending: true });
  return (data ?? []).map(mapEvent);
}

export async function getEventBySlug(
  slug: string,
): Promise<EventItem | undefined> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data ? mapEvent(data) : undefined;
}

export async function getDepartments(): Promise<Department[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("departments")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  return (data ?? []).map(mapDepartment);
}

export async function getDepartmentBySlug(
  slug: string,
): Promise<Department | undefined> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("departments")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data ? mapDepartment(data) : undefined;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .order("is_pinned", { ascending: false });
  return (data ?? []).map(mapAnnouncement);
}

export async function getLiveStreams(): Promise<SermonLivestream[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sermons_livestreams")
    .select("*")
    .eq("is_published", true)
    .order("is_live", { ascending: false });
  return (data ?? []).map(mapSermonLivestream);
}

export async function getChurches(): Promise<ChurchDirectoryEntry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("churches")
    .select("*")
    .eq("is_published", true);
  return (data ?? []).map(mapChurch);
}

export async function getSiteContent(
  pageKey: string,
  sectionKey: string,
): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("page_key", pageKey)
    .eq("section_key", sectionKey)
    .maybeSingle();
  return data?.content ?? "";
}

export async function getAllSiteContent() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("*")
    .order("page_key", { ascending: true });
  return data ?? [];
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", true)
    .single();
  return mapSiteSettings(data!);
}

export async function getMedia(): Promise<MediaItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []).map(mapMedia);
}

// ---------- Admin reads (include unpublished) ----------

export async function getAllEvents(): Promise<EventItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: true });
  return (data ?? []).map(mapEvent);
}

export async function getEventById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ? mapEvent(data) : undefined;
}

export async function getAllDepartments(): Promise<Department[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("departments")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []).map(mapDepartment);
}

export async function getDepartmentById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("departments")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ? mapDepartment(data) : undefined;
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapAnnouncement);
}

export async function getAnnouncementById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ? mapAnnouncement(data) : undefined;
}

export async function getAllLiveStreams(): Promise<SermonLivestream[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sermons_livestreams")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapSermonLivestream);
}

export async function getLiveStreamById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sermons_livestreams")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ? mapSermonLivestream(data) : undefined;
}

export async function getAllChurches(): Promise<ChurchDirectoryEntry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("churches")
    .select("*")
    .order("city", { ascending: true });
  return (data ?? []).map(mapChurch);
}

export async function getChurchById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("churches")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ? mapChurch(data) : undefined;
}

// ---------- Admin mutations ----------

export async function upsertEvent(
  input: Omit<EventItem, "id" | "slug"> & { id?: string },
) {
  const supabase = await createClient();
  const record = {
    title: input.title,
    description: input.description,
    event_type: input.eventType,
    start_date: input.startDate,
    end_date: input.endDate,
    location: input.location,
    theme_text: input.themeText ?? null,
    is_published: input.isPublished,
    is_featured: input.isFeatured,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    await supabase.from("events").update(record).eq("id", input.id);
  } else {
    await supabase
      .from("events")
      .insert({ ...record, slug: slugify(input.title) });
  }
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);
}

export async function upsertDepartment(
  input: Omit<Department, "id" | "slug"> & { id?: string },
) {
  const supabase = await createClient();
  const record = {
    name: input.name,
    description: input.description,
    leader_name: input.leaderName ?? null,
    contact_email: input.contactEmail ?? null,
    contact_phone: input.contactPhone ?? null,
    sort_order: input.sortOrder,
    is_published: input.isPublished,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    await supabase.from("departments").update(record).eq("id", input.id);
  } else {
    await supabase
      .from("departments")
      .insert({ ...record, slug: slugify(input.name) });
  }
}

export async function deleteDepartment(id: string) {
  const supabase = await createClient();
  await supabase.from("departments").delete().eq("id", id);
}

export async function upsertAnnouncement(
  input: Omit<Announcement, "id"> & { id?: string },
) {
  const supabase = await createClient();
  const record = {
    title: input.title,
    body: input.body,
    starts_at: input.startsAt || null,
    expires_at: input.expiresAt || null,
    is_pinned: input.isPinned,
    is_published: input.isPublished,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    await supabase.from("announcements").update(record).eq("id", input.id);
  } else {
    await supabase.from("announcements").insert(record);
  }
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient();
  await supabase.from("announcements").delete().eq("id", id);
}

export async function upsertLiveStream(
  input: Omit<SermonLivestream, "id"> & { id?: string },
) {
  const supabase = await createClient();
  const record = {
    title: input.title,
    speaker: input.speaker || null,
    stream_url: input.streamUrl,
    platform: input.platform,
    is_live: input.isLive,
    scheduled_at: input.scheduledAt || null,
    recording_url: input.recordingUrl ?? null,
    is_published: input.isPublished,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    await supabase
      .from("sermons_livestreams")
      .update(record)
      .eq("id", input.id);
  } else {
    await supabase.from("sermons_livestreams").insert(record);
  }
}

export async function deleteLiveStream(id: string) {
  const supabase = await createClient();
  await supabase.from("sermons_livestreams").delete().eq("id", id);
}

export async function upsertChurch(
  input: Omit<ChurchDirectoryEntry, "id"> & { id?: string },
) {
  const supabase = await createClient();
  const record = {
    name: input.name,
    address: input.address,
    city: input.city,
    region: input.region,
    country: input.country,
    contact_phone: input.contactPhone ?? null,
    website_url: input.websiteUrl ?? null,
    category: input.category,
    is_published: input.isPublished,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    await supabase.from("churches").update(record).eq("id", input.id);
  } else {
    await supabase.from("churches").insert(record);
  }
}

export async function deleteChurch(id: string) {
  const supabase = await createClient();
  await supabase.from("churches").delete().eq("id", id);
}

export async function updateSiteSettings(input: SiteSettings) {
  const supabase = await createClient();
  await supabase
    .from("site_settings")
    .update({
      church_name: input.churchName,
      contact_email: input.contactEmail,
      contact_phone: input.contactPhone,
      address: input.address,
      facebook_url: input.facebookUrl ?? null,
      instagram_url: input.instagramUrl ?? null,
      youtube_url: input.youtubeUrl ?? null,
      twitter_url: input.twitterUrl ?? null,
      prayer_line_number: input.prayerLineNumber ?? null,
      prayer_line_access_code: input.prayerLineAccessCode ?? null,
      prayer_line_time: input.prayerLineTime ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);
}

export async function updateSiteContent(
  pageKey: string,
  sectionKey: string,
  content: string,
) {
  const supabase = await createClient();
  await supabase.from("site_content").upsert(
    {
      page_key: pageKey,
      section_key: sectionKey,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "page_key,section_key" },
  );
}

export async function addMedia(input: Omit<MediaItem, "id">) {
  const supabase = await createClient();
  await supabase.from("media").insert({
    url: input.url,
    alt_text: input.altText,
    caption: input.caption ?? null,
    album: input.album,
    sort_order: input.sortOrder,
  });
}

export async function deleteMedia(id: string) {
  const supabase = await createClient();
  await supabase.from("media").delete().eq("id", id);
}

// ---------- Leaders ----------

export async function getLeadersByCategory(
  category: LeaderCategory,
): Promise<Leader[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leaders")
    .select("*")
    .eq("category", category)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  return (data ?? []).map(mapLeader);
}

export async function getLeaderById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leaders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ? mapLeader(data) : undefined;
}

export async function getAllLeaders(): Promise<Leader[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leaders")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });
  return (data ?? []).map(mapLeader);
}

export async function upsertLeader(
  input: Omit<Leader, "id"> & { id?: string },
) {
  const supabase = await createClient();
  const record = {
    full_name: input.fullName,
    title: input.title,
    category: input.category,
    bio: input.bio || null,
    photo_url: input.photoUrl || null,
    zone_name: input.zoneName || null,
    phone: input.phone || null,
    email: input.email || null,
    tenure_start: input.tenureStart || null,
    tenure_end: input.tenureEnd || null,
    sort_order: input.sortOrder,
    is_published: input.isPublished,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    await supabase.from("leaders").update(record).eq("id", input.id);
  } else {
    await supabase.from("leaders").insert(record);
  }
}

export async function deleteLeader(id: string) {
  const supabase = await createClient();
  await supabase.from("leaders").delete().eq("id", id);
}

// ---------- Tenets ----------

export async function getTenets(): Promise<Tenet[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tenets")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  return (data ?? []).map(mapTenet);
}

export async function getAllTenets(): Promise<Tenet[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tenets")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []).map(mapTenet);
}

export async function getTenetById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tenets")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ? mapTenet(data) : undefined;
}

export async function upsertTenet(input: Omit<Tenet, "id"> & { id?: string }) {
  const supabase = await createClient();
  const record = {
    sort_order: input.sortOrder,
    title: input.title,
    body: input.body,
    is_published: input.isPublished,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    await supabase.from("tenets").update(record).eq("id", input.id);
  } else {
    await supabase.from("tenets").insert(record);
  }
}

export async function deleteTenet(id: string) {
  const supabase = await createClient();
  await supabase.from("tenets").delete().eq("id", id);
}

// ---------- Event pricing tiers ----------

export async function getPricingTiersForEvent(
  eventId: string,
): Promise<EventPricingTier[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_pricing_tiers")
    .select("*")
    .eq("event_id", eventId)
    .order("sort_order", { ascending: true });
  return (data ?? []).map(mapEventPricingTier);
}

export async function upsertPricingTier(
  input: Omit<EventPricingTier, "id"> & { id?: string },
) {
  const supabase = await createClient();
  const record = {
    event_id: input.eventId,
    category: input.category,
    price_cents: input.priceCents,
    starts_on: input.startsOn || null,
    ends_on: input.endsOn || null,
    sort_order: input.sortOrder,
  };

  if (input.id) {
    await supabase.from("event_pricing_tiers").update(record).eq("id", input.id);
  } else {
    await supabase.from("event_pricing_tiers").insert(record);
  }
}

export async function deletePricingTier(id: string) {
  const supabase = await createClient();
  await supabase.from("event_pricing_tiers").delete().eq("id", id);
}

// ---------- Event registrations (public insert, admin read/manage) ----------

export async function submitRegistration(input: {
  eventId: string;
  registrationType: "individual" | "group";
  churchName?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  registrants: Array<{ fullName: string; category: string }>;
}) {
  const supabase = await createClient();
  const registrationId = crypto.randomUUID();

  // No public SELECT policy exists on event_registrations (only admins can
  // read submissions), so a Supabase insert().select() would fail its
  // RETURNING clause under RLS — generate the id up front instead.
  const { error } = await supabase.from("event_registrations").insert({
    id: registrationId,
    event_id: input.eventId,
    registration_type: input.registrationType,
    church_name: input.churchName || null,
    contact_name: input.contactName,
    contact_email: input.contactEmail,
    contact_phone: input.contactPhone || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (input.registrants.length > 0) {
    await supabase.from("event_registrants").insert(
      input.registrants.map((r) => ({
        registration_id: registrationId,
        full_name: r.fullName,
        category: r.category,
      })),
    );
  }

  return registrationId;
}

export async function getRegistrationsForEvent(
  eventId: string,
): Promise<EventRegistration[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_registrations")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapEventRegistration);
}

export async function getAllRegistrations(): Promise<EventRegistration[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_registrations")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapEventRegistration);
}

export async function getRegistrantsForRegistration(
  registrationId: string,
): Promise<EventRegistrant[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_registrants")
    .select("*")
    .eq("registration_id", registrationId);
  return (data ?? []).map(mapEventRegistrant);
}

export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
) {
  const supabase = await createClient();
  await supabase
    .from("event_registrations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
}
