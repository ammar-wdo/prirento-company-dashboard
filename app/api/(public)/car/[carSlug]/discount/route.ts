import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import {
  calculateDiscount,
  calculateReservationFee,
  calculateTotalRentalPriceWithAvailability,
  checkDiscount,
  combineDateAndTimeToUTC,
} from "@/lib/utils";
import { discountApiSchema } from "@/schemas";

import { NextRequest, NextResponse } from "next/server";

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
  req: NextRequest,
  { params }: { params: { carSlug: string } }
) => {
  try {
    const apiSecret = req.headers.get("api-Secret");

    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        {
          status: 403,
          statusText: "Unauthorized request",
          headers: corsHeaders,
        }
      );
    }

    if (!params.carSlug) {
      return NextResponse.json(
        { error: "Car slug is required", success: false },
        { status: 200, headers: corsHeaders }
      );
    }

    const body = await req.json();

    const validBody = discountApiSchema.safeParse(body);
    if (!validBody.success) {
      for (const e of validBody.error.errors) {
        if (e.message === "Start date must be before end date") {
          return NextResponse.json(
            { error: "Date range error", success: false },
            { status: 200, headers: corsHeaders }
          );
        }
      }

      return NextResponse.json(
        { error: "Invalid inputs", success: false },
        { status: 200, headers: corsHeaders }
      );
    }

    const { startDate, endDate, startTime, endTime, promocode } =
      validBody.data;

    const startDateObject = combineDateAndTimeToUTC(startDate, startTime);
    const endDateObject = combineDateAndTimeToUTC(endDate, endTime);

    const car = await prisma.car.findUnique({
      where: {
        slug: params.carSlug,
      },
    });

    if (!car)
      return NextResponse.json(
        { discount: null, success: false, error: "Invalid promocode" },
        { status: 200, headers: corsHeaders }
      );

      const { isAvailable, totalPrice } = calculateTotalRentalPriceWithAvailability(
        startDateObject,
        endDateObject,
        car.pricings,
        car.hourPrice
      );
    
      if (!isAvailable) {
        throw new CustomError("Invalid promo code");
      }
  
      const reservationFee = calculateReservationFee(
        car.reservationPercentage,
        car.reservationFlatFee,
        totalPrice as number
      );
    
      if (reservationFee === false) {
        throw new CustomError("Promocode is not applicable");
      }

    const returnedDiscount =await  checkDiscount(
      promocode,
      params.carSlug,
      startDateObject,
      endDateObject,
      reservationFee
    );

    return NextResponse.json(
      { success: true, discount: returnedDiscount, error: "" },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.log('error happened');
    let errorMessage = "Internal server Error";

    if(error instanceof CustomError) errorMessage = error.message

    return NextResponse.json(
      { error: errorMessage, discount: null, success: false },
      { status: 200, headers: corsHeaders }
    );
  }
};
