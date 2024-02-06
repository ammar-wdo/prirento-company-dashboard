import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function comparePasswords(plainPassword:string, hashedPassword:string) {
  try {
    const passwordMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return passwordMatch;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
}


export const getCompanyEmail = async()=>{
  const email = await getServerSession(authOptions).then(
    (data) => data?.user?.email
  );

  return email
}

export const getCompany = async()=>{
  const session = await getServerSession(authOptions)
  const company = await prisma.company.findUnique({
    where:{
      email:session?.user?.email as string
    }
  })

  if(!company) return null

  return company
}


export async function areIdsValid(
  ids: string[],
  model: "location" | "subLocation"
) {
  let count = 0;

  if (model === "location") {
    count = await prisma.location.count({
      where: {
        id: { in: ids },
      },
    });
  } else if (model === "subLocation") {
    count = await prisma.subLocation.count({
      where: {
        id: { in: ids },
      },
    });
  }
  if (count !== ids.length) {
    throw new Error(`${model} IDs are not valid`);
  }
}

export async function isIdValid(id: string, model: "company") {
  if (model === "company") {
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
      throw new Error("Company ID is invalid");
    }
  }
}


export const checkSlug = async (
  slug: string,
  model: "company" | "car",
  id?: string
) => {
  if (model === "car") {
    const car = await prisma.car.findUnique({
      where: { slug, ...(id && { NOT: { id } }) },
    });
    if (car) {
      throw new Error("Slug already exists");
    }
  }
  if (model === "company") {
    const company = await prisma.company.findUnique({
      where: { slug, ...(id && { NOT: { id } }) },
    });
    if (company) {
      throw new Error("Slug already exists");
    }
  }
};

export const checkEmail = async (
  email: string,
  model: "company",
  id?: string
) => {
  if (model === "company") {
    const company = await prisma.company.findUnique({
      where: {
        email: email,
        ...(id && { NOT: { id } }),
      },
    });

    if (company) {
      throw new Error("Email already exists");
    }
  }
};


export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};


export const newPasswordCheck = async(newPassword:string | undefined,password:string)=>{


  let thePassword;
    if (newPassword) {
      thePassword =  await hashPassword(newPassword);
    } else {
      thePassword = password;
    }

    return thePassword
}


export const generateTimeSlots = (stepMinutes = 15) => {
  const slots = [];
  const totalMinutes = 24 * 60;
  for (let minute = 0; minute < totalMinutes; minute += stepMinutes) {
    const hours = Math.floor(minute / 60);
    const minutes = minute % 60;
    slots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  }
  return slots;
}
