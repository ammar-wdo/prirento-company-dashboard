import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { startStripeSession } from "@/lib/stripe";
import {
  calculateDiscount,
  calculateExtraOptionsAndPrice,
  calculateHours,
  calculateReservationFee,
  calculateTotalRentalPriceWithAvailability,
  checkDiscount,
  combineDateAndTimeToUTC,
  extractPayments,
  extractSuperadminRulesAndPrices,
  generateBookingCode,
  isDeliveryFee,
} from "@/lib/utils";
import { paymentMethodMap } from "@/mappting";
import { bookingSchema } from "@/schemas";
import { NextResponse } from "next/server";

export const revalidate = 0;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export const POST = async (
  req: Request,
  { params }: { params: { carSlug: string } }
) => {


  let booking
  try {
    const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests

    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
      throw new CustomError("Unauthorized request");
    }

    if (!params.carSlug) {
      throw new CustomError("Car slug is required");
    }

    const body = await req.json();

    //extract values to parse
    const {
      optionalSuperAdminRulesIds,
      carExtraOptionsIds,
      discountCode,
      values,
    } = body;

    //parsing the incoming data
    const validData = bookingSchema.safeParse(values);
    if (!validData.success) {
      throw new CustomError("Invalid inputs");
    }

    const {
      startDate,
      startTime,
      endDate,
      endTime,
      pickupLocation,
      dropoffLocation,
    ...rest} = validData.data;

    const startDateObject = combineDateAndTimeToUTC(startDate, startTime);
    const endDateObject = combineDateAndTimeToUTC(endDate, endTime);

    //fetching the car using certain criteria
    const car = await prisma.car.findUnique({
      where: {
        slug: params.carSlug,
        disabled: false,
        carStatus: "active",
        company: {
          away: false,
        },
        pickupLocations: {
          some: {
            slug: pickupLocation,
          },
        },
        ...(validData.data.dropoffLocation && {
          dropoffLocations: { some: { slug: dropoffLocation } },
        }),
      },
      include: {
        carModel:{
include:{
  carBrand:{
    select:{brand:true}
  }
}
        },
        availabilities: {
          where: {
            AND: [
              {
                startDate: {
                  lte: endDateObject,
                },
              },
              {
                endDate: {
                  gte: startDateObject,
                },
              },
            ],
          },
        },
        bookings: {
          where: {
            AND: [
              { bookingStatus: "ACTIVE" },
              { paymentStatus: { in: ["PENDING", "SUCCEEDED"] } },
              {
                startDate: {
                  lte: endDateObject,
                },
              },
              {
                endDate: {
                  gte: startDateObject,
                },
              },
            ],
          },
        },
      },
    });

    //if no car or not available or booked return not available
    if (!car || !!car.availabilities.length || !!car.bookings.length)
      throw new CustomError("Car is not available");

    //check if price is available for chosen date
    const { totalPrice, isAvailable, rentalPeriodDescription } =
      calculateTotalRentalPriceWithAvailability(
        startDateObject,
        endDateObject,
        car.pricings,
        car.hourPrice
      );

    if (!isAvailable) throw new CustomError("Car is not available");

    //check that minimum hours are satisfied
    const hours = calculateHours(startDateObject, endDateObject);
    if (car.minimumHours && hours < car.minimumHours)
      throw new CustomError("Car is not available");

    // check that reservation fee is not bigger than car price for chosen dates
    const reservationFee = calculateReservationFee(
      car.reservationPercentage,
      car.reservationFlatFee,
      totalPrice as number
    );
    if (!reservationFee) throw new CustomError("Car is not available");

    //check discount if exist
    const returnedDiscount = discountCode
      ? await checkDiscount(
          discountCode,
          params.carSlug,
          startDateObject,
          endDateObject,
          reservationFee
        )
      : null;

    //calculate discount value if there is a discount
    const discountValue = returnedDiscount
      ? calculateDiscount(
          reservationFee,
          returnedDiscount.type,
          returnedDiscount.value
        )
      : 0;

    //extract car extra options and calculate price if any exists
    const { carExtraOptions, carExtraOptionsPrice } =
      await calculateExtraOptionsAndPrice(carExtraOptionsIds);

    //check delivery fee
    const deliveryFee = isDeliveryFee(dropoffLocation, pickupLocation)
      ? car.deleviryFee
      : 0;

    //extract super admin rules and its pricing...

    const {
      mandatoryRulesPrice,
      optionalRulesPrice,
      refinedMandaturyRules,
      refinedOptionalRules,
    } = await extractSuperadminRulesAndPrices(
      car.id,
      optionalSuperAdminRulesIds,
      totalPrice as number
    );

    //extract payments (totalAmount - checkoutPayment - laterPayment for company)
    const { totalAmount, checkoutPayment, payLater } = extractPayments({
      totalPrice: totalPrice as number,
      carDeposit: car.deposite,
      carExtraOptionsPrice,
      deliveryFee,
      discountValue,
      reservationFee,
      mandatoryRulesPrice,
      optionalRulesPrice,
    });

//generate unique booking code
    const bookingCode = await generateBookingCode()

    //create new booking

     booking = await prisma.booking.create({
      data:{
        ...rest,
        carId:car.id,
        email:validData.data.email.toLowerCase(),
        pickupLocation:pickupLocation,
        ...(dropoffLocation && {dropoffLocation}),
        bookingCode,
        startDate:startDateObject,
        endDate:endDateObject,
        discount:discountValue,
        extraOptions:carExtraOptions || [],
        adminRules:[...refinedMandaturyRules,...refinedOptionalRules],
        subtotal:totalAmount,
        total:totalAmount,
        payLater:payLater,
        payNow:checkoutPayment,
        reservationFee
      }
    })

    console.log("booking id",booking.id)
// generate car name
    const carName = `${car.carModel.carBrand.brand} ${car.carModel.name}`

    //map payment method 

    const paymentMethod = paymentMethodMap[booking.paymentMethod]
//initiate a stripe session
    const session = await startStripeSession({id:booking.id},booking.email,paymentMethod,carName,rentalPeriodDescription,checkoutPayment,booking.id)






    return NextResponse.json(
      {
        success: true,
        url:session.url,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    // await prisma.booking.delete({
    //   where:{
    //     id:booking?.id 
    //   }
    // })
    console.log(error);

    let errorMessage = "Internal server error";
    if (error instanceof CustomError) errorMessage = error.message;
    return NextResponse.json(
      { error: errorMessage, success: false, url: undefined },
      { status: 200 }
    );
  }
};
