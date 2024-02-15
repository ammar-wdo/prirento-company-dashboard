

import prisma from "@/lib/prisma";
import { combineDateAndTimeToUTC } from "@/lib/utils";
import { FiltersSchema } from "@/schemas";
import { CarTypes, Electric } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import qs from 'query-string'


export const revalidate = 0

export const GET = async(req:NextRequest)=>{

    try {
        const apiSecret = req.headers.get('api-Secret')
        
        if(!apiSecret || apiSecret !== process.env.API_SECRET) return NextResponse.json({error:"Unauthorized request"},{status:403,statusText:"Unauthorized request"})

        const searchParams = req.nextUrl.searchParams
    
        const queries = qs.parse(searchParams.toString())
        const validQueries = FiltersSchema.safeParse(queries)
        if(!validQueries.success){
      throw new Error(validQueries.error.message)
        }
        console.log(validQueries.data)
     const {endDate,endTime,location,startDate,startTime,brand,carType,doors,dropOffLocation,electric,seats} = validQueries.data

     const startDateObject = combineDateAndTimeToUTC(startDate,startTime)
     const endDateObject = combineDateAndTimeToUTC(endDate,endTime)

     console.log('start date object',startDateObject)
     console.log('end date object',endDateObject)
      
       


        const carsRes = await prisma.car.findMany({
            where: {
             
              disabled: false,
              carStatus:'active',
              company: {
                away: false,
              },
              ...(electric ? Array.isArray(electric)? {electric:{in:electric as Electric[]}} : {electric:electric as Electric} : {}),
              ...(location && {pickupLocations:{some:{slug:location}}}),
              ...(dropOffLocation && {dropoffLocations:{some:{slug:dropOffLocation}}}),
              ...(brand ?Array.isArray(brand) ? {carModel:{carBrand:{brand:{in:brand}}}} : {carModel:{carBrand:{brand}}} : {}),
              ...(carType ?Array.isArray(carType) ? {carType:{in:carType as unknown as CarTypes[]}} : {carType:carType as unknown as CarTypes} : {}),
     
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
              company:{
                  select:{
                      logo:true
                  }
              }
            },
          });
      
          const availableCars = carsRes.map((car) => {
              if (!car.pricings[0]) return null;
           
      
            return {
              id: car.id,
              carName: `${car.carModel.carBrand.brand} ${car.carModel.name}`,
              year: car.year,
              seats: car.seats,
              kmIncluded: car.kmIncluded,
              carType: car.carType,
              gallary: car.gallary,
              transmition: car.transmition,
              oneDayPrice: car.pricings[0],
              companyLogo:car.company.logo
            };
          });
      
          const cars = availableCars.filter(Boolean)
       
        return NextResponse.json({cars},{status:200})



    } catch (error:any) {
let errorMessage= 'Internal server Error'
if(error instanceof Error){
    errorMessage=error.message
}
     return NextResponse.json({error:errorMessage},{status:500})
    }

}