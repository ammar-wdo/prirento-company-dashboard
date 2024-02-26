import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0

export const GET = async(req:Request,{params}:{params:{blogSlug:string}})=>{

    try {
       
        const apiSecret = req.headers.get('api-Secret')
        
        if(!apiSecret || apiSecret !== process.env.API_SECRET) throw new CustomError('Unauthorized request')

        if(!params.blogSlug) throw new CustomError('Blog slug is required')
      

        const blog = await prisma.blog.findUnique({
            where:{
                slug:params.blogSlug
            },
            include:{
                category:{
                    select:{
                        label:true,
                        slug:true
                    }
                }
            }
        })


        //fetch related blogs
const relatedBlogs = await prisma.blog.findMany({
    where:{
        category:{
            slug:blog?.category.slug,
          
        },
        NOT:{id:blog?.id}
    },
    take:4,
    orderBy:{
        createdAt:'desc'
    },
    include:{
        category:{
            select:{label:true}
        }
    }
})

const blogsWithNowContent = relatedBlogs.map((blog)=>{
    const {content,...rest}=blog

    return {...rest}
 })

        return NextResponse.json({success:true,blog,relatedBlogs:blogsWithNowContent},{status:200})



    } catch (error) {
     console.log(error)
     let errorMessage = "Internal server error"
     if(error instanceof CustomError) errorMessage = error.message
     return NextResponse.json({error:errorMessage,success:false},{status:200})
    }

}