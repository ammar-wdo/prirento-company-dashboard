import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export const GET = async (req:Request,{params}:{params:{carSlug:string}})=>{

try {

    const apiSecret = req.headers.get("api-Secret");

    if (!apiSecret || apiSecret !== process.env.API_SECRET) throw new CustomError('Unauthorized')
    if(!params.carSlug) throw new CustomError("Car slug is required")

    const carWithReviews =await  prisma.car.findUnique({
        where:{
            slug:params.carSlug,

        },include:{
            reviews:true
        }
    })

    if(!carWithReviews) throw new CustomError("Car does not exist")
const reviews = carWithReviews.reviews
 
//calculate average reviews rating for the car 
const totalRating = reviews.reduce((acc, review) => acc + review.rate, 0);
const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
console.log(averageRating)

return NextResponse.json({success:true,averageRating})

    
} catch (error) {
    let message = 'Internal server error'
    if(error instanceof CustomError)
    message = error.message
return NextResponse.json({success:false,error:message},{status:200})
}
}