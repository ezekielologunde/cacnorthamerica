import {
  getAllEvents,
  getAllRegistrations,
  getRegistrantsForRegistration,
} from "@/lib/data/queries";
import StatusSelectForm from "@/components/admin/StatusSelectForm";
import { setRegistrationStatus } from "./actions";

export default async function AdminRegistrationsPage() {
  const [registrations, events] = await Promise.all([
    getAllRegistrations(),
    getAllEvents(),
  ]);
  const eventsById = new Map(events.map((e) => [e.id, e]));
  const registrantCounts = await Promise.all(
    registrations.map((r) => getRegistrantsForRegistration(r.id)),
  );

  return (
    <div>
      <h1 className="font-serif-display text-3xl text-navy-900">
        Registrations
      </h1>
      <p className="mt-2 text-sm text-navy-800/60">
        Registrations submitted through the public registration form.
        Payment is not processed here — confirm manually once payment is
        received (Zelle/credit card/cacnaconvention.org).
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-navy-800/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-cream-200 text-left text-xs uppercase tracking-wide text-navy-800/60">
            <tr>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Registrants</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg, i) => (
              <tr key={reg.id} className="border-t border-navy-800/10">
                <td className="px-4 py-3 font-medium text-navy-900">
                  {eventsById.get(reg.eventId)?.title ?? "Unknown event"}
                </td>
                <td className="px-4 py-3 text-navy-800/70">
                  <p>{reg.contactName}</p>
                  <p className="text-xs text-navy-800/50">
                    {reg.contactEmail}
                    {reg.contactPhone ? ` · ${reg.contactPhone}` : ""}
                  </p>
                  {reg.churchName && (
                    <p className="text-xs text-navy-800/50">{reg.churchName}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-navy-800/70">
                  {registrantCounts[i].length || 1}
                </td>
                <td className="px-4 py-3 text-navy-800/70">
                  {new Date(reg.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <StatusSelectForm
                    id={reg.id}
                    status={reg.status}
                    action={setRegistrationStatus}
                  />
                </td>
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-navy-800/50">
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
