import prisma from "@/lib/prisma";
import { comparePasswords } from "@/lib/utils";
import { Company } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";





export const authOptions = {
pages:{
  signIn:'/'
},
session:{
  strategy:'jwt'
},
    providers: [
        CredentialsProvider({
     
            name: "Credentials",
           
            credentials: {
              email: { label: "Username", type: "text", },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const email = credentials?.email
                const password = credentials?.password
                if(!email || !password) throw new Error('Enter all required fields')

              const company = await prisma.company.findUnique({
                where:{
                    email
                },include:{
                    category:{select:{name:true}}
                }
              })


              if(!company) return null

              const passwordMatch = await comparePasswords(password, company.password);

              if (!passwordMatch) return null;

              console.log(company.category.name)

            return {email:company.email,name:company.category.name,id:company.id}

     


            


             

             


           
            
             
            }
          })
     
    ],
  } satisfies NextAuthOptions