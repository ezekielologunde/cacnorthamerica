// Pages whose URL query string carries a secret (Stripe session id or sealed
// registration token): event registration, giving and store confirmations.
// GoogleTags strips the query from page_location on these before anything is
// sent to Google; keep this the single definition.
export const CONFIRMATION_PATH = /\/confirmation\/?$/;

export function isConfirmationPath(pathname: string): boolean {
  return CONFIRMATION_PATH.test(pathname);
}
