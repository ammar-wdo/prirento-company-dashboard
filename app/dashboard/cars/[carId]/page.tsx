

import Heading from "@/components/heading";
import prisma from "@/lib/prisma";
import { getCompanyEmail } from "@/lib/utils";

import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: { carId: string };
};

const page = async ({ params }: Props) => {
  const email =await getCompanyEmail()

  const car = await prisma.car.findUnique({
    where: {
      id: params.carId,
      company: {
        email: email as string,
      },
    },include:{
      carModel:{
        include:{
          carBrand:{
            select:{
              brand:true
            }
          }
        }
      }
    }
  });

  if (!car && params.carId !== "new") notFound();

  return <div>
    <Heading title={`${car?.carModel.carBrand.brand} ${car?.carModel.name}`} description="Update your car informations" />
  </div>;
};

export default page;
