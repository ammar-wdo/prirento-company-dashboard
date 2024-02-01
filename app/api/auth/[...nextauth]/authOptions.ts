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
              username: { label: "Username", type: "text", },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
           
            if(credentials?.username==='admin' && credentials.password==='adminpassword') return {id:'admin',email:'',name:'admin'}
        
              else {
             
                return null
        
              }
            }
          })
     
    ],
  } satisfies NextAuthOptions