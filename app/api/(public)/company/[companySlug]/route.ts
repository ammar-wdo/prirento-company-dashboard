import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { companySlug: string } }
) => {
  try {
    const apiSecret = req.headers.get("api-Secret");

    if (!apiSecret || apiSecret !== process.env.API_SECRET)
      throw new CustomError("Unauthorized");

    if (!params.companySlug) throw new CustomError("Company slug is required");
  

    const company = await prisma.company.findUnique({
      where: {
        slug: params.companySlug,
      },
      select:{
        id:true,
        name:true,
        content:true,
        openingTime:true, 
      }
    
    });


return NextResponse.json({success:true,company},{status:200})





  } catch (error) {
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;
    return NextResponse.json(
      { success: false, error: message, company: null },
      { status: 200 }
    );
  }
};
