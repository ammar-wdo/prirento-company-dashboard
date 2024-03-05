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
            reviews:{
                where:{
                    status:'ACTIVE',
                    reviewContent:{
                        not:''
                    }
                },
                orderBy:{
                    createdAt:'desc'
                },include:{
                    booking:{
                        select:{
                            firstName:true,lastName:true,email:true
                        }
                    }
                }
            },
            company:{
                select:{
                    logo:true,
                    name:true,
                    slug:true
                }
            },
            carModel:{
                select:{
                    name:true,
                    carBrand:{select:{brand:true}},
                  
                }
            },
        }
    })

    if(!carWithReviews) throw new CustomError("Car does not exist")

const reviews = carWithReviews.reviews


//refactor reviews for frontend
const returnedReviews = reviews.map(review=>{

    const {booking,visibility,status,...rest} = review

    const user = visibility==='FULLNAME' ? `${booking.firstName} ${booking.lastName}`:visibility==='FIRSTNAME' ? booking.firstName : 'Anounymos'

    return {...rest,
    companyName:carWithReviews.company.name,
    carName:`${carWithReviews.carModel.carBrand.brand} ${carWithReviews.carModel.name}`,
    carSlug:carWithReviews.slug,
    companyLogo:carWithReviews.company.logo,
    companySlug:carWithReviews.company.slug,
    user

    }
})


return NextResponse.json({success:true,reviews:returnedReviews})

    
} catch (error) {
    let message = 'Internal server error'
    if(error instanceof CustomError)
    message = error.message
return NextResponse.json({success:false,error:message},{status:200})
}
}