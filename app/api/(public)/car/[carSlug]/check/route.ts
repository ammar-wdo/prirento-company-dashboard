import prisma from "@/lib/prisma";
import {
  calculateTotalRentalPriceWithAvailability,
  combineDateAndTimeToUTC,
  doesOverlap,
  formatDate,
  isCarAvailable,
} from "@/lib/utils";
import { FilterOneCarSchema } from "@/schemas";

import { NextRequest, NextResponse } from "next/server";
import qs from "query-string";

export const revalidate = 0;

export const GET = async (
  req: NextRequest,
  { params }: { params: { carSlug: string } }
) => {
  try {


    const apiSecret = req.headers.get("api-Secret");

    if (!apiSecret || apiSecret !== process.env.API_SECRET)
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 403, statusText: "Unauthorized request" }
      );

    if (!params.carSlug) {
      return NextResponse.json(
        { error: "Car slug is required", success: false },
        { status: 200 }
      );
    }

    const searchParams = req.nextUrl.searchParams;

    const queries = qs.parse(searchParams.toString());
    const validQueries = FilterOneCarSchema.safeParse(queries);
    if (!validQueries.success) {
      for (const e of validQueries.error.errors) {
        if (e.message === "Start date must be before end date") {
          return NextResponse.json(
            { error: "Date range error", success: false },
            { status: 200 }
          );
        }
      }

      return NextResponse.json(
        { error: "Invalid inputs", success: false },
        { status: 200 }
      );
    }

    const {
      endDate,
      endTime,
      location,
      startDate,
      startTime,
      dropOffLocation,
    } = validQueries.data;



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
      },
      include: {
        carModel: {
          include: {
            carBrand: {
              select: {
                brand: true,
              },
            },
          },
        },
        company: {
          select: {
            logo: true,
          },
        },
        pickupLocations: true,
        dropoffLocations: true,
        availabilities: true,
      },
    });



    if (!car)
      return NextResponse.json(
        { error: "Car does not exist" },
        { status: 400 }
      );






        // extract location name from sent slug
      const locationName = await prisma.location.findUnique({
        where:{
          slug:location
        },select:{
          name:true
        }
      })






    const {
      totalPrice,
      isAvailable: priceAvailability,
      rentalPeriodDescription,
    } = calculateTotalRentalPriceWithAvailability(
      startDateObject,
      endDateObject,
      car.pricings,
      car.hourPrice
    );

    // extract avalabilities and locations array to use in function
    const rangeDates = car.availabilities.map((el) => ({
      startDate: el.startDate,
      endDate: el.endDate,
    }));
    const carPickLocations = car.pickupLocations.map((el) => ({
      slug: el.slug,
      name: el.name,
    }));
    const carDropLocations = car.dropoffLocations.map((el) => ({
      slug: el.slug,
      name: el.name,
    }));



    const { isAvailable, message, pickupLocations, dropOffLocations } =
      isCarAvailable({
        priceAvailability,
        location,
        dropOffLocation,
        clientStartDate: startDateObject,
        clientEndDate: endDateObject,
        rangeDates,
        carDropLocations,
        carPickLocations,
      });



      const isDeliveryFee = (dropOffLocation && (dropOffLocation !== location)) || false

    const availability = {

  
   
   
      kmIncluded: car.kmIncluded,
      deliveryFee:isDeliveryFee ? car.deleviryFee : null,
      deposit: car.deposite,
      price: totalPrice,
      duration: rentalPeriodDescription,
      location:locationName?.name,
      startDate: startDateObject,
      endDate: endDateObject,
      availability: {
        isAvailable,
        message,
        pickupLocations,
        dropOffLocations,
      },
    };

    return NextResponse.json(
      { availability, success: true },
      { status: 200 }
    );
  } catch (error: any) {
    let errorMessage = "Internal server Error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
