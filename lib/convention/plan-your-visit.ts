// Ported verbatim from the Convention project's lib/content/{hotels,travel,rules}.ts.
export type Hotel = {
  name: string;
  city: "Chambersburg, PA" | "Gettysburg, PA" | "Hagerstown, MD";
  phone: string;
  ratePerNight: number;
  bookingNote: string;
};

export const hotels: Hotel[] = [
  { name: "Comfort Inn Greencastle", city: "Chambersburg, PA", phone: "717-798-3578", ratePerNight: 139, bookingNote: "Online booking available" },
  { name: "La Quinta", city: "Chambersburg, PA", phone: "717-446-0770", ratePerNight: 139, bookingNote: "Call hotel directly" },
  { name: "Super 8 By Wyndham I-81", city: "Chambersburg, PA", phone: "717-263-6655", ratePerNight: 75, bookingNote: "Call hotel directly" },
  { name: "Holiday Inn Express", city: "Chambersburg, PA", phone: "717-709-9009", ratePerNight: 141, bookingNote: "Online booking available" },
  { name: "Holiday Inn Express", city: "Gettysburg, PA", phone: "717-420-2686", ratePerNight: 189, bookingNote: "Online booking available" },
  { name: "Sleep Inn & Suites", city: "Gettysburg, PA", phone: "717-398-2670", ratePerNight: 129, bookingNote: "Call hotel directly" },
  { name: "Aspire Hotel", city: "Gettysburg, PA", phone: "717-321-3311", ratePerNight: 139, bookingNote: "Online booking available" },
  { name: "Hampton Inn", city: "Gettysburg, PA", phone: "717-338-9121", ratePerNight: 205, bookingNote: "Call hotel directly" },
  { name: "Eisenhower Hotel & Conference Center", city: "Gettysburg, PA", phone: "717-334-2755", ratePerNight: 139, bookingNote: "Online booking available" },
  { name: "Hampton Inn", city: "Hagerstown, MD", phone: "240-420-1970", ratePerNight: 139, bookingNote: "Online booking available" },
];

export const hotelGroupCode = "Christ Apostolic Church CACNA";

export const venueAddress = "14051 Stahley Road, Blue Ridge Summit, PA 17214";

export type Airport = { name: string; distanceMiles: number };

export const recommendedAirport: Airport = {
  name: "Baltimore-Washington International (BWI)",
  distanceMiles: 77,
};

export const nearbyAirports: Airport[] = [
  { name: "Hagerstown Regional Airport", distanceMiles: 14 },
  { name: "Frederick Municipal Airport", distanceMiles: 22 },
  { name: "Harrisburg International Airport", distanceMiles: 50 },
];

export const drivingRoute = "BWI → I-195 → I-95 → I-695 → I-70 → I-270 → US-15 → local roads to CAC Village";

export const budgetLodgingNote = "Budget rooms from around $40/night are available via Hotwire, in addition to the group-rate hotels above.";

export const rules = {
  remember: [
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
  ],
  rules: [
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
  ],
  attribution: {
    name: "Pastor David Olusegun Adenodi, Ph.D.",
    title: "Chairman, CACNA Conventions & Conferences",
  },
};
