import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { rateLimit } from "@/lib/rateLimit";
import { SITE_URL } from "@/lib/site";
import { storeProducts } from "@/lib/conventions";

type CheckoutRequestBody = {
  contactName: string;
  contactEmail: string;
  items: { productId: string; size: string | null; quantity: number }[];
};

function validateRequestBody(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return "Request body must be a JSON object";
  }
  const b = body as Partial<CheckoutRequestBody>;

  if (typeof b.contactName !== "string" || b.contactName.trim() === "") {
    return "contactName is required";
  }
  if (typeof b.contactEmail !== "string" || b.contactEmail.trim() === "") {
    return "contactEmail is required";
  }
  if (!Array.isArray(b.items) || b.items.length === 0) {
    return "items must be a non-empty array";
  }
  for (const item of b.items) {
    if (!item || typeof item !== "object") {
      return "Each item must be an object";
    }
    const i = item as Partial<{ productId: string; quantity: number }>;
    if (typeof i.productId !== "string" || i.productId.trim() === "") {
      return "Each item must have a productId";
    }
    if (typeof i.quantity !== "number" || i.quantity < 1) {
      return "Each item must have a quantity of at least 1";
    }
  }
  return null;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

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

  const body = rawBody as CheckoutRequestBody;
  const productById = new Map(storeProducts.map((p) => [p.id, p]));

  // Re-price every line from the server-side catalog -- the client's cart
  // never dictates the amount charged, same discipline as app/api/register.
  const lines: { name: string; size: string | null; quantity: number; unitPriceCents: number }[] = [];
  for (const item of body.items) {
    const product = productById.get(item.productId);
    if (!product) {
      return NextResponse.json({ error: `Unknown or inactive product: ${item.productId}` }, { status: 400 });
    }
    if (product.sizes.length > 0 && (!item.size || !product.sizes.includes(item.size))) {
      return NextResponse.json({ error: `Invalid size for ${product.name}` }, { status: 400 });
    }
    lines.push({
      name: product.name,
      size: product.sizes.length > 0 ? item.size : null,
      quantity: item.quantity,
      unitPriceCents: product.priceCents,
    });
  }

  const stripe = getStripeClient();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lines.map((l) => ({
        price_data: {
          currency: "usd",
          unit_amount: l.unitPriceCents,
          product_data: { name: l.size ? `${l.name} — ${l.size}` : l.name },
        },
        quantity: l.quantity,
      })),
      customer_email: body.contactEmail,
      success_url: `${SITE_URL}/store/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/store`,
      metadata: { kind: "store_order", contact_name: body.contactName },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
