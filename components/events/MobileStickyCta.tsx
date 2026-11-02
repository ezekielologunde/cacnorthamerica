/** Thumb-reachable primary action for event pages. Phones only (CSS in
 *  app/(site)/[locale]/mobile-events-media.css hides it from 768px up). */
export function MobileStickyCta({ href, label, external = true }: { href: string; label: string; external?: boolean }) {
  return (
    <>
      <div className="mm-sticky-spacer" aria-hidden />
      <div className="mm-sticky">
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{label}</a>
      </div>
    </>
  );
}
