import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/utils";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { carId: string } }
) => {
  console.log("hi");
  try {
    const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests

    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
      throw new CustomError("Unauthorized request");
    }

    if (!params.carId) throw new CustomError("Car Id is required");

    const authHeader = req.headers.get("Authorization");
    console.log("header", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new CustomError("Not Authorized");

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    if (!decoded) throw new CustomError("Not Authorized");
    console.log("email", decoded.email);

    const car = await prisma.car.findUnique({
      where: {
        id: params.carId,
        company: {
          email: decoded.email,
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
        pickupLocations: true,
        dropoffLocations: true,
        company: true,
      },
    });

    if (!car) throw new CustomError("car does not exist");

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
      slug: car.slug,
      kmIncluded: car.kmIncluded,
      minimumHours: car.minimumHours || null,
      pickupLocations: car.pickupLocations.map((el) => el.name),
      dropoffLocations: car.dropoffLocations.map((el) => el.name),
      companyName: car.company.name,
    };

    return NextResponse.json({ success: true, car:returnedCar }, { status: 200 });
  } catch (error) {
    let message = "Internal server error";

    if (error instanceof CustomError) message = error.message;

    return NextResponse.json(
      { success: false, error: message },
      { status: 200 }
    );
  }
};
