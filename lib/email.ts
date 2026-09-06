// Shared visual chrome for every "designed" confirmation email this app
// sends (registration, meal request, store order, contact auto-reply) --
// extracted once several callers needed the identical header/footer, per
// lib/registrationEmail.ts's original design. No templating engine is
// installed (see package.json), so this stays a plain template-literal
// builder like everything else in this file's family.

// cacnorthamerica.com isn't a verified Resend sending domain yet (DNS
// verification pending) -- sending from the already-verified
// cacsalvationcenter.org in the meantime so confirmation emails actually go
// out. Switch this back to noreply@cacnorthamerica.com once that domain
// verifies in Resend.
export const EMAIL_FROM = "CACNA <noreply@cacsalvationcenter.org>";

/** Every string here is inserted as raw HTML -- callers must run any
 *  user-supplied value through lib/html.ts's escapeHtml() themselves before
 *  passing it in, the same contract lib/registrationEmail.ts already
 *  follows. */
export function emailShell(opts: {
  heading: string;
  subheading: string;
  bodyHtml: string;
  ctaHref?: string;
  ctaLabel?: string;
  footerNote?: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#ECE9E4;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#F5F6FA">
    <div style="height:5px;background:linear-gradient(90deg,#7A1128,#C81E3A,#FDC841)"></div>
    <div style="background:#12141E;padding:30px 32px;text-align:center">
      <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2.5px;color:#FDC841;text-transform:uppercase">Christ Apostolic Church</p>
      <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#fff">North America</p>
    </div>
    <div style="background:#12141E;padding:0 32px 40px;text-align:center">
      <h1 style="margin:0 0 10px;font-size:24px;font-weight:800;color:#fff;line-height:1.25">${opts.heading}</h1>
      <p style="margin:0;font-size:14.5px;color:rgba(245,246,250,.7);line-height:1.6">${opts.subheading}</p>
    </div>
    <div style="padding:28px 32px 8px">
      ${opts.bodyHtml}
    </div>
    ${
      opts.ctaHref && opts.ctaLabel
        ? `<div style="padding:20px 32px 8px"><a href="${opts.ctaHref}" style="display:block;text-align:center;background:#FDC841;color:#12141E;font-weight:800;font-size:14.5px;padding:14px 20px;border-radius:999px;text-decoration:none">${opts.ctaLabel}</a></div>`
        : ""
    }
    <div style="padding:16px 32px 28px;border-top:1px solid #ECE9E4;margin-top:16px">
      <p style="font-size:12px;color:#8a8983;margin:0">${opts.footerNote ?? "Sent via cacnorthamerica.com · Questions? Reply to this email."}</p>
    </div>
  </div>
</body>
</html>`;
}

/** A single labeled card, the recurring "one payment option / one detail
 *  row" visual unit used across these emails. */
export function emailCard(title: string, detail: string): string {
  return `<div style="background:#fff;border:1px solid #ECE9E4;border-radius:12px;padding:14px 16px;margin-bottom:10px">
    <div style="font-weight:700;font-size:14px;color:#12141E;margin-bottom:3px">${title}</div>
    <div style="font-size:13px;color:#5f5e5a;line-height:1.5">${detail}</div>
  </div>`;
}
