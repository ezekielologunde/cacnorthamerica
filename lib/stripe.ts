import Stripe from "stripe";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getStripeClient(): Stripe {
  return new Stripe(requireEnv("STRIPE_SECRET_KEY"), {
    apiVersion: "2026-06-24.dahlia",
  });
}
