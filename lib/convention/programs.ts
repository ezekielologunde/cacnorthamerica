// Ported verbatim from the Convention project's lib/content/*.ts —
// transcribed from the real 2026 convention program book. All content here
// is faithful to that source; nothing invented.
import type { Person, AgendaItem, ScheduleSession } from "./types";

// ─── Business Group Fellowship ──────────────────────────────────────────────
export const businessGroupFellowship = {
  title: "CACNA Business Group Fellowship",
  date: "Thursday, July 16, 2026",
  moderators: ["Evangelist (Dr.) Efuntoye", "Evangelist Oyarombi"],
};

export const businessGroupAgenda: AgendaItem[] = [
  { time: "11:15–11:20am", event: "Opening Prayer", speaker: "Pastor (Dr.) Mathew Babalola" },
  { time: "11:20–11:30am", event: "Chairman's Speech", speaker: "Pastor Bolaji Oladunni" },
  { time: "11:30–11:35am", event: "Introduction of the Guest Speaker", speaker: "Engineer Ajibola Osinubi" },
  { time: "11:35am–12:05pm", event: "Guest Speaker's Lecture", speaker: "Dr. Jumoke Ojo" },
  { time: "12:05–12:15pm", event: "Questions and Answers", speaker: "Evangelist Janet Olajide" },
  { time: "12:15–12:25pm", event: "Kingdom Partners", speaker: "Evangelist Abikoye" },
  { time: "12:25–12:40pm", event: "Raffle Tickets / Prizes", speaker: "Evangelist Janet Olajide" },
  { time: "12:40–12:45pm", event: "Vote of Thanks", speaker: "Engineer Ajibola Osinubi" },
  { time: "12:45pm–", event: "Introduction of the Regional Superintendent", speaker: "Pastor Gabriel Idowu" },
  { time: "—", event: "Closing Prayer and Benediction", speaker: "Pastor (Dr.) T.O.A. Agbeja" },
];

export const businessGroupExecutives: Person[] = [
  { name: "Pastor Bolaji Oladunni", role: "Chairman" },
  { name: "Engineer Ajibola Osinubi", role: "Vice Chairman" },
  { name: "Evangelist Gbemisola Oluwayimika", role: "Secretary" },
  { name: "Evangelist Olubunmi Otun", role: "Assistant Secretary" },
  { name: "Elder Emmanuel Odetoye", role: "Financial Secretary" },
  { name: "Evangelist Eunice Alabi Oni", role: "Treasurer" },
  { name: "Evangelist Janet Olajide", role: "P.R.O" },
  { name: "Evangelist Adebisi Abikoye", role: "Assistant P.R.O" },
  { name: "Evangelist Wunmi Atomolagun", role: "Assistant P.R.O" },
];

export const kingdomEconomicsMessage = {
  title: "Kingdom Economics: Doing Business God's Way — Representing God at Work",
  verse: "Deuteronomy 8:18",
  contributors: [
    { name: "Pastor T.A.O. Agbeja, Ph.D.", title: "Regional Superintendent, CACNA (Latunde Region)" },
    { name: "Pastor Gabriel Idowu", title: "Supervisor, Latunde Region Business Group Fellowship" },
    { name: "Pastor Bolaji Oladunni", title: "Chairman, Business Group Fellowship" },
  ] as Person[],
  body: [
    "Most believers think that our God is present only in prayer, worship, and other church related activities, but looking intensely into the Scripture, we quickly come to see that God is interested in ALL the facets of our earthly activities. Our office is a mission field. Our work is a worship center. Our business place is a platform for witness and our trading place is an altar!",
    "\"This Book of the Law shall not depart from your mouth, but you shall meditate in it day and night, that you may observe to do according to all that is written in it. For then you will make your way prosperous, and then you will have good success.\" (Joshua 1:8, NKJV)",
  ],
  fullMessageNote: "The full message is available in the printed convention program.",
};

