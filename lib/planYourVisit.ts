// Ported from the Convention site's lib/content/{hotels,travel,rules,
// nearby-essentials}.ts during the Phase E content merge (2026-09) -- this
// is a genuine net-new page, CACNA had no equivalent before this. Content
// is specific to CAC Village / the Annual Convention, not CACNA generally.

export type Hotel = {
  name: string;
  city: string;
  phone: string;
  ratePerNight: number;
  booking: "online" | "call";
};

// Group code for all of these: "Christ Apostolic Church CACNA".
export const HOTEL_GROUP_CODE = "Christ Apostolic Church CACNA";

export const hotels: Hotel[] = [
  { name: "Comfort Inn Greencastle", city: "Chambersburg, PA", phone: "717-798-3578", ratePerNight: 139, booking: "online" },
  { name: "La Quinta", city: "Chambersburg, PA", phone: "717-446-0770", ratePerNight: 139, booking: "call" },
  { name: "Super 8 By Wyndham I-81", city: "Chambersburg, PA", phone: "717-263-6655", ratePerNight: 75, booking: "call" },
  { name: "Holiday Inn Express", city: "Chambersburg, PA", phone: "717-709-9009", ratePerNight: 141, booking: "online" },
  { name: "Holiday Inn Express", city: "Gettysburg, PA", phone: "717-420-2686", ratePerNight: 189, booking: "online" },
  { name: "Sleep Inn & Suites", city: "Gettysburg, PA", phone: "717-398-2670", ratePerNight: 129, booking: "call" },
  { name: "Aspire Hotel", city: "Gettysburg, PA", phone: "717-321-3311", ratePerNight: 139, booking: "online" },
  { name: "Hampton Inn", city: "Gettysburg, PA", phone: "717-338-9121", ratePerNight: 205, booking: "call" },
  { name: "Eisenhower Hotel & Conference Center", city: "Gettysburg, PA", phone: "717-334-2755", ratePerNight: 139, booking: "online" },
  { name: "Hampton Inn", city: "Hagerstown, MD", phone: "240-420-1970", ratePerNight: 139, booking: "online" },
];

export type Airport = { name: string; code?: string; distanceMiles: number; recommended?: boolean };

export const airports: Airport[] = [
  { name: "Baltimore-Washington International", code: "BWI", distanceMiles: 77, recommended: true },
  { name: "Hagerstown Regional Airport", distanceMiles: 19 },
  { name: "Frederick Municipal Airport", distanceMiles: 27 },
  { name: "Harrisburg International Airport", distanceMiles: 64 },
];

export const drivingRoute = "BWI → I-195 → I-95 → I-695 → I-70 → I-270 → US-15 → local roads to CAC Village";
export const drivingRouteAltNote = "A shorter alternative from BWI: I-95 → MD-140 W, saving roughly 10 miles over the route above.";
export const groundTransportNote =
  "CAC Village sits in a rural, wooded area — rideshare coverage is unreliable, and the nearest shuttle (BayRunner, between BWI and Hagerstown) stops 20–30 minutes short of the venue. Renting a car, or riding with another attendee, is strongly recommended.";
export const budgetLodgingNote = "Rooms from around $40/night are sometimes available via discount travel sites like Hotwire.";
export const remotenessNote = "CAC Village sits within Michaux State Forest, an 85,000-acre wooded area on South Mountain.";

export const weather = {
  averageHighF: 85,
  averageLowF: 68,
  note: "July is the muggiest month of the year here, with meaningful rain on roughly 1 in 3 days. Warm, humid days and cooler evenings — pack breathable clothing, a light rain layer, and sun protection.",
};

export const packingChecklist = [
  "Breathable, warm-weather clothing for hot, humid days",
  "A light rain layer or umbrella",
  "Sunscreen and a hat",
  "Comfortable shoes for walking the grounds",
  "A light jacket or sweater for cooler evenings",
  "Cash, in case a nearby stop doesn't take cards",
];

export type NearbyEssential = {
  name: string;
  address: string;
  area: string;
  category: "food" | "groceriesPharmacy" | "gas";
};

