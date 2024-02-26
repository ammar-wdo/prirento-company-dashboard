import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0

export const GET = async(req:Request)=>{

    try {
        const apiSecret = req.headers.get('api-Secret')
        
        if(!apiSecret || apiSecret !== process.env.API_SECRET) throw new CustomError("Unauthorized")

        const faqs = await prisma.faq.findMany({
           orderBy:{
            createdAt:'desc'
           }
        })


       
        return NextResponse.json({faqs,success:true},{status:200})



    } catch (error) {
        console.log(error)
     let message = 'Internal server error'
     if(error instanceof CustomError) message = error.message
     return NextResponse.json({error:message,success:false},{status:200})
    }

}