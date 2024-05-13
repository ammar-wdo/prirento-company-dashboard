import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { areIdsValid, logOut, verifyToken } from "@/lib/utils";
import { carSchema, companySchema } from "@/schemas";
import { NextResponse } from "next/server";

export const revalidate = 0;







export const GET = async (req:Request)=>{


    try{
      
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




    


    const updatedCompany = await prisma.company.update({
      where: {
        email:decoded.email,
      },
      data: {
  pushNotificationToken:null

      },
    });

  


   return NextResponse.json({success:true},{status:201})
  } catch (error) {
    let message = "Something went wrong";
    if (error instanceof CustomError) {
      message = error.message;
    }
    console.log(error);
    return NextResponse.json({success:false,error:message},{status:200});
  }
}