// ─── CACMA (Men's Association) ─────────────────────────────────────────────
export const cacmaSchedule: ScheduleSession[] = [
  {
    dayLabel: "Wednesday, July 15, 2026",
    timeRange: "Early Afternoon Session · 11:45am – 1:15pm",
    agenda: [
      { time: "11:45–11:50am", event: "Opening Prayer", speaker: "Pastor Amos Adetobi" },
      { time: "11:50am–12:00noon", event: "Choruses", speaker: "Available pastor" },
      { time: "12:00–12:45pm", event: "Message — \"Love the Bible, Love God\"", speaker: "Pastor Gabriel S. Dada, Superintendent, CAC Babalola Region" },
      { time: "12:45–1:00pm", event: "Q & A" },
      { time: "1:00–1:10pm", event: "Fund Raising — CACMA", speaker: "Available Supt." },
      { time: "1:10–1:15pm", event: "Prayer and Closing", speaker: "Regional Superintendent" },
    ],
  },
  {
    dayLabel: "Wednesday, July 15, 2026",
    timeRange: "Late Afternoon Session · 3:30 – 5:00pm",
    agenda: [
      { time: "3:30–3:35pm", event: "Opening Prayer", speaker: "Available Member" },
      { time: "3:35–3:45pm", event: "Choruses", speaker: "Available Member" },
      { time: "3:45–4:05pm", event: "Annual Report", speaker: "Pastor Amos Dada" },
      { time: "4:05–4:20pm", event: "Become a Practicing Christian", speaker: "Pastor Amos Dada" },
      { time: "4:20–4:35pm", event: "Financial Report", speaker: "Engr. Sunday Kalejaiye" },
      { time: "4:35–4:45pm", event: "Fund Raising", speaker: "Available Supt." },
      { time: "4:45–5:00pm", event: "Closing Prayer", speaker: "Pastor T.A.O. Agbeja" },
    ],
  },
  {
    dayLabel: "Thursday, July 16, 2026",
    timeRange: "Afternoon Session · 1:00 – 2:15pm",
    agenda: [
      { time: "1:00–1:05pm", event: "Opening Prayer", speaker: "Available Member" },
      { time: "1:05–1:10pm", event: "Choruses", speaker: "Available" },
      { time: "1:10–1:50pm", event: "Message — \"Mobilizing Men to Fulfil Purpose\"", speaker: "Pastor Francis A. Olaniyi, Provost, CAC Theological Seminary" },
      { time: "1:50–1:55pm", event: "Prayer", speaker: "Available Supt." },
      { time: "1:55–2:05pm", event: "Fundraising for CACMA Project", speaker: "Available Supt." },
      { time: "2:05pm", event: "Closing Prayer", speaker: "Pastor S.O. Oladele" },
    ],
  },
];

// ─── Christian Education Department ────────────────────────────────────────
export const christianEducation = {
  title: "Christian Education Department (CACNA-CED)",
  date: "Thursday, July 16, 2026",
  theme: "The Bible: A Dynamic Force for the Church",
  themeVerse: "Hebrews 4:12",
  moderator: "Evangelist Mrs. Belinda Otusanya (Philadelphia Zone)",
};

export const christianEducationAgenda: AgendaItem[] = [
  { time: "9:00–9:03am", event: "Opening Prayer", speaker: "Pastor Segun Olaniyi, VOC Atlanta DCC" },
  { time: "9:04–9:09am", event: "Sunday School Anthem", speaker: "CED Voices / Moderator, Christian Education Dept." },
  { time: "9:10–9:15am", event: "Welcome Address & Introduction of the Guest Speaker", speaker: "Pastor Dr. 'Gbenga Famojuro, FITA DCC / Chairman, CED" },
  { time: "9:17–10:07am", event: "Main Lecture (50 min)", speaker: "Rt. Rev. Prof. Dapo Folorunso Asaju, Bishop of Diocese, Ilesa" },
  { time: "10:11–10:21am", event: "Q & A Session (10 min)", speaker: "Pastor Matthew Oladejo, Cornerstone Zone" },
  { time: "10:22–10:27am", event: "Sunday School Exam Matter", speaker: "Pastor Ajibade & Pastor Oderinde, Atlanta DCC" },
  { time: "10:28–10:33am", event: "Thanksgiving & News Update", speaker: "Pastor Samuel Tunji Ayeni, VOC USA DCC / CED Sec." },
  { time: "10:35–10:45am", event: "Prophetic Prayer Blessing (10 min)", speaker: "Evang. Mrs. Bolanle Mustapha, CACNA Good Women Leader" },
  { time: "10:46–10:49am", event: "Introduction of the Regional Superintendent", speaker: "Pastor Dr. 'Gbenga Famojuro, FITA DCC / Chairman, CED" },
  { time: "10:50–11:00am", event: "Closing Remarks, Blessings & Benediction", speaker: "Pastor Dr. Timothy A.O. Agbeja, Latunde Regional Supt." },
];

