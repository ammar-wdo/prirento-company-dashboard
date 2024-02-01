"use client";

import { useLogin } from "@/hooks/login.hook";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ActionLoaderButton from "../action-loader-button";


type Props = {};

const LoginForm = (props: Props) => {
  const { onSubmit, error, loading, form } = useLogin();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-3 border rounded-md max-w-[400px] w-full">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passowrd</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <p className="py-2 text-sm text-rose-500">Invalid credentials</p>
        )}
        <ActionLoaderButton  isLoading={form.formState.isSubmitting}>
          Login
        </ActionLoaderButton>
      </form>
    </Form>
  );
};

export default LoginForm;
