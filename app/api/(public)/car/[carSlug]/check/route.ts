import prisma from "@/lib/prisma";
import {
  calculateHours,
  calculateReservationFee,
  calculateTotalRentalPriceWithAvailability,
  combineDateAndTimeToUTC,
  extractsuperadminRuleWithValueToPay,
  isCarAvailable,
  isDeliveryFee,
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
            slug:true,
          },
        },
        pickupLocations: true,
        dropoffLocations: true,
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
        carExtraOptions:{
          where:{
            status:'active'
          }
        },
     
      },
    });

    if (!car)
      return NextResponse.json(
        { error: "Car is not Available", success: false },
        { status: 200 }
      );

    // extract location name from sent slug
    const locationName = await prisma.location.findUnique({
      where: {
        slug: location,
      },
      select: {
        name: true,
      },
    });

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
    const availabilityRangeDates = car.availabilities

    const bookingsRangeDates = car.bookings

    const carPickLocations = car.pickupLocations.map((el) => ({
      slug: el.slug,
      name: el.name,
    }));
    const carDropLocations = car.dropoffLocations.map((el) => ({
      slug: el.slug,
      name: el.name,
    }));

    //check if chosen hours are bigger minimum hour rate for renting
    let validHours:
      | { valid: true; minimumHours: null }
      | { valid: false; minimumHours: number } = {
      valid: true,
      minimumHours: null,
    };
    const hours = calculateHours(startDateObject, endDateObject);
    if (car.minimumHours && hours < car.minimumHours) {
      validHours = { valid: false, minimumHours: car.minimumHours};
    }

  //check if fee bigger than car price  
const fee = totalPrice ?  calculateReservationFee(car.reservationPercentage,car.reservationFlatFee,totalPrice) : false 

    const { isAvailable, message, pickupLocations, dropOffLocations,reservationDates } =
      isCarAvailable({
        priceAvailability,
        location,
        dropOffLocation,
        clientStartDate: startDateObject,
        clientEndDate: endDateObject,
        availabilityRangeDates,
        bookingsRangeDates,
        carDropLocations,
        carPickLocations,
        validHours,
       fee
        
      });

      //check if delivery fee exists
    const deliveryFeeExist =isDeliveryFee(dropOffLocation,location)


    //prepare super admin rules
  const superAdminRules = await prisma.superadminRule.findMany({
    where:{
      OR:[{
       carId:car.id
      },
    {
      applyToAll:true
    }]
    }
  })


  //filter mandatory from optional
  const mandatorySuperAdminRules = superAdminRules.filter(rule=>rule.mandatory)
  const optionalSuperAdminRules = superAdminRules.filter(rule=>!rule.mandatory)
//recalculate arrays to add value to pay field to each
  const refinedMandatoryRules = mandatorySuperAdminRules.map(el=>extractsuperadminRuleWithValueToPay(el,totalPrice as number))
  const refinedOptionalRules = optionalSuperAdminRules.map(el=>extractsuperadminRuleWithValueToPay(el,totalPrice as number))





    const availability = {
      kmIncluded: car.kmIncluded,
      deliveryFee: deliveryFeeExist ? car.deleviryFee : null,
      fee:fee,
      deposit: car.deposite,
      slug: car.slug,
      companySlug:car.company.slug,
      price: totalPrice,
      duration: rentalPeriodDescription,
      location: locationName?.name,
      startDate: startDateObject,
      endDate: endDateObject,
      carExtraOptions:car.carExtraOptions,
      mandatorySuperAdminRules:refinedMandatoryRules,
      optionalSuperAdminRules:refinedOptionalRules,
      availability: {
        isAvailable,
        message,
        pickupLocations,
        dropOffLocations,
        reservationDates
      },
    };

    return NextResponse.json({ data:availability, success: true }, { status: 200 });
  } catch (error: any) {
    let errorMessage = "Internal server Error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