// ─── Good Women Association Conference ─────────────────────────────────────
export const goodWomenConference = {
  title: "CAC Latunde Region Good Women Association 2026 Conference",
  leader: "Evang. Mrs. Bolanle Mustapha",
  leaderTitle: "CACNAGWA Leader",
};

export const goodWomenExecutives: Person[] = [
  { name: "L/Evang. Bolanle Mustapha", role: "Leader" },
  { name: "L/Evang. Bisi Benson", role: "Women Leader" },
  { name: "L/Evang. Janet Olajide", role: "Secretary" },
  { name: "L/Evang. Yomi Adeneye", role: "Chaplain" },
  { name: "L/Evang. Bukola Awosanya", role: "Financial Secretary" },
];

export const goodWomenSchedule: ScheduleSession[] = [
  {
    dayLabel: "Wednesday, July 15",
    timeRange: "11:45am – 1:15pm",
    agenda: [
      { time: "11:45–11:50am", event: "Moderator's Opening Statement", speaker: "Evang. Bisi Benson" },
      { time: "11:50–11:55am", event: "Opening Prayer", speaker: "Evang. Mrs. Bukola Awosanya" },
      { time: "11:55am–12:00pm", event: "Opening Hymn", speaker: "Evang. Mrs. Funmi Oni" },
      { time: "12:00–12:05pm", event: "CACNAGWA Leader's Address", speaker: "Evang. Mrs. Bolanle Mustapha" },
      { time: "12:05–12:15pm", event: "Special Presentation", speaker: "CACNAGWA Choir" },
      { time: "12:15–1:05pm", event: "Raising Godly Children in Navigating Cultural and Social Challenges" },
      { time: "1:05–1:10pm", event: "Offerings" },
      { time: "1:10–1:15pm", event: "Closing Prayers", speaker: "Evang. Bola Ajisafe" },
    ],
  },
  {
    dayLabel: "Wednesday, July 15",
    timeRange: "3:30 – 5:00pm",
    agenda: [
      { event: "Moderator's Opening Prayers", speaker: "Mrs. Janet Olajide" },
      { event: "Introduction", speaker: "Evang. Mrs. Janet Olajide" },
      { event: "Opening Prayer", speaker: "Pastor Dr. James Fakeye, Ph.D." },
      { event: "Raising Godly Children in Navigating Cultural and Social Challenges (continued)" },
      { event: "Questions Time" },
      { event: "Special Presentation", speaker: "CACNAGWA Drama" },
      { event: "Closing Remarks", speaker: "L/E Bolanle Mustapha" },
      { event: "Closing Prayers & Benediction", speaker: "Pastor Dr. Hezekiah Ilufoye" },
    ],
  },
  {
    dayLabel: "Thursday, July 16",
    timeRange: "3:30 – 5:00pm",
    agenda: [
      { event: "Moderator's Opening Prayers" },
      { event: "Special Presentation", speaker: "CACNAGWA Drama Group" },
      { event: "Reflections on Raising Godly Children in Marriages" },
      { event: "Prayers", speaker: "Evang. Mrs. Omi, Bafunso, Aladetoun, Ojo, Okosun, Benson" },
      { event: "Offerings" },
      { event: "Closing Remarks", speaker: "Pastor Wale Adelegan" },
      { event: "Closing Prayers & Benediction", speaker: "Pastor Dr. Hezekiah Ilufoye" },
    ],
  },
];

// ─── Ministers' Wives Conference ────────────────────────────────────────────
export const ministersWivesConference = {
  title: "CAC Latunde Region Convention Ministers' Wives Conference",
  executiveMembers: [
    { name: "Evang./Mrs. Agnes Agbeja", role: "Chairperson" },
    { name: "Evang./Mrs. Esther Adenodi" },
    { name: "Evang./Mrs. Janet Adelani" },
    { name: "Evang./Mrs. Beatrice Olawale" },
    { name: "Evang./Mrs. Toyin Ademuwagun, Esq.", role: "Secretary" },
  ] as Person[],
};

