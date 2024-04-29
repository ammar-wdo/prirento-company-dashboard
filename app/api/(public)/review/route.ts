import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0

export const GET = async(req:NextRequest)=>{

    try {
        const apiSecret = req.headers.get('api-Secret')
        
        if(!apiSecret || apiSecret !== process.env.API_SECRET) throw new CustomError('Unauthorized request')


        const searchParams = req.nextUrl.searchParams
        const companySlug = searchParams.get('companySlug')




const reviews = await prisma.review.findMany({
    where:{
        ...(companySlug && {company:{
            slug:companySlug
        }}),
        status:'ACTIVE',
        reviewContent:{
            not:''
        }
    },
    orderBy:{
        createdAt:'desc'
    },
    include:{
        car:{
            select:{
              
                carModel:{
                    select:{
                        name:true,
                        carBrand:{select:{brand:true}},
                      
                    }
                },
                slug:true
               
            }
        },
        company:{
            select:{
                name:true,
                slug:true,
                logo:true
            }
        },
    
    },
    
})

const returnedReviews = reviews.map(review=>{

    const {car,company,firstName,lastName,visibility,status,...rest} = review

    const user = visibility==='FULLNAME' ? `${firstName} ${lastName}`:visibility==='FIRSTNAME' ? firstName : 'Anounymos'

    return {...rest,
    companyName:company.name,
    carName:`${car.carModel.carBrand.brand} ${car.carModel.name}`,
    carSlug:car.slug,
    companyLogo:company.logo,
    companySlug:company.slug,
    user

    }
})
   


       
       
        return NextResponse.json({success:true,reviews:returnedReviews},{status:200})



    } catch (error) {
     console.log(error)
     let errorMessage = "Internal server error"
     if(error instanceof CustomError) errorMessage = error.message
     return NextResponse.json({error:errorMessage,success:false},{status:200})
    }

}