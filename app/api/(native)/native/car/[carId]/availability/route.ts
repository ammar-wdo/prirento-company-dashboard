import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { areIdsValid, combineDateAndTimeToUTC, verifyToken } from "@/lib/utils";
import { carAvailabilitySchema, carExtraOptionsSchema, carSchema } from "@/schemas";
import { NextResponse } from "next/server";

export const revalidate = 0;


const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }
  

export const GET = async (
  req: Request,
  { params }: { params: { carId: string } }
) => {

  try {
    const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests

    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
      throw new CustomError("Unauthorized request");
    }

    if (!params.carId) throw new CustomError("Car Id is required");

    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new CustomError("Not Authorized");

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    if (!decoded) throw new CustomError("Not Authorized");






    const availabilities = await prisma.carAvailability.findMany({
      where:{
      carId:params.carId,
      car:{
        company:{
            email:decoded.email
        }
      }
       
      }
    })

    

  




    return  NextResponse.json({success:true,availabilities},{status:201});
  } catch (error) {
    let message = "Something went wrong";
    if (error instanceof CustomError) {
      message = error.message;
    }
    console.log(error);
    return NextResponse.json({success:false,message});
  }


}



export const POST = async (
    req: Request,
    { params }: { params: { carId: string } }
  ) => {
  
    try {
      const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests
  
      if (!apiSecret || apiSecret !== process.env.API_SECRET) {
        throw new CustomError("Unauthorized request");
      }
  
      if (!params.carId) throw new CustomError("Car Id is required");
  
      const authHeader = req.headers.get("Authorization");
  
      if (!authHeader || !authHeader.startsWith("Bearer "))
        throw new CustomError("Not Authorized");
  
      const token = authHeader.split(" ")[1];
  
      const decoded = verifyToken(token);
  
      if (!decoded) throw new CustomError("Not Authorized");
  
  
      const body = await req.json()

      const validData = carAvailabilitySchema.safeParse(body)

      if(!validData.success) throw new CustomError("Invalid Inputs")

      const {startDate,startTime,endDate,endTime,...rest} = validData.data

      const startDateObject = combineDateAndTimeToUTC(startDate,startTime)
      const endDateObject = combineDateAndTimeToUTC(endDate,endTime)
  
  
  
      const availability = await prisma.carAvailability.create({
       data:{
      carId:params.carId,
      startDate:startDateObject,
      endDate:endDateObject,
      ...rest
      
     
       }
      })
  
      
  
    
  
  
  
  
      return  NextResponse.json({success:true},{status:201});
    } catch (error) {
      let message = "Something went wrong";
      if (error instanceof CustomError) {
        message = error.message;
      }
      console.log(error);
      return NextResponse.json({success:false,message});
    }
  
  
  }