import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

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
