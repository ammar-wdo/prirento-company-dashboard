import { getCompanyEmail } from "@/lib/utils";

import React from "react";
import NoResult from "../no-result";
import prisma from "@/lib/prisma";
import CarCard from "./car-card";
import CarClientFilter from "./car-client-filter";

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
   
    
       <CarClientFilter cars={cars}/>

    </div>
  );
};

export default CarFeed;
