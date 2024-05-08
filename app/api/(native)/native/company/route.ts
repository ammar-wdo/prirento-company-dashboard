import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { areIdsValid, logOut, verifyToken } from "@/lib/utils";
import { carSchema, companySchema } from "@/schemas";
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

    // check if company's email changed to make a logout
    const toLogOut = await logOut(decoded.email)
    if(!!toLogOut) return NextResponse.json({success:false,logout:true},{status:200})

const company = await prisma.company.findUnique({
    where:{
        email:decoded.email
    }
})

if(!company) throw new CustomError("company does not exist")
    return  NextResponse.json({success:true,company},{status:201});
  } catch (error) {
    let message = "Something went wrong";
    if (error instanceof CustomError) {
      message = error.message;
    }
    console.log(error);
    return NextResponse.json({success:false,message});
  }


}


export const POST = async (req:Request)=>{


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

    // check if company's email changed to make a logout
    const toLogOut = await logOut(decoded.email)
    if(!!toLogOut) return NextResponse.json({success:false,logout:true},{status:200})

    const data = await req.json()

    const validData = companySchema.safeParse(data);
    if (!validData.success) throw new CustomError('Invalid inputs');



    const setPushNotificationToNull = decoded.email !== validData.data.email
    


    const updatedCompany = await prisma.company.update({
      where: {
        email:decoded.email,
      },
      data: {
     ...validData.data,
     email:validData.data.email.toLocaleLowerCase(),
     ...(!!setPushNotificationToNull && {pushNotificationToken:null})

      },
    });

    if(decoded.email !== updatedCompany.email)
 {  return NextResponse.json({success:true,logout:true},{status:201})}

   return NextResponse.json({success:true,logout:false},{status:201})
  } catch (error) {
    let message = "Something went wrong";
    if (error instanceof CustomError) {
      message = error.message;
    }
    console.log(error);
    return NextResponse.json({success:false,error:message},{status:200});
  }
}