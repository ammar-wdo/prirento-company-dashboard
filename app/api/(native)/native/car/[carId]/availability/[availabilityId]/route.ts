import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { areIdsValid, combineDateAndTimeToUTC, logOut, verifyToken } from "@/lib/utils";
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








export const POST = async (
    req: Request,
    { params }: { params: { carId: string ,availabilityId:string} }
  ) => {
  
    try {
      const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests
  
      if (!apiSecret || apiSecret !== process.env.API_SECRET) {
        throw new CustomError("Unauthorized request");
      }
  
      if (!params.carId) throw new CustomError("Car Id is required");
      if (!params.availabilityId) throw new CustomError("availability Id Id is required");

  
  
      const authHeader = req.headers.get("Authorization");
  
      if (!authHeader || !authHeader.startsWith("Bearer "))
        throw new CustomError("Not Authorized");
  
      const token = authHeader.split(" ")[1];
  
      const decoded = verifyToken(token);
  
      if (!decoded) throw new CustomError("Not Authorized");
  // check if company's email changed to make a logout
  const toLogOut = await logOut(decoded.email)
  if(!!toLogOut) return NextResponse.json({success:false,logout:true},{status:200})
  
      const body = await req.json()

      const validData = carAvailabilitySchema.safeParse(body)

      if(!validData.success) throw new CustomError("Invalid Inputs")
  
      const carExist = await prisma.car.findUnique({
        where:{
          id:params.carId
        },select:{id:true}
      })
      if(!carExist) throw new CustomError('Car does not exist')
  
      const {startDate,endDate,startTime,endTime,...rest} = validData.data
      const startDateObject = combineDateAndTimeToUTC(startDate,startTime)
      const endDateObject = combineDateAndTimeToUTC(endDate,endTime)
  
      await prisma.carAvailability.update({
        where:{
           id:params.availabilityId,
           carId:params.carId
        },
        data: {
        ...rest,
         
       
         startDate:startDateObject,
         endDate:endDateObject
        },
      });
  
      return  NextResponse.json({success:true},{status:201});
    } catch (error) {
      let message = "Something went wrong";
      if (error instanceof CustomError) {
        message = error.message;
      }
      console.log(error);
      return NextResponse.json({success:false,error:message});
    }
  
}


export const DELETE = async (req:Request,{params}:{params:{carId:string,availabilityId:string}})=>{

  try {
    const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests
  
    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
      throw new CustomError("Unauthorized request");
    }

    if (!params.carId) throw new CustomError("Car Id is required");
    if (!params.availabilityId) throw new CustomError("availability Id Id is required");


    const authHeader = req.headers.get("Authorization");
  
    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new CustomError("Not Authorized");
    const token = authHeader.split(" ")[1];
  
      const decoded = verifyToken(token);
  
      if (!decoded) throw new CustomError("Not Authorized");


      // check if company's email changed to make a logout
    const toLogOut = await logOut(decoded.email)
    if(!!toLogOut) return NextResponse.json({success:false,logout:true},{status:200})
      const availability = await prisma.carAvailability.findUnique({
where:{
  id:params.availabilityId,
  
},
select:{
  car:{
    select:{
      company:{
        select:{
          email:true
        }
      }
    }
  }
}
      })


      if(availability?.car.company.email !== decoded.email) throw new CustomError("Unauthorized")

      await prisma.carAvailability.delete({
        where:{
          id:params.availabilityId
        }
      })

      return NextResponse.json({success:true,message:"Successfully deleted"},{status:200})


    
  } catch (error) {
    let message = "Something went wrong";
    if (error instanceof CustomError) {
      message = error.message;
    }
    console.log(error);
    return NextResponse.json({success:false,error:message});
  }


}