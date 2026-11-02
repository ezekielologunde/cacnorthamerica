import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { SITE_URL } from "@/lib/site";
import { storeProducts } from "@/lib/conventions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_LINE_ITEMS = 20;
const MAX_QUANTITY = 50;

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
  if (b.contactName.length > MAX_FIELD_LENGTH) {
    return `contactName must be ${MAX_FIELD_LENGTH} characters or fewer`;
  }
  if (typeof b.contactEmail !== "string" || b.contactEmail.trim() === "") {
    return "contactEmail is required";
  }
  if (b.contactEmail.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(b.contactEmail.trim())) {
    return "Please enter a valid email address";
  }
  if (!Array.isArray(b.items) || b.items.length === 0) {
    return "items must be a non-empty array";
  }
  if (b.items.length > MAX_LINE_ITEMS) {
    return `An order can have at most ${MAX_LINE_ITEMS} items`;
  }
  for (const item of b.items) {
    if (!item || typeof item !== "object") {
      return "Each item must be an object";
    }
    const i = item as Partial<{ productId: string; quantity: number }>;
    if (typeof i.productId !== "string" || i.productId.trim() === "") {
      return "Each item must have a productId";
    }
    if (typeof i.quantity !== "number" || !Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > MAX_QUANTITY) {
      return `Each item must have a whole-number quantity from 1 to ${MAX_QUANTITY}`;
    }
  }
  return null;
}

export async function POST(request: Request) {
  if (!rateLimit(clientIp(request.headers), 5, 60_000)) {
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
      // Every item is a physical product (books, apparel) -- without this the
      // order has no address to ship to. Shipping cost is not charged here yet.
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      success_url: `${SITE_URL}/store/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/store`,
      metadata: { kind: "store_order", contact_name: body.contactName },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
