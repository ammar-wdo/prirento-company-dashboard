import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { areIdsValid, verifyToken } from "@/lib/utils";
import { carSchema } from "@/schemas";
import { NextResponse } from "next/server";

export const revalidate = 0;




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

    if(!extraOption) throw new CustomError('Unauthorized')

    

  




    return  NextResponse.json({success:true,extraOption},{status:201});
  } catch (error) {
    let message = "Something went wrong";
    if (error instanceof CustomError) {
      message = error.message;
    }
    console.log(error);
    return NextResponse.json({success:false,message});
  }


}