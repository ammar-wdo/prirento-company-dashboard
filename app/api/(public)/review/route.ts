import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0

export const GET = async(req:Request)=>{

    try {
        const apiSecret = req.headers.get('api-Secret')
        
        if(!apiSecret || apiSecret !== process.env.API_SECRET) throw new CustomError('Unauthorized request')




const reviews = await prisma.review.findMany({
    where:{
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
        booking:{
            select:{
                firstName:true,lastName:true,email:true
            }
        }
    },
    
})

const returnedReviews = reviews.map(review=>{

    const {car,company,booking,visibility,status,...rest} = review

    const user = visibility==='FULLNAME' ? `${booking.firstName} ${booking.lastName}`:visibility==='FIRSTNAME' ? booking.firstName : 'Anounymos'

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