export const ministersWivesSchedule: ScheduleSession[] = [
  {
    dayLabel: "Wednesday, July 15, 2026",
    timeRange: "11:45am – 1:15pm",
    agenda: [
      { time: "11:45–11:50am", event: "Opening Prayer", speaker: "TBD" },
      { time: "11:50–11:55am", event: "Praise & Worship", speaker: "TBD" },
      { time: "11:55am–12:00pm", event: "General Introduction", speaker: "All" },
      { time: "12:00–12:15pm", event: "Welcome Address", speaker: "Evang. Mrs. Agnes Agbeja" },
      { time: "12:15–1:00pm", event: "God's Communication and Purpose — Exodus 3:1-10", speaker: "Mrs. Susanna Oladele" },
      { time: "1:00–1:10pm", event: "Question & Answer", speaker: "General" },
      { time: "1:10–1:15pm", event: "Closing Prayer", speaker: "Mrs. Susanna Oladele" },
    ],
  },
  {
    dayLabel: "Thursday, July 16, 2026",
    timeRange: "1:00pm – 2:15pm",
    agenda: [
      { time: "1:00–1:05pm", event: "Opening Prayer", speaker: "TBD" },
      { time: "1:05–1:10pm", event: "Praise & Worship", speaker: "TBD" },
      { time: "1:10–1:25pm", event: "Share and Care", speaker: "TBD" },
      { time: "1:25–2:00pm", event: "Question & Answer", speaker: "All" },
      { time: "2:00–2:10pm", event: "Prayer", speaker: "All" },
      { time: "2:10–2:15pm", event: "Closing Prayer", speaker: "Mrs. Susanna Oladele" },
    ],
  },
];

// ─── Youth & Young Ministry ─────────────────────────────────────────────────
export const youthProgram = {
  title: "CAC North America Youth and Young Ministry",
  theme: "Did God Really Say...? Knowing God's Word for Yourself",
  regionalCoordinator: "Pastor Adekunmi Browne",
};

export const youthSchedule: { dayLabel: string; agenda: AgendaItem[] }[] = [
  {
    dayLabel: "Tuesday, July 14",
    agenda: [
      { time: "11:00–11:45am", event: "Opening Prayer & Icebreaker" },
      { time: "11:45am–1:15pm", event: "Morning Session: \"What I Wish I Had Known Before Freshman Year\"" },
      { time: "1:15–3:30pm", event: "Lunch" },
      { time: "3:30–5:00pm", event: "Afternoon Session: Bible Games" },
      { time: "5:00–6:30pm", event: "Dinner" },
    ],
  },
  {
    dayLabel: "Wednesday, July 15",
    agenda: [
      { time: "10:00–11:00am", event: "Praise & Worship and Opening Prayer — CACNA Y&YAM Praise & Worship Team, Prayer Ministry" },
      { time: "11:00–11:30am", event: "Greeting — Pastor Adekunmi Browne, Regional Youth Coordinator; Housekeeping Rules & Icebreaker" },
      { time: "11:30am–1:30pm", event: "Session One — Game: \"Scripture or Cap?\"; Teaching: \"Did God Really Say...? How to Read the Bible for Yourself\"" },
      { time: "1:30–3:00pm", event: "Lunch" },
      { time: "3:00–4:00pm", event: "Session Two: Breakout — Real Men, Real Talk (Becoming Him: Identity) & Real Women, Real Talk (Becoming Her: Identity)" },
      { time: "4:00–5:00pm", event: "Session Three: Panel Discussion — Unmasking and Healing Sexual Brokenness" },
      { time: "5:00–5:30pm", event: "Prayer & Praise Break" },
      { time: "5:30–7:00pm", event: "Dinner" },
      { time: "7:00–9:00pm", event: "Youth Explosion Impartation Service" },
    ],
  },
  {
    dayLabel: "Thursday, July 16",
    agenda: [
      { time: "10:00–10:45am", event: "Praise & Worship and Opening Prayer — CACNA Y&YAM Praise & Worship Team, Prayer Ministry" },
      { time: "10:45–11:15am", event: "Opening Address: \"Did God Really Say...? Knowing God's Word for Yourself\" — Pastor Adekunmi Browne, Regional Coordinator" },
      { time: "11:15–11:30am", event: "Spirit of David — Dance Ministration" },
      { time: "11:30am–1:00pm", event: "Session Four: Workshops! (1) Calling All Creatives (2) iWorship for Psalmists & Levites — Part II (3) Marketplace Ministry" },
      { time: "1:00–2:30pm", event: "Lunch | Annual CACNA Picnic" },
      { time: "2:30–4:00pm", event: "Sports ~ Games ~ Contests" },
      { time: "4:00–5:00pm", event: "Dinner | Teen Mixer | Singles Soirée | Married Women | Married Men" },
      { time: "5:00–8:00pm", event: "CACNA Praise Night!" },
    ],
  },
  {
    dayLabel: "Friday, July 17",
    agenda: [
      { time: "10:00–11:00am", event: "Praise & Worship and Opening Prayer — CACNA Y&YAM Praise & Worship Team, Prayer Ministry" },
      { time: "11:00am–1:00pm", event: "Session Five: Breakout — Teen Talk | Singles Ministry | Marriage Ministry" },
      { time: "1:00–2:30pm", event: "Lunch" },
      { time: "2:30–3:30pm", event: "Session Six: Owning Your Health" },
      { time: "3:30–4:30pm", event: "Session Seven: Bible Jeopardy & Prize Giveaway!" },
      { time: "4:30–5:00pm", event: "Testimonies | Reflection | Prayer" },
      { time: "5:00–6:00pm", event: "Dinner" },
    ],
  },
];

