

import CarForm from "@/components/(car)/car-form";
import GoBackButton from "@/components/go-back-button";
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

  const carRes =  prisma.car.findUnique({
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
      },
      pickupLocations: { select: { id: true } },
      dropoffLocations: { select: { id: true } },
    }
  });
  const modelsRes = prisma.carModel.findMany({include:{carBrand:{select:{logo:true,brand:true}}}})
  const locationsRes = prisma.location.findMany();

  const [car,locations,models] = await Promise.all([carRes,locationsRes,modelsRes])

  if (!car && params.carId !== "new") notFound();

  return <div>
      <div className="flex md:justify-between md:flex-row flex-col gap-3 w-full">
      <Heading title={car ?  `${car?.carModel.carBrand.brand} ${car?.carModel.name}` : 'Car'} description={car ? 'Update your car' : 'Create new car'} />
    <GoBackButton url='/dashboard/cars'/>
    </div>

    <div className="mt-16 max-w-5xl">
      <CarForm car={car} locations={locations}  models={models}/>
      </div>

  </div>;
};

export default page;
