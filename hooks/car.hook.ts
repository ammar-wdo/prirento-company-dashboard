import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";



import { carSchema } from "@/schemas";

import { Car } from "@prisma/client";
import { useGallary } from "./gallary.hook";
import { addCar, editCar } from "@/actions/car-actions";
import { toast } from "sonner";
import { useState } from "react";



export const useCar = (
  car:
    | (Car & {
        pickupLocations: { id: string }[];
        dropoffLocations: { id: string }[];
   
      })
    | null
) => {

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const router = useRouter();
  const usedPickups = car?.pickupLocations.map((el) => el.id);
  const usedDropoffs = car?.dropoffLocations.map((el) => el.id);


  const form = useForm<z.infer<typeof carSchema>>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      additionalFeatures: (car?.additionalFeatures || []) as {
        title: string;
        icon: string;
      }[],
      carModelId: car?.carModelId || "",
   
      carType: car?.carType || 'SUV',
      colors: car?.colors || 'Beige',
    
   
  
      coolDown: car?.coolDown || undefined,
      deleviryFee: car?.deleviryFee || undefined,
      deposite: car?.deposite || undefined,
      description: car?.description || "",
      disabled: car?.disabled || false,
      doors: car?.doors || undefined,
      electric: car?.electric || "fully_electric",
      engine: car?.engine || "",
      gallary: car?.gallary || [],
      interiorColor: car?.interiorColor || "Beige",
      kmIncluded: car?.kmIncluded || undefined,
      minimumHours: car?.minimumHours || undefined,
   
 
      seats: car?.seats || undefined,
      transmition: car?.transmition || "auto",
      year: car?.year || "",
      pickupLocations: usedPickups || [],
      dropoffLocations: usedDropoffs || [],
   
    },
  });

  const { ImagesPlaceholder, imagesFile, setImagesFile, uploadImages } =
    useGallary({ form });

  async function onSubmit(values: z.infer<typeof carSchema>) {
    try {
      let res;
      if (car) {
        res = await editCar(values, car.id);
      } else {
        res = await addCar(values);
      }

      if (res.error) {
        console.log(res.error);
        toast.error(res.error);
      } else {
        router.push("/dashboard/cars");
        router.refresh();
        toast.success(res.success);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }



  return {
    form,
    onSubmit,
    ImagesPlaceholder,
    imagesFile,
    setImagesFile,
    uploadImages,
    open,
    value,
    setOpen,
    setValue
  };
};
