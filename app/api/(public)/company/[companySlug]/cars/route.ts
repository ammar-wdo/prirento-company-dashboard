import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";



//fetch cars related to certain company

export const GET = async (
  req: Request,
  { params }: { params: { companySlug: string } }
) => {
  try {
    const apiSecret = req.headers.get("api-Secret");

    if (!apiSecret || apiSecret !== process.env.API_SECRET)
      throw new CustomError("Unauthorized");

    if (!params.companySlug) throw new CustomError("Company slug is required");

    const company = await prisma.company.findUnique({
        where:{
            slug:params.companySlug
        },
        select:{
            logo:true
        }
    })
  

    const cars = await prisma.car.findMany({
      where: {
        company: {
            slug:params.companySlug
        }
      },
     
          select: {
            gallary: true,
            pricings: true,
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
            id:true,
            slug: true,
            year: true,
            seats: true,
            kmIncluded: true,
            carType: true,
            transmition: true,
          },
        
      
    });

   



 

    const returnedCars = cars.map((car) => ({
        id: car.id,
        carName: `${car.carModel.carBrand.brand} ${car.carModel.name}`,
        year: car.year,
        seats: car.seats,
        kmIncluded: car.kmIncluded,
        carType: car.carType,
        gallary: car.gallary,
        transmition: car.transmition,
        oneDayPrice: car.pricings[0],
        companyLogo:company?.logo,
        slug:car.slug,
        companySlug:params.companySlug
    }));


return NextResponse.json({success:true,cars:returnedCars})

  } catch (error) {
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;
    return NextResponse.json(
      { success: false, error: message, cars: null },
      { status: 200 }
    );
  }
};
