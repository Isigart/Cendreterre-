import Stripe from "stripe";
import { getRedis, keys } from "./redis";
import type { UserSubscription } from "./types";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return stripe;
}

export async function createCheckoutSession(
  userId: string,
  email: string
): Promise<string> {
  const s = getStripe();
  const session = await s.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 14,
      metadata: { userId },
    },
    success_url: `${process.env.NEXTAUTH_URL}/recettes?subscribed=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/profil`,
    metadata: { userId },
  });
  return session.url!;
}

export async function syncSubscription(
  stripeSubscription: Stripe.Subscription
): Promise<void> {
  const redis = getRedis();
  const userId = stripeSubscription.metadata.userId;
  if (!userId) return;

  const sub: UserSubscription = {
    userId,
    stripeCustomerId:
      typeof stripeSubscription.customer === "string"
        ? stripeSubscription.customer
        : stripeSubscription.customer.id,
    stripeSubscriptionId: stripeSubscription.id,
    status: stripeSubscription.status as UserSubscription["status"],
    currentPeriodEnd: new Date(
      stripeSubscription.current_period_end * 1000
    ).toISOString(),
    trialEnd: stripeSubscription.trial_end
      ? new Date(stripeSubscription.trial_end * 1000).toISOString()
      : undefined,
  };

  await redis.set(keys.subscription(userId), sub);
}

export async function getSubscription(
  userId: string
): Promise<UserSubscription | null> {
  const redis = getRedis();
  return redis.get<UserSubscription>(keys.subscription(userId));
}

export function hasActiveSubscription(sub: UserSubscription | null): boolean {
  if (!sub) return false;
  return sub.status === "active" || sub.status === "trialing";
}
