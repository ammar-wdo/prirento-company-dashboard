import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { logOut, verifyToken } from "@/lib/utils";
import { carPricingsSchema } from "@/schemas";
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
  { params }: { params: { carId: string } }
) => {

  try {
    const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests

    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
      throw new CustomError("Unauthorized request");
    }

    if (!params.carId) throw new CustomError("Car Id is required");

    const authHeader = req.headers.get("Authorization");
    console.log("header", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new CustomError("Not Authorized");

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    if (!decoded) throw new CustomError("Not Authorized");


// check if company's email changed to make a logout
const toLogOut = await logOut(decoded.email)
if(!!toLogOut) return NextResponse.json({success:false,logout:true},{status:200})


const data = await req.json()
    const validData = carPricingsSchema.safeParse(data);
    if (!validData.success) throw new CustomError('Invalid inputs');

  



    const car = await prisma.car.findUnique({
      where:{
        id:params.carId,
        company:{
            email:decoded.email
        }
      }
    })

    if(!car) throw new CustomError('Unauthorized')

  



    await prisma.car.update({
      where: {
        id:params.carId,
      },
      data: {
      ...validData.data
      },
    });

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