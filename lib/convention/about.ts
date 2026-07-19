// Ported verbatim from the Convention project's lib/content/{welcome,about-convention,history,leadership,committee}.ts.
import type { Person } from "./types";

export const welcomeMessage = {
  paragraphs: [
    "Calvary greetings in the name of our Lord and Savior Jesus Christ, of whose precious blood we are all redeemed. The Lord God Almighty, your Creator, is requesting that we all walk in Unity with our brethren of whom you have the same Father and to grow in every area of Life and Ministry in the work He has given to us to do for the Glory of His name.",
    "People of God, the Lord is calling us to prepare ourselves for the Kingdom of God, building ourselves up in knowledge and wisdom, and showing ourselves approved of Him so that when people see and hear of our works, His name will be Praised. We are therefore calling out to every member and friend of Christ Apostolic Church, North America to make themselves available for the Upcoming programs that are being made available through this Convention. Be a part taker in what God is doing and let's partake of it diligently, doing it well. Let us do all things in the spirit of excellence as is expected by God from us that we may please Him.",
  ],
};

export const aboutConvention = {
  missionStatement:
    "The CACNA Convention exists to facilitate, extend and enlarge the Great Commission of Christ under the umbrella of Christ Apostolic Church North America. This is achieved through the authority of God's inerrant Word to the glory of God the Father, under the Lordship of Jesus Christ, and by the empowerment of the Holy Spirit.",
  biblicallyBased: [
    "Affirmation of a minimal set of doctrinal beliefs.",
    "Biblical inerrancy is the foundational element.",
    "Churches working together in mutual accountability.",
  ],
  kingdomFocused: [
    "A focus on evangelism and church administration.",
    "Networking and having fellowship with each other for growth and progress.",
    "Striving to resource the needs of CACNA churches rather than to direct their ministries.",
    "Utilizing the resources of the CACNA to maximize the ministry effectiveness of CACNA Ministers.",
  ],
};

export const history = {
  foundingYear: 1976,
  founder: "Rev. Goke Oyedeji, Ph.D.",
  foundingLocation: "Brooklyn, New York",
  summary: "The first Christ Apostolic Church in North America started as a house fellowship in 1976 by the late Rev. Goke Oyedeji, Ph.D., in Brooklyn, New York.",
};

export type LeadershipMember = { name: string; title: string; photo: string };

export const leadership: LeadershipMember[] = [
  { name: "Pastor Timothy Agbeja, Ph.D.", title: "Latunde Regional Superintendent, CACNA Chairman, CACNA Coordinating Council Chancellor, CACNA Bible Institute Superintendent, Washington DCC", photo: "/photos/people/agbeja.png" },
  { name: "Pastor David Adenodi, Ph.D.", title: "Chairman, CACNA Convention Member, CACNA Coordinating Council Provost, CACNA Bible Institute Superintendent, V.O.C -USA, DCC", photo: "/photos/people/david-adenodi.jpg" },
  { name: "Pastor Joseph Olawale", title: "Latunde Regional Secretary, CACNA Member, CACNA Coordinating Council Registrar, CACNA Bible Institute Superintendent, Texas DCC", photo: "/photos/people/olawale.png" },
  { name: "Pastor Timothy Adelani", title: "Latunde Regional Treasurer, CACNA Member, CACNA Coordinating Council Superintendent, Manhattan NY DCC", photo: "/photos/people/adelani.png" },
  { name: "Pastor John Oluwatimilehin, Ph.D.", title: "Chairman, CAC Village Management Council Member, CACNA Coordinating Council Superintendent, Bethel DCC", photo: "/photos/people/oluwatimilehin.jpg" },
];

export type CommitteeMember = Person;

export const committee: CommitteeMember[] = [
  { name: "Pastor David O. Adenodi, Ph.D.", role: "Chairman" },
  { name: "Pastor Oluwagbemiga Famojuro, D.Min.", role: "Secretary" },
  { name: "Pastor Abayomi Ademuwagun", role: "PRO" },
  { name: "Pastor Zaccheaus Oloba", role: "HOD, Prayer" },
  { name: "Pastor Amos Adetobi", role: "HOD, Multimedia" },
  { name: "Evang. Belinda Otusanya", role: "HOD, Marketing" },
  { name: "Evang. Debbie Aina Solomon", role: "HOD, Medical" },
  { name: "Evang. Mojisola Bafunso, Ed.D.", role: "HOD, Picnic" },
  { name: "Pastor Akintayo Busayo, Ph.D." },
  { name: "Evang. Funmilayo Oni, DNP" },
  { name: "Pastor Olufemi Adegoke", role: "HOD, Choir" },
  { name: "Evang. Eunice Alabi-Oni" },
  { name: "Evang. Bisi Benson", role: "HOD, Usher" },
  { name: "Evang. Onatokunboh Browne", role: "HOD, Hospitality" },
  { name: "Pastor Adekunmi Browne", role: "Youth Leader" },
  { name: "Elder Rufus Fasakin", role: "Village Supervisor" },
  { name: "Ebunoluwa Oke" },
  { name: "Evang. Adebisi Abikoye" },
  { name: "Evang. Bolanle Mustapha", role: "Good Women Leader" },
  { name: "Elder Ayoola Odeyemi", role: "HOD, Protocol" },
  { name: "Evang. Janet Olajide, DM" },
  { name: "Deaconess Kimberly Omotade" },
  { name: "Evang. Mary Babalola-Omotunde" },
  { name: "Evang. Oluwatoyin Oni", role: "HOD, Children Department" },
  { name: "Pastor Ogbeide Oniha, Ph.D.", role: "Logistics" },
  { name: "Pastor Joseph Opadele" },
  { name: "Pastor Philip Ekoma" },
  { name: "Pastor Omotayo Wilhelm" },
  { name: "Pastor Henry Okonofua" },
  { name: "Pastor Osajele Ehikhamenor" },
];
