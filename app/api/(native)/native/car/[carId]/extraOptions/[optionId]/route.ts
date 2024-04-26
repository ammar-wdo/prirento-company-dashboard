import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { areIdsValid, verifyToken } from "@/lib/utils";
import { carExtraOptionsSchema, carSchema } from "@/schemas";
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
  { params }: { params: { carId: string ,optionId:string} }
) => {

  try {
    const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests

    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
      throw new CustomError("Unauthorized request");
    }

    if (!params.carId) throw new CustomError("Car Id is required");
    if (!params.optionId) throw new CustomError("Option Id Id is required");

    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new CustomError("Not Authorized");

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    if (!decoded) throw new CustomError("Not Authorized");






    const extraOption = await prisma.carExtraOption.findUnique({
      where:{

      id:params.optionId,
      car:{
        company:{
            email:decoded.email
        }
      }
       
      }
    })

    return  NextResponse.json({success:true,extraOption},{status:201});
  } catch (error) {
    let message = "Something went wrong";
    if (error instanceof CustomError) {
      message = error.message;
    }
    console.log(error);
    return NextResponse.json({success:false,error:message});
  }


}




export const POST = async (
    req: Request,
    { params }: { params: { carId: string ,optionId:string} }
  ) => {
  
    try {
      const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests
  
      if (!apiSecret || apiSecret !== process.env.API_SECRET) {
        throw new CustomError("Unauthorized request");
      }
  
      if (!params.carId) throw new CustomError("Car Id is required");
      if (!params.optionId) throw new CustomError("Option Id Id is required");

  
  
      const authHeader = req.headers.get("Authorization");
  
      if (!authHeader || !authHeader.startsWith("Bearer "))
        throw new CustomError("Not Authorized");
  
      const token = authHeader.split(" ")[1];
  
      const decoded = verifyToken(token);
  
      if (!decoded) throw new CustomError("Not Authorized");
  
  
      const body = await req.json()

      const validData = carExtraOptionsSchema.safeParse(body)

      if(!validData.success) throw new CustomError("Invalid Inputs")
  
  
  
      const extraOption = await prisma.carExtraOption.update({
        where:{
  
        id:params.optionId,
        car:{
          company:{
              email:decoded.email
          }
        }
         
        },data:{
            ...validData.data,
            status:'pending'
        }
      })
  
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



export const DELETE = async (req:Request,{params}:{params:{carId:string,optionId:string}})=>{

  try {
    const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests
  
    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
      throw new CustomError("Unauthorized request");
    }

    if (!params.carId) throw new CustomError("Car Id is required");
    if (!params.optionId) throw new CustomError("availability Id Id is required");


    const authHeader = req.headers.get("Authorization");
  
    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new CustomError("Not Authorized");
    const token = authHeader.split(" ")[1];
  
      const decoded = verifyToken(token);
  
      if (!decoded) throw new CustomError("Not Authorized");

      const option = await prisma.carExtraOption.findUnique({
where:{
  id:params.optionId,
  
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


      if(option?.car.company.email !== decoded.email) throw new CustomError("Unauthorized")

      await prisma.carAvailability.delete({
        where:{
          id:params.optionId
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