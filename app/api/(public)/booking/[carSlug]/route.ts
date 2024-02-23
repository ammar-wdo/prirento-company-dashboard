import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { checkDiscount, combineDateAndTimeToUTC } from "@/lib/utils";
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


    const apiSecret = req.headers.get("api-Secret");

    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
     throw new CustomError('Unauthorized request')
    }

    if (!params.carSlug) {
        throw new CustomError('Car slug is required')
    }

    const body = await req.json();

    const { discountCode, values } = body;

    const validData = bookingSchema.safeParse(values);
    if (!validData.success) {
        throw new CustomError('Invalid inputs')
    }

  
    const { startDate, startTime, endDate, endTime,pickupLocation,dropoffLocation } = validData.data;

    const startDateObject = combineDateAndTimeToUTC(startDate, startTime);
    const endDateObject = combineDateAndTimeToUTC(endDate, endTime);

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
      return NextResponse.json({
        success: false,
        error: "This car is not available",
      },{status:200,headers:corsHeaders});



      const returnedDiscount =await  checkDiscount(
        discountCode,
        params.carSlug,
        startDateObject,
        endDateObject,
        car.pricings,
        car.hourPrice,
        car.reservationPercentage,
        car.reservationFlatFee
      );






      return NextResponse.json({success:true,url:returnedDiscount.promocode},{status:200,headers:corsHeaders})
  } catch (error) {
    console.log(error);

    let errorMessage = 'Internal server error'
    if(error instanceof CustomError) errorMessage = error.message
    return NextResponse.json(
      { error: errorMessage ,success:false,url:undefined},
      { status: 200 }
    );
  }
};
