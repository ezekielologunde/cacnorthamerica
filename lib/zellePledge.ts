// What happens, in what order, when someone says they will give by Zelle.
// Import-free so scripts/check-giving-zelle.mjs can run every failure
// combination against fakes.

export type PledgeSteps = {
  /** Appends the pledge to the ledger sheet. */
  recordInSheet: () => Promise<boolean>;
  /** Tells the committee to expect the payment. */
  emailCommittee: () => Promise<boolean>;
  /** Sends the donor the Zelle address and memo reference. */
  emailDonor: () => Promise<boolean>;
};

export type PledgeOutcome = { recorded: false } | { recorded: true; donorSent: boolean };

/** Zelle payments can't be reversed and are matched by reference, so the
 *  donor must never be handed an address and reference that nobody on our side
 *  has a record of. The pledge is recorded first (sheet row and committee
 *  email, in parallel); the donor's email goes out only once at least one of
 *  those landed. A step that throws counts as failed. */
export async function recordPledgeThenNotifyDonor(steps: PledgeSteps): Promise<PledgeOutcome> {
  const [sheetOk, committeeSent] = await Promise.all([
    steps.recordInSheet().catch(() => false),
    steps.emailCommittee().catch(() => false),
  ]);
  if (!sheetOk && !committeeSent) return { recorded: false };
  const donorSent = await steps.emailDonor().catch(() => false);
  return { recorded: true, donorSent };
}
