import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rateLimit";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cacsalvationcenter.org";

type OrderItem = { id: string; quantity: number; variant?: string };

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (!rateLimit(ip, 20, 60_000)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!stripeKey) {
    return Response.json(
      { error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment." },
      { status: 503 }
    );
  }
  if (!stripeKey.startsWith("sk_") && !stripeKey.startsWith("rk_")) {
    console.error(`[checkout] STRIPE_SECRET_KEY unexpected format — length:${stripeKey.length} prefix:${stripeKey.substring(0, 3)}`);
    return Response.json({ error: "Stripe configuration error. Please contact support." }, { status: 503 });
  }

  let orderItems: OrderItem[];
  try {
    ({ items: orderItems } = await req.json());
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return Response.json({ error: "Cart is empty" }, { status: 400 });
  }

  const validItems = orderItems.filter(
    (i) =>
      typeof i.id === "string" &&
      Number.isInteger(i.quantity) &&
      i.quantity > 0 &&
      i.quantity <= 100
  );
  if (validItems.length === 0) {
    return Response.json({ error: "Invalid cart items" }, { status: 400 });
  }

  // Server-side price lookup — client-supplied priceCents is ignored
  const supabase = createServiceClient();
  const ids = [...new Set(validItems.map((i) => i.id))];
  const { data: products, error: dbError } = await supabase
    .from("products")
    .select("id, name, category, price_cents, is_digital, digital_file_url")
    .in("id", ids)
    .eq("published", true);

  if (dbError || !products) {
    return Response.json({ error: "Could not load products" }, { status: 500 });
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of validItems) {
    if (!productMap.has(item.id)) {
      return Response.json({ error: "Unknown or unavailable product" }, { status: 400 });
    }
    const p = productMap.get(item.id)!;
    if (!p.price_cents || p.price_cents < 50) {
      return Response.json({ error: `"${p.name}" is not available for checkout at this time.` }, { status: 400 });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" as any });

  const allDigital = validItems.every((i) => productMap.get(i.id)!.is_digital);
  const hasDigital = validItems.some((i) => productMap.get(i.id)!.is_digital);

  const line_items = validItems.map((item) => {
    const product = productMap.get(item.id)!;
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.variant ? `${product.name} — ${item.variant}` : product.name,
          description: product.category,
          // Embed product_id and is_digital so webhook/success page can trace back without DB lookup
          metadata: {
            product_id: product.id,
            is_digital: product.is_digital ? "true" : "false",
          },
        },
        unit_amount: product.price_cents,
      },
      quantity: item.quantity,
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${SITE_URL}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/store`,
      // Skip shipping for digital-only orders
      ...(allDigital ? {} : {
        shipping_address_collection: { allowed_countries: ["US", "CA"] },
        phone_number_collection: { enabled: true },
      }),
      billing_address_collection: "auto",
      custom_text: {
        submit: {
          message: allDigital
            ? "Download link emailed within minutes. All proceeds support CAC Salvation Center ministries."
            : "Your receipt will be emailed. All proceeds support CAC Salvation Center ministries.",
        },
      },
      metadata: {
        source: "cac-salvation-center-store",
        has_digital: hasDigital ? "true" : "false",
      },
    });

    if (!session.url) {
      return Response.json({ error: "Stripe did not return a checkout URL." }, { status: 500 });
    }

    return Response.json({ url: session.url });
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      console.error("[checkout] Stripe error:", JSON.stringify({
        type: err.type,
        code: err.code,
        statusCode: err.statusCode,
        message: err.message,
      }));
      if (err.type === "StripeAuthenticationError") {
        return Response.json({ error: "Payment provider configuration error. Please contact support." }, { status: 500 });
      }
      return Response.json({ error: `Checkout failed: ${err.message}` }, { status: 500 });
    }
    console.error("[checkout] Unexpected error:", err instanceof Error ? err.message : String(err));
    return Response.json({ error: "Could not create checkout session. Please try again." }, { status: 500 });
  }
}
