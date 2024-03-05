import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export const revalidate = 0


export const GET = async (
  req: Request,

) => {
  try {
    const apiSecret = req.headers.get("api-Secret");

    if (!apiSecret || apiSecret !== process.env.API_SECRET)
      throw new CustomError("Unauthorized");


  

    const cars = await prisma.car.findMany({ 
    
      select:{
        id:true,
      slug:true,
      company:{
        select:{
            slug:true
        }
      }
      }
    
    });


return NextResponse.json({success:true,cars},{status:200})





  } catch (error) {
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;
    return NextResponse.json(
      { success: false, error: message, company: null },
      { status: 200 }
    );
  }
};
