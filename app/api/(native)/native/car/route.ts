import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { areIdsValid, verifyToken } from "@/lib/utils";
import { carSchema } from "@/schemas";
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

) => {

  try {
    const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests

    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
      throw new CustomError("Unauthorized request");
    }



    const authHeader = req.headers.get("Authorization");
    console.log("header", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new CustomError("Not Authorized");

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    if (!decoded) throw new CustomError("Not Authorized");

const data = await req.json()
    const validData = carSchema.safeParse(data);
    if (!validData.success) throw new CustomError('Invalid inputs');

    const {
      pickupLocations,
      dropoffLocations,
     
      ...rest
    } = validData.data;

const company = await prisma.company.findUnique({
    where:{
        email:decoded.email
    }
})

if(!company) throw new CustomError("Unauthorized")

    const car = await prisma.car.create({
      data:{
     ...rest,
     companyId:company.id,
     pickupLocations: { connect: pickupLocations.map((id) => ({ id })) },
     dropoffLocations: { connect: dropoffLocations.map((id) => ({ id })) },

       
      }
    })

    if(!car) throw new CustomError('Unauthorized')

    await Promise.all([
      areIdsValid(pickupLocations, "location"),
      areIdsValid(dropoffLocations, "location"),
     
     
    
    ])





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