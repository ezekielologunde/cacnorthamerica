import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { FORM_HEADER, countLinks } from "@/lib/spam";
import { GIVING_CAMPAIGNS, purposeValuesBySlug, withPurpose, zelleRecipientFor } from "@/lib/giving";
import { emailLimitKey, validateGiftBasics, type GiftBasics } from "@/lib/givingRequest";
import { giftZelleReference } from "@/lib/zelleReference";
import { sendZelleCommitteeEmail, sendZelleDonorEmail } from "@/lib/givingEmail";
import { recordPledgeThenNotifyDonor } from "@/lib/zellePledge";
import { logToSheetChecked } from "@/lib/sheetsWebhook";
import { TURNSTILE_ERROR, verifyTurnstile } from "@/lib/turnstile";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

// A Zelle gift has no checkout: the donor sends it from their own bank app.
// This records the pledge (a sheet row plus an email to the committee), hands
// back the recipient and a memo reference so the treasurer can match the
// payment, and emails the same details to the donor. The recipient always
// comes from lib/giving.ts, never from the request.
//
// Every accepted submission sends the donor a mail from the church's own
// address, so the limits below are the real defence against using this form to
// mail someone else: per IP, per inbox (normalised, one per day, like
// registration's Zelle confirmation) and for the route as a whole.
export async function POST(request: Request) {
  // Only the site's own form sends this header; a bot posting straight to the
  // API usually omits it.
  if (!request.headers.get(FORM_HEADER)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!rateLimit(clientIp(request.headers), 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const turnstileToken = rawBody && typeof rawBody === "object" ? (rawBody as Record<string, unknown>).turnstileToken : undefined;
  if (!(await verifyTurnstile(turnstileToken, clientIp(request.headers)))) {
    return NextResponse.json({ error: TURNSTILE_ERROR }, { status: 400 });
  }

  const validationError = validateGiftBasics(rawBody, GIVING_CAMPAIGNS.map((c) => c.slug), purposeValuesBySlug());
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }
  const body = rawBody as GiftBasics;
  // The name is echoed in the mail the donor gets, so a web address in it would
  // turn our own email into a link-carrying message to a stranger.
  if (countLinks([body.contactName]) > 0) {
    return NextResponse.json({ error: "Please enter your name without a web address" }, { status: 400 });
  }
  const campaign = GIVING_CAMPAIGNS.find((c) => c.slug === body.campaignSlug)!;

  const recipient = zelleRecipientFor(campaign);
  if (!recipient) {
    return NextResponse.json(
      { error: "Zelle isn't available for this campaign. Please choose card or bank, or contact us." },
      { status: 400 },
    );
  }

  const contactEmail = body.contactEmail.trim();
  if (!rateLimit(`giving-zelle:${emailLimitKey(contactEmail)}`, 3, DAY_MS)) {
    return NextResponse.json({ error: "Too many requests for this email. Please try again tomorrow." }, { status: 429 });
  }
  if (!rateLimit("giving-zelle:all", 60, HOUR_MS)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let zelleRef: string;
  try {
    zelleRef = giftZelleReference(randomUUID());
  } catch (err) {
    console.error("[giving zelle] could not make a reference:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  const contactName = body.contactName.trim();
  const amountLabel = `$${(body.amountCents / 100).toFixed(2)}`;
  const giftTitle = withPurpose(campaign.name, campaign, body.purpose);

  const mail = { contactName, contactEmail, campaignTitle: giftTitle, amountLabel, recipient, zelleRef };

  // The donor is emailed the address and reference only after the pledge is
  // recorded (sheet row or committee email). If neither landed, fail before they
  // send money: nothing has gone to them, and a retry makes a fresh reference.
  const outcome = await recordPledgeThenNotifyDonor({
    recordInSheet: () =>
      logToSheetChecked("Giving Zelle", {
        "Campaign": giftTitle,
        "Contact Name": contactName,
        "Contact Email": contactEmail,
        "Amount": amountLabel,
        "Zelle Reference": zelleRef,
        "Status": "awaiting Zelle (unverified)",
      }),
    emailCommittee: () => sendZelleCommitteeEmail(mail),
    emailDonor: () => sendZelleDonorEmail(mail),
  });
  if (!outcome.recorded) {
    console.error(`[giving zelle] pledge not recorded: ${zelleRef} ${amountLabel} ${campaign.name} ${contactEmail}`);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ zelleRef, recipient, amountCents: body.amountCents, emailed: outcome.donorSent });
}
