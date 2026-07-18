"use client";

export default function RoleSelectForm({
  id,
  role,
  action,
}: {
  id: string;
  role: string;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <select
        name="role"
        defaultValue={role}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-navy-800/15 px-2 py-1 text-xs"
      >
        <option value="editor">Editor</option>
        <option value="super_admin">Super Admin</option>
      </select>
    </form>
  );
}
