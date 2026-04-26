import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { apiVersion: "2026-04-22.dahlia", typescript: true });
  }
  return _stripe;
}

/** @deprecated use getStripe() */
export const stripe = new Proxy({} as Stripe, {
  get(_t, prop) {
    return (getStripe() as never)[prop as never];
  },
});

// Price IDs — set in .env
export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    limits: {
      entities: 1,
      bankConnections: 1,
      invoices: 10,
      transactions: 100,
    },
  },
  PRO: {
    name: "Pro",
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    limits: {
      entities: 10,
      bankConnections: 5,
      invoices: -1, // unlimited
      transactions: -1,
    },
  },
  BUSINESS: {
    name: "Business",
    price: 79,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID!,
    limits: {
      entities: -1,
      bankConnections: -1,
      invoices: -1,
      transactions: -1,
    },
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanFromPriceId(priceId: string | null): PlanKey {
  if (priceId === PLANS.PRO.priceId) return "PRO";
  if (priceId === PLANS.BUSINESS.priceId) return "BUSINESS";
  return "FREE";
}

export function isSubscriptionActive(periodEnd: Date | null): boolean {
  if (!periodEnd) return false;
  return periodEnd.getTime() > Date.now();
}
