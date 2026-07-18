export type EventType = "convention" | "service" | "special";

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventType: EventType;
  startDate: string;
  endDate: string;
  location: string;
  bannerImageUrl?: string;
  themeText?: string;
  isPublished: boolean;
  isFeatured: boolean;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  leaderName?: string;
  contactEmail?: string;
  contactPhone?: string;
  imageUrl?: string;
  sortOrder: number;
  isPublished: boolean;
}

export type StreamPlatform = "youtube" | "facebook" | "zoom" | "other";

export interface SermonLivestream {
  id: string;
  title: string;
  speaker: string;
  streamUrl: string;
  platform: StreamPlatform;
  isLive: boolean;
  scheduledAt: string;
  recordingUrl?: string;
  thumbnailUrl?: string;
  isPublished: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  startsAt: string;
  expiresAt?: string;
  isPinned: boolean;
  isPublished: boolean;
}

export interface ChurchDirectoryEntry {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string;
  country: string;
  lat?: number;
  lng?: number;
  contactPhone?: string;
  websiteUrl?: string;
  category: "member" | "partner";
  isPublished: boolean;
}

export interface MediaItem {
  id: string;
  url: string;
  altText: string;
  caption?: string;
  album: string;
  sortOrder: number;
}

export interface SiteContentEntry {
  pageKey: string;
  sectionKey: string;
  content: string;
}

export interface SiteSettings {
  churchName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  prayerLineNumber?: string;
  prayerLineAccessCode?: string;
  prayerLineTime?: string;
}

export type LeaderCategory =
  | "cacna_regional"
  | "global_hq"
  | "zonal_superintendent"
  | "past_president"
  | "past_superintendent"
  | "past_evangelist";

export interface Leader {
  id: string;
  fullName: string;
  title: string;
  category: LeaderCategory;
  bio?: string;
  photoUrl?: string;
  zoneName?: string;
  phone?: string;
  email?: string;
  tenureStart?: string;
  tenureEnd?: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface Tenet {
  id: string;
  sortOrder: number;
  title: string;
  body: string;
  isPublished: boolean;
}

export type RegistrantCategory = "adult" | "young_adult" | "child";

export interface EventPricingTier {
  id: string;
  eventId: string;
  category: RegistrantCategory;
  priceCents: number;
  startsOn?: string;
  endsOn?: string;
  sortOrder: number;
}

export type RegistrationStatus = "pending" | "confirmed" | "cancelled";

export interface EventRegistration {
  id: string;
  eventId: string;
  registrationType: "individual" | "group";
  churchName?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  status: RegistrationStatus;
  notes?: string;
  createdAt: string;
}

export interface EventRegistrant {
  id: string;
  registrationId: string;
  fullName: string;
  category: RegistrantCategory;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: "super_admin" | "editor";
  isActive: boolean;
}

export interface Database {
  events: EventItem[];
  departments: Department[];
  sermonsLivestreams: SermonLivestream[];
  announcements: Announcement[];
  churches: ChurchDirectoryEntry[];
  media: MediaItem[];
  siteContent: SiteContentEntry[];
  siteSettings: SiteSettings;
  adminUsers: AdminUser[];
}
