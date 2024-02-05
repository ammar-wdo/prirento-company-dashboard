import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { companySchema } from "@/schemas";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Category, Company } from "@prisma/client";
import { useLogo } from "./logo.hook";
import { useGallary } from "./gallary.hook";
import { editCompany } from "@/actions/company-actions";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

type Props = {
  company: Company;
};

type DayOpeningTimes = {
  openTime: string;
  closeTime: string;
  closed: boolean;
}

// Define the overall structure for the default opening times
type OpeningTimes ={
  [key: string]: DayOpeningTimes;
}

// Define the structure for the dropdown status state
type DropdownStatus= {
  [day: string]: {
    openTimeDropdown: boolean;
    closeTimeDropdown: boolean;
  };
}

export type Day = "Monday"|"Tuesday"|"Wednesday"|"Thursday"|"Friday"|"Saturday"|"Saturday"

export const useCompany = ({ company }: Props) => {
  const router = useRouter();
  const [logOut, setLogOut] = useState(false)
  

  const defaultOpeningTimes ={
    "Monday": { "openTime": "09:00", "closeTime": "17:00", "closed": false },
    "Tuesday": { "openTime": "09:00", "closeTime": "17:00", "closed": false },
    "Wednesday": { "openTime": "09:00", "closeTime": "17:00", "closed": false },
    "Thursday": { "openTime": "09:00", "closeTime": "17:00", "closed": false },
    "Friday": { "openTime": "09:00", "closeTime": "17:00", "closed": false },
    "Saturday": { "openTime": "09:00", "closeTime": "17:00", "closed": false },
    "Sunday": { "openTime": "09:00", "closeTime": "17:00", "closed": false }
  }

  const [dropdownStatus, setDropdownStatus] = useState<DropdownStatus>(
    Object.keys(defaultOpeningTimes).reduce((acc, day) => ({
      ...acc,
      [day]: { openTimeDropdown: false, closeTimeDropdown: false }
    }), {} as DropdownStatus) // Type assertion for the initial state
  );

  const toggleDropdown = (day: string, dropdownType: 'openTimeDropdown' | 'closeTimeDropdown') => {
    setDropdownStatus(prevState => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        [dropdownType]: !prevState[day][dropdownType]
      }
    }));
  };


  type OpeneingsTime = typeof defaultOpeningTimes
 

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      email: company?.email || "",
      password: company?.password || "",
      newPassword: "",
      address: company?.address || "",
      phoneNumber: company?.phoneNumber || "",
      whatsApp: company?.whatsApp || "",
      logo: company?.logo || "",
      gallary: company?.gallary || [],

      openingTime: company?.openingTime as unknown as OpeneingsTime  || defaultOpeningTimes,
    },
  });

  async function onSubmit(values: z.infer<typeof companySchema>) {
    try {
      const res = await editCompany(values, company.id);

      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);

        router.refresh();
      } else if (res.logOut) {
        toast.success(res.logOut)
     setLogOut(true)
        setTimeout(async()=>{
            await signOut();
            router.refresh();
         
        },7000)
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  const { ImagePlaceholder, file, setFile, uploadImage } = useLogo({ form });
  const {
    ImagesPlaceholder,

    deleteanImage,
    imagesFile,

    setImagesFile,
    uploadImages,
  } = useGallary({ form });


   const generateTimeSlots = (stepMinutes = 15) => {
    const slots = [];
    const totalMinutes = 24 * 60;
    for (let minute = 0; minute < totalMinutes; minute += stepMinutes) {
      const hours = Math.floor(minute / 60);
      const minutes = minute % 60;
      slots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    }
    return slots;
  }


  const setter = (day:Day,type:'openTime' | 'closeTime',value:string)=>{

   form.setValue(`openingTime.${day}.${type}`,value)

  }

  return {
    form,
    onSubmit,
    file,
    setFile,
    uploadImage,
    ImagePlaceholder,
    imagesFile,
    setImagesFile,
    ImagesPlaceholder,
    uploadImages,
    logOut,
    generateTimeSlots,
    dropdownStatus,
    toggleDropdown,
    setter
  };
};
