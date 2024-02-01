import { loginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });


  const router = useRouter()

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setLoading(true);
      setError(false);
      const res = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });
      if (!res?.ok) {
        setError(true);
      }else{
router.push('/dashboard')
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }


  return {onSubmit,error,loading,form}
};

