import prisma from "@/lib/prisma";


import { NextRequest, NextResponse } from "next/server";


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
            terms:true,
            name:true
          },
        },
        pickupLocations: true,
        dropoffLocations: true,
        availabilities: true,
      },
    });



    if (!car)
      return NextResponse.json(
        { error: "Car does not exist",success:true,car:null },
        { status: 200 }
      );


    const returnedCar = {
      id: car.id,
      carName: `${car.carModel.carBrand.brand} ${car.carModel.name}`,
      brand: car.carModel.carBrand.brand,
      year: car.year,
      transmition: car.transmition,
      engine: car.engine,
      doors: car.doors,
      electric: car.electric,
      carType: car.carType,
      seats: car.seats,
      description: car.description,
      gallary: car.gallary,
      specifications: car.additionalFeatures,
      slug:car.slug,
      kmIncluded:car.kmIncluded,
      minimumHours:car.minimumHours || null,
      pickupLocations:car.pickupLocations.map(el=>el.name),
      dropoffLocations:car.dropoffLocations.map(el=>el.name),
      terms:car.company.terms,
      companyName:car.company.name
      
 
   
    };

    return NextResponse.json(
      { car: returnedCar, success: true },
      { status: 200 }
    );
  } catch (error: any) {
    let errorMessage = "Internal server Error";

    return NextResponse.json({ error: errorMessage,success:false }, { status: 200 });
  }
};
