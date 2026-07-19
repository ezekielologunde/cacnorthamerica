import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { currentOrNextConvention } from "@/lib/conventions";
import { getActivePricingForYear, priceForCategory, type RegistrantCategory } from "@/lib/registration";
import { getStripe } from "@/lib/stripe-registration";
import { SITE_URL } from "@/lib/site";

type RegisterRequestBody = {
  registrationType: "individual" | "group";
  churchName: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  registrants: { fullName: string; category: RegistrantCategory }[];
};

const VALID_CATEGORIES: RegistrantCategory[] = ["adult", "young_adult", "child"];
const VALID_REGISTRATION_TYPES: RegisterRequestBody["registrationType"][] = ["individual", "group"];

// Plain, explicit checks rather than a schema library — ported verbatim
// from the Convention project's app/api/register/route.ts.
function validateRequestBody(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return "Request body must be a JSON object";
  }

  const b = body as Partial<RegisterRequestBody>;

  if (typeof b.registrationType !== "string" || !VALID_REGISTRATION_TYPES.includes(b.registrationType)) {
    return "registrationType must be 'individual' or 'group'";
  }

  if (typeof b.contactName !== "string" || b.contactName.trim() === "") {
    return "contactName is required";
  }

  if (typeof b.contactEmail !== "string" || b.contactEmail.trim() === "") {
    return "contactEmail is required";
  }

  if (!Array.isArray(b.registrants) || b.registrants.length === 0) {
    return "registrants must be a non-empty array";
  }

  for (const registrant of b.registrants) {
    if (!registrant || typeof registrant !== "object") {
      return "Each registrant must be an object";
    }

    const r = registrant as Partial<{ fullName: string; category: RegistrantCategory }>;

    if (typeof r.fullName !== "string" || r.fullName.trim() === "") {
      return "Each registrant must have a non-empty fullName";
    }

    if (typeof r.category !== "string" || !VALID_CATEGORIES.includes(r.category as RegistrantCategory)) {
      return `Invalid registrant category: ${String(r.category)}`;
    }
  }

  return null;
}

// Best-effort rollback for partial failures — matches Convention's own
// cleanupPartialRegistration behavior.
async function cleanupPartialRegistration(
  supabase: ReturnType<typeof createServiceClient>,
  registrationId: string,
  options: { deleteRegistrants: boolean }
): Promise<void> {
  try {
    if (options.deleteRegistrants) {
      const { error } = await supabase.from("convention_registrants").delete().eq("registration_id", registrationId);
      if (error) {
        console.error("Failed to clean up convention_registrants after a partial registration failure", {
          registrationId,
          error,
        });
      }
    }

    const { error } = await supabase.from("convention_registrations").delete().eq("id", registrationId);
    if (error) {
      console.error("Failed to clean up convention_registrations after a partial failure", { registrationId, error });
    }
  } catch (cleanupError) {
    console.error("Cleanup after a partial registration failure threw", { registrationId, cleanupError });
  }
}

export async function POST(request: Request) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validationError = validateRequestBody(rawBody);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const body = rawBody as RegisterRequestBody;
  const supabase = createServiceClient();

  const year = currentOrNextConvention().year;
  const tiers = await getActivePricingForYear(supabase, year);

  // Re-price every registrant server-side — any price the client sent is
  // read nowhere below and is discarded. Child is always free, matching
  // Convention's own fixed business rule (not admin-configurable pricing).
  const pricedRegistrants: { full_name: string; category: RegistrantCategory; price_cents: number }[] = [];
  for (const registrant of body.registrants) {
    if (registrant.category === "child") {
      pricedRegistrants.push({
        full_name: registrant.fullName,
        category: registrant.category,
        price_cents: 0,
      });
      continue;
    }

    const price = priceForCategory(tiers, registrant.category);
    if (!price) {
      return NextResponse.json(
        { error: `Registration pricing for "${registrant.category}" hasn't been announced yet — please check back closer to the convention.` },
        { status: 409 }
      );
    }
    pricedRegistrants.push({
      full_name: registrant.fullName,
      category: registrant.category,
      price_cents: price.price_cents,
    });
  }

  const totalAmountCents = pricedRegistrants.reduce((sum, r) => sum + r.price_cents, 0);

  const { data: registration, error: registrationError } = await supabase
    .from("convention_registrations")
    .insert({
      year,
      registration_type: body.registrationType,
      church_name: body.churchName,
      contact_name: body.contactName,
      contact_email: body.contactEmail,
      contact_phone: body.contactPhone || null,
      total_amount_cents: totalAmountCents,
    })
    .select()
    .single();

  if (registrationError || !registration) {
    return NextResponse.json({ error: "Failed to create registration" }, { status: 500 });
  }

  const { error: registrantsError } = await supabase
    .from("convention_registrants")
    .insert(
      pricedRegistrants.map((r) => ({
        registration_id: registration.id,
        full_name: r.full_name,
        category: r.category,
        price_cents: r.price_cents,
      }))
    );

  if (registrantsError) {
    await cleanupPartialRegistration(supabase, registration.id, { deleteRegistrants: false });
    return NextResponse.json({ error: "Failed to create registrants" }, { status: 500 });
  }

  // All-free registration (e.g. children only) — nothing for Stripe to
  // charge, and Stripe Checkout rejects $0 sessions, so skip it entirely.
  if (totalAmountCents === 0) {
    await supabase.from("convention_registrations").update({ status: "paid" }).eq("id", registration.id);
    return NextResponse.json({
      checkoutUrl: `${SITE_URL}/convention/register/confirmation?registration=${registration.id}`,
    });
  }

  const stripe = getStripe();
  if (!stripe) {
    await cleanupPartialRegistration(supabase, registration.id, { deleteRegistrants: true });
    return NextResponse.json(
      { error: "Online payment isn't configured yet — please contact us to complete your registration." },
      { status: 503 }
    );
  }

  const payableRegistrants = pricedRegistrants.filter((r) => r.price_cents > 0);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: payableRegistrants.map((r) => ({
        price_data: {
          currency: "usd",
          unit_amount: r.price_cents,
          product_data: { name: `CACNA ${year} Convention registration — ${r.full_name} (${r.category})` },
        },
        quantity: 1,
      })),
      customer_email: body.contactEmail,
      success_url: `${SITE_URL}/convention/register/confirmation?registration=${registration.id}`,
      cancel_url: `${SITE_URL}/convention/register`,
      metadata: { registration_id: registration.id },
    });

    await supabase
      .from("convention_registrations")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", registration.id);

    return NextResponse.json({ checkoutUrl: session.url });
  } catch {
    await cleanupPartialRegistration(supabase, registration.id, { deleteRegistrants: true });
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
