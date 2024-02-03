import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {  carExtraOptionsSchema } from "@/schemas";


import { toast } from "sonner";

import {  CarExtraOption } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { useLogo } from "./logo.hook";
import { addCarExtraOptions, editCarExtraOption } from "@/actions/car-extraOptions-actions";

export const useCarExtraOptions = (carExtraOption:CarExtraOption | null) => {




  

  const form = useForm<z.infer<typeof carExtraOptionsSchema>>({
    resolver: zodResolver(carExtraOptionsSchema),
    defaultValues: {
      label: carExtraOption?.label || "",
      description:carExtraOption?.description || "",
      price:carExtraOption?.price || undefined,
    
      logo:carExtraOption?.logo || "",

   
    },
  });



  const router = useRouter();
  const params = useParams();
 

  async function onSubmit(values: z.infer<typeof carExtraOptionsSchema>) {
    try {
      let res;
      if (carExtraOption) {
        res = await editCarExtraOption(
          values,
          carExtraOption.id,
          params.carId as string
        );
      } else {
        res = await addCarExtraOptions(values, params.carId as string);
      }
      if (res.error) {
        toast.error(res.error);
      } else {
        router.refresh();
        router.push(`/dashboard/cars/${params.carId}/extra-options`)
        toast.success(res.success);
    
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  }

  const {ImagePlaceholder,file,setFile,uploadImage} = useLogo({form})



  return {
    form,
    onSubmit,
    file,
    setFile,uploadImage,ImagePlaceholder

   
  };
};
