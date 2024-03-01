import CarExtraOptionsForm from "@/components/(extra options)/carExtraOptions-form";
import GoBackButton from "@/components/go-back-button";
import Heading from "@/components/heading";
import prisma from "@/lib/prisma";
import { getCompany } from "@/lib/utils";
import { notFound } from "next/navigation";
import React from "react";

type Props = { params: { extraOptionId: string; carId: string } };

const page = async ({ params }: Props) => {
  const company = await getCompany();
  const extraOption = await prisma.carExtraOption.findUnique({
    where: {
      id: params.extraOptionId,
      car: {
        id: params.carId,
        companyId: company?.id,
      },
    },
    include: {
      car: {
        include: {
          carModel: {
            include: {
              carBrand: {
                select: {
                  brand: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!extraOption && params.extraOptionId !== "new") notFound();
  return (
    <div>
      <div className="flex items-center gap-2">
      <GoBackButton  />
      <Heading
        title={
          extraOption
            ? `${extraOption.car.carModel.carBrand.brand} ${extraOption.car.carModel.name} - Extra options`
            : "Extra options"
        }
        description={
          extraOption ? `Update ${extraOption.label} extra option` : "Create extra options"
        }
      />
  

      </div>
    

      <div className="mt-12 bg-white p-4 border rounded-md max-w-5xl">
        <CarExtraOptionsForm extraOption={extraOption}/>
      </div>
    </div>
  );
};

export default page;
