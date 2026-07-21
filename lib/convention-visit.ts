/**
 * Real hotel, travel, and conduct-guideline content for the CACNA Annual
 * Convention at CAC Village, Blue Ridge Summit, PA — sourced from
 * cacnaconvention.org's own Hotel Lodging, Air & Road Travel, and Rules &
 * Etiquette pages so attendees don't need to visit a second, mostly-unbuilt
 * site to find it. Hotel rates/phones are the 2025 convention's published
 * figures; re-verify before each convention if rates change.
 */
export interface ConventionHotel {
  name: string;
  city: string;
  phone: string;
  rate: string;
}

export const CONVENTION_HOTELS: ConventionHotel[] = [
  { name: "Comfort Inn Greencastle", city: "Greencastle, PA", phone: "717-798-3578", rate: "$139/night" },
  { name: "La Quinta Chambersburg", city: "Chambersburg, PA", phone: "717-446-0770", rate: "$139/night" },
  { name: "Holiday Inn Express Gettysburg", city: "Gettysburg, PA", phone: "717-420-2686", rate: "$189/night" },
  { name: "Super 8 By Wyndham Chambersburg I-81", city: "Chambersburg, PA", phone: "717-263-6655", rate: "$75/night" },
  { name: "Sleep Inn & Suites Gettysburg", city: "Gettysburg, PA", phone: "717-398-2670", rate: "$129/night" },
  { name: "Aspire Gettysburg Hotel", city: "Gettysburg, PA", phone: "717-321-3311", rate: "$139/night" },
  { name: "Holiday Inn Express Chambersburg", city: "Chambersburg, PA", phone: "717-709-9009", rate: "$141/night" },
  { name: "Hampton Inn Gettysburg", city: "Gettysburg, PA", phone: "717-338-9121", rate: "$205/night" },
  { name: "Eisenhower Hotel & Conference Center", city: "Gettysburg, PA", phone: "717-334-2755", rate: "$139/night" },
  { name: "Hampton Inn Hagerstown", city: "Hagerstown, MD", phone: "240-420-1970", rate: "$139/night" },
];

export const CONVENTION_HOTEL_NOTE =
  "Mention the group code “Christ Apostolic Church CACNA” when booking to receive the discounted rate. The closest hotels are in Chambersburg and Gettysburg, about 30 minutes from CAC Village.";

export interface ConventionAirport {
  name: string;
  code: string;
  miles: number;
}

export const CONVENTION_PRIMARY_AIRPORT = {
  name: "Baltimore-Washington International Airport",
  code: "BWI",
  note: "About 77 miles and 1 hour 25 minutes from CAC Village — the recommended airport for convention travel.",
};

export const CONVENTION_NEARBY_AIRPORTS: ConventionAirport[] = [
  { name: "Hagerstown Regional Airport", code: "HGR", miles: 14 },
  { name: "Frederick Municipal Airport", code: "FDK", miles: 22 },
  { name: "Carroll County Regional", code: "QQG", miles: 26 },
  { name: "York Airport", code: "THV", miles: 34 },
  { name: "Eastern WV Regional Airport", code: "MRB", miles: 35 },
  { name: "Montgomery County Airpark", code: "GAI", miles: 42 },
  { name: "Harrisburg International Airport", code: "MDT", miles: 50 },
];

export const CONVENTION_RULES: string[] = [
  "Let all things be done decently and in order — exhibit good behavior and manners throughout your stay (1 Cor. 14:40).",
  "Conduct yourself in the hotel and convention hall in a manner that glorifies God, as ambassadors for Christ (Phil. 2:15).",
  "Keep children and young ones in check, and avoid hanging around the hallway and hotel lobby.",
  "Dress properly and present yourself as a vessel unto honor (1 Thess. 4:4; Heb. 12:14-17).",
  "Watch your language — avoid unnecessary and ungodly chatter (Eccl. 5:6; Eph. 5:3-4).",
  "Be obedient to and follow directions from the convention committee, ushers, and security personnel at all times.",
  "Your identification tag must be worn at all times — you will not be allowed into the convention hall without it.",
  "Arrive at each event at least 10 minutes before it begins, and keep your surroundings clean throughout.",
  "Your food ticket is not replaceable if lost — please keep it safe.",
];
