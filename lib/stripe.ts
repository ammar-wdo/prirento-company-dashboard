import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
});

export const startStripeSession = async (
  metaData: any,
  email: string,
  myPayment: "card" | "paypal",
  carName: string,
  period: string,

  payNow: number,
  bookingId: string,
  image:string
) => {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,

    payment_intent_data: {
      metadata: metaData,
      capture_method: "automatic",
    },
    payment_method_types: [myPayment as "card" | "paypal"],

    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: carName,
            description: `booked for ${period}`,
            images:[image]
          },
          unit_amount: Math.round(payNow * 100),
        },
        
        quantity: 1,
      },
    ],
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    mode: "payment",
    metadata: metaData,

    success_url: `${process.env
      .NEXT_PUBLIC_FRONTEND!}/checkout-result?success=${bookingId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout-result?canceled=true`,
  });

  return session;
};
