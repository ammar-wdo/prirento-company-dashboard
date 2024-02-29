import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { reviewSchema } from "@/schemas";
import { NextResponse } from "next/server";

export const revalidate = 0;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export const POST = async(req:Request,{params}:{params:{bookingId:string}})=>{

    try {
        //check for secret api key
        const apiSecret = req.headers.get('api-Secret') 
        if(!apiSecret || apiSecret !== process.env.API_SECRET) throw new CustomError('Unauthorized request')
        //check for slug
        if(!params.bookingId) throw new CustomError('booking Id is required')

        //check if valid values sent
        const body = await req.json()
        const validData = reviewSchema.safeParse(body)
        if(!validData.success) throw new CustomError("Invalid Inputs")

   
        //check if booking exist
    const bookingExist = await prisma.booking.findUnique({
        where:{
            id:params.bookingId,
            paymentStatus:'SUCCEEDED',
            
        },select:{
            id:true,
            carId:true,
            car:{
            select:{
                companyId:true
            }
            }
        }
    })
    if(!bookingExist) throw new CustomError('Booking is not valid to leave a review')


    //check if review exist for same booking
    const reviewExist = await prisma.review.findUnique({
        where:{
            bookingId:bookingExist.id
        }
    })

    if(!!reviewExist) throw new CustomError('You have already left a review')

    //create new review
    await prisma.review.create({
        data:{
            bookingId:bookingExist.id,
            carId:bookingExist.carId,
            companyId:bookingExist.car.companyId,
            ...validData.data
        }
    })
       
       
        return NextResponse.json({success:true},{status:200})



    } catch (error) {
     console.log(error)
     let errorMessage = "Internal server error"
     if(error instanceof CustomError) errorMessage = error.message
     return NextResponse.json({error:errorMessage,success:false},{status:200})
    }

}