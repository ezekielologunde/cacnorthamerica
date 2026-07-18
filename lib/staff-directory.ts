export interface StaffContact {
  label: string;
  email: string;
}

/** Department mailboxes for routing admin messages — mirrors the church's
 *  Microsoft 365 shared mailboxes. Update here if a mailbox changes. */
export const STAFF_DIRECTORY: StaffContact[] = [
  { label: "Pastoral Counseling", email: "PastoralCounseling@cacsalvationcenter.org" },
  { label: "Pastor's Office (Supt.)", email: "PastorHilufoye@cacsalvationcenter.org" },
  { label: "Admin Office", email: "Admin@cacsalvationcenter.org" },
  { label: "Finance", email: "Finance@cacsalvationcenter.org" },
  { label: "Hall Rental / Venue", email: "RentHall@cacsalvationcenter.org" },
  { label: "Publications", email: "Publications@cacsalvationcenter.org" },
  { label: "Youth Ministry", email: "Youths@cacsalvationcenter.org" },
  { label: "General Info", email: "info@cacsalvationcenter.org" },
  { label: "General Inbox", email: "hello@cacsalvationcenter.org" },
];
