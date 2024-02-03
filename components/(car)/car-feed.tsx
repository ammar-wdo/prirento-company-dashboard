import { getCompanyEmail } from "@/lib/utils";

import React from "react";
import NoResult from "../no-result";
import prisma from "@/lib/prisma";
import CarCard from "./car-card";

type Props = {};

const CarFeed = async (props: Props) => {
  const email = await getCompanyEmail();

  const cars = await prisma.car.findMany({
    where: {
      company: {
        email: email as string,
      },
    },
    orderBy: {
      createdAt: "desc",
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
      {!cars.length && <NoResult title="No cars" />}
      {!!cars.length && (
        <div className="flex gap-1 2xl:flex-wrap w-full overflow-x-auto">
          {cars.map((car) => (
           <CarCard key={car?.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarFeed;
