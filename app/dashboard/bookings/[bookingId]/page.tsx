
import BookingCard from "@/components/(booking)/booking-card";
import KeyValueCard from "@/components/(booking)/key-value-card";
import GoBackButton from "@/components/go-back-button";
import Heading from "@/components/heading";
import prisma from "@/lib/prisma";
import { formatDate, getCompanyEmail } from "@/lib/utils";
import { CarExtraOption, SuperadminRule } from "@prisma/client";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: { bookingId: string };
};

export type RefinedAdminRule ={
    valueToPay: number;
    id: string;
    label: string;
    description: string;
    type: 'fixed' | 'percentage';
    value: number;
    mandatory: boolean;
    applyToAll: boolean;
    carId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const page = async ({ params }: Props) => {
  const companyEmail = await getCompanyEmail()
  const booking = await prisma.booking.findUnique({
    where: {
      id: params.bookingId,
      car:{
        company:{
          email:companyEmail as string
        }
      }
    },
    include: {
      car: {
        select: {
          company: {
            select: {
              name: true,
            },
          },
          carModel: {
            select: {
              name: true,
              carBrand: {
                select: {
                  brand: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!booking) return notFound();

  const extraOptions: CarExtraOption[] =
    booking.extraOptions as unknown as CarExtraOption[];

  const adminRules: RefinedAdminRule[] =
    booking.adminRules as unknown as RefinedAdminRule[];

  return (
    <div>
    
    <div className="flex gap-1">
    <GoBackButton url='/dashboard/bookings'/>  <Heading
        title={`Booking - ${booking.bookingCode}`}
        description={`Booking details`}
      />
    </div>
   
   

     

      <section className="mt-12 grid grid-cols-1 md:grid-cols-2  2xl:grid-cols-4   gap-4">
        {/* Driver Details */}
        <BookingCard title="Driver Details">
          <KeyValueCard title="First name:" description={booking.firstName} />
          <div className="w-full border-b my-2"/>
          <KeyValueCard title="Last name:" description={booking.lastName} />
          <div className="w-full border-b my-2"/>
        
          <KeyValueCard
            title="contact number:"
            description={`+${booking.contactNumber}`}
          />
           <div className="w-full border-b my-2"/>
          <KeyValueCard
            title="country:"
            description={booking.countryOfResidance}
          />
        </BookingCard>
        {/* Billing Details */}

        <BookingCard title="Billing Details">
       
          <KeyValueCard
            title="First name:"
            description={booking.billingFirstName}
          />
           <div className="w-full border-b my-2"/>
          <KeyValueCard
            title="Last name:"
            description={booking.billingLastname}
          />
           <div className="w-full border-b my-2"/>
          <KeyValueCard
            title="contact number:"
            description={`+${booking.billingContactNumber}`}
          />
           <div className="w-full border-b my-2"/>
          <KeyValueCard title="country:" description={booking.billingCountry} />
          <div className="w-full border-b my-2"/>
          <KeyValueCard title="city:" description={booking.billingCity} />
          <div className="w-full border-b my-2"/>
          <KeyValueCard title="address:" description={booking.billingAddress} />
          <div className="w-full border-b my-2"/>
          <KeyValueCard
            title="postcode:"
            description={booking.billingZipcode}
          />
         
           {booking.companyName && (
            <div>  <div className="w-full border-b my-2"/><KeyValueCard
            title="company name"
            description={booking.companyName}
          /> <div className="w-full border-b my-2"/></div>
          )}
          {booking.companyVat && (
           <div><KeyValueCard
           title="company VAT"
           description={booking.companyVat}
         />
       </div> 
          )}
        </BookingCard>

        {/* booking Details */}

        <BookingCard title="Booking Details">
          <KeyValueCard
            title="booking type"
            description={booking.business ? "Business" : "Personal"}
          />
           <div className="w-full border-b my-2"/>
        
          <KeyValueCard
            title="booking date:"
            description={formatDate(booking.createdAt, "en-GB", {
              timeZone: "Asia/Dubai",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          />
          <div className="w-full border-b my-2"/>
          <KeyValueCard
            title="Pick-up date:"
            description={formatDate(booking.startDate)}
          />
          <div className="w-full border-b my-2"/>
          <KeyValueCard
            title="drop-off date:"
            description={formatDate(booking.endDate)}
          />
          <div className="w-full border-b my-2"/>
          <KeyValueCard
            title="pick-up location:"
            description={booking.pickupLocation}
          />
          <div className="w-full border-b my-2"/>
          <KeyValueCard
            title="drop-off location:"
            description={booking.dropoffLocation || booking.pickupLocation}
          />
        </BookingCard>
        {/* payment Details */}

        <BookingCard title="Payment Details">
          <KeyValueCard
            title="payment method"
            description={booking.paymentMethod}
          />
          <KeyValueCard
            title="payment status:"
            description={booking.paymentStatus}
          />
          <div className="w-full border-b my-2"/>
          <KeyValueCard
            title="car rental price:"
            description={"AED " + booking.subtotal.toFixed(2)}
          />
       
     
           <KeyValueCard
            title="refundable deposit:"
            description={"AED " + booking.deposit.toFixed(2)}
          />
           <div className="w-full border-b my-2"/>
          <KeyValueCard
            title="discount:"
            description={"AED " + booking.discount.toFixed(2)}
          />
           <div className="w-full border-b my-2"/>
          <KeyValueCard
            title="delivery fee:"
            description={
              (booking.deliveryFee &&
                "AED " + booking.deliveryFee.toFixed(2)) ||
              "AED 0.00"
            }
          />
           <div className="w-full border-b my-2"/>
            {!!adminRules.length && <div>{adminRules.map((option) => (
              <KeyValueCard
                key={option.id}
                title={option.label}
                description={`AED ${option.valueToPay.toFixed(2)}`}
              />
            ))}
                  <div className="w-full border-b my-2"/>
            </div> }
       
             {!!extraOptions.length && <div>{extraOptions.map((option) => (
              <KeyValueCard
                key={option.id}
                title={option.label}
                description={`AED ${option.price.toFixed(2)}`}
              />
            ))}
                    <div className="w-full border-b my-2"/></div> }
    
          <KeyValueCard
            title="Total amount:"
            description={"AED " + booking.total.toFixed(2)}
          />
           <div className="w-full border-b my-2"/>
          <KeyValueCard
            title="pay now:"
            description={"AED " + booking.payNow.toFixed(2)}
          />
          <KeyValueCard
            title="pay later:"
            description={"AED " + booking.payLater.toFixed(2)}
          />
        </BookingCard>
      
      </section>
    </div>
  );
};

export default page;
