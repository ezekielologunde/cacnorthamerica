import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { FORM_HEADER } from "@/lib/spam";
import { GIVING_CAMPAIGNS, zelleRecipientFor } from "@/lib/giving";
import { validateGiftBasics, type GiftBasics } from "@/lib/givingRequest";
import { giftZelleReference } from "@/lib/zelleReference";
import { sendZelleGiftEmails } from "@/lib/givingEmail";
import { logToSheet } from "@/lib/sheetsWebhook";

const HOUR_MS = 60 * 60 * 1000;

// A Zelle gift has no checkout: the donor sends it from their own bank app.
// This records the pledge (a sheet row plus an email to the committee), hands
// back the recipient and a memo reference so the treasurer can match the
// payment, and emails the same details to the donor. The recipient always
// comes from lib/giving.ts, never from the request.
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

  const validationError = validateGiftBasics(rawBody, GIVING_CAMPAIGNS.map((c) => c.slug));
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }
  const body = rawBody as GiftBasics;
  const campaign = GIVING_CAMPAIGNS.find((c) => c.slug === body.campaignSlug)!;

  const recipient = zelleRecipientFor(campaign);
  if (!recipient) {
    return NextResponse.json(
      { error: "Zelle isn't available for this campaign. Please choose card or bank, or contact us." },
      { status: 400 },
    );
  }

  // Each submission emails the donor and the committee, so cap it per address
  // as well, which stops the form being used to mail someone else.
  const contactEmail = body.contactEmail.trim();
  if (!rateLimit(`giving-zelle:${contactEmail.toLowerCase()}`, 3, HOUR_MS)) {
    return NextResponse.json({ error: "Too many requests for this email. Please try again later." }, { status: 429 });
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

  logToSheet("Giving Zelle", {
    "Campaign": campaign.title,
    "Contact Name": contactName,
    "Contact Email": contactEmail,
    "Amount": amountLabel,
    "Zelle Reference": zelleRef,
    "Status": "awaiting Zelle (unverified)",
  });

  const emailed = await sendZelleGiftEmails({
    contactName,
    contactEmail,
    campaignTitle: campaign.title,
    amountLabel,
    recipient,
    zelleRef,
  });

  return NextResponse.json({ zelleRef, recipient, amountCents: body.amountCents, emailed });
}
