import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { currentMonthRange, verifyToken } from "@/lib/utils";
import { carPricingsSchema } from "@/schemas";
import { NextResponse } from "next/server";

export const revalidate = 0;



export const GET = async (
  req: Request

) => {

  try {
    const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests

    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
      throw new CustomError("Unauthorized request");
    }



    const authHeader = req.headers.get("Authorization");
    console.log("header", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new CustomError("Not Authorized");

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    if (!decoded) throw new CustomError("Not Authorized");


  
const {firstDayOfCurrentMonth,firstDayOfNextMonth} = currentMonthRange()

const cars = await prisma.car.findMany({
    where: {
      // Assuming there's a relation where each car belongs to a company
      company: {
        email: decoded.email,
      },
      bookings: {
        some: {
          startDate: {
            gte: firstDayOfCurrentMonth,
            lte: firstDayOfNextMonth,
          },
          paymentStatus:'SUCCEEDED'
        },
      },
    },
    select: {
        id:true,
        gallary:true,
        carModel:{
            select:{
                name:true,
                carBrand:{
                    select:{
                        brand:true
                    }
                }
            }
        },

      bookings: {
        select:{
            id:true
        },
        where: {
          startDate: {
            gte: firstDayOfCurrentMonth,
            lte: firstDayOfNextMonth,
            
          },
          
          
        },
        
        orderBy: {
          startDate: 'desc',
        },
      },
    },
    take: 6,
    orderBy: {
      bookings: {
        _count: 'desc',
      },
    },
  });

  const returnedCars = cars.map(car=>({
id:car.id,
carImage:car.gallary[0],
carName:`${car.carModel.carBrand.brand} ${car.carModel.name}`,
bookingsCount:car.bookings.length


  }))


    

    return  NextResponse.json({success:true,cars:returnedCars},{status:201});
  } catch (error) {

    let message = "Something went wrong...";
    if (error instanceof CustomError) {
      message = error.message;
    }
    console.log(error);
    return NextResponse.json({success:false,error:message});
  }


}