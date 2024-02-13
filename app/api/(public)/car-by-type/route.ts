import prisma from "@/lib/prisma";
import { CarTypes } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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
    const carType = searchParams.get("carType");

    const carsRes = await prisma.car.findMany({
      where: {
        carType: carType as CarTypes,
        disabled: false,
        carStatus:'active',
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
        company:{
            select:{
                logo:true
            }
        }
      },
    });

    const availableCars = carsRes.map((car) => {
        if (!car.pricings[0]) return null;
     

      return {
        id: car.id,
        carName: `${car.carModel.carBrand.brand} ${car.carModel.name}`,
        year: car.year,
        seats: car.seats,
        kmIncluded: car.kmIncluded,
        carType: car.carType,
        gallary: car.gallary,
        transmition: car.transmition,
        oneDayPrice: car.pricings[0],
        companyLogo:car.company.logo
      };
    });

    const cars = availableCars.filter(Boolean)

    return NextResponse.json({ cars }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
