import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { currentMonthRange, verifyToken } from "@/lib/utils";
import { carPricingsSchema } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;



export const GET = async (
  req: NextRequest

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

    if (!decoded) throw new CustomError("Not Authorized Token, recent bookings and bookings");
    

    const searchParams = req.nextUrl.searchParams
    const take  = searchParams.get('take')


  
const {firstDayOfCurrentMonth,firstDayOfNextMonth} = currentMonthRange()
const bookings =await prisma.booking.findMany({

    where:{
        car:{
            company:{
                email:decoded.email
            }
        },
        paymentStatus:'SUCCEEDED'
      
        
    },
    orderBy:{
        createdAt:'desc'
            
        
    },
    ...(take && { take:+take }),
    select:{
        id:true,
        firstName:true,
        lastName:true,
        createdAt:true,
        bookingCode:true,
        carId:true,
        car:{
            select:{
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
                gallary:true
               
            }
        },
        payLater:true,
        pickupLocation:true,
        dropoffLocation:true,
        startDate:true,
        endDate:true,
        paymentStatus:true
    }
})

const returnedBookings =  bookings.map(booking=>({

    id:booking.id,
    carId:booking.carId,
    carName:`${booking.car.carModel.carBrand.brand} ${booking.car.carModel.name}`,
    carImage:booking.car.gallary[0],
    total:booking.payLater,
    name:`${booking.firstName} ${booking.lastName}`,
    bookingCode:booking.bookingCode,
    pickupLocation:booking.pickupLocation,
    dropoffLocation:booking.dropoffLocation,
    createdAt:booking.createdAt,
    startDate:booking.startDate,
    endDate:booking.endDate,
  
}))


    

    return  NextResponse.json({success:true,bookings:returnedBookings},{status:201});
  } catch (error) {

    let message = "Something went wrong...";
    if (error instanceof CustomError) {
      message = error.message;
    }
    console.log(error);
    return NextResponse.json({success:false,error:message});
  }


}