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
  return <Button className="w-full" onClick={signOutHandler}><LogOut className="mr-3 h-4 w-4" />Logout </Button>;
};

export default SignoutButton;
