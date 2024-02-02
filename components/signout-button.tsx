"use client";

import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

type Props = {};

const SignoutButton = (props: Props) => {
  const router = useRouter();
  const signOutHandler = async () => {
    await signOut();
    router.refresh();
  };
  return <Button className="w-full bg-white rounded-xl text-main hover:bg-white/90 hover:text-main" onClick={signOutHandler}><LogOut className="mr-3 h-4 w-4 text-main" />Logout </Button>;
};

export default SignoutButton;
