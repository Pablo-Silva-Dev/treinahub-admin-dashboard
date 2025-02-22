import Stripe from "stripe";

const VITE_STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY;

const stripe = new Stripe(VITE_STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia",
});

export default stripe;