// ─── Children's Convention Program ─────────────────────────────────────────
export const childrenConvention = {
  theme: "God's Message to Children",
  themeVerse: "Mark 10:14",
  coordinator: "Evangelist Mrs. Oluwatoyin Oni",
  safetyNote: "The children's safety is our priority.",
  closingNote: "Have a wonderful summer!",
};

export const dailyStructure = [
  { label: "Sign In", morning: "11:30–11:45am", afternoon: "3:30–3:45pm" },
  { label: "Praise and Worship", morning: "11:45am–12:00pm", afternoon: "3:45–4:00pm" },
  { label: "Prayers", morning: "12:00–12:15pm", afternoon: "4:00–4:15pm" },
];

export type ChildrenTeacher = { name: string; ageRange?: "5–8 yrs" | "9–12 yrs" };

export const childrenTeachers: ChildrenTeacher[] = [
  { name: "Evang. Mrs. Juliana Adewunmi", ageRange: "5–8 yrs" },
  { name: "Mrs. Adeola Bankole", ageRange: "5–8 yrs" },
  { name: "Evang. Mrs. Iyabo Bolanle Ajisafe", ageRange: "5–8 yrs" },
  { name: "Evang. Mrs. Michelle Okusanya", ageRange: "5–8 yrs" },
  { name: "Mrs. Gloria Omowole", ageRange: "5–8 yrs" },
  { name: "Mrs. Christiana Odetoye", ageRange: "5–8 yrs" },
  { name: "Mrs. Olajumoke Alaba", ageRange: "5–8 yrs" },
  { name: "Mrs. Adeola Babs Mala", ageRange: "9–12 yrs" },
  { name: "Evang. Mrs. Sumbo Oni", ageRange: "9–12 yrs" },
  { name: "Evang. Mrs. Folasade Olorunfemi", ageRange: "9–12 yrs" },
  { name: "Mrs. Esan" },
  { name: "Mr. Ijaola" },
];

const teachers58 = childrenTeachers.filter((t) => t.ageRange === "5–8 yrs").map((t) => t.name);
const teachers912 = childrenTeachers.filter((t) => t.ageRange === "9–12 yrs").map((t) => t.name);

export type ChildrenTeacherGroup = { ageRange: string; teachers: string[] };
export type ChildrenSession = { time: string; message?: string; activity?: string; teachersByAge?: ChildrenTeacherGroup[] };
export type ChildrenScheduleDay = { dayLabel: string; date: string; morning?: ChildrenSession; afternoon?: ChildrenSession };

export const childrenSchedule: ChildrenScheduleDay[] = [
  {
    dayLabel: "Wednesday, July 15",
    date: "2026-07-15",
    morning: {
      time: "11:30am–1:30pm",
      message: "God's love, wisdom, and guidance for children",
      teachersByAge: [
        { ageRange: "5–8 yrs", teachers: teachers58 },
        { ageRange: "9–12 yrs", teachers: teachers912 },
      ],
    },
    afternoon: {
      time: "3:30–5:00pm",
      message: "God's love in helping children navigate life challenges",
      teachersByAge: [
        { ageRange: "5–8 yrs", teachers: teachers58 },
        { ageRange: "9–12 yrs", teachers: teachers912 },
      ],
    },
  },
  {
    dayLabel: "Thursday, July 16",
    date: "2026-07-16",
    morning: {
      time: "11:30am–1:30pm",
      message: "Message Review and Trivia",
      teachersByAge: [
        { ageRange: "5–8 yrs", teachers: teachers58 },
        { ageRange: "9–12 yrs", teachers: teachers912 },
      ],
    },
    afternoon: { time: "1:30–5:00pm", activity: "Outdoor Games and Water Splash Activities" },
  },
  {
    dayLabel: "Friday, July 17",
    date: "2026-07-17",
    morning: { time: "10:00am–2:00pm", activity: "Question & Answer Session with Prizes" },
  },
];
