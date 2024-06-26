import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { logOut, verifyToken } from "@/lib/utils";
import { NextResponse } from "next/server";


export const revalidate = 0

export const GET = async (
    req: Request,
  
  ) => {
  
    try {
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