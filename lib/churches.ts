/**
 * Real, individually-researched CACNA member churches — verified via each
 * church's own official website (or, where noted, a single corroborating
 * source) rather than assumed from name alone. `zoneName` must exactly
 * match a `leaders.zone_name` value so ZoneDirectory can group these under
 * the right Superintendent's card.
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
  /** Where this address was verified — kept for future re-verification. */
  source: string;
}

export const MEMBER_CHURCHES: MemberChurch[] = [
  {
    name: "CAC WOSEM — Winners Abundant Chapel",
    address: "11601 Ormandy St, Houston, TX 77035",
    zoneName: "SW Houston",
    source: "cacwosemhoustontx.org",
  },
  {
    name: "CAC Tampa",
    address: "10620 Henderson Road, Tampa, FL 33625",
    zoneName: "Tampa",
    source: "cactampa.com",
  },
  {
    name: "CAC Orlando — Chapel of Praise",
    address: "7008 Forest City Rd, Orlando, FL 32810",
    zoneName: "Orlando",
    source: "cacorlando.com",
  },
  {
    name: "CAC Sanctuary of Power & Praise",
    address: "612 E 2nd St, Irving, TX 75060",
    zoneName: "Texas DCC",
    source: "cacsopp.org",
  },
  {
    name: "CAC First in the Americas — Brooklyn (DCC Headquarters)",
    address: "622 Cortelyou Road, Brooklyn, NY 11218",
    zoneName: "First In The Americas DCC",
    source: "cacfirstintheamericas.org",
  },
  {
    name: "CAC First in the Americas — Mountain of Joy",
    address: "112-17 Francis Lewis Blvd, Jamaica, NY 11429",
    zoneName: "First In The Americas DCC",
    source: "cacfirstintheamericas.org",
  },
  {
    name: "CAC First in the Americas — Mountain of Blessings",
    address: "169B Clinton Avenue, Newark, NJ 07108",
    zoneName: "First In The Americas DCC",
    source: "cacfirstintheamericas.org",
  },
  {
    name: "CAC Bethel Toronto",
    address: "Suite 22, 94 Kenhar Drive, North York, ON",
    zoneName: "Bethel Canada",
    source: "Facebook (CacbethelTO) + CanadaHelps charity registry",
  },
  {
    name: "CAC Vineyard of Comfort — Atlanta",
    address: "1309 Stephenson Rd, Lithonia, GA 30058",
    zoneName: "VOC Atlanta",
    source: "cacvocatl.com (Senior Pastor Z.O. Oloba listed)",
  },
  {
    name: "Christ Apostolic Church of New York",
    address: "160 E 112th St, New York, NY 10029",
    zoneName: "Manhattan DCC",
    source: "Facebook (cacmanhattanny)",
  },
  {
    name: "CAC Powerhouse Atlanta",
    address: "1545 Powers Ferry Road, Marietta, GA 30067",
    zoneName: "Atlanta",
    source: "Facebook + LocalPrayers.com (pastor listed as \"Prophet Kunle Aroniyo\", matches Samson Kunle Aroniyo)",
  },
  {
    name: "CAC Vineyard of Comfort — Dallas (Grand Prairie)",
    address: "2217 W Jefferson St, Grand Prairie, TX",
    zoneName: "VOC Texas",
    source: "cacnorthamerica.com's own Isaac Abiara profile page + TrendyAfrica sanctuary-dedication article",
  },
  {
    name: "CAC God of Elijah",
    address: "612 E 2nd St, Irving, TX 75060",
    zoneName: "Dallas North",
    source: "cacsopp.org (shares a facility with CAC Sanctuary of Power & Praise; Pastor Ezekiel Adebunmi listed as District Superintendent there)",
  },
  {
    name: "CAC Overcomers Chapel",
    address: "15200 McKnew Rd, Burtonsville, MD 20866",
    zoneName: "Cornerstone",
    source: "cacovercomerschapelchurch.org (Lead Pastor Amos Adetobi) + Waze/LoopNet address corroboration",
  },
  {
    name: "CAC Bethel Fellowship — Glenn Dale",
    address: "7513 Northern Ave, Glenn Dale, MD 20769",
    zoneName: "Bethel DCC",
    source: "cacbethelmd.org (Pastor John Oluwatimilehin listed as Chairman in Glenn Dale, MD)",
  },
  {
    name: "CAC Bethel Fellowship — Upper Marlboro",
    address: "8411 Old Marlboro Pike #27, Upper Marlboro, MD 20772",
    zoneName: "Bethel DCC",
    source: "cacbethelmd.org",
  },
  {
    name: "CAC Bethel Fellowship — Halethorpe/Baltimore",
    address: "1667 Knecht Ave, Halethorpe, MD 21227",
    zoneName: "Bethel DCC",
    source: "cacbethelmd.org",
  },
  {
    name: "CAC House of Praise",
    address: "4909 Edmonston Rd, Hyattsville, MD 20781",
    zoneName: "Agbala Itura DCC, USA",
    source: "cachouseofpraise.org — cacnorthamerica.com's own Pastor David Adenodi profile page names this exact address",
  },
  {
    name: "CAC Salvation Center",
    address: "10710 Marriottsville Rd, Randallstown, MD 21133",
    zoneName: "Baltimore DCC",
    source: "cacsalvationcenter.org (Pastor Dr. Hezekiah O. Ilufoye listed as Baltimore DCC Superintendent)",
  },
  {
    name: "Christ Apostolic Church of Miami Inc",
    address: "2601 NW 123rd St, Miami, FL 33167",
    zoneName: "South Florida DCC",
    source: "GuideStar nonprofit filing (IRS Form 990 registered address)",
  },
  {
    name: "CAC New England DCC",
    address: "628 Harvard St, Boston, MA 02126",
    zoneName: "New England DCC",
    source: "BibleTimes.app church directory (exact zone-name match: \"Christ Apostolic Church New England Districts Coordinating Council\")",
  },
  {
    name: "CAC Vineyard of Comfort — Toronto",
    address: "104 Fenmar Drive, North York, ON M9L 1M5",
    zoneName: "Agbala Itura Canada",
    source: "CAC VOC Toronto's own Facebook (\"Pastor Ademola Oyeniyi is the Zonal Coordinator of CAC Vineyard of Comfort, Canada\") + independent Canadian business directories",
  },
  {
    name: "Christ Apostolic Church Mount Pleasant",
    address: "1132 East Tremont Avenue, Bronx, NY 10460",
    zoneName: "Eastern DCC",
    source: "LinkedIn (Olufemi Olaluwoye, Senior Pastor) + Facebook (CACmountpleasant) + nonprofit EIN filing (13-3508326)",
  },
];
