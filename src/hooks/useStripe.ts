import { Stripe, loadStripe } from "@stripe/stripe-js";
import { useCallback, useEffect, useState } from "react";
import stripe from "../libs/stripe";

export const useStripe = () => {
  const [, setStripe] = useState<Stripe | null>(null);
  const loadStripeAsync = useCallback(async () => {
    const stripeInstance = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
    );
    setStripe(stripeInstance);
  }, []);

  useEffect(() => {
    loadStripeAsync();
  }, [loadStripeAsync]);

  const cancelSubscription = async (subscriptionId: string) => {
    const response = await stripe.subscriptions.cancel(subscriptionId);
    return response;
  };

  return {
    cancelSubscription,
  };
};
