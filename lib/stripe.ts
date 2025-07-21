import Stripe from 'stripe';

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Stripe configuration
export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
};

// Utility function to format amount for Stripe (convert to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Utility function to format amount from Stripe (convert from cents)
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};

// Create a payment intent
export const createPaymentIntent = async (params: {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}) => {
  const { amount, currency = 'usd', metadata = {} } = params;

  return await stripe.paymentIntents.create({
    amount: formatAmountForStripe(amount),
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
};

// Retrieve a payment intent
export const retrievePaymentIntent = async (paymentIntentId: string) => {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
};

// Create a customer
export const createCustomer = async (params: {
  email: string;
  name?: string;
  phone?: string;
}) => {
  return await stripe.customers.create(params);
};

// Update a customer
export const updateCustomer = async (
  customerId: string,
  params: {
    email?: string;
    name?: string;
    phone?: string;
  }
) => {
  return await stripe.customers.update(customerId, params);
}; 