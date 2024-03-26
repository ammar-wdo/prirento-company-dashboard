"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { carPricingsSchema } from "@/schemas";
import { toast } from "sonner";
import { addPricings } from "@/actions/car-pricings-actions";
import { useRouter } from "next/navigation";

type Props = {
  pricings: number[];
  hourPrice: number | null;
  id: string;
};

export const usePricings = ({ pricings, hourPrice, id }: Props) => {
  const form = useForm<z.infer<typeof carPricingsSchema>>({
    resolver: zodResolver(carPricingsSchema),
    defaultValues: {
      pricings: pricings,
      hourPrice: hourPrice || undefined,
    },
  });

  useEffect(() => {
    if (pricings) {
      const requiredLength = 14;
      const arrayLength = form.getValues("pricings").length;

      if (arrayLength >= requiredLength) return;

      const remainigLength = requiredLength - arrayLength;
      const remainigArray = Array(remainigLength).fill(0);

      const newArray = [...form.getValues("pricings"), ...remainigArray];

      form.setValue("pricings", newArray);
    }
  }, [pricings]);

  const router = useRouter()

  async function onSubmit(values: z.infer<typeof carPricingsSchema>) {
    try {
      const res = await addPricings(values, id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success);
        router.refresh()
        router.back()

      }
    } catch (error) {
        console.log(error)
      toast.error("Something went wrong");
    }
  }

  const setValue = (el: number, i: number) => {
    const array = form.getValues("pricings");
    array[i] = el;
    form.setValue("pricings", array);
  };

  const addRow = () => {
    const array = form.getValues("pricings");
    const newArray = [...array, 0];
    form.setValue("pricings", newArray);
  };

   const deleteRow=(index:number)=>{
    const array = form.getValues('pricings')
    const newArray = array.filter((el,i)=>i!==index)
    form.setValue('pricings',newArray)

  }

  return { form, onSubmit, setValue, addRow ,deleteRow};
};
