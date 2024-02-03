"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { getCompany } from "@/lib/utils";

import { carExtraOptionsSchema  } from "@/schemas";
import { getServerSession } from "next-auth";

export const addCarExtraOptions = async (data: any,carId:string) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };

    if(!carId || typeof carId !== 'string') return {error:'car ID is required'}
    const company = await getCompany()
    const car = await prisma.car.findUnique({
      where:{
        id:carId,
        companyId:company?.id
      }
    })

    if(! company || !car) return {error:'Unauthorized'}

    const validData = carExtraOptionsSchema.safeParse(data);
    if (!validData.success) return { error: "Invalid inputs" };



    const carExist = await prisma.car.findUnique({
      where:{
        id:carId,
        
      },select:{id:true}
    })
    if(!carExist) return {error:'Car does not exist'}


 

    await prisma.carExtraOption.create({
      data: {
     ...validData.data,
      carId,
 
    
      },
    });

    return { success: "Successfully added" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};

export const editCarExtraOption = async (data: any,id:string, carId: string) => {

    try {
      const session = await getServerSession(authOptions);
      if (!session) return { error: "Unauthorized" };
  
      if(!id || typeof id !== 'string') return {error:'Extra option  ID is required'}
      if(!carId || typeof carId !== 'string') return {error:'car ID is required'}

      const company = await getCompany()
      const car = await prisma.car.findUnique({
        where:{
          id:carId,
          companyId:company?.id
        }
      })
  
      if(! company || !car) return {error:'Unauthorized'}
  
      const validData = carExtraOptionsSchema.safeParse(data);
      if (!validData.success) return { error: "Invalid inputs" };

      const carExist = await prisma.car.findUnique({
        where:{
          id:carId
        },select:{id:true}
      })
      if(!carExist) return {error:'Car does not exist'}

  
      await prisma.carExtraOption.update({
        where:{
            id,
            carId
        },
        data: {
       ...validData.data
         
       
    
        },
      });
  
      return { success: "Successfully updated" };
    } catch (error) {
      console.log(error);
      return { error: "Something went wrong" };
    }
  };


export const deleteCarExtraOption = async (id: string) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };

    if (!id || typeof id !== "string") return { error: "Invalid Id " };

   

    await prisma.carExtraOption.delete({
      where: {
        id,
      },
    
    });

    return { success: "Successfully deleted" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};
