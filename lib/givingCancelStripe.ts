import { getStripeClient } from "@/lib/stripe";
import { openCancelToken, sealCancelToken } from "@/lib/cancelToken";
import { sendGivingCancelLinkEmail } from "@/lib/givingCancelEmail";
import { stripeGiftOps, type CancelDeps, type StripeLike } from "@/lib/givingCancel";

// The real wiring for lib/givingCancel.ts. The Stripe logic itself
// (stripeGiftOps) lives in that module so the checks can run it against a fake.
export function cancelDeps(): CancelDeps {
  return {
    ...stripeGiftOps(getStripeClient() satisfies StripeLike),
    sealToken: sealCancelToken,
    openToken: openCancelToken,
    sendLink: sendGivingCancelLinkEmail,
  };
}
