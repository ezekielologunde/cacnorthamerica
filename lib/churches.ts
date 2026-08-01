/**
 * Real, individually-researched CACNA member churches — verified via each
 * church's own official website (or, where noted, a single corroborating
 * source) rather than assumed from name alone. `zoneName` must exactly
 * match a `leaders.zone_name` value so ZoneDirectory can group these under
 * the right Superintendent's card.
 *
 * `lat`/`lng` are geocoded from `address` (OpenStreetMap Nominatim, one-time
 * lookup — not stored elsewhere) so the "Find a Church Near You" search can
 * compute real distances. Where the exact street address didn't resolve,
 * `approxLocation: true` marks the coordinate as a ZIP-code centroid — close
 * enough to sort by proximity, not exact enough to pin on a map.
 *
 * This is a first pass covering the highest-confidence finds from a
 * research sweep across all 24 zones — most zones don't have a verified
 * entry yet (many "Christ Apostolic Church"-named results collide with
 * unrelated denominations, and several zones had no address found at all,
 * a gap that predates this file — CACNA's own prior site left the same
 * fields blank). Add more zones here as they're individually verified;
 * never add a church without a real, checkable source.
 */
export interface MemberChurch {
  name: string;
  address: string;
  zoneName: string;
  lat: number;
  lng: number;
  /** True when lat/lng is a ZIP-code centroid, not the exact street address. */
  approxLocation?: boolean;
  /** Where this address was verified — kept for future re-verification. */
  source: string;
}

