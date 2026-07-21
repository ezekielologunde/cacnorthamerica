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
];
