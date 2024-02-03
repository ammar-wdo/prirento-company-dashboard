'use server'
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { carPricingsSchema } from "@/schemas";
import { getServerSession } from "next-auth";

export const addPricings = async(data:any,id:string)=>{

    try {

        const session = await getServerSession(authOptions);
        if (!session) return { error: "Unauthorized" };
    
        const validData = carPricingsSchema.safeParse(data);
        if (!validData.success) return { error: "Invalid inputs" };

        if(!id || typeof id !=='string') return {error:'Car ID is required'}
    
        await prisma.car.update({
        where:{
            id
        },data:{
            ...validData.data
        }
        });
    
        return { success: "Successfully added" };
      } catch (error) {
        console.log(error);
        return { error: "Something went wrong" };
      }
    };