import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import {
  calculateDiscount,
  calculateExtraOptionsAndPrice,
  calculateHours,
  calculateReservationFee,
  calculateTotalRentalPriceWithAvailability,
  checkDiscount,
  combineDateAndTimeToUTC,
  extractPayments,
  isDeliveryFee,
} from "@/lib/utils";
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
    const { optionalSuperAdminRulesIds,carExtraOptionsIds, discountCode, values } = body;



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
    } = validData.data;

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

    //extract payments (totalAmount - checkoutPayment - laterPayment for company)
     const { totalAmount, checkoutPayment, payLater } = extractPayments({
      totalPrice: totalPrice as number,
      carDeposit: car.deposite,
      carExtraOptionsPrice,
      deliveryFee,
      discountValue,
      reservationFee,
    });






    return NextResponse.json(
      {
        success: true,
        url: `total amount ${totalAmount}, checkout payment ${checkoutPayment}, later payment ${payLater}`,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.log(error);

    let errorMessage = "Internal server error";
    if (error instanceof CustomError) errorMessage = error.message;
    return NextResponse.json(
      { error: errorMessage, success: false, url: undefined },
      { status: 200 }
    );
  }
};
