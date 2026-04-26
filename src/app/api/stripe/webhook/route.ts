import { NextRequest, NextResponse } from "next/server";
import { stripe, getPlanFromPriceId } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;

      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      const userId = sub.metadata?.userId ?? session.metadata?.userId;
      if (!userId) break;

      const priceId = sub.items.data[0]?.price.id ?? null;
      const plan = getPlanFromPriceId(priceId);

      await db.user.update({
        where: { id: userId },
        data: {
          plan,
          stripeSubscriptionId: sub.id,
          stripePriceId: priceId,
          stripeCurrentPeriodEnd: new Date((sub as any).current_period_end * 1000),
        },
      });
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const subId = (invoice as any).subscription as string | null;
      if (!subId) break;

      const sub = await stripe.subscriptions.retrieve(subId);
      const userId = sub.metadata?.userId;
      if (!userId) break;

      const priceId = sub.items.data[0]?.price.id ?? null;
      const plan = getPlanFromPriceId(priceId);

      await db.user.update({
        where: { id: userId },
        data: {
          plan,
          stripePriceId: priceId,
          stripeCurrentPeriodEnd: new Date((sub as any).current_period_end * 1000),
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (!userId) break;

      await db.user.update({
        where: { id: userId },
        data: {
          plan: "FREE",
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
