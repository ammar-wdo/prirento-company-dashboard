import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/utils";
import { NextResponse } from "next/server";


export const revalidate = 0

export const GET = async (
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
  
      if (!authHeader || !authHeader.startsWith("Bearer "))
        throw new CustomError("Not Authorized");
  
      const token = authHeader.split(" ")[1];
  
      const decoded = verifyToken(token);
  
      if (!decoded) throw new CustomError("Not Authorized");
  
  
  
  
  
  
      const count = await prisma.notification.count({
        where:{
  
        company:{
          email:decoded.email
        },
        isRead:false
        
         
        }
      })
  
      return  NextResponse.json({success:true,count},{status:201});
    } catch (error) {
      let message = "Something went wrong";
      if (error instanceof CustomError) {
        message = error.message;
      }
      console.log(error);
      return NextResponse.json({success:false,error:message});
    }
  
  
  }