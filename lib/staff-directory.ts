export interface StaffContact {
  label: string;
  email: string;
}

/** Mailboxes for routing admin messages. Update here as real CACNA
 *  department mailboxes are provisioned. */
export const STAFF_DIRECTORY: StaffContact[] = [
  { label: "General Info", email: "info@cacnorthamerica.com" },
];
