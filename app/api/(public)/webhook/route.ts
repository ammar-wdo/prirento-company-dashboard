import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";


export async function POST(req: Request) {

  console.log('webhook')
  const body = await req.text();
  

  const signature = headers().get("Stripe-Signature") as string;


  let event: Stripe.Event;




  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );


  } catch (error: any) {
    console.log(error)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {

    //checkout completed
    case "checkout.session.completed": {
        try {
          if (session.payment_status === "paid") {
            const order = await prisma.booking.update({
              where: {
                id: session?.metadata?.id,
              },
              data: {
                paymentStatus: "SUCCEEDED",
              },
            
            });
      

          }
        } catch (error) {
          console.log(error);
        }
  

      break;
    }
//checkout expired
    case "checkout.session.expired": {
 
      
        try {
          const order = await prisma.booking.update({
            where: {
              id: session?.metadata?.id,
            },
            data: {
              paymentStatus: "EXPIRED",
              bookingStatus: "CANCELED",
            },
        
          });

       
        } catch (error) {
          console.log(error);
        }
   
      break;
    }
//checkout refunded
    case "charge.refunded": {
      try {
        const order = await prisma.booking.update({
          where: {
            id: session?.metadata?.id,
          },
          data: {
            paymentStatus: "CANCELED",
            bookingStatus: "REFUNDED",
          },
        
        });
      } catch (error) {
        console.log(error);
      }
    }

    default:
  }

  return new NextResponse(null, { status: 200 });
}