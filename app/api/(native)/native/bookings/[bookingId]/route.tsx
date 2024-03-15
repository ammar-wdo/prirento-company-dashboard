import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { currentMonthRange, verifyToken } from "@/lib/utils";
import { carPricingsSchema } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;



export const GET = async (
  req: NextRequest,
  {params}:{params:{bookingId:string}}

) => {

  try {

    if(!params.bookingId) throw new CustomError("Booking Id is required")
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


const booking = await prisma.booking.findUnique({
    where:{
        id:params.bookingId,
        car:{
            company:{
                email:decoded.email
            }
        }
    }
    ,
    include:{
        car:{
            select:{
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
                }
            }
        }
    }
})




if(!booking) throw new CustomError("Booking is not available")

const {car,...rest} = booking

const returnedBooking = {

   ...rest,
    carName: `${car.carModel.carBrand.brand} ${car.carModel.name}`,
    carImage:car.gallary[0]

}
  


    

    return  NextResponse.json({success:true,booking:returnedBooking},{status:201});
  } catch (error) {

    let message = "Something went wrong...";
    if (error instanceof CustomError) {
      message = error.message;
    }
    console.log(error);
    return NextResponse.json({success:false,error:message});
  }


}