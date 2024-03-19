import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { dubaiTimeZone, verifyToken } from "@/lib/utils";
import { NextResponse } from "next/server";


export const revalidate = 0
export const GET = async (req:Request)=>{

console.log('hi')
    try {

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

const notifications = await prisma.notification.findMany({
    where:{
        company:{
            email:decoded.email
        }
    },
    select:{
        id:true,
        message:true,
        carName:true,
        type:true,
        isRead:true,
        booking:{
            select:{
                id:true
            }
        },
        createdAt:true
    }
})
     

        return NextResponse.json({success:true,notifications},{status:200})




        
    } catch (error) {
        let message = 'Internal server error'

        if(error instanceof CustomError)message = error.message

        return NextResponse.json({success:false,error:message},{status:200})
    }
}