"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { companySchema } from "@/schemas";
import { getServerSession } from "next-auth";

import { checkEmail, hashPassword, newPasswordCheck } from "@/lib/utils";
import { CustomError } from "@/costum-error";



























export const editCompany = async (data: any, id: string) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };

    if (!id || typeof id !== "string") return { error: "Invalid Id " };

    const validData = companySchema.safeParse(data);
    if (!validData.success) return { error: "Invalid inputs" };
    
    await checkEmail(validData.data.email,'company',id)

    const { newPassword, password, ...rest } = validData.data;

    const thePassword = await newPasswordCheck(newPassword,password)

    const firstEmail = await prisma.company.findUnique({
      where:{
        id
      }
    }).then(data=>data?.email)



    const updatedCompany = await prisma.company.update({
      where: {
        id,
      },
      data: {
     ...rest,
     email:rest.email.toLocaleLowerCase(),
     password:thePassword,
     ...(firstEmail !== rest.email && {pushNotificationToken:null})
      },
    });

    if(firstEmail !== updatedCompany.email)
    return {logOut:'Successfully updated'}

    return { success: "Successfully updated" };
  } catch (error) {
    let message = "Something went wrong";
    if (error instanceof CustomError) {
      message = error.message;
    }
    console.log(error);
    return { error: message };
  }
};












