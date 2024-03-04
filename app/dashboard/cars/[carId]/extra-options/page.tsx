import ExtraOptionsFeed from "@/components/(extra options)/extra-options-feed";
import GoBackButton from "@/components/go-back-button";
import Heading from "@/components/heading";
import NavigatorButton from "@/components/navigator-button";
import prisma from "@/lib/prisma";
import { getCompany } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = { params: { carId: string } };

export const revalidate = 0;

const page = async ({ params }: Props) => {
  const company = await getCompany();
  const car = await prisma.car.findUnique({
    where: {
      id: params.carId,
      companyId: company?.id,
    },
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
  });
  return (
    <div>
      <div className="flex md:justify-between md:flex-row flex-col gap-3 w-full">
        <div className="flex items-center gap-2">
          <GoBackButton url="/dashboard/cars" />
          <Heading
            title={`${car?.carModel.carBrand.brand} ${car?.carModel.name} - Extra options`}
            description={"Create extra options"}
          />
        </div>

        <Link
          className="flex items-center justify-center text-white bg-black px-4 py-3 shrink-0 w-full md:w-fit  self-start rounded-lg"
          href={`/dashboard/cars/${params.carId}/extra-options/new`}
        >
          <Plus className="mr-2 h-3 w-3" /> Create extra option
        </Link>
      </div>

      <div className="mt-12">
        <ExtraOptionsFeed carId={params.carId} />
      </div>
    </div>
  );
};

export default page;
