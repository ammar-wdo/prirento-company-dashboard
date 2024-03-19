import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/utils";
import { NextResponse } from "next/server";


export const GET = async (req:Request,{params}:{params:{bookingId:string}}) =>{


    console.log('hi')
    try {

        if(!params.bookingId) throw new CustomError("Bookin Id is required")
        const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests

        if (!apiSecret || apiSecret !== process.env.API_SECRET) {
          throw new CustomError("Unauthorized request");
        }

        const authHeader = req.headers.get('Authorization')
        console.log('header',authHeader)
        if (!authHeader || !authHeader.startsWith('Bearer ')) throw new CustomError('Not Authorized')

        const token = authHeader.split(' ')[1];
        
        const decoded = verifyToken(token)

        if(!decoded) throw new CustomError('Not Authorized')
        console.log('email',decoded.email)



await prisma.notification.updateMany({
    where:{
        bookingId:params.bookingId
    },
    data:{
        isRead:true
    }
})
     

        return NextResponse.json({success:true},{status:200})




        
    } catch (error) {
        let message = 'Internal server error'

        if(error instanceof CustomError)message = error.message

        return NextResponse.json({success:false,error:message},{status:200})
    }
}