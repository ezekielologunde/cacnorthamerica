// Pastor R.T. Owoseni's recent Sunday messages from CAC Salvation Centre,
// Ilorin, shown as a "Messages from Ilorin" strip on the blog. Pastor Owoseni
// has agreed to be featured here. Only his own Spotify-matched messages are
// listed, as a link out; the messages themselves stay on the Ilorin site and
// Spotify (canonical there, not copied).
//
// Source: cac-salvation-center repo, lib/ilorinSermons.ts (podcastUrl matched
// by hand against his Spotify show). Refresh this list when new messages land.

export const ILORIN_SHOW_URL = "https://open.spotify.com/show/2VBBGHUo6nMITGmGGrEUoM";
export const ILORIN_SITE_URL = "https://ilorin.cacsalvationcenter.org";
export const ILORIN_MESSAGES_URL = "https://www.cacsalvationcenter.org/ilorin/blog";

export interface IlorinMessage {
  slug: string;
  date: string;
  topic: string;
  texts: string;
  spotifyUrl: string;
}

export const ILORIN_MESSAGES: IlorinMessage[] = [
  { slug: "2026-09-06-dealing-with-anger", date: "September 6, 2026", topic: "Dealing with Anger", texts: "Ecclesiastes 7:9; Proverbs 14:17, 29", spotifyUrl: "https://open.spotify.com/episode/05sccGbnpxx4N4okmm6nvo" },
  { slug: "2026-08-30-the-unchanging-god", date: "August 30, 2026", topic: "The Unchanging God", texts: "Jeremiah 31:3", spotifyUrl: "https://open.spotify.com/episode/5qTbD7IAv0o3zJ6K3FRUfg" },
  { slug: "2026-08-02-confronting-your-giants", date: "August 2, 2026", topic: "Confronting Your Giants", texts: "1 Samuel 17:41; James 4:7", spotifyUrl: "https://open.spotify.com/episode/68vQ1zxIMWc5zzQwpVvDbG" },
];

export const messageHref = (m: IlorinMessage) => `${ILORIN_MESSAGES_URL}/${m.slug}`;
