import type { Tables } from "@/lib/supabase/database.types";
import type {
  Announcement,
  ChurchDirectoryEntry,
  Department,
  EventItem,
  EventPricingTier,
  EventRegistrant,
  EventRegistration,
  EventType,
  Leader,
  LeaderCategory,
  MediaItem,
  RegistrantCategory,
  RegistrationStatus,
  SermonLivestream,
  SiteSettings,
  StreamPlatform,
  Tenet,
} from "./types";

export function mapEvent(row: Tables<"events">): EventItem {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    eventType: row.event_type as EventType,
    startDate: row.start_date,
    endDate: row.end_date,
    location: row.location,
    bannerImageUrl: row.banner_image_url ?? undefined,
    themeText: row.theme_text ?? undefined,
    isPublished: row.is_published,
    isFeatured: row.is_featured,
  };
}

export function mapDepartment(row: Tables<"departments">): Department {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    leaderName: row.leader_name ?? undefined,
    contactEmail: row.contact_email ?? undefined,
    contactPhone: row.contact_phone ?? undefined,
    imageUrl: row.image_url ?? undefined,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
  };
}

export function mapSermonLivestream(
  row: Tables<"sermons_livestreams">,
): SermonLivestream {
  return {
    id: row.id,
    title: row.title,
    speaker: row.speaker ?? "",
    streamUrl: row.stream_url,
    platform: row.platform as StreamPlatform,
    isLive: row.is_live,
    scheduledAt: row.scheduled_at ?? "",
    recordingUrl: row.recording_url ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    isPublished: row.is_published,
  };
}

export function mapAnnouncement(row: Tables<"announcements">): Announcement {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    startsAt: row.starts_at ?? "",
    expiresAt: row.expires_at ?? undefined,
    isPinned: row.is_pinned,
    isPublished: row.is_published,
  };
}

export function mapChurch(row: Tables<"churches">): ChurchDirectoryEntry {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    city: row.city,
    region: row.region,
    country: row.country,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    contactPhone: row.contact_phone ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    category: row.category as "member" | "partner",
    isPublished: row.is_published,
  };
}

export function mapMedia(row: Tables<"media">): MediaItem {
  return {
    id: row.id,
    url: row.url,
    altText: row.alt_text,
    caption: row.caption ?? undefined,
    album: row.album,
    sortOrder: row.sort_order,
  };
}

export function mapSiteSettings(row: Tables<"site_settings">): SiteSettings {
  return {
    churchName: row.church_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    address: row.address,
    facebookUrl: row.facebook_url ?? undefined,
    instagramUrl: row.instagram_url ?? undefined,
    youtubeUrl: row.youtube_url ?? undefined,
    twitterUrl: row.twitter_url ?? undefined,
    prayerLineNumber: row.prayer_line_number ?? undefined,
    prayerLineAccessCode: row.prayer_line_access_code ?? undefined,
    prayerLineTime: row.prayer_line_time ?? undefined,
  };
}

export function mapLeader(row: Tables<"leaders">): Leader {
  return {
    id: row.id,
    fullName: row.full_name,
    title: row.title,
    category: row.category as LeaderCategory,
    bio: row.bio ?? undefined,
    photoUrl: row.photo_url ?? undefined,
    zoneName: row.zone_name ?? undefined,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    tenureStart: row.tenure_start ?? undefined,
    tenureEnd: row.tenure_end ?? undefined,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
  };
}

export function mapTenet(row: Tables<"tenets">): Tenet {
  return {
    id: row.id,
    sortOrder: row.sort_order,
    title: row.title,
    body: row.body,
    isPublished: row.is_published,
  };
}

export function mapEventPricingTier(
  row: Tables<"event_pricing_tiers">,
): EventPricingTier {
  return {
    id: row.id,
    eventId: row.event_id,
    category: row.category as RegistrantCategory,
    priceCents: row.price_cents,
    startsOn: row.starts_on ?? undefined,
    endsOn: row.ends_on ?? undefined,
    sortOrder: row.sort_order,
  };
}

export function mapEventRegistration(
  row: Tables<"event_registrations">,
): EventRegistration {
  return {
    id: row.id,
    eventId: row.event_id,
    registrationType: row.registration_type as "individual" | "group",
    churchName: row.church_name ?? undefined,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone ?? undefined,
    status: row.status as RegistrationStatus,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

export function mapEventRegistrant(
  row: Tables<"event_registrants">,
): EventRegistrant {
  return {
    id: row.id,
    registrationId: row.registration_id,
    fullName: row.full_name,
    category: row.category as RegistrantCategory,
  };
}