// Closest first: Blue Ridge Summit itself, then the Rouzerville/Buchanan
// Trail East corridor a few minutes further, then Waynesboro proper
// (~10-15 min out), then Smithsburg, MD as an alternate direction.
// Deliberately not exhaustive -- a curated, verifiable list beats a padded one.
export const nearbyEssentials: NearbyEssential[] = [
  { name: "Blue Ridge Food Mart", address: "Buchanan Trail East", area: "Blue Ridge Summit, PA", category: "groceriesPharmacy" },
  { name: "Sunoco", address: "15010 Buchanan Trail East", area: "Blue Ridge Summit, PA", category: "gas" },
  { name: "C&T / Exxon", address: "11055 Buchanan Trail East", area: "Rouzerville, PA", category: "gas" },
  { name: "Red Run Grill", address: "11227 Buchanan Trail East", area: "Rouzerville, PA", category: "food" },
  { name: "Christine's Cafe", address: "11119 Buchanan Trail East", area: "Rouzerville, PA", category: "food" },
  { name: "Michaux Brewing Company", address: "11582 Buchanan Trail East", area: "Rouzerville, PA", category: "food" },
  { name: "Brother's Pizza", address: "11755 Buchanan Trail East", area: "Rouzerville, PA", category: "food" },
  { name: "Walmart Supercenter", address: "12751 Washington Township Blvd", area: "Waynesboro, PA", category: "groceriesPharmacy" },
  { name: "Martin's Food Market", address: "708 E Main St", area: "Waynesboro, PA", category: "groceriesPharmacy" },
  { name: "CVS Pharmacy", address: "406 E Main St", area: "Waynesboro, PA", category: "groceriesPharmacy" },
  { name: "Rite Aid Pharmacy", address: "1513 E Main St", area: "Waynesboro, PA", category: "groceriesPharmacy" },
  { name: "Main Street Family Diner", address: "1543 E Main St", area: "Waynesboro, PA", category: "food" },
  { name: "The Waynesburger", address: "100 W Main St", area: "Waynesboro, PA", category: "food" },
  { name: "New York Pizza Express", address: "304 W Main St", area: "Waynesboro, PA", category: "food" },
  { name: "Trigger's Table & Taproom", address: "118 Walnut St", area: "Waynesboro, PA", category: "food" },
  { name: "Martin's / Giant", address: "22401 Jefferson Blvd", area: "Smithsburg, MD", category: "groceriesPharmacy" },
  { name: "Smithsburg Pharmacy", address: "22026 Jefferson Blvd", area: "Smithsburg, MD", category: "groceriesPharmacy" },
];

// Sourced verbatim from the printed convention program, page 31
// ("Convention and Conference Rules & Etiquette").
export const remember = [
  'Remember that God is not the author of confusion. Everything that we do must be done in an orderly manner. We expect you to exhibit good and Godly behavior and manner throughout your stay at the convention. "Let all things be done decently and in order" (1 Cor. 14:40)',
  'As Christ Ambassador, we should be a good example to the world so that they begin to view us as Christians indeed! Please conduct yourself in your hotel, the Convention hall, the CAC Village and the environment in a manner that glorifies God. "That ye may be blameless and harmless, the sons of God, without rebuke, in the midst of a crooked and perverse nation, among whom ye shine as lights in the world" (Phil. 2:15).',
  "Do not hang around your hotel hallway and lobby and ensure you keep your children and young ones in check.",
  "Please minimize noise in your hotel hallway and in your room.",
  "Please don't do any kind of cooking in your hotel room.",
  "Ensure you dress properly, and let us present ourselves as vessels unto honor (1 Thess. 4:4; Heb. 12:14-17).",
  'Watch your language. Unnecessary and ungodly chatter should be avoided at all cost. "Suffer not thy mouth to cause thy flesh to sin, wherefore should God be angry at thy voice, and destroy the work of thy hands" (Ecc. 5:6; 5:3-4).',
  "Be obedient to and follow the directions given to you by the convention committee, ushers, protocol, security personnel, hospitality, marketing, medical, and registration at all times.",
  "Make sure you take notes of the teaching in each session and go over it afterwards.",
  "Have respect for other attendees and leaders.",
  "Take time to fellowship with other brothers and sisters, and forge new relationships that will be of great benefit to you. Surround yourself with joyful and positive people — joy is contagious.",
  'While everything has been planned to run smoothly, if there is anything that may not go as expected, please kindly let us know your concern in a respectable manner. "Do everything without complaining or arguing" (Phil. 2:14).',
];

export const rules = [
  "Ensure that your identification tag is always on throughout the duration of the convention. You will not be allowed in the Convention Hall without your tag.",
  "Ensure that you arrive at each event at least ten (10) minutes before the commencement of each session.",
  "Ensure that your surroundings are kept clean throughout the duration of the convention.",
  "Ensure that you park your car properly.",
  "Ensure that you don't park your car around the youth and young adults, children department, and kitchen areas.",
  "No eating in any of the halls.",
  "Don't take the pack of water to your hotel room.",
  "Don't put any sanitary paper or diapers in the toilet, and keep the toilet clean at all times.",
  "Don't litter the Village surrounding.",
  "All trash must be put in a trash can or dumpster.",
  "There shall be a series of prayer sessions, particularly every morning, organized by the prayer department throughout this convention that will touch every area of your life, ministry, marriage, career, and business, etc.",
];

export const rulesAttribution = "Pastor David Olusegun Adenodi, Ph.D. — Chairman, CACNA Conventions & Conferences";
