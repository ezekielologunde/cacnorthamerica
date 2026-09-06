// Shared by every hand-rolled HTML-email builder in this repo (see
// app/api/contact/route.ts and lib/registrationEmail.ts) -- there's no
// templating engine installed, so every interpolated value that could
// contain user input needs this before landing in an HTML string.
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
