// Archive extras supplied by the site owner (2026-11-05): older fliers. Text only; payment handles from the giving fliers are
// intentionally NOT published here.

export interface ArchivedEvent {
  title: string;
  dateLabel: string;
  detail: string;
  imageSrc?: string;
  imageAlt?: string;
}

/** One-off past events that are not part of the annual convention. */
export const archivedEvents: ArchivedEvent[] = [
  {
    title: "Canada 4 Christ",
    dateLabel: "Friday, 23 August 2024 · 5:30 PM",
    detail:
      "An evening of ministration at The Meeting House, Oakville, Ontario, with Prophet Hezekiah Oladeji, General Evangelist of CAC Nigeria & Overseas.",
  },
  {
    title: "Apostolic Visitation — CAC President visits Canada",
    dateLabel: "Friday 31 July – Sunday 2 August 2026",
    detail:
      "Hosted by CAC Canada with Pastor S.O. Oladele, President of CAC Nigeria & Overseas, and Pastor Timothy Agbeja, Regional Superintendent, CAC North America. Friday 7 PM and Sunday 10 AM (EST) at CAC Bethel, 22–94 Kenhar Drive, Toronto; the CAC Ministers Conference on Saturday 9 AM (EST) at VOC Mississauga, 25 Claireport Crescent, Etobicoke.",
    imageSrc: "/photos/archive/apostolic-visitation-2026.jpg",
    imageAlt: "Flier for the Apostolic Visitation, CAC President visits Canada, 31 July to 2 August 2026",
  },
];
