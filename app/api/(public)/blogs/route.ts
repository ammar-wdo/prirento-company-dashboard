import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0

export const GET = async(req:Request)=>{

    try {
        const apiSecret = req.headers.get('api-Secret')
        
        if(!apiSecret || apiSecret !== process.env.API_SECRET) throw new CustomError('Unauthorized request')

        const blogs = await prisma.blog.findMany({orderBy:{
            createdAt:'desc'
        },include:{
            category:{
                select:{label:true}
            }
        }})

        const blogsWithNowContent = blogs.map((blog)=>{
           const {content,...rest}=blog

           return {...rest}
        })

        const categories = await prisma.blogCategory.findMany()
       
        return NextResponse.json({success:true,blogs:blogsWithNowContent,categories},{status:200})



    } catch (error) {
     console.log(error)
     let errorMessage = "Internal server error"
     if(error instanceof CustomError) errorMessage = error.message
     return NextResponse.json({error:errorMessage,success:false},{status:200})
    }

}