export const MEMBER_CHURCHES: MemberChurch[] = [
  {
    name: "CAC WOSEM — Winners Abundant Chapel",
    address: "11601 Ormandy St, Houston, TX 77035",
    zoneName: "SW Houston",
    lat: 29.6405123,
    lng: -95.505556,
    source: "cacwosemhoustontx.org",
  },
  {
    name: "C.A.C Camp of God Family",
    address: "5225 Timber Creek Place Drive, Houston, TX 77084",
    zoneName: "SW Houston",
    lat: 29.837197,
    lng: -95.6862857,
    approxLocation: true,
    source: "campofgod.org (also known as CAC Revival Center) — exact street address didn't resolve, ZIP 77084 centroid used instead",
  },
  {
    name: "Christ Apostolic Church Tampa Bay",
    address: "10620 Henderson Road, Tampa, FL 33625",
    zoneName: "Tampa",
    lat: 28.0659533,
    lng: -82.5589481,
    approxLocation: true,
    source: "cactampa.com",
  },
  {
    name: "CAC Orlando — Chapel of Praise",
    address: "7008 Forest City Rd, Orlando, FL 32810",
    zoneName: "Orlando",
    lat: 28.6233373,
    lng: -81.4180341,
    approxLocation: true,
    source: "cacorlando.com",
  },
  {
    name: "CAC Sanctuary of Power & Praise",
    address: "612 E 2nd St, Irving, TX 75060",
    zoneName: "Texas DCC",
    lat: 32.8126951,
    lng: -96.939617,
    source: "cacsopp.org",
  },
  {
    name: "CAC First in the Americas — Brooklyn (DCC Headquarters)",
    address: "622 Cortelyou Road, Brooklyn, NY 11218",
    zoneName: "First In The Americas DCC",
    lat: 40.6385091,
    lng: -73.9725676,
    source: "cacfirstintheamericas.org",
  },
  {
    name: "CAC First in the Americas — Mountain of Joy",
    address: "112-17 Francis Lewis Blvd, Jamaica, NY 11429",
    zoneName: "First In The Americas DCC",
    lat: 40.7038388,
    lng: -73.7493143,
    source: "cacfirstintheamericas.org",
  },
  {
    name: "CAC First in the Americas — Mountain of Blessings",
    address: "169B Clinton Avenue, Newark, NJ 07108",
    zoneName: "First In The Americas DCC",
    lat: 40.7232501,
    lng: -74.1875622,
    source: "cacfirstintheamericas.org",
  },
  {
    name: "CAC Bethel Toronto",
    address: "Suite 22, 94 Kenhar Drive, North York, ON",
    zoneName: "Bethel Canada",
    lat: 43.76119,
    lng: -79.54832,
    source: "Facebook (CacbethelTO) + CanadaHelps charity registry",
  },
  {
    name: "CAC Vineyard of Comfort — Atlanta",
    address: "1309 Stephenson Rd, Lithonia, GA 30058",
    zoneName: "VOC Atlanta",
    lat: 33.7355079,
    lng: -84.1306466,
    approxLocation: true,
    source: "cacvocatl.com (Senior Pastor Z.O. Oloba listed)",
  },
  {
    name: "Christ Apostolic Church of New York",
    address: "160 E 112th St, New York, NY 10029",
    zoneName: "Manhattan DCC",
    lat: 40.7955799,
    lng: -73.943019,
    source: "Facebook (cacmanhattanny)",
  },
  {
    name: "CAC Powerhouse Atlanta",
    address: "1545 Powers Ferry Road, Marietta, GA 30067",
    zoneName: "Atlanta",
    lat: 33.915253,
    lng: -84.4651893,
    source: "Facebook + LocalPrayers.com (pastor listed as \"Prophet Kunle Aroniyo\", matches Samson Kunle Aroniyo)",
  },
  {
    name: "CAC Vineyard of Comfort — Dallas (Grand Prairie)",
    address: "2217 W Jefferson St, Grand Prairie, TX",
    zoneName: "VOC Texas",
    lat: 32.7391356,
    lng: -97.034777,
    source: "cacnorthamerica.com's own Isaac Abiara profile page + TrendyAfrica sanctuary-dedication article",
  },
  {
    name: "CAC God of Elijah",
    address: "612 E 2nd St, Irving, TX 75060",
    zoneName: "Dallas North",
    lat: 32.8126951,
    lng: -96.939617,
    source: "cacsopp.org (shares a facility with CAC Sanctuary of Power & Praise; Pastor Ezekiel Adebunmi listed as District Superintendent there)",
  },
  {
    name: "CAC Overcomers Chapel",
    address: "15200 McKnew Rd, Burtonsville, MD 20866",
    zoneName: "Cornerstone",
    lat: 39.1047387,
    lng: -76.9200852,
    source: "cacovercomerschapelchurch.org (Lead Pastor Amos Adetobi) + Waze/LoopNet address corroboration",
  },
  {
    name: "CAC Bethel Fellowship — Glenn Dale",
    address: "7513 Northern Ave, Glenn Dale, MD 20769",
    zoneName: "Bethel DCC",
    lat: 38.9935298,
    lng: -76.8196684,
    source: "cacbethelmd.org (Pastor John Oluwatimilehin listed as Chairman in Glenn Dale, MD)",
  },
  {
    name: "CAC Bethel Fellowship — Upper Marlboro",
    address: "8411 Old Marlboro Pike #27, Upper Marlboro, MD 20772",
    zoneName: "Bethel DCC",
    lat: 38.8335676,
    lng: -76.8624076,
    source: "cacbethelmd.org",
  },
  {
    name: "CAC Bethel Fellowship — Halethorpe/Baltimore",
    address: "1667 Knecht Ave, Halethorpe, MD 21227",
    zoneName: "Bethel DCC",
    lat: 39.2576372,
    lng: -76.6776535,
    source: "cacbethelmd.org",
  },
  {
    name: "CAC House of Praise",
    address: "4909 Edmonston Rd, Hyattsville, MD 20781",
    zoneName: "Agbala Itura DCC, USA",
    lat: 38.9480473,
    lng: -76.9263464,
    source: "cachouseofpraise.org — cacnorthamerica.com's own Pastor David Adenodi profile page names this exact address",
  },
  {
    name: "CAC Salvation Center",
    address: "10710 Marriottsville Rd, Randallstown, MD 21133",
    zoneName: "Baltimore DCC",
    lat: 39.3779701,
    lng: -76.850497,
    source: "cacsalvationcenter.org (Pastor Dr. Hezekiah O. Ilufoye listed as Baltimore DCC Superintendent)",
  },
  {
    name: "CAC Palace of Peace",
    address: "1451 North Rolling Road, Baltimore, MD 21228",
    zoneName: "Baltimore DCC",
    lat: 39.2958918,
    lng: -76.7532192,
    source: "cacpalaceofpeace.org — cacsalvationcenter.org names it as a sister assembly within the Baltimore DCC family",
  },
  {
    name: "Salvation City",
    address: "8330 Pulaski Hwy Suite F, Rosedale, MD 21237",
    zoneName: "Baltimore DCC",
    lat: 39.3104563,
    lng: -76.5298035,
    source: "city.cacsalvationcenter.org — cacsalvationcenter.org's own sister-assembly subdomain",
  },
  {
    name: "Christ Apostolic Church of Miami Inc",
    address: "2601 NW 123rd St, Miami, FL 33167",
    zoneName: "South Florida DCC",
    lat: 25.8869368,
    lng: -80.2419193,
    source: "GuideStar nonprofit filing (IRS Form 990 registered address)",
  },
  {
    name: "Christ Apostolic Church Mt. Zion 1",
    address: "628 Harvard St, Mattapan, MA 02126",
    zoneName: "New England DCC",
    lat: 42.2836777,
    lng: -71.098005,
    source: "cacmtzion1church.org — the church's own site names it \"CAC Mt. Zion 1,\" serving the Boston community since 1982 (corrects an earlier BibleTimes.app directory guess that used the zone's administrative name instead)",
  },
  {
    name: "Christ Apostolic Church Overcomers Center",
    address: "48 Green St, Brockton, MA 02301",
    zoneName: "New England DCC",
    lat: 42.0845938,
    lng: -71.0212661,
    source: "theovercomerscenter.com (Pastor Isaiah Anifowose)",
  },
  {
    name: "CAC Vineyard of Comfort — Toronto",
    address: "104 Fenmar Drive, North York, ON M9L 1M5",
    zoneName: "Agbala Itura Canada",
    lat: 43.7593432,
    lng: -79.5480601,
    source: "CAC VOC Toronto's own Facebook (\"Pastor Ademola Oyeniyi is the Zonal Coordinator of CAC Vineyard of Comfort, Canada\") + independent Canadian business directories",
  },
  {
    name: "Christ Apostolic Church Mount Pleasant",
    address: "1132 East Tremont Avenue, Bronx, NY 10460",
    zoneName: "Eastern DCC",
    lat: 40.8397111,
    lng: -73.8761091,
    source: "LinkedIn (Olufemi Olaluwoye, Senior Pastor) + Facebook (CACmountpleasant) + nonprofit EIN filing (13-3508326)",
  },
  {
    name: "Christ Apostolic Church — Agape Fellowship",
    address: "1505 Bloomfield Ave, Halethorpe, MD 21227",
    zoneName: "North Washington",
    lat: 39.2432094,
    lng: -76.6752431,
    approxLocation: true,
    source: "LinkedIn (Pastor Abayomi \"Yomi\" Ademuwagun's listed church role) + ZoomInfo (based in Halethorpe, MD)",
  },
  {
    name: "Christ Apostolic Church WDCC",
    address: "8159 S Exchange Ave, Chicago, IL 60617",
    zoneName: "Western DCC",
    lat: 41.7465862,
    lng: -87.5525195,
    source: "Yelp (listed by name as \"CHRIST APOSTOLIC CHURCH WDCC\" — \"WDCC\" directly matching the Western DCC zone name) + GuideStar/ChurchFinder.com/Yahoo Local corroborating the same block under \"Christ Apostolic Church of Illinois\"",
  },
  {
    name: "Christ Apostolic Church Kingdom Embassy",
    address: "8733 Frankford Ave, Philadelphia, PA 19136",
    zoneName: "Philadelphia",
    lat: 40.0486237,
    lng: -75.0127433,
    source: "Multiple aggregator/directory listings (Yelp, Google Business) naming this address for a Philadelphia-based \"Christ Apostolic Church\" congregation",
  },
];

/** Great-circle distance in miles between two lat/lng points (haversine). */
export function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
