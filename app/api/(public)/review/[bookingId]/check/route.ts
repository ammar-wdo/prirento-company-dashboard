import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0

export const GET = async(req:Request,{params}:{params:{bookingId:string}})=>{

    try {
        const apiSecret = req.headers.get('api-Secret')
        
        if(!apiSecret || apiSecret !== process.env.API_SECRET) throw new CustomError('Unauthorized request')

    if(!params.bookingId) throw new CustomError('booking Id is required')

    const bookingExist = await prisma.booking.findUnique({
        where:{
            id:params.bookingId,
            paymentStatus:'SUCCEEDED'
        }
    })


    if(!bookingExist) throw new CustomError('Booking is not valid to leave a review')

    const reviewExist = await prisma.review.findUnique({
        where:{
            bookingId:bookingExist.id
        }
    })

    if(!!reviewExist) throw new CustomError('Review already sent!')

       
       
        return NextResponse.json({success:true},{status:200})



    } catch (error) {
     console.log(error)
     let errorMessage = "Internal server error"
     if(error instanceof CustomError) errorMessage = error.message
     return NextResponse.json({error:errorMessage,success:false},{status:200})
    }

}