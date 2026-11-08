/**
 * Featured media stories -- YouTube videos shown in the "Featured stories"
 * band (components/sections/FeaturedStories.tsx) on /about, /history and
 * /online. Add a new story by appending to FEATURED_STORIES.
 *
 * Only the video id is used to build URLs, and only toward YouTube's own
 * hosts, so a malformed id or a non-YouTube channel link is dropped rather
 * than rendered.
 */
export interface FeaturedStory {
  /** The 11-character YouTube video id. */
  id: string;
  title: string;
  /** Channel name, as shown in the visible credit. */
  channel: string;
  /** https://www.youtube.com/@... link to the channel. */
  channelUrl: string;
}

export const FEATURED_STORIES: FeaturedStory[] = [
  {
    id: "eRYo76wMwAk",
    title: "The Mistakes That Almost Cost Him His Ministry | Pastor Dr. T.A.O. Agbeja | Ancient Alters #0001",
    channel: "Ancient Alters, What Alters You?",
    channelUrl: "https://www.youtube.com/@WhatAltersYou",
  },
  {
    id: "qKcigj55p2s",
    title: "I do hawk and did houseboy when I was a young boy",
    channel: "Pastor S.O. Oladele",
    channelUrl: "https://www.youtube.com/@PastorSOOladele",
  },
  {
    id: "coylqNHgHwE",
    title: "Succession Without Suspicion || Analysis Session || 2026 CAC Pastors' Conference",
    channel: "Pastor S.O. Oladele",
    channelUrl: "https://www.youtube.com/@PastorSOOladele",
  },
];

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const CHANNEL_URL = /^https:\/\/www\.youtube\.com\/@[A-Za-z0-9._-]+$/;

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/** Stories safe to render: valid video id and a YouTube channel link. */
export function featuredStories(): FeaturedStory[] {
  return FEATURED_STORIES.filter((s) => YOUTUBE_ID.test(s.id) && CHANNEL_URL.test(s.channelUrl));
}
