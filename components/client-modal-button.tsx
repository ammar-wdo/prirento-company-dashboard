"use client";

import React from "react";
import { Button } from "./ui/button";

import { cn } from "@/lib/utils";
import { ModalInputs, useModal } from "@/hooks/modal.hook";

type Props = {
  children: React.ReactNode;
  modalInputs: ModalInputs;
  small?: boolean;
  destructive?: boolean;
  type?:'submit'|'button'
  

} & React.HtmlHTMLAttributes<HTMLButtonElement>

const ClientModalButton = ({
  children,
type,
  small,
  destructive,
  modalInputs,
  className,
  ...rest
}: Props) => {
  const { setOpen } = useModal();
  return (
    <Button
  type={type}
      className={cn(className || "")}
      variant={destructive ? "destructive" : "default"}
      size={small ? "sm" : "default"}
      onClick={() => setOpen(modalInputs)}
    >
      {children}
    </Button>
  );
};

export default ClientModalButton;
