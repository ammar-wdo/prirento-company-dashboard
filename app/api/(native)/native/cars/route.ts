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
const currentDate = dubaiTimeZone()

        const cars = await prisma.car.findMany({
            where:{
                company:{
                    email:decoded.email
                },  
            },
            orderBy: {
                createdAt: "desc",
              },
              include: {
                carModel: {
                  include: {
                    carBrand: {
                      select: {
                        brand: true,
                      },
                    },
                  },
                },
                availabilities: {
                    where: {
                      OR: [
                        {
                          AND: [
                            {
                              startDate: {
                                lte: currentDate,
                              },
                            },
                            {
                              endDate: {
                                gte: currentDate,
                              },
                            },
                          ],
                        },
                      ],
                    },
                    select: {
                      startDate: true,
                      endDate: true,
                    },
                  },
                  bookings: {
                    where: {
                      AND: [
                        { bookingStatus: "ACTIVE" },
                        { paymentStatus: { in: ["PENDING", "SUCCEEDED"] } },
                        {
                          startDate: {
                            lte: currentDate,
                          },
                        },
                        {
                          endDate: {
                            gte: currentDate,
                          },
                        },
                      ],
                    },
                    select: {
                      startDate: true,
                      endDate: true,
                    },
                  },
              },
        })


        const refinedCars = cars.map((car)=>{

            const booked = !!car.bookings.length
            const blocked = !!car.availabilities.length

            const status = booked ? 'Booked' :
            blocked ? 'Blocked' : 'Available'

        
            
            
            return{
            id: car.id,
            carName: `${car.carModel.carBrand.brand} ${car.carModel.name}`,
            year: car.year,
            isPending:car.carStatus === 'pending',
          image:car.gallary[0],
          status

          
         
        }})
console.log(currentDate)
     cars.forEach(car=>{console.log(`${car.carModel.carBrand.brand} ${car.carModel.name}`);console.log(car.bookings)})

        return NextResponse.json({success:true,cars:refinedCars},{status:200})




        
    } catch (error) {
        let message = 'Internal server error'

        if(error instanceof CustomError)message = error.message

        return NextResponse.json({success:false,error:message},{status:200})
    }
}