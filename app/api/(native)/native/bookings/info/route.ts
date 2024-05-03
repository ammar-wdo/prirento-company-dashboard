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
    
   



    if (!decoded) throw new CustomError("Not Authorized Token, bookinginfo");

    return NextResponse.json({success:false,error:'test'},{status:200})
  
    





  
// const {firstDayOfCurrentMonth,firstDayOfNextMonth} = currentMonthRange()
// const bookings =await prisma.booking.findMany({

//     where:{
//         car:{
//             company:{
//                 email:decoded.email
//             }
//         },
//         paymentStatus:'SUCCEEDED',
 
//      startDate: {
//               gte: firstDayOfCurrentMonth,
//               lte: firstDayOfNextMonth,
              
//             },
        
//     },
//     orderBy:{
//         createdAt:'desc'
            
        
//     },
 
//     select:{
//   payLater:true,
//   createdAt:true,
//   startDate:true,
//   endDate:true,

//     }
// })

// const total = bookings.reduce((acc,val)=>acc + val.payLater,0)
// const count = bookings.length




    

//     return  NextResponse.json({success:true,bookingsInfo:{total,count,bookings}},{status:201});
  } catch (error) {

    let message = "Something went wrong...";
    if (error instanceof CustomError) {
      message = error.message;
    }
    console.log(error);
    return NextResponse.json({success:false,error:message});
  }


}