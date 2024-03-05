import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export const revalidate = 0
//fetch  all companys for seo

export const GET = async (
  req: Request,

) => {
  try {
    const apiSecret = req.headers.get("api-Secret");

    if (!apiSecret || apiSecret !== process.env.API_SECRET)
      throw new CustomError("Unauthorized");


  

    const companies = await prisma.company.findMany({
    
      select:{
        id:true,
      slug:true
      }
    
    });


return NextResponse.json({success:true,companies},{status:200})





  } catch (error) {
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;
    return NextResponse.json(
      { success: false, error: message, company: null },
      { status: 200 }
    );
  }
};
