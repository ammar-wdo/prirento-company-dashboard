import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { areIdsValid, comparePasswords, hashPassword, logOut, verifyToken } from "@/lib/utils";
import { carSchema, companySchema, passwordSchema } from "@/schemas";
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





export const POST = async (req:Request)=>{


    try{
    const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests

    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
      throw new CustomError("Unauthorized request");
    }



    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new CustomError("Not Authorized");

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    if (!decoded) throw new CustomError("Not Authorized");

    // check if company's email changed to make a logout
    const toLogOut = await logOut(decoded.email)
    if(!!toLogOut) return NextResponse.json({success:false,logout:true},{status:200})

    const data = await req.json()

    const validData = passwordSchema.safeParse(data);
    if (!validData.success) throw new CustomError('Invalid inputs');
    


    const company = await prisma.company.findUnique({
      where: {
        email:decoded.email,
      },
  
    });

  if(!company) throw new CustomError('Company does not exist')


  const identicalPasswords = await comparePasswords(validData.data.password,company.password)

  if(!identicalPasswords) throw new CustomError("Password is not correct")


const newPassword = await hashPassword(validData.data.newPassword)


await prisma.company.update({
    where:{
        email:decoded.email
    },
    data:{
        password:newPassword
    }
})

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