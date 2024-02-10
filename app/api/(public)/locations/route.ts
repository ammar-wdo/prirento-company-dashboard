

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0

export const GET = async(req:Request)=>{
console.log('hi')
    try {
        const apiSecret = req.headers.get('api-Secret')
        
        if(!apiSecret || apiSecret !== process.env.API_SECRET) return NextResponse.json({error:"Unauthorized request"},{status:403,statusText:"Unauthorized request"})

        const locations = await prisma.location.findMany()
       
        return NextResponse.json({locations},{status:200})



    } catch (error) {
     console.log(error)
     return NextResponse.json({error:"Internal server error"},{status:500})
    }

}