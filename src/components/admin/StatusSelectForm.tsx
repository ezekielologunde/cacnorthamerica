"use client";

export default function StatusSelectForm({
  id,
  status,
  action,
}: {
  id: string;
  status: string;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-navy-800/15 px-2 py-1 text-xs"
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </form>
  );
}
