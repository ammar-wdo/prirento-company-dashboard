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
import { useState } from "react";

type Props = {
  company: Company;
};

export const useCompany = ({ company }: Props) => {
  const router = useRouter();
  const [logOut, setLogOut] = useState(false)

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

      openingTime: company?.openingTime || [],
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
    logOut
  };
};
