import prisma from "@/lib/prisma";
import {
  Description,
  calculateTotalRentalPriceWithAvailability,
  combineDateAndTimeToUTC,
  mapDescriptionsToNumbers,
  processCars,
} from "@/lib/utils";
import { FiltersSchema } from "@/schemas";
import { CarTypes, Electric } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import qs from "query-string";

export const revalidate = 0;

export const GET = async (req: NextRequest) => {
  try {
    const apiSecret = req.headers.get("api-Secret");

    if (!apiSecret || apiSecret !== process.env.API_SECRET)
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 403, statusText: "Unauthorized request" }
      );

    const searchParams = req.nextUrl.searchParams;

    const queries = qs.parse(searchParams.toString());
    const validQueries = FiltersSchema.safeParse(queries);
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
      brand,
      carType,
      doors,
      dropOffLocation,
      electric,
      seats,
    } = validQueries.data;

    let doorsArray;
    if (doors) {
      doorsArray = mapDescriptionsToNumbers(doors as unknown as Description[]);
    }

    let seatsArray;
    if (seats) {
      seatsArray = mapDescriptionsToNumbers(seats as unknown as Description[]);
    }


    const startDateObject = combineDateAndTimeToUTC(startDate, startTime);
    const endDateObject = combineDateAndTimeToUTC(endDate, endTime);



    const carsRes = await prisma.car.findMany({
      where: {
        disabled: false,
        carStatus: "active",
        company: {
          away: false,
        },
        ...(seats && { seats: { in: seatsArray } }),
        ...(doors && { doors: { in: doorsArray } }),
        ...(electric
          ? Array.isArray(electric)
            ? { electric: { in: electric as Electric[] } }
            : { electric: electric as Electric }
          : {}),
        ...(location && { pickupLocations: { some: { slug: location } } }),
        ...(dropOffLocation && {
          dropoffLocations: { some: { slug: dropOffLocation } },
        }),
        ...(brand
          ? Array.isArray(brand)
            ? { carModel: { carBrand: { brand: { in: brand } } } }
            : { carModel: { carBrand: { brand } } }
          : {}),
        ...(carType
          ? Array.isArray(carType)
            ? { carType: { in: carType as unknown as CarTypes[] } }
            : { carType: carType as unknown as CarTypes }
          : {}),
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
            slug:true
          },
        },
        availabilities: {
          where: {
            OR: [
              {
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
            ],
          },
          select:{
            startDate:true,
            endDate:true
          }
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
          select:{
            startDate:true,
            endDate:true
          }
        },
      },
    });

    const { availableCars, notAvailableCars } = processCars(
      carsRes,
      startDateObject,
      endDateObject
    );

    return NextResponse.json(
      { availableCars, notAvailableCars, success: true },
      { status: 200 }
    );
  } catch (error: any) {
    let errorMessage = "Internal server Error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
