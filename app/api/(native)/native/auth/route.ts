import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { comparePasswords, signToken } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";



const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  });
export const revalidate = 0;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}



export const POST = async(req:Request)=>{
    try {

        const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests

        if (!apiSecret || apiSecret !== process.env.API_SECRET) {
          throw new CustomError("Unauthorized request");
        }

        const body = await req.json()
     

        const validData = loginSchema.safeParse(body)
        if(!validData.success)  throw new CustomError("Invalid inputs");
        const {email,password} = validData.data

      

        const company = await prisma.company.findUnique({
            where:{
               email:email.toLowerCase()
            }
        })
        console.log('company',company?.name)

        if(!company) throw new CustomError("Invalid credentials")


        

          const passwordMatch = await comparePasswords(password, company.password);
          console.log('match',passwordMatch)

          if (!passwordMatch) throw new CustomError("Invalid credentials")

   


        const token = signToken({email:company.email})

        const user = {
            email:company.email,
            logo:company.logo,
            name:company.name,
            token,
            pushToken:company.pushNotificationToken
        }

        console.log(token)

        return NextResponse.json({success:true,user},{status:200})
        
    } catch (error) {
        let message = 'Internal server error'

        if(error instanceof CustomError)message = error.message

        return NextResponse.json({success:false,error:message},{status:200})
    }
}