export const inputClass =
  "w-full rounded-lg border border-navy-800/15 bg-white px-3 py-2 text-sm text-navy-900 focus:border-gold-500 focus:outline-none";

export const labelClass =
  "block text-xs font-semibold uppercase tracking-wide text-navy-800/60 mb-1";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-cream-100 hover:bg-navy-800 transition-colors"
    >
      {label}
    </button>
  );
}

export function DeleteButton({
  action,
}: {
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="text-sm font-medium text-red-700 hover:text-red-900"
      >
        Delete
      </button>
    </form>
  );
}
